# ClerFit R3 — Final Local Audit Report

Audit date: 2026-10-18.

## Executive result

The updated source and generated production build pass the available local automated checks. There are 118 registered calculator routes, each with a passing known-answer or method-specific regression vector. The formula-by-formula desk-review register is `SCIENTIFIC_REVIEW_REGISTER.csv`; methodology, sources, limitations and unresolved external checks are in `INDEPENDENT_FORMULA_REVIEW.md`.

## Corrections and restrictions preserved

- Removed remaining global unit-preference behavior; unit selection/conversion is scoped to individual calculators, and no unit preference is written to browser storage.
- Corrected the body-fat formula's unit conversion before logarithmic constants, the Heath–Carter corrected-girth term, MET energy equation consistency, pediatric BMI interpretation and unsupported universal performance tiers in earlier audit passes.
- Added metadata to legacy redirect pages and corrected route/input-count assertions that were stale.
- Mobile tables now get accessible header labels and stack into row cards at narrow widths.
- Progress/range indicator visuals are hidden to comply with the explicit no-dynamic-progress UI requirement.
- The floating Home/Contact foreground controls are disabled in the final active CSS; standard navigation and footer links remain.
- Privacy notice, Terms of Use and Educational Disclaimer are included.

## Latest local verification

- `node tests/verify.js`: PASS — 118 routes, 91 inline script blocks syntax-checked, 24 advanced-engine known-answer cases plus 74 route-specific vectors, 242 static numeric inputs inventoried, formula/interpretation guards and design-restriction checks.
- `node tests/contact-form.test.js`: PASS for mocked success/failure/reset/recovery; live message delivery not tested.
- `node tests/unit-conversion-property.test.js`: PASS — known answers, round trips, incompatible dimensions and non-finite input.
- `node scripts/generate-sitemap.js --check`: PASS — 118 unique calculator pages.
- `SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js`: PASS — generated production `dist/` build and 123-URL sitemap.
- User-facing source scan: no emoji-range matches, embedded analytics/tag-manager scripts, or browser storage APIs found.

## Limits and pending evidence

- This is an assistant-performed code-level desk audit, not a licensed clinical/engineering certification or peer-reviewed independent sign-off.
- Static input bounds are structurally checked; exhaustive semantic boundary combinations for every field are not claimed.
- The most recent full Phase 1/2 CI run `39061691909` passed on commit `481fe233daf5ff8c3110419cdd974b379b4672b2`. It passed route interactions and semantic-boundary smoke for all 118 calculator routes, plus an axe scan of 124 user-facing HTML pages. A subsequent change to `FINAL_COMPLETION_REPORT.md` only is the sole diff between that tested revision and current source at the time of this audit; it did not change calculator code or tests.
- Live deployment parity, release marker, 123 sitemap pages, 123 fetched HTML pages and 158 same-site references were checked successfully by the current-main production verifier. Real contact delivery, live weak-network measurements, manual keyboard/screen-reader checks, physical-device testing and independent expert review are still not claimed complete.
- GitHub Pages does not apply Netlify `_headers`; server response headers such as HSTS and X-Frame-Options require a host/CDN supporting custom headers. The current CSP allows inline scripts because the legacy pages still contain inline code.


## Follow-up formula corrections (2026-10-16)

- Corrected BMI Change sign convention in UI, test, formula matrix, and scientific register to goal BMI minus current BMI; removed age-free adult categories.
- Restricted One-Rep Max predictions to 1–15 integer repetitions, added handler validation, aligned output units with selected kg/lb, and removed unsupported universal accuracy labels.
- Synchronized static numeric-input CSVs with current source constraints and corrected the stale Ponderal Index row in the formula reference audit.
- Added `SCIENTIFIC_AUDIT_CHANGELOG.md` and new regression assertions.


## Final Phase 1 / Phase 2 disposition — 2026-10-18

- **Engineering and automated acceptance gates: PASS.** The current runtime/test source has passing JavaScript, 118-route formula/method, inventory consistency for 242 static numeric inputs, focused regression, staging, browser interaction, and accessibility gates. Latest full verification: [GitHub Actions run 39061691909](https://github.com/clerfit/Clerfit/actions/runs/39061691909); it passed on `481fe233daf5ff8c3110419cdd974b379b4672b2`. The only follow-on commit before this report refresh changed the final report document, not runtime/test code.
- **Live website checks: partial pass.** The production verifier passed on its checked revision with 123 sitemap pages, 118 calculator routes, 158 same-site references and zero verifier failures; a repeat of the live 118-route smoke also passed. The exact PageSpeed-reported 404 URL was not supplied, so that specific URL is not certified fixed.
- **Do not call release acceptance 100% complete.** Outstanding evidence is the exact `ClerFit_R3_NEW_UI_COMPLETE.zip` for byte/page-level parity, formula-aware semantic review of all 242 fields plus generated fields, human keyboard/screen-reader and physical-device acceptance, real consented contact submission with inbox receipt, independent domain review where warranted, and current-host response-header / weak-network performance checks. GitHub Pages does not apply Netlify `_headers` automatically.
