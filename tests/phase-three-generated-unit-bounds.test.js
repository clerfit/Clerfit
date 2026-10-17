#!/usr/bin/env node
'use strict';

// Regression tests for generated numeric inputs whose visible units can change.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const window = { location: { pathname: '/html/advanced.html' } };
const document = {
  readyState: 'complete',
  body: { dataset: { calculator: '' } },
  querySelectorAll: () => [],
  addEventListener() {},
  getElementById: () => null
};
const context = vm.createContext({ window, document, console, Intl, Date });
vm.runInContext(fs.readFileSync('js/unit-system.js', 'utf8'), context, {
  filename: 'js/unit-system.js',
  timeout: 3000
});
vm.runInContext(fs.readFileSync('js/advanced-calculators.js', 'utf8'), context, {
  filename: 'js/advanced-calculators.js',
  timeout: 3000
});

const validation = window.ClerFitAdvancedValidation;
assert.ok(validation && typeof validation.displayBounds === 'function',
  'display-unit bound conversion API must be exported for regression testing');

function range(key, id, unit) {
  const result = validation.displayBounds(key, id, unit);
  assert.ok(result && result.length === 2, key + '/' + id + ' must have bounds in ' + unit);
  return Array.from(result);
}
function near(actual, expected, epsilon, label) {
  assert.ok(Number.isFinite(actual), label + ' must be finite');
  assert.ok(Math.abs(actual - expected) <= epsilon,
    label + ': expected ' + expected + ', received ' + actual);
}

assert.deepEqual(range('facial-thirds', 'upper', 'mm'), [10, 150],
  'base-unit bounds remain unchanged');
assert.deepEqual(range('facial-thirds', 'upper', 'cm'), [1, 15],
  'millimetre bounds convert to centimetres');
const inches = range('facial-thirds', 'upper', 'in');
near(inches[0], 10 / 25.4, 1e-12, 'minimum mm to inches');
near(inches[1], 150 / 25.4, 1e-12, 'maximum mm to inches');
const pounds = range('bmi-for-age', 'weight', 'lb');
near(pounds[0], 4.5 / 0.45359237, 1e-10, 'minimum kg to pounds');
near(pounds[1], 300 / 0.45359237, 1e-8, 'maximum kg to pounds');
const minutes = range('rest-interval', 'work', 'minutes');
assert.deepEqual(minutes, [1 / 60, 60],
  'seconds bounds convert to minutes');
assert.equal(validation.displayBounds('unknown-calculator', 'x', 'cm'), null,
  'unknown field has no bounds');
assert.equal(validation.displayBounds('facial-thirds', 'upper', 'unsupported-unit'), null,
  'unsupported conversion does not create invalid bounds');

const source = fs.readFileSync('js/advanced-calculators.js', 'utf8');
assert.match(source, /fields\.querySelectorAll\('\.cf-advanced-unit'\)/,
  'generated unit selectors must attach bound synchronization');
assert.match(source, /selector\.addEventListener\('change', syncBounds\)/,
  'changing a unit must update native input bounds');
console.log('PASS: display-unit bounds, conversion edge cases, unsupported units and UI change wiring.');
