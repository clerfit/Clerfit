'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
  {page:'waist-circumference-reference.html', values:{waist:'85'}, expected:/85 cm/},
  {page:'waist-height-comparison.html', values:{waistA:'80',heightA:'175',waistB:'90',heightB:'180'}, expected:/Person A: 0\.457 · Person B: 0\.5 · Absolute difference: 0\.043/},
  {page:'body-volume.html', values:{mass:'70',density:'1.05'}, expected:/66\.667 L/},
  {page:'body-density.html', values:{mass:'70',volume:'66\.6667'}, expected:/1\.05 kg\/L/},
  {page:'anthropometric-z-score.html', values:{value:'80',mean:'70',sd:'5'}, expected:/2\.00/},
  {page:'body-measurement-symmetry.html', values:{left:'40',right:'42'}, expected:/Absolute difference: 2 cm · Relative difference: 4\.878%/},
  {page:'arm-waist-ratio.html', values:{arm:'35',waist:'80'}, expected:/0\.438 \(43\.75%\)/},
  {page:'leg-height-ratio.html', values:{leg:'90',height:'180'}, expected:/0\.5 \(50%\)/},
  {page:'sitting-height-ratio.html', values:{sitting:'90',height:'180'}, expected:/0\.5 \(50%\)/}
];
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  try{
    for(const item of cases){
      await page.goto(new URL('html/'+item.page,base).href,{waitUntil:'networkidle'});
      for(const [id,value] of Object.entries(item.values)) await page.locator('#'+id).fill(value);
      await page.locator('#calc-form button[type="submit"]').click();
      const output=await page.locator('#calc-result').innerText();
      assert.match(output,item.expected,item.page+' known-answer calculation');
      assert.doesNotMatch(output,/NaN|Infinity/);
      const first=Object.keys(item.values)[0];
      await page.locator('#'+first).fill(String(Number(item.values[first])+1));
      assert.equal((await page.locator('#calc-result').innerText()).trim(),'',item.page+' clears stale result after edits');
      await page.locator('#calc-form button[type="reset"]').click();
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      for(const id of Object.keys(item.values)) assert.equal(await page.locator('#'+id).inputValue(),'');
    }
    await page.goto(new URL('html/anthropometric-z-score.html',base).href,{waitUntil:'networkidle'});
    await page.locator('#value').fill('80'); await page.locator('#mean').fill('70'); await page.locator('#sd').fill('0');
    await page.locator('#calc-form button[type="submit"]').click();
    assert.doesNotMatch(await page.locator('#calc-result').innerText(),/NaN|Infinity|Z-score:/,'zero standard deviation must not produce a result');
    console.log('PASS: nine remaining anthropometric calculators return known-answer results, invalidate stale outputs, reset cleanly and reject zero standard deviation.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
