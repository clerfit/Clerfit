(() => {
  "use strict";
  const calculators = [
    ["bmi","BMI Calculator","Body metrics","Estimate body mass index from height and weight."],
    ["bmr","BMR Calculator","Nutrition","Estimate basal metabolic rate."],
    ["bodyfat","Body Fat Calculator","Body metrics","Estimate body fat using body measurements."],
    ["idealweight","Ideal Weight Calculator","Body metrics","Explore a formula-based ideal-weight estimate."],
    ["calories","Calorie Needs Calculator","Nutrition","Estimate daily calorie needs."],
    ["protein","Protein Intake Calculator","Nutrition","Estimate a daily protein target."],
    ["water","Water Intake Calculator","Nutrition","Estimate daily water needs."],
    ["whr","Waist-to-Hip Ratio","Body metrics","Compare waist and hip measurements."],
    ["ffmi","Fat-Free Mass Index","Body metrics","Estimate fat-free mass index."],
    ["rfm","Relative Fat Mass","Body metrics","Estimate relative fat mass from measurements."],
    ["vo2max","VO₂ Max Calculator","Performance","Estimate aerobic fitness."],
    ["heartrate","Heart Rate Calculator","Performance","Explore heart-rate training ranges."],
    ["leanmass","Lean Body Mass","Body metrics","Estimate lean body mass."],
    ["fatmass","Fat Mass Calculator","Body metrics","Estimate body fat mass."],
    ["ponderal","Ponderal Index","Body metrics","Calculate ponderal index from height and weight."],
    ["absi","ABSI Calculator","Body metrics","Estimate A Body Shape Index."],
    ["tdee","TDEE Calculator","Nutrition","Estimate total daily energy expenditure."],
    ["mets","METs Calculator","Performance","Estimate activity energy expenditure using METs."],
    ["pace","Running Pace Calculator","Performance","Convert running distance and time into pace."],
    ["healthrisk","Health Risk Calculator","Body metrics","Explore an educational estimate from selected measurements."]
  ].map(([slug,name,category,description]) => ({slug,name,category,description,url:"html/"+slug+".html"}));
  const $ = id => document.getElementById(id);
  const card = c => '<a class="cf-calculator-card" href="'+c.url+'"><span class="cf-card-category">'+c.category+'</span><strong>'+c.name+'</strong><span>'+c.description+'</span><span class="cf-card-open">Open calculator →</span></a>';
  function render(list) {
    const grid=$("cf-directory-grid"), count=$("cf-directory-count"), empty=$("cf-empty-state");
    if(!grid) return;
    grid.innerHTML=list.map(card).join("");
    if(count) count.textContent=list.length+" of "+calculators.length+" calculators";
    if(empty) empty.hidden=list.length!==0;
  }
  function renderPopular() {
    const grid=$("cf-popular-grid"); if(grid) grid.innerHTML=calculators.slice(0,4).map(card).join("");
  }
  function renderCategories() {
    const grid=$("cf-category-grid"); if(!grid) return;
    const cats=[...new Set(calculators.map(c=>c.category))];
    grid.innerHTML=cats.map(cat=>'<button type="button" class="cf-category-card" data-category="'+cat+'"><strong>'+cat+'</strong><span>'+calculators.filter(c=>c.category===cat).length+' calculators</span></button>').join("");
    grid.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
      const cat=btn.dataset.category; $("cf-directory-title").textContent=cat;
      $("cf-directory-description").textContent="Showing calculators in "+cat+".";
      $("cf-clear-filter").hidden=false; render(calculators.filter(c=>c.category===cat));
      $("all-calculators").scrollIntoView({behavior:"smooth",block:"start"});
    }));
  }
  function filter() {
    const q=($("cf-directory-query")?.value||"").trim().toLowerCase();
    $("cf-directory-title").textContent=q?"Search results":"All calculators";
    $("cf-directory-description").textContent=q?"Matching calculators for “"+q+"”.":"Browse the available ClerFit calculators.";
    $("cf-clear-filter").hidden=!q;
    render(calculators.filter(c=>(c.name+" "+c.category+" "+c.description+" "+c.slug).toLowerCase().includes(q)));
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const count=$("cf-total-count"); if(count) count.textContent=String(calculators.length);
    const year=$("cf-year"); if(year) year.textContent=String(new Date().getFullYear());
    render(calculators); renderPopular(); renderCategories();
    $("cf-directory-query")?.addEventListener("input",filter);
    $("cf-clear-filter")?.addEventListener("click",()=>{if($("cf-directory-query")) $("cf-directory-query").value=""; $("cf-directory-title").textContent="All calculators"; $("cf-directory-description").textContent="Browse the available ClerFit calculators."; render(calculators); $("cf-clear-filter").hidden=true;});
    $("cf-reset-search")?.addEventListener("click",()=>{if($("cf-directory-query")) $("cf-directory-query").value=""; filter();});
  });
})();