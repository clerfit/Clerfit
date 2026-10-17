#!/usr/bin/env node
'use strict';

// Deterministic known-answer tests for the generated R3 calculators and shared unit engine.
// These are implementation regression tests, not clinical certification.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = path => fs.readFileSync(path, 'utf8');
const window = {};
const document = {
  readyState: 'complete',
  body: { dataset: { calculator: '' } },
  querySelectorAll: () => [],
  getElementById: () => null
};
const context = vm.createContext({ window, document, console });

vm.runInContext(read('js/bmi-for-age.js'), context, { filename: 'js/bmi-for-age.js', timeout: 3000 });
vm.runInContext(read('js/advanced-calculators.js'), context, { filename: 'js/advanced-calculators.js', timeout: 3000 });
const defs = window.ClerFitAdvancedDefinitions;
assert.ok(defs && typeof defs === 'object', 'Advanced calculator definitions must be exported for tests.');

const vectors = [
  ['facial-thirds', { upper: 50, middle: 60, lower: 70 }, '27.8% / 33.3% / 38.9%'],
  ['jaw-width-ratio', { jaw: 100, face: 150 }, '0.667'],
  ['chin-height-ratio', { chin: 40, lower: 60 }, '0.667'],
  ['nose-length-ratio', { nose: 50, face: 150 }, '0.333'],
  ['mouth-width-ratio', { mouth: 60, face: 150 }, '0.400'],
  ['eye-spacing', { space: 30, eye: 30 }, '1.000'],
  ['lower-face-height', { lower: 60, face: 180 }, '0.333'],
  ['facial-balance', { upper: 50, middle: 60, lower: 70 }, '13.6% variation'],
  ['rest-interval', { work: 30, rest: 60 }, '2.00 : 1'],
  ['session-density', { work: 30, total: 60 }, '50.0%'],
  ['load-recovery-ratio', { load: 60, recovery: 30 }, '2.00'],
  ['weekly-training-count', { sessions: 5, minutes: 45 }, '5 sessions/week'],
  ['recovery-time', { end: '2026-10-17T08:00', next: '2026-10-17T12:00' }, '4 hours'],
  ['fatigue-index', { fatigue: 6, soreness: 4, stress: 5, sleep: 8 }, '39 / 100'],
  ['bmi-for-age', { weight: 33.125, height: 125, age: 9, ageMonths: 6, sex: 'female' }, '21.2 kg/m²'],
  ['waist-risk', { waist: 80, age: 30, sex: 'female' }, '80 cm'],
  ['hip-risk', { waist: 80, hip: 100, sex: 'male' }, '0.800'],
  ['waist-height-risk', { waist: 80, height: 170, age: 30 }, '0.471'],
  ['forward-head-index', { offset: 20, height: 200 }, '0.100'],
  ['shoulder-symmetry', { left: 500, right: 510 }, '10 mm difference'],
  ['leg-length-difference', { left: 85, right: 84.5 }, '0.5 cm'],
  ['sit-stand-ratio', { reps: 15, time: 30 }, '30 reps/min'],
  ['chest-expansion', { exhale: 95, inhale: 100 }, '5 cm'],
  ['body-alignment', { left: 180, right: 182 }, '2 mm difference']
];

let checks = 0;
for (const [key, input, expected] of vectors) {
  assert.ok(defs[key], 'Missing generated calculator definition: ' + key);
  const result = defs[key].calculate(input);
  assert.equal(result.primary, expected, key + ' primary known-answer result');
  assert.ok(result.label, key + ' result label');
  assert.ok(result.formula, key + ' displayed formula');
  checks++;
}

const female = window.ClerFitBMIForAge.calculate({
  weight: 33.125, height: 125, age: 9, ageMonths: 6, sex: 'female'
});
assert.equal(female.primary, '21.2 kg/m²');
assert.ok(female.details.includes('92.2th'));
assert.ok(female.details.includes('CDC reference sex: female'));
checks++;
const male = window.ClerFitBMIForAge.calculate({
  weight: 24.9165, height: 105, age: 4, ageMonths: 2, sex: 'male'
});
assert.equal(male.primary, '22.6 kg/m²');
assert.ok(male.details.includes('95.9th'));
assert.ok(male.details.includes('CDC reference sex: male'));
checks++;

assert.throws(() => defs['facial-thirds'].calculate({ upper: 50, middle: -1, lower: 70 }), /greater than zero/);
assert.throws(() => defs['weekly-training-count'].calculate({ sessions: 2.5, minutes: 45 }), /whole-number session count/);
assert.throws(() => defs['sit-stand-ratio'].calculate({ reps: 2.5, time: 30 }), /whole number/);
assert.throws(() => window.ClerFitBMIForAge.calculate({
  weight: 33.125, height: 125, age: 20, ageMonths: 0, sex: 'female'
}), /Age must be between 2 and 19/);
assert.equal(defs['forward-head-index'].calculate({ offset: 0, height: 200 }).primary, '0.000');
checks += 5;

// Unit conversion known answers and safety/domain regressions.
const unitWindow = { location: { pathname: '/html/unit.html' } };
const unitDocument = { readyState: 'complete', querySelectorAll: () => [] };
const unitContext = vm.createContext({ window: unitWindow, document: unitDocument });
vm.runInContext(read('js/unit-system.js'), unitContext, { filename: 'js/unit-system.js', timeout: 3000 });
const units = unitWindow.ClerFitUnits;
assert.ok(units && typeof units.convert === 'function', 'Unit converter export');
assert.ok(Math.abs(units.convert(70, 'kg', 'lb') - 154.3235835) < 0.0001, 'kg to lb');
assert.ok(Math.abs(units.convert(170, 'cm', 'm') - 1.7) < 1e-10, 'cm to m');
assert.ok(Math.abs(units.convert(0, 'c', 'f') - 32) < 1e-10, 'Celsius to Fahrenheit');
assert.ok(Math.abs(units.convert(10, 'min_per_km', 'min_per_mile') - 16.09344) < 1e-8, 'pace conversion');
assert.ok(Number.isNaN(units.convert(10, 'kg', 'cm')), 'incompatible dimensions reject conversion');
assert.ok(Number.isNaN(units.convert(Infinity, 'kg', 'lb')), 'non-finite values reject conversion');
assert.ok(Math.abs(units.convert(units.convert(70, 'kg', 'lb'), 'lb', 'kg') - 70) < 1e-9, 'mass conversion round-trip');
checks += 7;

// Legacy-engine known-answer regressions. These call the actual production functions
// with a minimal DOM stub, including unit variants used by the older HTML pages.
const engineElements = new Map();
const engineDocument = {
  getElementById(id) {
    if (!engineElements.has(id)) {
      engineElements.set(id, {
        id, value: '', innerHTML: '', textContent: '', style: {}, hidden: false,
        parentElement: { hidden: false },
        querySelector: () => null
      });
    }
    return engineElements.get(id);
  },
  querySelectorAll: () => []
};
const engineContext = vm.createContext({ document: engineDocument, alert: () => {}, console });
vm.runInContext(read('js/engine.js'), engineContext, { filename: 'js/engine.js', timeout: 3000 });
// The legacy RFM page provides its own visual indicator helper; it is not part of the math.
engineContext.moveIndicator = () => {};
const setEngine = (id, value) => { engineDocument.getElementById(id).value = String(value); };
const engineOutput = id => engineDocument.getElementById(id).innerHTML || engineDocument.getElementById(id).textContent;

// Known-answer: BMI with pounds/inches and BMI-for-age-safe adult presentation.
Object.entries({
  weight: 154.3235835, weightUnit: 'lbs',
  height: 68.8976377953, heightUnit: 'in',
  age: 25, gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateBMI();
assert.match(engineOutput('result'), /BMI: <b>22\.9<\/b>.*Normal/);
checks++;

// Known-answer: Mifflin–St Jeor; the selected units are converted before the equation.
Object.entries({
  weight: 154.3235835, weightUnit: 'lbs',
  height: 68.8976377953, heightUnit: 'inch',
  age: 25, gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateBMR();
assert.match(engineOutput('result'), /1674 kcal\/day/);
checks++;

// Known-answer: US Navy male equation with canonical centimetre inputs.
Object.entries({
  'bf-gender': 'male', 'bf-height': 180, 'bf-height-unit': 'cm',
  'bf-waist': 85, 'bf-waist-unit': 'cm', 'bf-neck': 38, 'bf-neck-unit': 'cm',
  'bf-hip': 100, 'bf-hip-unit': 'cm'
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateBodyFat();
assert.match(engineOutput('bf-result'), /16\.2%/);
checks++;

// Known-answer: Devine ideal-body-weight estimate for a 180 cm male.
Object.entries({
  'iw-gender': 'male', 'iw-height': 180, 'iw-height-unit': 'cm', 'iw-weight-unit': 'kg'
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateIdealWeight();
assert.match(engineOutput('iw-result'), /75\.1 kg/);
checks++;

// Known-answer: energy multiplier, protein target, and baseline fluid estimate.
Object.entries({ 'cal-bmr': 1600, 'cal-bmr-unit': 'kcal', 'cal-activity': 1.55 }).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateCalories();
assert.match(engineOutput('cal-result'), /2480\.0 kcal/);
checks++;
Object.entries({ weight: 70, weightUnit: 'kg', level: 1.6 }).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateProtein();
assert.match(engineOutput('result'), /112\.0 g\/day/);
checks++;
setEngine('weight', 70); setEngine('weightUnit', 'kg');
engineContext.calculateWater();
assert.match(engineOutput('result'), /2450 ml\/day/);
checks++;

// Known-answer: Navy-derived unit aliases previously failed because some pages use "inch".
assert.equal(engineContext.toCm(1, 'inch'), 2.54);
assert.equal(engineContext.toCm(1, 'inches'), 2.54);
assert.equal(engineContext.toCm(1, 'foot'), 30.48);
assert.equal(engineContext.toCm(1, 'feet'), 30.48);
checks += 4;
Object.entries({
  weight: 80, weightUnit: 'kg', height: 70.8661417323, heightUnit: 'inch', fat: 15
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateFFMI();
assert.match(engineOutput('result'), /FFMI: <b>20\.99<\/b>/);
checks++;
Object.entries({
  height: 70.8661417323, heightUnit: 'inch', waist: 33.4645669291, waistUnit: 'inch', gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateRFM();
assert.match(engineOutput('result'), /RFM: <b>21\.65%<\/b>/);
checks++;

// Known-answer: waist/hip, lean mass, fat mass, and 12-minute Cooper estimate.
Object.entries({ gender: 'male', waist: 85, waistUnit: 'cm', hip: 100, hipUnit: 'cm' })
  .forEach(([id, value]) => setEngine(id, value));
engineContext.calculateWHR();
assert.match(engineOutput('result'), /WHR: 0\.85/);
checks++;
Object.entries({ weight: 80, weightUnit: 'kg', fat: 15 }).forEach(([id, value]) => setEngine(id, value));
engineContext.calculateLeanMass();
assert.match(engineOutput('result'), /68\.00 kg/);
engineContext.calculateFatMass();
assert.match(engineOutput('result'), /12\.00 kg/);
checks += 2;
setEngine('distance', 2400);
engineContext.calculateVO2();
assert.match(engineOutput('result'), /42\.4 ml\/kg\/min/);
checks++;

console.log('PASS: ' + checks + ' known-answer/domain assertions across generated calculators, CDC BMI-for-age, legacy formulas, and unit conversions.');
