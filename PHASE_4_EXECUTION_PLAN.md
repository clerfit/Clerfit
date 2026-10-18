# ClerFit Phase 4 — Formula Evidence and Validation Coverage

Status: IN PROGRESS — recent regression batches merged and PR-head CI passed; full Phase 4 exit criteria and Phase 3 external acceptance remain OPEN.

Baseline: `main` includes Phase 4 regression merges through `2e810ff64db327510f2af7c53d3fe023d247f74e` (2026-10-18), including the unit-conversion and body-fat logarithmic-domain test batches. Re-run all relevant checks against the exact candidate SHA after source/test changes.

## Why Phase 4 starts before Phase 3 acceptance closes

Phase 3 automated engineering/deployment gates have passed, but release acceptance still depends on external evidence that repository automation cannot manufacture: the exact reference ZIP, manual/device accessibility, a real consented contact submission and inbox confirmation, the precise PageSpeed 404 URL, production hosting/header control, and independent qualified health-formula review. Keep those gates open in issue #6 while continuing safe repository work. Phase 4 does not waive or replace them.

## Phase 4 objective

Reduce formula and input-validation uncertainty across the 118 calculator routes by improving traceable method evidence and reference-derived regression coverage without changing behavior unless a reproducible defect is established.

## Workstreams

1. **Coverage inventory:** reconcile `CALCULATOR_VERIFICATION_MATRIX.csv`, `SCIENTIFIC_REVIEW_REGISTER.csv`, `FORMULA_REFERENCE_AUDIT.md`, and the test suite. Distinguish (a) formula/method documented, (b) primary/authoritative source recorded, (c) known-answer vector, (d) boundary/invalid-input vectors, (e) independent review. Do not equate route smoke with formula verification.
2. **Prioritize risk:** start with health-related estimates, logarithmic equations, unit conversions, denominator-sensitive formulas, age/population-dependent methods, and any metric whose interpretation may influence health decisions. Label non-clinical/descriptive metrics as such; do not invent clinical categories.
3. **Known-answer tests:** for each selected route, add at least one independently computed reference vector and appropriate invalid/boundary vectors (minimum, maximum, zero/negative only where meaningful, invalid denominator, missing values, extreme values, and unit-switch round trips). State assumptions and expected rounding.
4. **Source traceability:** record source URL, equation/method, units, assumptions, applicable population, limitations, and test location in the register. Prefer primary/official sources; ordinary arithmetic may cite the mathematical identity.
5. **Defect-only changes:** change runtime code only for a reproducible mismatch with evidence of intended behavior. Add a regression test with every fix. Avoid broad boundary changes without formula-specific justification.
6. **Exact-SHA verification:** run formula regression, Phase 3 guardrails, 118-route browser/accessibility automation, deployment, and live production checks after candidate changes. Attach run links and SHA to the register/report.

## Acceptance criteria

- Every route is classified honestly by evidence status; no route is marked formula-verified solely because it loads or its button works.
- Each completed route has a documented method, units/assumptions, traceable source or mathematical basis, and known-answer test.
- Meaningful invalid/boundary cases are tested where applicable; unexplained mismatches are fixed with regressions or explicitly tracked.
- All relevant CI checks pass on the exact candidate SHA and production is verified after deployment.
- Independent qualified review is recorded separately and is never implied by internal engineering tests.

## Explicit exclusions / dependencies

- This phase cannot certify scientific/clinical validity or replace a qualified independent reviewer.
- Exact ZIP parity requires the exact `ClerFit_R3_NEW_UI_COMPLETE.zip` bytes.
- Manual assistive-technology and physical-device checks, real contact inbox receipt, exact PageSpeed URL reproduction, and production hosting/header configuration remain owner/external gates in issue #6.
- Do not close Phase 3 or claim complete release acceptance until those gates have evidence.

## First execution batch

1. Read the current scientific review register and formula audit; identify the highest-risk routes lacking a known-answer test or authoritative method evidence.
2. Add source-linked, independently calculated test vectors for a small batch; preserve current behavior unless tests expose a documented defect.
3. Run focused tests plus full formula regression and exact-SHA workflows.
4. Update the relevant register entries with concrete evidence and remaining limitations.


## Latest continuation — risk-prioritized logarithmic-domain tests (2026-10-18)

- Merged PR #29: https://github.com/clerfit/Clerfit/pull/29
- Merge commit: `2e810ff64db327510f2af7c53d3fe023d247f74e`
- Formula regression passed on PR head: https://github.com/clerfit/Clerfit/actions/runs/39105766265
- Phase 1/2 verification passed on PR head: https://github.com/clerfit/Clerfit/actions/runs/39105766258
- Added a female US Navy body-fat known-answer vector and invalid-domain cases for waist/neck ordering and required hip input.
- These are software regression results, not independent validation of the underlying empirical equation. Phase 4 remains open for route-wide source traceability, semantic-boundary rationale, exact-candidate deployment evidence, and the independently qualified review required for health-related interpretation.
