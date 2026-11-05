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

 const api = { toCm, circleMetrics, muacMetrics, calculateBAI };
 if (typeof window !== "undefined") window.ClerFitAnthropometric = api;

 function showError(out, message, fieldId) {
  out.innerHTML = '<p class="cf-validation-message" role="alert"></p>';
  const node = out.querySelector ? out.querySelector(".cf-validation-message") : null;
  if (node) node.textContent = message;
  else out.textContent = message;
  const field = fieldId ? $(fieldId) : null;
  if (field && typeof field.focus === "function") field.focus();
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
   if (!raw || !Number.isFinite(value) || (min !== null && value < min) || (max !== null && value > max)) {
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
     result = "Mid-upper-arm muscle circumference (MUAMC): " + fmt(data.muscleCircumferenceCm) +
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
     const p = num("muscle") / num("weight") * 100;
     result = fmt(p) + "% of body mass";
     note = "Calculated from the supplied skeletal-muscle-mass value. This tool does not validate or independently estimate that input.";
     break;
    }
    case "skeletal": {
     const p = num("muscle") / num("weight") * 100, idx = num("muscle") / Math.pow(num("height") / 100, 2);
     result = fmt(num("muscle")) + " kg · " + fmt(p) + "% of body mass · SMMI " + fmt(idx) + " kg/m²";
     note = "Derived from the supplied muscle-mass assessment. No independent muscle-mass prediction is performed.";
     break;
    }
    case "almi":
     result = fmt(num("alm") / Math.pow(num("height") / 100, 2)) + " kg/m²";
     note = "ALMI = appendicular lean mass (kg) ÷ height (m)².";
     break;
    case "fmi":
     result = fmt(num("fat") / Math.pow(num("height") / 100, 2)) + " kg/m²";
     note = "FMI = fat mass (kg) ÷ height (m)².";
     break;
    case "ffmi": {
     const a = (num("weightA") * (1 - num("fatA") / 100)) / Math.pow(num("heightA") / 100, 2);
     const b = (num("weightB") * (1 - num("fatB") / 100)) / Math.pow(num("heightB") / 100, 2);
     result = "Person A: " + fmt(a) + " kg/m² · Person B: " + fmt(b) + " kg/m² · Difference: " + fmt(Math.abs(a - b)) + " kg/m²";
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
   showError(out, error && error.message ? error.message : "Check the measurements and units.", null);
   return;
  }
  out.innerHTML = '<strong class="cf-result-value">' + result + '</strong><p class="cf-note">' + note + '</p>';
 }

 document.addEventListener("DOMContentLoaded", () => {
  const form = $("calc-form");
  if (!form) return;
  form.addEventListener("submit", event => { event.preventDefault(); calculate(); });
  form.addEventListener("reset", () => {
   const out = $("calc-result");
   if (out) { out.innerHTML = ""; out.textContent = ""; }
  });
 });
})();