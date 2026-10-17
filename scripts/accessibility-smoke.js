#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const BASE = new URL(process.argv[2] || 'http://127.0.0.1:4173/');
const ROOT = path.resolve(__dirname, '..', 'dist');
const REPORT_PATH = process.env.CLERFIT_ACCESSIBILITY_REPORT || 'accessibility-smoke-report.json';
const CONCURRENCY = 4;
const SEVERITY = new Set(['critical', 'serious']);
const failures = [];
const results = [];

function listHtml(directory, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const rel = prefix ? path.posix.join(prefix, entry.name) : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listHtml(absolute, rel));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(rel);
  }
  return files;
}

function metaRefresh(html) {
  const tag = html.match(/<meta\\b[^>]*http-equiv\\s*=\\s*(['"])refresh\\1[^>]*>/i);
  if (!tag) return null;
  const content = tag[0].match(/\\bcontent\\s*=\\s*(['"])(.*?)\\1/i);
  const target = content && content[2].match(/^\\s*\\d+\\s*;\\s*url\\s*=\\s*['"]?([^'"]+?)['"]?\\s*$/i);
  return { isRefresh: true, target: target ? target[1].trim() : null };
}

function classifyDocuments(discovered) {
  const userPages = [];
  const redirectAliases = [];
  const excludedNonUiResources = [];
  for (const file of discovered) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    // Google Search Console requires this exact plain-text token. It is an endpoint,
    // not a rendered UI page, and must not be wrapped in HTML to satisfy axe-core.
    if (/^google[a-z0-9]+\\.html$/i.test(path.posix.basename(file)) &&
        /^\\s*google-site-verification:\\s*google[a-z0-9]+\\.html\\s*$/i.test(html)) {
      excludedNonUiResources.push({
        file,
        reason: 'Exact Google Search Console verification token; not a user-facing UI document.'
      });
      continue;
    }

    const redirect = metaRefresh(html);
    if (redirect) {
      if (!redirect.target) {
        failures.push({ file, kind: 'redirect', detail: 'Meta refresh is present but its target URL could not be parsed.' });
        continue;
      }
      try {
        const sourceUrl = new URL(file.split(path.sep).join('/'), BASE);
        const targetUrl = new URL(redirect.target, sourceUrl);
        if (targetUrl.origin !== BASE.origin || !targetUrl.pathname.startsWith(BASE.pathname)) {
          failures.push({ file, kind: 'redirect', detail: 'Redirect target is outside the staged site: ' + targetUrl.href });
          continue;
        }
        const relative = decodeURIComponent(targetUrl.pathname.slice(BASE.pathname.length)).replace(/^\\/+/, '');
        const targetPath = path.resolve(ROOT, relative || 'index.html');
        if (!(targetPath.startsWith(ROOT + path.sep) || targetPath === path.join(ROOT, 'index.html')) ||
            !fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
          failures.push({ file, kind: 'redirect', detail: 'Redirect target does not resolve to a staged file: ' + targetUrl.href });
          continue;
        }
        redirectAliases.push({ file, target: targetUrl.href });
      } catch (error) {
        failures.push({ file, kind: 'redirect', detail: error && error.message ? error.message : String(error) });
      }
      continue;
    }
    userPages.push(file);
  }
  return { userPages, redirectAliases, excludedNonUiResources };
}

async function pool(items, concurrency, task) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      await task(items[index]);
    }
  }));
}

async function main() {
  if (!fs.existsSync(ROOT)) throw new Error('dist/ not found; run scripts/build-site.js first');
  const discovered = listHtml(ROOT).sort();
  if (!discovered.includes('index.html')) throw new Error('dist/index.html is missing');
  const classified = classifyDocuments(discovered);
  const files = classified.userPages;
  if (!files.includes('index.html')) throw new Error('dist/index.html is missing from user-facing pages');
  const axePath = require.resolve('axe-core/axe.min.js');
  const browser = await chromium.launch({ headless: true });
  try {
    await pool(files, CONCURRENCY, async file => {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const consoleErrors = [];
      page.on('pageerror', error => consoleErrors.push(error.message));
      const url = new URL(file.split(path.sep).join('/'), BASE);
      try {
        const response = await page.goto(url.href, { waitUntil: 'load', timeout: 30000 });
        if (!response || !response.ok()) {
          failures.push({ file, kind: 'load', detail: 'HTTP ' + (response ? response.status() : 'no response') });
          return;
        }
        await page.addScriptTag({ path: axePath });
        const scan = await page.evaluate(async () => {
          const result = await axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }
          });
          return {
            violations: result.violations.map(v => ({
              id: v.id,
              impact: v.impact,
              help: v.help,
              helpUrl: v.helpUrl,
              nodes: v.nodes.map(n => ({
                target: n.target,
                failureSummary: (n.failureSummary || '').slice(0, 700)
              }))
            })),
            passes: result.passes.length,
            incomplete: result.incomplete.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }))
          };
        });
        results.push({
          file,
          url: url.href,
          status: 'scanned',
          axePasses: scan.passes,
          violations: scan.violations,
          reviewRequired: scan.incomplete,
          pageErrors: consoleErrors
        });
        for (const violation of scan.violations) {
          const entry = {
            file, kind: 'accessibility', id: violation.id, impact: violation.impact,
            detail: violation.help, nodes: violation.nodes.length,
            sample: violation.nodes.slice(0, 3)
          };
          if (SEVERITY.has(violation.impact)) failures.push(entry);
        }
        for (const message of consoleErrors) failures.push({ file, kind: 'pageerror', detail: message });
      } catch (error) {
        failures.push({ file, kind: 'scan-error', detail: error && error.message ? error.message : String(error) });
      } finally {
        await page.close();
      }
    });

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE.href,
      scannedPages: results.length,
      discoveredHtmlDocuments: discovered.length,
      scannedUserFacingPages: files.length,
      validatedRedirectAliases: classified.redirectAliases,
      excludedNonUiResources: classified.excludedNonUiResources,
      failureCount: failures.length,
      severeViolationPolicy: 'Fail on axe-core critical/serious violations, uncaught page errors or page-load failures. Moderate/minor violations remain visible for triage. Manual assistive technology and physical-device checks are not replaced.',
      failures,
      pages: results
    };
    fs.writeFileSync(path.resolve(REPORT_PATH), JSON.stringify(report, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) {
      const severe = results.flatMap(page => page.violations.filter(v => SEVERITY.has(v.impact)).map(v => ({ file: page.file, ...v })));
      const summary = [
        '## ClerFit accessibility smoke test',
        '',
        '- User-facing HTML pages scanned: ' + results.length + '/' + files.length,
        '- Validated redirect-only aliases (targets exist): ' + classified.redirectAliases.length,
        '- Excluded non-UI verification resources: ' + classified.excludedNonUiResources.length,
        '- axe-core violations (all impact levels): ' + results.reduce((sum, page) => sum + page.violations.length, 0),
        '- Critical/serious violations: ' + severe.length,
        '- Pages with uncaught JavaScript errors: ' + results.filter(page => page.pageErrors.length).length,
        '- Detailed report: ' + REPORT_PATH,
        '',
        ...severe.slice(0, 50).map(v => '- **' + v.impact.toUpperCase() + ' — ' + v.file + ':** ' + v.id + ' — ' + v.help)
      ].join('\n');
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
    }
    console.log(JSON.stringify({
      status: failures.length ? 'FAIL' : 'PASS',
      scannedPages: results.length,
      discoveredHtmlDocuments: discovered.length,
      userFacingPages: files.length,
      validatedRedirectAliases: classified.redirectAliases.length,
      excludedNonUiResources: classified.excludedNonUiResources,
      allImpactViolations: results.reduce((sum, page) => sum + page.violations.length, 0),
      criticalOrSerious: results.reduce((sum, page) => sum + page.violations.filter(v => SEVERITY.has(v.impact)).length, 0),
      reviewRequiredChecks: results.reduce((sum, page) => sum + page.reviewRequired.length, 0),
      pageErrors: results.reduce((sum, page) => sum + page.pageErrors.length, 0),
      failures
    }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error && error.stack || String(error));
  process.exitCode = 1;
});
