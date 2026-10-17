#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const { chromium } = require('playwright');

const BASE = new URL(process.argv[2] || process.env.CLERFIT_LIVE_BASE || 'https://clerfit.github.io/Clerfit/');
const REPORT_PATH = process.env.CLERFIT_BROWSER_REPORT || 'live-browser-smoke-report.json';
const EXPECTED_ROUTES = 118;
const WORKERS = 4;
const EXPECTED_RELEASE_ID = 'R3-2026-10-17-nav-v4';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const failures = [];
const rows = [];
function assert(condition, message) { if (!condition) failures.push(message); }
function finiteAttr(value) { if (value === null || value === '') return null; const n = Number(value); return Number.isFinite(n) ? n : null; }
function clampToInput(value, info) {
  let v = Number(value);
  const min = finiteAttr(info.min), max = finiteAttr(info.max), step = info.step;
  if (min !== null) v = Math.max(v, min);
  if (max !== null) v = Math.min(v, max);
  if (step && step !== 'any' && Number.isFinite(Number(step)) && Number(step) > 0) {
    const base = min === null ? 0 : min;
    v = base + Math.round((v - base) / Number(step)) * Number(step);
    if (min !== null) v = Math.max(v, min);
    if (max !== null) v = Math.min(v, max);
  }
  return String(Number(v.toFixed(6)));
}
function preferredValue(info, pageName) {
  const s = [info.id, info.name, info.placeholder, info.aria, info.label].join(' ').toLowerCase();
  // Page-specific realistic values avoid mistaking a test-fixture value for a calculator defect.
  if (pageName === 'face-shape.html') {
    if (/facelength/.test(s)) return 18;
    if (/forehead/.test(s)) return 13;
    if (/cheekbones/.test(s)) return 15;
    if (/jawline/.test(s)) return 12;
  }
  if (pageName === 'nose-length-ratio.html') {
    if (/nose/.test(s)) return 50;
    if (/face/.test(s)) return 150;
  }
  if (pageName === 'eye-spacing.html') {
    if (/space|spacing/.test(s)) return 30;
    if (/eye width|\beye\b/.test(s)) return 30;
  }
  if (pageName === 'shoulder-symmetry.html') {
    if (/left/.test(s)) return 500;
    if (/right/.test(s)) return 510;
  }
  if (pageName === 'sit-stand-ratio.html') {
    if (/reps|repetition/.test(s)) return 15;
    if (/time|duration/.test(s)) return 30;
  }
  if (pageName === 'vo2max.html' && /distance/.test(s)) return 2400;
  if (pageName === 'heartrate.html' && /rhr|resting heart rate/.test(s)) return 70;
  if (pageName === 'weekly-training-count.html' && /sessions/.test(s)) return 5;
  if (pageName === 'goal-timeline.html') {
    if (/currentweight/.test(s)) return 80;
    if (/goalweight/.test(s)) return 70;
    if (/tdee/.test(s)) return 2500;
    if (/intake/.test(s)) return 2000;
  }
  if (pageName === 'bmi-for-age.html') {
    if (/age.?months|additional.*months/.test(s)) return 6;
    if (/\bage\b|completed years/.test(s)) return 9;
    if (/height|stature/.test(s)) return 125;
    if (/weight|mass/.test(s)) return 33.125;
  }
  if (/age.?months|additional.*months/.test(s)) return 0;
  if (/(^|[\s_-])age([\s_-]|$)|years old|age in years/.test(s)) return 25;
  if (/(bf-)?height|stature|heightvalue|facelength|total length/.test(s)) return 170;
  if (/neck/.test(s)) return 38;
  if (/waist/.test(s)) return 80;
  if (/hip/.test(s)) return 95;
  if (/chest/.test(s)) return 100;
  if (/upper|middle|lower|nose|mouth|jaw|face|chin|forehead|cheekbone|eye.?space|left|right|offset/.test(s)) return 40;
  if (/step.?length|stride.?length/.test(s)) return 70;
  if (/steps|reps|repetition|sessions|count|strides/.test(s)) return 1000;
  if (/sleep.?hours|hours.*sleep/.test(s)) return 7.5;
  if (/uv.?index/.test(s)) return 6;
  if (/humidity/.test(s)) return 50;
  if (/wind.?speed/.test(s)) return 10;
  if (/temp|temperature/.test(s)) return pageName === 'cold-exposure.html' ? 0 : 30;
  if (/tdee|calories|kcal|energy|intake/.test(s)) return /intake/.test(s) ? 2000 : 2300;
  if (/duration|minutes|seconds|interval|rest.?time|time.?value/.test(s)) return 30;
  if (/distance/.test(s)) return pageName === 'cooper-test.html' ? 2400 : 3;
  if (/speed|pace|cadence/.test(s)) return 6;
  if (/weight|mass|body.?mass|load|liftweight|one.?rm/.test(s)) return 70;
  if (/percent|percentage|humidity|fat.?fraction/.test(s)) return 20;
  if (/ratio|factor|score|index|quality|level/.test(s)) return 1.5;
  if (/height|measurement|circumference|length|diameter/.test(s)) return 50;
  if (/year/.test(s)) return 2024;
  if (/month/.test(s)) return 6;
  return 10;
}
async function fillPageInputs(page, pageName) {
  const inputs = page.locator('input:visible');
  const n = await inputs.count();
  for (let i = 0; i < n; i++) {
    const input = inputs.nth(i);
    const info = await input.evaluate(el => ({
      id: el.id || '', name: el.name || '', type: (el.type || '').toLowerCase(),
      value: el.value || '', min: el.getAttribute('min'), max: el.getAttribute('max'),
      step: el.getAttribute('step'), placeholder: el.getAttribute('placeholder') || '',
      aria: el.getAttribute('aria-label') || '',
      label: el.labels ? Array.from(el.labels).map(x => x.innerText).join(' ') : '',
      disabled: el.disabled, readOnly: el.readOnly
    }));
    if (info.disabled || info.readOnly || /search|password|email|file|button|submit|reset|hidden|image|range|color/i.test(info.type)) continue;
    if (/search/i.test(info.id + ' ' + info.name)) continue;
    if (['checkbox','radio'].includes(info.type)) {
      const required = await input.getAttribute('required');
      if (required !== null && !(await input.isChecked())) await input.check({force:true}).catch(()=>{});
      continue;
    }
    if (info.type === 'date') { if (!info.value) await input.fill('2000-01-15').catch(()=>{}); continue; }
    if (info.type === 'datetime-local') { if (!info.value) await input.fill('2026-10-17T10:00').catch(()=>{}); continue; }
    if (info.type === 'time') { if (!info.value) await input.fill('10:00').catch(()=>{}); continue; }
    if (info.type === 'number') {
      let v = info.value.trim() !== '' ? Number(info.value) : preferredValue(info, pageName);
      if (!Number.isFinite(v)) v = preferredValue(info, pageName);
      const result = clampToInput(v, info);
      if (info.value !== result) await input.fill(result).catch(async()=>{ await input.evaluate((el,val)=>{el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},result); });
      continue;
    }
    if (info.type === 'text' && !info.value && /date|birth|time/i.test(info.id + ' ' + info.placeholder + ' ' + info.aria)) {
      if (/birth|dob/i.test(info.id + ' ' + info.placeholder)) await input.fill('2000-01-15').catch(()=>{});
    }
  }
  const selects = page.locator('select:visible');
  for (let i = 0; i < await selects.count(); i++) {
    const select = selects.nth(i);
    if (await select.isDisabled().catch(()=>true)) continue;
    const value = await select.inputValue().catch(()=> '');
    if (value !== '') continue;
    const options = await select.locator('option').evaluateAll(os => os.filter(o=>!o.disabled && o.value!=='').map(o=>o.value));
    if (options.length) await select.selectOption(options[0]).catch(()=>{});
  }
}
async function outputSnapshot(page) {
  return page.evaluate(() => {
    const selectors = '[id="result"],[id="output"],[id$="Result"],[id$="Output"],.result,.cf-result,.cf-warning,[role="alert"],[role="status"],output';
    return Array.from(document.querySelectorAll(selectors))
      .filter(el => !/searchResults|search-results/i.test(el.id || '') && (el.getClientRects().length > 0))
      .map(el => ({
        id:el.id || '',
        className:typeof el.className === 'string' ? el.className : '',
        role:el.getAttribute('role') || '',
        validation:el.matches('.cf-validation-message,.cf-warning') || el.getAttribute('role') === 'alert',
        text:(el.innerText || el.textContent || '').replace(/\s+/g,' ').trim()
      }))
      .filter(x => x.text);
  });
}
async function chooseAction(page) {
  const primary = page.locator('button.calculate-btn:not(.cf-reset-btn):not([type="reset"]):visible');
  if (await primary.count()) return primary.first();
  const submit = page.locator('button[type="submit"]:visible,input[type="submit"]:visible');
  if (await submit.count()) return submit.first();
  const textButton = page.getByRole('button', {name:/calculate|convert|estimate|check|compare|update|submit|swap units/i}).filter({visible:true});
  if (await textButton.count()) return textButton.first();
  return null;
}
async function runRoute(browser, route) {
  const pageName = route.file;
  const url = new URL('html/' + encodeURI(pageName) + '?browserSmoke=R3-2026-10-17', BASE).href;
  const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const pageErrors=[], consoleErrors=[];
  page.on('pageerror', err=>pageErrors.push(err.message || String(err)));
  page.on('console', msg=>{ if(msg.type()==='error') consoleErrors.push(msg.text()); });
  let loaded=false, inputCount=0, clicked=false, bodyOverflow=false, outputsBefore=[], outputsAfter=[];
  let navState={present:false,nearTop:false,staticFlow:false,homeLink:false,contactLink:false,insideMain:false};
  try {
    const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:20000});
    if (!response || !response.ok()) throw new Error('page HTTP status ' + (response ? response.status() : 'no response'));
    await page.waitForLoadState('load',{timeout:10000}).catch(()=>{});
    await page.waitForTimeout(120);
    // Test the untouched form first. Empty submission must never produce NaN,
    // Infinity, or undefined in a result panel; then run the normal populated test.
    const emptyAction = await chooseAction(page);
    if (emptyAction) {
      await emptyAction.click({timeout:7000}).catch(error => {
        throw new Error('blank-form action click failed: ' + error.message);
      });
      await page.waitForTimeout(80);
      const emptyOutputs = await outputSnapshot(page);
      const invalidEmpty = emptyOutputs.filter(x => /\b(?:NaN|Infinity|undefined)\b/i.test(x.text));
      if (invalidEmpty.length) failures.push(pageName + ' emits non-finite output with blank/default inputs: ' + invalidEmpty.map(x=>x.id+': '+x.text.slice(0,120)).join(' | '));
    }
    await fillPageInputs(page,pageName);
    // Dynamically generated BMI-for-age fields have a CDC-supported numeric domain;
    // explicitly set values after units and controls are present to guard against
    // browser fill differences and catch input-to-result regressions.
    if (pageName === 'bmi-for-age.html') {
      await page.locator('#weight').fill('33.125');
      await page.locator('#height').fill('125');
      await page.locator('#age').fill('9');
      await page.locator('#ageMonths').fill('6');
      await page.locator('#sex').selectOption('female');
    }
    if (pageName === 'average.html') await page.locator('#avgNumbers').fill('10, 20, 30');
    inputCount = await page.locator('input:visible,select:visible,textarea:visible').count();
    outputsBefore = await outputSnapshot(page);
    const action = await chooseAction(page);
    if (action) {
      await action.scrollIntoViewIfNeeded().catch(()=>{});
      await action.click({timeout:7000}).catch(async error=>{
        throw new Error('primary action click failed: ' + error.message);
      });
      clicked=true;
      await page.waitForTimeout(180);
    } else if (/unit\.html$/i.test(pageName)) {
      await page.locator('#amount').dispatchEvent('input').catch(()=>{});
    }
    outputsAfter = await outputSnapshot(page);
    const rejectedFixture = outputsAfter.filter(x => x.validation && x.text);
    if (rejectedFixture.length) {
      failures.push(pageName + ' rejected the populated browser-smoke fixture: ' +
        rejectedFixture.map(x => x.text.slice(0,160)).join(' | '));
    }
    navState = await page.evaluate(() => {
      const nav = document.querySelector('.cf-page-actions, .clerfit-fixed-actions, .cf-floating-links, .top-right-buttons');
      const main = document.querySelector('main.main, main, .main');
      if (!nav) return {present:false,nearTop:false,staticFlow:false,homeLink:false,contactLink:false,insideMain:false};
      const header = main ? main.querySelector(':scope > .header, :scope > header, .header') : null;
      // Redesigned R3 pages use breadcrumb/title instead of legacy .header.
      const topMarker = header || (main && main.querySelector(':scope > .cf-breadcrumb, :scope > .cf-page-title, :scope > h1, .cf-breadcrumb, .cf-page-title, h1'));
      const position = getComputedStyle(nav).position;
      const appearsBeforeHeader = !!topMarker && Boolean(nav.compareDocumentPosition(topMarker) & 4);
      const describe = el => el ? (el.tagName.toLowerCase() + (el.id ? '#'+el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.'+el.className.trim().replace(/\\s+/g,'.') : '')) : null;
      return {
        present: nav.getClientRects().length > 0,
        nearTop: !!main && !!topMarker && main.contains(nav) && appearsBeforeHeader,
        staticFlow: position !== 'fixed' && position !== 'sticky',
        homeLink: !!nav.querySelector('a[href*="index.html"], a[href="../"], a[href="./"]'),
        contactLink: !!nav.querySelector('a[href*="contact.html"]'),
        insideMain: !!main && main.contains(nav),
        debug: {
          nav: describe(nav), navParent: describe(nav.parentElement), main: describe(main),
          header: describe(header), topMarker: describe(topMarker), topMarkerParent: describe(topMarker && topMarker.parentElement),
          appearsBeforeHeader, navIndexInParent: nav.parentElement ? Array.from(nav.parentElement.children).indexOf(nav) : -1,
          headerIndexInParent: topMarker && topMarker.parentElement ? Array.from(topMarker.parentElement.children).indexOf(topMarker) : -1,
          firstMainChildren: main ? Array.from(main.children).slice(0,5).map(describe) : [],
          pageChromeScripts: Array.from(document.scripts).filter(s => s.src.includes('page-chrome.js')).map(s => s.src)
        }
      };
    });
    bodyOverflow = await page.evaluate(()=>document.documentElement.scrollWidth > window.innerWidth + 1);
    loaded=true;
  } catch (error) {
    pageErrors.push(String(error && error.message || error));
  } finally {
    await page.close().catch(()=>{});
  }
  const row={file:pageName,url,loaded,inputCount,actionClicked:clicked,bodyOverflow,navState,pageErrors,consoleErrors,outputs:outputsAfter.length,validationOutputs:outputsAfter.filter(x=>x.validation).map(x=>x.text).slice(0,4),outputSample:outputsAfter.map(x=>x.text).join(' | ').slice(0,260)};
  if (!loaded) failures.push(pageName + ' failed to load/execute: ' + pageErrors.join(' | '));
  if (inputCount===0) failures.push(pageName + ' has no visible interactive input.');
  if (!clicked && !/unit\.html$/i.test(pageName)) failures.push(pageName + ' has no actionable Calculate/Convert control.');
  if (bodyOverflow) failures.push(pageName + ' overflows the 390px mobile viewport.');
  if (!navState.present) failures.push(pageName + ' is missing visible Home/Contact quick navigation.');
  if (!navState.nearTop || !navState.insideMain) failures.push(pageName + ' Home/Contact navigation is not positioned at the top of the main page content.');
  if (!navState.staticFlow) failures.push(pageName + ' Home/Contact navigation overlaps the page as a fixed/sticky overlay.');
  if (!navState.homeLink || !navState.contactLink) failures.push(pageName + ' Home/Contact navigation is missing a working Home or Contact Us link.');
  if (pageErrors.length) failures.push(pageName + ' JavaScript/page errors: ' + pageErrors.join(' | '));
  if (consoleErrors.length) failures.push(pageName + ' console errors: ' + consoleErrors.join(' | '));
  return row;
}
async function approx(locator, expected, label, tolerance=.15) {
  const actual=Number(await locator.inputValue());
  if (!Number.isFinite(actual) || Math.abs(actual-expected)>tolerance) throw new Error(label+' conversion mismatch; expected '+expected+', got '+await locator.inputValue());
}
async function targetedSemanticBoundaries(browser) {
  const checks = [];
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await p.goto(new URL('html/BMI.html?browserSmoke=semantic-boundaries', BASE).href, { waitUntil: 'load' });
    const run = async ({weight, height, age = 30, expectInvalid, caseName}) => {
      await p.locator('#weight').fill(String(weight));
      await p.locator('#height').fill(String(height));
      await p.locator('#age').fill(String(age));
      await p.locator('#weightUnit').selectOption('kg');
      await p.locator('#heightUnit').selectOption('cm');
      await p.locator('#gender').selectOption('male');
      // Call the handler directly so native min/max bubbles do not mask the calculator's own semantic validation.
      await p.evaluate(() => calculateBMI());
      await p.waitForTimeout(50);
      const out = await p.locator('#result').innerText();
      if (expectInvalid) {
        if (!/valid|check the measurements|plausible/i.test(out)) throw new Error('BMI semantic boundary accepted ' + caseName + ': ' + out);
        if (/\b(?:NaN|Infinity|undefined)\b/i.test(out)) throw new Error('BMI semantic boundary emitted non-finite output for ' + caseName);
      } else if (!/BMI:\s*\d/.test(out) || /Age-specific interpretation required/i.test(out)) {
        throw new Error('BMI valid reference case did not calculate: ' + caseName + ' — ' + out);
      }
      checks.push('BMI semantic boundary: ' + caseName + ' passed');
    };
    await run({weight: 0, height: 175, expectInvalid: true, caseName: 'zero weight'});
    await run({weight: 0.1, height: 175, expectInvalid: true, caseName: 'minimum HTML weight'});
    await run({weight: 70, height: 30, expectInvalid: true, caseName: 'minimum HTML height'});
    await run({weight: 1000000, height: 175, expectInvalid: true, caseName: 'extreme weight'});
    await run({weight: 70, height: 175, expectInvalid: false, caseName: 'valid adult reference'});
    return checks;
  } finally {
    await p.close().catch(() => {});
  }
}

async function targetedCalculatorBoundaries(browser) {
  const checks = [];
  async function exercise({file, fn, fields, resultId, caseName, expect, mustNotMatch}) {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      // Request a fresh static HTML representation so the live check can detect stale CDN copies.
      await p.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' });
      const pageUrl = new URL('html/' + file, BASE);
      pageUrl.searchParams.set('browserSmoke', 'calculator-boundaries');
      pageUrl.searchParams.set('releaseProbe', 'r3-semantic-2026-10-17-v2');
      await p.goto(pageUrl.href, { waitUntil: 'load' });
      if (file === 'whr.html') {
        const expectedRevision = 'WHR-validated-units-2026-10-17-v1';
        let servedRevision = null;
        // GitHub Pages can briefly serve an older edge copy after a successful deploy.
        // Wait for the deployed HTML marker rather than executing stale calculator code.
        for (let attempt = 0; attempt < 15; attempt++) {
          servedRevision = await p.locator('meta[name="clerfit-calculator-revision"]').getAttribute('content').catch(() => null);
          if (servedRevision === expectedRevision) break;
          if (attempt < 14) {
            await p.waitForTimeout(3000);
            await p.reload({ waitUntil: 'load' });
          }
        }
        if (servedRevision !== expectedRevision) {
          throw new Error('WHR page is stale: expected release marker ' + expectedRevision + ', received ' + String(servedRevision));
        }
      }
      await p.evaluate(({fields}) => {
        for (const [id, value] of Object.entries(fields)) {
          const el = document.getElementById(id);
          if (!el) throw new Error('Missing field #' + id);
          el.value = String(value);
        }
      }, {fields});
      await p.evaluate(fn => {
        const target = window[fn];
        if (typeof target !== 'function') throw new Error('Missing calculation handler ' + fn);
        target();
      }, fn);
      const output = await p.locator('#' + resultId).innerText();
      if (expect && !expect.test(output)) throw new Error(file + ' ' + caseName + ': expected validation/output pattern ' + expect + ', got: ' + output);
      if (mustNotMatch && mustNotMatch.test(output)) throw new Error(file + ' ' + caseName + ': forbidden output ' + mustNotMatch + ', got: ' + output);
      if (/\b(?:NaN|Infinity|undefined)\b/i.test(output)) throw new Error(file + ' ' + caseName + ': non-finite output: ' + output);
      checks.push(file + ': ' + caseName + ' passed');
    } finally {
      await p.close().catch(() => {});
    }
  }

  await exercise({file:'absi.html',fn:'calculateABSI',fields:{waist:85,waistUnit:'cm',height:175,heightUnit:'cm',weight:0},resultId:'result',caseName:'zero weight rejected',expect:/valid positive waist, height, and weight/i});
  await exercise({file:'whr.html',fn:'calculateWHR',fields:{waist:85,waistUnit:'cm',hip:100,hipUnit:'bogus'},resultId:'result',caseName:'unsupported hip unit rejected',expect:/supported units/i});
  await exercise({file:'bsa.html',fn:'calculateBSA',fields:{weight:70,weightUnit:'kg',height:30,heightUnit:'cm'},resultId:'result',caseName:'implausible height rejected',expect:/Check units and values/i});
  await exercise({file:'fatmass.html',fn:'calculateFatMass',fields:{weight:80,weightUnit:'kg',fat:101},resultId:'result',caseName:'body fat above 100 percent rejected',expect:/body-fat percentage from 0 to 100/i});
  await exercise({file:'leanmass.html',fn:'calculateLeanMass',fields:{weight:80,weightUnit:'kg',fat:-1},resultId:'result',caseName:'negative body fat rejected',expect:/body-fat percentage from 0 to 100/i});
  await exercise({file:'ffmi.html',fn:'calculateFFMI',fields:{height:175,heightUnit:'cm',weight:80,weightUnit:'kg',fat:101},resultId:'result',caseName:'body fat above 100 percent rejected',expect:/body-fat percentage from 0 to 100/i});
  await exercise({file:'1rm.html',fn:'calculate1RM',fields:{liftWeight:100,weightUnit1RM:'kg',reps:16,formula:'epley'},resultId:'oneRMResult',caseName:'unsupported rep count rejected',expect:/repetition count from 1 to 15/i});
  await exercise({file:'bmi-change.html',fn:'calculateBMIChange',fields:{currentWeightBMI:70,goalWeightBMI:75,weightUnitBMI:'kg',heightBMI:30,heightUnitBMI:'cm'},resultId:'bmiResult',caseName:'implausible height rejected after conversion',expect:/Check the measurements/i});
  await exercise({file:'goal-timeline.html',fn:'calculateGoalTimeline',fields:{currentWeight:80,goalWeight:70,weightUnitTimeline:'kg',tdeeTimeline:2500,intakeTimeline:2000},resultId:'timelineResult',caseName:'valid estimate carries model caveat',expect:/Approximate energy-balance estimate only/i});
  await exercise({file:'weight-gain-rate.html',fn:'calculateWeightGainRate2',fields:{tdeeGain2:2000,intakeGain2:2500,unitGain2:'kg'},resultId:'gainResult2',caseName:'gain output describes estimate',expect:/not a personalized prediction/i});
  await exercise({file:'weight-loss-rate.html',fn:'calculateWeightLossRate',fields:{tdeeRate:2500,intakeRate:1800,unitRate:'kg'},resultId:'rateResult',caseName:'loss output describes estimate',expect:/Static calorie-to-mass estimate only/i});
  await exercise({file:'weight-stability.html',fn:'calculateWeightStability',fields:{initialWeight:70,currentWeight:72,weightUnit:'kg',days:30},resultId:'weightStabilityResult',caseName:'stability output caveat',expect:/water and measurement variation/i});
  await exercise({file:'rfm.html',fn:'calculateRFM',fields:{gender:'male',height:175,heightUnit:'cm',waist:0.1,waistUnit:'cm'},resultId:'result',caseName:'minimum waist rejected',expect:/height must be 100–250 cm and waist 20–250 cm/i});
  await exercise({file:'rfm.html',fn:'calculateRFM',fields:{gender:'male',height:175,heightUnit:'cm',waist:85,waistUnit:'bogus'},resultId:'result',caseName:'unsupported waist unit rejected',expect:/height must be 100–250 cm and waist 20–250 cm/i});
  await exercise({file:'rfm.html',fn:'calculateRFM',fields:{gender:'male',height:250,heightUnit:'cm',waist:20,waistUnit:'cm'},resultId:'result',caseName:'out-of-domain RFM result rejected',expect:/RFM value outside the supported 0–100% range/i});
  await exercise({file:'rfm.html',fn:'calculateRFM',fields:{gender:'male',height:175,heightUnit:'cm',waist:85,waistUnit:'cm'},resultId:'result',caseName:'valid RFM reference case calculates',expect:/RFM estimate:\s*22\.8%/i});
  await exercise({file:'bmr.html',fn:'calculateBMR',fields:{weight:70,weightUnit:'kg',height:175,heightUnit:'bogus',age:30,gender:'male'},resultId:'result',caseName:'unsupported BMR height unit rejected',expect:/Choose supported weight and height units/i});
  await exercise({file:'bodyfat.html',fn:'calculateBodyFat',fields:{'bf-gender':'male','bf-height':180,'bf-height-unit':'cm','bf-waist':85,'bf-waist-unit':'bogus','bf-neck':38,'bf-neck-unit':'cm','bf-hip':100,'bf-hip-unit':'cm'},resultId:'bf-result',caseName:'unsupported body-fat waist unit rejected',expect:/measurements.*plausible/i});
  await exercise({file:'idealweight.html',fn:'calculateIdealWeight',fields:{'iw-gender':'male','iw-height':180,'iw-height-unit':'bogus','iw-weight-unit':'kg'},resultId:'iw-result',caseName:'unsupported ideal-weight height unit rejected',expect:/Choose supported height and output-weight units/i});
  await exercise({file:'maintenance.html',fn:'calculateMaintenance',fields:{weight:70,weightUnit:'kg',height:175,heightUnit:'bogus',age:30,gender:'male',activity:1.55},resultId:'result',caseName:'unsupported maintenance height unit rejected',expect:/Check units and measurements/i});
  await exercise({file:'deficit.html',fn:'calculateDeficit',fields:{weight:70,weightUnit:'kg',height:175,heightUnit:'bogus',age:30,gender:'male',activity:1.55,deficit:500},resultId:'result',caseName:'unsupported deficit height unit rejected',expect:/Check units and measurements/i});
  await exercise({file:'surplus.html',fn:'calculateSurplus',fields:{weight:70,weightUnit:'kg',height:175,heightUnit:'cm',age:17,gender:'male',activity:1.55,surplus:250},resultId:'result',caseName:'adult equation rejects under-18 age',expect:/age 18–120/i});
  await exercise({file:'calories-kg.html',fn:'calculateCaloriesPerKg',fields:{weight:0.1,weightUnit:'kg',height:175,heightUnit:'cm',age:30,gender:'male',activity:1.55},resultId:'result',caseName:'implausible weight rejected',expect:/weight must be 2–500 kg/i});
  await exercise({file:'face-shape.html',fn:'calculateFaceShape',fields:{faceLength:0.1,faceLengthUnit:'cm',forehead:13,foreheadUnit:'cm',cheekbones:15,cheekbonesUnit:'cm',jawline:12,jawlineUnit:'cm'},resultId:'result',caseName:'implausible face length rejected',expect:/Face length must be 8–40 cm/i});
  await exercise({file:'cardio-calories.html',fn:'calculateCalories',fields:{bodyWeight:70,weightUnit:'kg',activityMET:3.5,duration:50000,durationUnit:'minutes'},resultId:'caloriesResult',caseName:'extreme cardio duration rejected',expect:/duration must not exceed 1440 minutes/i});
  await exercise({file:'mets.html',fn:'calculateMETs',fields:{weight:70,weightUnit:'kg',met:500,duration:30},resultId:'result',caseName:'extreme MET value rejected',expect:/MET value from 1 to 25/i});
  await exercise({file:'monthly-weight.html',fn:'calculateMonthlyChange',fields:{tdeeMonthly:20000,intakeMonthly:500,unitMonthly:'kg',days:30},resultId:'monthlyResult',caseName:'extreme daily energy rejected',expect:/TDEE and intake must each be 500–10000 kcal\/day/i});
  await exercise({file:'steps-calories.html',fn:'stepsToCaloriesBest',fields:{steps:1000,stepLength:300,unit:'cm',weight:70,weightUnit:'kg'},resultId:'calorieResult',caseName:'implausible step length rejected',expect:/step length must be 20–150 cm/i});
  return checks;
}

async function targetedAdvancedBoundaries(browser) {
  const checks = [];
  async function submitCase(file, fields, caseName, expected) {
    const p = await browser.newPage({viewport:{width:390,height:844}});
    try {
      const url = new URL('html/' + file, BASE);
      url.searchParams.set('browserSmoke','advanced-boundary');
      await p.goto(url.href,{waitUntil:'load'});
      await p.evaluate(fields => {
        for (const [id,value] of Object.entries(fields)) {
          const el=document.getElementById(id);
          if(!el) throw new Error('Missing advanced input #'+id);
          el.value=String(value);
        }
        const form=document.getElementById('advanced-form');
        if(!form) throw new Error('Missing generated advanced form');
        form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      },fields);
      const output=await p.locator('#advanced-output').innerText();
      if(!expected.test(output)) throw new Error(file+' '+caseName+': expected '+expected+', got: '+output);
      checks.push(file+': '+caseName+' passed');
    } finally { await p.close().catch(()=>{}); }
  }
  await submitCase('facial-thirds.html',{upper:0.1,middle:60,lower:70},'extreme facial measurement rejected',/Upper third must be between 10 and 150 mm/i);
  await submitCase('facial-thirds.html',{upper:50,middle:60,lower:70},'valid facial-thirds reference case',/27\.8% \/ 33\.3% \/ 38\.9%/);
  await submitCase('jaw-width-ratio.html',{jaw:240,face:50},'implausible jaw-to-face ratio rejected',/jaw\/reference-width ratio must be between 0\.2 and 1\.2/i);
  await submitCase('weekly-training-count.html',{sessions:21,minutes:600},'impossible weekly training time rejected',/weekly training time cannot exceed 10080 minutes/i);
  await submitCase('chest-expansion.html',{exhale:100,inhale:80},'reversed chest expansion rejected',/Inhalation measurement must be at least the exhalation measurement/i);
  await submitCase('forward-head-index.html',{offset:150,height:50},'extreme head-offset ratio rejected',/head-offset\/height ratio must be between 0 and 1/i);
  return checks;
}

async function targetedUnits(browser) {
  const report=[];
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/bmi-change.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#currentWeightBMI').fill('80'); await p.locator('#goalWeightBMI').fill('65'); await p.locator('#heightBMI').fill('170');
    await p.locator('#weightUnitBMI').selectOption('lbs'); await sleep(100);
    await approx(p.locator('#currentWeightBMI'),176.37,'BMI Change current weight');
    await approx(p.locator('#goalWeightBMI'),143.30,'BMI Change goal weight');
    await approx(p.locator('#heightBMI'),170,'BMI Change height preserved',.001);
    report.push('BMI Change: both weights converted, height preserved'); await p.close();
  }
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/relative-strength.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#oneRM').fill('120'); await p.locator('#bodyWeight').fill('70');
    await p.locator('#unitRelative').selectOption('lbs'); await sleep(100);
    await approx(p.locator('#oneRM'),264.55,'Relative Strength 1RM');
    await approx(p.locator('#bodyWeight'),154.32,'Relative Strength body weight');
    report.push('Relative Strength: both compared weights converted'); await p.close();
  }
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/weekly-weight.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#tdee').fill('2200'); await p.locator('#intake').fill('2000');
    await p.locator('#unit').selectOption('lbs'); await sleep(100);
    await approx(p.locator('#tdee'),2200,'Weekly Weight TDEE preserved',.001);
    await approx(p.locator('#intake'),2000,'Weekly Weight intake preserved',.001);
    report.push('Weekly Weight output unit: calorie inputs preserved'); await p.close();
  }
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/tdee.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#height').fill('170'); await p.locator('#heightUnit').selectOption('m'); await sleep(100);
    await approx(p.locator('#height'),1.7,'TDEE cm-to-m height');
    report.push('TDEE height unit: field value and constraints convert'); await p.close();
  }
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/bodyfat.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#bf-height').fill('175'); await p.locator('#bf-waist').fill('80'); await p.locator('#bf-neck').fill('38');
    await p.locator('#bf-height-unit').selectOption('m'); await sleep(100);
    await approx(p.locator('#bf-height'),1.75,'Body Fat height selector');
    await approx(p.locator('#bf-waist'),80,'Body Fat waist field preserved',.001);
    await approx(p.locator('#bf-neck'),38,'Body Fat neck field preserved',.001);
    report.push('Body Fat independent unit selector: only intended input converted'); await p.close();
  }
  {
    const p=await browser.newPage({viewport:{width:390,height:844}});
    await p.goto(new URL('html/ponderal.html?browserSmoke=targeted',BASE).href,{waitUntil:'load'});
    await p.locator('#weight').fill('80'); await p.locator('#height').fill('180');
    await p.locator('#weightUnit').selectOption('kg'); await p.locator('#heightUnit').selectOption('cm');
    await p.locator('button[onclick*="calculatePI"]').click(); await sleep(100);
    if (!/13\.72/.test(await p.locator('#result').innerText())) throw new Error('Ponderal Index did not match 80 kg / 1.8 m³ = 13.72.');
    await p.locator('#weightUnit').selectOption('lb'); await p.locator('#heightUnit').selectOption('inch'); await sleep(100);
    await approx(p.locator('#weight'),176.36981,'Ponderal weight kg-to-lb',.03);
    await approx(p.locator('#height'),70.86614,'Ponderal height cm-to-inch',.02);
    await p.locator('button[onclick*="calculatePI"]').click(); await sleep(100);
    if (!/13\.72/.test(await p.locator('#result').innerText())) throw new Error('Ponderal Index changed after equivalent unit conversion.');
    report.push('Ponderal Index: known-answer formula and kg/cm-to-lb/in equivalence');
    await p.close();
  }
  return report;
}

async function waitForDeployedRelease() {
  const target = new URL('index.html?release=' + encodeURIComponent(EXPECTED_RELEASE_ID), BASE).href;
  let lastStatus = 'no response';
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      const response = await fetch(target, { redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'cache-control': 'no-cache' } });
      const body = await response.text();
      lastStatus = 'HTTP ' + response.status;
      if (response.ok && body.includes('name="clerfit-release" content="' + EXPECTED_RELEASE_ID + '"')) return;
    } catch (error) { lastStatus = String(error && error.message || error); }
    await sleep(4000);
  }
  throw new Error('Timed out waiting for live homepage release marker ' + EXPECTED_RELEASE_ID + ' (' + lastStatus + ').');
}

async function main() {
  await waitForDeployedRelease();
  const navUrl=new URL('js/navigation.js?browserSmoke=R3-2026-10-17',BASE).href;
  const sitemapUrl=new URL('sitemap.xml?browserSmoke=R3-2026-10-17',BASE).href;
  const [navResponse,sitemapResponse]=await Promise.all([fetch(navUrl),fetch(sitemapUrl)]);
  if(!navResponse.ok||!sitemapResponse.ok) throw new Error('Could not fetch live registry/sitemap');
  const navText=await navResponse.text(), sitemapText=await sitemapResponse.text();
  const registryMatch=navText.match(/const\s+CALCULATORS\s*=\s*(\[[\s\S]*?\])\s*;\s*\nconst path/);
  if(!registryMatch) throw new Error('Cannot parse live calculator registry');
  const registry=JSON.parse(registryMatch[1]);
  if(registry.length!==EXPECTED_ROUTES) throw new Error('Expected '+EXPECTED_ROUTES+' calculator routes, found '+registry.length);
  const sitemap=new Set([...sitemapText.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1].trim()));
  const missing=registry.filter(r=>!sitemap.has(new URL('html/'+encodeURI(r.file),BASE).href));
  if(missing.length) throw new Error('Registered calculator routes missing from sitemap: '+missing.map(x=>x.file).join(', '));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    let cursor=0;
    const routeResults=new Array(registry.length);
    async function worker(){ while(true){const i=cursor++;if(i>=registry.length)return;routeResults[i]=await runRoute(browser,registry[i]);} }
    await Promise.all(Array.from({length:Math.min(WORKERS,registry.length)},worker));
    let targeted=[];
    try { targeted=await targetedUnits(browser); }
    catch(error){ failures.push('Targeted unit conversion test failed: '+(error && error.message || error)); }
    let semanticBoundaries=[];
    try { semanticBoundaries=await targetedSemanticBoundaries(browser); }
    catch(error){ failures.push('Targeted BMI semantic-boundary test failed: '+(error && error.message || error)); }
    let calculatorBoundaries=[];
    try { calculatorBoundaries=await targetedCalculatorBoundaries(browser); }
    catch(error){ failures.push('Targeted calculator-boundary test failed: '+(error && error.message || error)); }
    let advancedBoundaries=[];
    try { advancedBoundaries=await targetedAdvancedBoundaries(browser); }
    catch(error){ failures.push('Targeted advanced-boundary test failed: '+(error && error.message || error)); }
    const bmi=routeResults.find(r=>r.file==='bmi-for-age.html');
    const bmiResult=!!(bmi && /percentile/i.test(bmi.outputSample) && /CDC reference sex/i.test(bmi.outputSample));
    assert(bmiResult,'BMI-for-age did not render an age/sex-specific CDC percentile result in the browser smoke pass.');
    // Verify that the generated form preserves the unit conversion contract with real browser interaction.
    {
      const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
      try {
        await p.goto(new URL('html/bmi-for-age.html?browserSmoke=bmi-age-units',BASE).href,{waitUntil:'load',timeout:20000});
        await p.locator('#weight').fill('70');
        await p.locator('#height').fill('170');
        await p.locator('[data-unit-for="weight"]').selectOption('lb');
        await p.locator('[data-unit-for="height"]').selectOption('m');
        await sleep(100);
        await approx(p.locator('#weight'),154.3236,'BMI-for-age kg-to-lb field value',.02);
        await approx(p.locator('#height'),1.7,'BMI-for-age cm-to-m field value',.001);
        await p.locator('#age').fill('9'); await p.locator('#ageMonths').fill('6'); await p.locator('#sex').selectOption('female');
        await p.getByRole('button',{name:/calculate result/i}).click();
        const resultText=await p.locator('#advanced-output').innerText();
        if(!/percentile/i.test(resultText)||!/CDC reference sex/i.test(resultText)) throw new Error('BMI-for-age unit-converted form did not render a CDC percentile result.');
        targeted.push('BMI-for-age generated form: weight/height unit selectors convert input values and still calculate');
      } finally { await p.close(); }
    }
    const report={
      base:BASE.href, checkedAt:new Date().toISOString(), status:failures.length?'FAIL':'PASS',
      routeCount:registry.length, routesLoaded:routeResults.filter(r=>r.loaded).length,
      actionsClicked:routeResults.filter(r=>r.actionClicked).length,
      mobileOverflow:routeResults.filter(r=>r.bodyOverflow).map(r=>r.file),
      navigationFailures:routeResults.filter(r=>!r.navState.present || !r.navState.nearTop || !r.navState.staticFlow || !r.navState.homeLink || !r.navState.contactLink || !r.navState.insideMain).map(r=>({file:r.file,navState:r.navState})),
      pageErrors:routeResults.filter(r=>r.pageErrors.length).map(r=>({file:r.file,errors:r.pageErrors})),
      consoleErrors:routeResults.filter(r=>r.consoleErrors.length).map(r=>({file:r.file,errors:r.consoleErrors})),
      noVisibleInput:routeResults.filter(r=>!r.inputCount).map(r=>r.file),
      noAction:routeResults.filter(r=>!r.actionClicked&&!/unit\.html$/i.test(r.file)).map(r=>r.file),
      routesWithoutResultText:routeResults.filter(r=>!r.outputs).map(r=>r.file),
      targetedUnitChecks:targeted, targetedSemanticBoundaryChecks:semanticBoundaries, targetedCalculatorBoundaryChecks:calculatorBoundaries, targetedAdvancedBoundaryChecks:advancedBoundaries, failures, routes:routeResults
    };
    fs.writeFileSync(REPORT_PATH,JSON.stringify(report,null,2)+'\n');
    if(process.env.GITHUB_STEP_SUMMARY){
      const summary=[
        '# ClerFit live browser smoke',
        '',
        '- Status: **'+report.status+'**',
        '- Registered calculators: '+report.routeCount,
        '- Routes loaded: '+report.routesLoaded,
        '- Action buttons clicked: '+report.actionsClicked,
        '- Mobile overflows: '+report.mobileOverflow.length,
        '- Page errors: '+report.pageErrors.length,
        '- Console errors: '+report.consoleErrors.length,
        '- Targeted unit checks: '+targeted.length,
        '- Targeted semantic-boundary checks: '+semanticBoundaries.length,
        '- Targeted calculator-boundary checks: '+calculatorBoundaries.length,
        '- Targeted advanced-boundary checks: '+advancedBoundaries.length,
        '- Failures: '+failures.length,
        '',
        ...targeted.map(x=>'- '+x),
        ...semanticBoundaries.map(x=>'- '+x),
        ...calculatorBoundaries.map(x=>'- '+x),
        ...advancedBoundaries.map(x=>'- '+x),
        ...failures.map(x=>'- **FAIL:** '+x)
      ].join('\n');
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary+'\n');
    }
    console.log(JSON.stringify({status:report.status,routeCount:report.routeCount,routesLoaded:report.routesLoaded,actionsClicked:report.actionsClicked,mobileOverflow:report.mobileOverflow.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,targetedUnitChecks:targeted.length,failures:report.failures},null,2));
    if(failures.length)process.exit(1);
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error && error.stack || String(error));process.exit(1);});
