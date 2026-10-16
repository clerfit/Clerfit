/* ClerFit universal contextual tooltips. Local-only, no network requests. */
(() => {
  const glossary = {
    bmi: 'Body mass index = weight in kilograms ÷ height in metres squared. It is a screening measure, not a direct body-fat measurement.',
    bmr: 'Basal metabolic rate: an estimate of energy used at rest to support essential body functions. It is not your total daily calorie need.',
    rmr: 'Resting metabolic rate: estimated energy used while resting. Methods and formulas differ from BMR.',
    tdee: 'Total daily energy expenditure: estimated energy used across resting metabolism, activity and digestion.',
    ffmi: 'Fat-free mass index relates fat-free mass to height. It is an estimate and does not independently measure muscle quality or health.',
    'one-rep max': 'One-repetition maximum (1RM) is the heaviest load you can lift once with proper technique. Formula-based values are estimates.',
    'body fat': 'Body-fat percentage estimates the proportion of body mass that is fat. Accuracy depends on the measurement method and assumptions.',
    'waist-to-hip ratio': 'Waist circumference divided by hip circumference. Interpretation depends on age, sex and the reference standard used.',
    'waist-to-height ratio': 'Waist circumference divided by height, measured in the same units. It is a screening indicator, not a diagnosis.',
    'metabolic age': 'A comparison derived from a selected metabolic formula or reference group. It is not a clinical measure of biological age.',
    'activity level': 'Choose your usual activity across a typical week, not only your hardest workout day.',
    'duration': 'Enter elapsed time using the units shown. Do not enter a decimal as minutes and seconds (for example, 5:30 means five minutes thirty seconds).',
    'pace': 'Pace is time per distance, commonly min/km or min/mile. Lower time per kilometre means faster running.',
    'cadence': 'Cadence is the number of steps or repetitions per minute. Check whether this calculator expects total steps or steps per leg.',
    'stride length': 'Stride length depends on the measurement convention. This page may use one full stride or an individual step; follow its field instructions.',
    'step length': 'Step length is the distance from one foot contact to the next opposite-foot contact. It is not always the same as a full stride.',
    'rpe': 'Rate of perceived exertion: a subjective rating of how hard an effort feels. Confirm the scale shown before entering a value.',
    'met': 'Metabolic equivalent (MET) is a convention used to describe activity energy cost. MET-based calorie results are estimates.',
    'uv': 'Ultraviolet (UV) exposure varies with location, time, cloud, skin sensitivity and protection. A calculator cannot guarantee safe exposure.',
    'somatotype': 'Somatotype systems describe body-build dimensions, but categories are simplified and should not be treated as fixed identities or health diagnoses.',
    'facial thirds': 'A proportional comparison of selected facial landmarks. Landmark placement affects the ratio; it is not a validated attractiveness or health score.',
    'facial balance': 'A descriptive set of manually measured proportions. There is no single universally accepted clinical facial-balance score.',
    'calorie deficit': 'A calorie deficit means estimated energy intake is below energy expenditure. Calculations are approximate and should not encourage extreme restriction.',
    'calorie surplus': 'A calorie surplus means estimated energy intake exceeds energy expenditure. The result does not predict exactly how weight or body composition will change.',
    'maintenance calories': 'An estimate of energy intake associated with weight stability over time. Actual needs vary and should be adjusted using trends.',
    'water intake': 'Fluid needs vary with body size, activity, climate, diet and health. Avoid forcing excessive water intake; thirst and clinical guidance matter.',
    'sodium': 'Sodium is an electrolyte. Needs and limits depend on age and health; this calculator is not a substitute for clinical advice.',
    'potassium': 'Potassium is an essential electrolyte. Kidney conditions and some medicines affect safe intake; do not use an estimate to change treatment.',
    'recovery': 'Recovery indicators here are general planning aids, not validated medical diagnoses. Consider pain, illness, sleep and performance trends.',
    'fatigue index': 'This is a descriptive estimate based on the inputs and formula on this page, not a clinically validated fatigue diagnosis.',
    'leg length difference': 'Surface measurements can be affected by posture and technique. This tool cannot diagnose a structural leg-length difference.',
    'forward head': 'A posture estimate based on chosen landmarks. A photo or simple ratio cannot diagnose a spinal condition.',
    'shoulder symmetry': 'Small visible differences are common. Measurement position and camera angle can affect the result; this is not a diagnosis.',
    'heat exposure': 'Heat risk depends on humidity, exertion, acclimatisation, clothing and health. Stop activity and seek help for signs of heat illness.',
    'cold exposure': 'Cold risk depends on wind, wetness, clothing, duration and health. A calculated duration cannot guarantee safety.',
    'sunlight duration': 'Exposure depends on UV index, location, time, skin sensitivity and protection. Do not use a timer as a guarantee of safe sun exposure.',
    'default': 'Enter a realistic value using the displayed unit. This result depends on the inputs and assumptions shown on this page; review the formula and limitations before relying on it.'
  };
  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[:*?]+$/g, '');
  function hintFor(label, control) {
    const text = norm(label || control?.getAttribute('aria-label') || control?.placeholder || control?.name || control?.id);
    if (!text) return glossary.default;
    const keys = Object.keys(glossary).filter(k => k !== 'default').sort((a,b)=>b.length-a.length);
    for (const k of keys) if (text.includes(k)) return glossary[k];
    if (/height/.test(text)) return 'Measure height without shoes and use the unit displayed. Keep the same measurement method when tracking changes.';
    if (/weight|mass/.test(text)) return 'Use a recent measurement and the displayed unit. For tracking, compare measurements taken under similar conditions.';
    if (/age|birth/.test(text)) return 'Enter your age or date accurately. Some interpretations require age-specific reference standards.';
    if (/waist|hip|chest|neck|jaw|chin|nose|mouth|eye|face|forehead|cheek/.test(text)) return 'Measure between the landmarks described on this page, keep the tape or tool level, and use the same method each time.';
    if (/distance|length|height|width|circumference/.test(text)) return 'Use the unit shown and measure consistently. Do not mix units in a ratio unless the calculator explicitly converts them.';
    if (/time|minute|second|hour|sleep|rest/.test(text)) return 'Enter elapsed time in the format and unit requested. For clock times, use the stated 24-hour or AM/PM convention.';
    if (/calorie|energy|kcal|protein|carbohydrate|fat|fiber|fibre|water|fluid|sodium|potassium/.test(text)) return 'This is an estimate or planning value. Individual needs vary; check the formula, assumptions and any health-related limitations.';
    if (/score|index|ratio|risk|percentage|percent/.test(text)) return 'This is a calculated indicator, not automatically a diagnosis or validated rating. Review the formula and reference range provided.';
    if (/activity|training|exercise|workout|intensity|load|reps|sets|steps/.test(text)) return 'Use a representative value for the activity and period requested. Estimates vary with technique, intensity and individual differences.';
    if (/calculate|reset|copy|share|search|menu|close|home|contact|expand|collapse/.test(text)) return `Control: ${label || text}. Use it to perform the action described by its label.`;
    return glossary.default;
  }
  function addTip(target, label, hint) {
    if (!target || target.querySelector(':scope > .cf-tip-wrap')) return;
    const wrap = document.createElement('span'); wrap.className = 'cf-tip-wrap';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cf-tip-trigger';
    btn.setAttribute('aria-label', `Help: ${label || 'this field'}`); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'i';
    const pop = document.createElement('span'); pop.className = 'cf-tip-popover'; pop.setAttribute('role','tooltip'); pop.textContent = hint;
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const open = wrap.classList.toggle('cf-tip-open'); btn.setAttribute('aria-expanded', String(open)); });
    btn.addEventListener('keydown', e => { if (e.key === 'Escape') { wrap.classList.remove('cf-tip-open'); btn.setAttribute('aria-expanded','false'); btn.blur(); } });
    wrap.append(btn,pop); target.appendChild(wrap);
  }
  function init() {
    // Keep the interface quiet: add visible help only for unfamiliar/specialist terms.
    const specialist = /\b(bmi|bmr|rmr|tdee|ffmi|1rm|one[- ]rep max|metabolic age|somatotype|facial thirds|facial balance|absi|rfm|ponderal index|vo2 max|vo2max|met|rpe|cadence|stride length|step length|cooper test|session density|training[- ]rest ratio|load[- ]recovery ratio|fatigue index|waist[- ]to[- ]hip ratio|waist[- ]to[- ]height ratio|body surface area|relative strength|energy balance|work[- ]rest balance|sedentary ratio|uv index|heat exposure|cold exposure|forward head index|sit[- ]stand ratio|water loss replacement|electrolyte|lean body mass|body fat percentage|facial ratio|jaw width ratio|chin height ratio|eye spacing|lower face height)\b/i;
    const isFaceCalculator = /face|facial|jaw|chin|nose|mouth|eye-spacing|lower-face/i.test(location.pathname);
    document.querySelectorAll('label').forEach(label => {
      // Facial pages use their own shorter landmark-specific help markers from site-polish.js.
      if (isFaceCalculator || label.querySelector('.cf-tip-wrap')) return;
      const text = label.textContent.replace(/\s+/g,' ').trim();
      if (!text || /^(gender|sex|height|weight|age|units?|date|name)$/i.test(text) || !specialist.test(text)) return;
      addTip(label, text, hintFor(text, label.control));
    });
    // Specialist metric headings can also get a small help marker; do not add to every button/link.
    document.querySelectorAll('.result h2,.result h3,.result strong,.metric-label,.result-label').forEach(el => {
      const text = (el.textContent || '').replace(/\s+/g,' ').trim();
      if (text && specialist.test(text) && !el.querySelector('.cf-tip-wrap')) addTip(el, text, hintFor(text));
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.cf-tip-wrap')) document.querySelectorAll('.cf-tip-open').forEach(w => {w.classList.remove('cf-tip-open');w.querySelector('button')?.setAttribute('aria-expanded','false')});
    }, {passive:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
