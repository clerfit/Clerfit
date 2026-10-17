#!/usr/bin/env node
'use strict';

// Focused behavioral tests for the Body Fat Percentage calculator and its page contract.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const page = fs.readFileSync('html/bodyfat.html', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');

class Element {
  constructor(value = '') {
    this.value = String(value);
    this.min = '';
    this.max = '';
    this.required = false;
    this.disabled = false;
    this.style = { left: '0%', backgroundColor: '' };
    this.attributes = {};
    this.removed = false;
    this.focused = false;
    this._html = '';
    this._text = '';
    this.nextElementSibling = null;
    this.classList = { contains: () => false };
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

const ids = {};
const document = {
  addEventListener() {},
  getElementById(id) {
    if (!ids[id]) ids[id] = new Element('');
    return ids[id];
  },
  querySelectorAll(selector) {
    return selector === '.clerfit-input-error' ? errors : [];
  }
};
const errors = [];
const context = vm.createContext({ document, console, Math, Number, String, Object, Promise });
vm.runInContext(engine, context, { filename: 'js/engine.js', timeout: 3000 });

let checks = 0;
function runCase(name, fn) {
  fn();
  checks++;
  process.stdout.write('PASS ' + name + '\n');
}
function setValues(values) {
  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).value = value;
  });
}
function resetTestState() {
  setValues({
    'bf-gender': 'male',
    'bf-height': 180, 'bf-height-unit': 'cm',
    'bf-waist': 85, 'bf-waist-unit': 'cm',
    'bf-neck': 38, 'bf-neck-unit': 'cm',
    'bf-hip': '', 'bf-hip-unit': 'cm'
  });
  context.clearBodyFatOutput();
  context.syncBodyFatBounds();
}
function output(id) {
  const el = document.getElementById(id);
  return el.textContent || el.innerHTML;
}

runCase('known male result and formula', () => {
  resetTestState();
  context.calculateBodyFat();
  assert.match(output('bf-result'), /16\.2%/);
  assert.match(output('bf-formula'), /US Navy male equation/);
  assert.match(output('bf-formula'), /measurements converted to inches/);
  assert.ok(output('bf-result').startsWith('Estimated Body Fat Percentage:'));
});
runCase('equivalent inch inputs produce the same male result', () => {
  resetTestState();
  setValues({
    'bf-height': 70.8661417, 'bf-height-unit': 'inch',
    'bf-waist': 33.4645669, 'bf-waist-unit': 'inch',
    'bf-neck': 14.9606299, 'bf-neck-unit': 'inch'
  });
  context.syncBodyFatBounds();
  context.calculateBodyFat();
  assert.match(output('bf-result'), /16\.2%/);
  assert.equal(document.getElementById('bf-height').min, '39.3701');
  assert.equal(document.getElementById('bf-height').max, '98.4252');
});
runCase('feet selection maps height and circumference controls to matching ranges', () => {
  resetTestState();
  setValues({
    'bf-height-unit': 'ft', 'bf-waist-unit': 'ft',
    'bf-neck-unit': 'ft', 'bf-hip-unit': 'ft'
  });
  context.syncBodyFatBounds();
  assert.equal(document.getElementById('bf-height').min, '3.2809');
  assert.equal(document.getElementById('bf-height').max, '8.2021');
  assert.equal(document.getElementById('bf-waist').min, '0.6562');
  assert.equal(document.getElementById('bf-neck').min, '0.4922');
  assert.equal(document.getElementById('bf-hip').min, '0.6562');
});
runCase('known female result requires hip and uses the female equation', () => {
  resetTestState();
  setValues({
    'bf-gender': 'female',
    'bf-height': 165, 'bf-height-unit': 'cm',
    'bf-waist': 75, 'bf-waist-unit': 'cm',
    'bf-neck': 33, 'bf-neck-unit': 'cm',
    'bf-hip': 95, 'bf-hip-unit': 'cm'
  });
  context.syncBodyFatBounds();
  assert.equal(document.getElementById('bf-hip').required, true);
  context.calculateBodyFat();
  assert.match(output('bf-result'), /27\.2%/);
  assert.match(output('bf-formula'), /US Navy female equation/);
});
runCase('missing female hip produces an actionable error and clears prior result', () => {
  resetTestState();
  context.calculateBodyFat();
  setValues({
    'bf-gender': 'female',
    'bf-height': 165, 'bf-waist': 75, 'bf-neck': 33, 'bf-hip': ''
  });
  context.syncBodyFatBounds();
  context.calculateBodyFat();
  assert.match(output('bf-result'), /valid hip measurement is required/i);
  assert.equal(output('bf-formula'), '');
  assert.doesNotMatch(output('bf-result'), /16\.2%/);
});
runCase('waist must exceed neck before applying the logarithmic equation', () => {
  resetTestState();
  setValues({ 'bf-waist': 38, 'bf-neck': 38 });
  context.calculateBodyFat();
  assert.match(output('bf-result'), /waist must exceed neck/i);
  assert.equal(output('bf-formula'), '');
  assert.equal(document.getElementById('bf-indicator').style.left, '0%');
});
runCase('unknown measurement units never emit NaN or Infinity', () => {
  resetTestState();
  setValues({ 'bf-waist-unit': 'unknown' });
  context.calculateBodyFat();
  assert.match(output('bf-result'), /Check the measurements/i);
  assert.doesNotMatch(output('bf-result'), /NaN|Infinity/);
});
runCase('impossible output outside 0–100 percent is rejected', () => {
  resetTestState();
  setValues({ 'bf-height': 250, 'bf-waist': 30, 'bf-neck': 29 });
  context.calculateBodyFat();
  assert.match(output('bf-result'), /physically valid body-fat percentage \(0–100%\)/);
  assert.equal(output('bf-formula'), '');
});
runCase('reset clears inputs, errors, formula and indicator and focuses height', () => {
  resetTestState();
  context.calculateBodyFat();
  const error = new Element('old error');
  errors.push(error);
  document.getElementById('bf-height').setAttribute('aria-invalid', 'true');
  context.resetBodyFat();
  for (const id of ['bf-height', 'bf-waist', 'bf-neck', 'bf-hip']) {
    assert.equal(document.getElementById(id).value, '');
    assert.equal(document.getElementById(id).getAttribute('aria-invalid'), null);
  }
  for (const id of ['bf-height-unit', 'bf-waist-unit', 'bf-neck-unit', 'bf-hip-unit']) {
    assert.equal(document.getElementById(id).value, 'cm');
  }
  assert.equal(document.getElementById('bf-gender').value, 'male');
  assert.equal(document.getElementById('bf-hip').required, false);
  assert.equal(output('bf-result'), '');
  assert.equal(output('bf-formula'), '');
  assert.equal(document.getElementById('bf-indicator').style.left, '0%');
  assert.equal(error.removed, true);
  assert.equal(document.getElementById('bf-height').focused, true);
});
runCase('editing an input clears stale output and indicator', () => {
  resetTestState();
  context.calculateBodyFat();
  assert.match(output('bf-result'), /16\.2%/);
  context.clearBodyFatOutput();
  assert.equal(output('bf-result'), '');
  assert.equal(output('bf-formula'), '');
  assert.equal(document.getElementById('bf-indicator').style.left, '0%');
});
runCase('page exposes labels, result announcements, reset, unit handlers, and no duplicate shared scripts', () => {
  assert.match(page, /<label for="bf-height">Height<\/label>/);
  assert.match(page, /<label for="bf-waist">Waist<\/label>/);
  assert.match(page, /<label for="bf-neck">Neck<\/label>/);
  assert.match(page, /<label for="bf-hip">Hip \(females only\)<\/label>/);
  assert.match(page, /id="bf-result" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(page, /onclick="resetBodyFat\(\)"/);
  assert.match(page, /onchange="clearBodyFatOutput\(\)"/);
  for (const source of ['navigation.js', 'unit-system.js']) {
    const occurrences = page.match(new RegExp('<script src="\\.\\./js/' + source + '"', 'g')) || [];
    assert.equal(occurrences.length, 1, source + ' should be included only once on the page');
  }
});

console.log('Body Fat page regression checks passed: ' + checks);
