/* ClerFit additional anthropometric calculators. Local-only; no data transmission. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const num = id => Number($(id).value);
 const fmt = n => Number(n).toLocaleString(undefined, { maximumFractionDigits: 3 });

 const definitions = {
  "neck-circumference": { kind: "circle", input: "neck", unit: "neckUnit", label: "neck" },
  "muac": { kind: "muac" },
  "mid-thigh-circumference": { kind: "circle", input: "thigh", unit: "thighUnit", label: "mid-thigh", segmentInput: "segmentLength", segmentUnit: "segmentLengthUnit", segmentMin: 5, segmentMax: 100 },
  "calf-circumference": { kind: "circle", input: "calf", unit: "calfUnit", label: "calf", segmentInput: "segmentLength", segmentUnit: "segmentLengthUnit", segmentMin: 5, segmentMax: 80 },
  "bai": { kind: "bai" },
  "relative-muscle-mass": { kind: "relative" },
  "skeletal-muscle-mass": { kind: "skeletal" },
  "almi": { kind: "almi" },
  "fmi": { kind: "fmi" },
  "ffmi-comparison": { kind: "ffmi" },
  "chest-hip-ratio": { kind: "lengthRatio", numerator: "chest", numeratorUnit: "chestUnit", denominator: "hip", denominatorUnit: "hipUnit", numeratorMin: 40, numeratorMax: 200, denominatorMin: 40, denominatorMax: 200, numeratorLabel: "Chest circumference", denominatorLabel: "Hip circumference", title: "Chest-to-hip" },
  "shoulder-chest-ratio": { kind: "lengthRatio", numerator: "shoulder", numeratorUnit: "shoulderUnit", denominator: "chest", denominatorUnit: "chestUnit", numeratorMin: 60, numeratorMax: 250, denominatorMin: 40, denominatorMax: 200, numeratorLabel: "Shoulder circumference", denominatorLabel: "Chest circumference", title: "Shoulder-to-chest" },
  "biacromial-biacristal-width-ratio": { kind: "lengthRatio", numerator: "biacromial", numeratorUnit: "biacromialUnit", denominator: "biacristal", denominatorUnit: "biacristalUnit", numeratorMin: 20, numeratorMax: 70, denominatorMin: 15, denominatorMax: 60, numeratorLabel: "Biacromial breadth", denominatorLabel: "Biacristal breadth", title: "Biacromial-to-biacristal width" },
  "sitting-height-arm-span-ratio": { kind: "lengthRatio", numerator: "sittingHeight", numeratorUnit: "sittingHeightUnit", denominator: "armSpan", denominatorUnit: "armSpanUnit", numeratorMin: 30, numeratorMax: 150, denominatorMin: 80, denominatorMax: 250, numeratorLabel: "Sitting height", denominatorLabel: "Arm span", title: "Sitting-height-to-arm-span" },
  "arm-span-difference": { kind: "armSpanDifference" },
  "upper-lower-body-segment-ratio": { kind: "upperLower" },
  "femur-height-ratio": { kind: "lengthRatio", numerator: "femur", numeratorUnit: "femurUnit", denominator: "height", denominatorUnit: "heightUnit", numeratorMin: 20, numeratorMax: 80, denominatorMin: 80, denominatorMax: 250, numeratorLabel: "Femur length", denominatorLabel: "Standing height", title: "Femur-to-height" },
  "tibia-height-ratio": { kind: "lengthRatio", numerator: "tibia", numeratorUnit: "tibiaUnit", denominator: "height", denominatorUnit: "heightUnit", numeratorMin: 20, numeratorMax: 70, denominatorMin: 80, denominatorMax: 250, numeratorLabel: "Tibia length", denominatorLabel: "Standing height", title: "Tibia-to-height" },
  "body-proportion-deviation": { kind: "bodyProportionDeviation" },
  "anthropometric-measurement-change": { kind: "measurementChange" },
  "waist-circumference-reference": { kind: "measure" },
  "waist-height-comparison": { kind: "whtcompare" },
  "body-volume": { kind: "volume" },
  "body-density": { kind: "density" },
  "anthropometric-z-score": { kind: "zscore" },
  "body-measurement-symmetry": { kind: "symmetry" },
  "arm-waist-ratio": { kind: "ratio" },
  "leg-height-ratio": { kind: "ratio" },
  "sitting-height-ratio": { kind: "ratio" }
 };

 function toCm(value, unit, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) throw new RangeError(label + " must be a positive finite value.");
  const u = String(unit || "cm").trim().toLowerCase();
  const factors = { mm: 0.1, cm: 1, m: 100, in: 2.54, inch: 2.54, inches: 2.54, ft: 30.48, feet: 30.48 };
  if (!Object.prototype.hasOwnProperty.call(factors, u)) throw new RangeError("Choose a supported length unit (mm, cm, m, or inches).");
  return n * factors[u];
 }

 function toKg(value, unit) {
  const n = Number(value), u = String(unit || "kg").toLowerCase();
  if (!Number.isFinite(n) || n <= 0) throw new RangeError("Mass must be a positive finite value.");
  if (u === "kg") return n;
  if (u === "lb") return n * 0.45359237;
  throw new RangeError("Choose kilograms (kg) or pounds (lb).");
 }
 function toHeightCm(value, unit) {
  const n = Number(value), u = String(unit || "cm").toLowerCase();
  if (!Number.isFinite(n) || n <= 0) throw new RangeError("Height must be a positive finite value.");
  if (u === "cm") return n;
  if (u === "in") return n * 2.54;
  throw new RangeError("Choose centimetres (cm) or inches (in).");
 }
 function ratioMetrics(numerator, numeratorUnit, denominator, denominatorUnit, numeratorMin, numeratorMax, denominatorMin, denominatorMax, numeratorLabel, denominatorLabel) {
  const a = toCm(numerator, numeratorUnit, numeratorLabel);
  const b = toCm(denominator, denominatorUnit, denominatorLabel);
  assertRange(a, numeratorMin, numeratorMax, numeratorLabel, "cm");
  assertRange(b, denominatorMin, denominatorMax, denominatorLabel, "cm");
  if (!(b > 0)) throw new RangeError(denominatorLabel + " must be greater than zero.");
  return { numeratorCm: a, denominatorCm: b, ratio: a / b, percent: a / b * 100 };
 }
 function armSpanDifferenceMetrics(armSpan, armSpanUnit, standingHeight, standingHeightUnit) {
  const span = toCm(armSpan, armSpanUnit, "Arm span");
  const height = toCm(standingHeight, standingHeightUnit, "Standing height");
  assertRange(span, 80, 250, "Arm span", "cm");
  assertRange(height, 80, 250, "Standing height", "cm");
  return { armSpanCm: span, standingHeightCm: height, differenceCm: span - height, differencePercent: (span - height) / height * 100 };
 }
 function upperLowerSegmentMetrics(sittingHeight, sittingUnit, standingHeight, standingUnit) {
  const upper = toCm(sittingHeight, sittingUnit, "Sitting height");
  const total = toCm(standingHeight, standingUnit, "Standing height");
  assertRange(upper, 30, 150, "Sitting height", "cm");
  assertRange(total, 80, 250, "Standing height", "cm");
  if (upper >= total) throw new RangeError("Sitting height must be less than standing height so the lower-body segment is positive.");
  const lower = total - upper;
  return { upperCm: upper, lowerCm: lower, ratio: upper / lower, upperPercent: upper / total * 100 };
 }
 function bodyProportionDeviationMetrics(segment, segmentUnit, height, heightUnit, referencePercent) {
  const segmentCm = toCm(segment, segmentUnit, "Segment length");
  const heightCmValue = toCm(height, heightUnit, "Standing height");
  assertRange(segmentCm, 5, 200, "Segment length", "cm");
  assertRange(heightCmValue, 80, 250, "Standing height", "cm");
  if (segmentCm >= heightCmValue) throw new RangeError("Segment length must be less than standing height.");
  const reference = Number(referencePercent);
  assertRange(reference, 0.1, 99.9, "Reference proportion", "%");
  const measuredPercent = segmentCm / heightCmValue * 100;
  return { segmentCm, heightCm: heightCmValue, measuredPercent, referencePercent: reference, deviationPoints: measuredPercent - reference };
 }
 function anthropometricMeasurementChangeMetrics(baseline, baselineUnit, current, currentUnit) {
  const before = toCm(baseline, baselineUnit, "Baseline measurement");
  const after = toCm(current, currentUnit, "Current measurement");
  assertRange(before, 0.1, 250, "Baseline measurement", "cm");
  assertRange(after, 0.1, 250, "Current measurement", "cm");
  return { baselineCm: before, currentCm: after, changeCm: after - before, changePercent: (after - before) / before * 100 };
 }
 function assertRange(value, min, max, label, unit) {
  if (!Number.isFinite(value) || value < min || value > max) {
   throw new RangeError(label + " must be between " + min + " and " + max + " " + unit + ".");
  }
 }

 function circleMetrics(kind, circumference, circumferenceUnit, segmentLength, segmentLengthUnit) {
  const limits = {
   "neck-circumference": { min: 10, max: 100 },
   "mid-thigh-circumference": { min: 15, max: 120 },
   "calf-circumference": { min: 10, max: 100 }
  };
  const rule = limits[kind];
  if (!rule) throw new RangeError("Choose a supported circumference calculator.");
  const c = toCm(circumference, circumferenceUnit, "Circumference");
  assertRange(c, rule.min, rule.max, "Circumference", "cm");
  const diameter = c / Math.PI;
  const radius = c / (2 * Math.PI);
  const area = (c * c) / (4 * Math.PI);
  const result = { circumferenceCm: c, diameterCm: diameter, radiusCm: radius, areaCm2: area };
  if (segmentLength !== undefined && segmentLength !== null && String(segmentLength).trim() !== "") {
   const length = toCm(segmentLength, segmentLengthUnit, "Segment length");
   const segmentMin = kind === "mid-thigh-circumference" ? 5 : 5;
   const segmentMax = kind === "mid-thigh-circumference" ? 100 : 80;
   assertRange(length, segmentMin, segmentMax, "Segment length", "cm");
   result.segmentLengthCm = length;
   result.volumeCm3 = area * length;
  }
  return result;
 }

 function muacMetrics(muac, muacUnit, tricepsSkinfold, skinfoldUnit) {
  const armCm = toCm(muac, muacUnit, "MUAC");
  assertRange(armCm, 5, 80, "MUAC", "cm");
  const skinCm = toCm(tricepsSkinfold, skinfoldUnit, "Triceps skinfold");
  assertRange(skinCm, 0.1, 6, "Triceps skinfold", "cm");
  const muscleCircumference = armCm - Math.PI * skinCm;
  if (!(muscleCircumference > 0 && muscleCircumference <= armCm)) {
   throw new RangeError("Triceps skinfold is too large for this MUAC; check both measurements and units.");
  }
  const totalArea = (armCm * armCm) / (4 * Math.PI);
  const muscleArea = (muscleCircumference * muscleCircumference) / (4 * Math.PI);
  const fatArea = totalArea - muscleArea;
  return {
   muacCm: armCm,
   tricepsSkinfoldCm: skinCm,
   muscleCircumferenceCm: muscleCircumference,
   totalArmAreaCm2: totalArea,
   musclePlusBoneAreaCm2: muscleArea,
   fatAreaCm2: fatArea,
   fatAreaPercent: (fatArea / totalArea) * 100
  };
 }

 function calculateBAI(hip, hipUnit, height, heightUnit, age) {
  const hipCm = toCm(hip, hipUnit, "Hip circumference");
  const heightCm = toCm(height, heightUnit, "Height");
  assertRange(hipCm, 30, 250, "Hip circumference", "cm");
  assertRange(heightCm, 80, 250, "Height", "cm");
  const years = Number(age);
  if (!Number.isInteger(years) || years < 18 || years > 120) {
   throw new RangeError("BAI is restricted to adults aged 18–120 years; pediatric use is not validated.");
  }
  const value = hipCm / Math.pow(heightCm / 100, 1.5) - 18;
  if (!Number.isFinite(value) || value < 0 || value > 100) {
   throw new RangeError("The BAI result falls outside 0–100%; check the entered measurements and units.");
  }
  return { value, hipCm, heightCm, age: years };
 }


 function bodyCompositionMetrics(muscleMass, weight) {
  const muscle = Number(muscleMass), body = Number(weight);
  if (!Number.isFinite(muscle) || !Number.isFinite(body) || muscle <= 0 || body <= 0) throw new RangeError("Muscle mass and body weight must be positive finite values.");
  if (muscle > body) throw new RangeError("Measured skeletal muscle mass cannot exceed total body weight; check the source values and units.");
  return { muscleMassKg: muscle, bodyWeightKg: body, relativeMuscleMassPercent: muscle / body * 100 };
 }
 function skeletalMuscleMetrics(muscleMass, weight, heightCm) {
  const base = bodyCompositionMetrics(muscleMass, weight);
  const h = Number(heightCm);
  assertRange(h, 80, 250, "Height", "cm");
  return { ...base, smmiKgM2: base.muscleMassKg / Math.pow(h / 100, 2) };
 }
 function heightIndexedMass(massKg, heightCm, label) {
  const mass = Number(massKg), h = Number(heightCm);
  if (!Number.isFinite(mass) || mass <= 0) throw new RangeError(label + " must be a positive finite value.");
  assertRange(h, 80, 250, "Height", "cm");
  return { massKg: mass, heightCm: h, indexKgM2: mass / Math.pow(h / 100, 2) };
 }
 function ffmiMetrics(weightKg, bodyFatPercent, heightCm) {
  const weight = Number(weightKg), fat = Number(bodyFatPercent), h = Number(heightCm);
  assertRange(weight, 2, 500, "Body weight", "kg");
  assertRange(fat, 0, 75, "Body-fat percentage", "%");
  assertRange(h, 80, 250, "Height", "cm");
  const fatFreeMassKg = weight * (1 - fat / 100);
  return { weightKg: weight, bodyFatPercent: fat, heightCm: h, fatFreeMassKg, ffmiKgM2: fatFreeMassKg / Math.pow(h / 100, 2) };
 }
 function compareFFMI(a, b) {
  if (!a || !b || !Number.isFinite(a.ffmiKgM2) || !Number.isFinite(b.ffmiKgM2)) throw new RangeError("Provide two valid FFMI calculations.");
  return { personAFFMI: a.ffmiKgM2, personBFFMI: b.ffmiKgM2, absoluteDifferenceKgM2: Math.abs(a.ffmiKgM2 - b.ffmiKgM2), higher: a.ffmiKgM2 === b.ffmiKgM2 ? "equal" : a.ffmiKgM2 > b.ffmiKgM2 ? "A" : "B" };
 }

 const api = { toCm, toKg, toHeightCm, circleMetrics, muacMetrics, calculateBAI, bodyCompositionMetrics, skeletalMuscleMetrics, heightIndexedMass, ffmiMetrics, compareFFMI, ratioMetrics, armSpanDifferenceMetrics, upperLowerSegmentMetrics, bodyProportionDeviationMetrics, anthropometricMeasurementChangeMetrics };
 if (typeof window !== "undefined") window.ClerFitAnthropometric = api;

 function clearResultFieldErrors(form, output) {
  const outputId = output && output.id;
  if (!outputId || !form) return;
  form.querySelectorAll('[aria-invalid="true"]').forEach(field => {
   const ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
   if (!ids.includes(outputId)) return;
   field.removeAttribute("aria-invalid");
   const remaining = ids.filter(id => id !== outputId);
   if (remaining.length) field.setAttribute("aria-describedby", remaining.join(" "));
   else field.removeAttribute("aria-describedby");
  });
 }
 function showError(out, message, fieldIds) {
  const safeMessage = String(message).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  out.innerHTML = '<p class="cf-validation-message" role="alert">' + safeMessage + '</p>';
  const ids = Array.isArray(fieldIds) ? fieldIds : (fieldIds ? [fieldIds] : []);
  const fields = ids.map(id => $(id)).filter(Boolean);
  fields.forEach(field => {
   field.setAttribute("aria-invalid", "true");
   const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
   if (out.id) describedBy.add(out.id);
   if (describedBy.size) field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
  });
  const focusField = fields[fields.length - 1];
  if (focusField && typeof focusField.focus === "function") focusField.focus();
 }

 function calculate() {
  const kind = document.body.dataset.calculator;
  const cfg = definitions[kind];
  const out = $("calc-result");
  if (!cfg || !out) return;
  const fields = [...document.querySelectorAll("[data-field]")];
  if (!fields.length) {
   const form = $("calc-form");
   if (form && form.querySelectorAll) fields.push(...form.querySelectorAll('input[type="number"]:not([disabled])'));
  }
  for (const field of fields) {
   const raw = String(field.value == null ? "" : field.value).trim();
   if (!raw && !field.required) continue;
   const value = Number(raw);
   const min = field.min !== "" && Number.isFinite(Number(field.min)) ? Number(field.min) : null;
   const max = field.max !== "" && Number.isFinite(Number(field.max)) ? Number(field.max) : null;
   const nativeInvalid = !!(field.validity && field.validity.valid === false);
   if (!raw || !Number.isFinite(value) || (min !== null && value < min) || (max !== null && value > max) || nativeInvalid) {
    showError(out, "Please enter valid values within the displayed ranges.", field.id);
    return;
   }
  }

  let result = "";
  let note = "";
  try {
   switch (cfg.kind) {
    case "circle": {
     const rawLength = cfg.segmentInput ? $(cfg.segmentInput).value : "";
     const data = circleMetrics(kind, num(cfg.input), $(cfg.unit).value, rawLength, cfg.segmentInput ? $(cfg.segmentUnit).value : "cm");
     result = "Circle-equivalent diameter: " + fmt(data.diameterCm) + " cm · radius: " + fmt(data.radiusCm) +
      " cm · cross-sectional area: " + fmt(data.areaCm2) + " cm²";
     if (data.volumeCm3 !== undefined) {
      result += " · cylindrical volume proxy: " + fmt(data.volumeCm3) + " cm³ (" + fmt(data.volumeCm3 / 1000) + " L)";
     }
     note = "Geometry only: diameter = C ÷ π, radius = C ÷ (2π), and circular area = C² ÷ (4π). " +
      (data.volumeCm3 !== undefined ? "The optional volume assumes a constant circular cross-section over the entered segment length. " : "") +
      "Human cross-sections are not perfect circles; these are geometric approximations, not anatomical tissue or muscle-volume measurements.";
     break;
    }
    case "muac": {
     const data = muacMetrics(num("muac"), $("muacUnit").value, num("tricepsSkinfold"), $("tricepsUnit").value);
     result = "Total arm area: " + fmt(data.totalArmAreaCm2) + " cm² · mid-upper-arm muscle circumference (MUAMC): " + fmt(data.muscleCircumferenceCm) +
      " cm · muscle-plus-bone area estimate (MUAMA): " + fmt(data.musclePlusBoneAreaCm2) +
      " cm² · arm fat-area estimate: " + fmt(data.fatAreaCm2) + " cm² · fat-area fraction: " + fmt(data.fatAreaPercent) + "%";
     note = "MUAMC = MUAC − π × triceps skinfold (both lengths converted to cm); MUAMA = MUAMC² ÷ (4π); total arm area = MUAC² ÷ (4π); arm fat area = total arm area − MUAMA. " +
      "This concentric-circle anthropometric model is an estimate, not direct muscle mass or a diagnosis; skinfold compressibility and bone size affect accuracy.";
     break;
    }
    case "measure":
     result = fmt(num(fields[0].id)) + " cm";
     note = "Recorded measurement only. Compare it only with a reference that uses the same measurement protocol.";
     break;
    case "bai": {
     const data = calculateBAI(num("hip"), $("hipUnit").value, num("height"), $("heightUnit").value, num("age"));
     result = "BAI: " + fmt(data.value) + "% (adult population-derived estimate)";
     note = "BAI = hip circumference (cm) ÷ height (m) raised to 1.5, minus 18. It is an estimate, not a direct body-fat measurement. Independent evaluation has reported sex- and body-fat-level-related bias and no accuracy advantage over BMI or circumference measures; do not use it as a diagnosis or as the sole assessment.";
     break;
    }
    case "relative": {
     const data = bodyCompositionMetrics(toKg(num("muscle"), $("muscleUnit").value), toKg(num("weight"), $("weightUnit").value));
     result = fmt(data.relativeMuscleMassPercent) + "% of body mass";
     note = "Calculated from the supplied skeletal-muscle-mass value. This tool does not validate or independently estimate that input.";
     break;
    }
    case "skeletal": {
     const data = skeletalMuscleMetrics(toKg(num("muscle"), $("muscleUnit").value), toKg(num("weight"), $("weightUnit").value), toHeightCm(num("height"), $("heightUnit").value));
     result = fmt(data.muscleMassKg) + " kg · " + fmt(data.relativeMuscleMassPercent) + "% of body mass · SMMI " + fmt(data.smmiKgM2) + " kg/m²";
     note = "Derived from the supplied muscle-mass assessment. No independent muscle-mass prediction is performed.";
     break;
    }
    case "almi": {
     const data = heightIndexedMass(toKg(num("alm"), $("almUnit").value), toHeightCm(num("height"), $("heightUnit").value), "Appendicular lean mass");
     result = fmt(data.indexKgM2) + " kg/m²";
     note = "ALMI = appendicular lean mass (kg) ÷ height (m)². Use an assessment-derived input; interpretation requires a population- and method-matched reference.";
     break;
    }
    case "fmi": {
     const data = heightIndexedMass(toKg(num("fat"), $("fatUnit").value), toHeightCm(num("height"), $("heightUnit").value), "Fat mass");
     result = fmt(data.indexKgM2) + " kg/m²";
     note = "FMI = fat mass (kg) ÷ height (m)². Use an assessment-derived input; this tool does not infer body fat from BMI.";
     break;
    }
    case "lengthRatio": {
     const data = ratioMetrics(num(cfg.numerator), $(cfg.numeratorUnit).value, num(cfg.denominator), $(cfg.denominatorUnit).value, cfg.numeratorMin, cfg.numeratorMax, cfg.denominatorMin, cfg.denominatorMax, cfg.numeratorLabel, cfg.denominatorLabel);
     result = cfg.title + " ratio: " + fmt(data.ratio) + " (" + fmt(data.percent) + "%)";
     note = "Ratio = " + cfg.numeratorLabel.toLowerCase() + " ÷ " + cfg.denominatorLabel.toLowerCase() + ". Both measurements are converted to centimetres first. No universal clinical cutoff is assigned; use consistent landmarks and a reference appropriate to the measurement protocol.";
     break;
    }
    case "armSpanDifference": {
     const data = armSpanDifferenceMetrics(num("armSpan"), $("armSpanUnit").value, num("standingHeight"), $("standingHeightUnit").value);
     const signed = (n, suffix) => (n > 0 ? "+" : "") + fmt(n) + suffix;
     result = "Arm span difference: " + signed(data.differenceCm, " cm") + " · " + signed(data.differencePercent, "%") + " of standing height";
     note = "Difference = arm span − standing height. A positive result means arm span is longer; a negative result means standing height is greater. The percentage is the signed difference divided by standing height × 100. Measurement technique and posture can affect small differences.";
     break;
    }
    case "upperLower": {
     const d = upperLowerSegmentMetrics(num("sittingHeight"), $("sittingHeightUnit").value, num("standingHeight"), $("standingHeightUnit").value);
     result = "Upper segment: " + fmt(d.upperCm) + " cm · Lower segment: " + fmt(d.lowerCm) + " cm · Upper-to-lower ratio: " + fmt(d.ratio);
     note = "Upper segment is represented by sitting height; lower segment = standing height − sitting height. Ratio = sitting height ÷ lower segment. This is a descriptive segment comparison, not a clinical classification.";
     break;
    }
    case "bodyProportionDeviation": {
     const d = bodyProportionDeviationMetrics(num("segmentLength"), $("segmentLengthUnit").value, num("standingHeight"), $("standingHeightUnit").value, num("referencePercent"));
     const signed = (n) => (n > 0 ? "+" : "") + fmt(n);
     result = "Measured proportion: " + fmt(d.measuredPercent) + "% · Difference from entered reference: " + signed(d.deviationPoints) + " percentage points";
     note = "Measured proportion = segment length ÷ standing height × 100. Deviation = measured proportion − the reference percentage entered by the user. The reference is user-supplied; no population norm or clinical cutoff is assumed.";
     break;
    }
    case "measurementChange": {
     const d = anthropometricMeasurementChangeMetrics(num("baseline"), $("baselineUnit").value, num("current"), $("currentUnit").value);
     const signed = (n, suffix) => (n > 0 ? "+" : "") + fmt(n) + suffix;
     result = "Baseline: " + fmt(d.baselineCm) + " cm · Current: " + fmt(d.currentCm) + " cm · Change: " + signed(d.changeCm, " cm") + " · Percentage change: " + signed(d.changePercent, "%");
     note = "Absolute change = current measurement − baseline measurement. Percentage change = absolute change ÷ baseline × 100. Compare measurements taken with the same landmarks, posture and technique.";
     break;
    }
    case "ffmi": {
     const a = ffmiMetrics(toKg(num("weightA"), $("weightAUnit").value), num("fatA"), toHeightCm(num("heightA"), $("heightAUnit").value));
     const b = ffmiMetrics(toKg(num("weightB"), $("weightBUnit").value), num("fatB"), toHeightCm(num("heightB"), $("heightBUnit").value));
     const comparison = compareFFMI(a, b);
     result = "Person A: " + fmt(a.ffmiKgM2) + " kg/m² · Person B: " + fmt(b.ffmiKgM2) + " kg/m² · Difference: " + fmt(comparison.absoluteDifferenceKgM2) + " kg/m² · Higher FFMI: " + comparison.higher;
     note = "FFMI = estimated fat-free mass ÷ height². Body-fat measurement error affects the comparison.";
     break;
    }
    case "whtcompare": {
     const a = num("waistA") / num("heightA"), b = num("waistB") / num("heightB");
     result = "Person A: " + fmt(a) + " · Person B: " + fmt(b) + " · Difference: " + fmt(Math.abs(a - b));
     note = "Waist-to-height ratio = waist circumference ÷ height, using the same units.";
     break;
    }
    case "volume":
     result = fmt(num("mass") / num("density")) + " L";
     note = "Volume = mass ÷ density. This assumes average density is representative and uses kg and kg/L.";
     break;
    case "density":
     result = fmt(num("mass") / num("volume")) + " kg/L";
     note = "Density = mass ÷ volume. Ensure volume is entered in litres.";
     break;
    case "zscore":
     result = fmt((num("value") - num("mean")) / num("sd"));
     note = "Z-score = (observed value − reference mean) ÷ reference standard deviation. Reference selection is essential.";
     break;
    case "symmetry": {
     const a = num("left"), b = num("right"), d = Math.abs(a - b), p = d / ((a + b) / 2) * 100;
     result = "Absolute difference: " + fmt(d) + " cm · Relative difference: " + fmt(p) + "%";
     note = "Relative difference = absolute side-to-side difference ÷ mean of both sides × 100.";
     break;
    }
    case "ratio": {
     const a = num(fields[0].id), b = num(fields[1].id);
     if (!(b > 0)) throw new RangeError("The denominator must be greater than zero.");
     result = fmt(a / b) + " (" + fmt(a / b * 100) + "%)";
     note = "Ratio = first measurement ÷ second measurement. Interpret only with a suitable, clearly defined reference.";
     break;
    }
   }
  } catch (error) {
   const relatedFields = kind === "muac" && /too large for this MUAC|muscle circumference/i.test(error && error.message || "")
    ? ["muac", "tricepsSkinfold"] : null;
   showError(out, error && error.message ? error.message : "Check the measurements and units.", relatedFields);
   return;
  }
  out.innerHTML = '<strong class="cf-result-value">' + result + '</strong><p class="cf-note">' + note + '</p>';
 }

 document.addEventListener("DOMContentLoaded", () => {
  const form = $("calc-form");
  if (!form) return;
  const output = $("calc-result");
  const invalidateResult = () => {
   if (output) { output.innerHTML = ""; output.textContent = ""; }
   clearResultFieldErrors(form, output);
  };
  form.addEventListener("input", event => {
   if (event.target && (event.target.matches("[data-field]") || event.target.matches('input[type="number"]'))) invalidateResult();
  });
  form.addEventListener("change", event => {
   if (event.target && event.target.matches("select")) invalidateResult();
  });
  form.addEventListener("submit", event => { event.preventDefault(); clearResultFieldErrors(form, output); calculate(); });
  form.addEventListener("reset", () => {
   if (output) { output.innerHTML = ""; output.textContent = ""; }
   clearResultFieldErrors(form, output);
  });
 });
})();