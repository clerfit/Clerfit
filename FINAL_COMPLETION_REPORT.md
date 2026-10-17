# ClerFit R3 — Final Completion and Release Status

Audit date: 2026-10-18.

## Completed in this package

- 118 registered calculator routes preserved and checked against the calculator verification matrix.
- 118/118 routes have a passing known-answer or method-specific regression vector in `tests/verify.js`.
- 242 static numeric inputs have explicit `min`, `max` and `step` attributes and are included in `INPUT_BOUNDARY_VERIFIED.csv`.
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

## Owner/expert tasks intentionally left open

- Send a real, consented contact-form submission and verify actual inbox receipt; current form tests mock the remote service.
- Perform physical phone/tablet/laptop checks and manual keyboard-only/screen-reader acceptance.
- Arrange independent expert review for formulas/thresholds that materially inform health decisions.
- Review weak-network performance and hosting response-header configuration. GitHub Pages does not apply Netlify `_headers` automatically.

## Remaining external/interactive evidence not available in this environment

- Latest completed full Phase 1/2 verification run `39058859109` passed on code revision `3e4676016bd5ef472395a6131f238b524c11e0b5`: 118-route Playwright interaction smoke, 124-page axe accessibility audit, source/staging parity, formula/domain regressions, contact-form mocks and register/inventory checks. Formula-regression run `39058859175` and GitHub Pages deployment `39058858472` also passed on that revision. Documentation-only field-count updates followed; they do not alter runtime code. A fresh production verifier on the newest deployment and repeatable live 118-route run remain desirable; the previous live production verifier passed on an earlier implementation snapshot.
- Live weak-network performance measurements and production network/storage/header inspection require the deployed site and real browser/network access.
- GitHub Pages does not apply Netlify `_headers`; HSTS and X-Frame-Options require a host/CDN supporting custom response headers. Inline legacy scripts also require `'unsafe-inline'` in the current CSP; stronger CSP needs script refactoring or hashes.
- Manual keyboard-only and screen-reader checks are not certified as complete; physical-device acceptance remains with the owner as requested.

## Final verdict

**Phase 1 audit and Phase 2 engineering/automated verification are complete for verified code revision `3e4676016bd5ef472395a6131f238b524c11e0b5`.** The current source is deployed; formula/regression, source/staging, 118-route browser interaction, 124-page axe scan and live production checks passed. It is **not honestly labelled 100% owner/expert-certified** until every field in the 242-input inventory has a defensible semantic boundary assessment, a real consented contact message is confirmed delivered, physical-device/manual accessibility and performance review are completed, relevant expert review is recorded, and the exact newest UI archive parity can be established.


## Follow-up pass — 16 October 2026

The follow-up found and corrected two additional calculator consistency issues: BMI Change had a stale formula description and displayed adult BMI category assumptions without collecting age; One-Rep Max accepted excessive repetitions, advertised universal accuracy grades, and always displayed kg regardless of selected unit. Code, tests, formula matrix, scientific register and numeric-boundary CSVs were updated. `SCIENTIFIC_AUDIT_CHANGELOG.md` records the corrections. Browser-level rendering remains unverified because Chromium did not return before timeout in this environment.
