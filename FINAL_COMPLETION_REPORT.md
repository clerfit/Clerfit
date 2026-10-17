# ClerFit R3 — Final Completion and Release Status

Audit date: 2026-10-16.

## Completed in this package

- 118 registered calculator routes preserved and checked against the calculator verification matrix.
- 118/118 routes have a passing known-answer or method-specific regression vector in `tests/verify.js`.
- 238 static numeric inputs have explicit `min`, `max` and `step` attributes and are included in `INPUT_BOUNDARY_VERIFIED.csv`.
- Regression fixes already in the package include BMI-for-age interpretation safeguards, body-fat input conversion before logarithmic equations, Heath–Carter corrected girths, MET calorie equation consistency, dimension-safe unit conversion, and removal of unsupported universal performance tiers.
- Added `SCIENTIFIC_REVIEW_REGISTER.csv` with one row per calculator and `INDEPENDENT_FORMULA_REVIEW.md` with the route-by-route desk-review method, evidence, sources and limitations.
- Added metadata to three legacy redirect pages and corrected the test suite so redirects are not incorrectly required to load calculator JavaScript.
- Fixed mobile table presentation: data cells receive accessible header labels and stack into compact row cards on narrow screens.
- Removed dynamic progress/range visuals from display while preserving numerical results and plain-text interpretation, as required.
- Verified no emoji-range characters, analytics/tag-manager scripts, or browser storage APIs in user-facing page source. The contact form's explicit Formspree data transfer is documented and requires acknowledgement.
- Terms of Use, Privacy Notice and Educational Disclaimer are present. Copyright wording avoids claiming ownership of third-party assets or trademarks.
- Build staging, sitemap generation and regression commands passed after the final source edits.

## Latest local command results

- `node tests/verify.js` — PASS.
- `node tests/contact-form.test.js` — PASS; mocked responses only.
- `node tests/unit-conversion-property.test.js` — PASS.
- `node scripts/generate-sitemap.js --check` — PASS; 118 unique calculator pages.
- `SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js` — PASS; production build staged to `dist/` and sitemap generated.

## Scientific review result

The assistant performed a route-by-route code-level desk review using the formula/method matrix, known-answer vectors and the references recorded in the package. Exact arithmetic and unit conversion methods are checked as mathematical operations. Published empirical equations are linked to their primary/authoritative references and tested for implementation fidelity. Site-defined face, posture, recovery, fatigue and performance metrics are labelled descriptive/heuristic and are not treated as validated universal clinical standards.

This is not a licensed clinical, engineering, peer-reviewed or regulatory certification. The register explicitly records that limitation rather than falsely signing as an independent credentialed reviewer.

## Owner tasks intentionally left open

- Publish the package to the production host and verify the exact live version, domain, HTTPS, canonical URLs and deployed assets.
- Send a real consented contact-form message and confirm delivery.
- Perform physical phone/tablet/laptop checks.

## Remaining external/interactive evidence not available in this environment

- Fresh browser-based visual verification of all pages was blocked by the execution environment's local browser navigation policy. Historical browser QA reports are retained but are not treated as fresh evidence for the latest CSS edits.
- Live weak-network performance measurements and production network/storage/header inspection require the deployed site and real browser/network access.
- GitHub Pages does not apply Netlify `_headers`; HSTS and X-Frame-Options require a host/CDN supporting custom response headers. Inline legacy scripts also require `'unsafe-inline'` in the current CSP; stronger CSP needs script refactoring or hashes.
- Manual keyboard-only and screen-reader checks are not certified as complete; physical-device acceptance remains with the owner as requested.

## Final verdict

The source and production build pass the available local automated checks, and the package includes a scientific desk-review register and audit reports. The product is a locally verified release candidate. It is **not honestly labelled 100% production-certified** until deployment, real contact delivery, fresh interactive accessibility/performance checks and external scientific review where needed have evidence.


## Follow-up pass — 16 October 2026

The follow-up found and corrected two additional calculator consistency issues: BMI Change had a stale formula description and displayed adult BMI category assumptions without collecting age; One-Rep Max accepted excessive repetitions, advertised universal accuracy grades, and always displayed kg regardless of selected unit. Code, tests, formula matrix, scientific register and numeric-boundary CSVs were updated. `SCIENTIFIC_AUDIT_CHANGELOG.md` records the corrections. Browser-level rendering remains unverified because Chromium did not return before timeout in this environment.


## Phase One verification-pipeline remediation (2026-10-17)

The follow-up found release documentation pointing to scripts/workflows absent from the repository's main branch. A remediation branch restores tests/contact-form.test.js and tests/unit-conversion-property.test.js; adds scripts/build-site.js, scripts/verify-staging.js, scripts/accessibility-smoke.js; fixes the Contact Us consent CSS escape typo; corrects README/Deployment Guide statements; and adds .github/workflows/phase-one-ci.yml. The new workflow verifies source changes but does not deploy production. Fresh passing status must come from that workflow's check result for its exact commit, not from the previously recorded 2026-10-16 local report.
