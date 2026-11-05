# ClerFit R4 Calculator Design System

## Status
- Version: 1.0.0 (foundation stylesheet)
- Branch: `r4/calculator-design-system`
- Scope: new R4 calculator pages only
- R3: untouched; do not add this stylesheet to R3 pages before R4 integration approval.

## Stylesheet
Load `css/r4-calculator-system.css` on a new R4 calculator page after any shared reset. All selectors are scoped under `.cf-r4` to avoid leaking styles into the existing site.

## Component contract
- Page shell: `.cf-r4__page`, `.cf-r4__header`, `.cf-r4__title`, `.cf-r4__description`
- Layout/cards: `.cf-r4__layout`, `.cf-r4__stack`, `.cf-r4__card`
- Fields: `.cf-r4__fields`, `.cf-r4__field`, `.cf-r4__label`, `.cf-r4__hint`
- Per-field units: `.cf-r4__input-with-unit`, `.cf-r4__unit-select`
- Contextual tooltip: button with class `.cf-r4__info` and a concise `data-tooltip` explanation. Use only when the user needs measurement, positioning, posture, equipment or method guidance. Give the button an accessible name and keyboard focus.
- Actions: `.cf-r4__button` with secondary/quiet variants
- Results: `.cf-r4__result`, `.cf-r4__result-value`, `.cf-r4__result-grid`, `.cf-r4__metric`
- Trust and explanation: `.cf-r4__notice`, `.cf-r4__formula`, `.cf-r4__sources`

## Unit policy
Unit selectors belong beside the individual input they convert. No global unit toggle. Each calculator must declare only units compatible with its formula and accepted measurement convention. Convert inputs to a canonical internal unit before calculation; convert displayed values only for presentation. Do not convert dimensionless scores or arbitrary lab values as if they shared a unit.

Supported reusable unit families to assess per calculator:
- Length: mm, cm, m, in, ft
- Mass: mg, g, kg, oz, lb
- Volume: mL, L, US fl oz, US gal (where appropriate)
- Energy: kcal, kJ
- Temperature: °C, °F
- Speed: m/s, km/h, mph
- Distance: m, km, mi
- Time: ms, s, min, h, day, week
- Pressure: mmHg, kPa, bar (where appropriate)
- Concentration: mg/dL, mmol/L, g/L (analyte-specific conversion required)
- Exercise/specialist units: bpm, mL/kg/min, W, W/kg, MET, min/km, min/mi, reps, sets

## Tooltip content standard
Tooltips must explain the action, not merely define a term. Example: "Place the tape horizontally around the abdomen at the midpoint between the lowest palpable rib and the top of the hip bone. Stand relaxed and measure after a normal exhalation." The correct landmark must be checked against the chosen measurement protocol and cited in the calculator's references. Avoid generic or unverified anatomical instructions.

## Accessibility and responsive rules
- Every input needs a persistent visible label; placeholders are not labels.
- Every tooltip trigger must be a real button, keyboard reachable, with an accessible name. Do not rely on hover alone.
- Keep controls at least 44px high where practical.
- Maintain visible focus, error text and programmatic invalid state.
- Layout changes from two columns to one at tablet/mobile widths.
- Respect reduced-motion and forced-colors preferences.
- Tables may scroll horizontally on narrow screens.

## Scientific and release gates
Before a calculator is published:
1. Record formula/model name, source and intended population.
2. Verify dimensions, unit conversions, rounding and boundary conditions.
3. Define valid input ranges and reject impossible or unsafe values.
4. Test normal, minimum, maximum, invalid, blank and edge-case inputs.
5. Explain uncertainty, limitations and non-diagnostic status where relevant.
6. For clinical models, require suitable clinical review and population validation.
7. Test keyboard, screen reader labels, mobile layout and browser console.
8. Keep R4 pages out of the R3 live navigation until acceptance.

## Minimal markup example
```html
<main class="cf-r4">
  <div class="cf-r4__page">
    <header class="cf-r4__header">
      <p class="cf-r4__eyebrow">Body measurements</p>
      <h1 class="cf-r4__title">Example measurement calculator</h1>
      <p class="cf-r4__description">Enter measurements using the units selected beside each field.</p>
    </header>
    <div class="cf-r4__layout">
      <section class="cf-r4__card">
        <div class="cf-r4__field">
          <div class="cf-r4__label-row">
            <label class="cf-r4__label" for="measurement">Waist circumference</label>
            <button class="cf-r4__info" type="button"
              aria-label="How to measure waist circumference"
              data-tooltip="Add the verified measurement protocol for this calculator here."></button>
          </div>
          <div class="cf-r4__input-with-unit">
            <input id="measurement" inputmode="decimal" type="number" min="1" step="any">
            <select class="cf-r4__unit-select" aria-label="Waist measurement unit">
              <option value="cm">cm</option><option value="in">in</option>
            </select>
          </div>
        </div>
      </section>
      <aside class="cf-r4__card cf-r4__result" aria-live="polite">
        <p class="cf-r4__result-label">Calculated result</p>
        <p class="cf-r4__result-value">—</p>
      </aside>
    </div>
  </div>
</main>
```

This is a presentation foundation only. It does not implement calculator formulas, unit conversion logic, tooltip interaction fallback, or clinical validation.
