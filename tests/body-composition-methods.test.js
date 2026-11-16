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

process.stdout.write('Body-composition formula regressions passed (9 assertions).\\n');
