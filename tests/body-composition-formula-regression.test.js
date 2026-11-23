#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/body-composition-methods.js','utf8');
function calculate(slug,inputs){
 const els=new Map();let ready;
 const get=id=>{if(!els.has(id))els.set(id,{value:Object.prototype.hasOwnProperty.call(inputs,id)?String(inputs[id]):'',min:'0',max:'10000',innerHTML:'',textContent:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn;},dispatchEvent(){this.handlers.change?.();},closest(){return {hidden:false};},focus(){}});return els.get(id);};
 const form=get('calc-form'),doc={body:{dataset:{calculator:slug}},getElementById:get,addEventListener(type,fn){if(type==='DOMContentLoaded')ready=fn;}};
 vm.runInNewContext(source,{document:doc,window:{},Number,Math,Event:class{}});
 assert.equal(typeof ready,'function');ready();form.handlers.submit({preventDefault(){}});
 return get('calc-result').innerHTML;
}
const value=html=>Number(html.match(/<strong class="cf-result-value">([0-9.]+)/)?.[1]);
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<0.011,label+': expected '+b+', got '+a);
const s3m=50,a3m=30,d3m=1.10938-.0008267*s3m+.0000016*s3m**2-.0002574*a3m;
close(value(calculate('jp3',{sex:'male',age:a3m,chest:12,abdomen:20,thigh:18})),495/d3m-450,'JP3 male');
const s3f=49,a3f=30,d3f=1.0994921-.0009929*s3f+.0000023*s3f**2-.0001392*a3f;
close(value(calculate('jp3',{sex:'female',age:a3f,triceps:14,suprailiac:17,thigh:18})),495/d3f-450,'JP3 female');
assert.match(calculate('jp3',{sex:'female',age:56,triceps:14,suprailiac:17,thigh:18}),/not validated beyond age 55/i);
const s7=130,a7=25,d7=1.097-.00046971*s7+.00000056*s7**2-.00012828*a7;
close(value(calculate('jp7',{sex:'female',age:a7,chest:10,midaxillary:12,triceps:15,subscapular:18,abdomen:20,suprailiac:25,thigh:30})),495/d7-450,'JP7 female');
const densityDW=1.1631-.0632*Math.log10(40);
close(value(calculate('durnin-womersley',{sex:'male',age:25,biceps:8,triceps:10,subscapular:11,suprailiac:11})),495/densityDW-450,'Durnin-Womersley');
const weightLb=80*2.2046226218,waistIn=90/2.54,ymca=(4.15*waistIn-.082*weightLb-98.42)/weightLb*100;
close(value(calculate('ymca-body-fat',{sex:'male',weight:80,waist:90})),ymca,'YMCA conversion and equation');
const change=calculate('body-fat-change',{a:20,b:18});assert.match(change,/-2\.00 percentage points/);assert.match(change,/-10\.00%/);
close(value(calculate('total-body-water',{measured:42,weight:70})),60,'total body water');
assert.match(calculate('intracellular-water',{compartment:28,total:42,weight:70}),/66\.67% of total body water/);
assert.match(calculate('extracellular-water',{compartment:28,total:42,weight:70}),/66\.67% of total body water/);
assert.match(calculate('bone-mass',{measured:3.5,weight:70}),/5\.00% of body mass/);
assert.match(calculate('waist-arm-ratio',{a:80,b:40,unit:'cm'}),/2\.00 ratio/);
assert.match(calculate('fat-free-mass-change',{wa:80,fa:20,wb:78,fb:18}),/Change: -0\.04 kg/);
// Cross-field physical consistency: water and bone mass cannot exceed total body mass.
assert.match(calculate('total-body-water',{measured:42,weight:70}),/60\.00% of body mass/);
assert.match(calculate('total-body-water',{measured:70,weight:70}),/must be less than total body mass/i);
assert.match(calculate('total-body-water',{measured:70.01,weight:70}),/must be less than total body mass/i);
assert.match(calculate('bone-mass',{measured:3.5,weight:70}),/5\.00% of body mass/);
assert.match(calculate('bone-mass',{measured:70,weight:70}),/must be less than total body mass/i);
assert.match(calculate('bone-mass',{measured:70.01,weight:70}),/must be less than total body mass/i);
// Water compartment values must remain internally consistent and respect body mass.
assert.match(calculate('intracellular-water',{compartment:28,total:42,weight:70}),/66\.67% of total body water/);
assert.match(calculate('intracellular-water',{compartment:43,total:42,weight:70}),/must be less than total body water/i);
assert.match(calculate('intracellular-water',{compartment:42,total:42,weight:70}),/must be less than total body water/i);
assert.match(calculate('intracellular-water',{compartment:40,total:71,weight:70}),/must be less than body mass/i);
assert.match(calculate('extracellular-water',{compartment:14,total:42,weight:70}),/33\.33% of total body water/);
assert.match(calculate('extracellular-water',{compartment:14,total:42,weight:40}),/must be less than body mass/i);
// Additional published-equation vectors and the remaining shared ratio variants.
const s7m=130,a7m=25,d7m=1.112-.00043499*s7m+.00000055*s7m**2-.00028826*a7m;
close(value(calculate('jp7',{sex:'male',age:a7m,chest:10,midaxillary:12,triceps:15,subscapular:18,abdomen:20,suprailiac:25,thigh:30})),495/d7m-450,'JP7 male');
const densityDWf=1.1599-.0717*Math.log10(40);
close(value(calculate('durnin-womersley',{sex:'female',age:25,biceps:8,triceps:10,subscapular:11,suprailiac:11})),495/densityDWf-450,'Durnin-Womersley female');
const femaleWeightLb=70*2.2046226218,femaleWaistIn=80/2.54;
const ymcaFemale=(4.15*femaleWaistIn-.082*femaleWeightLb-76.76)/femaleWeightLb*100;
close(value(calculate('ymca-body-fat',{sex:'female',weight:70,waist:80})),ymcaFemale,'YMCA female equation');
assert.match(calculate('body-fat-change',{a:0,b:12}),/12\.00 percentage points/);
assert.doesNotMatch(calculate('body-fat-change',{a:0,b:12}),/Relative change/);
assert.match(calculate('visceral-fat',{measured:125}),/125\.00 cm² assessment-reported visceral-fat area/);
assert.match(calculate('subcutaneous-fat',{measured:12.5}),/12\.50 mm assessment-reported subcutaneous-fat thickness/);
for (const [slug,a,b,expected] of [
  ['waist-thigh-ratio',80,40,2],
  ['chest-waist-ratio',100,80,1.25],
  ['shoulder-waist-ratio',120,80,1.5],
  ['shoulder-hip-ratio',120,100,1.2],
  ['chest-height-ratio',100,175,100/175],
  ['hip-height-ratio',100,175,100/175],
  ['upper-arm-height-ratio',35,175,.2],
  ['biacromial-width-ratio',40,175,40/175]
]) close(value(calculate(slug,{a,b,unit:'cm'})),expected,slug+' canonical ratio');
console.log('Body-composition known-answer formula checks passed.');
