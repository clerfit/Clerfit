'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const window = {};
const document = {
  body: { dataset: { calculator: '' } },
  getElementById: () => null,
  addEventListener: () => {}
};

vm.runInNewContext(
  fs.readFileSync('js/body-composition-methods.js', 'utf8'),
  { window, document, Math, Number, RangeError },
  { filename: 'js/body-composition-methods.js', timeout: 3000 }
);

const methods = window.ClerFitBodyComposition;
assert.ok(methods, 'Body-composition calculation API must be available.');

const pages = [
  'jp3', 'jp7', 'durnin-womersley', 'ymca-body-fat',
  'body-fat-comparison', 'total-body-water', 'intracellular-water',
  'extracellular-water', 'bone-mass', 'visceral-fat', 'subcutaneous-fat',
  'waist-arm-ratio', 'waist-thigh-ratio', 'chest-waist-ratio',
  'shoulder-waist-ratio', 'shoulder-hip-ratio', 'chest-height-ratio',
  'hip-height-ratio', 'upper-arm-height-ratio', 'biacromial-width-ratio',
  'body-fat-change', 'fat-free-mass-change'
];
const implementation = fs.readFileSync('js/body-composition-methods.js', 'utf8');
for (const slug of pages) {
  const html = fs.readFileSync('html/' + slug + '.html', 'utf8');
  assert.match(html, new RegExp('data-calculator="' + slug + '"'), slug + ' route marker');
  assert.match(html, /body-composition-methods\.js/, slug + ' shared implementation');
  assert.match(html, /id="calc-form"/, slug + ' calculator form');
  assert.match(html, /id="calc-result"[^>]*aria-live="polite"/, slug + ' live result region');
  assert.ok(implementation.includes(slug + ':') || implementation.includes('"' + slug + '":'), slug + ' implementation schema');
}
assert.equal(pages.length, 22, 'All 22 body-composition routes are included in this suite.');

const logSum = Math.log10(40);
assert.ok(Math.abs(methods.calculateDurninWomersleyDensity('male', 17, 40) - (1.1620 - 0.0630 * logSum)) < 1e-12);
assert.ok(Math.abs(methods.calculateDurninWomersleyDensity('female', 17, 40) - (1.1549 - 0.0678 * logSum)) < 1e-12);
assert.ok(Math.abs(methods.calculateDurninWomersleyDensity('male', 19, 40) - (1.1620 - 0.0630 * logSum)) < 1e-12);
assert.ok(Math.abs(methods.calculateDurninWomersleyDensity('female', 20, 40) - (1.1599 - 0.0717 * logSum)) < 1e-12);
assert.ok(Math.abs(methods.bodyFatFromDensity(1.05) - (495 / 1.05 - 450)) < 1e-12);

assert.throws(() => methods.calculateDurninWomersleyDensity('male', 16, 40), /ages 17–72/);
assert.throws(() => methods.calculateDurninWomersleyDensity('male', 73, 40), /ages 17–72/);
assert.throws(() => methods.calculateDurninWomersleyDensity('other', 20, 40), /equation group/);
assert.throws(() => methods.calculateDurninWomersleyDensity('male', 20, 0), /sum of the four skinfold/);

const jp3Male = methods.calculateJacksonPollockDensity('jp3', 'male', 30, [10, 20, 15]);
const jp3MaleSum = 45;
assert.ok(Math.abs(jp3Male - (1.10938 - 0.0008267 * jp3MaleSum + 0.0000016 * jp3MaleSum ** 2 - 0.0002574 * 30)) < 1e-12);
const jp3Female = methods.calculateJacksonPollockDensity('jp3', 'female', 30, [15, 20, 25]);
const jp3FemaleSum = 60;
assert.ok(Math.abs(jp3Female - (1.0994921 - 0.0009929 * jp3FemaleSum + 0.0000023 * jp3FemaleSum ** 2 - 0.0001392 * 30)) < 1e-12);
const jp7Male = methods.calculateJacksonPollockDensity('jp7', 'male', 30, [5, 6, 7, 8, 9, 10, 11]);
const jp7Sum = 56;
assert.ok(Math.abs(jp7Male - (1.112 - 0.00043499 * jp7Sum + 0.00000055 * jp7Sum ** 2 - 0.00028826 * 30)) < 1e-12);
const jp7Female = methods.calculateJacksonPollockDensity('jp7', 'female', 30, [5, 6, 7, 8, 9, 10, 11]);
assert.ok(Math.abs(jp7Female - (1.097 - 0.00046971 * jp7Sum + 0.00000056 * jp7Sum ** 2 - 0.00012828 * 30)) < 1e-12);
assert.throws(() => methods.calculateJacksonPollockDensity('jp3', 'female', 56, [10, 20, 15]), /supports adults aged/);
assert.throws(() => methods.calculateJacksonPollockDensity('jp7', 'male', 30, [10, 20]), /requires 7 skinfold/);

const ymca = methods.calculateYMCABodyFatPercent(70, 85, 'male');
const expectedYmca = ((4.15 * (85 / 2.54) - 0.082 * (70 * 2.2046226218) - 98.42) / (70 * 2.2046226218)) * 100;
assert.ok(Math.abs(ymca - expectedYmca) < 1e-12);
const bodyFatChange = methods.calculateBodyFatChange(20, 18);
assert.equal(bodyFatChange.percentagePointChange, -2);
assert.equal(bodyFatChange.relativeChangePercent, -10);
assert.equal(methods.calculateBodyFatChange(0, 10).relativeChangePercent, null);
assert.equal(methods.calculateMeasuredProportion(40, 80, 'Water'), 50);
assert.throws(() => methods.calculateMeasuredProportion(81, 80, 'Water'), /cannot exceed total body mass/);
const water = methods.calculateWaterCompartment(10, 40, 80);
assert.equal(water.percentOfTotalWater, 25);
assert.equal(water.percentOfBodyMass, 12.5);
assert.throws(() => methods.calculateWaterCompartment(41, 40, 80), /cannot exceed total body water/);
assert.throws(() => methods.calculateWaterCompartment(10, 90, 80), /cannot exceed body weight/);
assert.equal(methods.calculatePositiveRatio(90, 45), 2);
assert.throws(() => methods.calculatePositiveRatio(90, 0), /positive finite values/);
const ffmChange = methods.calculateFatFreeMassChange(80, 20, 78, 18);
assert.equal(ffmChange.earlier, 64);
assert.ok(Math.abs(ffmChange.current - 63.96) < 1e-12);
assert.ok(Math.abs(ffmChange.change + 0.04) < 1e-12);
assert.throws(() => methods.calculateFatFreeMassChange(80, 80, 78, 18), /0 to 75 percent/);

process.stdout.write('Body-composition formula regressions passed (31 assertions).\\n');
