#!/usr/bin/env node
'use strict';

// Page-specific behavioral regression tests for html/BMI.html.
// These tests exercise the real inline calculator function without needing a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/BMI.html', 'utf8');
const scriptMatch = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(scriptMatch, 'BMI page must include its calculator script.');

class Element {
  constructor(value = '') {
    this.value = value;
    this.min = '';
    this.max = '';
    this.style = { left: '0%', backgroundColor: '' };
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
  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'title') delete this.title;
  }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
}

const ids = {
  weight: new Element('70'),
  weightUnit: new Element('kg'),
  height: new Element('175'),
  heightUnit: new Element('cm'),
  age: new Element('30'),
  gender: new Element('male'),
  result: new Element(),
  indicator: new Element()
};
ids.indicator.title = '';
const validationErrors = [];
const document = {
  getElementById(id) {
    assert.ok(ids[id], 'Unexpected DOM lookup: ' + id);
    return ids[id];
  },
  querySelectorAll(selector) {
    return selector === '.clerfit-input-error' ? validationErrors : [];
  }
};
const context = vm.createContext({ document, console });
vm.runInContext(scriptMatch[1], context, { filename: 'html/BMI.html:inline-script', timeout: 3000 });

let checks = 0;
function resetInputs() {
  ids.weight.value = '70'; ids.weightUnit.value = 'kg';
  ids.height.value = '175'; ids.heightUnit.value = 'cm';
  ids.age.value = '30'; ids.gender.value = 'male';
  context.syncBMIBounds();
}
function runCase(name, fn) {
  fn();
  checks++;
  process.stdout.write('PASS ' + name + '\n');
}

runCase('known adult BMI and category', () => {
  resetInputs();
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /BMI:\s*<b>22\.9<\/b>/);
  assert.match(ids.result.innerHTML, /Normal/);
  assert.equal(ids.indicator.title, 'Normal weight');
});
runCase('adult obesity classes and gauge labels follow adult BMI cutoffs', () => {
  for (const [bmiValue, expected] of [
    [32, 'Obesity class I'],
    [37, 'Obesity class II'],
    [42, 'Obesity class III']
  ]) {
    resetInputs();
    ids.weight.value = String(bmiValue * (1.75 ** 2));
    context.calculateBMI();
    assert.ok(ids.result.innerHTML.includes(expected), 'result category for BMI ' + bmiValue);
    assert.equal(ids.indicator.title, expected, 'gauge category for BMI ' + bmiValue);
  }
  assert.match(page, /Obesity class II[\s\S]*35\.0 – 39\.9/);
  assert.match(page, /Obesity class III[\s\S]*≥ 40\.0/);
  assert.doesNotMatch(page, /Obesity II\+/);
});
runCase('metres unit bounds and equivalent result', () => {
  resetInputs();
  ids.heightUnit.value = 'm';
  ids.height.value = '1.75';
  context.syncBMIBounds();
  assert.equal(ids.height.min, '0.5');
  assert.equal(ids.height.max, '2.74');
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /22\.9/);
});
runCase('feet and pounds selectors get compatible bounds', () => {
  resetInputs();
  ids.weightUnit.value = 'lbs';
  ids.weight.value = '154.3236';
  ids.heightUnit.value = 'in';
  ids.height.value = '68.8976378';
  context.syncBMIBounds();
  assert.equal(ids.weight.min, '4.41');
  assert.equal(ids.weight.max, '1102.31');
  assert.equal(ids.height.min, '19.69');
  assert.equal(ids.height.max, '107.87');
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /22\.9/);
});
runCase('feet height bounds are dynamically aligned', () => {
  resetInputs();
  ids.heightUnit.value = 'ft';
  context.syncBMIBounds();
  assert.equal(ids.height.min, '1.641');
  assert.equal(ids.height.max, '8.989');
});
runCase('pediatric ages do not receive adult-category labels', () => {
  resetInputs();
  ids.age.value = '17';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Age-specific interpretation required/);
  assert.match(ids.result.innerHTML, /does not estimate a pediatric percentile/);
  assert.doesNotMatch(ids.result.innerHTML, /— <b>Normal/);
});
runCase('missing/zero values clear old output and announce an error', () => {
  resetInputs();
  context.calculateBMI();
  ids.weight.value = '0';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /role="alert"/);
  assert.match(ids.result.innerHTML, /valid positive weight and height/);
  assert.equal(ids.indicator.innerHTML, '');
});
runCase('converted measurements outside calculator limits are rejected', () => {
  resetInputs();
  ids.weight.value = '1.9';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Check the measurements and units/);
  resetInputs();
  ids.height.value = '300';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Check the measurements and units/);
});
runCase('integer age bounds are enforced by the calculator', () => {
  resetInputs();
  ids.age.value = '1';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Enter a valid positive weight and height/);
  resetInputs();
  ids.age.value = '30.5';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Enter a valid positive weight and height/);
  resetInputs();
  ids.age.value = '121';
  context.calculateBMI();
  assert.match(ids.result.innerHTML, /Enter a valid positive weight and height/);
});
runCase('reset clears values, validation errors and indicator state', () => {
  resetInputs();
  context.calculateBMI();
  ids.weight.setAttribute('aria-invalid', 'true');
  ids.height.setAttribute('aria-invalid', 'true');
  const error = new Element('invalid');
  validationErrors.push(error);
  context.resetBMI();
  for (const id of ['weight', 'height', 'age', 'gender']) assert.equal(ids[id].value, '');
  assert.equal(ids.weightUnit.value, 'kg');
  assert.equal(ids.heightUnit.value, 'cm');
  assert.equal(ids.result.innerHTML, '');
  assert.equal(ids.indicator.innerHTML, '');
  assert.equal(ids.indicator.style.backgroundColor, '');
  assert.equal(ids.weight.getAttribute('aria-invalid'), null);
  assert.equal(ids.height.getAttribute('aria-invalid'), null);
  assert.equal(error.removed, true);
  assert.equal(ids.weight.focused, true);
});
runCase('markup includes reset, a live results region, and unit-bound handlers', () => {
  assert.match(page, /id="result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetBMI\(\)"/);
  assert.ok(page.includes('id="weightUnit"') && page.includes('onchange="clearBMIResult(); syncBMIBounds()"'));
  assert.ok(page.includes('id="heightUnit"') && page.includes('onchange="clearBMIResult(); syncBMIBounds()"'));
  assert.match(page, /id="age"[^>]*min="2"[^>]*max="120"/);
  assert.match(page, /<th scope="col">Category<\/th>/);
});

console.log('BMI page regression checks passed: ' + checks);
