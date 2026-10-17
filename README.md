# ClerFit Professional

A static HTML/CSS/JavaScript health, fitness, measurement and everyday-calculator website.

## Open locally

1. Extract the project ZIP.
2. Open `index.html` in a modern browser.
3. Use the left-edge three-line menu to open the sidebar; it starts closed.
4. Use the magnifying-glass control inside the sidebar to search calculators.
5. Home and Contact Us appear right-aligned in the shared page header in normal document flow; they do not float over calculator fields.
6. Supported unit selectors convert values within the calculator when you change units. The site does not save a global unit preference in browser storage.

For a local server, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Structure

- `index.html` — homepage, categories and full calculator directory.
- `contact.html` — root contact page.
- `404.html` — branded not-found fallback page.
- `netlify.toml` and `_headers` — static-hosting settings, security headers and asset caching.
- `robots.txt` — crawl policy; `scripts/generate-sitemap.js` creates the sitemap and canonical URLs at build time from `SITE_URL` or Netlify’s deployment `URL`.
- `css/style.css` — shared styling and responsive rules.
- `js/navigation.js` — central calculator registry, sidebar, categories, search and shared page enhancements.
- `js/unit-system.js` — per-calculator unit conversion with no global preference or browser storage.
- `js/input-validation.js` — shared numeric input guardrails.
- `js/site-polish.js` — shared page shell, image viewer and face-measurement help.
- `js/tooltips.js` — contextual glossary and specialist tooltips.
- `js/advanced-calculators.js` — reusable implementation for 24 advanced calculator forms.
- `js/engine.js` — shared calculation logic used by legacy calculator pages.
- `html/` — individual calculator pages.
- `images/` — local SVG illustrations and visual guides.
- `scripts/generate-sitemap.js` — verifies the central registry and creates a domain-aware XML sitemap, canonical tags and robots sitemap entry; it preserves GitHub Pages project paths such as `/Clerfit`.
- `.github/workflows/phase-one-ci.yml` — pull-request and main-branch CI for regression tests, production staging integrity, all-route Playwright smoke tests, and all-page axe accessibility scans. This workflow verifies changes; it does not publish automatically.
- `scripts/build-site.js` — reproducible production staging build into `dist/`, including domain-aware canonical and sitemap generation.
- `scripts/verify-staging.js` — offline checks for all registered routes, required assets, canonicals, sitemap/robots consistency, and local HTML/CSS links.
- `scripts/browser-smoke.js` — Playwright route, interaction, mobile overflow, navigation, runtime and targeted semantic-boundary smoke checks.
- `scripts/accessibility-smoke.js` — axe-core scan of every staged HTML page, with critical/serious violations and uncaught errors gating CI.
- `scripts/verify-production.js` — post-deployment route, sitemap, robots and HTTPS smoke test.
- `SOURCES_AND_METHODS.md`, `FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv` — formula/method summaries, references, route-level known-answer status and documented limitations.
- `FIELD_VALIDATION_AUDIT.csv` and `INPUT_BOUNDARY_VERIFIED.csv` — inventory of 238 static numeric fields and verified structural min/max/step constraints; exhaustive semantic edge cases remain a release gate.
- `DEPLOYMENT_GUIDE.md` — deployment requirements and post-release checks.
- `tests/verify.js` — automated route, syntax, integrity, 118/118 route-level formula/method vectors, boundary inventory, input validation and conversion checks.
- `FINAL_COMPLETION_REPORT.md` — final status, verified evidence and remaining external/review requirements.
- `FINAL_BROWSER_SMOKE_REPORT.json` — previously recorded all-page in-memory Chromium smoke results (historical evidence; not a fresh run after the latest CSS edits).
- `FINAL_BROWSER_SMOKE_TARGETED.json` — previously recorded targeted browser smoke results (historical evidence).
- `MASTER_REQUIREMENTS_CHECKLIST.md` — user-requested calculator inventory and feature checklist.
- Homepage FAQ — seven native, accessible accordion items that start collapsed and open on touch/click/keyboard.
- `AUDIT_REPORT.md` — current implementation status and release blockers.
- `INPUT_VALIDATION_REPORT.md` — validation/unit-system scope and limitations.

## Verify

```bash
for f in js/*.js scripts/*.js tests/*.js; do node --check "$f"; done
node tests/verify.js
node tests/contact-form.test.js
node tests/unit-conversion-property.test.js
node scripts/generate-sitemap.js --check
SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js
SITE_URL=https://clerfit.github.io/Clerfit node scripts/verify-staging.js
npm install --no-save --package-lock=false playwright axe-core
npx playwright install --with-deps chromium
python3 -m http.server 4173 --directory dist
# From a second terminal while the local server is running:
CLERFIT_BROWSER_REPORT=browser-smoke-report.json node scripts/browser-smoke.js http://127.0.0.1:4173/
CLERFIT_ACCESSIBILITY_REPORT=accessibility-smoke-report.json node scripts/accessibility-smoke.js http://127.0.0.1:4173/
```

## Important release limitations

Automated checks now include a passing known-answer or method-specific regression vector for every registered calculator (118/118 routes), a documented method/reference basis for every route, and structural boundary checks for all 238 static numeric inputs plus runtime-generated controls. This does not mean every possible input combination has been tested or that site-defined metrics are scientifically standardized. Full semantic boundary combinations, real-device and screen-reader QA, live contact-form delivery and deployed production parity remain open. The sitemap and canonical URLs are generated from Netlify’s deployment URL or the explicit `SITE_URL`; the generator preserves project-site paths such as `/Clerfit`. See `FORMULA_REFERENCE_AUDIT.md`, `MASTER_REQUIREMENTS_CHECKLIST.md` and `AUDIT_REPORT.md` before publishing.
