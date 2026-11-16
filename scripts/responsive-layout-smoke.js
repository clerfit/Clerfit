'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const base = new URL(process.argv[2] || 'http://127.0.0.1:4173/');
const registrySource = fs.readFileSync(path.join(root, 'js', 'navigation.js'), 'utf8');
const registryMatch = registrySource.match(/const CALCULATORS = (\[[\s\S]*?\]);/);
assert.ok(registryMatch, 'Could not parse the active calculator registry.');
const registry = JSON.parse(registryMatch[1]);
assert.equal(registry.length, 164, 'Update this expectation only when the active registry changes.');

const viewports = [
  { name: 'mobile-landscape', width: 844, height: 390, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 820, height: 1180, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1440, height: 900, isMobile: false, hasTouch: false }
];
const concurrency = 8;
const failures = [];
const results = [];

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const tasks = registry.flatMap(route => viewports.map(viewport => ({ route, viewport })));
    let cursor = 0;
    const workers = Array.from({ length: concurrency }, async () => {
      while (cursor < tasks.length) {
        const task = tasks[cursor++];
        const { route, viewport } = task;
        const page = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
          isMobile: viewport.isMobile,
          hasTouch: viewport.hasTouch
        });
        page.setDefaultTimeout(5000);
        page.setDefaultNavigationTimeout(10000);
        const pageErrors = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        const url = new URL('html/' + route.file, base);
        try {
          const response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 10000 });
          if (!response || !response.ok()) {
            failures.push({ file: route.file, viewport: viewport.name, kind: 'load', detail: 'HTTP ' + (response ? response.status() : 'no response') });
            continue;
          }
          const layout = await page.evaluate(() => {
            const html = document.documentElement;
            const body = document.body;
            const main = document.querySelector('main');
            const controls = Array.from(document.querySelectorAll('main input, main select, main textarea, main button, main a, .main input, .main select, .main textarea, .main button, .main a'));
            const visibleControls = controls.filter(element => {
              const style = getComputedStyle(element);
              return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && element.getClientRects().length > 0;
            });
            const outside = visibleControls.filter(element => {
              const rect = element.getBoundingClientRect();
              return rect.left < -1 || rect.right > window.innerWidth + 1;
            }).slice(0, 8).map(element => ({
              tag: element.tagName.toLowerCase(),
              id: element.id || '',
              text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
              left: Math.round(element.getBoundingClientRect().left),
              right: Math.round(element.getBoundingClientRect().right)
            }));
            return {
              viewportWidth: window.innerWidth,
              documentWidth: html.scrollWidth,
              bodyWidth: body ? body.scrollWidth : 0,
              hasMainLandmark: Boolean(document.querySelector('main, [role="main"]')),
              lang: html.getAttribute('lang') || '',
              hasViewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
              controlsOutsideViewport: outside
            };
          });
          const record = { file: route.file, viewport: viewport.name, ...layout, pageErrors };
          results.push(record);
          if (Math.max(layout.documentWidth, layout.bodyWidth) > layout.viewportWidth + 1) {
            failures.push({ file: route.file, viewport: viewport.name, kind: 'horizontal-overflow', detail: 'document/body width exceeds viewport', metrics: layout });
          }
          if (!layout.hasMainLandmark) failures.push({ file: route.file, viewport: viewport.name, kind: 'missing-main-landmark', detail: 'No semantic main landmark.' });
          if (!layout.lang) failures.push({ file: route.file, viewport: viewport.name, kind: 'missing-lang', detail: 'html element has no lang attribute.' });
          if (!layout.hasViewportMeta) failures.push({ file: route.file, viewport: viewport.name, kind: 'missing-viewport-meta', detail: 'Viewport meta tag is missing.' });
          if (layout.controlsOutsideViewport.length) failures.push({ file: route.file, viewport: viewport.name, kind: 'control-clipping', detail: 'Visible main content controls extend outside the viewport.', sample: layout.controlsOutsideViewport });
          for (const error of pageErrors) failures.push({ file: route.file, viewport: viewport.name, kind: 'pageerror', detail: error });
        } catch (error) {
          failures.push({ file: route.file, viewport: viewport.name, kind: 'scan-error', detail: error && error.message ? error.message : String(error) });
        } finally {
          await page.close();
        }
      }
    });
    await Promise.all(workers);
  } finally {
    await browser.close();
  }

  const report = {
    checkedAt: new Date().toISOString(),
    base: base.href,
    routeCount: registry.length,
    viewportCount: viewports.length,
    totalChecks: results.length,
    viewports: viewports.map(({ name, width, height }) => ({ name, width, height })),
    failures,
    results
  };
  fs.writeFileSync(path.resolve('responsive-layout-report.json'), JSON.stringify(report, null, 2) + '\n');
  const summary = {
    status: failures.length ? 'FAIL' : 'PASS',
    routes: registry.length,
    viewports: viewports.length,
    checks: results.length,
    overflow: failures.filter(item => item.kind === 'horizontal-overflow').length,
    clippedControls: failures.filter(item => item.kind === 'control-clipping').length,
    missingLandmarks: failures.filter(item => item.kind === 'missing-main-landmark').length,
    missingLang: failures.filter(item => item.kind === 'missing-lang').length,
    missingViewportMeta: failures.filter(item => item.kind === 'missing-viewport-meta').length,
    pageErrors: failures.filter(item => item.kind === 'pageerror').length,
    failures: failures.length
  };
  console.log(JSON.stringify(summary, null, 2));
  assert.equal(failures.length, 0, 'Responsive layout failures:\n' + failures.slice(0, 40).map(item => item.file + ' [' + item.viewport + '] ' + item.kind + ': ' + item.detail).join('\n'));
})().catch(error => {
  console.error(error && error.stack || String(error));
  process.exitCode = 1;
});
