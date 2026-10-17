# ClerFit R3 — Release Progress

Last source revision inspected: `c16ab2692ecf2d36da8771e70302bc9012f74239` (main)

## Current source corrections

The recent main-branch changes harden these legacy calculators against missing inputs, unsupported units, stale outputs and non-finite results, with explicit estimate caveats where appropriate:

- RFM: rejects missing/invalid height and waist before showing a body-fat estimate.
- ABSI: validates supported length units, canonical measurement ranges and finite formula output.
- WHR: validates both circumference measurements and units, clears old output, and does not assign unsupported universal risk labels.
- Adult BMI: validates sex, age, supported units and canonical ranges; ages below 20 receive an age-specific interpretation warning instead of adult BMI classes.
- Fat Mass and Lean Mass: exact lb-to-kg conversion, supported-unit validation and stale-output clearing.
- FFMI: supported-unit conversions, plausibility checks and finite-result guard; no universal category claimed.
- One-Rep Max: validates repetitions, load, units and selected equation; retains the four existing equations and uncertainty caveat.
- BMI Change and BMI Compare: explicit unit checks, canonical-range validation and finite-result guards.
- BSA: validates converted values and supported units before applying the Mosteller equation.
- Goal Timeline and weight gain/loss estimates: validates values/units and explains that static calorie-to-mass models are approximate, not individualized predictions.
- Weight Stability: validates units, weights and duration; notes that water/measurement variation affects scale-weight change.

A new set of targeted regression checks was added to the existing `tests/verify.js`, including known-answer and invalid-input checks across the corrected calculators.

## Verified against exact revisions

### Current `main` at `c16ab2692ecf2d36da8771e70302bc9012f74239`

- **Formula regression checks: PASS** — 71 known-answer/domain assertions; every JavaScript file in `js/`, `scripts/`, and `tests/` passed `node --check`.
  - Run: https://github.com/clerfit/Clerfit/actions/runs/39015644470
- **GitHub Pages build and deployment: PASS**
  - Run: https://github.com/clerfit/Clerfit/actions/runs/39015644387
- The latest 118-route browser smoke and separate production verification have not yet been rerun on this exact test-harness commit. A successful browser smoke and production verifier exist for the immediately preceding calculator-code revision `216cd6fe0d7a115e7873e9fed720dc611af87132`, but that evidence is not substituted for fresh checks on current `main`.
  - Browser smoke: https://github.com/clerfit/Clerfit/actions/runs/39015503437
  - Production verifier: https://github.com/clerfit/Clerfit/actions/runs/39015503440

## Remaining release gates — not complete

- The exact reference `ClerFit_R3_NEW_UI_COMPLETE.zip` is not confirmed accessible in the current working context. Pixel-level, per-page R3 visual parity remains unverified until that exact archive can be inspected.
- The route-level known-answer checks and 238-field static boundary inventory do not equal exhaustive semantic testing of every numeric input and unit combination.
- `SCIENTIFIC_REVIEW_REGISTER.csv` and `INDEPENDENT_FORMULA_REVIEW.md` are code-level desk reviews, not an independent clinician/subject-matter expert certification.
- Complete keyboard-only and assistive-technology walkthroughs, physical phone/tablet testing, throttled performance testing, and production network/security-header inspection remain unverified.
- The contact-form unit test does not establish a new live message was successfully delivered; live Formspree delivery needs a consented end-to-end test.
- BMI Compare has no age/sex input fields. Adult BMI categories are not valid for interpreting minors; this route should be reviewed to avoid displaying adult category labels without enough demographic context.

## Release rule

Do not claim 100% completion until remaining required evidence is collected, failures are fixed, and route, calculator, UI and live-deployment checks have been rerun against the exact release revision.
