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
"durnin-womersley":()=>row(sex(),input("age","Age (years)",16,72,1))+row(input("biceps","Biceps skinfold (mm)",1,80),input("triceps","Triceps skinfold (mm)",1,80))+row(input("subscapular","Subscapular skinfold (mm)",1,80),input("suprailiac","Suprailiac skinfold (mm)",1,80)),
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
function run(){
 let result="",note="";
 if(slug==="jp3"||slug==="jp7"||slug==="durnin-womersley"){
  const s=$("sex").value,age=v("age");let ids=[],sum=0,density=0;
  if(slug==="jp3"){ids=s==="male"?["age","chest","abdomen","thigh"]:["age","triceps","suprailiac","thigh"];if(s==="female"&&age>55){fail("The female Jackson–Pollock 3-site equation is not validated beyond age 55.");return;}if(!valid(ids))return;sum=ids.slice(1).reduce((a,id)=>a+v(id),0);density=s==="male"?1.10938-.0008267*sum+.0000016*sum*sum-.0002574*age:1.0994921-.0009929*sum+.0000023*sum*sum-.0001392*age;
  }else if(slug==="jp7"){ids=["age","chest","midaxillary","triceps","subscapular","abdomen","suprailiac","thigh"];if(s==="female"&&age>55){fail("The female Jackson–Pollock 7-site equation is not validated beyond age 55.");return;}if(!valid(ids))return;sum=ids.slice(1).reduce((a,id)=>a+v(id),0);density=s==="male"?1.112-.00043499*sum+.00000055*sum*sum-.00028826*age:1.097-.00046971*sum+.00000056*sum*sum-.00012828*age;
  }else{ids=["age","biceps","triceps","subscapular","suprailiac"];if(!valid(ids))return;sum=ids.slice(1).reduce((a,id)=>a+v(id),0);const bands=s==="male"?[[16,16,1.1533,.0643],[17,19,1.162,.063],[20,29,1.1631,.0632],[30,39,1.1422,.0544],[40,49,1.162,.07],[50,72,1.1715,.0779]]:[[16,16,1.1369,.0598],[17,19,1.1549,.0678],[20,29,1.1599,.0717],[30,39,1.1423,.0632],[40,49,1.1333,.0612],[50,72,1.1339,.0645]];const band=bands.find(x=>age>=x[0]&&age<=x[1]);if(!band){fail("No published coefficient band is available for this age.");return;}density=band[2]-band[3]*Math.log10(sum);}
  if(!(density>0)){fail("The readings do not produce a valid body-density estimate.");return;}result=fmt(bf(density))+"% estimated body fat";note="Predicted body density is converted with Siri: body-fat % = 495 ÷ density − 450. Skinfold technique and population differences can materially affect estimates; not intended for children.";
 }else if(slug==="ymca-body-fat"){if(!valid(["weight","waist"]))return;const w=v("weight")*2.2046226218,wa=v("waist")/2.54,p=(4.15*wa-.082*w-($("sex").value==="male"?98.42:76.76))/w*100;if(p<0||p>75){fail("The inputs produce a result outside 0–75%. Recheck your measurements.");return;}result=fmt(p)+"% estimated body fat";note="YMCA estimate: ((4.15 × waist in inches − 0.082 × weight in pounds − constant) ÷ weight in pounds) × 100. This is a rough estimate, not a direct measurement.";
 }else if(["body-fat-comparison","body-fat-change"].includes(slug)){if(!valid(["a","b"]))return;const d=v("b")-v("a");result="Change: "+(d>0?"+":"")+fmt(d)+" percentage points"+(v("a")===0?"":" · Relative change: "+fmt(d/Math.abs(v("a"))*100)+"%");note="Use the same body-fat measurement method for both readings. Percentage points are the direct subtraction of the two percentages.";
 }else if(["total-body-water","bone-mass"].includes(slug)){if(!valid(["measured","weight"]))return;result=fmt(v("measured")/v("weight")*100)+"% of body mass";note=slug==="total-body-water"?"Uses assessment-reported total body water (kg) ÷ body weight (kg) × 100. Height and weight alone cannot establish individual total body water.":"Uses assessment-reported bone mass (kg) ÷ body weight (kg) × 100. This is a proportion, not a prediction of bone mass or bone density.";
 }else if(["intracellular-water","extracellular-water"].includes(slug)){if(!valid(["compartment","total","weight"]))return;if(v("compartment")>v("total")){fail("Compartment water cannot exceed total body water.");return;}result=fmt(v("compartment")/v("total")*100)+"% of total body water · "+fmt(v("compartment")/v("weight")*100)+"% of body mass";note="Uses measured compartment and total body water values. This calculator does not infer water compartments from height or weight.";
 }else if(["visceral-fat","subcutaneous-fat"].includes(slug)){if(!valid(["measured"]))return;result=fmt(v("measured"))+(slug==="visceral-fat"?" cm² assessment-reported visceral-fat area":" mm assessment-reported subcutaneous-fat thickness");note="Recorded assessment value only. This tool does not estimate tissue quantity from unrelated tape measurements. Interpret using the source device or imaging protocol.";
 }else if(slug.endsWith("-ratio")){if(!valid(["a","b"]))return;const r=v("a")/v("b");result=fmt(r)+" ratio · "+fmt(r*100)+"%";note="First measurement ÷ second measurement. Use the same unit and consistent anatomical landmarks. No universal health or aesthetic cutoff is assigned.";
 }else if(slug==="fat-free-mass-change"){if(!valid(["wa","fa","wb","fb"]))return;const a=v("wa")*(1-v("fa")/100),b=v("wb")*(1-v("fb")/100),d=b-a;result="Earlier: "+fmt(a)+" kg · Current: "+fmt(b)+" kg · Change: "+(d>0?"+":"")+fmt(d)+" kg";note="Fat-free mass = body weight × (1 − body-fat fraction). The change inherits measurement error from both body weight and body-fat estimates.";
 }
 $("calc-result").innerHTML='<strong class="cf-result-value">'+result+'</strong><p class="cf-note">'+note+'</p>';
}
document.addEventListener("DOMContentLoaded",()=>{const f=$("calc-form");if(f){f.addEventListener("submit",e=>{e.preventDefault();run();});f.addEventListener("reset",()=>setTimeout(()=>{$("calc-result").textContent="";},0));if(slug==="jp3"){$("sex").addEventListener("change",()=>{["chest","abdomen"].forEach(id=>$(id).closest(".col").hidden=$("sex").value!=="male");["triceps","suprailiac"].forEach(id=>$(id).closest(".col").hidden=$("sex").value!=="female");});$("sex").dispatchEvent(new Event("change"));}}});
})();