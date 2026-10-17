# ClerFit — Deployment and final verification

## Current verification workflow

The repository includes .github/workflows/phase-one-ci.yml. Pull requests targeting main, pushes to main, and manual workflow dispatch run:

1. JavaScript syntax checks and the calculator regression suite.
2. Mocked contact-form success/failure/recovery tests and unit-conversion property tests.
3. A production staging build that preserves the GitHub Pages project path when SITE_URL=https://clerfit.github.io/Clerfit.
4. Offline route, sitemap, canonical, robots and local asset-integrity checks.
5. Playwright interaction and responsive smoke checks across the 118 registered calculator routes.
6. An axe-core accessibility smoke scan across every HTML page in the staging directory, with critical/serious violations and uncaught errors failing CI.
7. Upload of fresh browser/accessibility reports as workflow artifacts, including on failure when a report has been produced.

This CI workflow verifies proposed website changes. It does not itself deploy to GitHub Pages and does not prove the live site is running the tested build. Check the actual repository's Pages settings and chosen publishing workflow before enabling deployment. Never assume a push has published successfully without inspecting the Pages deployment and the live site.

## Build locally

Install Node.js 22 or later. Use the source directory as the working directory:

    for f in js/*.js scripts/*.js tests/*.js; do node --check "$f"; done
    node tests/verify.js
    node tests/contact-form.test.js
    node tests/unit-conversion-property.test.js
    SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js
    SITE_URL=https://clerfit.github.io/Clerfit node scripts/verify-staging.js

The build recreates dist/ and excludes development reports/tests from the published site. To run the browser checks locally, install the test dependencies and Chromium, start a static server rooted at dist/, then run scripts/browser-smoke.js and scripts/accessibility-smoke.js against that local server URL.

## Verify the deployed website

After an authorized deployment has completed, run:

    node scripts/verify-production.js https://clerfit.github.io/Clerfit/

Replace the URL if another host is selected. The script checks the homepage, contact page, sitemap, robots rules, not-found page and all 118 registered calculator routes and writes a production smoke report.

Review the response headers separately. GitHub Pages does not apply Netlify's _headers rules; headers such as HSTS and X-Frame-Options need support from the selected host or CDN. The current legacy pages also contain inline JavaScript, which means their current Content Security Policy permits inline scripts; a stricter policy requires script refactoring or carefully generated hashes.

## Contact form and manual accessibility

The mocked contact tests verify frontend success/error/reset behavior but cannot establish Formspree authorization or inbox delivery. With the owner's consent, send a harmless live test message and confirm receipt at the intended inbox; do not submit private health information.

Automated axe-core reports are a useful blocker-finding layer, not proof of full WCAG conformance. Complete keyboard-only and physical-device checks, including TalkBack/VoiceOver/NVDA where applicable, focus/escape behavior, reduced-motion and text zoom, viewport orientation, contrast in dynamic states, and contact delivery. Record evidence against the exact deployed release. Do not label an untested external or manual check as passed.
