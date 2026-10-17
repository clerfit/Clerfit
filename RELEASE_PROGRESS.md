# ClerFit R3 — Release Progress

Current `main` source: `1869d9e29f6bf73091007ce44a0e40cf62dac442`

## Latest completed work

- Fixed the shared `calculateWHR()` handler in `js/engine.js`. The WHR page loaded that deferred shared engine after defining its inline handler, so the shared handler overwrote the page's stricter validation. The old shared conversion treated unknown units as centimetres, allowing an unsupported selector to calculate a plausible-looking ratio.
- The shared WHR handler now rejects unsupported units, validates positive values and plausible post-conversion circumference ranges (20–250 cm), clears stale output before validation, prevents non-finite results, and retains descriptive screening-only wording without assigning a universal risk category.
- Added a WHR page revision marker and production/browser checks that verify the deployed page is the expected revision.
- Added a Node regression asserting that a supported cm/cm reference case returns WHR 0.85 and an unsupported hip unit is rejected.
- Added 12 route-specific browser boundary checks across ABSI, WHR, BSA, Fat Mass, Lean Mass, FFMI, One-Rep Max, BMI Change, Goal Timeline, Weight Gain Rate, Weight Loss Rate, and Weight Stability.
- Existing semantic BMI checks cover zero weight, the old minimum HTML weight, the old minimum HTML height, an extreme weight, and a realistic adult reference case.
- The expanded browser run confirms every calculator route includes Home and Contact links in the page chrome, in normal document flow near the top-right region, and not as a floating overlay.

## Verification evidence

### Current main: `1869d9e29f6bf73091007ce44a0e40cf62dac442`

- **Formula/domain regression: PASS** — workflow includes the 71 known-answer/domain assertions plus the new WHR unsupported-unit regression; JavaScript syntax checks are part of the workflow.
  - https://github.com/clerfit/Clerfit/actions/runs/39036690613
- **GitHub Pages build/deployment: PASS**
  - https://github.com/clerfit/Clerfit/actions/runs/39036690558

### Browser and production checks on calculator-source parent: `4c74b9302f4babc143551609b6f63a938b630808`

The only subsequent change in `1869d9e` is a test-only regression assertion in `tests/verify.js`; the calculator HTML, JavaScript and browser harness were unchanged between these two revisions.

- **118-route live browser smoke: PASS** — all 118 routes loaded and their primary actions were clicked; zero route/navigation failures, page errors, console errors or mobile overflow.
- **Targeted checks: PASS** — 7 unit-conversion checks, 5 BMI semantic-boundary cases, and 12 calculator-specific boundary/caveat cases. The WHR unsupported-unit case now rejects correctly.
  - https://github.com/clerfit/Clerfit/actions/runs/39036672933
- **Live production verifier: PASS**, including the deployed WHR revision marker and validation-message check.
  - https://github.com/clerfit/Clerfit/actions/runs/39036672887

Earlier failure history is retained in GitHub Actions. The failed WHR check was not waived: it exposed the duplicate shared handler, which was corrected, then verified by the browser and formula suites.

## Remaining gates — still not 100% complete

1. **Semantic input-boundary audit:** the inventory covers 238 numeric fields, but only the specific cases above have dedicated semantic regression assertions. Each remaining field needs formula-aware min/max, zero, negative, extreme, unit-conversion and cross-field checks where applicable. HTML attributes alone are not proof of semantic validity.
2. **Exact design parity:** `ClerFit_R3_NEW_UI_COMPLETE.zip` is not present in the repository tree or current verified workspace. Exact page-by-page comparison against that reference archive is therefore not yet possible.
3. **Scientific/formula review:** the current known-answer tests and code-level review are not independent external clinical or subject-matter expert certification. Population-specific equations and labels need authoritative source review where applicable.
4. **Accessibility and real devices:** full keyboard-only and screen-reader walkthroughs, and physical phone/tablet checks, remain unverified. Automated mobile viewport checks do not replace physical-device testing.
5. **Contact delivery:** the existing contact-form test mocks handler behavior. A consented end-to-end Formspree submission and confirmation of actual delivery are still required.
6. **Production hardening:** weak-network behavior, external resource failure handling, and production security/header checks need a documented independent pass.

## Next work sequence

1. Continue formula-aware semantic boundary coverage from the 238-field inventory, prioritizing inputs whose HTML limits permit zero/extreme values or whose units can silently mismatch.
2. Audit shared-engine/page-level handler overlap so deferred shared scripts cannot override stricter page validation without a regression test.
3. Inspect the exact R3 ZIP when available and compare the homepage and all calculator pages, including responsive layout and Home/Contact placement.
4. Complete owner/expert-gated accessibility, physical-device and real contact-delivery checks.
5. Re-run formula, browser and production verification on the exact final SHA after each source batch.

## Release rule

Do not claim 100% completion while material issues or required verification remain open. A green route smoke, known-answer suite, and Pages deployment establish strong progress but do not prove every formula, every semantic input boundary, exact design parity, or real-world service delivery.


## Follow-up — 2026-10-17, Phase One / Phase Two attempt

Main-branch changes made after the earlier 1869d9 release record:

- Added unique validation-message IDs and aria-describedby links while retaining existing help-text descriptions (commit 95f5689).
- Fixed a sibling-field defect in which a parent-only query could reuse or clear another input's validation message; each input now owns its error node and a valid sibling clears only its own error (commit 3f5dfd).
- Added a Node regression for input error association, existing help preservation, unique IDs, and two invalid sibling inputs sharing one parent; the formula-regression workflow now runs this test (commit 2762de4 wires the test, follow-up test commit eb4ec8e strengthens sibling isolation).
- Corrected documentation that incorrectly described Home/Contact links as floating and unit preferences as globally persistent. Current source states that unit selectors are per-calculator and are not saved as a site-wide preference.
- Refreshed the Phase One audit register and added a Phase Two calculator sign-off register with explicit completed scope and unclosed acceptance gates.

### Fresh verification performed in this attempt

The available R3 final release archive was extracted and checked locally. JavaScript syntax checks, node tests/verify.js, node tests/input-validation-accessibility.test.js, node tests/contact-form.test.js, node tests/unit-conversion-property.test.js, node scripts/generate-sitemap.js --check, the production build, and scripts/verify-staging.js all passed. The staging verifier compared 154 source files with generated output and reported 118 calculator routes, 123 sitemap URLs, and zero source/staging differences beyond expected canonical metadata.

A fresh static audit of all 127 HTML documents in that available archive also passed: every document has a title, exactly one H1, language and viewport metadata; there were no duplicate IDs, unnamed controls, images missing alt attributes, missing local resource paths, or numeric fields without min/max/step. This archive is not identical to the latest GitHub HEAD, so it is not represented as an exact-HEAD test run.

### Current disposition

- **Phase One audit inventory:** consolidated and refreshed; static package evidence is strong.
- **Phase Two calculator inventory/implementation:** 118 routes present with 118/118 route-level known-answer or method vectors recorded in the tested archive; targeted semantic and accessibility fixes added to main.
- **Final release sign-off remains open:** the latest exact-HEAD workflow status could not be confirmed in this attempt; the live homepage response still exposed the previous FAQ copy when rechecked; full semantic boundary review for every numeric field, full keyboard/screen-reader and physical-device acceptance, deep-link parity against the exact final SHA, live contact delivery, and expert validation where warranted remain open. Do not represent these as passed until fresh evidence is recorded.


## Follow-up — 2026-10-17, integrated Phase 1 / Phase 2 work

### Source corrections committed to main

- Restored a reproducible staging build (`scripts/build-site.js`) and staging parity checker (`scripts/verify-staging.js`) referenced by the README and Netlify config but absent from main; added mocked contact-form and unit-conversion property test files that were also previously missing from main.
- Added `scripts/browser-smoke-staging.js`, a staging-targeted copy of the route interaction suite that bypasses live-release marker polling only when `CLERFIT_ALLOW_LOCAL_STAGING=1`; canonical sitemap comparison is explicitly based on `CLERFIT_SITEMAP_BASE` when provided.
- Added `scripts/accessibility-smoke.js` to run axe across staged user-facing HTML pages and collect critical/serious issues, browser errors, load failures and manual-review notes.
- Added `.github/workflows/phase-one-ci.yml` to run source syntax, calculator regressions, accessible validation tests, seven page-specific tests, mocked contact tests, unit conversion tests, sitemap/build/staging checks, 118-route Chromium tests and all-page axe tests. The new workflow is included in the main branch and is designed to provide exact-source evidence; no green result is claimed until GitHub Actions confirms it.
- Updated the BMI, Body Fat Percentage, BSA, Fat Mass, FFMI, Lean Body Mass, WHR and WHtR pages with reset/stale-output/unit-bound handling from the audited remediation source. Added Node regressions for the first seven of these pages.
- Expanded `js/page-chrome.js` to restore a semantic main landmark and add names for otherwise unnamed controls/links on legacy pages. Added keyboard-focus, non-color link distinction, forced-colors and narrow-homepage responsive CSS rules.
- Added `PHASE_1_CALCULATOR_INVENTORY.csv`, `PHASE_1_SIGNOFF_REGISTER.csv`, `PHASE_1_FINDINGS_REGISTER.csv`, and provenance notes. The detailed register explicitly distinguishes prior branch-local evidence from fresh current-main verification.

### Current gate status

These are concrete source and QA-harness changes, not a claim that all final gates have already passed. CI for the newest exact main SHA must finish and all failed tests must be repaired; full semantic-boundary rationale across 238 static fields and generated inputs, physical-device and manual screen-reader acceptance, exact deployed-source parity, and real contact delivery remain unclosed until their evidence is recorded.
