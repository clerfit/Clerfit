/* =================================================
   UNIT CONVERSION HELPERS
================================================= */

function toKg(v, u) {
  return u === "lbs" ? v * 0.453592 : v;
}

function toCm(v, u) {
  switch (u) {
    case "m": return v * 100;
    case "in": return v * 2.54;
    case "ft": return v * 30.48;
    default: return v;
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

  // Adult thresholds
  if (age >= 18) {
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else if (bmi < 35) category = "Obese";
    else category = "Severe";
  } else {
    // Teen BMI-for-age approximate categories (simplified)
    // Real charts use percentiles, here we approximate
    if (gender === "male") {
      if (bmi < 16) category = "Underweight";
      else if (bmi < 22) category = "Normal";
      else if (bmi < 27) category = "Overweight";
      else if (bmi < 35) category = "Obese";
      else category = "Severe";
    } 
else {
      if (bmi < 16) category = "Underweight";
      else if (bmi < 21) category = "Normal";
      else if (bmi < 26) category = "Overweight";
      else if (bmi < 35) category = "Obese";
      else category = "Severe";
    }
  }

  document.getElementById("result").innerHTML =
    `BMI: <b>${bmi.toFixed(1)}</b> — <b>${category}</b>`;

  moveIndicatorBMI(bmi, age, gender);
}

/* =================================================
   INDICATOR BAR
================================================= */

function moveIndicatorBMI(bmi, age, gender) {
  const indicator = document.getElementById("indicator");
  const tooltip = indicator.querySelector(".tooltip");

  let ranges;
  if (gender === "male") {
    ranges = [
      { label: "Underweight", min: 0, max: 18.5, color: "#3b82f6", startPct: 0, endPct: 18.5 },
      { label: "Normal",      min: 18.5, max: 24.9, color: "#22c55e", startPct: 18.5, endPct: 24.9 },
      { label: "Overweight",  min: 25, max: 29.9, color: "#eab308", startPct: 25, endPct: 29.9 },
      { label: "Obese",       min: 30, max: 34.9, color: "#f97316", startPct: 30, endPct: 34.9 },
      { label: "Severe",      min: 35, max: 100, color: "#ef4444", startPct: 35, endPct: 40 }
    ];
  } else {
    ranges = [
      { label: "Underweight", min: 0, max: 18, color: "#3b82f6", startPct: 0, endPct: 18 },
      { label: "Normal",      min: 18, max: 24, color: "#22c55e", startPct: 18, endPct: 24 },
      { label: "Overweight",  min: 24, max: 29, color: "#eab308", startPct: 24, endPct: 29 },
      { label: "Obese",       min: 29, max: 34, color: "#f97316", startPct: 29, endPct: 34 },
      { label: "Severe",      min: 34, max: 100, color: "#ef4444", startPct: 34, endPct: 40 }
    ];
  }

  const range = ranges.find(r => bmi >= r.min && bmi <= r.max) || ranges[ranges.length - 1];
  let pos = range.startPct + ((bmi - range.min) / (range.max - range.min)) * (range.endPct - range.startPct);
  if (pos > 100) pos = 100;

  indicator.style.left = pos + "%";
  indicator.style.backgroundColor = range.color;
  tooltip.innerText = range.label;
}

function calculateBMI() {
  const w = parseFloat(document.getElementById("weight").value);
  const h = parseFloat(document.getElementById("height").value);
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;

  if ([w, h, age].some(isNaN) || w <= 0 || h <= 0 || age <= 0) {
    alert("Enter valid values");
    return;
  }

  const bmi = w / ((h / 100) ** 2);

  document.getElementById("result").innerHTML = `BMI: <b>${bmi.toFixed(1)}</b>`;
  moveIndicatorBMI(bmi, age, gender);
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

  if (!height || !waist || !neck) {
    result.innerHTML = "❌ Please fill all required fields";
    return;
  }

  // Convert all to cm
  height = convertToCm(height, heightUnit);
  waist = convertToCm(waist, waistUnit);
  neck = convertToCm(neck, neckUnit);
  hip = convertToCm(hip || 0, hipUnit); // 0 if empty

  let bf;

  if (gender === "male") {
    bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    formula.innerHTML = "Formula (Male): 86.01 × log10(Waist − Neck) − 70.041 × log10(Height) + 36.76";
  } else {
    if (!hip) {
      result.innerHTML = "❌ Hip measurement required for females";
      return;
    }
    bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    formula.innerHTML = "Formula (Female): 163.205 × log10(Waist + Hip − Neck) − 97.684 × log10(Height) − 78.387";
  }

  bf = bf.toFixed(1);
  result.innerHTML = `Body Fat Percentage: <b>${bf}%</b>`;

  let pos = Math.min(Math.max(bf, 0), 40);
  indicator.style.left = (pos / 40) * 100 + "%";
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

  if (!height) {
    resultDiv.innerHTML = "❌ Please enter your height";
    return;
  }

  // Convert height to cm
  if (heightUnit === "m") height *= 100;
  else if (heightUnit === "inch") height *= 2.54;
  else if (heightUnit === "ft") height *= 30.48; // 1 ft = 30.48 cm

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

  if (!bmr) {
    resultDiv.innerHTML = "❌ Please enter your BMR";
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

  if (isNaN(w) || isNaN(f)) {
    alert("Enter values");
    return;
  }

  document.getElementById("result").innerHTML =
    `Protein Needed: <b>${(w * f).toFixed(1)} g/day</b>`;
}

/* =================================================
   WATER
================================================= */
function calculateWater() {
  const w = getValUnit("weight", "weightUnit", "weight");

  if (isNaN(w)) {
    alert("Enter weight");
    return;
  }

  document.getElementById("result").innerHTML =
    `Water Intake: <b>${(w * 35).toFixed(0)} ml/day</b>`;
}

/* =================================================
   WAIST HIP RATIO
================================================= */
function calculateWHR() {
  const gender = document.getElementById('gender').value;
  let waist = parseFloat(document.getElementById('waist').value);
  let hip = parseFloat(document.getElementById('hip').value);
  const waistUnit = document.getElementById('waistUnit').value;
  const hipUnit = document.getElementById('hipUnit').value;

  if(!waist || !hip || waist<=0 || hip<=0){ alert("Enter valid numbers"); return; }

  // Convert to cm
  function convertToCm(value, unit){
    switch(unit){
      case 'cm': return value;
      case 'm': return value*100;
      case 'inch': return value*2.54;
      case 'ft': return value*30.48;
      default: return value;
    }
  }
  waist = convertToCm(waist, waistUnit);
  hip = convertToCm(hip, hipUnit);

  const whr = (waist/hip).toFixed(2);
  document.getElementById('result').innerHTML = `<strong>WHR: ${whr}</strong>`;
  document.getElementById('formula').innerHTML = `Formula: Waist ÷ Hip = ${waist.toFixed(1)} ÷ ${hip.toFixed(1)} = ${whr}`;

  // Determine risk
  let color='', label='';
  if(gender==='female'){
    if(whr<0.80){ color='blue'; label='Healthy';}
    else if(whr<=0.85){ color='green'; label='Increased Risk';}
    else{ color='red'; label='High Risk';}
  } else {
    if(whr<0.95){ color='blue'; label='Healthy';}
    else if(whr<=1.00){ color='green'; label='Increased Risk';}
    else{ color='red'; label='High Risk';}
  }

  // UPDATE ONLY INDICATOR, DO NOT CHANGE BAR STRUCTURE
  const indicator = document.getElementById('indicator');
  indicator.style.left = Math.min(100, (whr*100)) + '%'; // simple position
  indicator.style.background = color;
  indicator.title = label; // show label on hover
}

/* =================================================
   LEAN MASS
================================================= */
function calculateLeanMass() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");

  if (isNaN(w) || isNaN(bf)) {
    alert("Enter weight & fat%");
    return;
  }

  document.getElementById("result").innerHTML =
    `Lean Mass: <b>${(w * (1 - bf / 100)).toFixed(2)} kg</b>`;
}

/* =================================================
   FAT MASS
================================================= */
function calculateFatMass() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");

  if (isNaN(w) || isNaN(bf)) {
    alert("Enter weight & fat%");
    return;
  }

  document.getElementById("result").innerHTML =
    `Fat Mass: <b>${(w * bf / 100).toFixed(2)} kg</b>`;
}

/* =================================================
   FFMI
================================================= */
function calculateFFMI() {
  const w = getValUnit("weight", "weightUnit", "weight");
  const bf = getVal("fat");
  const h = getValUnit("height", "heightUnit", "height") / 100;

  if ([w, bf, h].some(isNaN)) {
    alert("Enter all values");
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

  if (isNaN(h) || isNaN(w)) {
    alert("Enter values");
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

  if (isNaN(d)) {
    alert("Enter distance");
    return;
  }

  const vo2 = (d - 504.9) / 44.73;

  document.getElementById("result").innerHTML =
    `VO₂ Max: <b>${vo2.toFixed(2)} ml/kg/min</b>`;
}
 