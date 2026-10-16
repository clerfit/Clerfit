(()=>{'use strict';
const ready=()=>{
 const registry=window.ClerFitRegistry||[]; const $=id=>document.getElementById(id); const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icons={
 'Body Measurements & Composition':'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6v5m4-5v3m4-3v5"/>',
 'Face & Aesthetics':'<path d="M12 3c-4.2 0-7 3.2-7 8 0 5.1 3 9 7 10 4-1 7-4.9 7-10 0-4.8-2.8-8-7-8Z"/><path d="M9 10h.01M15 10h.01M9 15q3 2 6 0"/>',
 'Metabolism & Calories':'<path d="M13 2 5 13h6l-1 9 9-13h-6z"/>',
 'Nutrition & Hydration':'<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/>',
 'Muscle, Strength & Performance':'<path d="M3 9v6m4-9v12m10-12v12m4-9v6M7 12h10"/>',
 'Cardio & Endurance':'<path d="M2 12h4l3-7 4 14 3-7h6"/>',
 'Fat Loss & Weight Goals':'<path d="M4 18 10 12l4 3 6-8M14 7h6v6"/>',
 'Recovery, Sleep & Fatigue':'<path d="M19 15A8 8 0 0 1 9 5a8 8 0 1 0 10 10Z"/>',
 'Health, Posture & Medical':'<path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 6.5-8 11-8 11Z"/><path d="M12 8v7m-3.5-3.5h7"/>',
 'Utility & Tools':'<path d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4z"/>',
 'Lifestyle, Age & Environment':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19"/>'};
 const categoryIcon=cat=>`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[cat]||'<circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/>'}</svg>`;
 const fileUrl=x=>'html/'+encodeURI(x.file); const slugIcon=x=>categoryIcon(x.category);
 const categoryGrid=$('cf-category-grid'), directory=$('cf-directory-grid'), query=$('cf-directory-query'); let activeCategory='';
 const categories=[...new Set(registry.map(x=>x.category))];
 if($('cf-total-count'))$('cf-total-count').textContent=String(registry.length);
 categoryGrid.innerHTML=categories.map((cat,i)=>{const n=registry.filter(x=>x.category===cat).length;return `<button class="cf-category-card" type="button" data-category="${esc(cat)}"><span class="cf-category-symbol cat-tone-${i%5}">${categoryIcon(cat)}</span><span class="cf-category-copy"><strong>${esc(cat)}</strong><small>${n} calculators available</small></span><span class="cf-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></button>`}).join('');
 const popularNames=['BMI Calculator','BMR Calculator','TDEE Calculator','Protein Intake','Running Pace','Unit Converter','One-Rep Max','Water Intake'];
 const popular=popularNames.map(name=>registry.find(x=>x.title.toLowerCase()===name.toLowerCase())).filter(Boolean);
 $('cf-popular-grid').innerHTML=popular.map((x,i)=>`<a class="cf-feature-card" href="${fileUrl(x)}"><span class="cf-feature-icon tone-${i%5}">${slugIcon(x)}</span><span class="cf-feature-copy"><small>${esc(x.category)}</small><strong>${esc(x.title)}</strong><span class="cf-feature-open">Open calculator <b aria-hidden="true">→</b></span></span></a>`).join('');
 function renderDirectory(){const q=(query.value||'').trim().toLowerCase();const found=registry.filter(x=>(!activeCategory||x.category===activeCategory)&&(!q||(x.title+' '+x.category+' '+x.keywords+' '+x.slug).toLowerCase().includes(q)));$('cf-directory-title').textContent=activeCategory||'All calculators';$('cf-directory-description').textContent=activeCategory?`Explore all ${found.length} calculators in ${activeCategory}.`:'Browse the complete toolkit or choose a category above.';$('cf-directory-count').textContent=`${found.length} ${found.length===1?'calculator':'calculators'}`;$('cf-clear-filter').hidden=!activeCategory;directory.innerHTML=found.map((x,i)=>`<a class="cf-directory-card" href="${fileUrl(x)}"><span class="cf-directory-icon tone-${i%5}">${slugIcon(x)}</span><span class="cf-directory-copy"><strong>${esc(x.title)}</strong><small>${esc(x.category)}</small></span><span class="cf-directory-arrow" aria-hidden="true">↗</span></a>`).join('');$('cf-empty-state').hidden=found.length!==0;directory.hidden=found.length===0;}
 categoryGrid.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;query.value='';renderDirectory();const target=$('all-calculators');if(target){target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});history.replaceState(null,'','#all-calculators');}});$('cf-clear-filter').addEventListener('click',()=>{activeCategory='';query.value='';renderDirectory()});query.addEventListener('input',renderDirectory);$('cf-reset-search').addEventListener('click',()=>{activeCategory='';query.value='';renderDirectory();query.focus()});renderDirectory();
 // Global search is intentionally available only from the sidebar magnifying-glass control.
 $('cf-year').textContent=new Date().getFullYear();$('cf-back-top').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();})();