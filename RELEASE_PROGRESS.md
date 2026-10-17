# ClerFit R3 — Release Progress

Current released source checkpoint: `b18da1aa6a39df4a1e92f514624887518830bba4` (main)

## Implemented and deployed corrections

The recent direct commits harden a set of legacy calculators against missing/invalid inputs, unsupported unit selections, stale results and non-finite outputs. Explicit changes include RFM, ABSI, WHR, BMI, Fat Mass, Lean Mass, FFMI, One-Rep Max, BMI Change, BMI Compare, BSA, Goal Timeline, Weight Gain Rate, Weight Loss Rate and Weight Stability.

Corrections preserve the relevant equations where sound, explicitly normalize the input unit first, apply domain bounds where justified, clear previous outputs after invalid submissions, and guard finite result values. Weight-change outputs are described as static estimates rather than personalized predictions. BMI-for-age / pediatric interpretation is not replaced by adult categories. BMI Compare now provides numeric comparisons only because the page does not collect age or sex.

The existing `tests/verify.js` was extended to execute the actual inline calculation functions for these corrected pages. The harness was fixed and the new run passed.

## Verified exact-SHA evidence

### Calculator source checkpoint `b18da1aa6a39df4a1e92f514624887518830bba4`

- **GitHub Pages deployment: PASS** — build, deploy and report-build-status completed successfully.
  - https://github.com/clerfit/Clerfit/actions/runs/39015714444
- **Production verifier: PASS** — published calculator pages and same-site assets passed the repository's verifier.
  - https://github.com/clerfit/Clerfit/actions/runs/39015714515
- **118-route browser smoke: PASS** — the mobile calculator-interaction step and report upload completed successfully.
  - https://github.com/clerfit/Clerfit/actions/runs/39015714482
- **Formula regression and JS syntax: PASS** on its parent code checkpoint `c16ab2692ecf2d36da8771e70302bc9012f74239`: 71 known-answer/domain assertions plus syntax-checks of `js/*.js`, `scripts/*.js`, and `tests/*.js`.
  - https://github.com/clerfit/Clerfit/actions/runs/39015644470
- Note: the formula test run was on the parent code checkpoint, before the narrow BMI Compare category-display correction. The current `b18da1a` browser smoke and production verifier are green; rerun the formula workflow on this exact SHA before claiming exact-SHA formula-regression parity.

## Remaining gates — not complete

- The exact requested reference archive `ClerFit_R3_NEW_UI_COMPLETE.zip` is not confirmed accessible in the current working context. Page-by-page exact R3 visual parity cannot be certified without inspecting that file.
- The 118-route smoke and one or several known-answer vectors per calculator do not mean every valid/invalid input combination is exhaustively tested. The 238-field boundary inventory includes structural `min/max/step` values, not a complete semantic-range certification.
- `SCIENTIFIC_REVIEW_REGISTER.csv` and `INDEPENDENT_FORMULA_REVIEW.md` document a code-level desk review; no independent clinician or subject-matter expert certification is claimed.
- Complete keyboard-only and screen-reader walkthroughs, real phone/tablet use, weak-network performance checks, and production response/header/security inspection remain unverified.
- The contact-form unit test mocks handler behavior. Fresh real Formspree delivery still needs an owner-consented end-to-end submission and delivery confirmation.

## Next release gates

1. Run formula/domain regression workflow at exact current SHA `b18da1aa6a39df4a1e92f514624887518830bba4`.
2. Complete the semantic lower/upper/invalid/extreme unit-aware review of all calculator input fields.
3. Inspect and compare exact R3 ZIP page-by-page, including Home/Contact location and responsive layout.
4. Complete the external/real-device checks or leave them explicitly owner/expert-gated.

## Release rule

Do not claim 100% while any material defect or required verification remains unresolved. Route loading and successful deployment are not proof of formula validity, exact design parity, or real-world service delivery.
