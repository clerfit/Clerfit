# ClerFit Phase One — Audit Register and Exit Gate

**Refreshed:** 2026-10-17  
**Repository:** https://github.com/clerfit/Clerfit  
**Audit work product:** COMPLETE for the source inventory, known automated evidence and prioritized findings  
**Automated source-level sign-off:** PASS on tested implementation snapshot `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`.  
**Manual/owner/expert release acceptance:** OPEN for the explicitly listed non-automated obligations; this is not a clinical or regulatory certification.

## Scope and inventory

The registry contains 118 calculator routes. The reconciled requirements inventory records 110 distinct requested calculators across 11 categories; extra registered routes are not automatically duplicates, and route count is not proof of formula correctness. The R3 package has 127 HTML documents including root pages, nested calculators, aliases and utility pages.

The source inventory, formula/method register, input-boundary CSVs, accessibility reports, release guide and calculator regression suite are present in the project. Historical reports are retained as historical evidence rather than relabelled as fresh tests.

## Fresh static audit performed in this attempt

The available release archive, ClerFit_R3_FINAL_RELEASE(1).zip, was extracted and inspected locally. Results for the 127 HTML documents:

| Check | Result |
|---|---:|
| Documents with a non-empty title | 127/127 |
| Documents with exactly one H1 | 127/127 |
| Documents with a declared language | 127/127 |
| Documents with viewport metadata | 127/127 |
| Documents with duplicate IDs | 0 |
| Unnamed visible form controls, buttons or links under the static check | 0 |
| Images missing an alt attribute | 0 |
| Missing local HTML/resource paths | 0 |
| Numeric inputs missing min, max or step | 0 |

The following local archive checks passed: JavaScript syntax checks across js/scripts/tests; node tests/verify.js (118 calculator routes covered by at least one known-answer or method-specific vector); node tests/contact-form.test.js (mocked endpoint responses only); node tests/unit-conversion-property.test.js; and node scripts/generate-sitemap.js --check. A new targeted validation-accessibility regression also passed against the corrected validator source. These archive checks are not represented as a full test run against the exact current GitHub HEAD.

The live homepage was reachable during this pass and advertised 118 calculators across 11 categories. The most recent repository changes now give each invalid numeric input its own error element and connect it via aria-describedby while preserving existing help descriptions. The new test checks sibling-field isolation and cleanup.

## Prioritized findings and dispositions

### Correctness and trust
- **Improved:** Route-level known-answer/method-vector coverage exists for 118/118 registered routes.
- **Improved:** Additional formula-aware semantic bounds and unsupported-unit checks have been added for multiple high-risk calculators, including WHR, RFM, energy calculators, face measurements, METs/cardio expenditure, monthly weight change and step length.
- **Still open:** HTML min/max/step values are not a substitute for a justified semantic range on every one of the 238 static numeric fields plus generated controls. Some combinations and alternate-unit extremes need route-specific negative, zero, min/max, extreme and cross-field tests.
- **Still open:** A passing regression vector demonstrates implementation consistency for that vector; it does not confer universal clinical, scientific or athletic validity. Site-defined facial/posture/performance metrics remain descriptive unless supported by a recognized standard.

### Accessibility and interaction
- **Improved:** Source-level audit found no unnamed controls on the available archive; numeric validation errors now expose invalid state and are explicitly associated with inputs. A regression test now guards unique error nodes and independent cleanup for sibling fields.
- **Passed automatically on current source SHA `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`:** the full staging workflow ran axe-core on 124 user-facing HTML pages with zero critical/serious violations or scan failures. The separate 118-route browser smoke also passed. **Still open:** manual keyboard-only, screen-reader and physical-device acceptance; automated checks do not replace these.
- **Still open:** Physical phone/tablet testing, orientation changes, zoom, reduced motion, and complete focus/error/result-announcement review.

### Release and external dependencies
- **Passed automatically on current source SHA `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`:** GitHub Pages deployment and live production verification confirmed release marker `R3-2026-10-17-phase12-a11y-v1`; 118 calculators, 123 sitemap pages, 123 HTML pages fetched and 158 same-site references checked, with zero production verifier failures. Response-header hardening is still host-dependent on GitHub Pages.
- **Still open:** Submit a real, consented contact form message and confirm delivery to the intended inbox. Mocked endpoint success/failure tests do not prove delivery.
- **Passed automatically on current source SHA `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`:** current-source Playwright smoke exercised all 118 calculator routes, clicked each primary action, found no route/navigation failures, uncaught page errors, console errors or mobile horizontal overflow; targeted unit and boundary checks also passed. **Still open:** throttled-network/performance profiling and full human visual review across actual devices.
- **Still open:** Independent domain review is needed where formulas or thresholds materially affect health decisions. This project audit is not clinical, regulatory or professional engineering certification.

## New audit artifacts and automated acceptance coverage

Added `PHASE_1_CALCULATOR_INVENTORY.csv`, `PHASE_1_SIGNOFF_REGISTER.csv`, and `PHASE_1_FINDINGS_REGISTER.csv` with per-route mapping, historical evidence, prioritized issues and blockers. `PHASE_1_ROUTE_REGISTER_NOTES.md` identifies the provenance of those route-level records and explicitly cautions that branch-local PASS evidence is not the same as a fresh sign-off for the newest main SHA.

Restored build/staging parity scripts and added a single source-check workflow that can run the formula suite, per-page regressions, staging/URL checks, 118-route Playwright interactions and all-page axe checks. This closes a prior automation/integration gap, but a workflow file being committed is not itself proof that its run passed. The latest run must be checked in GitHub Actions before releasing the source.

The source fixes in this pass also include a keyboard focus/link contrast patch and a page-chrome accessibility enhancement that restores semantic main landmarks on legacy pages and supplies names for otherwise unnamed controls and links.

## Exit gate

**Phase One audit and automated source-level exit gate: PASS** on current source SHA `486f6c6613b5611d2bd365b1cc21e0e7fba743a3`. The route inventory, findings/registers, static checks, build/staging parity, 118-route browser run, 124-page axe scan and live production verifier all passed. The overall human/owner acceptance record remains **OPEN** only for field-by-field semantic-bound review across all 238 static fields and generated controls, a real consented contact-form delivery, physical-device/manual assistive-technology checks, weak-network/performance checks, and expert validation where a formula materially affects health decisions. This distinction is intentional; the automated source gate is complete, while those manual/external obligations are not falsely certified.
