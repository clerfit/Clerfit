# ClerFit R3 — Release acceptance status (25 November 2026)

## Candidate and decision

- Repository: `clerfit/Clerfit`
- Candidate branch: `qa/phase12-water-units-and-full-acceptance-2026-11-25`
- Source candidate tested: `64541b272527255d8a9a62c063a8c4397808912c`
- PR: [#112 — Verify final Phase 1/2 water-unit fix and release gates](https://github.com/clerfit/Clerfit/pull/112)
- Production was not intentionally deployed or modified.

**Automated software acceptance: PASS on the candidate SHA. Production release certification: NOT YET COMPLETE.** Human/external review and host-specific production verification are not represented as passed.

## Exact-head automated evidence

| Gate | Run / evidence | Result |
|---|---|---|
| Phase 1 + Phase 2 full verification | [Run 933](https://github.com/clerfit/Clerfit/actions/runs/45644138470) | PASS |
| Formula regression and JS syntax | [Run 858](https://github.com/clerfit/Clerfit/actions/runs/45644138273) | PASS |
| Phase 6 release candidate package | [Run 330](https://github.com/clerfit/Clerfit/actions/runs/45644137888) | PASS |
| Phase 3 boundary guardrail | [Run 509](https://github.com/clerfit/Clerfit/actions/runs/45643560571) on the immediately preceding source candidate; subsequent change was the Cold Exposure guide text only | PASS; no formula/boundary code changed afterward |
| Calculator registry and sitemap | Phase 1/2 run 933, step 20 | PASS |
| Practical guide coverage | Phase 1/2 run 933, step 21 | PASS |
| Staging build and canonical/local-asset verification | Phase 1/2 run 933, steps 22–23 | PASS |
| All-route browser interaction | Phase 1/2 run 933, step 25 | PASS: 164/164 routes loaded; 164/164 primary actions clicked; zero page errors, console errors, mobile overflow or failures |
| Responsive matrix | Phase 1/2 run 933, step 26 | PASS: 164 routes × 4 viewports = 656 checks; zero overflow, clipped controls, missing landmarks, missing language or viewport metadata, page errors or failures |
| Accessibility scan | Phase 1/2 run 933, step 27 | PASS: 173 user-facing pages scanned; zero axe impact violations; zero critical/serious violations; zero page errors or failures |
| Mocked contact-form success/failure | Phase 1/2 run 933, step 18 | PASS (mocked behavior only; not a live delivery test) |
| Unit conversion property tests | Phase 1/2 run 933, step 19 | PASS |
| Calculator guide coverage | Phase 1/2 run 933, step 21 | PASS |

The accessibility report also records 215 `reviewRequiredChecks`. These are checks flagged for human review, not 215 axe violations. They remain visible for manual follow-up.

### Browser regression detail

The successful browser stage includes:
- 12 targeted unit checks.
- Batch 1, Batch 2, Batch 3 and Batch 4 browser interaction checks.
- 26 body-composition browser cases.
- Remaining anthropometric known-answer, unit-equivalence, reset and stale-result checks.
- ABSI, Heat Exposure and Cold Exposure local-unit equivalence checks.
- Nine shared-unit ratio calculators and four water/bone calculators.
- Legacy reset tests verify that input fields and unit selectors return to their defaults.

The earlier `totalUnit` failure was traced to an over-broad converter-selector regular expression that incorrectly classified `totalUnit` as a standalone `toUnit` control. The selector exclusion now matches only the exact converter IDs `fromUnit` and `toUnit`. The final browser run confirms both intracellular- and extracellular-water selectors work.

## Register and method inventory

- `SCIENTIFIC_REVIEW_REGISTER.csv`: 164 rows for 164 unique calculator routes; each has a recorded code-level desk-review outcome and route regression status.
- `CALCULATOR_VERIFICATION_MATRIX.csv`: 164 rows for 164 unique calculator files.
- `FIELD_VALIDATION_AUDIT.csv`: 298 static numeric-field rows across 116 HTML pages; 288 rows report source-matched structural bounds and 10 report a handler range. The audit explicitly does not claim exhaustive semantic edge-case verification.
- 48 calculator routes are not represented in the static numeric-field CSV. Many use advanced/shared generated forms; the all-route browser run exercises them, but this static inventory gap must not be described as a complete field-by-field semantic audit.
- The YMCA body-fat method remains identified in the register as a rough estimate because source lineage and validation samples were not established. The page keeps a short practical measurement caution; it does not claim clinical validation.

## Remaining non-automated / production gates

1. **Independent expert review:** no independent qualified clinician or subject-matter expert has signed the 164-method register. Code-level desk review is not external certification.
2. **Human accessibility acceptance:** the 215 review-required checks need a documented human review where relevant; automated axe results do not replace keyboard-only and screen-reader walkthroughs.
3. **Physical-device acceptance:** real phone/tablet checks, zoom/reflow and device-specific behavior have not been certified by the automated viewport matrix.
4. **Live contact delivery:** mocked Formspree success/failure tests pass; live authorization and inbox delivery have not been re-tested in this run.
5. **Production response headers:** `_headers` and `netlify.toml` do not establish that custom headers are active on GitHub Pages. Capture actual live GET responses for HTML, JS, CSS, images, 404 and redirects, or use a host/proxy that supports the intended headers.
6. **Deployment parity:** no production deployment was performed. The full-release workflow is disabled, and the active production verifier is not a deployer. Confirm Pages source/hosting settings and deployed SHA before any approved publish.

## Release disposition

The current candidate has passed the automated software gates, including the previously failing browser checks, all-route responsive coverage and all-page axe scan. It is a verified release candidate.

It is **not honestly certifiable as a fully production-released or independently clinically reviewed product** until the remaining human/external and host-specific gates above are closed. Keep production unchanged until the owner explicitly approves the hosting/deployment action.
