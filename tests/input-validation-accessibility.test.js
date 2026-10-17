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
  constructor(id, value, describedBy = '') {
    this.id = id; this.name = id; this.placeholder = ''; this.type = 'number';
    this.value = value; this.required = true; this.disabled = false; this.readOnly = false;
    this.min = ''; this.max = ''; this.step = ''; this.validity = { valid: true };
    this.labels = []; this.attributes = {};
    this.parentElement = new FakeParent(); this.parentElement.children.push(this);
    this.nextElementSibling = null;
    if (describedBy) this.attributes['aria-describedby'] = describedBy;
  }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  closest() { return null; }
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
assert.deepEqual(input.getAttribute('aria-describedby').split(/\\s+/).sort(), ['weight-help', firstError.id].sort(), 'input points to both its existing help text and error message');

input.value = '70';
assert.equal(validation.validate(input, true), true, 'valid replacement input is accepted');
assert.equal(input.getAttribute('aria-invalid'), null, 'invalid state is cleared after correction');
assert.equal(input.getAttribute('aria-describedby'), 'weight-help', 'original help reference is preserved');
assert.equal(input.parentElement.errors.length, 0, 'stale error message is removed');

const other = new FakeInput('otherWeight', '0');
assert.equal(validation.validate(other, true), false);
const secondError = other.parentElement.errors[0];
assert.notEqual(firstError.id, secondError.id, 'generated error message ids are unique');
assert.match(other.getAttribute('aria-describedby'), new RegExp(secondError.id));

console.log('PASS: invalid-state semantics, unique error IDs, aria-describedby association, help-text preservation and error cleanup.');
