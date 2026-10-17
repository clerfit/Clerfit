# ClerFit R3 — Release Progress

Current main source: `d9c2facb39a34dd5b75de9a13ded287db31bb421`

## Corrections delivered

Recent commits have hardened the following calculators against missing/invalid values, unsupported unit selectors, stale outputs, and non-finite calculations: RFM, ABSI, WHR, BMI, Fat Mass, Lean Mass, FFMI, One-Rep Max, BMI Change, BMI Compare, BSA, Goal Timeline, Weight Gain Rate, Weight Loss Rate, and Weight Stability.

The changes preserve established equations where supported, explicitly normalize supported units, check plausible post-conversion ranges where defined, clear stale outputs before validation, and guard non-finite results. Calorie-to-weight estimates are labelled as approximations, not personalized predictions. BMI Compare now emits numeric comparisons only and does not assign categories without age/sex context.

Regression infrastructure was strengthened:
- `tests/verify.js` now executes the actual inline calculator functions for the corrected legacy pages and contains a regression assertion against adult category labels in BMI Compare.
- `scripts/browser-smoke.js` now separately tests BMI semantic boundaries in a real browser: zero weight, old minimum HTML weight, old minimum HTML height, extreme weight, and a realistic valid adult case. This is separate from the generic finite-output min/max audit.

## Exact-SHA results

### Main `d9c2facb39a34dd5b75de9a13ded287db31bb421`

- **Formula/domain regression: PASS** — 71 known-answer/domain assertions; project JavaScript syntax checks passed.
  - https://github.com/clerfit/Clerfit/actions/runs/39016112892
- **GitHub Pages build and deployment: PASS**
  - https://github.com/clerfit/Clerfit/actions/runs/39016112063

### Browser smoke on parent source `4fb5ed6f9c60f46f95509724a2281afe3be188ad`

- **118-route browser smoke: PASS** — all 118 registered routes loaded; all 118 primary actions clicked; zero reported mobile overflow, page errors, or console errors; seven targeted unit tests and the new five-case BMI semantic-boundary stage passed.
  - https://github.com/clerfit/Clerfit/actions/runs/39016015305
- Pages deployment for that revision: PASS
  - https://github.com/clerfit/Clerfit/actions/runs/39016015389

The current `d9c2fac` commit changes the BMI Compare regression assertion and has passed formula regression and deployment. The browser smoke passed on `4fb5ed6`, whose site calculator behavior is the same except for the additional test-only assertion in `tests/verify.js`; the browser workflow has not been rerun after this test-only commit. Do not treat parent browser evidence as a separate rerun of the exact current SHA.

## Remaining gates — not complete

- The exact requested reference archive `ClerFit_R3_NEW_UI_COMPLETE.zip` is not confirmed available in the current working context or repository tree. Exact page-by-page UI replication remains unverified until the archive can be inspected.
- The 238-field boundary inventory declares HTML `min/max/step` constraints but does not prove complete semantic ranges. The generic boundary audit is historical and its extreme BMI outputs predate the updated BMI handler. Semantic testing must continue for all applicable fields and units across all calculators, not only BMI.
- `SCIENTIFIC_REVIEW_REGISTER.csv` and `INDEPENDENT_FORMULA_REVIEW.md` are code-level desk reviews, not external clinician/subject-matter expert certification.
- Full keyboard-only and screen-reader walkthroughs, physical phone/tablet checks, weak-network performance testing, and production network/security-header inspection remain unverified.
- The contact-form test mocks handler behavior; fresh real Formspree message delivery needs a consented end-to-end submission and delivery confirmation.

## Next steps

1. Continue semantic range/invalid/extreme/unit-boundary tests over the 238-input inventory and add route-specific regression checks.
2. Inspect the exact R3 ZIP and compare the homepage and all calculator pages visually; verify Home/Contact placement and responsiveness against the reference.
3. Complete owner/expert-gated real-device, accessibility, contact delivery, and production-header checks.
4. Rerun all applicable checks after further calculator changes and record the exact release revision.

## Release rule

Do not claim 100% completion while material issues or required verification remain open. Route loading, passing formula vectors, and successful deployment do not establish exhaustive formula correctness, exact design parity, or real-world service delivery.
