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


 function toKg(value, unit, label) {
  const n=Number(value),u=String(unit||"kg").trim().toLowerCase();
  if(!Number.isFinite(n)||n<=0) throw new RangeError(label+" must be a positive finite value.");
  const factors={kg:1,lb:0.45359237,lbs:0.45359237};
  if(!Object.prototype.hasOwnProperty.call(factors,u)) throw new RangeError("Choose kilograms (kg) or pounds (lb).");
  return n*factors[u];
 }
 function heightCm(value,unit,label) {
  const n=Number(value),u=String(unit||"cm").trim().toLowerCase();
  if(!Number.isFinite(n)||n<=0) throw new RangeError(label+" must be a positive finite value.");
  const factors={cm:1,in:2.54,inch:2.54};
  if(!Object.prototype.hasOwnProperty.call(factors,u)) throw new RangeError("Choose centimetres (cm) or inches (in).");
  const cm=n*factors[u]; assertRange(cm,80,250,label,"cm"); return cm;
 }
 function massRange(value,min,max,label){assertRange(value,min,max,label,"kg");}
 function calculateRelativeMuscleMass(m,mUnit,w,wUnit){
  const muscleKg=toKg(m,mUnit,"Skeletal muscle mass"),weightKg=toKg(w,wUnit,"Body weight");
  massRange(muscleKg,0.1,200,"Skeletal muscle mass");massRange(weightKg,2,500,"Body weight");
  if(muscleKg>weightKg)throw new RangeError("Skeletal muscle mass cannot exceed total body weight.");
  return {muscleKg,weightKg,percent:muscleKg/weightKg*100};
 }
 function calculateSkeletalMuscleMass(m,mu,w,wu,h,hu){
  const base=calculateRelativeMuscleMass(m,mu,w,wu),cm=heightCm(h,hu,"Height");
  return {...base,heightCm:cm,index:base.muscleKg/Math.pow(cm/100,2)};
 }
 function calculateALMI(m,mu,h,hu){
  const mass=toKg(m,mu,"Appendicular lean mass");massRange(mass,1,100,"Appendicular lean mass");
  const cm=heightCm(h,hu,"Height");return {massKg:mass,heightCm:cm,index:mass/Math.pow(cm/100,2)};
 }
 function calculateFMI(m,mu,h,hu){
  const mass=toKg(m,mu,"Fat mass");massRange(mass,0.1,300,"Fat mass");
  const cm=heightCm(h,hu,"Height");return {massKg:mass,heightCm:cm,index:mass/Math.pow(cm/100,2)};
 }
 function calculateFFMI(wa,wua,fa,ha,hua,wb,wub,fb,hb,hub){
  function one(w,wu,f,h,hu,label){
   const kg=toKg(w,wu,label+" body weight");massRange(kg,2,500,label+" body weight");
   const fat=Number(f);assertRange(fat,0,75,label+" body-fat percentage","%");
   const cm=heightCm(h,hu,label+" height"),ffm=kg*(1-fat/100);
   return {weightKg:kg,fatPercent:fat,heightCm:cm,fatFreeMassKg:ffm,index:ffm/Math.pow(cm/100,2)};
  }
  const a=one(wa,wua,fa,ha,hua,"Person A"),b=one(wb,wub,fb,hb,hub,"Person B");
  return {a,b,difference:Math.abs(a.index-b.index)};
 }

 const api = { toCm, circleMetrics, muacMetrics, calculateBAI, toKg, heightCm, calculateRelativeMuscleMass, calculateSkeletalMuscleMass, calculateALMI, calculateFMI, calculateFFMI };
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
     const d=calculateRelativeMuscleMass(num("muscle"),$("muscleUnit").value,num("weight"),$("weightUnit").value);
     result=fmt(d.percent)+"% of body mass";
     note="Relative muscle mass = measured skeletal-muscle mass ÷ body weight × 100. Both masses are converted to kg. This reports the supplied assessment; it does not estimate muscle mass.";
     break;
    }
    case "skeletal": {
     const d=calculateSkeletalMuscleMass(num("muscle"),$("muscleUnit").value,num("weight"),$("weightUnit").value,num("height"),$("heightUnit").value);
     result=fmt(d.muscleKg)+" kg measured skeletal muscle · "+fmt(d.percent)+"% of body mass · SMMI "+fmt(d.index)+" kg/m²";
     note="SMMI = measured skeletal muscle mass (kg) ÷ height (m)². Relative mass = muscle mass ÷ body weight × 100. No independent muscle-mass prediction or diagnostic classification is performed.";
     break;
    }
    case "almi": {
     const d=calculateALMI(num("alm"),$("almUnit").value,num("height"),$("heightUnit").value);
     result="ALMI: "+fmt(d.index)+" kg/m²";
     note="ALMI = appendicular lean mass (kg) ÷ height (m)². Use a suitable body-composition assessment; interpretation depends on the reference population. No universal cutoff is applied.";
     break;
    }
    case "fmi": {
     const d=calculateFMI(num("fat"),$("fatUnit").value,num("height"),$("heightUnit").value);
     result="FMI: "+fmt(d.index)+" kg/m²";
     note="FMI = fat mass (kg) ÷ height (m)². Use a suitable body-composition assessment. FMI is descriptive, not a diagnosis; no universal category is applied.";
     break;
    }
    case "ffmi": {
     const d=calculateFFMI(num("weightA"),$("weightUnitA").value,num("fatA"),num("heightA"),$("heightUnitA").value,num("weightB"),$("weightUnitB").value,num("fatB"),num("heightB"),$("heightUnitB").value);
     result="Person A: "+fmt(d.a.index)+" kg/m² · Person B: "+fmt(d.b.index)+" kg/m² · Difference: "+fmt(d.difference)+" kg/m²";
     note="FFMI = fat-free mass ÷ height²; fat-free mass = body weight × (1 − body-fat percentage ÷ 100). Measurement error in body-fat percentage affects the comparison; no ranking is inferred.";
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