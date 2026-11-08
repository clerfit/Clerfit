'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
  { page: 'neck-circumference.html', fields: { neck: '40' }, result: /Circle-equivalent diameter:/, input: 'neck' },
  { page: 'muac.html', fields: { muac: '30', tricepsSkinfold: '10' }, result: /Total arm area:/, input: 'muac' },
  { page: 'mid-thigh-circumference.html', fields: { thigh: '50', segmentLength: '20' }, result: /Circle-equivalent diameter:/, input: 'thigh' },
  { page: 'calf-circumference.html', fields: { calf: '35', segmentLength: '10' }, result: /Circle-equivalent diameter:/, input: 'calf' },
  { page: 'bai.html', fields: { hip: '100', height: '175', age: '30' }, result: /BAI:/, input: 'hip' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    for (const item of cases) {
      await page.goto(new URL('html/' + item.page, base).href, { waitUntil: 'networkidle' });
      for (const [id, value] of Object.entries(item.fields)) await page.locator('#' + id).fill(value);

      // Switch every associated selector, then verify its range is converted.
      const selectors = page.locator('select[data-unit-for]');
      const count = await selectors.count();
      const originals = [];
      for (let i = 0; i < count; i++) {
        const select = selectors.nth(i);
        const inputId = await select.getAttribute('data-unit-for');
        const input = page.locator('#' + inputId);
        const from = await select.inputValue();
        const options = await select.locator('option').evaluateAll(nodes => nodes.map(n => n.value));
        const to = options.find(value => value !== from);
        const min = Number(await input.getAttribute('min'));
        const max = Number(await input.getAttribute('max'));
        originals.push({ select, input, from, to, min, max });
        await select.selectOption(to);
        const factor = from === 'mm' && to === 'cm' ? 0.1 : from === 'cm' && to === 'in' ? 1 / 2.54 : from === 'mm' && to === 'in' ? 1 / 25.4 : from === 'cm' && to === 'mm' ? 10 : 1;
        assert.ok(Math.abs(Number(await input.getAttribute('min')) - min * factor) < 1e-6,
          item.page + ' converts minimum for ' + inputId);
        assert.ok(Math.abs(Number(await input.getAttribute('max')) - max * factor) < 1e-6,
          item.page + ' converts maximum for ' + inputId);
      }

      await page.locator('#calc-form button[type="reset"]').click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      for (const original of originals) {
        assert.equal(await original.select.inputValue(), original.from, item.page + ' restores default unit');
        assert.equal(Number(await original.input.getAttribute('min')), original.min, item.page + ' restores minimum');
        assert.equal(Number(await original.input.getAttribute('max')), original.max, item.page + ' restores maximum');
      }

      for (const [id, value] of Object.entries(item.fields)) await page.locator('#' + id).fill(value);
      await page.locator('#calc-form button[type="submit"]').click();
      const output = page.locator('#calc-result');
      const text = await output.innerText();
      assert.match(text, item.result, item.page + ' calculates a derived result');
      assert.doesNotMatch(text, /NaN|Infinity/);

      await page.locator('#' + item.input).fill(String(Number(item.fields[item.input]) + 1));
      assert.equal((await output.innerText()).trim(), '', item.page + ' clears stale result after editing an input');

      await page.locator('#calc-form button[type="submit"]').click();
      assert.match(await output.innerText(), item.result, item.page + ' recalculates after editing');
      if (count) {
        await selectors.first().selectOption(originals[0].to);
        assert.equal((await output.innerText()).trim(), '', item.page + ' clears stale result after changing a unit');
      }
    }

    // MUAC cross-field error must identify both inputs and guide focus to skinfold.
    await page.goto(new URL('html/muac.html', base).href, { waitUntil: 'networkidle' });
    await page.locator('#muac').fill('5');
    await page.locator('#tricepsSkinfold').fill('60');
    await page.locator('#calc-form button[type="submit"]').click();
    assert.equal(await page.locator('#muac').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#tricepsSkinfold').getAttribute('aria-invalid'), 'true');
    assert.ok((await page.locator('#tricepsSkinfold').getAttribute('aria-describedby')).includes('calc-result'));
    assert.equal(await page.evaluate(() => document.activeElement.id), 'tricepsSkinfold');

    // Editing either related input must clear invalid state while preserving original help text.
    await page.locator('#tricepsSkinfold').fill('10');
    assert.equal(await page.locator('#muac').getAttribute('aria-invalid'), null);
    assert.equal(await page.locator('#tricepsSkinfold').getAttribute('aria-invalid'), null);
    assert.equal(await page.locator('#muac').getAttribute('aria-describedby'), 'calc-help');
    assert.equal(await page.locator('#tricepsSkinfold').getAttribute('aria-describedby'), 'calc-help');
    assert.equal((await page.locator('#calc-result').innerText()).trim(), '');

    // Reset must remove cached validation nodes; a subsequent invalid submit must create a visible node.
    await page.locator('#muac').fill('');
    await page.locator('#tricepsSkinfold').fill('10');
    await page.locator('#calc-form button[type="submit"]').click();
    await page.locator('#calc-form button[type="reset"]').click();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
    await page.locator('#calc-form button[type="submit"]').click();
    const error = page.locator('#muac + .clerfit-input-error');
    await error.waitFor({ state: 'visible' });
    assert.ok(await error.innerText());

    console.log('PASS: real Chromium unit-switch/reset bounds, stale-result invalidation, recalculation and MUAC accessible error recovery across all five Batch 1 calculators.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
