/* ClerFit R3 homepage directory — restores the original markup's expected behaviour. */
(() => {
  "use strict";
  const calculators = [
    ["bmi","BMI Calculator","Body metrics","Calculate body mass index."],
    ["bmr","BMR Calculator","Nutrition","Estimate basal metabolic rate."],
    ["bodyfat","Body Fat % Calculator","Body metrics","Estimate body fat percentage."],
    ["idealweight","Ideal Weight Calculator","Body metrics","Compare formula-based ideal-weight estimates."],
    ["calories","Calorie Needs Calculator","Nutrition","Estimate daily calorie needs."],
    ["protein","Protein Intake Calculator","Nutrition","Estimate daily protein requirements."],
    ["water","Water Intake Calculator","Nutrition","Estimate daily water needs."],
    ["whr","Waist-to-Hip Ratio","Body metrics","Calculate waist-to-hip ratio."],
    ["ffmi","Fat-Free Mass Index","Body metrics","Estimate fat-free mass index."],
    ["rfm","Relative Fat Mass","Body metrics","Estimate relative fat mass."],
    ["vo2max","VO₂ Max Calculator","Performance","Estimate aerobic fitness."],
    ["heartrate","Heart Rate Calculator","Performance","Explore heart-rate training ranges."],
    ["leanmass","Lean Body Mass Calculator","Body metrics","Estimate lean body mass."],
    ["fatmass","Fat Mass Calculator","Body metrics","Estimate fat mass."],
    ["ponderal","Ponderal Index Calculator","Body metrics","Calculate ponderal index."],
    ["absi","ABSI Calculator","Body metrics","Calculate A Body Shape Index."],
    ["tdee","TDEE Calculator","Nutrition","Estimate total daily energy expenditure."],
    ["mets","METs Calculator","Performance","Estimate activity energy expenditure."],
    ["pace","Running Pace Calculator","Performance","Calculate running pace and speed."],
    ["healthrisk","Health Risk Calculator","Body metrics","Explore measurement-based health estimates."]
  ].map(([slug,name,category,description])=>({slug,name,category,description,url:"html/"+slug+".html"}));
  const byId=id=>document.getElementById(id);
  const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const card=c=>'<a class="cf-calculator-card" href="'+c.url+'"><span class="cf-card-category">'+safe(c.category)+'</span><strong>'+safe(c.name)+'</strong><span>'+safe(c.description)+'</span><span class="cf-card-open">Open calculator <span aria-hidden="true">→</span></span></a>';
  function render(list){const grid=byId("cf-directory-grid");if(!grid)return;grid.innerHTML=list.map(card).join("");const count=byId("cf-directory-count");if(count)count.textContent=list.length+" calculators";const empty=byId("cf-empty-state");if(empty)empty.hidden=list.length>0;}
  function setAll(){if(byId("cf-directory-title"))byId("cf-directory-title").textContent="All calculators";if(byId("cf-directory-description"))byId("cf-directory-description").textContent="Browse the complete toolkit or choose a category above.";if(byId("cf-clear-filter"))byId("cf-clear-filter").hidden=true;render(calculators);}
  document.addEventListener("DOMContentLoaded",()=>{
    const total=byId("cf-total-count");if(total)total.textContent="20";
    const year=byId("cf-year");if(year)year.textContent=String(new Date().getFullYear());
    render(calculators.slice(0,4));const popular=byId("cf-popular-grid");if(popular)popular.innerHTML=calculators.slice(0,4).map(card).join("");
    const grid=byId("cf-directory-grid");if(grid)render(calculators);
    const cats=byId("cf-category-grid");
    if(cats){const groups=[...new Set(calculators.map(c=>c.category))];cats.innerHTML=groups.map(cat=>'<button class="cf-category-card" type="button" data-category="'+safe(cat)+'"><strong>'+safe(cat)+'</strong><span>'+calculators.filter(c=>c.category===cat).length+' calculators</span></button>').join("");cats.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{const cat=btn.dataset.category; if(byId("cf-directory-title"))byId("cf-directory-title").textContent=cat;if(byId("cf-directory-description"))byId("cf-directory-description").textContent="Showing calculators in "+cat+".";if(byId("cf-clear-filter"))byId("cf-clear-filter").hidden=false;render(calculators.filter(c=>c.category===cat));byId("all-calculators")?.scrollIntoView({behavior:"smooth",block:"start"});}));}
    const input=byId("cf-directory-query");
    if(input)input.addEventListener("input",()=>{const q=input.value.trim().toLowerCase();const list=calculators.filter(c=>(c.name+" "+c.category+" "+c.description+" "+c.slug).toLowerCase().includes(q));if(byId("cf-directory-title"))byId("cf-directory-title").textContent=q?"Search results":"All calculators";if(byId("cf-directory-description"))byId("cf-directory-description").textContent=q?"Matching calculators for “"+q+"”.":"Browse the complete toolkit or choose a category above.";if(byId("cf-clear-filter"))byId("cf-clear-filter").hidden=!q;render(list);});
    byId("cf-clear-filter")?.addEventListener("click",()=>{if(input)input.value="";setAll();});
    byId("cf-reset-search")?.addEventListener("click",()=>{if(input)input.value="";setAll();});
  });
})();