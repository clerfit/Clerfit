'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
  { page: 'waist-circumference-reference.html', fields: { waist: '80' }, selects: { waistUnit: 'in' }, expected: /80 cm/ },
  { page: 'waist-height-comparison.html', fields: { waistA: '80', heightA: '180', waistB: '90', heightB: '180' }, selects: { unit: 'in' }, expected: /Person A: 0\.444.*Person B: 0\.5.*Absolute difference: 0\.056/ },
  { page: 'body-volume.html', fields: { mass: '70', density: '1.05' }, selects: { massUnit: 'lb' }, expected: /66\.667 L/ },
  { page: 'body-density.html', fields: { mass: '70', volume: '70' }, selects: { massUnit: 'lb', volumeUnit: 'mL' }, expected: /1 kg\/L/ },
  { page: 'anthropometric-z-score.html', fields: { value: '80', mean: '70', sd: '5' }, selects: { unit: 'in' }, expected: /2/ },
  { page: 'body-measurement-symmetry.html', fields: { left: '40', right: '42' }, selects: { unit: 'in' }, expected: /Absolute difference: 2 cm.*Relative difference: 4\.878%/ },
  { page: 'arm-waist-ratio.html', fields: { arm: '35', waist: '80' }, selects: { unit: 'in' }, expected: /0\.438 \(43\.75%\)/ },
  { page: 'leg-height-ratio.html', fields: { leg: '90', height: '180' }, selects: { unit: 'in' }, expected: /0\.5 \(50%\)/ },
  { page: 'sitting-height-ratio.html', fields: { sitting: '90', height: '180' }, selects: { unit: 'in' }, expected: /0\.5 \(50%\)/ }
];

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const failures = [];
  try {
    for (const item of cases) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        const response = await page.goto(new URL('html/' + item.page, base).href, { waitUntil: 'domcontentloaded', timeout: 10000 });
        assert.ok(response && response.ok(), item.page + ' loads');
        for (const [id, value] of Object.entries(item.fields)) await page.locator('#' + id).fill(value);
        for (const [id, value] of Object.entries(item.selects)) await page.locator('#' + id).selectOption(value);
        await page.locator('#calc-form button[type="submit"]').click();
        const output = await page.locator('#calc-result').innerText();
        assert.match(output, item.expected, item.page + ' returns the expected canonical result after unit conversion');
        assert.doesNotMatch(output, /NaN|Infinity|undefined/);
        assert.equal(errors.length, 0, item.page + ' has no uncaught browser errors');
        const first = Object.keys(item.fields)[0];
        await page.locator('#' + first).fill(String(Number(await page.locator('#' + first).inputValue()) + 1));
        assert.equal((await page.locator('#calc-result').innerText()).trim(), '', item.page + ' clears stale output after editing');
        await page.locator('#calc-form button[type="reset"]').click();
        assert.equal((await page.locator('#calc-result').innerText()).trim(), '', item.page + ' reset clears output');
      } catch (error) {
        failures.push(item.page + ': ' + (error && error.message || String(error)));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  assert.deepEqual(failures, [], 'Remaining anthropometric browser failures:\n' + failures.join('\n'));
  console.log('PASS: remaining anthropometric calculators — known answers, unit equivalence, reset and stale-result checks (' + cases.length + ' cases).');
})().catch(error => {
  console.error(error && error.stack || String(error));
  process.exitCode = 1;
});
