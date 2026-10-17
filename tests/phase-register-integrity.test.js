#!/usr/bin/env node
'use strict';

// Keep the route inventory, sitemap and sign-off evidence mutually consistent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
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

const navigation = read('js/navigation.js');
const registryMatch = navigation.match(/const CALCULATORS\s*=\s*(\[[\s\S]*?\]);\s*\nconst path/);
assert.ok(registryMatch, 'central calculator registry must be parseable');
const registry = JSON.parse(registryMatch[1]);
assert.equal(registry.length, 118, 'central registry should contain 118 routes');
const routeFiles = registry.map(route => route.file);
assert.equal(new Set(routeFiles).size, 118, 'central registry must not repeat route files');
for (const file of routeFiles) {
  assert.ok(fs.existsSync(path.join(root, 'html', file)), 'missing registry target: html/' + file);
}

const inventoryRows = parseCsv(read('PHASE_1_CALCULATOR_INVENTORY.csv'));
const inventoryHeader = inventoryRows[0];
for (const field of ['title', 'category', 'slug', 'source_file', 'file_exists', 'canonical_sitemap_url', 'url_in_sitemap']) {
  assert.ok(inventoryHeader.includes(field), 'inventory header missing ' + field);
}
const inventory = inventoryRows.slice(1);
assert.equal(inventory.length, 118, 'audit inventory should contain 118 calculator rows');
const sourceIndex = inventoryHeader.indexOf('source_file');
const existsIndex = inventoryHeader.indexOf('file_exists');
const sitemapIndex = inventoryHeader.indexOf('url_in_sitemap');
const canonicalIndex = inventoryHeader.indexOf('canonical_sitemap_url');
assert.equal(new Set(inventory.map(row => row[sourceIndex])).size, 118, 'inventory source files must be unique');
for (const row of inventory) {
  assert.equal(row[existsIndex], 'YES', 'inventory must not report a missing source: ' + row[sourceIndex]);
  assert.ok(fs.existsSync(path.join(root, row[sourceIndex])), 'inventory source file not found: ' + row[sourceIndex]);
  assert.equal(row[sitemapIndex], 'YES', 'inventory route must be listed in sitemap: ' + row[sourceIndex]);
}
const inventoryFiles = new Set(inventory.map(row => row[sourceIndex].replace(/^html\//, '')));
assert.deepEqual([...routeFiles].sort(), [...inventoryFiles].sort(), 'registry and audit inventory routes must match');


function parseTagAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}
const fieldAuditRows = parseCsv(read('FIELD_VALIDATION_AUDIT.csv'));
const fieldAuditHeader = fieldAuditRows[0];
const verifiedBoundsRows = parseCsv(read('INPUT_BOUNDARY_VERIFIED.csv'));
const verifiedBoundsHeader = verifiedBoundsRows[0];
for (const field of ['file', 'id', 'min', 'max', 'step', 'constraint_consistency']) {
  assert.ok(fieldAuditHeader.includes(field), 'field validation audit header missing ' + field);
}
for (const field of ['file', 'id', 'min', 'max', 'step']) {
  assert.ok(verifiedBoundsHeader.includes(field), 'verified boundary header missing ' + field);
}
const fieldAuditData = new Map(fieldAuditRows.slice(1).map(row => [row[fieldAuditHeader.indexOf('file')] + '|' + row[fieldAuditHeader.indexOf('id')], row]));
const verifiedBoundsData = new Map(verifiedBoundsRows.slice(1).map(row => [row[verifiedBoundsHeader.indexOf('file')] + '|' + row[verifiedBoundsHeader.indexOf('id')], row]));
assert.equal(fieldAuditRows.length - 1, 242, 'field validation audit must contain 242 static numeric fields');
assert.equal(verifiedBoundsRows.length - 1, 242, 'verified boundary inventory must contain 242 static numeric fields');
assert.equal(fieldAuditData.size, 242, 'field audit must not duplicate file/id records');
assert.equal(verifiedBoundsData.size, 242, 'boundary inventory must not duplicate file/id records');
let sourceNumericFieldCount = 0;
for (const file of fs.readdirSync(path.join(root, 'html')).filter(name => name.toLowerCase().endsWith('.html'))) {
  const relative = 'html/' + file;
  // Script-generated input markup belongs to runtime-generated controls, not the static inventory.
  const staticMarkup = read(relative).replace(/<script\b[\s\S]*?<\/script\s*>/gi, '').replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
  for (const match of staticMarkup.matchAll(/<input\b[^>]*>/gi)) {
    const attributes = parseTagAttributes(match[0]);
    if ((attributes.type || '').toLowerCase() !== 'number') continue;
    sourceNumericFieldCount++;
    const key = relative + '|' + (attributes.id || '');
    const auditRow = fieldAuditData.get(key);
    const boundsRow = verifiedBoundsData.get(file + '|' + (attributes.id || ''));
    assert.ok(auditRow, 'numeric input missing from FIELD_VALIDATION_AUDIT.csv: ' + key);
    assert.ok(boundsRow, 'numeric input missing from INPUT_BOUNDARY_VERIFIED.csv: ' + key);
    for (const attribute of ['min', 'max', 'step']) {
      const actual = attributes[attribute] ?? '';
      assert.equal(auditRow[fieldAuditHeader.indexOf(attribute)], actual, 'FIELD_VALIDATION_AUDIT.csv stale ' + attribute + ' for ' + key);
      assert.equal(boundsRow[verifiedBoundsHeader.indexOf(attribute)], actual, 'INPUT_BOUNDARY_VERIFIED.csv stale ' + attribute + ' for ' + key);
    }
  }
}
assert.equal(sourceNumericFieldCount, 242, 'static HTML numeric input count must match field inventories');

const sitemapText = read('sitemap.xml');
const sitemapUrls = [...sitemapText.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(match => match[1].trim());
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'sitemap must not contain duplicate URLs');
assert.equal(sitemapUrls.length, 123, 'sitemap should include 118 tools and five root routes');
for (const row of inventory) {
  assert.ok(sitemapUrls.includes(row[canonicalIndex]), 'sitemap is missing ' + row[canonicalIndex]);
}

const signoffRows = parseCsv(read('PHASE_1_SIGNOFF_REGISTER.csv'));
const signoffHeader = signoffRows[0];
for (const field of ['source_file', 'interaction_test', 'keyboard_and_focus_test', 'zip_parity', 'overall_signoff', 'evidence_or_blocker']) {
  assert.ok(signoffHeader.includes(field), 'sign-off register header missing ' + field);
}
assert.ok(signoffRows.length >= 129, 'page-level sign-off baseline should include 128+ document records');
const signoffStatus = signoffRows.map(row => row[signoffHeader.indexOf('overall_signoff')]).join(' ');
assert.match(signoffStatus, /LIVE_RELEASE_OPEN/, 'baseline must not imply live release acceptance');
assert.match(read('PHASE_ONE_AUDIT_SIGNOFF.md'), /OPEN/, 'Phase One must retain unresolved evidence gates');
assert.match(read('PHASE_TWO_CALCULATOR_SIGNOFF.md'), /OPEN/, 'Phase Two must retain unresolved acceptance gates');
const accessibleTest = read('tests/input-validation-accessibility.test.js');
assert.match(accessibleTest, /sibling error node is retained/, 'validation accessibility regression must cover sibling isolation');
assert.match(read('.github/workflows/phase-one-ci.yml'), /browser-smoke-staging\.js/, 'full workflow must run source-staging interaction tests');
assert.match(read('.github/workflows/phase-one-ci.yml'), /accessibility-smoke\.js/, 'full workflow must run all-page accessibility checks');

console.log('PASS: 118 routes, 242 source-matched static field bounds, inventory/file parity, unique 123-URL sitemap, per-route sign-off register and release-gate honesty.');
