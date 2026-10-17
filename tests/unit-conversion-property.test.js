#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('js/unit-system.js', 'utf8');
const window = { location: { pathname: '/Clerfit/tests/unit-conversion-property.test.js' } };
const document = { readyState: 'complete', querySelectorAll: () => [], addEventListener() {} };
const context = vm.createContext({ window, document, console, Number, Math, Array, String, Set });
vm.runInContext(source, context, { filename: 'js/unit-system.js', timeout: 3000 });
const units = window.ClerFitUnits;
assert.ok(units && typeof units.convert === 'function', 'unit conversion API must be exported');

let checks = 0;
function near(actual, expected, epsilon, label) {
  assert.ok(Number.isFinite(actual), label + ' must be finite');
  assert.ok(Math.abs(actual - expected) <= epsilon, label + ': expected ' + expected + ', received ' + actual);
  checks++;
}
near(units.convert(70, 'kg', 'lb'), 154.3235835, 0.0001, 'kg to lb');
near(units.convert(170, 'cm', 'm'), 1.7, 1e-10, 'cm to m');
near(units.convert(1.75, 'm', 'cm'), 175, 1e-10, 'm to cm');
near(units.convert(0, 'c', 'f'), 32, 1e-9, 'freezing point conversion');
near(units.convert(100, 'c', 'f'), 212, 1e-9, 'boiling point conversion');
near(units.convert(-40, 'c', 'f'), -40, 1e-9, 'negative temperature conversion');
near(units.convert(10, 'min_per_km', 'min_per_mile'), 16.09344, 1e-8, 'running pace conversion');
near(units.convert(1, 'mi', 'km'), 1.609344, 1e-9, 'miles to kilometres');
near(units.convert(1000, 'ml', 'l'), 1, 1e-12, 'millilitres to litres');
near(units.convert(1, 'gal', 'l'), 3.785411784, 1e-9, 'US gallons to litres');

near(units.convert(units.convert(70, 'kg', 'lb'), 'lb', 'kg'), 70, 1e-9, 'mass round trip');
near(units.convert(units.convert(170, 'cm', 'in'), 'in', 'cm'), 170, 1e-9, 'length round trip');
near(units.convert(units.convert(5, 'km', 'mi'), 'mi', 'km'), 5, 1e-9, 'distance round trip');
near(units.convert(units.convert(2, 'l', 'gal'), 'gal', 'l'), 2, 1e-9, 'volume round trip');
near(units.convert(units.convert(18, 'c', 'f'), 'f', 'c'), 18, 1e-9, 'temperature round trip');
near(units.convert(units.convert(8, 'min_per_km', 'min_per_mile'), 'min_per_mile', 'min_per_km'), 8, 1e-9, 'pace round trip');

assert.ok(Number.isNaN(units.convert(10, 'kg', 'cm')), 'incompatible dimensions must be rejected');
assert.ok(Number.isNaN(units.convert(Infinity, 'kg', 'lb')), 'infinite inputs must be rejected');
assert.ok(Number.isNaN(units.convert(NaN, 'kg', 'lb')), 'NaN inputs must be rejected');
checks += 3;

console.log('Unit conversion property checks passed: ' + checks + ' assertions.');
