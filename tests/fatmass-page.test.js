#!/usr/bin/env node
'use strict';

// Focused behavior tests for the Fat Mass page's real inline calculator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/fatmass.html', 'utf8');
const match = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'Fat Mass page should have its calculation script.');

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
  set textContent(value) {
    this._text = String(value);
    this._html = this._text;
  }
  get textContent() { return this._text; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
}

const ids = {
  weight: new Element('70'),
  weightUnit: new Element('kg'),
  fat: new Element('20'),
  result: new Element(),
  formula: new Element()
};
const errors = [];
const document = {
  addEventListener() {},
  getElementById(id) {
    assert.ok(ids[id], 'Unexpected DOM lookup: ' + id);
    return ids[id];
  },
  querySelectorAll(selector) {
    return selector === '.clerfit-input-error' ? errors : [];
  },
  querySelector() { return null; }
};
const context = vm.createContext({ document, console, Number, Object, Promise });
vm.runInContext(match[1], context, { filename: 'html/fatmass.html:inline-script', timeout: 3000 });

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
  set({ weight: 70, weightUnit: 'kg', fat: 20 });
  context.clearFatMassOutput();
  context.syncFatMassBounds();
}
function out(id = 'result') {
  return ids[id].textContent || ids[id].innerHTML;
}

runCase('known answer calculates 14kg fat mass at 20 percent', () => {
  clean();
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: 14\.00 kg \(20\.0%\)/);
  assert.match(out('formula'), /14\.00 kg/);
});
runCase('pounds input converts to the same kilogram result', () => {
  clean();
  set({ weight: 154.3235835, weightUnit: 'lb', fat: 20 });
  context.syncFatMassBounds();
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: 14\.00 kg \(20\.0%\)/);
  assert.equal(ids.weight.min, '0.22046227');
  assert.equal(ids.weight.max, '1102.31');
});
runCase('zero percent and 100 percent boundaries are valid', () => {
  clean();
  set({ fat: 0 });
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: <b>0\.00 kg<\/b> \(0\.0%\)/);
  clean();
  set({ fat: 100 });
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: <b>70\.00 kg<\/b> \(100\.0%\)/);
});
runCase('empty body-fat value is not silently treated as zero', () => {
  clean();
  set({ fat: '' });
  context.calculateFatMass();
  assert.match(out(), /Enter a positive weight and a body-fat percentage from 0 to 100/);
  assert.doesNotMatch(out(), /Fat Mass: <b>0\.00 kg/);
});
runCase('empty or non-positive weight is rejected', () => {
  clean();
  set({ weight: '' });
  context.calculateFatMass();
  assert.match(out(), /Enter a positive weight/);
  clean();
  set({ weight: 0 });
  context.calculateFatMass();
  assert.match(out(), /Enter a positive weight/);
});
runCase('percentages outside 0–100 are rejected', () => {
  for (const fat of [-0.1, 100.1]) {
    clean();
    set({ fat });
    context.calculateFatMass();
    assert.match(out(), /body-fat percentage from 0 to 100/);
  }
});
runCase('unsupported unit is rejected without preserving stale output', () => {
  clean();
  context.calculateFatMass();
  set({ weightUnit: 'stone' });
  context.calculateFatMass();
  assert.match(out(), /Choose a supported weight unit/);
  assert.equal(out('formula'), '');
  assert.doesNotMatch(out(), /14\.00 kg/);
});
runCase('converted weight domain accepts bounds and rejects values beyond 500kg', () => {
  clean();
  set({ weight: 0.1, fat: 20 });
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: <b>0\.02 kg/);
  clean();
  set({ weight: 501 });
  context.calculateFatMass();
  assert.match(out(), /converted weight must be from 0\.1 to 500 kg/);
  clean();
  set({ weight: 1102.31, weightUnit: 'lb' });
  context.syncFatMassBounds();
  context.calculateFatMass();
  assert.match(out(), /Fat Mass: <b>100\.00 kg/);
});
runCase('reset clears values/errors/results and focuses weight', () => {
  clean();
  context.calculateFatMass();
  const error = new Element('old validation');
  errors.push(error);
  ids.weight.setAttribute('aria-invalid', 'true');
  ids.fat.setAttribute('aria-invalid', 'true');
  context.resetFatMass();
  assert.equal(ids.weight.value, '');
  assert.equal(ids.fat.value, '');
  assert.equal(ids.weightUnit.value, 'kg');
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
  assert.equal(ids.weight.getAttribute('aria-invalid'), null);
  assert.equal(ids.fat.getAttribute('aria-invalid'), null);
  assert.equal(error.removed, true);
  assert.equal(ids.weight.focused, true);
  assert.equal(ids.weight.min, '0.1');
  assert.equal(ids.weight.max, '500');
});
runCase('editing required values clears a prior calculation', () => {
  clean();
  context.calculateFatMass();
  assert.match(out(), /14\.00 kg/);
  context.clearFatMassOutput();
  assert.equal(out(), '');
  assert.equal(out('formula'), '');
});
runCase('page contains labels, unit handler, live regions and no stale metadata', () => {
  assert.match(page, /<label for="weight">Weight<\/label>/);
  assert.match(page, /<label for="fat">Body Fat \(%\)<\/label>/);
  assert.match(page, /id="result" class="result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetFatMass\(\)"/);
  assert.match(page, /onchange="clearFatMassOutput\(\)"/);
  assert.equal((page.match(/<meta charset=/gi) || []).length, 1, 'Character encoding should be declared once');
  assert.doesNotMatch(page, /gtag|googletagmanager|google-analytics/i, 'No stale analytics snippet should remain');
  assert.equal((page.match(/<script src="\.\.\/js\/navigation\.js"/g) || []).length, 1);
  assert.equal((page.match(/<script src="\.\.\/js\/unit-system\.js"/g) || []).length, 1);
});

console.log('Fat Mass page regression checks passed: ' + checks);
