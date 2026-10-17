#!/usr/bin/env node
'use strict';

// Focused behavior tests for the FFMI page's real inline calculator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/ffmi.html', 'utf8');
const match = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'FFMI page should have its calculation script.');

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
  height: new Element('175'),
  heightUnit: new Element('cm'),
  weight: new Element('70'),
  weightUnit: new Element('kg'),
  fat: new Element('20'),
  result: new Element(),
  'ffmi-formula': new Element()
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
const context = vm.createContext({ document, console, Math, Number, Object, Promise, String });
vm.runInContext(match[1], context, { filename: 'html/ffmi.html:inline-script', timeout: 3000 });

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
  set({ height: 175, heightUnit: 'cm', weight: 70, weightUnit: 'kg', fat: 20 });
  context.clearFFMIOutput();
  context.syncFFMIBounds();
}
function out(id = 'result') {
  return ids[id].textContent || ids[id].innerHTML;
}

runCase('known answer gives 56kg lean mass and FFMI 18.29', () => {
  clean();
  context.calculateFFMI();
  assert.match(out(), /Lean Mass: 56\.00 kg \(80\.0%\)/);
  assert.match(out(), /FFMI: 18\.29/);
  assert.match(out('ffmi-formula'), /FFMI = lean mass ÷ height²/);
  assert.match(out('ffmi-formula'), /18\.29/);
});
runCase('equivalent inch and pound units produce the same index', () => {
  clean();
  set({ height: 68.8976377953, heightUnit: 'inch', weight: 154.3235835, weightUnit: 'lb' });
  context.syncFFMIBounds();
  context.calculateFFMI();
  assert.match(out(), /Lean Mass: 56\.00 kg/);
  assert.match(out(), /FFMI: 18\.29/);
  assert.equal(ids.height.min, '19.685');
  assert.equal(ids.height.max, '98.4252');
  assert.equal(ids.weight.min, '0.22046227');
  assert.equal(ids.weight.max, '1102.31');
});
runCase('metres and feet bounds match the converted 0.5–2.5m domain', () => {
  clean();
  set({ heightUnit: 'm', height: 1.75 });
  context.syncFFMIBounds();
  assert.equal(ids.height.min, '0.5');
  assert.equal(ids.height.max, '2.5');
  set({ heightUnit: 'ft', height: 5.74147 });
  context.syncFFMIBounds();
  assert.equal(ids.height.min, '1.6404');
  assert.equal(ids.height.max, '8.2021');
});
runCase('zero percent body fat is a valid endpoint', () => {
  clean();
  set({ fat: 0 });
  context.calculateFFMI();
  assert.match(out(), /Lean Mass: 70\.00 kg \(100\.0%\)/);
  assert.match(out(), /FFMI: 22\.86/);
});
runCase('100 percent body fat gives zero calculated lean mass', () => {
  clean();
  set({ fat: 100 });
  context.calculateFFMI();
  assert.match(out(), /Lean Mass: 0\.00 kg \(0\.0%\)/);
  assert.match(out(), /FFMI: 0\.00/);
});
runCase('empty body-fat input is not silently treated as zero percent', () => {
  clean();
  set({ fat: '' });
  context.calculateFFMI();
  assert.match(out(), /Enter a positive height and weight and a body-fat percentage from 0 to 100/);
  assert.doesNotMatch(out(), /FFMI: 22\.86/);
  assert.equal(out('ffmi-formula'), '');
});
runCase('empty and non-positive height or weight are rejected', () => {
  for (const values of [{ height: '' }, { height: 0 }, { weight: '' }, { weight: 0 }]) {
    clean();
    set(values);
    context.calculateFFMI();
    assert.match(out(), /Enter a positive height and weight/);
    assert.doesNotMatch(out(), /FFMI:/);
  }
});
runCase('body-fat percentage outside 0–100 is rejected', () => {
  for (const fat of [-0.1, 100.1]) {
    clean();
    set({ fat });
    context.calculateFFMI();
    assert.match(out(), /body-fat percentage from 0 to 100/);
    assert.equal(out('ffmi-formula'), '');
  }
});
runCase('unsupported units are rejected without leaving old results', () => {
  clean();
  context.calculateFFMI();
  set({ heightUnit: 'yards' });
  context.calculateFFMI();
  assert.match(out(), /Choose supported height and weight units/);
  assert.equal(out('ffmi-formula'), '');
  assert.doesNotMatch(out(), /FFMI: 18\.29/);
});
runCase('converted domain upper and lower boundaries are enforced', () => {
  clean();
  set({ height: 50, weight: 0.1, fat: 0 });
  context.calculateFFMI();
  assert.match(out(), /FFMI:/);
  clean();
  set({ height: 250, weight: 500, fat: 0 });
  context.calculateFFMI();
  assert.match(out(), /FFMI: 80\.00/);
  clean();
  set({ height: 251 });
  context.calculateFFMI();
  assert.match(out(), /Check converted measurements/);
  assert.equal(out('ffmi-formula'), '');
});
runCase('reset restores metric units, clears errors/results and focuses height', () => {
  clean();
  context.calculateFFMI();
  const error = new Element('old validation');
  errors.push(error);
  ids.height.setAttribute('aria-invalid', 'true');
  ids.fat.setAttribute('aria-invalid', 'true');
  context.resetFFMI();
  for (const id of ['height', 'weight', 'fat']) {
    assert.equal(ids[id].value, '');
    assert.equal(ids[id].getAttribute('aria-invalid'), null);
  }
  assert.equal(ids.heightUnit.value, 'cm');
  assert.equal(ids.weightUnit.value, 'kg');
  assert.equal(out(), '');
  assert.equal(out('ffmi-formula'), '');
  assert.equal(error.removed, true);
  assert.equal(ids.height.focused, true);
  assert.equal(ids.height.min, '50');
  assert.equal(ids.height.max, '250');
  assert.equal(ids.weight.min, '0.1');
  assert.equal(ids.weight.max, '500');
});
runCase('input edits clear stale results', () => {
  clean();
  context.calculateFFMI();
  assert.match(out(), /FFMI: 18\.29/);
  context.clearFFMIOutput();
  assert.equal(out(), '');
  assert.equal(out('ffmi-formula'), '');
});
runCase('page declares labelled inputs, reset/live regions and has no duplicate analytics metadata', () => {
  assert.match(page, /<label for="height">Height<\/label>/);
  assert.match(page, /<label for="weight">Weight<\/label>/);
  assert.match(page, /<label for="fat">Body Fat \(%\)<\/label>/);
  assert.match(page, /id="result" class="result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /id="ffmi-formula" class="cf-note" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetFFMI\(\)"/);
  assert.match(page, /onchange="clearFFMIOutput\(\)"/);
  assert.equal((page.match(/<meta charset=/gi) || []).length, 1);
  assert.doesNotMatch(page, /gtag|googletagmanager|google-analytics/i);
  assert.equal((page.match(/<script src="\.\.\/js\/navigation\.js"/g) || []).length, 1);
  assert.equal((page.match(/<script src="\.\.\/js\/unit-system\.js"/g) || []).length, 1);
});

console.log('FFMI page regression checks passed: ' + checks);
