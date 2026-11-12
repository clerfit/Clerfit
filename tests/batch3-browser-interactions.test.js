'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
 {page:'chest-hip-ratio.html', terms:['chest circumference','hip circumference'], fields:{chest:'100',hip:'100'}, selectors:{chestUnit:'in',hipUnit:'in'}, expected:/ratio: 1 \(100%\)/},
 {page:'shoulder-chest-ratio.html', terms:['shoulder circumference','chest circumference'], fields:{shoulder:'120',chest:'100'}, selectors:{shoulderUnit:'in',chestUnit:'cm'}, expected:/ratio: 1\.2 \(120%\)/},
 {page:'biacromial-biacristal-width-ratio.html', terms:['biacromial breadth','biacristal breadth'], fields:{biacromial:'40',biacristal:'30'}, selectors:{biacromialUnit:'in',biacristalUnit:'cm'}, expected:/ratio: 1\.333 \(133\.333%\)/},
 {page:'sitting-height-arm-span-ratio.html', terms:['sitting height','arm span'], fields:{sittingHeight:'90',armSpan:'180'}, selectors:{sittingHeightUnit:'in',armSpanUnit:'cm'}, expected:/ratio: 0\.5 \(50%\)/},
 {page:'arm-span-difference.html', terms:['arm span','standing height'], fields:{armSpan:'182',standingHeight:'180'}, selectors:{armSpanUnit:'in',standingHeightUnit:'cm'}, expected:/\+2 cm/}
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try {
  for(const item of cases){
   await page.goto(new URL('html/'+item.page,base).href,{waitUntil:'networkidle'});
   for(const [id,value] of Object.entries(item.fields)) await page.locator('#'+id).fill(value);
   for(const [id,value] of Object.entries(item.selectors)){
    await page.locator('#'+id).selectOption(value);
    const field=id.replace(/Unit$/,'');
    assert.ok(Number(await page.locator('#'+field).inputValue())>0,item.page+' converts '+field);
   }
   await page.locator('#calc-form button[type="submit"]').click();
   const result=await page.locator('#calc-result').innerText();
   assert.match(result,item.expected,item.page+' returns expected canonical calculation');
   assert.doesNotMatch(result,/NaN|Infinity/);
   const firstField=Object.keys(item.fields)[0];
   await page.locator('#'+firstField).fill(String(Number(item.fields[firstField])+1));
   assert.equal((await page.locator('#calc-result').innerText()).trim(),'');
   await page.evaluate(()=>{window.__batch3ResetFired=false;window.__batch3ResetClickFired=false;const f=document.querySelector('#calc-form');const b=f.querySelector('input[type="reset"]');b.addEventListener('click',()=>{window.__batch3ResetClickFired=true;});f.addEventListener('reset',()=>{window.__batch3ResetFired=true;});});
   await page.locator('#calc-form input[type="reset"]').click();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const resetDebug=await page.evaluate(()=>({fired:window.__batch3ResetFired,clickFired:window.__batch3ResetClickFired,formWired:document.querySelector('#calc-form').dataset.clerfitUnitResetWired,inputForm:document.querySelector('#calc-form input[type="reset"]').form?.id,inputType:document.querySelector('#calc-form input[type="reset"]').type}));
   console.log('Batch 3 reset diagnostics '+item.page+': '+JSON.stringify(resetDebug));
   assert.equal(resetDebug.clickFired,true,item.page+' reset button receives click');
   assert.equal(resetDebug.fired,true,item.page+' reset dispatches form reset');
   for(const id of Object.keys(item.selectors)) assert.equal(await page.locator('#'+id).inputValue(),'cm',item.page+' '+id+' reset restores centimetres');
   for(const id of Object.keys(item.fields)) assert.equal(await page.locator('#'+id).inputValue(),'');
   for(const term of item.terms){
    const marker=page.locator('[data-cf-tip="'+term+'"] .cf-tip-trigger').first();
    await marker.waitFor({state:'visible'});
    await marker.click();
    assert.equal(await marker.getAttribute('aria-expanded'),'true',item.page+' exposes '+term+' tooltip');
    await marker.press('Escape');
    assert.equal(await marker.getAttribute('aria-expanded'),'false',item.page+' closes '+term+' tooltip with Escape');
   }
  }
  console.log('PASS: Batch 3 Chromium calculations, independent cm/in selectors, reset, stale-result invalidation and specialist tooltips across all five calculators.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
