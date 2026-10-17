'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class FakeMessage {
  constructor() { this.attributes = {}; this.textContent = ''; this.className = ''; this.id = ''; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  remove() {
    if (this.parentElement) this.parentElement.errors = this.parentElement.errors.filter(item => item !== this);
  }
}
class FakeParent {
  constructor() { this.errors = []; this.children = []; }
  querySelector(selector) { return selector === ':scope > .clerfit-input-error' ? (this.errors[0] || null) : null; }
}
class FakeInput {
  constructor(id, value, describedBy = '', parent = new FakeParent()) {
    this.id = id; this.name = id; this.placeholder = ''; this.type = 'number';
    this.value = value; this.required = true; this.disabled = false; this.readOnly = false;
    this.min = ''; this.max = ''; this.step = ''; this.validity = { valid: true };
    this.labels = []; this.attributes = {};
    this.parentElement = parent; this.parentElement.children.push(this);
    this.nextElementSibling = null;
    if (describedBy) this.attributes['aria-describedby'] = describedBy;
  }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  closest() { return null; }
  matches(selector) { return selector.includes('input[type="number"]') && this.type === 'number'; }
  insertAdjacentElement(_where, node) { node.parentElement = this.parentElement; this.parentElement.errors.push(node); }
}

const listeners = new Map();
const document = {
  addEventListener(name, handler) { listeners.set(name, handler); },
  createElement() { return new FakeMessage(); },
  querySelectorAll() { return []; }
};
const window = {};
const context = vm.createContext({ document, window, console, matchMedia: () => ({ matches: true }) });
vm.runInContext(fs.readFileSync('js/input-validation.js', 'utf8'), context, { filename: 'js/input-validation.js' });
const validation = window.ClerFitValidation;
assert.ok(validation && typeof validation.validate === 'function', 'validation API is exported');

const input = new FakeInput('weight', '0', 'weight-help');
assert.equal(validation.validate(input, true), false, 'out-of-range input is rejected');
assert.equal(input.getAttribute('aria-invalid'), 'true', 'invalid state is exposed');
const firstError = input.parentElement.errors[0];
assert.ok(firstError && firstError.id, 'validation message has a unique DOM id');
assert.equal(firstError.getAttribute('role'), 'alert', 'validation message is announced');
assert.deepEqual(input.getAttribute('aria-describedby').split(/\s+/).sort(), ['weight-help', firstError.id].sort(), 'input points to both its existing help text and error message');

input.value = '70';
assert.equal(validation.validate(input, true), true, 'valid replacement input is accepted');
assert.equal(input.getAttribute('aria-invalid'), null, 'invalid state is cleared after correction');
assert.equal(input.getAttribute('aria-describedby'), 'weight-help', 'original help reference is preserved');
assert.equal(input.parentElement.errors.length, 0, 'stale error message is removed');

const sharedParent = new FakeParent();
const left = new FakeInput('leftWeight', '0', 'left-help', sharedParent);
const right = new FakeInput('rightWeight', '0', 'right-help', sharedParent);
assert.equal(validation.validate(left, true), false);
assert.equal(validation.validate(right, true), false);
assert.equal(sharedParent.errors.length, 2, 'sibling fields receive separate error nodes');
const leftError = left.__clerfitInputErrorNode;
const rightError = right.__clerfitInputErrorNode;
assert.notEqual(leftError.id, rightError.id, 'generated error message ids are unique');
assert.deepEqual(left.getAttribute('aria-describedby').split(/\s+/).sort(), ['left-help', leftError.id].sort());
assert.deepEqual(right.getAttribute('aria-describedby').split(/\s+/).sort(), ['right-help', rightError.id].sort());
left.value = '70';
assert.equal(validation.validate(left, true), true, 'one valid field clears only its own error');
assert.equal(sharedParent.errors.length, 1, 'clearing one field leaves sibling error visible');
assert.equal(sharedParent.errors[0], rightError, 'sibling error node is retained');
assert.equal(right.getAttribute('aria-invalid'), 'true', 'sibling remains invalid');
assert.equal(right.getAttribute('aria-describedby'), 'right-help ' + rightError.id, 'sibling association is preserved');

console.log('PASS: invalid-state semantics, unique per-input error nodes, aria-describedby association, help-text preservation and isolated cleanup.');
