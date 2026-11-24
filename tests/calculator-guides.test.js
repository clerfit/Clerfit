'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = file => fs.readFileSync(file, 'utf8');
function parseCsv(source) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const matrix = parseCsv(read('CALCULATOR_VERIFICATION_MATRIX.csv'));
const header = matrix.shift();
const column = Object.fromEntries(header.map((name, index) => [name, index]));
const last50 = matrix.slice(-50);
assert.equal(last50.length, 50, 'The final 50 registered calculator routes must be present.');
assert.equal(new Set(last50.map(row => row[column.route_slug])).size, 50, 'The final 50 routes must be unique.');

const fieldAudit = read('FIELD_VALIDATION_AUDIT.csv');
const boundaryAudit = read('INPUT_BOUNDARY_VERIFIED.csv');
assert.match(fieldAudit, /html\/pal\.html,tee,,Average total energy expenditure \(TEE\),1,50000,any,yes/);
assert.match(fieldAudit, /html\/pal\.html,bmr,,Basal metabolic rate \(BMR\),1,10000,any,yes/);
assert.doesNotMatch(fieldAudit, /html\/pal\.html,age,/);
assert.match(boundaryAudit, /pal\.html,tee,Average total energy expenditure \(TEE\),1,50000,any/);
assert.match(boundaryAudit, /pal\.html,bmr,Basal metabolic rate \(BMR\),1,10000,any/);
assert.doesNotMatch(boundaryAudit, /pal\.html,age,/);
assert.match(read('scripts/sync-input-boundaries.js'), /assert\.equal\(source\.size, 298,/);

const source = read('js/calculator-guides.js');
const guideKeys = [...source.matchAll(/^\s*"([^"]+)": \[/gm)].map(match => match[1]);
assert.equal(guideKeys.length, 50, 'Exactly 50 route-specific guides must be defined.');
const aliases = { sunlight: 'sunlight-duration', pal: 'physical-activity-level' };

for (const row of last50) {
  const file = row[column.file];
  const route = row[column.route_slug];
  const html = read(path.join('html', file));
  assert.match(html, /page-chrome\.js/, route + ' must load the shared route guide system.');
  assert.match(html, /cf-education-content/, route + ' must contain the accessible guide target.');
  const basename = path.basename(file, '.html');
  const bodyMatch = html.match(/<body[^>]*data-calculator="([^"]+)"/i);
  const bodySlug = bodyMatch ? bodyMatch[1] : '';
  const slug = bodySlug || aliases[basename] || basename;
  assert.ok(guideKeys.includes(slug), route + ' must have an exact route guide mapping.');
  const guideStart = html.indexOf('<div class="cf-education-content">');
  const guideEnd = html.indexOf('</details>', guideStart);
  assert.ok(guideStart >= 0 && guideEnd > guideStart, route + ' must include a static, accessible guide body.');
  const guideMarkup = html.slice(guideStart, guideEnd);
  const guideText = guideMarkup.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  assert.ok(guideText.length >= 500, route + ' guide must contain practical detail.');
  assert.match(guideMarkup, /method|calculation/i, route + ' guide must explain the method.');
  assert.match(guideMarkup, /limit|protocol|interpretation/i, route + ' guide must explain measurement context and limits.');
}
process.stdout.write('PASS: all 50 final calculator routes load and render route-specific how-to, method and limitation guides.\n');
