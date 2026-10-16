# ClerFit Release Verification Report

Audit date: 2026-10-15

## Checks completed in this pass

- `node tests/verify.js`: PASS.
- `node --check` for all `js/*.js`, `scripts/*.js`, and `tests/*.js`: PASS.
- `node scripts/generate-sitemap.js --check`: PASS; 118 unique registered routes and all corresponding files exist.
- Sitemap generation integration test: PASS for the GitHub Pages project URL `https://clerfit.github.io/Clerfit`; canonical URLs, sitemap entries and robots sitemap preserve the `/Clerfit` path.
- Contact-form handler tests: PASS for mocked success, mocked endpoint error, reset behavior and submit-button recovery. This is not a live Formspree delivery test.
- Static field inventory: 238 static numeric inputs plus runtime-generated controls; all have `min`, `max` and `step`; zero invalid min/max relationships or non-positive numeric steps.
- Accessibility-name static audit: zero unnamed visible form controls, buttons or links across the 124 HTML documents audited. Label associations and accessible names were improved across the legacy pages; this does not replace screen-reader testing.
- Static integrity: zero missing local `href`/`src` references, duplicate IDs, missing descriptions/theme colors, or images missing `alt` text in the current static audit.
- Browser source-inlined smoke evidence from the latest saved reports: 122 documents loaded, 119 primary actions invoked, zero recorded runtime/console errors and zero horizontal overflow at 390 px. The environment blocks direct browser navigation to local HTTP URLs, so the stored in-memory Chromium harness is the available browser evidence.
- Added regression for BMI age interpretation: CDC adult categories are applied only from age 20; ages 2–19 are directed to a validated BMI-for-age reference. The BMI-for-age calculator now links to the official CDC tool.
- Corrected generic validation fallback: explicit HTML bounds now remain authoritative for unclassified signed values, fixing negative temperature/signed-difference inputs that were incorrectly rejected by a zero default. Tests cover signed values and negative-temperature unit conversion.

## Formula/reference coverage

`SOURCES_AND_METHODS.md`, `FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv` now document all 118 registered routes, formula/method summaries, reference or explicit site-defined-method basis, and route-specific test status. The automated suite passes 24 advanced-engine vectors, 20 existing direct/shared vectors and 74 additional route-specific known-answer/method vectors: **118/118 routes have at least one passing route-level vector**. All 238 static numeric fields plus runtime-generated controls have valid min/max/step and are inventoried in `INPUT_BOUNDARY_VERIFIED.csv`. This does not certify every possible input combination or every custom heuristic as scientifically validated.

## Remaining release gates

1. Extend boundary testing to every calculator input and meaningful edge-case combination, including alternate units, zero denominators, lower/upper bounds and invalid values. Route-level known-answer coverage is complete; exhaustive edge-case coverage is not.
2. Complete domain-specific semantic review of all 238 static fields plus runtime-generated controls; the static bounds and accessible-name checks do not prove every field's range is scientifically appropriate.
3. Verify actual Formspree endpoint authorization and successful delivery/failure behavior with a consented live message.
4. Integrate this archive into the GitHub repository or deploy it to the configured host. No repository write credential or hosting-account credential is available in this environment, so no deployment has been performed here.
5. Run `node scripts/verify-production.js <production-base-url>` after deployment and complete real-device, screen-reader, keyboard-only, contrast and portrait/landscape QA on the live site.
6. Package the final source and run `unzip -t` after all further edits.

## Release verdict

**Local implementation and route-level formula-vector checks: PASS for the checks listed above. Exhaustive boundary certification and live production release: NOT YET VERIFIED.** A “100% complete” claim would be inaccurate until every release gate above is passed.

The recorded Chromium smoke report predates the last label-name and signed-value fallback edits. Those final edits pass the updated Node regression suite and static accessibility audit, but a new full browser pass after those edits is still recommended before release.
