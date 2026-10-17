(function(){
  'use strict';
  const path=location.pathname;
  const root=path.includes('/html/')?'../': './';
  const home=root+'index.html', contact=root+'contact.html', logo=root+'logo.jpeg';
  const facePage=/face|facial|jaw|chin|nose|mouth|eye-spacing|lower-face/i.test(path);
  const svgHome='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5.5 9v11h13V9M9 20v-6h6v6"/></svg>';
  const svgMail='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>';
  function setup(){
    const main=document.querySelector('main.main')||document.querySelector('main')||document.body;
    // Remove only legacy site-shell elements. Preserve semantic headers/footers used by calculator content.
    document.querySelectorAll('.top-right-buttons,.top-buttons,.cf-image-lightbox').forEach(el=>el.remove());
    document.querySelectorAll('header:not(.clerfit-page-header),footer:not(.clerfit-page-footer)').forEach(el=>{
      const text=(el.textContent||'').toLowerCase();
      const isOutsideMain=!main.contains(el);
      const isLegacyBrand=/clerfit|health\s*&?\s*performance|health.*fitness calculators|all rights reserved/.test(text);
      const isKnownShell=el.matches('.site-header,#site-header,.site-footer,#site-footer,.top-header,.page-header,.page-footer');
      if(isOutsideMain||isLegacyBrand||isKnownShell)el.remove();
    });
    document.querySelectorAll('.main .header, main .header').forEach(el=>{
      const t=(el.textContent||'').toLowerCase();
      if(!(t.includes('clerfit health & fitness calculators')||/clerfit\s*health.*fitness calculators/.test(t)))return;
      // Preserve a semantic page-level heading when removing the legacy brand header.
      const legacyHeading=el.querySelector('h1');
      const allHeadings=main.querySelectorAll('h1');
      if(legacyHeading&&allHeadings.length===1){
        const title=document.title.replace(/^ClerFit\s*[–—-]\s*/i,'').trim();
        legacyHeading.textContent=title||legacyHeading.textContent.trim();
        legacyHeading.classList.add('cf-page-title');
        el.insertAdjacentElement('afterend',legacyHeading);
      }
      el.remove();
    });
    document.querySelectorAll('.main .footer, main .footer').forEach(el=>{const t=(el.textContent||'').toLowerCase();if(t.includes('clerfit')||t.includes('all rights reserved'))el.remove()});
    // Keep breadcrumb synchronized with the final page title after legacy header cleanup.
    const crumb=document.querySelector('.cf-breadcrumb');
    const finalTitle=main.querySelector('h1');
    if(crumb&&finalTitle){crumb.innerHTML=`<a href="${home}">Home</a> / ${finalTitle.textContent.trim().replace(/[&<>]/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]))}`;}
    // Make tables understandable on narrow screens: keep native table semantics,
    // label each data cell from its header, and use compact stacked rows on phones.
    document.querySelectorAll('main table,.main table').forEach(table=>{
      const rows=Array.from(table.rows||[]);
      const headerRow=rows.find(row=>row.querySelector('th'));
      if(headerRow){
        const headers=Array.from(headerRow.cells).map(cell=>(cell.textContent||'').trim());
        rows.filter(row=>row!==headerRow).forEach(row=>Array.from(row.cells).forEach((cell,index)=>{
          if(cell.tagName==='TD'&&!cell.hasAttribute('data-label')&&headers[index])cell.setAttribute('data-label',headers[index]);
        }));
      }
      if(!table.parentElement?.classList.contains('cf-table-scroll')){
        const wrapper=document.createElement('div');wrapper.className='cf-table-scroll';
        wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Calculator reference table');wrapper.tabIndex=0;
        table.parentNode.insertBefore(wrapper,table);wrapper.appendChild(table);
      }
    });
    const oldBrand=document.querySelector('.cf-page-brand'); if(oldBrand) oldBrand.remove();
    if(document.body&&!document.body.id)document.body.id='top';
    // Persistent, accessible top-right navigation on every interactive content page.
    if(!document.querySelector('.clerfit-fixed-actions')){
      const actions=document.createElement('nav'); actions.className='clerfit-fixed-actions'; actions.setAttribute('aria-label','Quick navigation');
      actions.innerHTML=`<a class="clerfit-fixed-home" href="${home}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5.5 9v11h13V9M9 20v-6h6v6"/></svg><span>Home</span></a><a class="clerfit-fixed-contact" href="${contact}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>Contact Us</span></a>`;
      document.body.appendChild(actions);
    }
    if(!document.querySelector('.clerfit-page-header')){
      const header=document.createElement('header'); header.className='clerfit-page-header';
      header.innerHTML=`<a class="clerfit-page-logo" href="${home}"><img src="${logo}" alt="ClerFit logo"><span><strong>ClerFit</strong><small>HEALTH &amp; PERFORMANCE</small></span></a>`;
      // insertBefore requires a direct child; a nested breadcrumb is not a valid reference node.
      const first=Array.from(main.children).find(el=>el.classList&&el.classList.contains('cf-breadcrumb'))||main.firstElementChild;
      if(first) main.insertBefore(header,first); else main.prepend(header);
    }
    // Keep quick navigation in the page header's normal layout flow, not as a floating overlay.
    const sharedHeader=document.querySelector('.clerfit-page-header');
    const sharedActions=document.querySelector('.clerfit-fixed-actions');
    if(sharedHeader&&sharedActions&&sharedActions.parentElement!==sharedHeader) sharedHeader.appendChild(sharedActions);
    if(!document.querySelector('.clerfit-page-footer')){
      const footer=document.createElement('footer'); footer.className='clerfit-page-footer';
      footer.innerHTML=`<div class="clerfit-footer-particles" aria-hidden="true"></div><a class="clerfit-footer-logo" href="${home}"><img src="${logo}" alt=""><span><strong>ClerFit</strong><small>Health &amp; Performance</small></span></a><p>Educational tools for better-informed health and performance decisions. Estimates are not medical diagnoses.</p><nav class="clerfit-legal-links" aria-label="Legal information"><a href="${root}privacy.html">Privacy</a><a href="${root}terms-of-use.html">Terms of Use</a><a href="${root}educational-disclaimer.html">Educational Disclaimer</a></nav><div class="clerfit-footer-bottom"><span>© ${new Date().getFullYear()} ClerFit. All rights reserved where applicable.</span><a href="#top" class="clerfit-back-top">Back to top</a></div>`;
      main.appendChild(footer);
      footer.querySelector('.clerfit-back-top').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
    }
    // All content images can be opened in a lightweight full-screen viewer.
    if(!document.querySelector('.clerfit-image-viewer')){
      const viewer=document.createElement('div'); viewer.className='clerfit-image-viewer'; viewer.hidden=true; viewer.setAttribute('role','dialog'); viewer.setAttribute('aria-modal','true'); viewer.setAttribute('aria-label','Full-screen image');
      viewer.innerHTML='<button type="button" class="clerfit-image-close" aria-label="Close image">×</button><img alt="">'; document.body.appendChild(viewer);
      let returnFocus=null;const close=()=>{viewer.hidden=true;viewer.querySelector('img').removeAttribute('src');document.body.classList.remove('clerfit-viewer-open');if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();returnFocus=null};
      viewer.addEventListener('click',e=>{if(e.target===viewer||e.target.closest('.clerfit-image-close'))close()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!viewer.hidden)close()});
      document.querySelectorAll('main img, .main img, .cf-education-visual img').forEach(img=>{
        if(img.closest('a')||img.closest('.clerfit-image-viewer')||img.closest('.cf-brand-mark')||(img.width>0&&img.width<35))return;
        img.classList.add('clerfit-zoomable');img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Open image full screen: '+(img.alt||'illustration'));
        const open=()=>{returnFocus=img;viewer.querySelector('img').src=img.currentSrc||img.src;viewer.querySelector('img').alt=img.alt||'Illustration';viewer.hidden=false;document.body.classList.add('clerfit-viewer-open');viewer.querySelector('button').focus()};
        img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
      });
    }
    // Reset must clear stale results and validation messages as well as native input values.
    document.querySelectorAll('form').forEach(form=>{
      if(form.dataset.clerfitResetWired)return;
      form.dataset.clerfitResetWired='true';
      form.addEventListener('reset',()=>{
        const clear=()=>{
          form.querySelectorAll('[aria-invalid="true"]').forEach(el=>el.removeAttribute('aria-invalid'));
          form.querySelectorAll('.clerfit-input-error').forEach(el=>el.remove());
          if(form.id==='advanced-form'){
            const output=document.getElementById('advanced-output');
            if(output)output.replaceChildren();
            const formula=document.getElementById('advanced-formula');
            if(formula)formula.textContent='Submit the form to see the formula used.';
          }
          form.querySelectorAll('[data-reset-output],.result,.result-box,.calculation-result').forEach(el=>{el.textContent='';el.removeAttribute('aria-invalid')});
        };
        if(typeof requestAnimationFrame==='function')requestAnimationFrame(clear);else clear();
      });
    });

    // Concise, contextual help for every facial measurement page, but not ordinary demographic fields.
    if(facePage){
      const tips={forehead:'Measure the widest forehead distance between the landmarks described on this page.',cheek:'Measure across the widest cheekbone points, keeping the measurement level.',jaw:'Measure jaw width between the two jaw-angle landmarks; technique affects the result.',chin:'Measure from the lower lip crease to the bottom of the chin, following the page instructions.',nose:'Measure from the nasal root to the tip using the same landmark method each time.',mouth:'Measure the width between the outer corners of the mouth while the face is relaxed.',eye:'Use the inner eye corners or other landmarks specified on this page; do not mix measurement methods.',length:'Measure the stated facial landmarks in a straight line and use the same unit throughout.',thirds:'Facial thirds compare upper, middle and lower facial heights; landmark choices affect the ratio.',ratio:'A ratio compares two measurements. Use compatible units and interpret it descriptively, not as a health or attractiveness score.',balance:'This is a manual proportion summary, not a clinically validated facial-health or attractiveness score.',face:'Use a straight-on photo or mirror and measure consistently; this tool does not identify faces automatically.'};
      document.querySelectorAll('label').forEach(label=>{
        if(label.querySelector('.clerfit-face-help'))return;
        const labelText=(label.textContent||'').trim().toLowerCase();
        const fieldId=(label.htmlFor||'').trim().toLowerCase();
        if(/^(gender|sex|age|height|weight|unit|measurement unit)$/.test(labelText)||/^(gender|sex|age|height|weight|unit|age-input|height-input|weight-input)$/.test(fieldId))return;
        const txt=(labelText+' '+fieldId); let key=Object.keys(tips).find(k=>txt.includes(k)); if(!key && !/measure|ratio|width|height|length|face|eye|nose|jaw|chin|mouth|forehead|cheek|third|balance/i.test(txt))return;
        if(!key)key='face';
        const b=document.createElement('button');b.type='button';b.className='clerfit-face-help';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1 .8-1.6 1.1-1.6 2.3"/><path d="M12 16.5h.01"/></svg>';b.setAttribute('aria-label','Help: '+label.textContent.trim());b.setAttribute('aria-expanded','false');b.title=tips[key];
        const pop=document.createElement('span');pop.className='clerfit-face-tip';pop.textContent=tips[key];
        b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=b.getAttribute('aria-expanded')!=='true';document.querySelectorAll('.clerfit-face-help[aria-expanded="true"]').forEach(x=>{x.setAttribute('aria-expanded','false');x.nextElementSibling?.classList.remove('show')});b.setAttribute('aria-expanded',String(open));pop.classList.toggle('show',open)});
        label.append(b,pop);
      });
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
