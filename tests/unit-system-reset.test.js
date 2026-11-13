'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('js/unit-system.js', 'utf8');
const frames = [];
const elements = new Map();
const makeInput = () => {
  const attrs = new Map([['min', '80'], ['max', '250']]);
  return {
    id: 'height', type: 'number', value: '175', disabled: false, readOnly: false,
    get min() { return attrs.get('min') || ''; },
    get max() { return attrs.get('max') || ''; },
    dataset: {},
    getAttribute: key => attrs.has(key) ? attrs.get(key) : null,
    setAttribute: (key, value) => attrs.set(key, String(value)),
    removeAttribute: key => attrs.delete(key),
    dispatchEvent() {},
    matches: selector => selector === 'input[type="number"]'
  };
};
const input = makeInput();
const formListeners = {};
const selectListeners = {};
const form = {
  dataset: {},
  addEventListener(type, fn) { formListeners[type] = fn; },
  querySelectorAll(selector) { return selector === 'select[data-clerfit-unit-wired="true"]' ? [select] : []; }
};
const select = {
  id: 'heightUnit', value: 'cm', form,
  dataset: { unitFor: 'height' },
  options: [
    { value: 'cm', textContent: 'Centimetres (cm)', defaultSelected: true },
    { value: 'in', textContent: 'Inches (in)', defaultSelected: false }
  ],
  matches: selector => selector === 'select',
  addEventListener(type, fn) { selectListeners[type] = fn; }
};
elements.set('height', input);
const document = {
  readyState: 'complete',
  body: {},
  querySelectorAll: selector => selector === 'select' ? [select] : [],
  getElementById: id => elements.get(id) || null
};
const window = { location: { pathname: '/html/bai.html' } };
vm.runInNewContext(source, vm.createContext({
  window, document, Number, String, Array, Set, Math, WeakMap,
  Event: function Event(type) { this.type = type; },
  requestAnimationFrame: fn => frames.push(fn)
}), { filename: 'js/unit-system.js', timeout: 3000 });

assert.equal(typeof selectListeners.change, 'function', 'unit selector is wired');
assert.equal(typeof formListeners.reset, 'function', 'calculator form reset is wired');
select.value = 'in';
selectListeners.change();
assert.ok(Math.abs(Number(input.min) - 80 / 2.54) < 1e-7, 'minimum converts to inches');
assert.ok(Math.abs(Number(input.max) - 250 / 2.54) < 1e-7, 'maximum converts to inches');
assert.ok(Math.abs(Number(input.value) - 175 / 2.54) < 1e-7, 'value converts to inches');

// Simulate the browser's native value reset before requestAnimationFrame callbacks.
select.value = 'cm';
input.value = '175';
formListeners.reset();
frames.splice(0).forEach(fn => fn());
assert.equal(select.value, 'cm', 'selector returns to its default unit');
assert.equal(select.dataset.clerfitPreviousUnit, 'cm', 'previous-unit tracking is synchronized');
assert.equal(input.min, '80', 'minimum returns to original centimetre boundary');
assert.equal(input.max, '250', 'maximum returns to original centimetre boundary');

// A second conversion after reset must use cm as the previous unit, not stale inches.
select.value = 'in';
selectListeners.change();
assert.ok(Math.abs(Number(input.min) - 80 / 2.54) < 1e-7, 'post-reset conversion uses restored minimum');
assert.ok(Math.abs(Number(input.max) - 250 / 2.54) < 1e-7, 'post-reset conversion uses restored maximum');

const validation = fs.readFileSync('js/input-validation.js', 'utf8');
assert.match(validation, /addEventListener\('reset',[\s\S]*forEach\(clearError\)/, 'reset clears cached validation error nodes');
const polish = fs.readFileSync('js/site-polish.js', 'utf8');
assert.match(polish, /ClerFitValidation\.clearError/, 'site reset uses validation cleanup API');
console.log('PASS: unit-system reset restores original bounds and previous-unit state; validation error references are cleared.');
