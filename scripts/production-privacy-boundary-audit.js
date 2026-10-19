#!/usr/bin/env node
'use strict';

// Production privacy and numeric-boundary audit. It never submits the contact form.
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE = new URL(process.env.CLERFIT_LIVE_BASE || 'https://clerfit.github.io/Clerfit/');
const REPORT = process.env.CLERFIT_PRIVACY_REPORT || 'clerfit-production-privacy-audit.json';
const EXPECTED_ROUTES = 118;
const WORKERS = 4;
const failures = [];
const routeRows = [];
const thirdPartyRequests = [];
const runtimeStorageAttempts = [];
const requestKey = (url) => {
  try { return new URL(url).origin; } catch { return 'invalid-url'; }
};
const epsilon = (n) => Math.max(1e-7, Math.abs(n) * 1e-7);

async function waitForRelease() {
  const marker = 'R3-2026-10-17-phase12-a11y-v1';
  for (let i = 0; i < 15; i++) {
    const response = await fetch(BASE.href);
    const html = await response.text();
    if (response.ok && html.includes('name="clerfit-release" content="' + marker + '"')) return;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Live release marker was not found; refusing to audit an unknown deployment.');
}

async function auditRoute(browser, route) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const row = {
    route,
    loaded: false,
    numericFields: 0,
    lowerBoundsChecked: 0,
    upperBoundsChecked: 0,
    missingMin: [],
    missingMax: [],
    invalidLowerBounds: [],
    invalidUpperBounds: [],
    pageErrors: [],
    consoleErrors: [],
    storageAttempts: [],
    externalRequests: [],
    cookies: []
  };
  page.on('pageerror', error => row.pageErrors.push(String(error.message || error)));
  page.on('console', message => { if (message.type() === 'error') row.consoleErrors.push(message.text()); });
  page.on('request', request => {
    if (requestKey(request.url()) !== BASE.origin) {
      const entry = { route, url: request.url(), resourceType: request.resourceType() };
      row.externalRequests.push(entry);
      thirdPartyRequests.push(entry);
    }
  });
  await page.addInitScript(() => {
    const audit = [];
    Object.defineProperty(window, '__clerfitPrivacyAudit', { value: audit, configurable: false });
    try {
      for (const method of ['setItem', 'removeItem', 'clear']) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function (...args) {
          audit.push({ api: 'Storage.' + method, key: args.length ? String(args[0]) : '' });
          return original.apply(this, args);
        };
      }
    } catch (error) { audit.push({ api: 'Storage instrumentation', error: String(error) }); }
    try {
      if (window.indexedDB && typeof indexedDB.open === 'function') {
        const originalOpen = indexedDB.open.bind(indexedDB);
        indexedDB.open = function (...args) {
          audit.push({ api: 'indexedDB.open', key: args.length ? String(args[0]) : '' });
          return originalOpen(...args);
        };
      }
    } catch (error) { audit.push({ api: 'IndexedDB instrumentation', error: String(error) }); }
    try {
      if (navigator.sendBeacon) {
        const originalBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (...args) {
          audit.push({ api: 'navigator.sendBeacon', key: args.length ? String(args[0]) : '' });
          return originalBeacon(...args);
        };
      }
    } catch (error) { audit.push({ api: 'sendBeacon instrumentation', error: String(error) }); }
    try {
      const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
      if (descriptor && descriptor.get && descriptor.set && descriptor.configurable) {
        Object.defineProperty(Document.prototype, 'cookie', {
          configurable: true,
          enumerable: descriptor.enumerable,
          get() { return descriptor.get.call(this); },
          set(value) {
            audit.push({ api: 'document.cookie setter', key: String(value).split('=')[0] });
            return descriptor.set.call(this, value);
          }
        });
      }
    } catch (error) { audit.push({ api: 'cookie instrumentation', error: String(error) }); }
  });

  try {
    const url = route === '/' ? BASE.href : new URL(route.replace(/^\//, ''), BASE).href;
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    row.status = response ? response.status() : null;
    row.loaded = !!response && response.ok();
    if (!row.loaded) failures.push(route + ': page returned ' + row.status);
    const data = await page.evaluate(() => {
      const numeric = Array.from(document.querySelectorAll('input[type="number"]'));
      const result = {
        title: document.title,
        release: document.querySelector('meta[name="clerfit-release"]')?.content || '',
        numericFields: numeric.length,
        lowerBoundsChecked: 0,
        upperBoundsChecked: 0,
        missingMin: [],
        missingMax: [],
        invalidLowerBounds: [],
        invalidUpperBounds: [],
        storageAttempts: window.__clerfitPrivacyAudit || [],
        localStorageLength: 0,
        sessionStorageLength: 0,
        cookieString: document.cookie || ''
      };
      try { result.localStorageLength = localStorage.length; } catch (error) { result.storageAttempts.push({api:'localStorage read',error:String(error)}); }
      try { result.sessionStorageLength = sessionStorage.length; } catch (error) { result.storageAttempts.push({api:'sessionStorage read',error:String(error)}); }
      for (const el of numeric) {
        const id = el.id || el.name || '(unnamed numeric input)';
        const oldValue = el.value;
        const min = el.getAttribute('min');
        const max = el.getAttribute('max');
        if (min === null || min.trim() === '' || !Number.isFinite(Number(min))) {
          result.missingMin.push(id);
        } else {
          const n = Number(min);
          const invalid = n - Math.max(1e-7, Math.abs(n) * 1e-7);
          el.value = String(invalid);
          result.lowerBoundsChecked++;
          if (!el.validity.rangeUnderflow) result.invalidLowerBounds.push(id + ' did not reject ' + invalid + ' below min ' + min);
        }
        if (max === null || max.trim() === '' || !Number.isFinite(Number(max))) {
          result.missingMax.push(id);
        } else {
          const n = Number(max);
          const invalid = n + Math.max(1e-7, Math.abs(n) * 1e-7);
          el.value = String(invalid);
          result.upperBoundsChecked++;
          if (!el.validity.rangeOverflow) result.invalidUpperBounds.push(id + ' did not reject ' + invalid + ' above max ' + max);
        }
        el.value = oldValue;
      }
      return result;
    });
    Object.assign(row, data);
    row.cookies = await page.context().cookies(BASE.href);
    row.storageAttempts = data.storageAttempts;
    if (row.missingMin.length) failures.push(route + ': numeric fields missing min bounds: ' + row.missingMin.join(', '));
    if (row.missingMax.length) failures.push(route + ': numeric fields missing max bounds: ' + row.missingMax.join(', '));
    if (row.invalidLowerBounds.length) failures.push(route + ': lower-bound enforcement failures: ' + row.invalidLowerBounds.join('; '));
    if (row.invalidUpperBounds.length) failures.push(route + ': upper-bound enforcement failures: ' + row.invalidUpperBounds.join('; '));
    if (row.storageAttempts.length) failures.push(route + ': runtime storage/cookie/beacon write attempts: ' + JSON.stringify(row.storageAttempts));
    if (row.localStorageLength || row.sessionStorageLength || row.cookieString || row.cookies.length) {
      failures.push(route + ': browser storage/cookie state is not empty after page load');
    }
    if (row.externalRequests.length) failures.push(route + ': unexpected third-party requests: ' + row.externalRequests.map(x => x.url).join(', '));
    if (row.pageErrors.length) failures.push(route + ': uncaught page errors: ' + row.pageErrors.join('; '));
    if (row.consoleErrors.length) failures.push(route + ': console errors: ' + row.consoleErrors.join('; '));
  } catch (error) {
    row.error = String(error && error.message || error);
    failures.push(route + ': audit error: ' + row.error);
  } finally {
    routeRows.push(row);
    await page.close();
  }
  return row;
}

async function main() {
  await waitForRelease();
  const navResponse = await fetch(new URL('js/navigation.js', BASE));
  if (!navResponse.ok) throw new Error('Could not fetch live calculator registry: ' + navResponse.status);
  const nav = await navResponse.text();
  const match = nav.match(/const\s+CALCULATORS\s*=\s*(\[[\s\S]*?\]);\s*\nconst path/);
  if (!match) throw new Error('Could not parse the deployed calculator registry.');
  const registry = JSON.parse(match[1]);
  if (registry.length !== EXPECTED_ROUTES) throw new Error('Expected 118 calculator routes; found ' + registry.length);
  const routes = ['/', ...registry.map(item => 'html/' + item.file), 'contact.html', 'privacy.html', 'terms-of-use.html', 'educational-disclaimer.html'];
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    let cursor = 0;
    async function worker() {
      while (true) {
        const i = cursor++;
        if (i >= routes.length) return;
        await auditRoute(browser, routes[i]);
      }
    }
    await Promise.all(Array.from({ length: Math.min(WORKERS, routes.length) }, worker));
  } finally {
    await browser.close();
  }
  const report = {
    base: BASE.href,
    checkedAt: new Date().toISOString(),
    status: failures.length ? 'FAIL' : 'PASS',
    calculatorRoutes: registry.length,
    routesChecked: routeRows.length,
    numericFields: routeRows.reduce((sum, row) => sum + (row.numericFields || 0), 0),
    lowerBoundsChecked: routeRows.reduce((sum, row) => sum + (row.lowerBoundsChecked || 0), 0),
    upperBoundsChecked: routeRows.reduce((sum, row) => sum + (row.upperBoundsChecked || 0), 0),
    thirdPartyRequestCount: thirdPartyRequests.length,
    runtimeStorageWriteAttempts: routeRows.reduce((sum, row) => sum + (row.storageAttempts || []).length, 0),
    cookieBearingRoutes: routeRows.filter(row => row.cookies?.length || row.cookieString).map(row => row.route),
    failures,
    routes: routeRows
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');
  if (process.env.GITHUB_STEP_SUMMARY) {
    const summary = [
      '# ClerFit production privacy and numeric-boundary audit',
      '',
      '- Status: **' + report.status + '**',
      '- Calculator routes: ' + report.calculatorRoutes,
      '- Pages checked: ' + report.routesChecked,
      '- Numeric fields inspected: ' + report.numericFields,
      '- Lower-bound cases checked: ' + report.lowerBoundsChecked,
      '- Upper-bound cases checked: ' + report.upperBoundsChecked,
      '- Unexpected third-party requests: ' + report.thirdPartyRequestCount,
      '- Runtime storage/cookie/beacon write attempts: ' + report.runtimeStorageWriteAttempts,
      '- Failures: ' + failures.length,
      '',
      ...failures.map(failure => '- **FAIL:** ' + failure)
    ].join('\n');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  }
  console.log(JSON.stringify({
    status: report.status,
    calculatorRoutes: report.calculatorRoutes,
    routesChecked: report.routesChecked,
    numericFields: report.numericFields,
    lowerBoundsChecked: report.lowerBoundsChecked,
    upperBoundsChecked: report.upperBoundsChecked,
    thirdPartyRequestCount: report.thirdPartyRequestCount,
    runtimeStorageWriteAttempts: report.runtimeStorageWriteAttempts,
    failures: report.failures
  }, null, 2));
  if (failures.length) process.exit(1);
}

main().catch(error => {
  console.error(error && error.stack || String(error));
  process.exit(1);
});
