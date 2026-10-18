#!/usr/bin/env node
'use strict';

// Exercise actual validator behavior immediately outside every generated numeric field's declared range.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const window = {};
const document = {
  body: { dataset: { calculator: '' } },
  getElementById: () => null
};
const context = vm.createContext({ window, document, console, Intl, Date });
vm.runInContext(fs.readFileSync('js/advanced-calculators.js', 'utf8'), context, {
  filename: 'js/advanced-calculators.js',
  timeout: 3000
});

const definitions = window.ClerFitAdvancedDefinitions;
const validation = window.ClerFitAdvancedValidation;
assert.ok(definitions && validation && typeof validation.validate === 'function');

let tested = 0;
const failures = [];
for (const [key, definition] of Object.entries(definitions)) {
  const boundsById = validation.semanticBounds[key] || {};
  const values = {};
  for (const [id, , unit] of definition.fields) {
    if (unit === 'select') {
      values[id] = 'male';
    } else if (unit === 'datetime-local') {
      values[id] = id === 'end' ? '2026-01-01T09:00' : '2026-01-01T10:00';
    } else {
      const bounds = boundsById[id];
      if (!bounds) continue;
      values[id] = (bounds[0] + bounds[1]) / 2;
    }
  }

  for (const [id, bounds] of Object.entries(boundsById)) {
    const [min, max] = bounds;
    const scale = Math.max(Math.abs(min), Math.abs(max), 1);
    const epsilon = Math.max(Number.EPSILON * scale * 16, scale * 1e-7);

    for (const [edge, invalidValue] of [
      ['below-min', min - epsilon],
      ['above-max', max + epsilon]
    ]) {
      const candidate = { ...values, [id]: invalidValue };
      let thrown = false;
      try {
        validation.validate(key, candidate);
      } catch (error) {
        thrown = true;
      }
      if (!thrown) failures.push(key + '/' + id + ' did not reject ' + edge + ' (' + invalidValue + ')');
      tested++;
    }
  }
}

assert.deepEqual(failures, [], 'Semantic boundary validation failures:\n' + failures.join('\n'));
console.log('PASS: validator rejected values just below and above ' + (tested / 2) +
  ' generated numeric field ranges (' + tested + ' out-of-range cases).');
console.log('Scope: this tests enforcement of configured ranges, not independent scientific approval of each range.');
