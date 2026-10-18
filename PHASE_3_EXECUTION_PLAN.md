# ClerFit Phase 3 — Execution Plan and Current Gate

Baseline: current `main` at `fb2bf43d12f54ec1c01c52086e3a5b30f255a486` (2026-10-18).

## Purpose

Phase 3 is a defect-remediation and release-acceptance phase, not a re-run of Phase 1/2 sign-off. Preserve the verified 118-route behavior and treat Phase 1/2 automated gates as passed on their recorded source revisions. Re-run tests on the exact candidate SHA before release.

## Workstreams

1. **Input-domain integrity (structural gate passed):** a focused CI guardrail now catches malformed/non-finite min/max/step values, duplicate/missing field records, and inventory drift across the 242 static numeric fields. Passing it does not mean the field domains are semantically approved.
2. **Formula-aware review (active, incomplete):** the dynamically generated advanced-calculator field metadata is now audited for explicit finite bounds, labels/units, unique IDs, and valid ratio references. A reproduced unit-selector defect was fixed: generated input min/max constraints now follow the selected display unit. Continue field-by-field formula review in risk order (unit conversions, logarithmic equations, ratios/division, ages/populations, duration/count inputs, and other generated runtime inputs). Record rationale and test minimum, maximum, zero, negative, extreme, and cross-field combinations where applicable. Do not change base-unit bounds without equation and intended-use evidence.
3. **Release evidence (open):** track exact ZIP parity, manual/device accessibility, real contact delivery, exact PageSpeed URL reproduction, weak-network/performance and production headers, independent expert review, and exact-SHA release verification in `PHASE_3_EXECUTION_REGISTER.csv`.
4. **Fix policy:** only alter runtime code when a reproducible defect and expected behavior are established. Add a regression test with each runtime fix. Avoid blanket changes to calculators or input limits.

## Completed engineering workstreams

- Added `tests/phase-three-boundary-structure.test.js` and `.github/workflows/phase-three-boundary-guardrail.yml`. The test checks all 242 current static numeric fields for finite bounds, min less than max, valid step, duplicate keys, exact cross-inventory coverage and matching values.
- Added `tests/phase-three-runtime-fields.test.js` to audit generated advanced-calculator fields, semantic-bound metadata and ratio references.
- Added `tests/phase-three-semantic-boundaries.test.js` to execute the real generated-field validator and verify rejection just below and above every declared numeric field range. The Phase 3 guardrail and full Phase 1/2 CI passed on PR #11 before merge.
- A separate ratio precision defect was reproduced and fixed in PR #12: unsafe decimal scaling no longer produces a false `0 : 1` simplified ratio, and significant-digit output preserves very small non-zero ratios. Formula regression and full browser/accessibility CI passed on the candidate SHA; exact post-merge main verification is running.
- Fixed generated unit-aware native input constraints in `js/advanced-calculators.js`; `tests/phase-three-generated-unit-bounds.test.js` protects conversions across supported display units.
- Focused guardrail and formula regression workflows passed. Full Phase 1/2 CI, including 118-route browser smoke and all-page axe scan, passed on the PR candidate SHA before merge. Main-branch verification/deployment for the latest merge SHA must be checked separately.

These are structural and regression gates; they do not certify that every selected range is scientifically appropriate.

## Exit criteria

- All reproducible code defects fixed with regression tests.
- Formula/domain tests, all-route browser smoke, staging parity and accessibility automation pass on exact candidate SHA.
- Every static and generated numeric field has a reasoned semantic-domain record or an explicitly justified exception.
- Owner/expert gates in the register are evidenced, not inferred from CI.
- Deployment and live production verification refer to the exact release SHA.
