# ClerFit R3 — Release acceptance status (25 November 2026)

## Candidate and decision

- Repository: `clerfit/Clerfit`
- Candidate branch: `qa/phase12-water-units-and-full-acceptance-2026-11-25`
- Source candidate tested by all automated release workflows: `9b73a9171b01a6e7173a15b49d68c417a2eef265`
- PR: [#112 — Verify final Phase 1/2 water-unit fix and release gates](https://github.com/clerfit/Clerfit/pull/112)
- Phase 1/2 evidence bundle: [download the verification artifact](https://github.com/clerfit/Clerfit/actions/runs/45646789207/artifacts/15038985747)
- Production was not intentionally deployed or modified.

**Automated software acceptance: PASS on the exact candidate SHA. Production release certification: NOT YET COMPLETE.** Human/external review and host-specific production verification are not represented as passed.

## Exact-SHA automated evidence

All four release workflows below completed successfully against `9b73a9171b01a6e7173a15b49d68c417a2eef265`.

| Gate | Run | Result |
|---|---|---|
| Phase 1 + Phase 2 full verification | [Run 939](https://github.com/clerfit/Clerfit/actions/runs/45646789207) | PASS |
| Formula regression and JavaScript syntax | [Run 864](https://github.com/clerfit/Clerfit/actions/runs/45646789222) | PASS |
| Phase 3 boundary guardrail | [Run 516](https://github.com/clerfit/Clerfit/actions/runs/45646789513) | PASS |
| Phase 6 release candidate package | [Run 336](https://github.com/clerfit/Clerfit/actions/runs/45646789157) | PASS |

### Phase 1/2 detailed results

| Check | Result |
|---|---|
| Calculator registry and sitemap | PASS — 164 routes |
| Practical guide coverage | PASS — every inventoried calculator |
| Staging build, canonical paths and local assets | PASS |
| All-route browser smoke | PASS — 164/164 routes loaded; 164/164 primary actions clicked; zero page errors, console errors, mobile overflow or failures |
| Targeted unit checks | PASS — 12 targeted checks plus Batch 1–4, body-composition, anthropometric, legacy unit/reset and shared-unit regression suites |
| Responsive matrix | PASS — 164 routes × 4 viewports = 656 checks; zero overflow, clipped controls, missing landmarks, missing language/viewport metadata, page errors or failures |
| Accessibility scan | PASS — 173 user-facing pages scanned; zero axe impact violations; zero critical/serious violations; zero page errors or failures |
| Mocked contact-form success/failure | PASS — mocked behavior only; not a live delivery test |
| Unit-conversion properties | PASS |
| Static field-bound CSV consistency | PASS — source-matched bounds for all 298 static numeric inputs |

### Runtime numeric-field audit — closes the static inventory gap

The browser run now inventories numeric controls after each calculator's runtime form has been generated. The artifact contains `numeric-boundary-browser-audit.json`.

- 164 registered calculator routes were loaded and exercised.
- 160 routes exposed numeric inputs; the other four (sleep-timing, recovery-time, average and age) use non-numeric controls.
- 404 runtime numeric fields were captured across those 160 routes.
- 404/404 have unique IDs and associated labels or aria-labels.
- 404/404 have min, max and step attributes.
- 0 missing IDs, 0 missing accessible names, 0 missing bounds, 0 invalid bounds and 0 duplicate field IDs.
- 96 fields explicitly expose a `data-unit-for` unit-selector association; other unit relationships use the shared unit map and are covered by targeted unit tests.

These checks are now enforced as CI failures, not merely reported. This closes the earlier gap where the static CSV did not include generated/shared forms. Structural bounds are now inventoried for every runtime numeric input. It does **not** mean every semantic edge case or every possible cross-field combination has been exhaustively tested; the targeted formula/boundary suite remains explicitly scoped.

### Browser regression details

The successful browser stage includes:
- 12 targeted unit checks.
- Batch 1, Batch 2, Batch 3 and Batch 4 browser interaction checks.
- 26 body-composition browser cases.
- Remaining anthropometric known-answer, unit-equivalence, reset and stale-result checks.
- ABSI, Heat Exposure and Cold Exposure local-unit equivalence checks.
- Nine shared-unit ratio calculators and four water/bone calculators.
- Legacy reset tests verify that inputs and unit selectors return to their defaults.

The earlier water-unit failure was traced to an over-broad converter-selector regular expression that incorrectly classified `totalUnit` as a standalone `toUnit` control. The selector exclusion now matches only the exact converter IDs `fromUnit` and `toUnit`. The final browser run confirms both intracellular- and extracellular-water selectors work.

## Register and method inventory

- `SCIENTIFIC_REVIEW_REGISTER.csv`: 164 rows for 164 unique calculator routes; each has a recorded code-level desk-review outcome and route regression status.
- `CALCULATOR_VERIFICATION_MATRIX.csv`: 164 rows for 164 unique calculator files.
- `FIELD_VALIDATION_AUDIT.csv`: 298 static numeric-field rows across 116 HTML pages.
- Runtime browser audit: 404 numeric fields across 160 routes, with complete structural identity/label/bounds coverage as detailed above.
- The YMCA body-fat method remains identified as a rough estimate because source lineage and validation samples were not established. The page keeps a short practical measurement caution; it does not claim clinical validation.

## Remaining non-automated / production gates

1. **Independent expert review:** no independent qualified clinician or subject-matter expert has signed the 164-method register. Code-level desk review is not external certification.
2. **Human accessibility acceptance:** the axe report retains 215 review-required checks for human follow-up. These are not axe violations. Manual keyboard-only and screen-reader walkthroughs have not been certified.
3. **Physical-device acceptance:** real phone/tablet checks and device-specific behavior have not been certified by the automated viewport matrix.
4. **Live contact delivery:** mocked Formspree success/failure tests pass; live authorization and inbox delivery have not been re-tested in this run.
5. **Production response headers:** `_headers` and `netlify.toml` do not establish that custom headers are active on GitHub Pages. Capture actual live GET responses for HTML, JS, CSS, images, 404 and redirects, or use a host/proxy that supports the intended headers.
6. **Deployment parity:** no production deployment was performed. The full-release workflow is disabled, and the active production verifier is not a deployer. Confirm Pages source/hosting settings and deployed SHA before any approved publish.

## Release disposition

The current candidate has passed all four automated release workflows on one exact source SHA. The complete 164-route browser, runtime numeric-field inventory, responsive matrix and all-page axe scan are green. It is a verified automated software release candidate.

It is **not honestly certifiable as a fully production-released or independently clinically reviewed product** until the remaining human/external and host-specific gates above are closed. Keep production unchanged until the owner explicitly approves the hosting/deployment action.
