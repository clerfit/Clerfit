# ClerFit — Impeccable Technical Audit (164 calculator routes)

Audit snapshot: 2026-11-16  
Scope: `clerfit/Clerfit`, development branch `feature/calculator-guides-all-pages`  
Mode: Operate — calculator task completion and reliability  
Status: Provisional; current candidate browser and accessibility verification remains in progress.

## Audit health score

| Dimension | Score / 4 | Evidence and limitation |
|---|---:|---|
| Accessibility | 2 | The staged axe scan covered 173 HTML documents with zero confirmed axe violations and zero uncaught page errors. It still records incomplete/manual-review items for color contrast across 173 pages and accessible-name/content checks across 41 pages. Manual contrast, keyboard and assistive-technology review is not complete. |
| Performance | 2 | The supplied PageSpeed screenshots tested `https://clerfit.github.io/`, whose preview is GitHub's 404 page. The result cannot be used as the ClerFit performance baseline. A fresh Lighthouse run against `https://clerfit.github.io/Clerfit/` is required. |
| Responsive design | 2 | An earlier staged mobile-portrait smoke run exercised 164 routes with no horizontal overflow. A new all-route mobile-landscape, tablet and desktop layout suite has been added but is awaiting its first completed run. |
| Theming | 2 | The stylesheet contains a mixture of shared tokens and direct color declarations. Full token coverage, dark-theme behavior and manual contrast sampling have not been certified. |
| Implementation integrity | 2 | The active registry, guide catalog, formula matrix and audit register now cover 164 routes. The 46 routes missing from the historical 118-row matrix have method notes and browser known-answer tests added; current-candidate end-to-end verification is still pending. |
| **Total** | **10 / 20** | **Acceptable — significant verification work remains before release.** |

## Implementation integrity verdict

**FAIL — release evidence is not yet complete.**

The implementation now has a coherent route registry, shared calculation engines, a calculator-specific guide catalog, a mandatory page acceptance standard and a 164-row evidence register. However, the 46 additional route tests and new unit-conversion paths must pass on the same candidate SHA, and tablet/desktop plus manual accessibility checks remain outstanding. A route must not be marked complete merely because it renders or its Calculate button responds.

## Executive summary

- Active routes: 164.
- Historical formula matrix: expanded from 118 to 164 rows.
- Additional routes beyond the historical matrix: 46; formulas/methods and source/method basis documented, route-specific browser known-answer cases added, CI pending.
- P0: 0 known.
- P1: 3 release-blocking evidence gaps.
- P2: 4 verification and accessibility gaps.
- P3: 1 design-system documentation gap.

## Findings by severity

### P1 — Major / release gate

1. **PageSpeed measured the wrong URL.**  
   Location: supplied PageSpeed report and project deployment path.  
   Impact: the screenshot preview is GitHub's 404 page, so the 100 Performance, 55 Accessibility and 82 SEO scores do not describe ClerFit.  
   Recommendation: rerun Mobile and Desktop Lighthouse against `https://clerfit.github.io/Clerfit/` and representative calculator URLs. Do not use the root-path report as release evidence.

2. **46 calculator routes were absent from the historic 118-route formula matrix.**  
   Location: `CALCULATOR_VERIFICATION_MATRIX.csv`, `js/calculator-guide-catalog.js`, shared body-composition and anthropometric engines.  
   Impact: the old 118/118 claim did not cover the current 164-route registry.  
   Recommendation: the matrix and register have been expanded to 164; route-specific known-answer browser cases are added. Require the current Phase 1/2 workflow to pass before marking these routes PASS.

3. **Measurement-unit gaps existed in shared calculator engines and legacy pages.**  
   Location: `js/body-composition-methods.js`, `js/anthropometric-calculators.js`, `html/absi.html`, `html/heat-exposure.html`, `html/cold-exposure.html`.  
   Impact: users could not consistently enter equivalent imperial values, or a formula could consume a value in the selected unit as though it were still canonical.  
   Recommendation: page-local selectors and canonical conversion have been added for mass, length, area, volume and temperature paths; known-answer equivalence tests are included and must pass on the current candidate.

### P2 — Minor / verification required

4. **Color contrast requires manual review.**  
   Location: shared CSS and 173 scanned HTML pages.  
   Impact: axe reported incomplete contrast checks, not confirmed violations; users with low vision may still encounter low-contrast text.  
   Recommendation: inspect the sampled incomplete nodes, calculate contrast for actual rendered foreground/background pairs, then fix shared tokens or component-specific styles. Do not count incomplete nodes as passes.

5. **Accessible-name/content review remains open.**  
   Location: 41 pages with axe incomplete label/content-name checks.  
   Impact: screen-reader users may receive ambiguous or redundant control names.  
   Recommendation: inspect the actual target nodes, preserve visible labels and add accessible names only where needed; rerun axe and manual keyboard/screen-reader checks.

6. **Tablet and desktop layout verification is pending.**  
   Location: all 164 calculator routes.  
   Impact: mobile portrait success does not prove landscape, tablet or desktop layouts are free of clipping and horizontal overflow.  
   Recommendation: run the new responsive smoke suite at mobile landscape, tablet and desktop widths; repair all reproducible overflow and clipped-control findings.

7. **Correct production performance baseline is missing.**  
   Location: GitHub Pages deployment.  
   Impact: no trustworthy current LCP, INP/Total Blocking Time, CLS or Speed Index evidence is available from the supplied 404 report.  
   Recommendation: rerun PageSpeed on the project path and compare real results before setting performance release claims.

### P3 — Polish

8. **Design-token coverage is not fully inventoried.**  
   Location: `css/style.css`.  
   Impact: direct color declarations can drift from shared tokens and make contrast maintenance inconsistent.  
   Recommendation: inventory repeated color values and consolidate only verified duplicates into existing tokens; preserve the current ClerFit visual identity.

## Positive findings

- The current registry contains 164 routes, and the guide catalog and audit register now match it.
- Every active calculator has a calculator-specific guide method entry; generic fallback formula descriptions are rejected by regression tests.
- The 46 additional routes now have documented formulas/methods, assumptions and source/method notes.
- A previous staged browser run loaded and exercised all 164 routes, with zero missing input/action/result targets, zero page errors, zero console errors and zero mobile horizontal overflow.
- A previous axe run covered 173 pages with zero confirmed axe violations and zero uncaught page errors. Incomplete checks remain open for manual review.
- Formula regression, Phase 3 boundary guardrail and Phase 6 release packaging passed on candidate commit `96bd2c6a`; the expanded matrix, responsive suite and latest changes require a fresh full Phase 1/2 run.

## Current release gates

1. Current Phase 1/2 workflow passes, including all 164 route interactions, 26 body-composition known-answer cases, remaining anthropometric cases, legacy unit-equivalence cases, responsive viewport checks and all-page axe scan.
2. Review incomplete contrast and accessible-name nodes; record confirmed defects and retest.
3. Run PageSpeed against `https://clerfit.github.io/Clerfit/` on Mobile and Desktop.
4. Complete tablet/desktop visual checks and manual keyboard/screen-reader review.
5. Update audit-register rows with exact passing candidate SHA; no blanket PASS labels.
6. Keep this PR draft until all release gates pass; merge only after explicit review of the candidate.

## Safety / release note

All work is on `feature/calculator-guides-all-pages` and PR #107. Production `main` and the live website have not been modified by this audit work.
