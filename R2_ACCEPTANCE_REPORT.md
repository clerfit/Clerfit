# ClerFit R2 — Acceptance and Release Report

Date: 2026-10-15

## Decision

**Local R2 source and staged build: PASS for the checks listed below. Production release parity: FAIL / not yet established.** The currently published GitHub Pages homepage is reachable, but its rendered content differs from the R2 source (the published page shows the older static quick-button/formula directory, while R2 uses the redesigned topic/category directory). R2 must not be described as deployed until the repository is updated and the live site is rechecked.

## Fixes made during this acceptance pass

- Corrected the homepage calculator count from `117+` to `118`.
- Fixed a runtime accessibility defect in the shared page shell: removing the legacy branded header had also removed the only H1 on calculator pages. The page title is now preserved as a semantic H1.
- Added accessible names and explicit label associations to generated meal-heaviness selects.
- Changed white text on the bright green calculator/contact buttons to a dark green that meets WCAG AA normal-text contrast for the solid button state; adjusted hover to a darker green.
- Darkened muted section description and wordmark subtitle colors for improved contrast on white.
- Updated sidebar state semantics: `aria-controls`, `aria-expanded`, `aria-hidden`, hidden-when-closed behavior, focus to the close button when opened, and focus return to the menu toggle on Escape/close. Sidebar links are not keyboard-focusable while the sidebar is closed.
- Added regression assertions for the route count, semantic heading preservation, meal-select accessible names, sidebar accessibility state and selected color contrast ratios.
- Added one passing known-answer or method-specific regression vector for each of the 118 registered calculator routes and a matrix-completeness assertion.
- Added structural/common-range boundary checks and a generated inventory for all 242 numeric inputs.
- Removed an unsupported activity multiplier from fiber guidance and linked the National Academies reference.
- Standardized Calories Burned, Activity Time and METs to the same MET energy equation; removed unsupported universal strength/speed performance tiers.
- Added boundary vectors for zero step counts, zero repetitions, zero-duration activity, zero ratio numerators, zero-denominator rejection, negative physical length/mass rejection and negative-temperature conversion.

## Checks completed locally

- `node tests/verify.js`: PASS — 118 registered routes, 186 inline JavaScript blocks syntax-checked, 24 advanced-engine known-answer cases plus 74 route-specific formula/method vectors, matrix completeness checks, 242-field boundary inventory checks, unit conversions and validation/navigation invariants.
- `node tests/contact-form.test.js`: PASS for mocked successful response, endpoint failure, reset and button recovery. This is not a live delivery test.
- `node --check` across `js/*.js`, `scripts/*.js`, and `tests/*.js`: PASS.
- `node scripts/generate-sitemap.js --check`: PASS — 118 unique calculator routes and all files exist.
- Production staging build with `SITE_URL=https://clerfit.github.io/Clerfit/`: PASS — generated `dist/`, sitemap with 120 URLs (homepage, contact and 118 registered routes), canonical tags and robots sitemap reference.
- Source/staging parity: 151 source files compared against `dist/`; zero differences after normalizing build-generated canonical tags and closing-head whitespace. All 118 registered routes are represented in the sitemap.
- Local staged HTTP route smoke test: 126/126 requests passed (root, contact, 404, robots, sitemap and 121 HTML pages under `html/`); sitemap contains 120 URLs and all registered route files exist.
- Source-inlined Chromium runtime structure audit: 124 HTML documents loaded; zero runtime structure findings (one H1 per page, `lang`, named form controls, alt attributes, unique IDs) and zero JavaScript/console errors.
- Source-inlined primary-action smoke test: 121 HTML documents under `html/`; 121 actions invoked, zero action-target failures and zero runtime/console errors.
- Responsive evidence: earlier all-route browser smoke testing recorded no horizontal overflow at 390 px across 121 calculator/utility pages. Latest targeted pages (homepage, BMI, body-fat and contact) passed overflow checks at 360, 390, 768, 1024 and 1365 px. This is not physical-device testing.
- Keyboard interaction sample: BMI, meal-split and contact page focus sequences were exercised; sidebar closed/open/Escape behavior, hidden-while-closed sidebar links, focus to close button, and focus return to menu toggle were checked. A complete keyboard-only walk through every interactive control on every page has not been certified.
- Contrast calculations: white on `#166534` = 7.13:1; white on `#14532d` = 9.11:1; `#5f6b7b` on white = 5.42:1. These targeted checks do not constitute a complete WCAG contrast audit for every text/background combination.

## Formula and numeric-field coverage

- The registry has 118 routes.
- Every one of the 118 registered routes now has a passing known-answer or method-specific regression vector recorded in `CALCULATOR_VERIFICATION_MATRIX.csv` and `FORMULA_REFERENCE_AUDIT.md` (24 advanced-engine vectors, 20 direct/shared checks, and 74 additional route-specific vectors).
- The suite enforces that every registered route has a non-empty formula/method summary, reference/method basis and PASS status.
- All 242 numeric inputs have valid `min`, `max` and `step` attributes; `INPUT_BOUNDARY_VERIFIED.csv` is generated by the suite and common age/percentage/mass range sanity checks pass.
- This is 100% route-level vector coverage, not exhaustive testing of every input combination. Field-specific semantic limits, all unit-aware edge cases and every zero/denominator boundary still require additional review.

## User-confirmed item

The user has explicitly confirmed that the existing contact form is working. The project retains the configured Formspree endpoint. No new live message was submitted during this pass; live delivery was not independently re-tested.

## Not completed / not claimed

- The 118/118 vector coverage is not a claim that every calculator has been clinically certified or every edge-case combination tested.

- Exhaustive boundary combinations, alternate-unit edge cases, assumptions and rounding review for every calculator; each route now has at least one passing known-answer/method vector.
- Full field-by-field semantic and unit-aware boundary audit for all 242 numeric inputs; structural bounds are verified, but not every domain-specific range has been independently certified.
- Complete keyboard-only walkthrough of every interactive control on every page.
- Screen-reader testing with actual assistive technology.
- Full measured color-contrast compliance audit for every rendered text/background pair.
- Physical phone/tablet testing in portrait and landscape.
- Actual repository update/deployment of R2 and post-deployment verification.
- Exact parity between the published site and this R2 archive. The published homepage was observed to show different older content.

## Deployment parity

Expected production base: `https://clerfit.github.io/Clerfit/`.

The deployment workflow and post-deployment verifier are included. The current published homepage was inspected and does not match the R2 homepage content. The environment does not have an authenticated repository write connection, so no push/deployment was performed. Publish R2 through the connected GitHub repository, then run:

```bash
node scripts/verify-production.js https://clerfit.github.io/Clerfit/
```

Only mark production parity PASS after all route, canonical, sitemap, HTTPS and live response checks pass against the published build.

## Follow-up navigation change (2026-10-15)
- Removed the JavaScript that injected the fixed/floating Home and Contact Us buttons on calculator pages.
- Kept the normal non-floating ClerFit brand/header navigation and existing page background/styles.
- Added a defensive CSS rule to hide any legacy `.cf-floating-links` markup if present, and removed mobile/landscape top-padding that existed only to make room for the floating controls.
- Rebuilt `dist/` and reran the verification, contact-form mock tests, sitemap check, and source/staging parity check. All passed. Contact form delivery remains mocked and was not live-submission tested.
