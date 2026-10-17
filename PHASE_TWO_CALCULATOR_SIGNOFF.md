# ClerFit Phase Two — Calculator Implementation and Verification

**Refreshed:** 2026-10-18  
**Repository:** `clerfit/Clerfit`, branch `main`  
**Latest automated source revision verified:** `3e4676016bd5ef472395a6131f238b524c11e0b5`  
**Latest full Phase 1/2 verification run:** [39058859109](https://github.com/clerfit/Clerfit/actions/runs/39058859109) — **PASS**  
**Decision:** Calculator engineering and automated QA gates pass. Overall release acceptance remains **OPEN** because human/external evidence is still required; this document does not claim clinical certification.

## Implemented and automatically verified

- The calculator registry and sitemap contain 118 unique calculator routes.
- The latest full CI run passed JavaScript syntax checks, calculator known-answer/domain regressions, source-to-inventory consistency, phase-register/sitemap integrity, input-validation accessibility regression, all eight focused calculator suites (BMI, body fat, BSA, fat mass, FFMI, lean mass, WHR and WHtR), mocked contact-form tests, unit-conversion property tests, production-staging parity, 118-route Chromium smoke tests, and axe-core accessibility smoke tests across 124 user-facing HTML pages.
- The 118-route browser smoke verified route loading, primary action/result behavior, semantic boundary cases, no uncaught route errors, and no horizontal overflow at the tested 390px viewport.
- The 242 static numeric inputs are inventoried in `FIELD_VALIDATION_AUDIT.csv` and `INPUT_BOUNDARY_VERIFIED.csv`; the phase-register integrity test confirms the inventories match static markup. These are structural-bound checks, not a complete semantic certification of every possible field value or generated input.
- Targeted fixes and regression tests cover BMI, body-fat percentage, BSA, fat mass, FFMI, lean body mass, WHR and WHtR, shared input validation, accessible error associations, reset behavior, unit handling, navigation, focus visibility, and forced-colors support.
- A separate historical production verification reported 123 sitemap pages and 158 same-site references on implementation snapshot `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`. Do not treat that older production check as proof that the newest source revision is live.

## Remaining release gates (not marked complete)

1. **Exact reference archive parity — BLOCKED:** The available `ClerFit_R3_FINAL_RELEASE(1).zip` has SHA-256 `d6d7cfc2f39b4df5e2d90dcd3f576d6d14308d0ede04bd85657c295aaebd712d`, contains 127 source HTML documents and 118 routes, and its internal audit reports 238 numeric fields. It is not the requested `ClerFit_R3_NEW_UI_COMPLETE.zip`; the current main branch has 242 static numeric inputs. Compare the exact intended archive before declaring parity.
2. **Field-specific domain review — OPEN:** Complete justified minimum/maximum/zero/negative/extreme/cross-field/unit-boundary reasoning and tests for all 242 static numeric inputs and runtime-generated inputs. Structural bounds and selected boundary tests are not sufficient to close this.
3. **Manual accessibility and device acceptance — OPEN:** Human keyboard-only and screen-reader review, contextual link-name/landmark checks, contrast review, and hands-on phone/tablet orientation/zoom testing remain outstanding. Automated axe and 390px viewport checks are useful evidence but do not replace this work.
4. **Real contact delivery — OPEN:** Mocked success/failure/network tests pass. A consented live test submission and confirmation of receipt in the configured destination inbox are not recorded.
5. **Independent subject-matter review — OPEN:** Formula/method desk notes and known-answer vectors are not independent peer review or licensed clinical certification. Keep descriptive/heuristic metrics clearly qualified.
6. **Fresh production verification and PageSpeed 404 — OPEN:** The exact URL reported as 404 was not supplied, and the latest main SHA has not been established by the older production verifier result. Verify the latest deployed revision, legacy aliases and the reported URL when known.
7. **Hosting/performance hardening — OPEN:** Netlify response-header configuration does not automatically apply on GitHub Pages. Verify actual response headers on the chosen host/CDN, and run fresh Lighthouse/throttled weak-network tests.

## Sign-off rule

**Phase Two engineering implementation: PASS. Automated Phase 1/2 gate on SHA `3e4676016bd5ef472395a6131f238b524c11e0b5`: PASS. Overall Phase 1/2 release sign-off: OPEN.** Do not begin Phase Three as if release acceptance is complete until the owner-dependent gates above are either completed with evidence or explicitly accepted as documented limitations.