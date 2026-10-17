# ClerFit Phase 3 — Execution Plan and Current Gate

Baseline: current `main` at `fb2bf43d12f54ec1c01c52086e3a5b30f255a486` (2026-10-18).

## Purpose

Phase 3 is a defect-remediation and release-acceptance phase, not a re-run of Phase 1/2 sign-off. Preserve the verified 118-route behavior and treat Phase 1/2 automated gates as passed on their recorded source revisions. Re-run tests on the exact candidate SHA before release.

## Workstreams

1. **Input-domain integrity (active):** distinguish structural HTML bounds from formula-aware semantic validation. Add a small focused CI guardrail to catch malformed/non-finite min/max/step values, duplicate/missing field records, and inventory drift. Passing it does not mean the field domains are semantically approved.
2. **Formula-aware review (active, incomplete):** review fields in risk order (unit conversions, logarithmic equations, ratios/division, ages/populations, duration and count inputs, generated runtime inputs). For each field, record rationale and test minimum, maximum, zero, negative, extreme, and cross-field combinations where applicable. Do not change bounds without equation and intended-use evidence.
3. **Release evidence (open):** track exact ZIP parity, manual/device accessibility, real contact delivery, exact PageSpeed URL reproduction, weak-network/performance and production headers, independent expert review, and exact-SHA release verification in `PHASE_3_EXECUTION_REGISTER.csv`.
4. **Fix policy:** only alter runtime code when a reproducible defect and expected behavior are established. Add a regression test with each runtime fix. Avoid blanket changes to calculators or input limits.

## First implementation

Added `tests/phase-three-boundary-structure.test.js` and `.github/workflows/phase-three-boundary-guardrail.yml`. The test checks all 242 current static numeric fields for finite bounds, min less than max, valid step, duplicate keys, exact cross-inventory coverage and matching values. It explicitly reports that semantic review remains incomplete.

## Exit criteria

- All reproducible code defects fixed with regression tests.
- Formula/domain tests, all-route browser smoke, staging parity and accessibility automation pass on exact candidate SHA.
- Every static and generated numeric field has a reasoned semantic-domain record or an explicitly justified exception.
- Owner/expert gates in the register are evidenced, not inferred from CI.
- Deployment and live production verification refer to the exact release SHA.
