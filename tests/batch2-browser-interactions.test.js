'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const cases = [
 {page:'relative-muscle-mass.html', fields:{muscle:'30',weight:'60'}, selectors:{muscleUnit:'lb',weightUnit:'lb'}, expected:/50% of body mass/},
 {page:'skeletal-muscle-mass.html', terms:['SMMI','DXA'], fields:{muscle:'30',weight:'60',height:'180'}, selectors:{muscleUnit:'lb',weightUnit:'lb',heightUnit:'in'}, expected:/SMMI 9\.259 kg\/m²/},
 {page:'almi.html', terms:['ALMI','appendicular lean mass'], fields:{alm:'20',height:'200'}, selectors:{almUnit:'lb',heightUnit:'in'}, expected:/5 kg\/m²/},
 {page:'fmi.html', terms:['FMI'], fields:{fat:'20',height:'200'}, selectors:{fatUnit:'lb',heightUnit:'in'}, expected:/5 kg\/m²/},
 {page:'ffmi-comparison.html', terms:['fat-free mass'], fields:{weightA:'80',fatA:'20',heightA:'200',weightB:'80',fatB:'10',heightB:'200'}, selectors:{weightAUnit:'lb',heightAUnit:'in',weightBUnit:'lb',heightBUnit:'in'}, expected:/Person A: 16 kg\/m² · Person B: 18 kg\/m²/}
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
   for(const term of (item.terms||[])) {\n    const marker=page.locator('[data-cf-tip="'+term+'"] .cf-tip-trigger');\n    await marker.waitFor({state:'visible'});\n    await marker.click();\n    assert.equal(await marker.getAttribute('aria-expanded'),'true',item.page+' exposes '+term+' tooltip');\n    await page.locator('body').click({position:{x:5,y:5}});\n   }\n   const tip=page.locator('.cf-tip-trigger').first();
   await tip.waitFor({state:'visible'});
   await tip.click();
   assert.equal(await tip.getAttribute('aria-expanded'),'true');
   assert.ok(await page.locator('.cf-tip-popover').first().innerText());
   const firstField=Object.keys(item.fields)[0];
   await page.locator('#'+firstField).fill(String(Number(item.fields[firstField])+1));
   assert.equal((await page.locator('#calc-result').innerText()).trim(),'');
   await page.locator('#calc-form button[type="reset"]').click();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
   for(const id of Object.keys(item.selectors)) assert.equal(await page.locator('#'+id).inputValue(),id.startsWith('height')?'cm':'kg',item.page+' reset restores unit');
   for(const id of Object.keys(item.fields)) assert.equal(await page.locator('#'+id).inputValue(),'');
  }
  console.log('PASS: Batch 2 Chromium calculations, kg/lb and cm/in conversion, reset, stale-result invalidation and specialist tooltips across all five calculators.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
