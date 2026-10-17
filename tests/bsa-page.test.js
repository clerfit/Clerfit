#!/usr/bin/env node
'use strict';

// Focused tests for the Body Surface Area page's real inline calculator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/bsa.html', 'utf8');
const match = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'BSA page should have its calculator script.');

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
  weight: new Element('70'),
  weightUnit: new Element('kg'),
  height: new Element('175'),
  heightUnit: new Element('cm'),
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
vm.runInContext(match[1], context, { filename: 'html/bsa.html:inline-script', timeout: 3000 });

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
  set({ weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm' });
  context.clearBSAOutput();
  context.syncBSABounds();
  bar.hidden = true;
}
function out(id = 'result') {
  return ids[id].textContent || ids[id].innerHTML;
}

runCase('known answer gives 1.84m² for 70kg and 175cm', () => {
  clean();
  context.calculateBSA();
  assert.match(out(), /BSA: 1\.84 m²/);
  assert.match(out('formula'), /Mosteller formula/);
  assert.match(out('formula'), /3600/);
});
runCase('equivalent inch and pound inputs produce the same surface area', () => {
  clean();
  set({ weight: 154.3235835, weightUnit: 'lbs', height: 68.8976378, heightUnit: 'in' });
  context.syncBSABounds();
  context.calculateBSA();
  assert.match(out(), /BSA: 1\.84 m²/);
  assert.equal(ids.weight.min, '2.20462262');
  assert.equal(ids.weight.max, '1102.31');
  assert.equal(ids.height.min, '19.685');
  assert.equal(ids.height.max, '98.4252');
});
runCase('metres and feet map to the same metric formula domain', () => {
  clean();
  set({ height: 1.75, heightUnit: 'm' });
  context.syncBSABounds();
  assert.equal(ids.height.min, '0.5');
  assert.equal(ids.height.max, '2.5');
  context.calculateBSA();
  assert.match(out(), /BSA: 1\.84 m²/);
  clean();
  set({ height: 5.7414698, heightUnit: 'ft' });
  context.syncBSABounds();
  assert.equal(ids.height.min, '1.6404');
  assert.equal(ids.height.max, '8.2021');
  context.calculateBSA();
  assert.match(out(), /BSA: 1\.84 m²/);
});
runCase('lower valid domain boundary is accepted', () => {
  clean();
  set({ weight: 1, height: 50 });
  context.calculateBSA();
  assert.match(out(), /BSA: 0\.12 m²/);
});
runCase('upper valid domain boundary is accepted', () => {
  clean();
  set({ weight: 500, height: 250 });
  context.calculateBSA();
  assert.match(out(), /BSA: 5\.89 m²/);
});
runCase('empty weight or height is rejected as missing input', () => {
  for (const values of [{ weight: '' }, { height: '' }]) {
    clean();
    set(values);
    context.calculateBSA();
    assert.match(out(), /positive, valid weight and height values/);
    assert.equal(out('formula'), '');
  }
});
runCase('non-positive values and values outside converted limits are rejected', () => {
  for (const values of [{ weight: 0 }, { weight: 0.9 }, { height: 49 }, { height: 251 }]) {
    clean();
    set(values);
    context.calculateBSA();
    assert.match(out(), /positive, valid|Check units and values/);
    assert.equal(out('formula'), '');
  }
});
runCase('unsupported measurement units are rejected and clear old output', () => {
  clean();
  context.calculateBSA();
  set({ heightUnit: 'yards' });
  context.calculateBSA();
  assert.match(out(), /Choose supported weight and height units/);
  assert.equal(out('formula'), '');
  assert.doesNotMatch(out(), /BSA: 1\.84/);
});
runCase('reset clears errors and outputs, restores units and focuses weight', () => {
  clean();
  context.calculateBSA();
  const error = new Element('old validation');
  errors.push(error);
  ids.weight.setAttribute('aria-invalid', 'true');
  ids.height.setAttribute('aria-invalid', 'true');
  context.resetBSA();
  for (const id of ['weight', 'height']) {
    assert.equal(ids[id].value, '');
    assert.equal(ids[id].getAttribute('aria-invalid'), null);
  }
  assert.equal(ids.weightUnit.value, 'kg');
  assert.equal(ids.heightUnit.value, 'cm');
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
  assert.equal(error.removed, true);
  assert.equal(ids.weight.focused, true);
  assert.equal(ids.weight.min, '1');
  assert.equal(ids.weight.max, '500');
  assert.equal(ids.height.min, '50');
  assert.equal(ids.height.max, '250');
});
runCase('input edits clear stale results and formula', () => {
  clean();
  context.calculateBSA();
  assert.match(out(), /1\.84 m²/);
  context.clearBSAOutput();
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
});
runCase('page declares accessible inputs, live results, one charset and one shared script', () => {
  assert.match(page, /<label for="weight">Weight<\/label>/);
  assert.match(page, /<label for="height">Height<\/label>/);
  assert.match(page, /id="result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetBSA\(\)"/);
  assert.match(page, /onchange="clearBSAOutput\(\)"/);
  assert.equal((page.match(/<meta charset=/gi) || []).length, 1);
  assert.doesNotMatch(page, /gtag|googletagmanager|google-analytics/i);
  assert.equal((page.match(/<script src="\.\.\/js\/navigation\.js"/g) || []).length, 1);
  assert.equal((page.match(/<script src="\.\.\/js\/unit-system\.js"/g) || []).length, 1);
});

console.log('BSA page regression checks passed: ' + checks);
