/* =================================================
   UNIT CONVERSION HELPERS
================================================= */

function toKg(v, u) {
  return ["lb", "lbs", "pound", "pounds"].includes(String(u).toLowerCase()) ? v * 0.45359237 : v;
}

function toCm(v, u) {
  // Accept every unit token used by the individual legacy pages. Several pages
  // use "inch" while others use "in"; treating "inch" as centimetres produced
  // incorrect FFMI/RFM results after a user changed the unit selector.
  switch (String(u || "").trim().toLowerCase()) {
    case "m":
    case "meter":
    case "meters":
    case "metre":
    case "metres":
      return v * 100;
    case "in":
    case "inch":
    case "inches":
      return v * 2.54;
    case "ft":
    case "foot":
    case "feet":
      return v * 30.48;
    default:
      return v;
  }
}

function getVal(id) {
  return parseFloat(document.getElementById(id).value);
}

function getValUnit(id, unitId, type) {
  const v = getVal(id);
  if (isNaN(v)) return NaN;
  const u = document.getElementById(unitId).value;
  if (type === "weight") return toKg(v, u);
  if (["height", "waist", "hip", "neck"].includes(type)) return toCm(v, u);
  return v;
}

/* =================================================
   BMI CALCULATION WITH AGE & GENDER
================================================= */

function calculateBMI() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const h = getValUnit("height", "heightUnit", "height");
  const age = getVal("age");
  const gender = document.getElementById("gender").value;

  if ([w, h, age].some(isNaN) || w <= 0 || h <= 0 || age <= 0) {
    alert("Enter valid values");
    return;
  }

  const bmi = w / ((h / 100) ** 2);
  let category = "";
  if (age >= 20) {
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else if (bmi < 35) category = "Obese";
    else category = "Severe";
    document.getElementById("result").innerHTML = `BMI: <b>${bmi.toFixed(1)}</b> — <b>${category}</b>`;
    moveIndicatorBMI(bmi, age);
  } else {
    // CDC adult BMI cutoffs apply to adults aged 20 and older; ages 2–19 require BMI-for-age charts.
    category = "Age-specific interpretation required";
    document.getElementById("result").innerHTML = `BMI: <b>${bmi.toFixed(1)}</b> — <b>${category}</b><p class="cf-note">For ages 2–19, interpret BMI using an appropriate age- and sex-specific growth chart percentile. This calculator does not estimate a pediatric percentile.</p>`;
    const indicator = document.getElementById("indicator");
    if (indicator) {
      indicator.style.left = "0%";
      indicator.style.backgroundColor = "#64748b";
      const tooltip = indicator.querySelector(".tooltip");
      if (tooltip) tooltip.innerText = "Use BMI-for-age charts";
    }
  }
}

/* =================================================
   INDICATOR BAR
================================================= */

function moveIndicatorBMI(bmi, age) {
  const indicator = document.getElementById("indicator");
  if (!indicator) return;
  const tooltip = indicator.querySelector(".tooltip");

  // Standard adult BMI categories are not sex-specific. Pediatric BMI is
  // handled separately above and must be interpreted with growth charts.
  const ranges = [
    { label: "Underweight", min: 0, max: 18.5, color: "#3b82f6" },
    { label: "Healthy-weight range", min: 18.5, max: 25, color: "#22c55e" },
    { label: "Overweight", min: 25, max: 30, color: "#eab308" },
    { label: "Obesity class I", min: 30, max: 35, color: "#f97316" },
    { label: "Obesity class II or higher", min: 35, max: Infinity, color: "#ef4444" }
  ];
  const range = ranges.find(r => bmi >= r.min && bmi < r.max) || ranges[ranges.length - 1];
  indicator.style.left = `${Math.min(100, Math.max(0, bmi / 40 * 100))}%`;
  indicator.style.backgroundColor = range.color;
  if (tooltip) tooltip.innerText = range.label;
  indicator.title = range.label;
}

/* =================================================
   BMR CALCULATION (Mifflin–St Jeor)
================================================= */
function calculateBMR() {
  // GET VALUES
  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value);
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;

  const weightUnit = document.getElementById("weightUnit").value;
  const heightUnit = document.getElementById("heightUnit").value;

  // VALIDATION
  if ([weight, height, age].some(isNaN) || weight <= 0 || height <= 0 || age <= 0) {
    alert("Please enter all values correctly");
    return;
  }

  // CONVERT WEIGHT → KG
  if (weightUnit === "lbs") {
    weight = weight * 0.453592;
  }

  // CONVERT HEIGHT → CM
  switch (heightUnit) {
    case "m":
      height = height * 100;
      break;
    case "inch":
      height = height * 2.54;
      break;
    case "foot":
      height = height * 30.48;
      break;
    // cm is default
  }

  // CALCULATE BMR
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  bmr = bmr.toFixed(0);

  // DISPLAY RESULT
  document.getElementById("result").innerHTML = `BMR Result: <b>${bmr} kcal/day</b>`;
  document.getElementById("formula").innerHTML = `
    <b>Formula (Mifflin–St Jeor)</b><br>
    Weight: ${weight.toFixed(2)} kg<br>
    Height: ${height.toFixed(2)} cm<br>
    Age: ${age} years<br>
    Gender: ${gender}<br><br>
    BMR = ${bmr} kcal/day
  `;
}
/* =================================================
   BODY FAT % (US NAVY)
================================================= */
function convertToCm(value, unit) {
  if (unit === "cm") return value;
  else if (unit === "m") return value * 100;
  else if (unit === "inch") return value * 2.54;
  else if (unit === "ft") return value * 30.48;
  return value;
}

function calculateBodyFat() {
  const gender = document.getElementById("bf-gender").value;

  let height = parseFloat(document.getElementById("bf-height").value);
  let waist = parseFloat(document.getElementById("bf-waist").value);
  let neck = parseFloat(document.getElementById("bf-neck").value);
  let hip = parseFloat(document.getElementById("bf-hip").value);

  const heightUnit = document.getElementById("bf-height-unit").value;
  const waistUnit = document.getElementById("bf-waist-unit").value;
  const neckUnit = document.getElementById("bf-neck-unit").value;
  const hipUnit = document.getElementById("bf-hip-unit").value;

  const result = document.getElementById("bf-result");
  const formula = document.getElementById("bf-formula");
  const indicator = document.getElementById("bf-indicator");

  if (![height, waist, neck].every(Number.isFinite) || height <= 0 || waist <= 0 || neck <= 0) {
    result.textContent = "Enter valid height, waist and neck measurements.";
    formula.textContent = "";
    return;
  }

  // Convert all measurements to centimetres before checking formula domains.
  height = convertToCm(height, heightUnit);
  waist = convertToCm(waist, waistUnit);
  neck = convertToCm(neck, neckUnit);
  hip = Number.isFinite(hip) && hip > 0 ? convertToCm(hip, hipUnit) : 0;

  if (height < 100 || height > 250 || waist < 20 || waist > 250 || neck < 15 || neck > 80 || waist <= neck) {
    result.textContent = "Check the measurements: height, waist and neck must be plausible, and waist must exceed neck for this equation.";
    formula.textContent = "";
    return;
  }
  if (gender !== "male" && (hip < 20 || hip > 250 || waist + hip <= neck)) {
    result.textContent = "A valid hip measurement is required for the female equation.";
    formula.textContent = "";
    return;
  }

  // The US Navy equation constants expect inches. Validate in centimetres above,
  // then convert every measurement used by the logarithms to inches.
  const heightIn = height / 2.54;
  const waistIn = waist / 2.54;
  const neckIn = neck / 2.54;
  const hipIn = hip / 2.54;
  let bf;

  if (gender === "male") {
    bf = 86.01 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
    formula.innerHTML = "US Navy male equation (measurements converted to inches): 86.01 × log10(Waist − Neck) − 70.041 × log10(Height) + 36.76";
  } else {
    if (!hip) {
      result.innerHTML = "Hip measurement required for females.";
      return;
    }
    bf = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    formula.innerHTML = "US Navy female equation (measurements converted to inches): 163.205 × log10(Waist + Hip − Neck) − 97.684 × log10(Height) − 78.387";
  }

  if (!Number.isFinite(bf)) {
    result.textContent = "These measurements cannot produce a valid body-fat estimate. Check the inputs.";
    formula.textContent = "";
    return;
  }
  bf = bf.toFixed(1);
  result.textContent = `Estimated Body Fat Percentage: ${bf}%`;

  if (indicator) {
    let pos = Math.min(Math.max(Number(bf), 0), 40);
    indicator.style.left = (pos / 40) * 100 + "%";
  }
}

/* =================================================
   IDEAL WEIGHT
================================================= */
function calculateIdealWeight() {
  const gender = document.getElementById("iw-gender").value;
  let height = parseFloat(document.getElementById("iw-height").value);
  const heightUnit = document.getElementById("iw-height-unit").value;
  const weightUnit = document.getElementById("iw-weight-unit").value;

  const resultDiv = document.getElementById("iw-result");
  const formulaDiv = document.getElementById("iw-formula");

  if (!Number.isFinite(height) || height <= 0) {
    resultDiv.textContent = "Please enter a valid height.";
    formulaDiv.textContent = "";
    return;
  }

  // Convert height to cm
  if (heightUnit === "m") height *= 100;
  else if (heightUnit === "inch") height *= 2.54;
  else if (heightUnit === "ft") height *= 30.48; // 1 ft = 30.48 cm

  if (!Number.isFinite(height) || height < 100 || height > 250) {
    resultDiv.textContent = "Enter a height between 100 and 250 cm (or the equivalent selected unit).";
    formulaDiv.textContent = "";
    return;
  }

  let idealWeight;

  // Devine Formula
  if (gender === "male") {
    idealWeight = 50 + 0.91 * (height - 152.4); // height in cm
    formulaDiv.innerHTML = "Formula (Male): 50 + 0.91 × (Height(cm) − 152.4)";
  } else {
    idealWeight = 45.5 + 0.91 * (height - 152.4);
    formulaDiv.innerHTML = "Formula (Female): 45.5 + 0.91 × (Height(cm) − 152.4)";
  }

  // Convert to lb if needed
  if (weightUnit === "lb") idealWeight = (idealWeight * 2.20462).toFixed(1);
  else idealWeight = idealWeight.toFixed(1);

  resultDiv.innerHTML = `Ideal Weight: <b>${idealWeight} ${weightUnit}</b>`;
}

/* =================================================
   CALORIES / TDEE
================================================= */
function calculateCalories() {
  let bmr = parseFloat(document.getElementById("cal-bmr").value);
  const bmrUnit = document.getElementById("cal-bmr-unit").value;
  const activity = parseFloat(document.getElementById("cal-activity").value);

  const resultDiv = document.getElementById("cal-result");
  const formulaDiv = document.getElementById("cal-formula");

  if (!Number.isFinite(bmr) || bmr <= 0 || !Number.isFinite(activity) || activity < 1 || activity > 3) {
    resultDiv.textContent = "Enter a positive BMR and a valid activity factor.";
    formulaDiv.textContent = "";
    return;
  }

  // Convert kJ to kcal if needed
  if (bmrUnit === "kj") bmr = bmr / 4.184;

  const calories = (bmr * activity).toFixed(1);

  resultDiv.innerHTML = `Daily Calorie Needs: <b>${calories} kcal</b>`;
  formulaDiv.innerHTML = `Formula: BMR × Activity Level = ${bmr.toFixed(1)} × ${activity} = ${calories} kcal`;
}

/* =================================================
   PROTEIN
================================================= */
function calculateProtein() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const f = getVal("level");

  if (!Number.isFinite(w) || w <= 0 || w > 500 || !Number.isFinite(f) || f < 0.8 || f > 2.5) {
    document.getElementById("result").textContent = "Enter a valid body weight and protein factor (0.8–2.5 g/kg).";
    return;
  }

  document.getElementById("result").textContent = `Estimated protein target: ${(w * f).toFixed(1)} g/day`;
}

/* =================================================
   WATER
================================================= */
function calculateWater() {
  const w = getValUnit("weight", "weightUnit", "weight");

  if (!Number.isFinite(w) || w <= 0 || w > 500) {
    document.getElementById("result").textContent = "Enter a valid body weight.";
    return;
  }

  document.getElementById("result").textContent = `Approximate baseline fluid estimate: ${(w * 35).toFixed(0)} ml/day. Individual needs vary with activity, climate and health.`;
}

/* =================================================
   WAIST HIP RATIO
================================================= */
function calculateWHR() {
  const result = document.getElementById('result');
  const formula = document.getElementById('formula');
  const rawWaist = Number(document.getElementById('waist').value);
  const rawHip = Number(document.getElementById('hip').value);
  const waistUnit = document.getElementById('waistUnit').value;
  const hipUnit = document.getElementById('hipUnit').value;

  // The shared engine loads after inline page scripts, so it must use the
  // same validation as html/whr.html rather than overriding it with a weaker handler.
  result.textContent = '';
  formula.textContent = '';
  if (!Number.isFinite(rawWaist) || !Number.isFinite(rawHip) || rawWaist <= 0 || rawHip <= 0) {
    result.innerHTML = '<p class="cf-validation-message" role="alert">Enter valid positive waist and hip measurements.</p>';
    return;
  }

  const toMetres = (value, unit) => {
    switch (String(unit).toLowerCase()) {
      case 'cm': return value / 100;
      case 'm': return value;
      case 'in':
      case 'inch':
      case 'inches': return value * 0.0254;
      case 'ft':
      case 'foot':
      case 'feet': return value * 0.3048;
      default: return NaN;
    }
  };
  const waistM = toMetres(rawWaist, waistUnit);
  const hipM = toMetres(rawHip, hipUnit);
  if (![waistM, hipM].every(value => Number.isFinite(value) && value > 0)) {
    result.innerHTML = '<p class="cf-validation-message" role="alert">Choose supported units for both measurements.</p>';
    return;
  }
  if (waistM < 0.1 || waistM > 3 || hipM < 0.1 || hipM > 3) {
    result.innerHTML = '<p class="cf-validation-message" role="alert">Check that both circumference measurements are plausible.</p>';
    return;
  }

  const waist = waistM / 0.01;
  const hip = hipM / 0.01;
  const ratio = waist / hip;
  if (!Number.isFinite(ratio)) {
    result.innerHTML = '<p class="cf-validation-message" role="alert">The result could not be calculated from these measurements.</p>';
    return;
  }

  const whr = ratio.toFixed(2);
  result.innerHTML = `<strong>WHR: ${whr}</strong><p class="cf-note">Screening ratio only. This calculator does not assign a universal risk category or diagnose a condition.</p>`;
  formula.textContent = `Formula: Waist ÷ Hip = ${waist.toFixed(1)} ÷ ${hip.toFixed(1)} = ${whr}`;
  const barContainer = document.querySelector('.bar-container');
  if (barContainer) barContainer.hidden = true;
  const indicator = document.getElementById('indicator');
  if (indicator && indicator.parentElement) indicator.parentElement.hidden = true;
}

/* =================================================
   LEAN MASS
================================================= */
function calculateLeanMass() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");

  if (!Number.isFinite(w) || w <= 0 || w > 500 || !Number.isFinite(bf) || bf < 0 || bf > 100) {
    document.getElementById("result").textContent = "Enter a valid weight and body-fat percentage (0–100%).";
    return;
  }

  document.getElementById("result").textContent = `Estimated lean mass: ${(w * (1 - bf / 100)).toFixed(2)} kg`;
}

/* =================================================
   FAT MASS
================================================= */
function calculateFatMass() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");

  if (!Number.isFinite(w) || w <= 0 || w > 500 || !Number.isFinite(bf) || bf < 0 || bf > 100) {
    document.getElementById("result").textContent = "Enter a valid weight and body-fat percentage (0–100%).";
    return;
  }

  document.getElementById("result").textContent = `Estimated fat mass: ${(w * bf / 100).toFixed(2)} kg`;
}

/* =================================================
   FFMI
================================================= */
function calculateFFMI() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");
  const h = getValUnit("height", "heightUnit", "height") / 100;

  if (![w, bf, h].every(Number.isFinite) || w <= 0 || w > 500 || bf < 0 || bf > 100 || h < 1 || h > 2.5) {
    document.getElementById("result").textContent = "Enter valid weight, height and body-fat values.";
    return;
  }

  const ffmi = (w * (1 - bf / 100)) / (h * h);

  document.getElementById("result").innerHTML =
    `FFMI: <b>${ffmi.toFixed(2)}</b>`;
}

/* =================================================
   RFM
================================================= */
function calculateRFM() {
  const h = getValUnit("height", "heightUnit", "height");
  const w = getValUnit("waist", "waistUnit", "waist");
  const g = document.getElementById("gender").value;

  if (!Number.isFinite(h) || !Number.isFinite(w) || h < 100 || h > 250 || w < 20 || w > 250) {
    document.getElementById("result").textContent = "Enter plausible height and waist measurements in the selected units.";
    return;
  }

  const rfm = g === "male"
    ? 64 - (20 * h / w)
    : 76 - (20 * h / w);

  document.getElementById("result").innerHTML =
    `RFM: <b>${rfm.toFixed(2)}%</b>`;

  moveIndicator(rfm, "rfm");
}

/* =================================================
   VO₂ MAX (COOPER)
================================================= */
function calculateVO2() {
  const d = getVal("distance");
  const output = document.getElementById("result");
  if (!Number.isFinite(d) || d <= 504.9 || d > 20000) {
    output.textContent = "Enter a plausible 12-minute test distance above 504.9 metres and no more than 20,000 metres. The Cooper equation is not valid when it yields a non-positive estimate.";
    return;
  }
  const vo2 = (d - 504.9) / 44.73;
  output.textContent = `Estimated VO₂ max: ${vo2.toFixed(1)} ml/kg/min. Field-test estimate only; no universal fitness category is assigned.`;
}
