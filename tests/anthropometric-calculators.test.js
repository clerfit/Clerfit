#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pages = [
'neck-circumference','muac','mid-thigh-circumference','calf-circumference','bai',
'relative-muscle-mass','skeletal-muscle-mass','almi','fmi','ffmi-comparison',
'waist-circumference-reference','waist-height-comparison','body-volume','body-density',
'anthropometric-z-score','body-measurement-symmetry','arm-waist-ratio','leg-height-ratio','sitting-height-ratio',
'chest-hip-ratio','shoulder-chest-ratio','biacromial-biacristal-width-ratio','sitting-height-arm-span-ratio','arm-span-difference',
'upper-lower-body-segment-ratio','femur-height-ratio','tibia-height-ratio','body-proportion-deviation','anthropometric-measurement-change'
];
const engine = fs.readFileSync('js/anthropometric-calculators.js','utf8');
new Function(engine);
for (const slug of pages) {
 const html = fs.readFileSync('html/'+slug+'.html','utf8');
 assert.match(html,new RegExp('data-calculator="'+slug+'"'));
 assert.match(html,/\.\.\/css\/style\.css/);
 assert.match(html,/\.\.\/js\/anthropometric-calculators\.js/);
 assert.match(html,/\.\.\/js\/tooltips\.js/);
 assert.match(html,/\.\.\/js\/page-chrome\.js/);
 assert.match(html,/<meta name="viewport"/);
 assert.match(html,/<form id="calc-form"/);
 assert.match(html,/aria-live="polite"/);
}
const navigation=fs.readFileSync('js/navigation.js','utf8');
for (const slug of pages) assert.ok(navigation.includes('"'+slug+'"'), 'Navigation missing '+slug);
const sitemap=fs.readFileSync('sitemap.xml','utf8');
for (const slug of pages) assert.ok(sitemap.includes('/html/'+slug+'.html'), 'Sitemap missing '+slug);
console.log('Anthropometric calculator page checks passed: '+pages.length+' pages.');

const sandbox = { window: {}, document: { addEventListener() {} }, Number, Math, Object, RangeError };
vm.runInNewContext(engine, sandbox);
const calc = sandbox.window.ClerFitAnthropometric;
assert.equal(calc.bodyCompositionMetrics(30, 60).relativeMuscleMassPercent, 50);
assert.ok(Math.abs(calc.toKg(66.138678, 'lb') - 30) < 1e-6, 'pounds convert to canonical kilograms');
assert.ok(Math.abs(calc.toHeightCm(70.8661417, 'in') - 180) < 1e-6, 'inches convert to canonical centimetres');
assert.ok(Math.abs(calc.bodyCompositionMetrics(calc.toKg(66.138678, 'lb'), calc.toKg(132.277357, 'lb')).relativeMuscleMassPercent - 50) < 1e-6);
assert.throws(() => calc.bodyCompositionMetrics(61, 60), /cannot exceed total body weight/);
assert.equal(calc.skeletalMuscleMetrics(30, 60, 180).smmiKgM2, 30 / 3.24);
assert.equal(calc.heightIndexedMass(20, 200, 'Fat mass').indexKgM2, 5);
assert.equal(calc.ffmiMetrics(80, 20, 200).ffmiKgM2, 16);
assert.equal(calc.compareFFMI(calc.ffmiMetrics(80, 20, 200), calc.ffmiMetrics(80, 10, 200)).higher, 'B');
assert.throws(() => calc.ffmiMetrics(80, 100, 180), /between 0 and 75/);
assert.throws(() => calc.heightIndexedMass(0, 180, 'Fat mass'), /positive finite/);
assert.throws(() => calc.skeletalMuscleMetrics(20, 60, 79), /between 80 and 250/);
console.log('Batch 2 known-answer and invalid-domain formula checks passed.');


assert.equal(calc.ratioMetrics(100,"cm",100,"cm",40,200,40,200,"Chest","Hip").ratio,1);
assert.ok(Math.abs(calc.ratioMetrics(39.3700787,"in",100,"cm",40,200,40,200,"Chest","Hip").ratio-1)<1e-8);
assert.throws(() => calc.ratioMetrics(30,"cm",100,"cm",40,200,40,200,"Chest","Hip"),/between 40 and 200/);
assert.throws(() => calc.ratioMetrics(100,"cm",0,"cm",40,200,40,200,"Chest","Hip"),/positive finite/);
assert.equal(calc.armSpanDifferenceMetrics(182,"cm",180,"cm").differenceCm,2);
assert.ok(Math.abs(calc.armSpanDifferenceMetrics(70.8661417,"in",180,"cm").differenceCm)<1e-6);
assert.throws(() => calc.armSpanDifferenceMetrics(79,"cm",180,"cm"),/between 80 and 250/);
console.log("Batch 3 anthropometric ratio and arm-span difference formula checks passed.");


assert.equal(calc.upperLowerSegmentMetrics(90,"cm",180,"cm").ratio,1);
assert.ok(Math.abs(calc.ratioMetrics(45,"cm",180,"cm",20,80,80,250,"Femur length","Standing height").ratio-0.25)<1e-12);
assert.ok(Math.abs(calc.ratioMetrics(42,"cm",180,"cm",20,70,80,250,"Tibia length","Standing height").ratio-42/180)<1e-12);
assert.equal(calc.bodyProportionDeviationMetrics(90,"cm",180,"cm",48).deviationPoints,2);
assert.equal(calc.anthropometricMeasurementChangeMetrics(90,"cm",95,"cm").changeCm,5);
assert.throws(() => calc.upperLowerSegmentMetrics(180,"cm",180,"cm"),/must be less than standing height/);
assert.throws(() => calc.bodyProportionDeviationMetrics(181,"cm",180,"cm",50),/must be less than standing height/);
assert.throws(() => calc.anthropometricMeasurementChangeMetrics(0,"cm",95,"cm"),/positive finite/);
console.log("Batch 4 upper/lower, femur/tibia, user-referenced proportion deviation and measurement-change formula checks passed.");
