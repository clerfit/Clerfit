/* ClerFit additional anthropometric calculators. Local-only; no data transmission. */
(() => {
 const $=id=>document.getElementById(id);
 const num=id=>Number($(id).value);
 const fmt=n=>Number(n).toLocaleString(undefined,{maximumFractionDigits:3});
 const definitions={
 "neck-circumference":{kind:"measure"},
 "muac":{kind:"measure"},
 "mid-thigh-circumference":{kind:"measure"},
 "calf-circumference":{kind:"measure"},
 "bai":{kind:"bai"},
 "relative-muscle-mass":{kind:"relative"},
 "skeletal-muscle-mass":{kind:"skeletal"},
 "almi":{kind:"almi"},
 "fmi":{kind:"fmi"},
 "ffmi-comparison":{kind:"ffmi"},
 "waist-circumference-reference":{kind:"measure"},
 "waist-height-comparison":{kind:"whtcompare"},
 "body-volume":{kind:"volume"},
 "body-density":{kind:"density"},
 "anthropometric-z-score":{kind:"zscore"},
 "body-measurement-symmetry":{kind:"symmetry"},
 "arm-waist-ratio":{kind:"ratio"},
 "leg-height-ratio":{kind:"ratio"},
 "sitting-height-ratio":{kind:"ratio"}
 };
 function calculate(){
  const kind=document.body.dataset.calculator, cfg=definitions[kind], out=$("calc-result");
  if(!cfg||!out)return;
  const fields=[...document.querySelectorAll("[data-field]")];
  // Legacy measurement pages predate data-field markers; fall back to their visible
  // numeric form controls so shared calculation logic handles both markup generations.
  if(!fields.length){const form=$("calc-form");if(form)fields.push(...form.querySelectorAll('input[type="number"]:not([disabled])'));}
  for(const f of fields){const v=Number(f.value),min=Number(f.min),max=Number(f.max);if(f.value.trim()===""||!Number.isFinite(v)||v<min||v>max){out.innerHTML='<p class="cf-validation-message" role="alert">Please enter valid values within the displayed ranges.</p>';f.focus();return;}}
  let result="",note="";
  switch(cfg.kind){
   case "measure": result=fmt(num(fields[0].id))+" cm"; note="Recorded measurement only. Compare it only with a reference that uses the same measurement protocol.";break;
   case "bai": {const v=num("hip")/Math.pow(num("height")/100,1.5)-18;result=fmt(v)+" (BAI estimate)";note="BAI = hip circumference (cm) ÷ height (m) raised to 1.5, minus 18. It is not a direct body-fat measurement.";break;}
   case "relative": {const p=num("muscle")/num("weight")*100;result=fmt(p)+"% of body mass";note="Calculated from the supplied skeletal-muscle-mass value. This tool does not validate or independently estimate that input.";break;}
   case "skeletal": {const p=num("muscle")/num("weight")*100,idx=num("muscle")/Math.pow(num("height")/100,2);result=fmt(num("muscle"))+" kg · "+fmt(p)+"% of body mass · SMMI "+fmt(idx)+" kg/m²";note="Derived from the supplied muscle-mass assessment. No independent muscle-mass prediction is performed.";break;}
   case "almi": result=fmt(num("alm")/Math.pow(num("height")/100,2))+" kg/m²";note="ALMI = appendicular lean mass (kg) ÷ height (m)².";break;
   case "fmi": result=fmt(num("fat")/Math.pow(num("height")/100,2))+" kg/m²";note="FMI = fat mass (kg) ÷ height (m)².";break;
   case "ffmi": {const a=(num("weightA")*(1-num("fatA")/100))/Math.pow(num("heightA")/100,2),b=(num("weightB")*(1-num("fatB")/100))/Math.pow(num("heightB")/100,2);result="Person A: "+fmt(a)+" kg/m² · Person B: "+fmt(b)+" kg/m² · Difference: "+fmt(Math.abs(a-b))+" kg/m²";note="FFMI = estimated fat-free mass ÷ height². Body-fat measurement error affects the comparison.";break;}
   case "whtcompare": {const a=num("waistA")/num("heightA"),b=num("waistB")/num("heightB");result="Person A: "+fmt(a)+" · Person B: "+fmt(b)+" · Difference: "+fmt(Math.abs(a-b));note="Waist-to-height ratio = waist circumference ÷ height, using the same units.";break;}
   case "volume": result=fmt(num("mass")/num("density"))+" L";note="Volume = mass ÷ density. This assumes average density is representative and uses kg and kg/L.";break;
   case "density": result=fmt(num("mass")/num("volume"))+" kg/L";note="Density = mass ÷ volume. Ensure volume is entered in litres.";break;
   case "zscore": result=fmt((num("value")-num("mean"))/num("sd"));note="Z-score = (observed value − reference mean) ÷ reference standard deviation. Reference selection is essential.";break;
   case "symmetry": {const a=num("left"),b=num("right"),d=Math.abs(a-b),p=d/((a+b)/2)*100;result="Absolute difference: "+fmt(d)+" cm · Relative difference: "+fmt(p)+"%";note="Relative difference = absolute side-to-side difference ÷ mean of both sides × 100.";break;}
   case "ratio": {const a=num(fields[0].id),b=num(fields[1].id);result=fmt(a/b)+" ("+fmt(a/b*100)+"%)";note="Ratio = first measurement ÷ second measurement. Interpret only with a suitable, clearly defined reference.";break;}
  }
  out.innerHTML='<strong class="cf-result-value">'+result+'</strong><p class="cf-note">'+note+'</p>';
 }
 document.addEventListener("DOMContentLoaded",()=>{const f=$("calc-form");if(f)f.addEventListener("submit",e=>{e.preventDefault();calculate();});});
})();