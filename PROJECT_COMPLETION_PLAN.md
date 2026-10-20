# ClerFit — Final A-to-Z Completion Plan

This plan is ordered by dependency. The first four workstreams can be carried out against the source archive; the final deployment checks require repository/host access.

## Workstream 1 — Formula verification, route by route

**Scope:** All 118 entries in `CALCULATOR_VERIFICATION_MATRIX.csv`.

For each route:
1. Record the exact implemented formula, input units, output units, rounding and assumptions.
2. Link an authoritative primary/official reference for established formulas; for ordinary arithmetic, document the mathematical identity.
3. For custom descriptive metrics, state that there is no accepted clinical norm and do not assign fabricated categories.
4. Add a reference-derived known-answer vector and boundary vectors (minimum, maximum, zero where valid, negative where valid, invalid denominator, missing values and unit-switch round trips).
5. Correct mismatches, rerun tests, and update the matrix only with evidence.

**Exit criterion:** All 118 routes have formula/method evidence, known-answer and boundary tests, and zero unexplained failures.

## Workstream 2 — Input semantics and validation

**Scope:** All 241 static numeric fields in `FIELD_VALIDATION_AUDIT.csv`, plus dynamically generated fields in the 24 advanced definitions.

For each field, verify requiredness, domain range, step precision, valid combinations, unit-specific bounds, clear error messaging, keyboard focus and whether zero/negative values are valid. HTML attribute presence alone is not considered semantic approval.

**Exit criterion:** Every numeric field has a reviewed rationale for its bounds and passing boundary tests; invalid input never produces a misleading result.

## Workstream 3 — UI, accessibility and interaction regression

Re-run browser interaction checks after formula/input changes. Cover all routes, every primary action, reset behavior, search, dropdowns, FAQ, image viewer, global and per-field units, keyboard-only operation, focus visibility, screen-reader names, contrast, responsive widths and portrait/landscape orientation.

**Exit criterion:** No unresolved functional defects, uncaught runtime errors, missing assets, horizontal overflow or critical accessibility findings.

## Workstream 4 — Contact form

The local mock tests already cover success/error UI behavior. With consent, submit one live test message to the configured Formspree endpoint and verify delivery, authorization, duplicate handling and network failure behavior.

**Exit criterion:** Delivery to the intended inbox and failure handling are demonstrated with evidence.

## Workstream 5 — Deploy and verify production

1. Integrate this archive into the existing `clerfit/Clerfit` repository or the selected host.
2. Enable GitHub Pages via Actions if using the included workflow; alternatively deploy the staged `dist/` folder through Netlify, which honors `_headers`.
3. Verify the production URL and canonical base path. The included workflow currently targets `https://clerfit.github.io/Clerfit/`.
4. Run `node scripts/verify-production.js <production-base-url>` from the source folder and resolve every failed route/canonical/sitemap/robots/HTTPS check.
5. Inspect security-header warnings; use a host that supports the required headers if the current host cannot provide them.
6. Complete live contact testing and real-device accessibility QA.

**Exit criterion:** Production smoke report has zero failed routes and correct canonical/sitemap/robots data; live contact delivery and security headers are verified; device/accessibility checklist passes.

## Workstream 6 — Release packaging and sign-off

Run the full syntax and regression suite, static integrity checks, production build, and `unzip -t` on the final archive. Ensure the ZIP matches the tested source and attach the final verification report.

**Exit criterion:** All requirements in the master checklist are marked verified, with no unverified item represented as passed.

## Current boundary

The source project now includes the build pipeline, GitHub Pages workflow, production smoke script, formula sources, per-route matrix, field inventory and automated tests. This environment has no repository write credential or hosting account credential and cannot send a real Formspree message; it cannot perform the live deployment-dependent workstreams by itself. The plan and workflow are included so the deployment can be triggered when the source is integrated into the repository and Pages is configured.
