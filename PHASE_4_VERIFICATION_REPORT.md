# ClerFit Phase 4 Verification Report

Updated: 2026-10-18

## Candidate and merged code

- Tested PR head: `7c5d52aa84cedf6c85cb525b073c3779e4c51fb2`
- First fix-batch merge commit: `b4634e3d082859799a635aa53516b138b8475fe6`
- BMI-for-age boundary-test merge commit: `ea5b9f4ccfe394faee2b14e110d9489ff2d78792`
- Change set: PR #24 — https://github.com/clerfit/Clerfit/pull/24
- This is an engineering regression report, not a claim of independent scientific or clinical validation.

## Automated workflow evidence on the exact PR head

- Formula regression checks: PASS — https://github.com/clerfit/Clerfit/actions/runs/39104833633
- Phase 1/2 verification: PASS — https://github.com/clerfit/Clerfit/actions/runs/39104833491
- The Phase 1/2 job completed JavaScript syntax checks, formula/domain regressions, static field-bound inventory consistency, phase inventory/sign-off/sitemap checks, input-validation accessibility regressions, page-specific regressions, mocked contact-form tests, unit-conversion property tests, sitemap/registry verification, production staging build, staged route/canonical/sitemap/local-asset verification, 118-route interaction/semantic-boundary smoke tests, and all-page axe accessibility smoke tests.
- The formula job completed known-answer/domain regressions, ratio precision and denominator edge cases, field-bound inventory consistency, phase inventory/sitemap checks, accessible input-validation errors, page-specific regressions, inventory artifact upload, and JavaScript syntax checks.
- Both artifacts were created successfully and are available through the linked workflow runs.

## Coverage inventory reconciliation

The current Phase 4 candidate's `CALCULATOR_VERIFICATION_MATRIX.csv` and `SCIENTIFIC_REVIEW_REGISTER.csv` were parsed and compared:

- Matrix: 118 rows, 118 unique route slugs.
- Scientific register: 118 rows, 118 unique route slugs.
- Missing register routes: 0.
- Extra register routes: 0.
- Matrix known-answer/method vectors: 20 direct/shared + 74 route-specific + 24 advanced-engine = 118 routes.
- Scientific register route-regression status: 118/118 report a known-answer or method-specific vector.
- Boundary status: 118/118 explicitly say only declared static min/max/step bounds have been checked and exhaustive semantic boundary combinations are **not** claimed.
- Review status: 118/118 say code-level desk review only; external clinician/subject-matter expert certification is not claimed.

This confirms inventory alignment and the existence of a vector per route. It does **not** prove every vector was independently checked against an authoritative primary source, nor that all domain-specific edge cases are covered.

## Additional risk-prioritized boundary coverage

A second merged Phase 4 batch adds 15 assertions for the CDC BMI-for-age module: exact supported endpoint cases for weight, height and age; just-outside endpoint rejection; zero/negative and non-finite weight/height; invalid age/month values; and unsupported sex selection. The test-only PR head `2ece8e106f0906d62d98f2ccf86bea39f4c32dc8` passed both the formula regression workflow [run 39105223029](https://github.com/clerfit/Clerfit/actions/runs/39105223029) and Phase 1/2 verification [run 39105222954](https://github.com/clerfit/Clerfit/actions/runs/39105222954). The batch was merged as `ea5b9f4ccfe394faee2b14e110d9489ff2d78792`.

## Fixes included in the merged batch

1. Average calculator rejects malformed/non-finite list entries instead of silently omitting them.
2. Percentage calculator validates complete finite numeric inputs and recognized calculation modes, retains zero-denominator checks, and guards non-finite results.
3. Difference calculator reports the percent difference for two zero magnitudes as undefined, rather than a misleading 0.00%, and rejects malformed/non-finite inputs.

Each change has regression coverage in `tests/verify.js`.

## Remaining verification and acceptance gates

- Phase 4 remains **IN PROGRESS**: risk-prioritized, formula-specific semantic boundary vectors and authoritative source traceability still need to be expanded beyond the existing per-route known-answer vectors. The new BMI-for-age assertions improve one high-risk route's software input-domain coverage, but do not certify the CDC reference table or clinical interpretation.
- Post-merge workflow/deployment on the merge SHA has not yet been independently confirmed in this report; the passing runs above are on the exact PR head (same source tree before squash).
- Live deployment/content verification is not established by these CI results alone.
- Phase 3 issue #6 remains OPEN for the exact required reference ZIP, manual keyboard/screen-reader/zoom/contrast and physical-device checks, consented real contact submission and inbox receipt, exact PageSpeed 404 URL reproduction, production security-header/hosting remediation, and independent qualified formula review.
- Mocked contact-form tests are not proof of live delivery. Automated accessibility scans are not a substitute for assistive-technology or physical-device acceptance.
- Do not mark Phase 4 or overall release acceptance complete until its remaining evidence is added and all relevant checks pass on the exact final candidate SHA.


## Additional unit-conversion regression batch

- PR #28 merged: https://github.com/clerfit/Clerfit/pull/28
- Tested PR head: `954572d5d53a9726adb5e041c0b2f29faea17b1e`
- Merge commit: `ff67c9d139a171f1cbddca10f5ffc37f6e9ce886`
- Formula regression: PASS — https://github.com/clerfit/Clerfit/actions/runs/39105516310
- Phase 1/2 verification: PASS — https://github.com/clerfit/Clerfit/actions/runs/39105516304
- The full Phase 1/2 workflow completed JavaScript checks, known-answer/domain regressions, input-bound inventory, sitemap/registry checks, page-specific tests, mocked contact tests, unit-conversion property tests, staging build/parity, 118-route interaction/semantic-boundary smoke tests, and all-page axe accessibility smoke tests.
- Added 12 unit-conversion assertions for distance, volume, temperature, speed, pace, round trips, unknown units, and non-finite input rejection. Existing property tests already cover additional conversions; this batch expands coverage in the primary calculator regression suite.
- These workflows passed on the exact PR head before squash. Post-merge verification and live production confirmation on the merge SHA remain to be recorded.

## Current disposition

Phase 4 remains **IN PROGRESS**. The regression batches improve software behavior and coverage, but do not finish formula-by-formula authoritative-source traceability or exhaustive semantic boundary rationale across all routes and 238 static fields/runtime-generated controls. Phase 3 external acceptance gates remain open in issue #6. No independent scientific/clinical review or full release acceptance is claimed.


## Additional logarithmic-equation regression batch

- PR #29 merged: https://github.com/clerfit/Clerfit/pull/29
- Tested revision: `9b6d0926d225c660f1e3ca0005d8f1c72da0d1e0`
- Merge commit: `2e810ff64db327510f2af7c53d3fe023d247f74e`
- Formula regression: PASS — https://github.com/clerfit/Clerfit/actions/runs/39105766265
- Phase 1/2 verification: PASS — https://github.com/clerfit/Clerfit/actions/runs/39105766258
- Added a female US Navy body-fat known-answer vector and guards for invalid waist/neck ordering and missing female hip measurements. The tests also assert that invalid cases do not produce NaN/Infinity.
- The workflows passed on the exact PR head before squash. The report does not claim those PR-triggered runs are post-merge runs on the merge SHA.

## Phase 4 disposition after latest batch

The current focused engineering batch is merged and its formula and Phase 1/2 workflows passed. **Phase 4 as a whole is still IN PROGRESS**, because its original exit criteria require expanded authoritative-source traceability and semantic-boundary rationale across the route inventory, plus exact final-SHA and production evidence. Independent qualified review and owner-only Phase 3 release acceptance items remain separate gates. No scientific/clinical certification is implied.


## Latest Phase 4 continuation (2026-10-18)

- PR #28 merged unit-conversion domain regressions at `ff67c9d139a171f1cbddca10f5ffc37f6e9ce886`; formula and Phase 1/2 workflows passed on PR head.
- PR #29 merged body-fat logarithmic-domain regressions at `2e810ff64db327510f2af7c53d3fe023d247f74e`; formula and Phase 1/2 workflows passed on PR head: https://github.com/clerfit/Clerfit/actions/runs/39105766265 and https://github.com/clerfit/Clerfit/actions/runs/39105766258.
- PR #30 merged Mosteller BSA known-answer, unit-equivalence, zero-weight and unsupported-unit regressions at `421de95517531dec0af868d9f76c908daa4f22fe`; formula regression passed https://github.com/clerfit/Clerfit/actions/runs/39106108097 and Phase 1/2 verification passed https://github.com/clerfit/Clerfit/actions/runs/39106108077. Both were PR-head checks before squash.
- PR #31 merged `PHASE_4_ROUTE_SOURCE_GAP_REGISTER.csv`, recording the 41 routes that had generic reference placeholders.
- PR #32 is in progress: it replaces those generic references with route-specific mathematical basis/source notes or explicit unresolved source gaps, and updates this plan. Its Phase 1/2 workflow is running; do not merge until it completes successfully.
- PR #33 is in progress: it tests that waist/waist-to-height context calculators do not invent universal risk categories or apply adult cutoffs automatically to teens. Its formula regression passed; its Phase 1/2 workflow is pending.

## Current status

Phase 4 remains **IN PROGRESS** until PR #32 and #33 finish their required CI and the remaining formula/source comparison, semantic-boundary rationale, exact-candidate verification and release evidence are assessed. The route source register is a gap tracker, not a closure certificate. Independent qualified review is not claimed.
