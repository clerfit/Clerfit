# ClerFit release-acceptance gap register — 17 November 2026

Scope: current 164-calculator registry and the production site at https://clerfit.github.io/Clerfit/.

This register records observed evidence only. A code change, an earlier passing run, a draft PR, or a local staging result is not production acceptance.

## Current candidate evidence

| Gate | Evidence | Status |
|---|---|---|
| 164-route registry / matrix parity | PR #109 adds 46 entries and a register-integrity assertion against the central 164-route registry | Implemented; fresh exact-head run pending |
| Formula and known-answer tests | Run 43934415282 failed in the new anthropometric test due to an invalid ALMI test unit; fixture corrected to 200 cm | Corrected; unverified |
| JavaScript syntax | Run 43934415315 failed on malformed escaped newline in body-composition test footer; footer corrected | Corrected; unverified |
| 164-route browser smoke | Run 43934414997 completed successfully on the pre-fix candidate | Pass on prior candidate only; rerun after fixes |
| Production staging/package | Run 43934415049 completed successfully on the pre-fix candidate | Pass on prior candidate only; rerun after fixes |
| All-page axe scan | Run 43934415315 did not reach axe: build was skipped after syntax failure and the always-run scan had no dist site to serve | Not run on that candidate; fresh scan required |
| Input-boundary inventory | FIELD_VALIDATION_AUDIT.csv contains 297 numeric-field rows across 116 HTML pages; 285 rows say structural bounds match source, 10 say handler range exists, and the audit explicitly says semantic edge cases are not exhaustive. The 164-route registry has 48 routes not represented in this numeric-field audit. | Partial; exhaustive semantic boundary verification for all 164 routes is not complete |
| Responsive browser coverage | Prior all-route smoke passed; full matrix across phone portrait/landscape, tablet and desktop must be rerun on corrected head | Partial / rerun required |
| Code quality | Shared calculation modules and tests received focused review; legacy page-specific scripts, CSS cascade and all HTML remain broader work | Partial |
| Independent expert review | No independent qualified reviewer has signed the 164 methods/formulas | Not complete |
| Production security headers | Repository contains a root _headers file, but production is GitHub Pages. GitHub Pages does not provide custom response-header configuration through _headers; that syntax is supported by Cloudflare Pages. The live response headers have not been independently captured in this audit | Hosting/configuration blocker; not verified |
| Manual acceptance | Physical phone/tablet, keyboard-only, screen-reader, zoom/reflow, real contact-form delivery and owner acceptance are not proven by automated CI | Not complete |

## Exact corrections already committed to this branch

- d93b4f2815bcacebe15c337f5033021f17f4e2f8: repaired the invalid body-composition test footer.
- 5b8dc3afdb6a23a6b248378f49768617c5fa8122: corrected the ALMI test fixture to pass 200 cm (the helper accepts cm or inches).
- b92ee79c71fead2a4e93e344b1f66e91165214a1: removed a manually stated assertion count that was not verified.
- 0c95373fa033da844164f5e6617b4cb9c596078d: updated the 164-route audit report so it no longer claims the failed workflow passed.

These commits are on audit/fix-all-164-calculators; production main has not been changed or deployed by this work.

## Required closure sequence

1. Run all formula, syntax, field-boundary, register, page-specific and unit-conversion tests on one exact PR head; fix every failure.
2. Run the production staging build and route/integrity checks on that same SHA.
3. Run the full 164-route browser interaction suite, including valid, invalid, empty, minimum, maximum, unit-switch, reset and stale-result scenarios for each calculator; retain route-level reports.
4. Run all-page axe scans on the built staging site. Resolve critical/serious violations and manually review incomplete checks, contrast and accessible names.
5. Run responsive browser checks at phone portrait, phone landscape, tablet and desktop breakpoints; inspect screenshots and horizontal overflow.
6. Complete source-quality review across all legacy page scripts, shared JS, HTML and CSS; add regressions for every corrected defect.
7. Obtain an independent qualified subject-matter review of empirical/health-related methods, age/sex scope, units, assumptions, citations and limitations. Record reviewer identity/qualification and exact commit reviewed; do not fabricate sign-off.
8. Resolve hosting headers: either move/proxy the site through a platform that can actually emit the intended headers (for example Cloudflare Pages/Worker) or document the GitHub Pages limitation and accepted residual risk. Test actual GET responses for HTML, JS, CSS, images, 404 and redirects after deployment. Do not treat the checked-in _headers file as effective on GitHub Pages.
9. Complete manual keyboard, screen-reader, zoom/reflow and real-device checks; submit and verify a consented real contact form; review live PageSpeed against the exact project URL.
10. Merge/deploy only after required checks and human sign-offs are recorded. Verify the deployed SHA and production routes/headers after deployment.

## Release decision

**NOT READY / DO NOT MERGE OR DEPLOY.** The corrected code has not yet produced a fresh green CI run; accessibility scan on the failed candidate never executed; independent expert review, production response-header verification, and manual acceptance remain open.
