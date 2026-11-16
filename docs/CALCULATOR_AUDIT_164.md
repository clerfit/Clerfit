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

## Automated evidence

The formula-regression workflow has passed on the audit branch, including:

- Existing 118-route known-answer/domain suite
- New anthropometric domain tests
- New body-composition coefficient and formula tests
- 24-page anthropometric route and formula checks
- 22-page body-composition route-wiring checks
- Field-bound inventory consistency
- Scientific register / matrix / 164-route registry consistency
- JavaScript syntax checks

The latest full browser smoke and Phase 1/2 accessibility/staging workflows are still running for the newest commit. Their results must be checked before this PR is considered ready.

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
