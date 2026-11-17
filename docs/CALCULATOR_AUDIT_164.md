# ClerFit calculator audit — 164-route registry

Audit update: 16 November 2026  
Working branch: `audit/fix-all-164-calculators`  
Review pull request: https://github.com/clerfit/Clerfit/pull/109

## Scope reconciliation

The current navigation registry contains 164 unique calculator routes. The previous formula matrix, scientific review register and historical interaction report covered 118 routes. This update adds the 46 previously unregistered routes to both the formula matrix and scientific review register:

- 22 body-composition routes using `js/body-composition-methods.js`
- 24 additional anthropometric routes using `js/anthropometric-calculators.js`

The register and matrix now each contain 164 unique calculator file entries. `tests/phase-register-integrity.test.js` now checks that both documents match the central navigation registry.

## Corrections and code changes in this pass

- Added explicit finite/positive-domain checks to waist-to-height comparison, body volume, body density, z-score and measurement symmetry calculations.
- Extracted these calculations into named functions and added known-answer and invalid-domain tests.
- Extracted body-composition calculations into named functions so formula behaviour can be tested separately from page rendering.
- Added explicit input-domain and known-answer tests for Jackson–Pollock 3-site and 7-site equations, Durnin–Womersley, YMCA body-fat estimation, measured-value proportions, water compartments, ratios, body-fat change and fat-free-mass change.
- Verified the Durnin–Womersley age bands against the published coefficient table: age 16 uses the under-17 coefficients, ages 17–19 use the next band, and subsequent adult bands continue through 72 years.
- Added route-wiring checks for all 22 body-composition pages. The existing anthropometric suite covers all 24 additional anthropometric pages.
- Added a check that skinfold-derived body-fat estimates outside the supported 0–75% output range are rejected.

## Automated evidence — 17 November 2026 recheck

The latest available PR-triggered run on the pre-fix candidate (merge commit `aa0788947c74710c8e5f479c35831706593ddf45`, PR #109) reported:

- **All-route browser smoke: PASS** (workflow run 43934414997). This is candidate-branch evidence, not a production-live test.
- **Production staging/package: PASS** (workflow run 43934415049).
- **Formula regression: FAIL** (workflow run 43934415282). The run exposed an ALMI test fixture using unsupported height unit `m`; the implementation accepts `cm` or `in`. The fixture was corrected to 200 cm in commit `5b8dc3afdb6a23a6b248378f49768617c5fa8122`.
- **Phase 1/2 verification: FAIL** (workflow run 43934415315). JavaScript syntax checking exposed a malformed escaped newline at the end of `tests/body-composition-methods.test.js`. That footer was corrected in commit `d93b4f2815bcacebe15c337f5033021f17f4e2f8`.
- The Phase 1/2 accessibility step did **not** complete an axe scan: the earlier syntax failure prevented the staging build, so the later `if: always()` accessibility step had no `dist/` site to serve and exited during its local HTTP check. This is **not** an axe pass or an axe violation result.
- A later commit removed an unverified hard-coded assertion count from the anthropometric test output: `b92ee79c71fead2a4e93e344b1f66e91165214a1`.

The fixes above have been committed to the audit branch. **No CI result has yet been retrieved for the corrected branch head**, so these corrections are not yet verified. Do not describe the formula suite, full accessibility scan, or Phase 1/2 workflow as passing until a fresh run on the exact corrected head is green and its artifacts are reviewed.

## Code-quality direction

- Keep formula calculations in named, testable functions rather than mixing arithmetic into DOM event handlers.
- Validate numeric domains and units before division, logarithms or other domain-sensitive operations.
- Keep page rendering and result wording separate from the calculation where practical.
- Preserve explicit units, method notes and limitations.
- Keep tests for known answers, invalid domains, unit equivalence and page wiring.
- Do not add clinical thresholds or performance tiers without an appropriate, documented reference.

## Limits

This is a source-code and automated regression audit, not independent clinical certification. Published empirical equations remain estimates; measurement-derived calculators depend on the accuracy of the supplied assessment values; site-defined ratios and geometric proxies are descriptive only. Physical phone/tablet testing, manual assistive-technology review and independent subject-matter review remain separate acceptance gates.

Do not merge or deploy this branch until the outstanding browser and accessibility workflows have completed and their results have been reviewed.
