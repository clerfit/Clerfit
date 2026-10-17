#!/usr/bin/env node
'use strict';

// Synchronize structural numeric-input CSVs with the actual static markup.
// This script deliberately does not certify that a numeric range is scientifically
// correct; the CSV notes keep semantic-boundary review distinct from structural checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const MODE = process.argv[2] || '--check';
if (!['--check', '--write'].includes(MODE)) {
  console.error('Usage: node scripts/sync-input-boundaries.js [--check|--write]');
  process.exit(2);
}
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
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
function stringifyCsv(rows) {
  const quote = value => {
    const s = String(value ?? '');
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return rows.map(row => row.map(quote).join(',')).join('\n') + '\n';
}
function parseTagAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}
function attrValue(attributes, name) {
  return Object.hasOwn(attributes, name) ? attributes[name] : '';
}
function listHtml(directory, relative = '') {
  const output = [];
  for (const entry of fs.readdirSync(path.join(ROOT, directory, relative), { withFileTypes: true })) {
    const rel = path.posix.join(relative, entry.name);
    const absolute = path.join(ROOT, directory, rel);
    if (entry.isDirectory()) output.push(...listHtml(directory, rel));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) output.push(rel);
  }
  return output.sort();
}

const auditPath = 'FIELD_VALIDATION_AUDIT.csv';
const boundsPath = 'INPUT_BOUNDARY_VERIFIED.csv';
const auditRows = parseCsv(read(auditPath));
const boundsRows = parseCsv(read(boundsPath));
const auditHeader = auditRows[0];
const boundsHeader = boundsRows[0];
const indexes = header => Object.fromEntries(header.map((name, index) => [name, index]));
const ah = indexes(auditHeader), bh = indexes(boundsHeader);
for (const name of ['file', 'id', 'min', 'max', 'step', 'constraint_consistency']) {
  assert.ok(Object.hasOwn(ah, name), 'FIELD_VALIDATION_AUDIT.csv missing column ' + name);
}
for (const name of ['file', 'id', 'min', 'max', 'step']) {
  assert.ok(Object.hasOwn(bh, name), 'INPUT_BOUNDARY_VERIFIED.csv missing column ' + name);
}

const auditMap = new Map();
for (const row of auditRows.slice(1)) {
  const key = row[ah.file] + '|' + row[ah.id];
  assert.ok(!auditMap.has(key), 'Duplicate field-audit row: ' + key);
  auditMap.set(key, row);
}
const boundsMap = new Map();
for (const row of boundsRows.slice(1)) {
  const key = 'html/' + row[bh.file] + '|' + row[bh.id];
  assert.ok(!boundsMap.has(key), 'Duplicate boundary row: ' + key);
  boundsMap.set(key, row);
}

const source = new Map();
function compactText(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}
for (const file of listHtml('html')) {
  let markup = read(path.posix.join('html', file));
  // Ignore markup stored inside scripts: those are runtime-generated controls.
  markup = markup.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
  for (const match of markup.matchAll(/<input\b[^>]*>/gi)) {
    const attributes = parseTagAttributes(match[0]);
    if ((attributes.type || '').toLowerCase() !== 'number') continue;
    const id = attributes.id || '';
    assert.ok(id, 'Every static numeric input must have an id: html/' + file + ' ' + match[0]);
    const key = 'html/' + file + '|' + id;
    assert.ok(!source.has(key), 'Duplicate static numeric input id in one page: ' + key);
    let label = '';
    for (const labelMatch of markup.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label\s*>/gi)) {
      const labelAttrs = parseTagAttributes('<label ' + labelMatch[1] + '>');
      if (labelAttrs.for === id) { label = compactText(labelMatch[2]); break; }
    }
    let unitSelector = 'not-detected';
    for (const selectMatch of markup.matchAll(/<select\b[^>]*>/gi)) {
      const selectAttrs = parseTagAttributes(selectMatch[0]);
      if (selectAttrs['data-unit-for'] === id) { unitSelector = 'yes'; break; }
    }
    source.set(key, {
      file: 'html/' + file,
      id,
      name: attributes.name || '',
      label: label || attributes['aria-label'] || attributes.placeholder || id,
      required: Object.hasOwn(attributes, 'required') ? 'yes' : 'no',
      unitSelector,
      min: attrValue(attributes, 'min'),
      max: attrValue(attributes, 'max'),
      step: attrValue(attributes, 'step')
    });
  }
}
assert.equal(source.size, 242, 'Expected 242 static numeric inputs, found ' + source.size + '; source-only: ' + [...source.keys()].filter(key => !auditMap.has(key)).join(', ') + '; CSV-only: ' + [...auditMap.keys()].filter(key => !source.has(key)).join(', '));
for (const [key, field] of source) {
  let audit = auditMap.get(key);
  let boundary = boundsMap.get(key);
  if (!audit || !boundary) {
    assert.equal(MODE, '--write', 'Missing source field rows for ' + key + '; run with --write to create them.');
    if (!audit) {
      audit = Array(auditHeader.length).fill('');
      audit[ah.file] = field.file;
      audit[ah.id] = field.id;
      audit[ah.name] = field.name;
      audit[ah.label_or_accessible_name] = field.label;
      audit[ah.required] = field.required;
      audit[ah.unit_selector_in_same_field] = field.unitSelector;
      audit[ah.constraint_consistency] = 'STRUCTURAL PASS; BOUNDS MATCH SOURCE; FIELD-SPECIFIC SEMANTIC EDGE CASES NOT EXHAUSTIVE';
      auditRows.push(audit);
      auditMap.set(key, audit);
    }
    if (!boundary) {
      boundary = Array(boundsHeader.length).fill('');
      boundary[bh.file] = field.file.replace(/^html\//, '');
      boundary[bh.id] = field.id;
      boundary[bh.label] = field.label;
      boundsRows.push(boundary);
      boundsMap.set(key, boundary);
    }
  }
  for (const name of ['min', 'max', 'step']) {
    audit[ah[name]] = field[name];
    boundary[bh[name]] = field[name];
  }
  // Don't mistake the presence of syntactically valid HTML bounds for semantic validation.
  const statusIndex = ah.constraint_consistency;
  const previousStatus = audit[statusIndex] || '';
  if (/^PASS(?:\s|$)/i.test(previousStatus)) {
    audit[statusIndex] = /handler validated/i.test(previousStatus)
      ? 'STRUCTURAL PASS; HANDLER RANGE EXISTS; ALL SEMANTIC EDGE CASES NOT EXHAUSTIVE'
      : 'STRUCTURAL PASS; BOUNDS MATCH SOURCE; FIELD-SPECIFIC SEMANTIC EDGE CASES NOT EXHAUSTIVE';
  } else if (/^STRUCTURAL PASS/i.test(previousStatus)) {
    audit[statusIndex] = /handler range exists/i.test(previousStatus)
      ? previousStatus
      : 'STRUCTURAL PASS; BOUNDS MATCH SOURCE; FIELD-SPECIFIC SEMANTIC EDGE CASES NOT EXHAUSTIVE';
  }
}
assert.equal(auditMap.size, source.size, 'Audit row count must match static numeric inputs');
assert.equal(boundsMap.size, source.size, 'Boundary inventory row count must match static numeric inputs');

const newAudit = stringifyCsv(auditRows);
const newBounds = stringifyCsv(boundsRows);
const currentAudit = read(auditPath), currentBounds = read(boundsPath);
const changed = [];
if (newAudit !== currentAudit) changed.push(auditPath);
if (newBounds !== currentBounds) changed.push(boundsPath);
if (MODE === '--write') {
  fs.writeFileSync(path.join(ROOT, auditPath), newAudit, 'utf8');
  fs.writeFileSync(path.join(ROOT, boundsPath), newBounds, 'utf8');
  console.log('WROTE source-synchronized bounds for ' + source.size + ' static numeric inputs: ' + (changed.length ? changed.join(', ') : 'files already current'));
} else {
  assert.equal(newAudit, currentAudit, 'FIELD_VALIDATION_AUDIT.csv is stale; run node scripts/sync-input-boundaries.js --write');
  assert.equal(newBounds, currentBounds, 'INPUT_BOUNDARY_VERIFIED.csv is stale; run node scripts/sync-input-boundaries.js --write');
  console.log('PASS: both field-bound CSVs match source min/max/step values for all ' + source.size + ' static numeric inputs; semantic plausibility remains a separate review.');
}
