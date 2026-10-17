/* ClerFit shared strict numeric validation. Local-only, no dependencies. */
(function () {
  'use strict';
  const rules = [
    { re: /(age.?months?|additional.*months?)/, min: 0, max: 11, label: 'Additional age months' },
    { re: /\b(age|years? old|userage)\b/, min: 1, max: 120, label: 'Age' },
    { re: /(weight|mass|bodyweight|body-weight|leanmass|fatmass|load|liftweight)/, min: 0.1, max: 500, label: 'Weight or mass' },
    { re: /(height|stature|facelength|nose.length|chin.height|lower.face.height|forehead|cheekbone|jawline|waist|hip|neck|chest|circumference|stride.length|steplength|distance.*cm)/, min: 0.1, max: 300, label: 'Measurement' },
    { re: /(percent|percentage|ratio.*percent|bodyfat|fatpercent|humidity|completion)/, min: 0, max: 100, label: 'Percentage' },
    { re: /(gender|sex)/, skip: true },
    { re: /(temperature|temp|celsius|fahrenheit)/, min: -100, max: 100, label: 'Temperature' },
    { re: /(calorie|kcal|energy|intake|bmr|tdee|dailyenergy|surplus|deficit)/, min: 0, max: 20000, label: 'Energy or calories' },
    { re: /(heart.?rate|bpm|pulse)/, min: 20, max: 250, label: 'Heart rate' },
    { re: /(sleep|duration|time|minutes?|seconds?|hours?|interval|rest)/, min: 0, max: 100000, label: 'Duration' },
    { re: /(steps?|count|repetitions?|reps|trainingcount|sessions)/, min: 0, max: 1000000, label: 'Count' },
    { re: /(speed|pace|cadence|vo2|max|metabolic|met|score|index|bmi|ffmi|bsa|activitylevel|factor|multiplier)/, min: 0, max: 100000, label: 'Value' },
    { re: /(distance|length|run|walk|cooper|stride|pace|km|mile)/, min: 0, max: 1000000, label: 'Distance or pace' }
  ];
  function fieldText(el) {
    const label = el.labels ? Array.from(el.labels).map(x => x.textContent).join(' ') : '';
    return [el.id, el.name, el.placeholder, el.getAttribute('aria-label'), label].filter(Boolean).join(' ').toLowerCase().replace(/[_-]+/g, ' ');
  }
  function unitFor(el) {
    // Prefer the unit selector belonging to this input. Many legacy pages place
    // a selector directly after its input instead of wrapping each pair in a field.
    const isUnit = select => !!(window.ClerFitUnits && window.ClerFitUnits.classify(select));
    let sibling = el.nextElementSibling;
    while (sibling && !/^(INPUT|BUTTON|TEXTAREA)$/.test(sibling.tagName)) {
      if (sibling.matches && sibling.matches('select') && isUnit(sibling)) return sibling.value.toLowerCase();
      if (sibling.querySelector) {
        const nested = Array.from(sibling.querySelectorAll('select')).find(isUnit);
        if (nested) return nested.value.toLowerCase();
      }
      sibling = sibling.nextElementSibling;
    }
    const field = el.closest('.col, .field, .form-group, .input-group');
    if (field) {
      const local = Array.from(field.querySelectorAll('select')).find(isUnit);
      if (local) return local.value.toLowerCase();
    }
    // In simple legacy layouts, bind the unit dropdown to the closest preceding input.
    const parent = el.parentElement;
    if (parent && parent.children) {
      const children = Array.from(parent.children);
      const index = children.indexOf(el);
      for (let i = index + 1; i < children.length; i++) {
        if (children[i].matches('input[type="number"],button')) break;
        if (children[i].matches('select') && isUnit(children[i])) return children[i].value.toLowerCase();
      }
    }
    return '';
  }
  function bounds(el) {
    // Standalone source/target converters interpret the raw number using two
    // separate selectors. Do not apply a body-weight range or auto-convert it
    // just because its input id contains the word "weight".
    if (isStandaloneConverterInput(el)) {
      const min = el.min !== '' && Number.isFinite(Number(el.min)) ? Number(el.min) : 0;
      const max = el.max !== '' && Number.isFinite(Number(el.max)) ? Number(el.max) : 1e12;
      return { min, max, label: 'Input value' };
    }
    const text = fieldText(el);
    const unit = unitFor(el);
    // The Body Fat calculator has a finite converted domain that differs by
    // field; do not apply generic 1-foot/1-inch minima to neck/circumference inputs.
    const pageName = String((window.location && window.location.pathname) || '').split('/').pop().toLowerCase();
    const waistHeightRanges = {
      waist: { cm: [20, 250], m: [0.2, 2.5], in: [7.87401575, 98.42519685], ft: [0.65616798, 8.20209974] },
      height: { cm: [50, 250], m: [0.5, 2.5], in: [19.68503937, 98.42519685], ft: [1.64041995, 8.20209974] }
    };
    if (pageName === 'wht.html' && waistHeightRanges[el.id] && waistHeightRanges[el.id][unit]) {
      const range = waistHeightRanges[el.id][unit];
      return { min: range[0], max: range[1], label: 'Measurement' };
    }
    const bodyFatRanges = {
      "bf-height": { cm: [100, 250], m: [1, 2.5], inch: [39.3701, 98.4252], ft: [3.2809, 8.2021] },
      "bf-waist": { cm: [20, 250], inch: [7.8741, 98.4252], ft: [0.6562, 8.2021] },
      "bf-neck": { cm: [15, 80], inch: [5.9056, 31.4961], ft: [0.4922, 2.6247] },
      "bf-hip": { cm: [20, 250], inch: [7.8741, 98.4252], ft: [0.6562, 8.2021] }
    };
    const pageRange = bodyFatRanges[el.id] && bodyFatRanges[el.id][unit];
    if (pageRange) {
      return { min: pageRange[0], max: pageRange[1], label: "Measurement" };
    }
    const rule = rules.find(r => r.re.test(text));
    if (rule && rule.skip) return null;
    // Unclassified numeric inputs must defer to their explicit HTML bounds.
    // A zero fallback incorrectly blocked legitimate negative temperatures,
    // signed differences, percentages and generic unit-converter values.
    let min = rule ? rule.min : -1e12;
    let max = rule ? rule.max : 1e12;
    if (/(weight|mass|bodyweight|leanmass|fatmass|load|liftweight)/.test(text)) {
      if (/lb|lbs|pound/.test(unit)) { min = 0.2; max = 1103; } // allows page-specific limits through 500 kg
      else if (/oz/.test(unit)) { min = 1; max = 17600; }
    }
    if (/(height|stature|waist|hip|neck|chest|circumference|facelength|forehead|cheekbone|jawline)/.test(text)) {
      if (/^(m|meter|metre)$/.test(unit)) { min = 0.1; max = 3; }
      else if (/in|inch/.test(unit)) { min = 1; max = 120; }
      else if (/ft|foot|feet/.test(unit)) { min = 1; max = 10; }
      else if (/mm/.test(unit)) { min = 1; max = 3000; }
    }
    if (/(temperature|temp|celsius|fahrenheit)/.test(text)) {
      if (/f|fahrenheit|°f/.test(unit)) { min = -148; max = 212; }
      else { min = -100; max = 100; }
    }
    if (el.min !== '' && Number.isFinite(Number(el.min))) min = Math.max(min, Number(el.min));
    if (el.max !== '' && Number.isFinite(Number(el.max))) max = Math.min(max, Number(el.max));
    return { min, max, label: rule ? rule.label : 'Value' };
  }
  function messageFor(el, reason) {
    const text = fieldText(el);
    const b = bounds(el);
    const label = (el.labels && el.labels[0] && el.labels[0].textContent.trim()) || el.placeholder || el.name || el.id || 'This field';
    if (reason === 'empty') return `${label}: enter a value before calculating.`;
    if (reason === 'number') return `${label}: enter a valid number.`;
    if (reason === 'finite') return `${label}: the value is too large or invalid.`;
    if (b) return `${label}: ${b.label.toLowerCase()} must be between ${b.min} and ${b.max}${/age/.test(text) ? ' years' : ''}. Please check the value and unit.`;
    return `${label}: this value is outside the supported range.`;
  }
  function errorNode(el) {
    let node = el.parentElement && el.parentElement.querySelector(':scope > .clerfit-input-error');
    if (!node) {
      node = document.createElement('small'); node.className = 'clerfit-input-error'; node.setAttribute('role', 'alert');
      if (el.insertAdjacentElement) el.insertAdjacentElement('afterend', node); else el.parentNode.appendChild(node);
    }
    return node;
  }
  function clearError(el) {
    el.removeAttribute('aria-invalid');
    const node = el.parentElement && el.parentElement.querySelector(':scope > .clerfit-input-error');
    if (node) node.remove();
  }
  function validate(el, show) {
    if (!el || el.type !== 'number' || el.disabled || el.readOnly) return true;
    if (el.value.trim() === '') {
      if (el.required) { if (show) errorNode(el).textContent = messageFor(el, 'empty'); el.setAttribute('aria-invalid', 'true'); return false; }
      clearError(el); return true; // Optional fields may remain empty.
    }
    const value = Number(el.value), b = bounds(el);
    let valid = Number.isFinite(value) && !Number.isNaN(value);
    if (!valid) { if (show) errorNode(el).textContent = messageFor(el, 'number'); }
    else if (b && (value < b.min || value > b.max)) { valid = false; if (show) errorNode(el).textContent = messageFor(el, 'range'); }
    else if (el.validity && !el.validity.valid) { valid = false; if (show) errorNode(el).textContent = messageFor(el, 'range'); }
    if (!valid) el.setAttribute('aria-invalid', 'true'); else clearError(el);
    return valid;
  }
  function visibleNumericInputs(scope = document) {
    const root = scope && typeof scope.querySelectorAll === 'function' ? scope : document;
    return Array.from(root.querySelectorAll('input[type="number"]')).filter(el => !el.closest('[hidden]') && el.getClientRects().length > 0);
  }
  function calculatorScope(trigger) {
    if (!trigger) return document;
    if (trigger.form) return trigger.form;
    const parent = trigger.closest('form, [data-calculator], .calculator-card, .cf-calculator-card, .card, main, .main');
    return parent || document;
  }
  function isStandaloneConverterInput(el) {
    if (!el || !/^(?:amount|heightValue|timeValue|distanceValue|weightValue)$/i.test(el.id || '')) return false;
    const panel = el.closest('.card, .calculator-card, .cf-calculator-card, main, .main') || el.parentElement;
    if (!panel) return false;
    const selects = Array.from(panel.querySelectorAll('select'));
    const hasFrom = selects.some(select => /^(?:from|from.*unit)$/i.test(select.id || ''));
    const hasTo = selects.some(select => /^(?:to|to.*unit)$/i.test(select.id || ''));
    return hasFrom && hasTo;
  }
  document.addEventListener('input', e => { if (e.target.matches('input[type="number"]') && e.target.getAttribute('aria-invalid') === 'true') validate(e.target, true); });
  document.addEventListener('blur', e => { if (e.target.matches('input[type="number"]') && e.target.value !== '') validate(e.target, true); }, true);
  document.addEventListener('click', e => {
    const trigger = e.target.closest('button, input[type="button"], input[type="submit"]');
    if (!trigger) return;
    const action = [trigger.getAttribute('onclick'), trigger.id, trigger.textContent].filter(Boolean).join(' ').toLowerCase();
    if (!/(calculat|convert|estimate|check|compare|update|submit)/.test(action)) return;
    let firstInvalid = null;
    const scope = calculatorScope(trigger);
    for (const el of visibleNumericInputs(scope)) if (!validate(el, true) && !firstInvalid) firstInvalid = el;
    if (firstInvalid) {
      e.preventDefault(); e.stopImmediatePropagation();
      firstInvalid.focus({ preventScroll: false });
      firstInvalid.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }
  }, true);
  document.addEventListener('submit', e => {
    let firstInvalid = null;
    const scope = e.target && e.target.matches && e.target.matches('form') ? e.target : calculatorScope(e.target);
    for (const el of visibleNumericInputs(scope)) if (!validate(el, true) && !firstInvalid) firstInvalid = el;
    if (firstInvalid) { e.preventDefault(); firstInvalid.focus(); }
  }, true);
  window.ClerFitValidation = { bounds, validate, fieldText };
})();
