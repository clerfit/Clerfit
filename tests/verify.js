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
const validateAdvanced = window.ClerFitAdvancedValidation && window.ClerFitAdvancedValidation.validate;
assert.equal(typeof validateAdvanced, 'function', 'Advanced semantic validator must be exported for tests.');
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
  ['bmi-for-age', { weight: 33.125, height: 125, age: 9, ageMonths: 6, sex: 'female' }, '21.2 kg/m² · 92.2th percentile'],
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

assert.throws(() => validateAdvanced('facial-thirds', {upper:0.1,middle:60,lower:70}), /Upper third must be between 10 and 150 mm/);
assert.throws(() => validateAdvanced('jaw-width-ratio', {jaw:240,face:50}), /jaw\/reference-width ratio must be between 0.2 and 1.2/);
assert.throws(() => validateAdvanced('weekly-training-count', {sessions:21,minutes:600}), /weekly training time cannot exceed 10080 minutes/);
assert.throws(() => validateAdvanced('chest-expansion', {exhale:100,inhale:80}), /Inhalation measurement must be at least the exhalation measurement/);
assert.throws(() => validateAdvanced('recovery-time', {end:'2026-10-17T08:00',next:'2026-12-17T08:00'}), /must not exceed 30 days/);
assert.throws(() => validateAdvanced('forward-head-index', {offset:150,height:50}), /head-offset\/height ratio must be between 0 and 1/);
assert.equal(validateAdvanced('jaw-width-ratio', {jaw:100,face:150}).jaw, 100);
checks += 7;

const female = window.ClerFitBMIForAge.calculate({
  weight: 33.125, height: 125, age: 9, ageMonths: 6, sex: 'female'
});
assert.equal(female.primary, '21.2 kg/m² · 92.2th percentile');
assert.ok(female.details.includes('92.2th'));
assert.ok(female.details.includes('CDC reference sex: female'));
checks++;
const male = window.ClerFitBMIForAge.calculate({
  weight: 24.9165, height: 105, age: 4, ageMonths: 2, sex: 'male'
});
assert.equal(male.primary, '22.6 kg/m² · 95.9th percentile');
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
const resetEngineOutputs = (...ids) => ids.forEach(id => {
  const el = engineDocument.getElementById(id);
  el.innerHTML = '';
  el.textContent = '';
});
const engineOutput = id => engineDocument.getElementById(id).textContent || engineDocument.getElementById(id).innerHTML;

// Known-answer: BMI with pounds/inches and BMI-for-age-safe adult presentation.
Object.entries({
  weight: 154.3235835, weightUnit: 'lbs',
  height: 68.8976377953, heightUnit: 'in',
  age: 25, gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result');
engineContext.calculateBMI();
assert.match(engineOutput('result'), /BMI: <b>22\.9<\/b>.*Normal/);
checks++;

// Known-answer: Mifflin–St Jeor; the selected units are converted before the equation.
Object.entries({
  weight: 154.3235835, weightUnit: 'lbs',
  height: 68.8976377953, heightUnit: 'inch',
  age: 25, gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result', 'formula');
engineContext.calculateBMR();
assert.match(engineOutput('result'), /1674 kcal\/day/);
checks++;
setEngine('heightUnit', 'bogus');
resetEngineOutputs('result', 'formula');
engineContext.calculateBMR();
assert.match(engineOutput('result'), /Choose supported weight and height units/);
assert.doesNotMatch(engineOutput('result'), /BMR Result:/);
checks++;

// Known-answer: US Navy male equation with canonical centimetre inputs.
Object.entries({
  'bf-gender': 'male', 'bf-height': 180, 'bf-height-unit': 'cm',
  'bf-waist': 85, 'bf-waist-unit': 'cm', 'bf-neck': 38, 'bf-neck-unit': 'cm',
  'bf-hip': 100, 'bf-hip-unit': 'cm'
}).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('bf-result', 'bf-formula');
engineContext.calculateBodyFat();
assert.match(engineOutput('bf-result'), /16\.2%/);
checks++;
setEngine('bf-waist-unit', 'bogus');
resetEngineOutputs('bf-result', 'bf-formula');
engineContext.calculateBodyFat();
assert.match(engineOutput('bf-result'), /measurements.*plausible/i);
assert.doesNotMatch(engineOutput('bf-result'), /NaN|Infinity/);
checks++;

// Known-answer: Devine ideal-body-weight estimate for a 180 cm male.
Object.entries({
  'iw-gender': 'male', 'iw-height': 180, 'iw-height-unit': 'cm', 'iw-weight-unit': 'kg'
}).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('iw-result', 'iw-formula');
engineContext.calculateIdealWeight();
assert.match(engineOutput('iw-result'), /75\.1 kg/);
checks++;
setEngine('iw-height-unit', 'bogus');
resetEngineOutputs('iw-result', 'iw-formula');
engineContext.calculateIdealWeight();
assert.match(engineOutput('iw-result'), /Choose supported height and output-weight units/);
assert.doesNotMatch(engineOutput('iw-result'), /Ideal Weight:/);
checks++;

// Known-answer: energy multiplier, protein target, and baseline fluid estimate.
Object.entries({ 'cal-bmr': 1600, 'cal-bmr-unit': 'kcal', 'cal-activity': 1.55 }).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('cal-result', 'cal-formula');
engineContext.calculateCalories();
assert.match(engineOutput('cal-result'), /2480\.0 kcal/);
checks++;
Object.entries({ weight: 70, weightUnit: 'kg', level: 1.6 }).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result');
engineContext.calculateProtein();
assert.match(engineOutput('result'), /112\.0 g\/day/);
checks++;
setEngine('weight', 70); setEngine('weightUnit', 'kg');
resetEngineOutputs('result');
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
resetEngineOutputs('result');
engineContext.calculateFFMI();
assert.match(engineOutput('result'), /FFMI: <b>20\.99<\/b>/);
checks++;
Object.entries({
  height: 70.8661417323, heightUnit: 'inch', waist: 33.4645669291, waistUnit: 'inch', gender: 'male'
}).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result');
engineContext.calculateRFM();
assert.match(engineOutput('result'), /RFM: <b>21\.65%<\/b>/);
checks++;

// Known-answer: waist/hip, lean mass, fat mass, and 12-minute Cooper estimate.
Object.entries({ gender: 'male', waist: 85, waistUnit: 'cm', hip: 100, hipUnit: 'cm' })
  .forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result', 'formula');
engineContext.calculateWHR();
assert.match(engineOutput('result'), /WHR: 0\.85/);
checks++;
// Regression: shared engine must reject unsupported unit selectors instead of
// silently treating unknown units as centimetres.
setEngine('waist', 85); setEngine('waistUnit', 'cm');
setEngine('hip', 100); setEngine('hipUnit', 'bogus');
resetEngineOutputs('result', 'formula');
engineContext.calculateWHR();
assert.match(engineOutput('result'), /Choose supported units for both measurements/);
assert.doesNotMatch(engineOutput('result'), /WHR: 0\.85/);
checks++;
Object.entries({ weight: 80, weightUnit: 'kg', fat: 15 }).forEach(([id, value]) => setEngine(id, value));
resetEngineOutputs('result');
engineContext.calculateLeanMass();
assert.match(engineOutput('result'), /68\.00 kg/);
resetEngineOutputs('result');
engineContext.calculateFatMass();
assert.match(engineOutput('result'), /12\.00 kg/);
checks += 2;
setEngine('distance', 2400);
resetEngineOutputs('result');
engineContext.calculateVO2();
assert.match(engineOutput('result'), /42\.4 ml\/kg\/min/);
checks++;


/* Regression checks for the R3 hardening fixes. These checks inspect the exact
   deployed page source and run the page's inline function against minimal DOM stubs. */
function runPageFunction(file, functionName, values, resultIds) {
  const html = read('html/' + file);
  const scriptBodies = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
  const script = scriptBodies.find(source => source.includes('function ' + functionName));
  assert.ok(script, file + ' has an inline script defining ' + functionName);
  const elements = new Map();
  const makeEl = id => {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', textContent: '', innerHTML: '', hidden: false, style: {},
      parentElement: null, title: '',
      addEventListener() {},
      removeAttribute(name) { if (name === 'title') this.title = ''; }
    });
    return elements.get(id);
  };
  Object.entries(values).forEach(([id, value]) => { makeEl(id).value = String(value); });
  resultIds.forEach(makeEl);
  const document = {
    getElementById: makeEl,
    querySelector: selector => selector === '.bar-container' ? makeEl('__bar') : null
  };
  const context = vm.createContext({ document, console, Number, Math, alert: () => {}, window: {}, updateFormulaInfo: () => {}, moveIndicatorBSA: () => {}, moveIndicatorBMI: () => {} });
  vm.runInContext(script, context, { filename: 'html/' + file, timeout: 3000 });
  assert.equal(typeof context[functionName], 'function', file + ' exports ' + functionName);
  context[functionName]();
  return { context, elements, output: id => makeEl(id).textContent + makeEl(id).innerHTML };
}

// Empty and impossible inputs must never leave non-finite outputs.
let pageTest = runPageFunction('rfm.html', 'calculateRFM', {
  gender: 'male', height: '', heightUnit: 'cm', waist: '', waistUnit: 'cm'
}, ['result']);
assert.match(pageTest.output('result'), /valid height and waist/i);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;
pageTest = runPageFunction('rfm.html', 'calculateRFM', {
  gender: 'male', height: 175, heightUnit: 'cm', waist: 0.1, waistUnit: 'cm'
}, ['result']);
assert.match(pageTest.output('result'), /height must be 100–250 cm and waist 20–250 cm/i);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity|-59936/);
checks++;

pageTest = runPageFunction('rfm.html', 'calculateRFM', {
  gender: 'male', height: 250, heightUnit: 'cm', waist: 20, waistUnit: 'cm'
}, ['result']);
assert.match(pageTest.output('result'), /RFM value outside the supported 0–100% range/i);
assert.doesNotMatch(pageTest.output('result'), /RFM estimate:/);
checks++;

// Known-answer and semantic boundaries for the Mifflin-based calorie tools.
pageTest = runPageFunction('maintenance.html', 'calculateMaintenance', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55
}, ['result', 'formula']);
assert.match(pageTest.output('result'), /2556 calories\/day/);
checks++;
pageTest = runPageFunction('maintenance.html', 'calculateMaintenance', {
  weight: 70, weightUnit: 'kg', height: 30, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55
}, ['result', 'formula']);
assert.match(pageTest.output('result'), /height 100–250 cm/i);
assert.doesNotMatch(pageTest.output('result'), /Maintenance Calories \(TDEE\) are/);
checks++;

pageTest = runPageFunction('deficit.html', 'calculateDeficit', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55, deficit: 500
}, ['result', 'details']);
assert.match(pageTest.output('result'), /2056 kcal\/day/);
checks++;
pageTest = runPageFunction('deficit.html', 'calculateDeficit', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'bogus', age: 30, gender: 'male', activity: 1.55, deficit: 500
}, ['result', 'details']);
assert.match(pageTest.output('result'), /Check units and measurements/i);
assert.doesNotMatch(pageTest.output('result'), /Target Calories for Fat Loss:/);
checks++;

pageTest = runPageFunction('surplus.html', 'calculateSurplus', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55, surplus: 250
}, ['result', 'details']);
assert.match(pageTest.output('result'), /2806 kcal\/day/);
checks++;
pageTest = runPageFunction('surplus.html', 'calculateSurplus', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 17, gender: 'male', activity: 1.55, surplus: 250
}, ['result', 'details']);
assert.match(pageTest.output('result'), /age 18–120/i);
assert.doesNotMatch(pageTest.output('result'), /Target Calories for Weight Gain:/);
checks++;

pageTest = runPageFunction('calories-kg.html', 'calculateCaloriesPerKg', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55
}, ['result', 'details']);
assert.match(pageTest.output('result'), /36\.5 kcal\/kg\/day/);
checks++;
pageTest = runPageFunction('calories-kg.html', 'calculateCaloriesPerKg', {
  weight: 0.1, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male', activity: 1.55
}, ['result', 'details']);
assert.match(pageTest.output('result'), /weight must be 2–500 kg/i);
assert.doesNotMatch(pageTest.output('result'), /Calories per kg:/);
checks++;

// Face measurements, cardio expenditure, monthly estimates and steps use semantic limits.
pageTest = runPageFunction('face-shape.html', 'calculateFaceShape', {
  faceLength: 0.1, faceLengthUnit: 'cm', forehead: 13, foreheadUnit: 'cm',
  cheekbones: 15, cheekbonesUnit: 'cm', jawline: 12, jawlineUnit: 'cm'
}, ['result']);
assert.match(pageTest.output('result'), /Face length must be 8–40 cm/i);
assert.doesNotMatch(pageTest.output('result'), /Dominant Face Shape:/);
checks++;
pageTest = runPageFunction('face-shape.html', 'calculateFaceShape', {
  faceLength: 18, faceLengthUnit: 'cm', forehead: 13, foreheadUnit: 'cm',
  cheekbones: 15, cheekbonesUnit: 'cm', jawline: 12, jawlineUnit: 'cm'
}, ['result']);
assert.match(pageTest.output('result'), /Dominant Face Shape:/);
assert.match(pageTest.output('result'), /heuristic relative similarity scores/i);
checks++;

pageTest = runPageFunction('cardio-calories.html', 'calculateCalories', {
  bodyWeight: 70, weightUnit: 'kg', activityMET: 3.5, duration: 60, durationUnit: 'minutes'
}, ['caloriesResult']);
assert.match(pageTest.output('caloriesResult'), /257\.25/);
checks++;
pageTest = runPageFunction('cardio-calories.html', 'calculateCalories', {
  bodyWeight: 70, weightUnit: 'kg', activityMET: 3.5, duration: 50000, durationUnit: 'minutes'
}, ['caloriesResult']);
assert.match(pageTest.output('caloriesResult'), /duration must not exceed 1440 minutes/i);
assert.doesNotMatch(pageTest.output('caloriesResult'), /Estimated Calories Burned:/);
checks++;

pageTest = runPageFunction('mets.html', 'calculateMETs', {
  weight: 70, weightUnit: 'kg', met: 500, duration: 30
}, ['result', 'formula']);
assert.match(pageTest.output('result'), /MET value from 1 to 25/i);
assert.doesNotMatch(pageTest.output('result'), /Calories burned:/);
checks++;

pageTest = runPageFunction('monthly-weight.html', 'calculateMonthlyChange', {
  tdeeMonthly: 20000, intakeMonthly: 500, unitMonthly: 'kg', days: 30
}, ['monthlyResult']);
assert.match(pageTest.output('monthlyResult'), /TDEE and intake must each be 500–10000 kcal\/day/i);
assert.doesNotMatch(pageTest.output('monthlyResult'), /Expected Monthly Weight Loss: 324/);
checks++;

pageTest = runPageFunction('steps-calories.html', 'stepsToCaloriesBest', {
  steps: 1000, stepLength: 70, unit: 'cm', weight: 70, weightUnit: 'kg'
}, ['calorieResult']);
assert.match(pageTest.output('calorieResult'), /Distance: <b>0\.70 km<\/b>/);
assert.match(pageTest.output('calorieResult'), /31\.36 kcal/);
checks++;
pageTest = runPageFunction('steps-calories.html', 'stepsToCaloriesBest', {
  steps: 1000, stepLength: 300, unit: 'cm', weight: 70, weightUnit: 'kg'
}, ['calorieResult']);
assert.match(pageTest.output('calorieResult'), /step length must be 20–150 cm/i);
assert.doesNotMatch(pageTest.output('calorieResult'), /Distance:/);
checks++;

pageTest = runPageFunction('absi.html', 'calculateABSI', {
  waist: 85, waistUnit: 'nonsense', height: 175, heightUnit: 'cm', weight: 70
}, ['result']);
assert.match(pageTest.output('result'), /supported length units/i);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('whr.html', 'calculateWHR', {
  waist: 85, waistUnit: 'mystery', hip: 100, hipUnit: 'cm'
}, ['result', 'formula']);
assert.match(pageTest.output('result'), /supported units/i);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('BMI.html', 'calculateBMI', {
  weight: 1000000, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 30, gender: 'male'
}, ['result', 'indicator']);
assert.match(pageTest.output('result'), /Check the measurements and units/i);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('BMI.html', 'calculateBMI', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm', age: 16, gender: 'male'
}, ['result', 'indicator']);
assert.match(pageTest.output('result'), /Age-specific interpretation required/i);
assert.doesNotMatch(pageTest.output('result'), /Normal|Underweight|Overweight|Obese/);
checks++;

pageTest = runPageFunction('fatmass.html', 'calculateFatMass', {
  weight: 80, weightUnit: 'kg', fat: 15
}, ['result', 'formula', 'indicator']);
assert.match(pageTest.output('result'), /12\.00 kg/);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('leanmass.html', 'calculateLeanMass', {
  weight: 80, weightUnit: 'kg', fat: 15
}, ['result', 'formula']);
assert.match(pageTest.output('result'), /68\.00 kg/);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('ffmi.html', 'calculateFFMI', {
  height: 70.8661417323, heightUnit: 'inch', weight: 80, weightUnit: 'kg', fat: 15
}, ['result']);
assert.match(pageTest.output('result'), /FFMI: 20\.99/);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('1rm.html', 'calculate1RM', {
  liftWeight: 100, weightUnit1RM: 'kg', reps: 5, formula: 'epley'
}, ['oneRMResult']);
assert.match(pageTest.output('oneRMResult'), /Estimated 1RM:[\s\S]*116\.67 kg/);
assert.doesNotMatch(pageTest.output('oneRMResult'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('bmi-change.html', 'calculateBMIChange', {
  currentWeightBMI: 70, goalWeightBMI: 75, weightUnitBMI: 'kg', heightBMI: 175, heightUnitBMI: 'cm'
}, ['bmiResult']);
assert.match(pageTest.output('bmiResult'), /Current BMI:[\s\S]*Goal BMI:/);
assert.doesNotMatch(pageTest.output('bmiResult'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('bmi-compare.html', 'compareBMI', {
  heightA: 175, weightA: 70, heightUnitA: 'cm', weightUnitA: 'kg',
  heightB: 168, weightB: 65, heightUnitB: 'cm', weightUnitB: 'kg'
}, ['bmiCompareResult']);
assert.match(pageTest.output('bmiCompareResult'), /Person A:[\s\S]*Person B:/);
assert.doesNotMatch(pageTest.output('bmiCompareResult'), /Underweight|Normal|Overweight|Obese/i, 'BMI comparison must not assign categories without age/sex context');
assert.doesNotMatch(pageTest.output('bmiCompareResult'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('bsa.html', 'calculateBSA', {
  weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm'
}, ['result', 'formula', 'indicator']);
assert.match(pageTest.output('result'), /BSA:[\s\S]*m²/);
assert.doesNotMatch(pageTest.output('result'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('goal-timeline.html', 'calculateGoalTimeline', {
  currentWeight: 80, goalWeight: 75, weightUnitTimeline: 'kg', tdeeTimeline: 2500, intakeTimeline: 2000
}, ['timelineResult']);
assert.match(pageTest.output('timelineResult'), /Estimated time/);
assert.match(pageTest.output('timelineResult'), /Approximate energy-balance estimate only/);
assert.doesNotMatch(pageTest.output('timelineResult'), /NaN|Infinity/);
checks++;

pageTest = runPageFunction('weight-gain-rate.html', 'calculateWeightGainRate2', {
  tdeeGain2: 2000, intakeGain2: 2500, unitGain2: 'kg'
}, ['gainResult2']);
assert.match(pageTest.output('gainResult2'), /Estimated Weekly Change/);
assert.match(pageTest.output('gainResult2'), /not a personalized prediction/);
checks++;

pageTest = runPageFunction('weight-loss-rate.html', 'calculateWeightLossRate', {
  tdeeRate: 2500, intakeRate: 1800, unitRate: 'kg'
}, ['rateResult']);
assert.match(pageTest.output('rateResult'), /Estimated Weekly Change/);
assert.match(pageTest.output('rateResult'), /Static calorie-to-mass estimate only/);
checks++;

pageTest = runPageFunction('weight-stability.html', 'calculateWeightStability', {
  initialWeight: 70, currentWeight: 72, weightUnit: 'kg', days: 30
}, ['weightStabilityResult']);
assert.match(pageTest.output('weightStabilityResult'), /Gaining Weight/);
assert.match(pageTest.output('weightStabilityResult'), /water and measurement variation/);
checks++;

console.log('PASS: ' + checks + ' known-answer/domain assertions across generated calculators, CDC BMI-for-age, legacy formulas, and unit conversions.');
