#!/usr/bin/env node
'use strict';
const vm = require('node:vm');
/* Live production smoke verification for ClerFit. No user data is submitted. */
const BASE_INPUT = process.argv[2] || process.env.CLERFIT_LIVE_BASE || 'https://clerfit.github.io/Clerfit/';
const BASE = new URL(BASE_INPUT.endsWith('/') ? BASE_INPUT : BASE_INPUT + '/');
const SITE_PREFIX = BASE.pathname.endsWith('/') ? BASE.pathname : BASE.pathname + '/';
const EXPECTED_RELEASE_ID = 'R3-2026-10-17-nav-v5';
const EXPECTED_CALCULATORS = 118;
const EXPECTED_SITEMAP_PAGES = 123;
const EXPECTED_NESTED_HTML = 118;
const CONCURRENCY = 8;
const FAILURES = [];
const RESOURCES = new Map();
const PAGE_BODIES = new Map();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchText(url, attempts = 5, required = true) {
  let reason = 'No response';
  for (let n = 1; n <= attempts; n++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'ClerFit-Production-Verifier/1.0', accept: 'text/html,application/xml,text/xml,text/plain,*/*' },
        signal: AbortSignal.timeout(15000)
      });
      const body = await response.text();
      if (response.ok) return { url, status: response.status, contentType: response.headers.get('content-type') || '', body };
      reason = 'HTTP ' + response.status;
    } catch (err) { reason = err && err.message ? err.message : String(err); }
    if (n < attempts) await delay(Math.min(1200 * n, 5000));
  }
  if (required) FAILURES.push(url + ' — ' + reason);
  return { url, status: 0, contentType: '', body: '', error: reason };
}
async function fetchUntilMarker(url, marker, attempts = 12) {
  let last = { url, status: 0, contentType: '', body: '' };
  for (let n = 1; n <= attempts; n++) {
    last = await fetchText(url, 1, false);
    if (last.body.includes(marker)) return last;
    if (n < attempts) await delay(4000);
  }
  FAILURES.push(url + ' did not publish the expected release marker after ' + attempts + ' attempts.');
  return last;
}
async function pool(items, concurrency, task) {
  const result = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      result[i] = await task(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return result;
}
function assert(ok, message) { if (!ok) FAILURES.push(message); }
function normalizeLocal(ref, from) {
  if (!ref || /^(?:#|javascript:|mailto:|tel:|data:|blob:)/i.test(ref.trim())) return null;
  let url;
  try { url = new URL(ref, from); } catch { return null; }
  if (url.origin !== BASE.origin || !url.pathname.startsWith(SITE_PREFIX)) return null;
  url.hash = '';
  return url.href;
}
function references(html, from) {
  const result = new Set();
  for (const m of html.matchAll(/\b(?:href|src|poster|action)\s*=\s*(["'])(.*?)\1/gi)) {
    const url = normalizeLocal(m[2].trim(), from);
    if (url) result.add(url);
  }
  return result;
}
async function main() {
  const sitemapUrl = new URL('sitemap.xml', BASE).href;
  const navUrl = new URL('js/navigation.js', BASE).href;
  const cssUrl = new URL('css/style.css?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const homeUrl = new URL('index.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const unitUrl = new URL('js/unit-system.js?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const advancedUrl = new URL('js/advanced-calculators.js?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const bmiHelperUrl = new URL('js/bmi-for-age.js?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const validationUrl = new URL('js/input-validation.js?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const bmiAgePageUrl = new URL('html/bmi-for-age.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const bmiChangePageUrl = new URL('html/bmi-change.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const relativeStrengthPageUrl = new URL('html/relative-strength.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const weeklyWeightPageUrl = new URL('html/weekly-weight.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const tdeePageUrl = new URL('html/tdee.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const metabolicAgePageUrl = new URL('html/metabolic-age.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const leanMassPageUrl = new URL('html/leanmass.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const macroSplitPageUrl = new URL('html/macro-split.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  const releaseMarker = 'name="clerfit-release" content="' + EXPECTED_RELEASE_ID + '"';
  const [sitemap, nav, css, home, unit, advanced, bmiHelper, validation, bmiAgePage, bmiChangePage, relativeStrengthPage, weeklyWeightPage, tdeePage, metabolicAgePage, leanMassPage, macroSplitPage] = await Promise.all([
    fetchText(sitemapUrl), fetchText(navUrl), fetchUntilMarker(cssUrl, 'ClerFit R3 live calculator UI'),
    fetchUntilMarker(homeUrl, releaseMarker), fetchUntilMarker(unitUrl, EXPECTED_RELEASE_ID),
    fetchUntilMarker(advancedUrl, EXPECTED_RELEASE_ID),
    fetchText(bmiHelperUrl), fetchText(validationUrl), fetchText(bmiAgePageUrl),
    fetchText(bmiChangePageUrl), fetchText(relativeStrengthPageUrl), fetchText(weeklyWeightPageUrl),
    fetchText(tdeePageUrl), fetchText(metabolicAgePageUrl), fetchText(leanMassPageUrl), fetchText(macroSplitPageUrl)
  ]);
  if (![sitemap.body, nav.body, css.body, home.body, unit.body].every(Boolean)) {
    console.error(JSON.stringify({ status: 'FAIL', failures: FAILURES }, null, 2));
    process.exit(1);
  }
  assert(home.body.includes(releaseMarker), 'The live homepage release marker does not match the deployed source revision.');
  assert(home.body.includes('js/navigation.js'), 'Homepage missing calculator navigation script.');
  assert(home.body.includes('js/page-chrome.js'), 'Homepage missing shared page-chrome script.');
  assert(unit.body.includes('PAGE_UNIT_ASSOCIATIONS'), 'Live unit-system script missing explicit input-to-unit associations.');
  assert(css.body.includes('ClerFit R3 live calculator UI'), 'Live stylesheet missing the R3 calculator UI marker.');
  const regressionChecks = [];

  // Advanced calculator calculation stays synchronous so submit handlers and
  // test callers see results immediately; it also avoids a race in result panels.
  assert(!/form\.addEventListener\('submit',\s*async\s/.test(advanced.body), 'Advanced calculator submit handler must calculate synchronously.');
  assert(advanced.body.includes('const r=def.calculate(values);'), 'Advanced calculator must render the calculation result directly.');
  regressionChecks.push('synchronous advanced calculator result handling');

  // Execute the real deployed BMI-for-age helper against known sex/age reference vectors.
  try {
    const bmiWindow = {};
    vm.runInNewContext(bmiHelper.body, { window: bmiWindow, Math, Number, Error }, { timeout: 1500 });
    const calculate = bmiWindow.ClerFitBMIForAge && bmiWindow.ClerFitBMIForAge.calculate;
    assert(typeof calculate === 'function', 'BMI-for-age helper did not export calculate().');
    if (typeof calculate === 'function') {
      const female = calculate({weight:33.125,height:125,age:9,ageMonths:6,sex:'female'});
      const male = calculate({weight:24.9165,height:105,age:4,ageMonths:2,sex:'male'});
      assert(female.primary === '21.2 kg/m²' && female.details.includes('92.2th'), 'BMI-for-age female known-answer vector did not match the expected CDC percentile.');
      assert(male.primary === '22.6 kg/m²' && male.details.includes('95.9th'), 'BMI-for-age male known-answer vector did not match the expected CDC percentile.');
      let missingSexRejected = false;
      try { calculate({weight:33.125,height:125,age:9,ageMonths:6,sex:'not-specified'}); } catch { missingSexRejected = true; }
      assert(missingSexRejected, 'BMI-for-age must require the sex-specific growth-chart reference.');
      regressionChecks.push('male/female CDC BMI-for-age known-answer vectors and required reference inputs');
    }
  } catch (error) { FAILURES.push('BMI-for-age known-answer execution failed: ' + (error && error.message || error)); }

  // Critical reported bugs: explicit shared-field associations, no output selector
  // changing a calorie input, and realistic field constraints for body measures.
  assert(bmiAgePage.body.includes('id="weight"') && bmiAgePage.body.includes('id="height"') && bmiAgePage.body.includes('id="ageMonths"') && bmiAgePage.body.includes('src="../js/bmi-for-age.js"'), 'BMI-for-age must render usable inputs and load the CDC reference module.');
  assert(bmiChangePage.body.includes('data-unit-for="currentWeightBMI,goalWeightBMI"'), 'BMI Change must convert both current and goal weights with its shared unit selector.');
  assert(relativeStrengthPage.body.includes('data-unit-for="oneRM,bodyWeight"'), 'Relative Strength must convert both compared weight values.');
  assert(weeklyWeightPage.body.includes('data-unit-role="output"'), 'Weekly Weight result unit must not mutate calorie inputs.');
  assert(tdeePage.body.includes('id="weight" type="number" min="0.1" max="500" step="any"') && tdeePage.body.includes('id="height" type="number" min="30" max="300" step="any"') && tdeePage.body.includes('id="age" type="number" min="18" max="120" step="1"'), 'TDEE must accept valid decimal body measurements and enforce its adult equation range.');
  assert(metabolicAgePage.body.includes('id="weight" placeholder="Enter weight" min="0.1" max="500" step="any"') && metabolicAgePage.body.includes('id="height" placeholder="Enter height" min="30" max="300" step="any"') && metabolicAgePage.body.includes('id="age" placeholder="Enter age" min="20" max="120" step="1"'), 'Resting-energy calculator fields must accept realistic body measurements and adult age.');
  assert(leanMassPage.body.includes('id="weight" type="number" min="0.1" max="500" step="any"'), 'Lean Mass must accept weights over 100 kg.');
  assert(macroSplitPage.body.includes('id="weight" placeholder="Enter weight" min="0.1" max="500" step="any"') && macroSplitPage.body.includes('id="age" placeholder="Enter age" min="18" max="120" step="1"'), 'Macro Split must accept realistic weights and constrain its adult equation range.');
  assert(validation.body.includes('function calculatorScope(trigger)') && validation.body.includes('visibleNumericInputs(scope)'), 'Numeric validation must be scoped to the active form/card.');
  regressionChecks.push('shared validation scope, decimal input bounds, and unit-selector regressions');

  const locs = [...sitemap.body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1].trim());
  const pages = [...new Set(locs)];
  assert(locs.length === pages.length, 'Sitemap contains duplicate locations.');
  assert(pages.length === EXPECTED_SITEMAP_PAGES, 'Expected ' + EXPECTED_SITEMAP_PAGES + ' sitemap pages but found ' + pages.length + '.');
  const registryMatch = nav.body.match(/const\s+CALCULATORS\s*=\s*(\[[\s\S]*?\])\s*;/);
  let registry = [];
  try { registry = registryMatch ? JSON.parse(registryMatch[1]) : []; }
  catch (e) { FAILURES.push('Calculator registry parse failed: ' + e.message); }
  assert(registry.length === EXPECTED_CALCULATORS, 'Expected ' + EXPECTED_CALCULATORS + ' registered calculators but found ' + registry.length + '.');
  const sitemapSet = new Set(pages);
  const missingRoutes = registry.filter(c => !c || !c.file || !sitemapSet.has(new URL('html/' + c.file, BASE).href));
  assert(missingRoutes.length === 0, 'Calculator routes missing from sitemap: ' + missingRoutes.map(c => c && c.file || '?').join(', '));

  await pool(pages, CONCURRENCY, async url => {
    const page = await fetchText(url);
    if (!page.body) return;
    PAGE_BODIES.set(page.url, page.body);
    const path = new URL(url).pathname;
    if (/\.html?$/i.test(path)) {
      assert(/<title\b[^>]*>\s*[^<]+\s*<\/title>/i.test(page.body), url + ' has no non-empty title.');
      assert(/<html\b[^>]*\blang=["'][^"']+["']/i.test(page.body), url + ' has no lang attribute.');
      assert(/<meta\b[^>]*name=["']viewport["']/i.test(page.body), url + ' has no viewport meta.');
      assert(/<meta\b[^>]*name=["']description["']/i.test(page.body), url + ' has no description meta.');
      if (path.includes('/html/')) assert(page.body.includes('page-chrome.js'), url + ' is missing page-chrome.js.');
    }
    for (const ref of references(page.body, page.url)) RESOURCES.set(ref, { url: ref, from: page.url });
  });
  for (const m of css.body.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    const url = normalizeLocal(m[2].trim(), cssUrl);
    if (url) RESOURCES.set(url, { url, from: cssUrl });
  }
  await pool([...RESOURCES.keys()], CONCURRENCY, async url => {
    const r = await fetchText(url);
    if (!r.body) return;
  });
  const nested = pages.filter(url => new URL(url).pathname.includes('/html/') && /\.html?$/i.test(new URL(url).pathname));
  const missingChrome = registry.filter(c => !PAGE_BODIES.get(new URL('html/' + c.file, BASE).href)?.includes('page-chrome.js')).map(c => c.file);
  assert(nested.length === EXPECTED_NESTED_HTML, 'Expected ' + EXPECTED_NESTED_HTML + ' registered nested calculator pages but found ' + nested.length + '.');
  assert(missingChrome.length === 0, 'Calculator pages missing page-chrome.js: ' + missingChrome.join(', '));
  const report = {
    base: BASE.href,
    releaseId: EXPECTED_RELEASE_ID,
    checkedAt: new Date().toISOString(),
    status: FAILURES.length ? 'FAIL' : 'PASS',
    counts: { calculators: registry.length, sitemapPages: pages.length, nestedHtmlPages: nested.length, htmlPagesFetched: PAGE_BODIES.size, localReferencesChecked: RESOURCES.size, failures: FAILURES.length },
    regressionChecks,
    failures: FAILURES
  };
  console.log(JSON.stringify(report, null, 2));
  if (FAILURES.length) process.exit(1);
}
main().catch(err => { console.error(err && err.stack ? err.stack : String(err)); process.exit(1); });
