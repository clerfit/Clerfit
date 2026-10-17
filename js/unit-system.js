/* ClerFit per-calculator unit conversion only. No global preference and no browser storage. */
(function () {
  'use strict';
  const ALIASES = {
    kg: ['mass', 1, 0], kilogram: ['mass', 1, 0], kilograms: ['mass', 1, 0],
    lb: ['mass', 0.45359237, 0], lbs: ['mass', 0.45359237, 0], pound: ['mass', 0.45359237, 0], pounds: ['mass', 0.45359237, 0],
    g: ['mass', 0.001, 0], gram: ['mass', 0.001, 0], grams: ['mass', 0.001, 0], oz: ['mass', 0.028349523125, 0], ounce: ['mass', 0.028349523125, 0], ounces: ['mass', 0.028349523125, 0],
    mm: ['length', 0.001, 0], millimeter: ['length', 0.001, 0], millimeters: ['length', 0.001, 0],
    cm: ['length', 0.01, 0], centimeter: ['length', 0.01, 0], centimeters: ['length', 0.01, 0],
    m: ['length', 1, 0], meter: ['length', 1, 0], meters: ['length', 1, 0], metre: ['length', 1, 0], metres: ['length', 1, 0],
    in: ['length', 0.0254, 0], inch: ['length', 0.0254, 0], inches: ['length', 0.0254, 0],
    ft: ['length', 0.3048, 0], foot: ['length', 0.3048, 0], feet: ['length', 0.3048, 0],
    km: ['distance', 1000, 0], kilometer: ['distance', 1000, 0], kilometers: ['distance', 1000, 0], kilometre: ['distance', 1000, 0], kilometres: ['distance', 1000, 0],
    mi: ['distance', 1609.344, 0], mile: ['distance', 1609.344, 0], miles: ['distance', 1609.344, 0],
    ml: ['volume', 0.001, 0], milliliter: ['volume', 0.001, 0], milliliters: ['volume', 0.001, 0],
    l: ['volume', 1, 0], liter: ['volume', 1, 0], liters: ['volume', 1, 0], litre: ['volume', 1, 0], litres: ['volume', 1, 0],
    gal: ['volume', 3.785411784, 0], gallon: ['volume', 3.785411784, 0], gallons: ['volume', 3.785411784, 0],
    kcal: ['energy', 1, 0], kj: ['energy', 0.239005736, 0],
    c: ['temperature', 1, 0], '°c': ['temperature', 1, 0], celsius: ['temperature', 1, 0], f: ['temperature', 5/9, -32*5/9], '°f': ['temperature', 5/9, -32*5/9], fahrenheit: ['temperature', 5/9, -32*5/9],
    'm/s': ['speed', 1, 0], 'km/h': ['speed', 1/3.6, 0], kmh: ['speed', 1/3.6, 0], kph: ['speed', 1/3.6, 0], mph: ['speed', 0.44704, 0],
    ms: ['time', 0.001, 0], millisecond: ['time', 0.001, 0], milliseconds: ['time', 0.001, 0],
    s: ['time', 1, 0], sec: ['time', 1, 0], second: ['time', 1, 0], seconds: ['time', 1, 0],
    min: ['time', 60, 0], minute: ['time', 60, 0], minutes: ['time', 60, 0],
    h: ['time', 3600, 0], hr: ['time', 3600, 0], hour: ['time', 3600, 0], hours: ['time', 3600, 0],
    d: ['time', 86400, 0], day: ['time', 86400, 0], days: ['time', 86400, 0],
    wk: ['time', 604800, 0], week: ['time', 604800, 0], weeks: ['time', 604800, 0],
    min_per_km: ['pace', 1, 0], min_per_mile: ['pace', 1.609344, 0]
  };
  const norm = value => String(value || '').trim().toLowerCase().replace(/[()[\]{}]/g, '').replace(/\s+/g, ' ');
  function unit(value) { return ALIASES[norm(value)] || null; }
  function options(select) { return Array.from(select.options || []).map(o => ({ value: o.value, label: o.textContent || '' })); }
  function classify(select) {
    // The standalone converter owns its dimension/from/to selectors; the global preference must not override them.
    if (select && (/^(?:dimension|from|to)$/i.test(select.id || '') || /^(?:from|to).+unit$/i.test(select.id || ''))) return null;
    const opts = options(select), vals = opts.map(o => norm(o.value));
    if (vals.length < 2) return null;
    const units = vals.map(unit);
    const known = units.filter(Boolean);
    if (known.length < 2) return null;
    const hasDistance = vals.some(v => ['km','kilometer','kilometers','kilometre','kilometres','mi','mile','miles'].includes(v));
    const dims = new Set(known.map(x => x[0]));
    if (dims.size !== 1 && !(hasDistance && [...dims].every(d => d === 'length' || d === 'distance'))) return null;
    let dim = [...dims][0];
    if (hasDistance) dim = 'distance';
    return { dim, opts };
  }
  function canonical(value, from) {
    const a = unit(from); if (!a) return value;
    if (a[0] === 'temperature') return value * a[1] + (norm(from).includes('f') || norm(from)==='f' ? 255.3722222222 : 273.15); // Kelvin canonical
    return value * a[1] + (a[2] || 0);
  }
  function display(value, to) {
    const a = unit(to); if (!a) return value;
    if (a[0] === 'temperature') return (value - (norm(to).includes('f') || norm(to)==='f' ? 255.3722222222 : 273.15)) / a[1];
    return (value - (a[2] || 0)) / a[1];
  }
  function convert(value, from, to) {
    const a = unit(from), b = unit(to);
    if (!a || !b || !Number.isFinite(value)) return NaN;
    const lengthCompatible = ['length','distance'].includes(a[0]) && ['length','distance'].includes(b[0]);
    if (a[0] !== b[0] && !lengthCompatible) return NaN;
    if (a[0] === 'temperature') {
      const kelvin = norm(from).includes('f') || norm(from)==='f' ? (value - 32) * 5/9 + 273.15 : value + 273.15;
      return norm(to).includes('f') || norm(to)==='f' ? (kelvin - 273.15) * 9/5 + 32 : kelvin - 273.15;
    }
    if (a[0] === 'pace') return from === to ? value : (from === 'min_per_km' ? value * 1.609344 : value / 1.609344);
    return display(canonical(value, from), to);
  }
  function findInput(select) {
    let node = select.parentElement;
    for (let depth = 0; node && depth < 6; depth++, node = node.parentElement) {
      const fields = Array.from(node.querySelectorAll('input[type="number"]')).filter(el => !el.disabled);
      if (fields.length === 1) return fields[0];
      if (fields.length > 1) {
        const all = Array.from(node.querySelectorAll('input[type="number"],select'));
        const si = all.indexOf(select);
        const before = all.slice(0, si).filter(el => el.matches('input[type="number"]'));
        if (before.length) return before[before.length - 1];
      }
      if (node.matches('form, main, body')) break;
    }
    return null;
  }
  function convertConstraints(input, from, to) {
    if (!input) return;
    ['min','max'].forEach(attr => {
      const raw = input.getAttribute(attr);
      if (raw == null || raw === '') return;
      const value = Number(raw);
      if (!Number.isFinite(value)) return;
      const converted = convert(value, from, to);
      if (Number.isFinite(converted)) input.setAttribute(attr, String(Number(converted.toFixed(8))));
    });
  }
  function setUnit(select, next, convertValue) {
    const prev = select.value;
    if (prev === next || !Array.from(select.options).some(o => o.value === next)) return;
    const input = findInput(select);
    if (convertValue) convertConstraints(input, prev, next);
    if (convertValue && input && input.value.trim() !== '') {
      const oldValue = Number(input.value), result = convert(oldValue, prev, next);
      if (Number.isFinite(result)) {
        const decimals = Math.max(2, (String(input.step || '').includes('.') ? String(input.step).split('.')[1].length : 0));
        input.value = String(Number(result.toFixed(Math.min(decimals + 2, 8))));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    select.value = next;
    select.dataset.clerfitPreviousUnit = next;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function wireSelect(select) {
    if (!select || !select.matches('select') || !classify(select) || select.dataset.clerfitUnitWired) return;
    select.dataset.clerfitUnitWired = 'true';
    select.dataset.clerfitPreviousUnit = select.value;
    select.addEventListener('change', () => {
      const prev = select.dataset.clerfitPreviousUnit || select.value, next = select.value;
      if (prev !== next) {
        const input = findInput(select);
        convertConstraints(input, prev, next);
        if (input && input.value.trim() !== '') {
          const result = convert(Number(input.value), prev, next);
          if (Number.isFinite(result)) {
            input.value = String(Number(result.toFixed(8)));
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        select.dataset.clerfitPreviousUnit = next;
      }
    }, true);
  }
  function wireTree(node) {
    if (!node) return;
    if (node.matches && node.matches('select')) wireSelect(node);
    if (node.querySelectorAll) node.querySelectorAll('select').forEach(wireSelect);
  }
  function init() {
    wireTree(document);
    // Some advanced calculator forms are created after page load; wire their unit selectors too.
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(wireTree));
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  window.ClerFitUnits = { convert, classify };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
