'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
  { page: 'jp3.html', selects: { sex: 'male' }, fields: { age: '30', chest: '10', abdomen: '15', thigh: '12' }, expected: /11\.21% estimated body fat/ },
  { page: 'jp3.html', selects: { sex: 'female' }, fields: { age: '30', triceps: '20', suprailiac: '15', thigh: '25' }, expected: /24\.13% estimated body fat/ },
  { page: 'jp7.html', selects: { sex: 'male' }, fields: { age: '30', chest: '10', midaxillary: '12', triceps: '15', subscapular: '10', abdomen: '20', suprailiac: '15', thigh: '18' }, expected: /14\.63% estimated body fat/ },
  { page: 'jp7.html', selects: { sex: 'female' }, fields: { age: '30', chest: '10', midaxillary: '12', triceps: '15', subscapular: '10', abdomen: '20', suprailiac: '15', thigh: '18' }, expected: /20\.63% estimated body fat/ },
  { page: 'durnin-womersley.html', selects: { sex: 'male' }, fields: { age: '30', biceps: '5', triceps: '10', subscapular: '12', suprailiac: '14' }, expected: /19\.43% estimated body fat/ },
  { page: 'durnin-womersley.html', selects: { sex: 'female' }, fields: { age: '30', biceps: '5', triceps: '10', subscapular: '12', suprailiac: '14' }, expected: /25\.79% estimated body fat/ },
  { page: 'ymca-body-fat.html', selects: { sex: 'male', weightUnit: 'lb', waistUnit: 'in' }, fields: { weight: '160', waist: '32' }, expected: /13\.29% estimated body fat/ },
  { page: 'ymca-body-fat.html', selects: { sex: 'female', weightUnit: 'lb', waistUnit: 'in' }, fields: { weight: '160', waist: '32' }, expected: /26\.83% estimated body fat/ },
  { page: 'body-fat-comparison.html', fields: { a: '15', b: '20' }, expected: /Change: \+5\.00 percentage points/ },
  { page: 'total-body-water.html', selects: { measuredUnit: 'lb', weightUnit: 'lb' }, fields: { measured: '40', weight: '70' }, expected: /57\.14% of body mass/ },
  { page: 'intracellular-water.html', selects: { compartmentUnit: 'mL', totalUnit: 'mL', weightUnit: 'kg' }, fields: { compartment: '25000', total: '40000', weight: '70' }, expected: /62\.50% of total body water[\s\S]*35\.46% of body mass/ },
  { page: 'extracellular-water.html', selects: { compartmentUnit: 'mL', totalUnit: 'mL', weightUnit: 'kg' }, fields: { compartment: '15000', total: '40000', weight: '70' }, expected: /37\.50% of total body water[\s\S]*21\.28% of body mass/ },
  { page: 'bone-mass.html', selects: { measuredUnit: 'lb', weightUnit: 'lb' }, fields: { measured: '3', weight: '70' }, expected: /4\.29% of body mass/ },
  { page: 'visceral-fat.html', selects: { measuredUnit: 'in2' }, fields: { measured: '120' }, expected: /774\.19 cm² assessment-reported visceral-fat area/ },
  { page: 'subcutaneous-fat.html', selects: { measuredUnit: 'in' }, fields: { measured: '0.5' }, expected: /12\.70 mm assessment-reported subcutaneous-fat thickness/ },
  { page: 'waist-arm-ratio.html', selects: { unit: 'in' }, fields: { a: '80', b: '35' }, expected: /2\.29 ratio/ },
  { page: 'waist-thigh-ratio.html', selects: { unit: 'in' }, fields: { a: '80', b: '55' }, expected: /1\.45 ratio/ },
  { page: 'chest-waist-ratio.html', selects: { unit: 'in' }, fields: { a: '100', b: '80' }, expected: /1\.25 ratio/ },
  { page: 'shoulder-waist-ratio.html', selects: { unit: 'in' }, fields: { a: '120', b: '80' }, expected: /1\.50 ratio/ },
  { page: 'shoulder-hip-ratio.html', selects: { unit: 'in' }, fields: { a: '120', b: '100' }, expected: /1\.20 ratio/ },
  { page: 'chest-height-ratio.html', selects: { unit: 'in' }, fields: { a: '100', b: '180' }, expected: /0\.56 ratio/ },
  { page: 'hip-height-ratio.html', selects: { unit: 'in' }, fields: { a: '100', b: '180' }, expected: /0\.56 ratio/ },
  { page: 'biacromial-width-ratio.html', selects: { unit: 'in' }, fields: { a: '40', b: '25' }, expected: /1\.60 ratio/ },
  { page: 'upper-arm-height-ratio.html', selects: { unit: 'in' }, fields: { a: '35', b: '180' }, expected: /0\.19 ratio/ },
  { page: 'body-fat-change.html', fields: { a: '15', b: '18' }, expected: /Change: \+3\.00 percentage points/ },
  { page: 'fat-free-mass-change.html', selects: { waUnit: 'lb', wbUnit: 'lb' }, fields: { wa: '70', fa: '20', wb: '72', fb: '18' }, expected: /Earlier: 25\.40 kg.*Current: 26\.78 kg.*Change: \+1\.38 kg/ }
];

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const failures = [];
  try {
    for (const item of cases) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      try {
        const response = await page.goto(new URL('html/' + item.page, base).href, { waitUntil: 'domcontentloaded', timeout: 10000 });
        assert.ok(response && response.ok(), item.page + ' loads successfully');
        for (const [id, value] of Object.entries(item.selects || {})) {
          if (id === 'sex') await page.locator('#' + id).selectOption(value);
        }
        for (const [id, value] of Object.entries(item.selects || {})) {
          if (id !== 'sex') await page.locator('#' + id).selectOption(value);
        }
        for (const [id, value] of Object.entries(item.fields || {})) await page.locator('#' + id).fill(value);
        await page.locator('#calc-form button[type="submit"]').click();
        const output = await page.locator('#calc-result').innerText();
        assert.match(output, item.expected, item.page + ' returns the expected known-answer result. Actual output: ' + JSON.stringify(output));
        assert.doesNotMatch(output, /NaN|Infinity|undefined/);
        assert.equal(pageErrors.length, 0, item.page + ' has no uncaught browser errors');

        const firstField = Object.keys(item.fields || {})[0];
        if (firstField) {
          const field = page.locator('#' + firstField);
          await field.fill(String(Number(await field.inputValue()) + 1));
          assert.equal((await page.locator('#calc-result').innerText()).trim(), '', item.page + ' clears stale output after editing');
        }
        await page.locator('#calc-form button[type="reset"]').click();
        assert.equal((await page.locator('#calc-result').innerText()).trim(), '', item.page + ' reset clears the output');
      } catch (error) {
        failures.push(item.page + ': ' + (error && error.message || String(error)));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  assert.deepEqual(failures, [], 'Body-composition known-answer browser failures:\n' + failures.join('\n'));
  console.log('PASS: body-composition browser known-answer, reset, stale-result and runtime-error checks (' + cases.length + ' cases).');
})().catch(error => {
  console.error(error && error.stack || String(error));
  process.exitCode = 1;
});
