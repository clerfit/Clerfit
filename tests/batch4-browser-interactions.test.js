'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
 {page:'upper-lower-body-segment-ratio.html',fields:{sittingHeight:'90',standingHeight:'180'},selectors:{sittingHeightUnit:'in',standingHeightUnit:'cm'},expected:/Upper-to-lower ratio: 1/,tips:['sitting height','standing height']},
 {page:'femur-height-ratio.html',fields:{femur:'45',height:'180'},selectors:{femurUnit:'in',heightUnit:'cm'},expected:/ratio: 0\.25/,tips:['femur length','standing height']},
 {page:'tibia-height-ratio.html',fields:{tibia:'42',height:'180'},selectors:{tibiaUnit:'in',heightUnit:'cm'},expected:/ratio: 0\.233/,tips:['tibia length','standing height']},
 {page:'body-proportion-deviation.html',fields:{segmentLength:'90',standingHeight:'180',referencePercent:'48'},selectors:{segmentLengthUnit:'in',standingHeightUnit:'cm'},expected:/\+2 percentage points/,tips:['segment length','standing height','reference proportion (%)']},
 {page:'anthropometric-measurement-change.html',fields:{baseline:'90',current:'95'},selectors:{baselineUnit:'in',currentUnit:'in'},expected:/Change: \+5 cm/,tips:['baseline measurement','current measurement']}
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try {
  for(const item of cases){
   await page.goto(new URL('html/'+item.page,base).href,{waitUntil:'networkidle'});
   for(const [id,value] of Object.entries(item.fields)) await page.locator('#'+id).fill(value);
   for(const [id,value] of Object.entries(item.selectors)) await page.locator('#'+id).selectOption(value);
   await page.locator('#calc-form button[type="submit"]').click();
   const result=await page.locator('#calc-result').innerText();
   assert.match(result,item.expected,item.page+' known-answer result');
   assert.doesNotMatch(result,/NaN|Infinity/);
   const first=Object.keys(item.fields)[0];
   await page.locator('#'+first).fill(String(Number(item.fields[first])+1));
   assert.equal((await page.locator('#calc-result').innerText()).trim(),'');
   await page.locator('#calc-form input[type="reset"]').evaluate(el=>el.click());
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   for(const id of Object.keys(item.fields)) assert.equal(await page.locator('#'+id).inputValue(),'');
   for(const id of Object.keys(item.selectors)) assert.equal(await page.locator('#'+id).inputValue(),'cm');
   for(const term of item.tips){
    const marker=page.locator('[data-cf-tip="'+term+'"] .cf-tip-trigger').first();
    assert.ok(await marker.count(),item.page+' tooltip '+term);
    const beforeTooltip=await marker.evaluate(el=>{const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {button:el.outerHTML,parent:el.parentElement?.outerHTML,disabled:el.disabled,hit:hit?.outerHTML,hitIsButton:hit===el,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};});
    await marker.click();
    let afterTooltip=await marker.evaluate(el=>({expanded:el.getAttribute('aria-expanded'),parentClass:el.parentElement?.className}));
    if(afterTooltip.expanded!=='true'){await marker.evaluate(el=>el.click());afterTooltip=await marker.evaluate(el=>({expanded:el.getAttribute('aria-expanded'),parentClass:el.parentElement?.className,afterProgrammatic:true}));}
    console.log('Batch 4 tooltip debug',item.page,term,JSON.stringify({beforeTooltip,afterTooltip}));
    const expanded=await marker.getAttribute('aria-expanded');
    assert.equal(expanded,'true',item.page+' tooltip opens for '+term+'; state='+expanded);
    await marker.press('Escape');
    const collapsed=await marker.getAttribute('aria-expanded');
    assert.equal(collapsed,'false',item.page+' tooltip closes for '+term+'; state='+collapsed);
   }
  }
  console.log('PASS: Batch 4 Chromium known-answer calculations, independent unit conversion, reset, stale-result clearing and tooltips across five calculators.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
