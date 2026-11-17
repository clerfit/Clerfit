'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const window = {};
const document = {
  body: { dataset: { calculator: '' } },
  getElementById: () => null,
  addEventListener: () => {},
  querySelectorAll: () => []
};

vm.runInNewContext(
  fs.readFileSync('js/anthropometric-calculators.js', 'utf8'),
  { window, document, Number, Math, Object, Array, String, RangeError },
  { filename: 'js/anthropometric-calculators.js', timeout: 3000 }
);

const api = window.ClerFitAnthropometric;
assert.ok(api, 'Anthropometric calculation API must be exported for regression tests.');

const comparison = api.calculateWaistHeightComparison(80, 170, 90, 180);
assert.ok(Math.abs(comparison.personA - 80 / 170) < 1e-12);
assert.ok(Math.abs(comparison.personB - 0.5) < 1e-12);
assert.ok(Math.abs(comparison.absoluteDifference - (0.5 - 80 / 170)) < 1e-12);

assert.equal(api.calculateBodyVolume(70, 1), 70);
assert.equal(api.calculateBodyDensity(70, 70), 1);
assert.equal(api.calculateZScore(70, 60, 5), 2);

const symmetry = api.calculateMeasurementSymmetry(40, 42);
assert.equal(symmetry.absoluteDifference, 2);
assert.ok(Math.abs(symmetry.relativeDifferencePercent - (2 / 41) * 100) < 1e-12);

const circle = api.circleMetrics('neck-circumference', 37, 'cm');
assert.ok(Math.abs(circle.diameterCm - 37 / Math.PI) < 1e-12);
assert.ok(Math.abs(circle.areaCm2 - (37 * 37) / (4 * Math.PI)) < 1e-12);
const cylinder = api.circleMetrics('mid-thigh-circumference', 50, 'cm', 40, 'cm');
assert.ok(Math.abs(cylinder.volumeCm3 - (50 * 50) / (4 * Math.PI) * 40) < 1e-10);

const muac = api.muacMetrics(30, 'cm', 10, 'mm');
const expectedMuscleCircumference = 30 - Math.PI;
assert.ok(Math.abs(muac.muscleCircumferenceCm - expectedMuscleCircumference) < 1e-12);
assert.ok(Math.abs(muac.totalArmAreaCm2 - 900 / (4 * Math.PI)) < 1e-12);
assert.ok(muac.fatAreaPercent > 0 && muac.fatAreaPercent < 100);

const bai = api.calculateBAI(100, 'cm', 180, 'cm', 30);
assert.ok(Math.abs(bai.value - (100 / Math.pow(1.8, 1.5) - 18)) < 1e-12);
assert.throws(() => api.calculateBAI(100, 'cm', 180, 'cm', 17), /adults aged 18–120/);
assert.throws(() => api.muacMetrics(10, 'cm', 40, 'mm'), /too large for this MUAC/);

for (const [name, operation] of [
  ['waist-height zero denominator', () => api.calculateWaistHeightComparison(80, 170, 90, 0)],
  ['body-volume zero density', () => api.calculateBodyVolume(70, 0)],
  ['body-density zero volume', () => api.calculateBodyDensity(70, 0)],
  ['z-score zero standard deviation', () => api.calculateZScore(70, 60, 0)],
  ['symmetry zero left measurement', () => api.calculateMeasurementSymmetry(0, 42)],
  ['symmetry non-finite measurement', () => api.calculateMeasurementSymmetry(Infinity, 42)]
]) {
  assert.throws(operation, undefined, name + ' must be rejected');
}

assert.throws(() => api.calculateBodyVolume(NaN, 1), /positive finite value/);
assert.throws(() => api.calculateBodyDensity(70, Infinity), /positive finite value/);
assert.throws(() => api.calculateZScore(NaN, 60, 5), /finite numbers/);


/* Unit-conversion, comparison and indexed-mass regression coverage. */
assert.equal(api.toCm(1, 'in', 'Length'), 2.54);
assert.equal(api.toCm(1, 'ft', 'Length'), 30.48);
assert.ok(Math.abs(api.toKg(1, 'lb') - 0.45359237) < 1e-12);
assert.throws(() => api.toCm(10, 'yards', 'Length'), /supported length unit/);
assert.throws(() => api.toKg(10, 'stone'), /kilograms/);
assert.throws(() => api.ratioMetrics(90, 'cm', 0, 'cm', 40, 200, 40, 200, 'A', 'B'), /positive finite/);
assert.throws(() => api.ratioMetrics(10, 'cm', 20, 'cm', 40, 200, 40, 200, 'A', 'B'), /between 40 and 200/);
const ratio = api.ratioMetrics(10, 'in', 25.4, 'cm', 10, 200, 10, 200, 'A', 'B');
assert.ok(Math.abs(ratio.ratio - 1) < 1e-12);
const span = api.armSpanDifferenceMetrics(180, 'cm', 70.8661417323, 'in');
assert.ok(Math.abs(span.differenceCm) < 1e-8);
assert.throws(() => api.armSpanDifferenceMetrics(0, 'cm', 180, 'cm'), /positive finite/);
const relative = api.calculateRelativeMuscleMass(30, 'kg', 75, 'kg');
assert.equal(relative.percent, 40);
const skeletal = api.calculateSkeletalMuscleMass(30, 'kg', 75, 'kg', 180, 'cm');
assert.ok(Math.abs(skeletal.index - (30 / 3.24)) < 1e-12);
assert.throws(() => api.calculateSkeletalMuscleMass(80, 'kg', 75, 'kg', 180, 'cm'), /cannot exceed/);
const almi = api.calculateALMI(20, 'kg', 200, 'cm');
assert.equal(almi.index, 5);
const fmi = api.calculateFMI(18, 'kg', 180, 'cm');
assert.ok(Math.abs(fmi.index - (18 / 3.24)) < 1e-12);
const ffmi = api.calculateFFMI(80, 'kg', 15, 180, 'cm', 176.369809, 'lb', 15, 70.8661417, 'in');
assert.ok(Math.abs(ffmi.a.index - ffmi.b.index) < 1e-7);
assert.equal(ffmi.higher, 'equal');
assert.throws(() => api.calculateBAI(100, 'cm', 180, 'cm', 30.5), /adults aged/);
assert.throws(() => api.calculateFMI(0, 'kg', 180, 'cm'), /positive finite/);
assert.throws(() => api.calculateFFMI(80, 'kg', 80, 180, 'cm', 80, 'kg', 15, 180, 'cm'), /between 0 and 75/);

process.stdout.write('Anthropometric domain regressions passed (43 assertions).\\n');
