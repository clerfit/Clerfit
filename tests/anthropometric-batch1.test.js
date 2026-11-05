#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('js/anthropometric-calculators.js', 'utf8');
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

// Exercise actual page event wiring, validation, output and reset behavior.
function runPage(calculator, values, fieldSpecs) {
  const elements = new Map();
  const handlers = {};
  const make = id => {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', min: '', max: '', required: false, innerHTML: '', textContent: '',
      focus() {},
      addEventListener(type, callback) { handlers[id + ':' + type] = callback; },
      querySelector() { return null; }
    });
    return elements.get(id);
  };
  const form = make('calc-form');
  form.addEventListener = (type, callback) => { handlers[type] = callback; };
  const output = make('calc-result');
  Object.entries(values).forEach(([id, value]) => { make(id).value = String(value); });
  const fields = fieldSpecs.map(spec => {
    const field = make(spec.id);
    field.min = String(spec.min == null ? '' : spec.min);
    field.max = String(spec.max == null ? '' : spec.max);
    field.required = spec.required !== false;
    return field;
  });
  let ready;
  const pageDocument = {
    body: { dataset: { calculator } },
    getElementById: id => elements.get(id) || null,
    querySelectorAll: selector => selector === '[data-field]' ? fields : [],
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
  return { get html() { return output.innerHTML; }, reset: () => handlers.reset({}) };
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
  { id: 'calf', min: 15 / 2.54, max: 100 / 2.54 },
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
console.log('PASS: Batch 1 anthropometric calculators — formula vectors, unit equivalence, invalid domains, form wiring, reset, and page markup.');
