# ClerFit R3 — Release Progress

Current verification basis: latest completed full Phase 1/2 gate `39061691909` on `481fe233daf5ff8c3110419cdd974b379b4672b2`; subsequent commits are report-only updates to audit/sign-off documents, not calculator runtime code or tests.

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

1. **Semantic input-boundary audit:** the current inventory covers 242 numeric fields, but only the specific cases above have dedicated semantic regression assertions. Each remaining field needs formula-aware min/max, zero, negative, extreme, unit-conversion and cross-field checks where applicable. HTML attributes alone are not proof of semantic validity.
2. **Exact design parity:** `ClerFit_R3_NEW_UI_COMPLETE.zip` is not present in the repository tree or current verified workspace. Exact page-by-page comparison against that reference archive is therefore not yet possible.
3. **Scientific/formula review:** the current known-answer tests and code-level review are not independent external clinical or subject-matter expert certification. Population-specific equations and labels need authoritative source review where applicable.
4. **Accessibility and real devices:** full keyboard-only and screen-reader walkthroughs, and physical phone/tablet checks, remain unverified. Automated mobile viewport checks do not replace physical-device testing.
5. **Contact delivery:** the existing contact-form test mocks handler behavior. A consented end-to-end Formspree submission and confirmation of actual delivery are still required.
6. **Production hardening:** weak-network behavior, external resource failure handling, and production security/header checks need a documented independent pass.

## Next work sequence

1. Continue formula-aware semantic boundary coverage from the 242-field inventory, prioritizing inputs whose HTML limits permit zero/extreme values or whose units can silently mismatch.
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

These are concrete source and QA-harness changes, not a claim that all final gates have already passed. CI for the newest exact main SHA must finish and all failed tests must be repaired; full semantic-boundary rationale across 242 static fields and generated inputs, physical-device and manual screen-reader acceptance, exact deployed-source parity, and real contact delivery remain unclosed until their evidence is recorded.


## Final Phase 1 / Phase 2 verification snapshot — 2026-10-17

**Historical verified main SHA at this snapshot:** `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`  
**Production release marker:** `R3-2026-10-17-phase12-a11y-v1`

### Green current-source evidence

- [Full Phase 1/2 CI workflow](https://github.com/clerfit/Clerfit/actions/runs/39051218959): **PASS**. Every step completed successfully, including syntax, known-answer/domain regressions, phase register integrity, input-validation accessibility test, all eight page-specific calculator test files, mocked contact form, unit-conversion property tests, sitemap, production staging build and parity, 118-route browser interaction/semantic-boundary smoke, and all-page axe accessibility audit.
- [Live 118-route calculator interaction smoke](https://github.com/clerfit/Clerfit/actions/runs/39051218947): **PASS**.
- [Live production verifier](https://github.com/clerfit/Clerfit/actions/runs/39051218943): **PASS**, release marker matched; 118 calculators, 123 sitemap pages, 123 fetched HTML pages and 158 same-site references checked, zero failures.
- [GitHub Pages build/deployment](https://github.com/clerfit/Clerfit/actions/runs/39051219223): **PASS**.
- The final axe artifact reports 124 user-facing HTML documents scanned and zero scan/accessibility failures. It also validates 118 registered routes, registry-to-file consistency and unique sitemap entries.
- Formula/regression evidence includes 100 known-answer/domain assertions plus the per-input accessibility regression and page-specific suites: BMI 10, Body Fat 11, BSA 11, Fat Mass 11, FFMI 13, Lean Mass 12, WHR 11 and WHtR 8.

### Final disposition

- **Phase 1 audit and automated source-level gate: PASS / completed.** Route inventory, prioritized findings, route sign-off baseline, static HTML/source review and fresh current-HEAD CI evidence are recorded.
- **Phase 2 calculator implementation and automated gate: PASS / completed.** The 118-route build, eight focused calculator remediations/tests, staging parity, full-route browser interactions and 124-page automated accessibility run all pass on the verified source SHA.
- **Not mislabeled as complete:** all 242 static numeric fields have structural bounds recorded, but the domain-specific rationale and zero/negative/extreme/cross-field boundary tests are not exhaustive for every field and runtime-generated control. Manual keyboard/screen-reader and physical phone/tablet acceptance, real consented contact-form receipt, expert domain review where relevant, performance under weak networks, and exact byte-level comparison with the inaccessible newest `ClerFit_R3_NEW_UI_COMPLETE.zip` remain owner/expert checks. GitHub Pages also does not apply Netlify custom response headers automatically.

This snapshot supersedes earlier entries in this log that said a fresh browser run, exact-source CI result or production parity had not yet been confirmed. Those gates have now passed on the SHA shown above; the listed manual/external obligations remain open by evidence, not by lack of an automated run.


## Final disposition — 2026-10-18 (latest)

**Phase 1 audit work and Phase 2 calculator engineering / automated verification are complete.** The latest completed full workflow [39061691909](https://github.com/clerfit/Clerfit/actions/runs/39061691909) passed on `481fe233daf5ff8c3110419cdd974b379b4672b2`. It covered source syntax and calculator regressions, validation accessibility, consistency of the current 242-field inventories with source markup, all eight targeted page suites, contact form mocked tests, unit conversion, sitemap/build/staging parity, the 118-route browser interaction/semantic-boundary run, and the 124-page axe scan. The follow-on changes in the release log and final report are documentation-only; the calculator source and tests were not changed.

**Production checks that have passed:** a live verifier reported 118 registered calculators, 123 sitemap pages, 123 HTML pages fetched and 158 same-site references checked, with zero failures; the repeat live 118-route smoke test also passed. GitHub Pages deployment succeeded for the latest documentation revision.

**Overall owner/expert release acceptance is still OPEN** because several non-automatable or unavailable-evidence items cannot honestly be self-certified: (1) the exact `ClerFit_R3_NEW_UI_COMPLETE.zip` was not available, so byte/page-level parity cannot be proven; (2) complete formula-aware domain boundary rationale for all 242 static inputs and runtime-generated fields is not done; (3) manual keyboard/screen-reader and physical-device acceptance has not been performed; (4) a real consented contact submission and inbox receipt are unconfirmed; (5) the exact PageSpeed URL reported as 404 was not supplied, although the registered sitemap and links pass; (6) fresh throttled-network performance and actual host response-header checks remain open; and (7) independent subject-matter review is not represented as clinical certification. GitHub Pages does not automatically apply Netlify `_headers`.

**Phase 3 readiness:** the engineering and automated gates for Phases 1 and 2 have passed, and Phase 3 work can begin with these release-acceptance items carried forward as explicit risks/tasks. Do not describe ClerFit as fully owner/expert-certified until those evidence-based gates are closed.
