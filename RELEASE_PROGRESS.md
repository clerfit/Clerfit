# ClerFit R3 — Release Progress Update

Current main under active correction: `5f7d3fc9d6ceb15b396d6ce3abdae47551cd034b`

## Implemented corrections on main

- `7dcf8c87` — RFM input validation prevents NaN/Infinity output.
- `82223fba` — ABSI validates inputs, supported length units, plausible canonical measurements, and finite math.
- `37888e3` — WHR validates both measurements and units, clears stale output, and rejects unsupported conversions.
- `44be4a5` — BMI validates age, supported units, plausible converted measurements, and stale result handling; adult categories remain restricted to ages 20+.
- `c95942a` — Fat Mass uses exact pound conversion and validates/clears output.
- `82a2f5e` — Lean Mass uses exact pound conversion, validates/clears output, and rejects unsupported units.
- `4d4093f` — FFMI explicitly validates units, conversion ranges, and calculation results.
- `8bc8970` — One-Rep Max validates repetitions, load units/range, selected equation, and finite output.
- `22c064d` — BMI Change normalizes input units, checks plausible converted measurements and clears stale output.
- `5f7d3fc` — BMI Compare validates both people’s unit/value combinations and guards pediatric interpretation.

## Verified releases (exact SHA only)

- `7dcf8c87`: Pages deployment, production verification, and 118-route browser smoke passed.
  - Pages: https://github.com/clerfit/Clerfit/actions/runs/39014960504
  - Production: https://github.com/clerfit/Clerfit/actions/runs/39014960537
  - Browser smoke: https://github.com/clerfit/Clerfit/actions/runs/39014960531
- `82223fba`: production verifier and 118-route browser smoke passed; Pages run was superseded by the next commit.
  - Production: https://github.com/clerfit/Clerfit/actions/runs/39015089878
  - Browser smoke: https://github.com/clerfit/Clerfit/actions/runs/39015089834
- `37888e3`: Pages deployment, production verifier, and 118-route browser smoke passed.
  - Pages: https://github.com/clerfit/Clerfit/actions/runs/39015117758
  - Production: https://github.com/clerfit/Clerfit/actions/runs/39015118055
  - Browser smoke: https://github.com/clerfit/Clerfit/actions/runs/39015118054
- `82a2f5e`: Pages deployment, production verifier, and 118-route browser smoke passed.
  - Pages: https://github.com/clerfit/Clerfit/actions/runs/39015214739
  - Production: https://github.com/clerfit/Clerfit/actions/runs/39015214447
  - Browser smoke: https://github.com/clerfit/Clerfit/actions/runs/39015214515
- `22c064d`: production verifier passed; Pages/browser checks were superseded when the next commit landed.
  - Production: https://github.com/clerfit/Clerfit/actions/runs/39015300115

## Current-release checks

The newest code revision is `5f7d3fc9d6ceb15b396d6ce3abdae47551cd034b`. Its Pages deployment, production verifier, and browser smoke are queued/pending or in progress; their outcomes are not yet claimed as PASS.

## Remaining gates (not complete)

- The exact reference archive `ClerFit_R3_NEW_UI_COMPLETE.zip` has not been confirmed accessible in this working context; page-by-page visual replication remains unverified.
- Full semantic boundary audit for every field. HTML min/max/step declarations and one known-answer vector per route do not certify every user-input combination.
- Full independent formula-source validation and qualified subject-matter review for calculators where required. Code-level desk reviews do not equal external scientific certification.
- Keyboard-only and screen-reader walkthrough of all controls, physical-device QA, real contact-message delivery, live network/header review and throttled performance checks remain open.
- After the latest changes, rerun the full release suite against the exact current SHA and live site before declaring production completion.

## Release rule

Do not claim 100% completion while any material known defect or required verification remains open. Separate code implementation, route tests, semantic boundary coverage, science review, design parity and deployed-site evidence.
