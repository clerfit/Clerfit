#!/usr/bin/env node
'use strict';

// Phase 3 guardrail: structural bounds must be machine-valid before semantic review.
// Passing this test does NOT certify that a field's bounds are scientifically appropriate.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function parseCsv(text) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { value += '"'; i++; }
        else quoted = false;
      } else value += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(value); value = ''; }
    else if (ch === '\n') {
      row.push(value.replace(/\r$/, ''));
      if (row.some(cell => cell !== '')) rows.push(row);
      row = []; value = '';
    } else value += ch;
  }
  if (value !== '' || row.length) { row.push(value.replace(/\r$/, '')); rows.push(row); }
  assert.equal(quoted, false, 'CSV must not end inside a quoted field');
  return rows;
}
function readCsv(file) {
  const rows = parseCsv(fs.readFileSync(path.join(root, file), 'utf8'));
  const header = rows[0];
  assert.ok(header && header.length, file + ' must have a header');
  return { header, rows: rows.slice(1).map(row => Object.fromEntries(header.map((key, i) => [key, row[i] ?? '']))) };
}

const audit = readCsv('FIELD_VALIDATION_AUDIT.csv');
const boundary = readCsv('INPUT_BOUNDARY_VERIFIED.csv');
const required = ['file', 'id', 'min', 'max', 'step'];
for (const field of required) {
  assert.ok(audit.header.includes(field), 'FIELD_VALIDATION_AUDIT.csv missing ' + field);
  assert.ok(boundary.header.includes(field), 'INPUT_BOUNDARY_VERIFIED.csv missing ' + field);
}
assert.equal(audit.rows.length, 241, 'expected 241 static numeric field audit rows');
assert.equal(boundary.rows.length, 241, 'expected 241 static numeric boundary rows');

const keyOf = row => row.file.replace(/^html\//, '') + '|' + row.id;
const auditByKey = new Map(audit.rows.map(row => [keyOf(row), row]));
const boundaryByKey = new Map(boundary.rows.map(row => [keyOf(row), row]));
assert.equal(auditByKey.size, audit.rows.length, 'field audit has duplicate file/id keys');
assert.equal(boundaryByKey.size, boundary.rows.length, 'boundary inventory has duplicate file/id keys');
assert.deepEqual([...auditByKey.keys()].sort(), [...boundaryByKey.keys()].sort(),
  'field audit and boundary inventory must cover the same exact fields');

const issues = [];
for (const row of boundary.rows) {
  const label = keyOf(row);
  const min = Number(row.min);
  const max = Number(row.max);
  if (row.min.trim() === '' || !Number.isFinite(min)) issues.push(label + ': min must be finite');
  if (row.max.trim() === '' || !Number.isFinite(max)) issues.push(label + ': max must be finite');
  if (Number.isFinite(min) && Number.isFinite(max) && min >= max) issues.push(label + ': min must be less than max');
  if (row.step !== 'any') {
    const step = Number(row.step);
    if (row.step.trim() === '' || !Number.isFinite(step) || step <= 0) {
      issues.push(label + ': step must be "any" or a finite positive number');
    }
  }
  const auditRow = auditByKey.get(label);
  for (const field of ['min', 'max', 'step']) {
    if (auditRow[field] !== row[field]) issues.push(label + ': ' + field + ' differs between inventories');
  }
}
assert.deepEqual(issues, [], 'invalid structural input bounds:\n' + issues.join('\n'));

// The semantic review remains explicitly open until each field has a reasoned, formula-aware domain.
const semanticallyReviewed = audit.rows.filter(row =>
  /SEMANTIC_DOMAIN_REVIEWED/i.test(row.constraint_consistency || '')
).length;
console.log('PASS: ' + boundary.rows.length + ' static numeric fields have structurally valid, synchronized bounds.');
console.log('Semantic-domain review markers present: ' + semanticallyReviewed + '/' + boundary.rows.length + ' (not inferred from structural PASS).');
