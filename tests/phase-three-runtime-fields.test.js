#!/usr/bin/env node
'use strict';

// Structural audit of script-generated advanced-calculator fields.
// This verifies metadata completeness and bounds wiring, not clinical validity of the chosen ranges.
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
assert.ok(definitions && typeof definitions === 'object', 'advanced calculator definitions are exported');
assert.ok(validation && typeof validation.validate === 'function', 'advanced validator is exported');
assert.ok(validation.semanticBounds && typeof validation.semanticBounds === 'object',
  'semantic field bounds metadata is exposed for integrity testing');
assert.ok(validation.ratioBounds && typeof validation.ratioBounds === 'object',
  'ratio field bounds metadata is exposed for integrity testing');

const definitionKeys = Object.keys(definitions);
assert.ok(definitionKeys.length > 0, 'at least one advanced calculator is registered');
const failures = [];
let generatedNumericFields = 0;

for (const [key, definition] of Object.entries(definitions)) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) failures.push(key + ': invalid calculator key');
  if (!definition.title || !definition.description || typeof definition.calculate !== 'function') {
    failures.push(key + ': title, description and calculate function are required');
  }
  if (!Array.isArray(definition.fields) || definition.fields.length === 0) {
    failures.push(key + ': fields must be a non-empty array');
    continue;
  }
  const ids = new Set();
  for (const field of definition.fields) {
    if (!Array.isArray(field) || field.length < 3) {
      failures.push(key + ': every field needs [id, label, unit] metadata');
      continue;
    }
    const [id, label, unit] = field;
    if (typeof id !== 'string' || !id.trim()) failures.push(key + ': field id must be non-empty');
    if (ids.has(id)) failures.push(key + ': duplicate generated field id ' + id);
    ids.add(id);
    if (typeof label !== 'string' || !label.trim()) failures.push(key + '/' + id + ': label is missing');
    if (typeof unit !== 'string' || !unit.trim()) failures.push(key + '/' + id + ': unit/type is missing');

    if (unit !== 'select' && unit !== 'datetime-local') {
      generatedNumericFields++;
      const range = validation.semanticBounds[key] && validation.semanticBounds[key][id];
      if (!Array.isArray(range) || range.length !== 2) {
        failures.push(key + '/' + id + ': numeric field lacks an explicit semantic bound');
      } else {
        const [min, max] = range;
        if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
          failures.push(key + '/' + id + ': semantic bounds must be finite and min < max');
        }
      }
    }
  }
  for (const id of Object.keys(validation.semanticBounds[key] || {})) {
    if (!ids.has(id)) failures.push(key + '/' + id + ': semantic bound points to a missing field');
  }
}

for (const [key, rule] of Object.entries(validation.ratioBounds)) {
  const definition = definitions[key];
  if (!definition) {
    failures.push(key + ': ratio rule references an unknown calculator');
    continue;
  }
  const ids = new Set(definition.fields.map(field => field[0]));
  for (const id of [rule.numerator, rule.denominator]) {
    if (!ids.has(id)) failures.push(key + ': ratio rule references missing field ' + id);
  }
  if (!Number.isFinite(rule.min) || !Number.isFinite(rule.max) || rule.min > rule.max) {
    failures.push(key + ': ratio bounds must be finite and min <= max');
  }
}
assert.deepEqual(failures, [], 'generated advanced-field metadata problems:\n' + failures.join('\n'));

console.log('PASS: ' + definitionKeys.length + ' advanced calculators; ' + generatedNumericFields +
  ' generated numeric fields have explicit semantic bounds; all field IDs and ratio references are consistent.');
console.log('Note: metadata integrity is not independent scientific validation of the selected ranges.');
