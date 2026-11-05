/* ClerFit Metabolism & Energy calculators. Educational estimates only. */
(function(root){
  const KG=0.45359237;
  function n(v){const x=Number(v);if(!Number.isFinite(x))throw Error("Enter valid numbers in every required field.");return x;}
  function range(v,min,max,label){if(v<min||v>max)throw Error(label+" must be between "+min+" and "+max+".");return v;}
  function calc(id,v){
    const w=v.weight===undefined?0:range(n(v.weight),2,500,"Weight");
    const h=v.height===undefined?0:range(n(v.height),100,250,"Height");
    const age=v.age===undefined?0:range(n(v.age),18,120,"Age");
    const sex=v.sex;
    const kg=v.weightUnit==="lbs"?w*KG:w;
    const fat=v.bodyFat===undefined?0:range(n(v.bodyFat),2,70,"Body-fat percentage");
    const ffm=v.ffm===undefined?(v.bodyFat===undefined?0:kg*(1-fat/100)):range(n(v.ffm),2,300,"Fat-free mass");
    const out=(value,label,formula,note)=>({value,label,formula,note});
    switch(id){
      case "harris-benedict": {
        if(!["male","female"].includes(sex))throw Error("Choose a sex/reference group.");
        const r=sex==="male"?88.362+13.397*kg+4.799*h-5.677*age:447.593+9.247*kg+3.098*h-4.330*age;
        return out(r,"Estimated BMR","Revised Harris–Benedict (Roza & Shizgal, 1984)","Adult population equation; estimate, not a direct measurement.");
      }
      case "katch-mcardle":
        return out(370+21.6*ffm,"Estimated BMR","370 + 21.6 × fat-free mass (kg)","Requires measured or otherwise independently established fat-free mass; body-fat input is used only for arithmetic conversion.");
      case "cunningham":
        return out(500+22*ffm,"Estimated RMR","500 + 22 × fat-free mass (kg)","Resting-energy equation; do not treat RMR and BMR as interchangeable measurements.");
      case "schofield": {
        if(!["male","female"].includes(sex))throw Error("Choose a sex/reference group.");
        let a,b;
        if(age<18)throw Error("This page currently supports adults aged 18 and older; use an age-appropriate pediatric reference for younger people.");
        if(age<30){[a,b]=sex==="male"?[15.057,692.2]:[14.818,486.6];}
        else if(age<60){[a,b]=sex==="male"?[11.472,873.1]:[8.126,845.6];}
        else {[a,b]=sex==="male"?[11.711,587.7]:[9.082,658.5];}
        return out(a*kg+b,"Estimated BMR","Schofield adult weight-only equation (kcal/day)","Age band and sex-specific; population estimate, not a direct measurement.");
      }
      case "owen":
        if(!["male","female"].includes(sex))throw Error("Choose a sex/reference group.");
        return out((sex==="male"?879:795)+(sex==="male"?10.2:7.18)*kg,"Estimated RMR","Men: 879 + 10.2 × weight (kg); women: 795 + 7.18 × weight (kg)","Weight-only adult equation; estimate only.");
      case "energy-availability": {
        const intake=range(n(v.intake),0,10000,"Energy intake");
        const exercise=range(n(v.exercise),0,5000,"Exercise energy expenditure");
        if(ffm<=0)throw Error("Enter fat-free mass or body weight and body-fat percentage.");
        return out((intake-exercise)/ffm,"Energy availability","(Energy intake − exercise energy expenditure) ÷ fat-free mass","Not a diagnosis or a universal safe/unsafe classification. Interpretation depends on context; seek qualified sports-nutrition guidance.");
      }
      case "adaptive-thermogenesis": {
        const predicted=range(n(v.predicted),300,10000,"Expected maintenance expenditure");
        const observed=range(n(v.observed),300,10000,"Observed maintenance expenditure");
        return out(observed-predicted,"Observed − expected expenditure","Observed maintenance estimate − expected maintenance estimate","A difference alone cannot establish adaptive thermogenesis. Weight trend, intake accuracy, duration and measurement error matter.");
      }
      case "thermic-effect-food": {
        const p=range(n(v.protein),0,500,"Protein grams"), c=range(n(v.carbs),0,1000,"Carbohydrate grams"), f=range(n(v.fat),0,500,"Fat grams");
        const lo=p*4*.20+c*4*.05+f*9*0, hi=p*4*.30+c*4*.10+f*9*.03;
        return {value:(lo+hi)/2,label:"Estimated thermic effect (range)",formula:"Protein 20–30%; carbohydrate 5–10%; fat 0–3% of energy",note:"Approximate range based on broad macronutrient TEF estimates; midpoint is not a precise personal measurement.",low:lo,high:hi};
      }
      case "calorie-cycling": {
        const weekly=range(n(v.weekly),3500,70000,"Weekly calorie budget");
        const highDays=range(n(v.highDays),0,7,"Higher-calorie days");
        const lowDays=7-highDays;
        const highShare=range(n(v.highShare),0,100,"Higher-day share");
        if(highDays===0||highDays===7)throw Error("Choose 1–6 higher-calorie days so both day types are represented.");
        const highTotal=weekly*highShare/100, lowTotal=weekly-highTotal;
        return {value:weekly/7,label:"Weekly average",formula:"Weekly budget distributed across selected high- and low-day counts",note:"This is arithmetic allocation only; it does not establish an appropriate calorie target.",high:highTotal/highDays,low:lowTotal/lowDays,highDays,lowDays};
      }
      case "reverse-dieting": {
        const start=range(n(v.start),500,10000,"Starting daily intake"), inc=range(n(v.increment),0,500,"Weekly increase"), weeks=range(n(v.weeks),1,52,"Number of weeks");
        if(!Number.isInteger(weeks))throw Error("Weeks must be a whole number.");
        return {value:start+inc*weeks,label:"Projected daily intake at end",formula:"Starting intake + (weekly increment × number of weeks)",note:"A planning schedule only. No universal reverse-dieting protocol is validated to prevent fat gain or 'restore' metabolism.",start,increment:inc,weeks};
      }
      case "refeed-calories": {
        const maintenance=range(n(v.maintenance),500,10000,"Maintenance estimate");
        const factor=range(n(v.factor),0.8,1.5,"Refeed multiplier");
        return out(maintenance*factor,"Selected refeed-day target","Maintenance estimate × user-selected multiplier","Arithmetic target only; a refeed day has no guaranteed metabolic or fat-loss effect.");
      }
      default: throw Error("Unknown calculator.");
    }
  }
  const api={calculate:calc};
  root.ClerFitMetabolism=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
