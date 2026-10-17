/* Phase 2: explicitly exercise the WHR upper endpoint and unsupported-unit branch. */
#!/usr/bin/env node
'use strict';

// Focused behavior tests for the WHR page's actual inline calculator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/whr.html', 'utf8');
const match = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'WHR page should contain its calculator script.');

class Element {
  constructor(value = '') {
    this.value = String(value);
    this.min = '';
    this.max = '';
    this.style = {};
    this.hidden = false;
    this.attributes = {};
    this.removed = false;
    this.focused = false;
    this._html = '';
    this._text = '';
  }
  set innerHTML(value) {
    this._html = String(value);
    this._text = this._html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  get innerHTML() { return this._html; }
  get textContent() { return this._text; }
  set textContent(value) { this._text = String(value); this._html = this._text; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
}

const ids = {
  gender: new Element('male'),
  waist: new Element('80'),
  waistUnit: new Element('cm'),
  hip: new Element('100'),
  hipUnit: new Element('cm'),
  result: new Element(),
  formula: new Element()
};
const errors = [];
const bar = new Element();
bar.hidden = true;
const document = {
  addEventListener() {},
  getElementById(id) {
    assert.ok(ids[id], 'Unexpected DOM lookup: ' + id);
    return ids[id];
  },
  querySelector(selector) {
    return selector === '.bar-container' ? bar : null;
  },
  querySelectorAll(selector) {
    return selector === '.clerfit-input-error' ? errors : [];
  }
};
const context = vm.createContext({ document, console, Math, Number, Object, Promise, String });
vm.runInContext(match[1], context, { filename: 'html/whr.html:inline-script', timeout: 3000 });

let checks = 0;
function runCase(name, fn) {
  fn();
  checks++;
  process.stdout.write('PASS ' + name + '\n');
}
function set(values) {
  Object.entries(values).forEach(([id, value]) => { ids[id].value = String(value); });
}
function clean() {
  set({ gender: 'male', waist: 80, waistUnit: 'cm', hip: 100, hipUnit: 'cm' });
  context.clearWHROutput();
  context.syncWHRBounds();
  bar.hidden = true;
}
function out(id = 'result') {
  return ids[id].textContent || ids[id].innerHTML;
}

runCase('known answer calculates waist-to-hip ratio 0.80', () => {
  clean();
  context.calculateWHR();
  assert.match(out(), /WHR: 0\.80/);
  assert.match(out('formula'), /Waist ÷ Hip = 80\.0 ÷ 100\.0 = 0\.80/);
  assert.equal(bar.hidden, true);
});
runCase('equivalent inch values produce the same ratio and bounds', () => {
  clean();
  set({ waist: 31.49606299, waistUnit: 'inch', hip: 39.37007874, hipUnit: 'inch' });
  context.syncWHRBounds();
  context.calculateWHR();
  assert.match(out(), /WHR: 0\.80/);
  assert.equal(ids.waist.min, '7.874016');
  assert.equal(ids.waist.max, '118.1102');
  assert.equal(ids.hip.min, '7.874016');
  assert.equal(ids.hip.max, '118.1102');
});
runCase('metres and feet values convert consistently', () => {
  clean();
  set({ waist: 0.8, waistUnit: 'm', hip: 1, hipUnit: 'm' });
  context.syncWHRBounds();
  assert.equal(ids.waist.min, '0.2');
  assert.equal(ids.waist.max, '3');
  context.calculateWHR();
  assert.match(out(), /WHR: 0\.80/);
  clean();
  set({ waist: 2.624671916, waistUnit: 'ft', hip: 3.280839895, hipUnit: 'ft' });
  context.syncWHRBounds();
  assert.equal(ids.waist.min, '0.656168');
  assert.equal(ids.waist.max, '9.84251');
  context.calculateWHR();
  assert.match(out(), /WHR: 0\.80/);
});
runCase('lower and upper plausible measurement endpoints are accepted', () => {
  clean();
  set({ waist: 20, hip: 20 });
  context.calculateWHR();
  assert.match(out(), /WHR: 1\.00/);
  clean();
  set({ waist: 300, hip: 300 });
  context.calculateWHR();
  assert.match(out(), /WHR: 1\.00/);
});
runCase('mixed-unit upper endpoints remain valid without conversion drift', () => {
  clean();
  set({ waist: 3, waistUnit: 'm', hip: 300, hipUnit: 'cm' });
  context.syncWHRBounds();
  context.calculateWHR();
  assert.match(out(), /WHR: 1\\.00/);
  assert.match(out('formula'), /300\\.0 ÷ 300\\.0 = 1\\.00/);
});
runCase('empty or non-positive measurements are explicitly rejected', () => {
  for (const values of [{ waist: '' }, { hip: '' }, { waist: 0 }, { hip: -1 }]) {
    clean();
    set(values);
    context.calculateWHR();
    assert.match(out(), /Enter valid positive waist and hip measurements/);
    assert.equal(out('formula'), '');
  }
});
runCase('measurements outside the 0.2–3m physical input domain are rejected', () => {
  for (const values of [{ waist: 19.9 }, { hip: 300.1 }]) {
    clean();
    set(values);
    context.calculateWHR();
    assert.match(out(), /plausible/);
    assert.equal(out('formula'), '');
  }
});
runCase('unsupported units show an error without a stale ratio', () => {
  clean();
  context.calculateWHR();
  set({ waistUnit: 'yards' });
  context.calculateWHR();
  assert.match(out(), /Choose supported units for both measurements/);
  assert.equal(out('formula'), '');
  assert.doesNotMatch(out(), /WHR: 0\.80/);
});
runCase('reset clears inputs and errors, restores defaults and focuses waist', () => {
  clean();
  context.calculateWHR();
  const error = new Element('old validation');
  errors.push(error);
  ids.waist.setAttribute('aria-invalid', 'true');
  ids.hip.setAttribute('aria-invalid', 'true');
  context.resetWHR();
  for (const id of ['waist', 'hip']) {
    assert.equal(ids[id].value, '');
    assert.equal(ids[id].getAttribute('aria-invalid'), null);
  }
  assert.equal(ids.gender.value, 'male');
  assert.equal(ids.waistUnit.value, 'cm');
  assert.equal(ids.hipUnit.value, 'cm');
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
  assert.equal(error.removed, true);
  assert.equal(ids.waist.focused, true);
  assert.equal(ids.waist.min, '20');
  assert.equal(ids.waist.max, '300');
});
runCase('editing inputs clears the previous result and formula', () => {
  clean();
  context.calculateWHR();
  assert.match(out(), /WHR: 0\.80/);
  context.clearWHROutput();
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
});
runCase('page exposes labels, live regions, unit constraints and correct metadata', () => {
  assert.match(page, /<label for="waist">Waist<\/label>/);
  assert.match(page, /<label for="hip">Hip<\/label>/);
  assert.match(page, /id="result" class="result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /id="formula" class="result" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetWHR\(\)"/);
  assert.match(page, /onchange="clearWHROutput\(\)"/);
  assert.match(page, /does not change the calculation/i);
  assert.equal((page.match(/<meta charset=/gi) || []).length, 1);
  assert.doesNotMatch(page, /gtag|googletagmanager|google-analytics/i);
  assert.equal((page.match(/<script src="\.\.\/js\/navigation\.js"/g) || []).length, 1);
  assert.equal((page.match(/<script src="\.\.\/js\/unit-system\.js"/g) || []).length, 1);
});

console.log('WHR page regression checks passed: ' + checks);
