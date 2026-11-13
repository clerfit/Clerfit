'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={},document={readyState:'complete',body:{dataset:{calculator:''}},getElementById:()=>null};
vm.runInNewContext(fs.readFileSync('js/micronutrient-calculators.js','utf8'),vm.createContext({window,document,console,Number,Math}),{timeout:3000});
const api=window.ClerFitMicronutrients;assert.ok(api);
const eq=(a,b,m)=>assert.ok(Math.abs(a-b)<1e-9,m);
eq(api.getReference('vitamin-a-intake',17,'male').rda,900,'teen male A');eq(api.getReference('vitamin-a-intake',17,'female').rda,700,'teen female A');
eq(api.getReference('vitamin-a-intake',25,'female','pregnancy').rda,770,'pregnancy A');eq(api.getReference('vitamin-a-intake',17,'female','lactation').rda,1200,'lactation A');
eq(api.getReference('vitamin-b12-intake',17,'male').rda,2.4,'B12 teen');eq(api.getReference('vitamin-b12-intake',25,'female','pregnancy').rda,2.6,'B12 pregnancy');eq(api.getReference('vitamin-b12-intake',25,'female','lactation').rda,2.8,'B12 lactation');
eq(api.getReference('vitamin-b6-intake',17,'male').rda,1.3,'B6 teen male');eq(api.getReference('vitamin-b6-intake',17,'female').rda,1.2,'B6 teen female');eq(api.getReference('vitamin-b6-intake',55,'female').rda,1.5,'B6 older female');
eq(api.getReference('vitamin-c-intake',17,'male').rda,75,'C teen male');eq(api.getReference('vitamin-c-intake',17,'female').rda,65,'C teen female');eq(api.getReference('vitamin-c-intake',25,'female','pregnancy').rda,85,'C pregnancy');
eq(api.evaluateIntake('vitamin-c-intake',75,'mg',17,'male').percent,100,'C 100%');eq(api.evaluateIntake('vitamin-b6-intake',1300,'mcg',17,'male').intake,1.3,'B6 mcg conversion');eq(api.evaluateIntake('vitamin-c-intake',75000,'mcg',17,'male').percent,100,'C mcg conversion');
assert.equal(api.evaluateIntake('vitamin-b6-intake',81,'mg',17,'male').exceedsUL,true);assert.equal(api.evaluateIntake('vitamin-c-intake',1801,'mg',17,'male').exceedsUL,true);
assert.equal(api.evaluateIntake('vitamin-b12-intake',1000,'mcg',17,'male').ul,null);assert.equal(api.evaluateIntake('vitamin-a-intake',900,'mcg RAE',17,'male').ul,null);
const daily=api.evaluateDaily({vitaminA:900,vitaminB12:2.4,vitaminB6:1300,vitaminB6Unit:'mcg',vitaminC:75,vitaminCUnit:'mg'},17,'male');assert.equal(daily.length,4);daily.forEach(x=>eq(x.percent,100,x.name));
assert.throws(()=>api.getReference('vitamin-c-intake',13,'male'),/14 to 120/);assert.throws(()=>api.getReference('vitamin-c-intake',17,'unknown'),/reference sex/);assert.throws(()=>api.getReference('vitamin-c-intake',17,'male','pregnancy'),/female profiles/);assert.throws(()=>api.evaluateIntake('vitamin-c-intake',-1,'mg',17,'male'),/finite value/);assert.throws(()=>api.evaluateIntake('vitamin-b6-intake',1000001,'mcg',17,'male'),/must not exceed/);assert.throws(()=>api.evaluateIntake('vitamin-c-intake',10000001,'mcg',17,'male'),/must not exceed/);
for(const slug of ['daily-micronutrient-intake','vitamin-a-intake','vitamin-b12-intake','vitamin-b6-intake','vitamin-c-intake']){const h=fs.readFileSync('html/'+slug+'.html','utf8');assert.match(h,/id="calc-form"/);assert.match(h,/id="calc-result"/);assert.match(h,/data-cf-tip=/);assert.match(h,/page-chrome\.js/);assert.match(h,/rel="canonical"/);}
console.log('Batch 5 micronutrient formula, life-stage, unit-conversion, UL-context and markup checks passed.');
