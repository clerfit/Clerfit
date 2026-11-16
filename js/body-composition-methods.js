/* ClerFit body-composition calculators. Calculations run locally; no health data is transmitted. */
(()=>{"use strict";
const $=id=>document.getElementById(id),v=id=>Number($(id).value),fmt=x=>Number(x).toFixed(2),slug=document.body.dataset.calculator;
const input=(id,label,min=0.1,max=300,step="any")=>'<div class="col"><label for="'+id+'">'+label+'</label><input id="'+id+'" type="number" min="'+min+'" max="'+max+'" step="'+step+'" required></div>';
const select=(id,label,opts)=>'<div class="col"><label for="'+id+'">'+label+'</label><select id="'+id+'">'+opts.map(o=>'<option value="'+o[0]+'">'+o[1]+'</option>').join("")+'</select></div>';
const row=(...x)=>'<div class="row">'+x.join("")+'</div>';
const sex=()=>select("sex","Equation group",[["male","Male equation"],["female","Female equation"]]);
const schemas={
jp3:()=>row(sex(),input("age","Age (years)",18,61,1))+row(input("chest","Chest skinfold (mm)",1,80),input("abdomen","Abdomen skinfold (mm)",1,100))+row(input("triceps","Triceps skinfold (mm) · female",1,80),input("suprailiac","Suprailiac skinfold (mm) · female",1,80),input("thigh","Thigh skinfold (mm)",1,100)),
jp7:()=>row(sex(),input("age","Age (years)",18,61,1))+row(input("chest","Chest (mm)",1,80),input("midaxillary","Midaxillary (mm)",1,80))+row(input("triceps","Triceps (mm)",1,80),input("subscapular","Subscapular (mm)",1,80))+row(input("abdomen","Abdomen (mm)",1,100),input("suprailiac","Suprailiac (mm)",1,80),input("thigh","Thigh (mm)",1,100)),
"durnin-womersley":()=>row(sex(),input("age","Age (years)",17,72,1))+row(input("biceps","Biceps skinfold (mm)",1,80),input("triceps","Triceps skinfold (mm)",1,80))+row(input("subscapular","Subscapular skinfold (mm)",1,80),input("suprailiac","Suprailiac skinfold (mm)",1,80)),
"ymca-body-fat":()=>row(sex(),input("weight","Body weight (kg)",20,350))+row(input("waist","Waist circumference (cm)",30,250)),
"body-fat-comparison":()=>row(input("a","First body-fat reading (%)",0,75),input("b","Second body-fat reading (%)",0,75)),
"total-body-water":()=>row(input("measured","Measured total body water (kg)",0,250),input("weight","Body weight (kg)",1,500)),
"intracellular-water":()=>row(input("compartment","Measured intracellular water (L)",0,200),input("total","Measured total body water (L)",0.1,250))+row(input("weight","Body weight (kg)",1,500)),
"extracellular-water":()=>row(input("compartment","Measured extracellular water (L)",0,200),input("total","Measured total body water (L)",0.1,250))+row(input("weight","Body weight (kg)",1,500)),
"bone-mass":()=>row(input("measured","Assessment-reported bone mass (kg)",0,100),input("weight","Body weight (kg)",1,500)),
"visceral-fat":()=>row(input("measured","Assessment-reported visceral-fat area (cm²)",0,10000)),
"subcutaneous-fat":()=>row(input("measured","Assessment-reported subcutaneous-fat thickness (mm)",0,200)),
"waist-arm-ratio":()=>row(input("a","Waist circumference",0.1,300),input("b","Upper-arm circumference",0.1,150))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"waist-thigh-ratio":()=>row(input("a","Waist circumference",0.1,300),input("b","Thigh circumference",0.1,200))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"chest-waist-ratio":()=>row(input("a","Chest circumference",0.1,300),input("b","Waist circumference",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"shoulder-waist-ratio":()=>row(input("a","Shoulder circumference",0.1,300),input("b","Waist circumference",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"shoulder-hip-ratio":()=>row(input("a","Shoulder circumference",0.1,300),input("b","Hip circumference",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"chest-height-ratio":()=>row(input("a","Chest circumference",0.1,300),input("b","Height",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"hip-height-ratio":()=>row(input("a","Hip circumference",0.1,300),input("b","Height",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"upper-arm-height-ratio":()=>row(input("a","Upper-arm circumference",0.1,150),input("b","Height",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"biacromial-width-ratio":()=>row(input("a","Biacromial shoulder breadth",0.1,100),input("b","Height",0.1,300))+row(select("unit","Unit",[["cm","cm"],["mm","mm"],["in","inches"]])),
"body-fat-change":()=>row(input("a","Earlier body-fat reading (%)",0,75),input("b","Current body-fat reading (%)",0,75)),
"fat-free-mass-change":()=>row(input("wa","Earlier body weight (kg)",1,500),input("fa","Earlier body fat (%)",0,75))+row(input("wb","Current body weight (kg)",1,500),input("fb","Current body fat (%)",0,75))
};
const host=$("calculator-fields");if(host&&schemas[slug])host.innerHTML=schemas[slug]();
function fail(s){$("calc-result").innerHTML='<p class="cf-validation-message" role="alert">'+s+'</p>';}
function valid(ids){for(const id of ids){const e=$(id),x=Number(e?.value);if(!e||e.value.trim()===""||!Number.isFinite(x)||x<Number(e.min)||x>Number(e.max)){fail("Enter valid values within the displayed ranges.");e?.focus();return false;}}return true;}
const bf=d=>495/d-450;
const DURNIN_WOMERSLEY_COEFFICIENTS = {
 male: [
  { min: 17, max: 19, a: 1.1620, b: 0.0630 },
  { min: 20, max: 29, a: 1.1631, b: 0.0632 },
  { min: 30, max: 39, a: 1.1422, b: 0.0544 },
  { min: 40, max: 49, a: 1.1620, b: 0.0700 },
  { min: 50, max: 72, a: 1.1715, b: 0.0779 }
 ],
 female: [
  { min: 17, max: 19, a: 1.1549, b: 0.0678 },
  { min: 20, max: 29, a: 1.1599, b: 0.0717 },
  { min: 30, max: 39, a: 1.1423, b: 0.0632 },
  { min: 40, max: 49, a: 1.1333, b: 0.0612 },
  { min: 50, max: 72, a: 1.1339, b: 0.0645 }
 ]
};

function calculateDurninWomersleyDensity(sex, age, skinfoldSum) {
 const group = DURNIN_WOMERSLEY_COEFFICIENTS[sex];
 const years = Number(age);
 const sum = Number(skinfoldSum);
 if (!group) throw new RangeError("Choose a supported equation group.");
 if (!Number.isInteger(years) || years < 17 || years > 72) {
  throw new RangeError("The Durnin–Womersley reference coefficients support ages 17–72 years.");
 }
 if (!Number.isFinite(sum) || sum <= 0) {
  throw new RangeError("The sum of the four skinfold measurements must be positive.");
 }
 const band = group.find(item => years >= item.min && years <= item.max);
 if (!band) throw new RangeError("No published coefficient band is available for this age.");
 const density = band.a - band.b * Math.log10(sum);
 if (!Number.isFinite(density) || density <= 0) {
  throw new RangeError("The readings do not produce a valid body-density estimate.");
 }
 return density;
}

function calculateJacksonPollockDensity(method, sex, age, readings) {
 const years = Number(age);
 const values = Array.isArray(readings) ? readings.map(Number) : [];
 const expectedCount = method === "jp3" ? 3 : method === "jp7" ? 7 : 0;
 if (!expectedCount || values.length !== expectedCount) {
  throw new RangeError("The selected Jackson–Pollock method requires " + expectedCount + " skinfold readings.");
 }
 if (!["male", "female"].includes(sex)) throw new RangeError("Choose a supported equation group.");
 if (!Number.isInteger(years) || years < 18 || years > 61 || (sex === "female" && years > 55)) {
  throw new RangeError("The selected Jackson–Pollock equation supports adults aged 18–61 years; the female equation is limited to age 55.");
 }
 if (values.some(value => !Number.isFinite(value) || value <= 0)) {
  throw new RangeError("Every skinfold reading must be a positive finite value in millimetres.");
 }
 const sum = values.reduce((total, value) => total + value, 0);
 if (method === "jp3") {
  return sex === "male"
   ? 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * years
   : 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * years;
 }
 return sex === "male"
  ? 1.112 - 0.00043499 * sum + 0.00000055 * sum * sum - 0.00028826 * years
  : 1.097 - 0.00046971 * sum + 0.00000056 * sum * sum - 0.00012828 * years;
}

function calculateYMCABodyFatPercent(weightKg, waistCm, sex) {
 const weight = Number(weightKg);
 const waist = Number(waistCm);
 if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(waist) || waist <= 0) {
  throw new RangeError("Weight and waist circumference must be positive finite values.");
 }
 if (!["male", "female"].includes(sex)) throw new RangeError("Choose a supported equation group.");
 const weightLb = weight * 2.2046226218;
 const waistIn = waist / 2.54;
 const constant = sex === "male" ? 98.42 : 76.76;
 const result = ((4.15 * waistIn - 0.082 * weightLb - constant) / weightLb) * 100;
 if (!Number.isFinite(result) || result < 0 || result > 75) {
  throw new RangeError("The inputs produce a result outside 0–75%. Recheck your measurements.");
 }
 return result;
}

function calculateBodyFatChange(previousPercent, currentPercent) {
 const previous = Number(previousPercent);
 const current = Number(currentPercent);
 if (![previous, current].every(value => Number.isFinite(value) && value >= 0 && value <= 75)) {
  throw new RangeError("Both body-fat readings must be between 0 and 75 percent.");
 }
 const difference = current - previous;
 return {
  percentagePointChange: difference,
  relativeChangePercent: previous === 0 ? null : difference / Math.abs(previous) * 100
 };
}

function calculateMeasuredProportion(measuredValue, totalMass, label) {
 const measured = Number(measuredValue);
 const total = Number(totalMass);
 if (!Number.isFinite(measured) || measured < 0 || !Number.isFinite(total) || total <= 0) {
  throw new RangeError(label + " must be non-negative and total body mass must be positive.");
 }
 if (measured > total) throw new RangeError(label + " cannot exceed total body mass.");
 return measured / total * 100;
}

function calculateWaterCompartment(compartment, totalWater, bodyWeight) {
 const value = Number(compartment);
 const total = Number(totalWater);
 const weight = Number(bodyWeight);
 if (![value, total, weight].every(Number.isFinite) || value < 0 || total <= 0 || weight <= 0) {
  throw new RangeError("Water measurements must be finite; total water and body weight must be positive.");
 }
 if (value > total) throw new RangeError("Compartment water cannot exceed total body water.");
 if (total > weight) throw new RangeError("Total body water cannot exceed body weight.");
 return {
  percentOfTotalWater: value / total * 100,
  percentOfBodyMass: value / weight * 100
 };
}

function calculatePositiveRatio(numerator, denominator) {
 const top = Number(numerator);
 const bottom = Number(denominator);
 if (!Number.isFinite(top) || top <= 0 || !Number.isFinite(bottom) || bottom <= 0) {
  throw new RangeError("Both measurements must be positive finite values.");
 }
 return top / bottom;
}

function calculateFatFreeMassChange(weightA, fatA, weightB, fatB) {
 const values = [weightA, fatA, weightB, fatB].map(Number);
 const [firstWeight, firstFat, secondWeight, secondFat] = values;
 if (!Number.isFinite(firstWeight) || firstWeight <= 0 || !Number.isFinite(secondWeight) || secondWeight <= 0 ||
     !Number.isFinite(firstFat) || firstFat < 0 || firstFat > 75 ||
     !Number.isFinite(secondFat) || secondFat < 0 || secondFat > 75) {
  throw new RangeError("Enter positive body weights and body-fat readings from 0 to 75 percent.");
 }
 const earlier = firstWeight * (1 - firstFat / 100);
 const current = secondWeight * (1 - secondFat / 100);
 return { earlier, current, change: current - earlier };
}

if (typeof window !== "undefined") {
 window.ClerFitBodyComposition = {
  calculateDurninWomersleyDensity,
  calculateJacksonPollockDensity,
  calculateYMCABodyFatPercent,
  calculateBodyFatChange,
  calculateMeasuredProportion,
  calculateWaterCompartment,
  calculatePositiveRatio,
  calculateFatFreeMassChange,
  bodyFatFromDensity: bf
 };
}

function run(){
 let result="",note="";
 if(slug==="jp3"||slug==="jp7"||slug==="durnin-womersley"){
  const s=$("sex").value,age=v("age");let ids=[],sum=0,density=0;
  if(slug==="jp3"){ids=s==="male"?["age","chest","abdomen","thigh"]:["age","triceps","suprailiac","thigh"];if(s==="female"&&age>55){fail("The female Jackson–Pollock 3-site equation is not validated beyond age 55.");return;}if(!valid(ids))return;density=calculateJacksonPollockDensity("jp3",s,age,ids.slice(1).map(v));
  }else if(slug==="jp7"){ids=["age","chest","midaxillary","triceps","subscapular","abdomen","suprailiac","thigh"];if(s==="female"&&age>55){fail("The female Jackson–Pollock 7-site equation is not validated beyond age 55.");return;}if(!valid(ids))return;density=calculateJacksonPollockDensity("jp7",s,age,ids.slice(1).map(v));
  }else{ids=["age","biceps","triceps","subscapular","suprailiac"];if(!valid(ids))return;sum=ids.slice(1).reduce((a,id)=>a+v(id),0);try{density=calculateDurninWomersleyDensity(s,age,sum);}catch(error){fail(error.message);return;}}
  if(!(density>0)){fail("The readings do not produce a valid body-density estimate.");return;}const bodyFat=bf(density);if(!Number.isFinite(bodyFat)||bodyFat<0||bodyFat>75){fail("The readings produce a body-fat estimate outside 0–75%. Recheck the measurements and equation group.");return;}result=fmt(bodyFat)+"% estimated body fat";note="Predicted body density is converted with Siri: body-fat % = 495 ÷ density − 450. Skinfold technique and population differences can materially affect estimates; not intended for children.";
 }else if(slug==="ymca-body-fat"){if(!valid(["weight","waist"]))return;const p=calculateYMCABodyFatPercent(v("weight"),v("waist"),$("sex").value);result=fmt(p)+"% estimated body fat";note="YMCA estimate: ((4.15 × waist in inches − 0.082 × weight in pounds − constant) ÷ weight in pounds) × 100. This is a rough estimate, not a direct measurement.";
 }else if(["body-fat-comparison","body-fat-change"].includes(slug)){if(!valid(["a","b"]))return;const change=calculateBodyFatChange(v("a"),v("b"));const d=change.percentagePointChange;result="Change: "+(d>0?"+":"")+fmt(d)+" percentage points"+(change.relativeChangePercent===null?"":" · Relative change: "+fmt(change.relativeChangePercent)+"%");note="Use the same body-fat measurement method for both readings. Percentage points are the direct subtraction of the two percentages.";
 }else if(["total-body-water","bone-mass"].includes(slug)){if(!valid(["measured","weight"]))return;result=fmt(calculateMeasuredProportion(v("measured"),v("weight"),slug==="total-body-water"?"Total body water":"Bone mass"))+"% of body mass";note=slug==="total-body-water"?"Uses assessment-reported total body water (kg) ÷ body weight (kg) × 100. Height and weight alone cannot establish individual total body water.":"Uses assessment-reported bone mass (kg) ÷ body weight (kg) × 100. This is a proportion, not a prediction of bone mass or bone density.";
 }else if(["intracellular-water","extracellular-water"].includes(slug)){if(!valid(["compartment","total","weight"]))return;const water=calculateWaterCompartment(v("compartment"),v("total"),v("weight"));result=fmt(water.percentOfTotalWater)+"% of total body water · "+fmt(water.percentOfBodyMass)+"% of body mass";note="Uses measured compartment and total body water values. This calculator does not infer water compartments from height or weight.";
 }else if(["visceral-fat","subcutaneous-fat"].includes(slug)){if(!valid(["measured"]))return;result=fmt(v("measured"))+(slug==="visceral-fat"?" cm² assessment-reported visceral-fat area":" mm assessment-reported subcutaneous-fat thickness");note="Recorded assessment value only. This tool does not estimate tissue quantity from unrelated tape measurements. Interpret using the source device or imaging protocol.";
 }else if(slug.endsWith("-ratio")){if(!valid(["a","b"]))return;const r=calculatePositiveRatio(v("a"),v("b"));result=fmt(r)+" ratio · "+fmt(r*100)+"%";note="First measurement ÷ second measurement. Use the same unit and consistent anatomical landmarks. No universal health or aesthetic cutoff is assigned.";
 }else if(slug==="fat-free-mass-change"){if(!valid(["wa","fa","wb","fb"]))return;const change=calculateFatFreeMassChange(v("wa"),v("fa"),v("wb"),v("fb"));const {earlier:a,current:b,change:d}=change;result="Earlier: "+fmt(a)+" kg · Current: "+fmt(b)+" kg · Change: "+(d>0?"+":"")+fmt(d)+" kg";note="Fat-free mass = body weight × (1 − body-fat fraction). The change inherits measurement error from both body weight and body-fat estimates.";
 }
 $("calc-result").innerHTML='<strong class="cf-result-value">'+result+'</strong><p class="cf-note">'+note+'</p>';
}
document.addEventListener("DOMContentLoaded",()=>{const f=$("calc-form");if(f){f.addEventListener("submit",e=>{e.preventDefault();run();});f.addEventListener("reset",()=>setTimeout(()=>{$("calc-result").textContent="";},0));if(slug==="jp3"){$("sex").addEventListener("change",()=>{["chest","abdomen"].forEach(id=>$(id).closest(".col").hidden=$("sex").value!=="male");["triceps","suprailiac"].forEach(id=>$(id).closest(".col").hidden=$("sex").value!=="female");});$("sex").dispatchEvent(new Event("change"));}}});
})();