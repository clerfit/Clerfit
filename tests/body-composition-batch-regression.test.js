'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const ratios = [
  { page:'waist-arm-ratio.html', a:80, b:40, expected:2 },
  { page:'waist-thigh-ratio.html', a:80, b:40, expected:2 },
  { page:'chest-waist-ratio.html', a:100, b:80, expected:1.25 },
  { page:'shoulder-waist-ratio.html', a:120, b:80, expected:1.5 },
  { page:'shoulder-hip-ratio.html', a:120, b:100, expected:1.2 },
  { page:'chest-height-ratio.html', a:100, b:175, expected:100/175 },
  { page:'hip-height-ratio.html', a:100, b:175, expected:100/175 },
  { page:'upper-arm-height-ratio.html', a:35, b:175, expected:0.2 },
  { page:'biacromial-width-ratio.html', a:40, b:175, expected:40/175 }
];
(async () => {
  const browser = await chromium.launch({ headless:true });
  const page = await browser.newPage({ viewport:{ width:390, height:844 } });
  try {
    for (const item of ratios) {
      await page.goto(new URL('html/'+item.page, base).href, { waitUntil:'networkidle' });
      const selector = page.locator('#unit');
      await selector.waitFor({ state:'visible' });
      assert.equal(await selector.getAttribute('data-unit-for'), 'a,b', item.page+' associates both ratio inputs');
      await page.locator('#a').fill(String(item.a));
      await page.locator('#b').fill(String(item.b));
      await selector.selectOption('in');
      const aIn = Number(await page.locator('#a').inputValue());
      const bIn = Number(await page.locator('#b').inputValue());
      assert.ok(Math.abs(aIn-item.a/2.54)<0.001, item.page+' converts numerator to inches');
      assert.ok(Math.abs(bIn-item.b/2.54)<0.001, item.page+' converts denominator to inches');
      await page.locator('#calc-form button[type="submit"]').click();
      const output = await page.locator('#calc-result').innerText();
      assert.match(output, new RegExp('ratio: '+item.expected.toFixed(2).replace('.', '\\.')+' \\('), item.page+' preserves the ratio after unit conversion');
      assert.doesNotMatch(output, /NaN|Infinity/);
      await selector.selectOption('mm');
      assert.ok(Math.abs(Number(await page.locator('#a').inputValue())-item.a*10)<0.01, item.page+' converts numerator to millimetres');
      assert.ok(Math.abs(Number(await page.locator('#b').inputValue())-item.b*10)<0.01, item.page+' converts denominator to millimetres');
      await page.locator('#calc-form button[type="reset"]').click();
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      assert.equal(await selector.inputValue(), 'cm', item.page+' reset restores centimetres');
      assert.equal(await page.locator('#a').inputValue(), '', item.page+' reset clears numerator');
      assert.equal(await page.locator('#b').inputValue(), '', item.page+' reset clears denominator');
    }

    const impossible = [
      { page:'total-body-water.html', values:{measured:'70.01',weight:'70'}, message:/cannot exceed total body mass/i },
      { page:'bone-mass.html', values:{measured:'70.01',weight:'70'}, message:/cannot exceed total body mass/i },
      { page:'intracellular-water.html', values:{compartment:'40',total:'71',weight:'70'}, message:/cannot exceed body mass/i },
      { page:'extracellular-water.html', values:{compartment:'40',total:'71',weight:'70'}, message:/cannot exceed body mass/i }
    ];
    for (const item of impossible) {
      await page.goto(new URL('html/'+item.page, base).href, { waitUntil:'networkidle' });
      for (const [id,value] of Object.entries(item.values)) await page.locator('#'+id).fill(value);
      await page.locator('#calc-form button[type="submit"]').click();
      assert.match(await page.locator('#calc-result').innerText(), item.message, item.page+' rejects physically impossible mass relationships');
    }
    console.log('PASS: nine shared-unit ratio calculators preserve canonical ratios across cm/in/mm, restore units on reset, and four water/bone calculators reject impossible body-mass relationships.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; });
