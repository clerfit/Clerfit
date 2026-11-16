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

process.stdout.write('Anthropometric domain regressions passed (13 assertions).\\n');
