'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:4173/';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const failures = [];
  const checks = [
    {
      file: 'absi.html',
      fields: { waist: '85', height: '175', weight: '70' },
      selects: { waistUnit: 'cm', heightUnit: 'cm', weightUnit: 'lb' },
      button: 'button[onclick="calculateABSI()"]',
      expected: /ABSI:\s*0\.080/,
      result: '#result',
      name: 'ABSI canonical kg conversion',
      resetButton: 'button[onclick="resetABSI()"]'
    },
    {
      file: 'heat-exposure.html',
      fields: { tempC: '35', humidity: '50', duration: '60' },
      selects: { tempUnit: 'F', timeUnit: 'minutes' },
      button: 'button[onclick="calculateHeat()"]',
      expected: /Estimated heat index: 40\.7 °C \(105\.2 °F\)/,
      result: '#result',
      name: 'Heat-index Celsius/Fahrenheit equivalence',
      resetButton: 'button[onclick="resetHeat()"]'
    },
    {
      file: 'cold-exposure.html',
      fields: { tempC: '0', windSpeed: '10', duration: '30' },
      selects: { tempUnit: 'F', windUnit: 'kmh', timeUnit: 'minutes' },
      button: 'button[onclick="calculateCold()"]',
      expected: /Estimated wind-chill temperature: -3\.3 °C/,
      result: '#result',
      name: 'Wind-chill Celsius/Fahrenheit equivalence',
      resetButton: 'button[onclick="resetCold()"]'
    }
  ];

  try {
    for (const item of checks) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      try {
        const response = await page.goto(new URL('html/' + item.file, base).href, { waitUntil: 'domcontentloaded', timeout: 10000 });
        assert.ok(response && response.ok(), item.file + ' loads');
        for (const [id, value] of Object.entries(item.fields)) await page.locator('#' + id).fill(value);
        for (const [id, value] of Object.entries(item.selects)) await page.locator('#' + id).selectOption(value);
        await page.locator(item.button).click();
        const output = await page.locator(item.result).innerText();
        assert.match(output, item.expected, item.name + ' expected result; actual: ' + JSON.stringify(output));
        if (item.file === 'heat-exposure.html') {
          const initialHeatIndex = output.match(/Estimated heat index: ([0-9.]+) °C/)?.[1];
          assert.ok(initialHeatIndex, 'Heat-index result is present');
          assert.match(output, /shown for context only/i, 'Duration, sun and work intensity are identified as context only');
          await page.locator('#sunExposure').selectOption('10');
          await page.locator('#intensity').selectOption('1.6');
          await page.locator('#duration').fill('120');
          await page.locator(item.button).click();
          const contextOutput = await page.locator(item.result).innerText();
          assert.equal(contextOutput.match(/Estimated heat index: ([0-9.]+) °C/)?.[1], initialHeatIndex,
            'Context-only sun, intensity and duration fields must not alter the numeric shade heat index');
        }
        assert.equal(pageErrors.length, 0, item.file + ' has no uncaught page errors');
        const firstField = Object.keys(item.fields)[0];
        await page.locator('#' + firstField).fill(String(Number(await page.locator('#' + firstField).inputValue()) + 1));
        assert.equal((await page.locator(item.result).innerText()).trim(), '', item.file + ' clears stale output after input edit');
        await page.locator(item.resetButton).click();
        assert.equal((await page.locator(item.result).innerText()).trim(), '', item.file + ' reset clears the result');
        for (const id of Object.keys(item.fields)) {
          assert.equal(await page.locator('#' + id).inputValue(), '', item.file + ' reset clears ' + id);
        }
      } catch (error) {
        failures.push(item.file + ': ' + (error && error.message || String(error)));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  assert.deepEqual(failures, [], 'Legacy unit-equivalence browser failures:\n' + failures.join('\n'));
  console.log('PASS: ABSI, heat-index and wind-chill local-unit equivalence and stale-result checks (' + checks.length + ' cases).');
})().catch(error => {
  console.error(error && error.stack || String(error));
  process.exitCode = 1;
});
