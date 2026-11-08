#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('js/anthropometric-calculators.js', 'utf8');
const tooltipSource = fs.readFileSync('js/tooltips.js', 'utf8');
const window = {};
const document = {
  body: { dataset: { calculator: '' } },
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener() {}
};
vm.runInNewContext(source, vm.createContext({ window, document, console, Number, Math }), {
  filename: 'js/anthropometric-calculators.js',
  timeout: 3000
});
const api = window.ClerFitAnthropometric;
assert.ok(api, 'Batch 1 anthropometric calculation API is exported.');

const close = (actual, expected, message, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, message + ': expected ' + expected + ', got ' + actual);
};

// Circle geometry: C = 10π cm gives diameter 10 cm, radius 5 cm and area 25π cm².
const neck = api.circleMetrics('neck-circumference', 10 * Math.PI, 'cm');
close(neck.diameterCm, 10, 'Neck equivalent diameter');
close(neck.radiusCm, 5, 'Neck equivalent radius');
close(neck.areaCm2, 25 * Math.PI, 'Neck equivalent area');
assert.equal(neck.volumeCm3, undefined, 'Neck calculator does not invent a segment length');

// Optional cylinder proxy: area 25π cm² × 20 cm = 500π cm³.
const thigh = api.circleMetrics('mid-thigh-circumference', 10 * Math.PI, 'cm', 20, 'cm');
close(thigh.volumeCm3, 500 * Math.PI, 'Mid-thigh cylinder volume proxy');

// Imperial inputs must produce the same canonical result.
const calf = api.circleMetrics('calf-circumference', (10 * Math.PI) / 2.54, 'in', 10 / 2.54, 'in');
close(calf.diameterCm, 10, 'Calf imperial diameter');
close(calf.areaCm2, 25 * Math.PI, 'Calf imperial area');
close(calf.volumeCm3, 250 * Math.PI, 'Calf imperial volume proxy');
assert.throws(() => api.circleMetrics('neck-circumference', 0, 'cm'), /positive finite value/i);
assert.throws(() => api.circleMetrics('neck-circumference', 9, 'cm'), /between 10 and 100 cm/i);
assert.throws(() => api.circleMetrics('mid-thigh-circumference', 50, 'cm', 2, 'cm'), /Segment length must be between 5 and 100 cm/i);
assert.throws(() => api.circleMetrics('unknown', 50, 'cm'), /supported circumference calculator/i);

// MUAC known answer: MUAC 30 cm, TSF 10 mm => MUAMC 26.8584 cm.
const muac = api.muacMetrics(30, 'cm', 10, 'mm');
close(muac.muscleCircumferenceCm, 30 - Math.PI, 'MUAMC known answer');
close(muac.totalArmAreaCm2, 900 / (4 * Math.PI), 'Total arm area known answer');
close(muac.musclePlusBoneAreaCm2, Math.pow(30 - Math.PI, 2) / (4 * Math.PI), 'MUAMA known answer');
close(muac.fatAreaCm2, muac.totalArmAreaCm2 - muac.musclePlusBoneAreaCm2, 'Arm fat area identity');
close(muac.fatAreaPercent, 19.847328312699798, 'Arm fat-area percentage');
const muacImperial = api.muacMetrics(30 / 2.54, 'in', 10 / 25.4, 'in');
close(muacImperial.muscleCircumferenceCm, muac.muscleCircumferenceCm, 'MUAC imperial conversion');
close(muacImperial.musclePlusBoneAreaCm2, muac.musclePlusBoneAreaCm2, 'MUAMA imperial conversion');
assert.throws(() => api.muacMetrics(0, 'cm', 10, 'mm'), /positive finite value/i);
assert.throws(() => api.muacMetrics(10, 'cm', 60, 'mm'), /too large for this MUAC/i);
assert.throws(() => api.muacMetrics(30, 'cm', 0, 'mm'), /positive finite value/i);

// BAI known answer: hip 100 cm, height 175 cm => 25.1959%.
const bai = api.calculateBAI(100, 'cm', 175, 'cm', 30);
close(bai.value, 25.195939772483108, 'BAI known answer');
const baiImperial = api.calculateBAI(100 / 2.54, 'in', 175 / 2.54, 'in', 30);
close(baiImperial.value, bai.value, 'BAI imperial conversion');
assert.throws(() => api.calculateBAI(100, 'cm', 175, 'cm', 17), /adults aged 18–120/i);
assert.throws(() => api.calculateBAI(0, 'cm', 175, 'cm', 30), /positive finite value/i);
assert.throws(() => api.calculateBAI(250, 'cm', 80, 'cm', 30), /outside 0–100%/);
assert.throws(() => api.calculateBAI(30, 'cm', 250, 'cm', 30), /outside 0–100%/, 'BAI negative output is rejected by the mathematical plausibility guard');

// Exact lower/upper domain boundaries for every formula input.
for (const [kind, min, max] of [
  ['neck-circumference', 10, 100],
  ['mid-thigh-circumference', 15, 120],
  ['calf-circumference', 10, 100]
]) {
  assert.doesNotThrow(() => api.circleMetrics(kind, min, 'cm'), kind + ' accepts its exact lower circumference bound');
  assert.doesNotThrow(() => api.circleMetrics(kind, max, 'cm'), kind + ' accepts its exact upper circumference bound');
  assert.throws(() => api.circleMetrics(kind, min - 0.001, 'cm'), kind + ' rejects below its lower bound');
  assert.throws(() => api.circleMetrics(kind, max + 0.001, 'cm'), kind + ' rejects above its upper bound');
}
assert.doesNotThrow(() => api.muacMetrics(5, 'cm', 1, 'mm'), 'MUAC accepts lower arm and skinfold bounds');
assert.doesNotThrow(() => api.muacMetrics(80, 'cm', 60, 'mm'), 'MUAC accepts upper arm and skinfold bounds when the relationship is valid');
assert.throws(() => api.muacMetrics(4.999, 'cm', 1, 'mm'), /between 5 and 80 cm/i);
assert.throws(() => api.muacMetrics(80.001, 'cm', 1, 'mm'), /between 5 and 80 cm/i);
assert.throws(() => api.muacMetrics(30, 'cm', 0.99, 'mm'), /between 0\.1 and 6 cm/i);
assert.throws(() => api.muacMetrics(30, 'cm', 60.001, 'mm'), /between 0\.1 and 6 cm/i);
assert.doesNotThrow(() => api.calculateBAI(100, 'cm', 175, 'cm', 18), 'BAI accepts age 18');
assert.doesNotThrow(() => api.calculateBAI(100, 'cm', 175, 'cm', 120), 'BAI accepts age 120');
assert.throws(() => api.calculateBAI(100, 'cm', 175, 'cm', 17.999), /18–120/i);
assert.throws(() => api.calculateBAI(100, 'cm', 175, 'cm', 120.001), /18–120/i);
assert.doesNotThrow(() => api.calculateBAI(30, 'cm', 80, 'cm', 30), 'BAI accepts lower hip and height bounds');
assert.doesNotThrow(() => api.calculateBAI(250, 'cm', 250, 'cm', 30), 'BAI accepts upper hip and height bounds');
assert.throws(() => api.calculateBAI(29.999, 'cm', 80, 'cm', 30), /between 30 and 250 cm/i);
assert.throws(() => api.calculateBAI(250.001, 'cm', 250, 'cm', 30), /between 30 and 250 cm/i);
assert.throws(() => api.calculateBAI(30, 'cm', 79.999, 'cm', 30), /between 80 and 250 cm/i);
assert.throws(() => api.calculateBAI(100, 'cm', 250.001, 'cm', 30), /between 80 and 250 cm/i);

// Exercise actual page event wiring, validation, output and reset behavior.
function runPage(calculator, values, fieldSpecs) {
  const elements = new Map();
  const handlers = {};
  const make = id => {
    if (!elements.has(id)) {
      const attrs = new Map();
      elements.set(id, {
        id, value: '', min: '', max: '', required: false, innerHTML: '', textContent: '',
        setAttribute(name, value) { attrs.set(name, String(value)); },
        getAttribute(name) { return attrs.has(name) ? attrs.get(name) : null; },
        removeAttribute(name) { attrs.delete(name); },
        hasAttribute(name) { return attrs.has(name); },
        matches(selector) { return selector === '[data-field]' ? this.dataField === true : selector === 'input[type="number"]' ? this.type === 'number' : selector === 'select' ? this.type === 'select-one' : false; },
        focus() { this.focused = true; },
        addEventListener(type, callback) { handlers[id + ':' + type] = callback; },
        querySelector() { return null; }
      });
    }
    return elements.get(id);
  };
  const form = make('calc-form');
  form.querySelectorAll = selector => selector === '[aria-invalid="true"]' ? fields.filter(field => field.getAttribute('aria-invalid') === 'true') : [];
  form.addEventListener = (type, callback) => { handlers[type] = callback; };
  const output = make('calc-result');
  Object.entries(values).forEach(([id, value]) => {
    const element = make(id);
    if (/Unit$/.test(id)) element.type = 'select-one';
    element.value = String(value);
  });
  const fields = fieldSpecs.map(spec => {
    const field = make(spec.id);
    field.type = 'number';
    field.dataField = true;
    field.setAttribute('aria-describedby', 'calc-help');
    field.min = String(spec.min == null ? '' : spec.min);
    field.max = String(spec.max == null ? '' : spec.max);
    field.required = spec.required !== false;
    if (spec.validity) field.validity = spec.validity;
    return field;
  });
  let ready;
  const pageDocument = {
    body: { dataset: { calculator } },
    getElementById: id => elements.get(id) || null,
    querySelectorAll: selector => selector === '[data-field]' ? fields : selector === '[aria-invalid="true"]' ? fields.filter(field => field.getAttribute('aria-invalid') === 'true') : [],
    addEventListener: (type, callback) => { if (type === 'DOMContentLoaded') ready = callback; }
  };
  const pageWindow = {};
  vm.runInNewContext(source, vm.createContext({ window: pageWindow, document: pageDocument, console, Number, Math }), {
    filename: 'batch-1-' + calculator,
    timeout: 3000
  });
  assert.equal(typeof ready, 'function', calculator + ' registers DOM ready');
  ready();
  assert.equal(typeof handlers.submit, 'function', calculator + ' wires form submission');
  handlers.submit({ preventDefault() {} });
  return {
    get html() { return output.innerHTML; },
    output,
    field: id => make(id),
    input: id => handlers.input && handlers.input({ target: make(id) }),
    change: id => handlers.change && handlers.change({ target: { id, matches: selector => selector === "select" } }),
    reset: () => handlers.reset({})
  };
}

let page = runPage('neck-circumference', { neck: 10 * Math.PI, neckUnit: 'cm' }, [
  { id: 'neck', min: 10, max: 100 }
]);
assert.match(page.html, /Circle-equivalent diameter: 10 cm/);
assert.match(page.html, /cross-sectional area: 78\.54 cm²/);
page.reset();
assert.equal(page.html, '', 'Reset clears the result');

page = runPage('muac', { muac: 30, muacUnit: 'cm', tricepsSkinfold: 10, tricepsUnit: 'mm' }, [
  { id: 'muac', min: 5, max: 80 }, { id: 'tricepsSkinfold', min: 1, max: 60 }
]);
assert.match(page.html, /Total arm area: 71\.62 cm²/);
assert.match(page.html, /\(MUAMC\): 26\.858 cm/);
assert.match(page.html, /fat-area fraction: 19\.847%/);

page = runPage('mid-thigh-circumference', {
  thigh: 10 * Math.PI, thighUnit: 'cm', segmentLength: 20, segmentLengthUnit: 'cm'
}, [
  { id: 'thigh', min: 15, max: 120 }, { id: 'segmentLength', min: 5, max: 100, required: false }
]);
assert.match(page.html, /cylindrical volume proxy: 1,570\.796 cm³/);

page = runPage('calf-circumference', {
  calf: (10 * Math.PI) / 2.54, calfUnit: 'in', segmentLength: 10 / 2.54, segmentLengthUnit: 'in'
}, [
  { id: 'calf', min: 10 / 2.54, max: 100 / 2.54 },
  { id: 'segmentLength', min: 5 / 2.54, max: 80 / 2.54, required: false }
]);
assert.match(page.html, /cylindrical volume proxy: 785\.398 cm³/);

page = runPage('bai', { hip: 100, hipUnit: 'cm', height: 175, heightUnit: 'cm', age: 30 }, [
  { id: 'hip', min: 30, max: 250 }, { id: 'height', min: 80, max: 250 }, { id: 'age', min: 18, max: 120 }
]);
assert.match(page.html, /BAI: 25\.196%/);
page = runPage('bai', { hip: 100, hipUnit: 'cm', height: 175, heightUnit: 'cm', age: 17 }, [
  { id: 'hip', min: 30, max: 250 }, { id: 'height', min: 80, max: 250 }, { id: 'age', min: 18, max: 120 }
]);
assert.match(page.html, /valid values within the displayed ranges/i);
assert.doesNotMatch(page.html, /BAI:/);
page = runPage('bai', { hip: 100, hipUnit: 'cm', height: 175, heightUnit: 'cm', age: 18.5 }, [
  { id: 'hip', min: 30, max: 250 }, { id: 'height', min: 80, max: 250 },
  { id: 'age', min: 18, max: 120, validity: { valid: false } }
]);
assert.match(page.html, /valid values within the displayed ranges/i);
assert.doesNotMatch(page.html, /BAI:/, 'step-mismatched adult age must not calculate');

// Every page exposes local unit controls, real derived outputs and shared behavior.
const pages = [
  ['neck-circumference.html', 'neck-circumference'],
  ['muac.html', 'muac'],
  ['mid-thigh-circumference.html', 'mid-thigh-circumference'],
  ['calf-circumference.html', 'calf-circumference'],
  ['bai.html', 'bai']
];
for (const [file, calculator] of pages) {
  const html = fs.readFileSync('html/' + file, 'utf8');
  assert.match(html, new RegExp('data-calculator="' + calculator + '"'));
  assert.match(html, /data-unit-for=/, file + ' has a calculator-scoped unit selector');
  assert.match(html, /type="submit"/, file + ' has Calculate');
  assert.match(html, /type="reset"/, file + ' has Reset');
  assert.match(html, /id="calc-result"[^>]*aria-live="polite"/, file + ' has an announced result region');
  assert.match(html, /anthropometric-calculators\.js/, file + ' loads the calculation engine');
}

// Editing any measurement or changing any unit invalidates the displayed result on every Batch 1 page.
const staleCases = [
  ['neck-circumference', { neck: 40, neckUnit: 'cm' }, [{ id: 'neck', min: 10, max: 100 }], 'neck', 'neckUnit'],
  ['muac', { muac: 30, muacUnit: 'cm', tricepsSkinfold: 10, tricepsUnit: 'mm' }, [{ id: 'muac', min: 5, max: 80 }, { id: 'tricepsSkinfold', min: 1, max: 60 }], 'muac', 'muacUnit'],
  ['mid-thigh-circumference', { thigh: 50, thighUnit: 'cm', segmentLength: '', segmentLengthUnit: 'cm' }, [{ id: 'thigh', min: 15, max: 120 }, { id: 'segmentLength', min: 5, max: 100, required: false }], 'thigh', 'thighUnit'],
  ['calf-circumference', { calf: 35, calfUnit: 'cm', segmentLength: '', segmentLengthUnit: 'cm' }, [{ id: 'calf', min: 10, max: 100 }, { id: 'segmentLength', min: 5, max: 80, required: false }], 'calf', 'calfUnit'],
  ['bai', { hip: 100, hipUnit: 'cm', height: 175, heightUnit: 'cm', age: 30 }, [{ id: 'hip', min: 30, max: 250 }, { id: 'height', min: 80, max: 250 }, { id: 'age', min: 18, max: 120 }], 'hip', 'hipUnit']
];
for (const [kind, values, specs, inputId, unitId] of staleCases) {
  const current = runPage(kind, values, specs);
  assert.notEqual(current.html, '', kind + ' initially calculates');
  current.field(inputId).value = String(Number(current.field(inputId).value) + 1);
  current.input(inputId);
  assert.equal(current.html, '', kind + ' clears stale output after measurement edits');
  const recalculated = runPage(kind, values, specs);
  assert.notEqual(recalculated.html, '', kind + ' can calculate again');
  recalculated.change(unitId);
  assert.equal(recalculated.html, '', kind + ' clears stale output after unit changes');
}

// Adversarial UI checks: cross-field MUAC error association, result invalidation and recovery.
page = runPage('muac', { muac: 5, muacUnit: 'cm', tricepsSkinfold: 60, tricepsUnit: 'mm' }, [
  { id: 'muac', min: 5, max: 80 }, { id: 'tricepsSkinfold', min: 1, max: 60 }
]);
assert.match(page.html, /too large for this MUAC/i);
assert.equal(page.field('muac').getAttribute('aria-invalid'), 'true');
assert.equal(page.field('tricepsSkinfold').getAttribute('aria-invalid'), 'true');
assert.match(page.field('tricepsSkinfold').getAttribute('aria-describedby'), /calc-result/);
assert.equal(page.field('tricepsSkinfold').focused, true, 'MUAC cross-field error focuses the skinfold input');
page.field('tricepsSkinfold').value = '10';
page.input('tricepsSkinfold');
assert.equal(page.html, '', 'Editing a measurement clears stale results');
assert.equal(page.field('muac').getAttribute('aria-invalid'), null, 'Editing clears cross-field invalid state');
assert.equal(page.field('tricepsSkinfold').getAttribute('aria-invalid'), null, 'Editing clears cross-field invalid state');
assert.equal(page.field('muac').getAttribute('aria-describedby'), 'calc-help', 'Editing preserves original MUAC help association');
assert.equal(page.field('tricepsSkinfold').getAttribute('aria-describedby'), 'calc-help', 'Editing preserves original skinfold help association');

// Each calculator's HTML field boundaries must be present, finite and ordered.
for (const [file] of pages) {
  const html = fs.readFileSync('html/' + file, 'utf8');
  const numericFields = [...html.matchAll(/<input\b[^>]*type="number"[^>]*>/gi)];
  assert.ok(numericFields.length > 0, file + ' has numeric calculator inputs');
  for (const match of numericFields) {
    const tag = match[0];
    const min = Number((tag.match(/\bmin="([^"]+)"/i) || [])[1]);
    const max = Number((tag.match(/\bmax="([^"]+)"/i) || [])[1]);
    assert.ok(Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > min, file + ' has positive, ordered numeric boundaries');
  }
}

assert.match(tooltipSource, /body adiposity index/i, 'BAI has contextual help');
assert.match(tooltipSource, /mid-upper-arm circumference/i, 'MUAC has contextual help');
assert.match(tooltipSource, /\.header h1/, 'specialist calculator headings receive contextual help');
console.log('PASS: Batch 1 anthropometric calculators — formula vectors, unit equivalence, invalid domains, form wiring, reset, and page markup.');
