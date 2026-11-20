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

const source = read('js/calculator-guides.js');
const guideKeys = [...source.matchAll(/^\s*"([^"]+)": \[/gm)].map(match => match[1]);
assert.equal(guideKeys.length, 50, 'Exactly 50 route-specific guides must be defined.');
const aliases = { sunlight: 'sunlight-duration', pal: 'physical-activity-level' };

function makeElement() {
  return {
    children: [], firstChild: null, className: '', textContent: '', href: '', target: '', rel: '',
    appendChild(child) { this.children.push(child); if (!this.firstChild) this.firstChild = child; return child; },
    removeChild(child) { this.children = this.children.filter(item => item !== child); this.firstChild = this.children[0] || null; }
  };
}

for (const row of last50) {
  const file = row[column.file];
  const route = row[column.route_slug];
  const html = read(path.join('html', file));
  assert.match(html, /calculator-guides\.js/, route + ' must load route-specific guide code.');
  assert.match(html, /cf-education-content/, route + ' must contain the accessible guide target.');
  const basename = path.basename(file, '.html');
  const bodyMatch = html.match(/<body[^>]*data-calculator="([^"]+)"/i);
  const bodySlug = bodyMatch ? bodyMatch[1] : '';
  const slug = bodySlug || aliases[basename] || basename;
  assert.ok(guideKeys.includes(slug), route + ' must have an exact route guide mapping.');

  const target = makeElement();
  const document = {
    body: { dataset: { calculator: bodySlug } },
    querySelector: selector => selector === '.cf-education-card .cf-education-content' ? target : null,
    createElement: () => makeElement()
  };
  const window = { location: { pathname: '/Clerfit/html/' + file } };
  vm.runInNewContext(source, { window, document }, { filename: 'js/calculator-guides.js', timeout: 3000 });
  assert.equal(target.children.length, 3, route + ' must render three guide sections.');
  assert.equal(target.children[0].children[0].textContent, 'How to use it', route + ' guide must explain use.');
  assert.equal(target.children[1].children[0].textContent, 'Method', route + ' guide must disclose the method.');
  assert.match(target.children[2].children[0].textContent, /limitations/i, route + ' guide must include a limitations section.');
}
process.stdout.write('PASS: all 50 final calculator routes load and render route-specific how-to, method and limitation guides.\n');
