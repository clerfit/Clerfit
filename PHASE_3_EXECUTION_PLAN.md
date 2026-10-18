# ClerFit Phase 3 — Execution Plan and Current Gate

Baseline: verified release candidate `main` at `19ad5a62dca7d786f23e3de282af66dea9ccc900` (2026-10-18).

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
- A separate ratio precision defect was reproduced and fixed in PR #12: unsafe decimal scaling no longer produces a false `0 : 1` simplified ratio, and significant-digit output preserves very small non-zero ratios. Exact post-merge main verification passed on SHA `19ad5a62dca7d786f23e3de282af66dea9ccc900`.
- Fixed generated unit-aware native input constraints in `js/advanced-calculators.js`; `tests/phase-three-generated-unit-bounds.test.js` protects conversions across supported display units.
- Exact-main-SHA verification passed on `19ad5a62dca7d786f23e3de282af66dea9ccc900`: Phase 3 boundary/layout guardrail run [39101391171](https://github.com/clerfit/Clerfit/actions/runs/39101391171), formula regression run [39101391206](https://github.com/clerfit/Clerfit/actions/runs/39101391206), Phase 1/2 verification including 118-route interaction smoke and all-page axe accessibility scan [39101391162](https://github.com/clerfit/Clerfit/actions/runs/39101391162), live calculator browser smoke [39101391155](https://github.com/clerfit/Clerfit/actions/runs/39101391155), Pages deployment [39101390905](https://github.com/clerfit/Clerfit/actions/runs/39101390905), and live production verifier [39101391255](https://github.com/clerfit/Clerfit/actions/runs/39101391255).

These are structural and regression gates; they do not certify that every selected range is scientifically appropriate.

## Exit criteria

- All reproducible code defects fixed with regression tests.
- Formula/domain tests, all-route browser smoke, staging parity and accessibility automation pass on exact candidate SHA.
- Every static and generated numeric field has a reasoned semantic-domain record or an explicitly justified exception.
- Owner/expert gates in the register are evidenced, not inferred from CI.
- Deployment and live production verification refer to the exact release SHA.


## Latest continuation — shared layout and footer remediation (2026-10-18)

- Merged the mobile UI/BMI-for-age correction PR after its formula-regression and full Phase 1/2 verification workflows passed on the candidate SHA. This addresses the supplied mobile layout findings: horizontal wordmark/logo, higher hero contrast, usable numeric/unit control layout, and visible age-specific BMI percentile in the primary result.
- Added a shared-footer fallback in `js/page-chrome.js`. It creates the consistent ClerFit footer only when a page does not already have one, preserves existing page footers, derives Home/Contact URLs correctly for root and `html/` pages, and avoids duplicating footer/navigation markup.
- Improved generated numeric input/unit-selector column proportions at desktop and narrow phone widths, with tabular number styling and a compact-screen fallback. Updated the shared stylesheet cache key to prevent stale mobile CSS.
- Added `tests/phase-three-layout-footer.test.js` and wired it into the Phase 3 guardrail workflow. It checks footer de-duplication, root-relative link resolution, numeric input sizing rules, and that every calculator HTML page loads the shared page-chrome script.
- These source changes are merged and deployed. The footer/layout regression, formula, full route interaction, all-page automated accessibility, deployment, and live production verification workflows all passed on the exact main SHA above.
- Remaining external acceptance gates are unchanged: exact requested ZIP parity, field-by-field scientific domain rationale/expert review, physical-device/manual assistive-technology acceptance, live contact receipt, exact PageSpeed 404 URL, and weak-network/production response-header evidence.


## Exact-main-SHA acceptance result (2026-10-18)

**Automated Phase 3 engineering and release gates: PASS** on main SHA `19ad5a62dca7d786f23e3de282af66dea9ccc900`.

- Phase 3 guardrail including layout/footer checks: PASS — https://github.com/clerfit/Clerfit/actions/runs/39101391171
- Formula regression: PASS — https://github.com/clerfit/Clerfit/actions/runs/39101391206
- Phase 1/2 verification: PASS, including 118-route browser interaction smoke, semantic boundary checks, staging-route/assets/canonical checks, and all-page axe scan — https://github.com/clerfit/Clerfit/actions/runs/39101391162
- Live calculator browser smoke: PASS — https://github.com/clerfit/Clerfit/actions/runs/39101391155
- GitHub Pages deployment: PASS — https://github.com/clerfit/Clerfit/actions/runs/39101390905
- Live production verifier: PASS — https://github.com/clerfit/Clerfit/actions/runs/39101391255

## Remaining acceptance blockers (not safely closable by repository automation)

- Exact `ClerFit_R3_NEW_UI_COMPLETE.zip` parity: blocked until the exact archive is provided; the older similarly named archive is not a valid substitute.
- PageSpeed 404: blocked until the exact failing URL from the report is provided.
- Manual keyboard-only, screen-reader, zoom and physical device checks: require an actual human with devices/assistive technology; automated axe/Chromium checks are not a substitute.
- Contact delivery: requires an authorized real test submission and confirmation in the destination inbox; mocked tests only validate application behavior.
- Independent health-formula/domain review: requires a qualified independent reviewer. Current numeric boundary tests prove enforcement of configured bounds, not clinical/scientific validity.
- Production response headers and weak-network performance: not measured from this execution environment because outbound DNS/network access was unavailable. Requires external browser/network access and hosting/CDN control.

Accordingly, the code/deployment and automated browser/accessibility gates are signed off, but **overall Phase 3 acceptance remains open** until the owner/expert evidence above is recorded. Do not represent the external gates as completed.
