'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
 {page:'relative-muscle-mass.html',fields:{muscle:'20',weight:'80'},result:/25(?:\.0+)?% of body mass/,selectors:2},
 {page:'skeletal-muscle-mass.html',fields:{muscle:'25',weight:'80',height:'175'},result:/31\.25%[\s\S]*8\.163 kg\/m²/,selectors:3},
 {page:'almi.html',fields:{alm:'20',height:'175'},result:/6\.531 kg\/m²/,selectors:2},
 {page:'fmi.html',fields:{fat:'15',weight:'80',height:'175'},result:/4\.898 kg\/m²/,selectors:3},
 {page:'ffmi-comparison.html',fields:{weightA:'80',fatA:'15',heightA:'175',weightB:'70',fatB:'20',heightB:'170'},result:/Person A:[\s\S]*22\.204 kg\/m²[\s\S]*Person B:[\s\S]*19\.377 kg\/m²/,selectors:4}
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try{
  for(const item of cases){
   await page.goto(new URL('html/'+item.page,base).href,{waitUntil:'networkidle'});
   for(const [id,value] of Object.entries(item.fields)) await page.locator('#'+id).fill(value);
   const selectors=page.locator('select[data-unit-for]');
   assert.equal(await selectors.count(),item.selectors,item.page+' exposes all local unit controls');
   const originals=[];
   for(let i=0;i<await selectors.count();i++){
    const select=selectors.nth(i),id=await select.getAttribute('data-unit-for'),input=page.locator('#'+id);
    const from=await select.inputValue(),to=(await select.locator('option').evaluateAll(ns=>ns.map(n=>n.value))).find(v=>v!==from);
    originals.push({select,input,from,min:Number(await input.getAttribute('min')),max:Number(await input.getAttribute('max'))});
    await select.selectOption(to);
    assert.ok(Number.isFinite(Number(await input.inputValue())),item.page+' keeps finite converted value for '+id);
   }
   await page.locator('#calc-form button[type="reset"]').click();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
   for(const x of originals){
    assert.equal(await x.select.inputValue(),x.from,item.page+' restores unit');
    assert.equal(Number(await x.input.getAttribute('min')),x.min,item.page+' restores minimum');
    assert.equal(Number(await x.input.getAttribute('max')),x.max,item.page+' restores maximum');
   }
   for(const [id,value] of Object.entries(item.fields)) await page.locator('#'+id).fill(value);
   await page.locator('#calc-form button[type="submit"]').click();
   const output=page.locator('#calc-result'),result=await output.innerText();
   assert.match(result,item.result,item.page+' computes expected result');
   assert.doesNotMatch(result,/NaN|Infinity/);
   const first=Object.keys(item.fields)[0];
   await page.locator('#'+first).fill(String(Number(item.fields[first])+1));
   assert.equal((await output.innerText()).trim(),' ',item.page+' invalidates stale output after edit');
  }
  // Semantic guards beyond basic HTML min/max validation.
  await page.goto(new URL('html/relative-muscle-mass.html',base).href,{waitUntil:'networkidle'});
  await page.locator('#muscle').fill('90'); await page.locator('#weight').fill('80');
  await page.locator('#calc-form button[type="submit"]').click();
  assert.match(await page.locator('#calc-result').innerText(),/cannot exceed total body weight/i);
  await page.goto(new URL('html/fmi.html',base).href,{waitUntil:'networkidle'});
  await page.locator('#fat').fill('81'); await page.locator('#weight').fill('80'); await page.locator('#height').fill('175');
  await page.locator('#calc-form button[type="submit"]').click();
  assert.match(await page.locator('#calc-result').innerText(),/cannot exceed total body weight/i);
  await page.goto(new URL('html/ffmi-comparison.html',base).href,{waitUntil:'networkidle'});
  await page.locator('#weightA').fill('80'); await page.locator('#fatA').fill('76');
  await page.locator('#heightA').fill('175'); await page.locator('#weightB').fill('70');
  await page.locator('#fatB').fill('20'); await page.locator('#heightB').fill('170');
  await page.locator('#calc-form button[type="submit"]').click();
  assert.match(await page.locator('#calc-result').innerText(),/body-fat percentage must be between 0 and 75/i);
  console.log('PASS: Batch 2 Chromium calculations, local unit conversion/reset, stale-result clearing and semantic input guards.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
