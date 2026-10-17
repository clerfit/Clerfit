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

- Latest completed full Phase 1/2 verification run [39063313324](https://github.com/clerfit/Clerfit/actions/runs/39063313324) passed on code and audit-register revision `c2bc88ac1be8687f142d31845aea7074582313d7`: JavaScript syntax, calculator known-answer/domain regressions, 242-field source/inventory parity, phase-register integrity, per-input accessibility, eight focused page suites, mocked contact form, unit-conversion properties, sitemap/build/staging parity, 118-route interaction/semantic-boundary smoke, and axe across 124 user-facing pages. GitHub Pages deployment [39063313379](https://github.com/clerfit/Clerfit/actions/runs/39063313379) passed on the same revision. A separate formula regression [39063303039](https://github.com/clerfit/Clerfit/actions/runs/39063303039) passed with the new legacy-redirect SEO test. The live 118-route browser smoke [39063290949](https://github.com/clerfit/Clerfit/actions/runs/39063290949) and production verifier [39063290977](https://github.com/clerfit/Clerfit/actions/runs/39063290977) passed on the immediately preceding runtime-source revision; those checks reported no route failures, and the production verifier checked 118 calculator routes, 123 sitemap pages and 158 same-site references with zero failures. The only follow-on change after the full Phase 1/2 run is this report refresh.
- Live weak-network performance measurements and production network/storage/header inspection require the deployed site and real browser/network access.
- GitHub Pages does not apply Netlify `_headers`; HSTS and X-Frame-Options require a host/CDN supporting custom response headers. Inline legacy scripts also require `'unsafe-inline'` in the current CSP; stronger CSP needs script refactoring or hashes.
- Manual keyboard-only and screen-reader checks are not certified as complete; physical-device acceptance remains with the owner as requested.

## Final verdict

**Phase 1 audit work and Phase 2 engineering/automated verification are complete for code and audit-register revision `c2bc88ac1be8687f142d31845aea7074582313d7`.** The full Phase 1/2 CI gate and GitHub Pages deployment passed. The three legacy redirect aliases (Contact, Daily Energy/Calories, and Running Pace) now declare `noindex,follow`; the contact-consent CSS escape defect is fixed with a regression test. It is **not honestly labelled 100% owner/expert-certified** until the exact newest UI archive is supplied for parity review, all 242 static fields plus generated inputs receive defensible semantic boundary review, a real consented contact message is confirmed delivered, physical-device/manual accessibility checks and weak-network/performance review are completed, relevant expert review is recorded, and the exact URL mentioned in the PageSpeed 404 report is provided and verified. GitHub Pages does not automatically apply the repository's Netlify response-header rules.


## Follow-up pass — 16 October 2026

The follow-up found and corrected two additional calculator consistency issues: BMI Change had a stale formula description and displayed adult BMI category assumptions without collecting age; One-Rep Max accepted excessive repetitions, advertised universal accuracy grades, and always displayed kg regardless of selected unit. Code, tests, formula matrix, scientific register and numeric-boundary CSVs were updated. `SCIENTIFIC_AUDIT_CHANGELOG.md` records the corrections. Browser-level rendering remains unverified because Chromium did not return before timeout in this environment.
