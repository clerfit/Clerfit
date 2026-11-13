# ClerFit Professional

A static HTML/CSS/JavaScript health, fitness, measurement and everyday-calculator website.

## Open locally

1. Extract the project ZIP.
2. Open `index.html` in a modern browser.
3. Use the left-edge three-line menu to open the sidebar; it starts closed.
4. Use the magnifying-glass control inside the sidebar to search calculators.
5. Home and Contact Us links appear in normal page flow on calculator pages; they are not floating overlays.
6. Use each calculator's own unit selector where available. Unit choices are scoped to the calculator and are not saved as a site-wide browser preference.

For a local server, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Structure

- `index.html` — homepage, categories and full calculator directory.
- `contact.html` — root contact page.
- `404.html` — branded not-found fallback page.
- `netlify.toml` and `_headers` — static-hosting settings, security headers and asset caching.
- `robots.txt` — crawl policy; `scripts/generate-sitemap.js` creates the sitemap and canonical URLs at build time from `SITE_URL` or Netlify’s deployment `URL`.
- `css/style.css` — shared styling and responsive rules, including the shared calculator footer.
- `js/navigation.js` — central calculator registry, sidebar, categories, search and shared page enhancements.
- `js/unit-system.js` — per-calculator unit conversion with no global preference or browser storage.
- `js/input-validation.js` — shared numeric input guardrails.
- `js/page-chrome.js` — shared Home/Contact navigation, semantic main landmark, accessible naming support and the shared footer for calculator pages.
- `js/site-polish.js` — image viewer, face-measurement help and shared page enhancements.
- `js/tooltips.js` — contextual glossary and specialist tooltips.
- `js/advanced-calculators.js` — reusable implementation for advanced calculator forms.
- `js/engine.js` — shared calculation logic used by legacy calculator pages.
- `html/` — individual calculator pages.
- `images/` — local SVG illustrations and visual guides.
- `scripts/generate-sitemap.js` — verifies the central registry and creates a domain-aware XML sitemap, canonical tags and robots sitemap entry; it preserves GitHub Pages project paths such as `/Clerfit`.
- `.github/workflows/phase-one-ci.yml` — source build, calculator regression, route browser checks and all-page Axe accessibility smoke.
- `.github/workflows/formula-regression.yml`, `.github/workflows/browser-smoke.yml` and `.github/workflows/verify-production.yml` — formula/domain regression, live browser smoke and production checks. CI results must pass for the exact release commit.
- `scripts/build-site.js` and `scripts/verify-staging.js` — reproducible production staging build, route/canonical/sitemap checks and source-to-staging parity.
- `scripts/browser-smoke-staging.js` and `scripts/accessibility-smoke.js` — all-route Chromium interaction/boundary checks and all-page axe accessibility audit for the local staged build.
- `scripts/verify-production.js` — post-deployment route, sitemap, robots and HTTPS smoke test.
- `SOURCES_AND_METHODS.md`, `FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv` — formula/method summaries, references, route-level known-answer status and documented limitations.
- `FIELD_VALIDATION_AUDIT.csv` and `INPUT_BOUNDARY_VERIFIED.csv` — inventory of numeric fields and verified structural min/max/step constraints; exhaustive semantic edge cases remain a release gate.
- `DEPLOYMENT_GUIDE.md` — deployment requirements and post-release checks.
- `tests/verify.js` — automated route, syntax, integrity, formula/method vectors, boundary inventory, input validation and conversion checks.
- `FINAL_COMPLETION_REPORT.md` — final status, verified evidence and remaining external/review requirements.
- `FINAL_BROWSER_SMOKE_REPORT.json` and `FINAL_BROWSER_SMOKE_TARGETED.json` — previously recorded browser smoke evidence; treat these as historical unless freshly regenerated.
- `MASTER_REQUIREMENTS_CHECKLIST.md` — calculator inventory and feature checklist.
- Homepage FAQ — seven native, accessible accordion items that start collapsed and open on touch/click/keyboard.
- `AUDIT_REPORT.md` — current implementation status and release blockers.
- `INPUT_VALIDATION_REPORT.md` — validation/unit-system scope and limitations.
- `PHASE_ONE_AUDIT_SIGNOFF.md` and `PHASE_TWO_CALCULATOR_SIGNOFF.md` — phase evidence, disposition and release gates.
- `PHASE_1_CALCULATOR_INVENTORY.csv`, `PHASE_1_SIGNOFF_REGISTER.csv` and `PHASE_1_FINDINGS_REGISTER.csv` — page-level inventory, baseline sign-off evidence and prioritized blockers. See `PHASE_1_ROUTE_REGISTER_NOTES.md` for provenance and status semantics.

## New calculator implementation standard

Every newly added calculator must follow this checklist. Treat it as the required definition of done, not an optional styling suggestion.

### Shared footer — mandatory on every calculator page

- Reuse the existing shared footer implementation in `js/page-chrome.js` and its styles in `css/style.css`. Do not create a calculator-specific footer design or paste a second, hand-maintained footer implementation into a new page.
- Ensure the calculator page loads the shared page-chrome script and stylesheet using the correct relative paths from its location under `html/`.
- Keep the calculator content inside the expected main content container so the shared page-chrome code can add the footer in the correct place.
- The footer must have exactly one visible `.cf-footer` element and exactly one `.cf-footer-category-icons` row.
- Preserve the shared footer composition: decorative category icon row; ClerFit brand and short description; Explore calculators and Contact links; educational-estimates disclaimer; current copyright year; and Back to top link.
- Keep footer links root-aware so they work from nested calculator URLs. Retain responsive styling, accessible navigation labeling, and reduced-motion behavior.
- Do not add duplicate footers. If a page already has a richer footer, preserve its content and let the shared enhancement add the missing shared class/icon row as designed.
- Verify the rendered footer on desktop, tablet and mobile; do not rely only on source inspection.

### Every new calculator — required implementation and documentation steps

1. Add the calculator page and its central registry entry; use the established category, naming, URL and asset conventions.
2. Preserve the shared navigation, tooltip, input-validation and unit-system behavior applicable to that calculator. Do not introduce a global unit preference.
3. Add or update the formula/method reference, verification matrix, known-answer tests and input-boundary documentation required for the calculator.
4. Add the calculator to the homepage directory/category listing and ensure sitemap generation includes its canonical URL.
5. Run the relevant formula, route, interaction, accessibility, responsive-layout and footer checks. The footer audit must confirm one visible `.cf-footer`, one icon row and no duplicate footer.
6. **Update this README in the same calculator-addition change.** Keep the calculator inventory/current total and any relevant category or structure notes accurate. If a new shared file, script, test suite or workflow is introduced, document it in the Structure section too. Do not leave the README describing the previous calculator count after a new calculator is added.
7. Include the README update in the same pull request as the calculator implementation, and do not mark the calculator complete until the documentation and required checks are included.

## Verify

```bash
for f in js/*.js scripts/*.js tests/*.js; do node --check "$f"; done
node tests/verify.js
node tests/phase-register-integrity.test.js
node tests/input-validation-accessibility.test.js
for test_file in tests/bmi-page.test.js tests/bodyfat-page.test.js tests/bsa-page.test.js tests/fatmass-page.test.js tests/ffmi-page.test.js tests/leanmass-page.test.js tests/whr-page.test.js tests/wht-page.test.js; do node "$test_file"; done
node tests/contact-form.test.js
node scripts/generate-sitemap.js --check
SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js
SITE_URL=https://clerfit.github.io/Clerfit node scripts/verify-staging.js
```

## Important release limitations

Automated checks and documented evidence cover registered calculator routes, known-answer or method-specific regression vectors, formula/reference bases and structural input constraints. This does not mean every possible input combination has been tested or that site-defined metrics are scientifically standardized. Full semantic boundary combinations, real-device and screen-reader QA, live contact-form delivery and deployed production parity remain release gates. The sitemap and canonical URLs are generated from Netlify’s deployment URL or the explicit `SITE_URL`; the generator preserves project-site paths such as `/Clerfit`. See `FORMULA_REFERENCE_AUDIT.md`, `MASTER_REQUIREMENTS_CHECKLIST.md` and `AUDIT_REPORT.md` before publishing.
