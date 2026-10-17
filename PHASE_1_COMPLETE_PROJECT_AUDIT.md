# ClerFit Phase 1 — Complete Existing-Project Audit

Audit branch: `phase-1-complete-project-audit`  
Baseline branch inspected: `main`  
Repository: https://github.com/clerfit/Clerfit  
Audit date: 2026-10-17  
Scope: repository tree, central calculator registry, sitemap, existing SEO report, performance/security report, and existing release-status evidence.

## Executive status

**Phase 1 is in progress.** The initial repository inventory and discrepancy register are now documented. This is not a production sign-off and does not claim the live site is fully repaired.

## Verified repository inventory

- Central registry: **118** calculator records.
- Registry target files present: **118/118**.
- Duplicate registry slugs: **0**.
- Duplicate registry filenames (case-insensitive): **0**.
- HTML files under `html/`: **121**.
- All HTML documents across repository: **128**.
- Tracked repository files (tree blobs): **223**.
- Sitemap entries: **123**, with **0** duplicate URLs.
- Sitemap entries reconcile to 118 calculator routes plus homepage, contact, privacy, terms and educational disclaimer.
- Calculator registry category counts:
  - Body Measurements & Composition: 13
  - Face & Aesthetics: 10
  - Metabolism & Calories: 10
  - Nutrition & Hydration: 10
  - Muscle, Strength & Performance: 10
  - Cardio & Endurance: 12
  - Fat Loss & Weight Goals: 10
  - Recovery, Sleep & Fatigue: 10
  - Health, Posture & Medical: 12
  - Utility & Tools: 11
  - Lifestyle, Age & Environment: 10

Full route-by-route presence and sitemap mapping: `PHASE_1_CALCULATOR_INVENTORY.csv`.

## Evidence-based findings

### P1 — Release archive parity is unverified
The release-status report calls the existing release candidate locally verified but not production-certified. The current audit has inspected the GitHub repository, not a user-supplied release ZIP. Therefore, the exact ZIP-to-repository and ZIP-to-live comparisons remain blocked until the latest archive is available and the production deployment can be checked.

### P1 — Production status and PageSpeed findings need reproduction
The repository contains a prior SEO audit and local performance/security audit, but these are not fresh measurements of the current live host. Reproduce each supplied PageSpeed issue on the exact URL and record the affected element, browser evidence, and fix verification. Do not treat a prior local build report as proof of live performance.

### P1 — Deployment headers depend on host
The existing performance/security audit states that `netlify.toml` and `_headers` do not enforce response headers on GitHub Pages. If GitHub Pages is the active host, inspect actual response headers separately and do not claim that host-level HSTS, X-Frame-Options, or other headers are enforced merely because config files exist.

### P1 — Contact delivery is not proven
The existing release status records mocked contact-form tests but leaves actual Formspree delivery unverified. Keep this as a release blocker until a consented live submission is delivered and confirmed.

### P2 — Duplicate contact-page title in previous SEO report
The committed `SEO_METADATA_AUDIT.json` records one duplicate title: “ClerFit – Contact Us” on `dist/contact.html` and `dist/html/contact.html`. Inspect whether the nested contact page is intended to be public, a legacy alias, or should be excluded/canonicalized. Do not delete it without checking inbound links and navigation.

### P2 — HTML inventory counts need one definition
The repository currently has 121 HTML documents under `html/`, 128 HTML documents in total, and 118 registered calculator routes. These are different scopes and must not be reported as interchangeable counts. The release archive's earlier 127-page count may refer to a different revision/build and must be reconciled with the actual ZIP.

### P2 — Existing audit evidence has explicit limitations
Existing reports describe passing local route/formula-method smoke tests and earlier browser runs, but they also leave live-host QA, actual contact delivery, exhaustive semantic input-boundary certification, full keyboard/screen-reader QA, real-device QA, and fresh weak-network measurements unresolved. These remain open until newly tested.

## Phase 1 work completed in this pass

1. Inspected the current repository tree and confirmed the central registry file.
2. Parsed all 118 registry entries and compared each target file against the repository tree.
3. Checked registry slug/file duplicates and found none in the current registry.
4. Compared registered calculator routes against sitemap URLs and checked sitemap URL uniqueness.
5. Read existing SEO, performance/security, and release-status evidence and extracted their stated limitations.
6. Created a route-by-route CSV inventory so later phases can track each calculator with evidence rather than relying on aggregate counts.
7. Recorded the major unresolved parity, deployment, contact-delivery, SEO, and verification risks below.

## Remaining Phase 1 tasks

- [ ] Obtain and inspect the latest release ZIP; compute archive inventory and checksums.
- [ ] Compare ZIP paths and hashes against repository and generated deployment output.
- [ ] Reproduce PageSpeed findings against the exact production URL, including the reported 404, console errors, accessibility score/contrast, link names, and image sizing.
- [ ] Run production route and asset HTTP checks; distinguish expected aliases/404 behavior from broken links.
- [ ] Build a page-by-page interaction inventory covering all 118 calculators, shared navigation, home/contact controls, forms, units, result rendering, reset, keyboard access and responsive behavior.
- [ ] Re-run available tests from the exact inspected source and record commands/results for this audit revision.
- [ ] Finish classification of each finding as complete, correction needed, partial, missing, duplicate, or externally/medically validated.
- [ ] Publish a final Phase 1 sign-off only after the ZIP and live-site evidence are available.

## Phase 1 exit criteria

Phase 1 is complete only when the exact source archive, repository, and live release are reconciled; every registered calculator and public page has an evidence-backed status; PageSpeed issues have been reproduced or explicitly disproven; and all known defects have a prioritized remediation entry. No live deployment change is made by this audit branch.

## Safety of changes

This branch adds audit documentation only. It does not modify production calculator code, formulas, styling, routes, or deployment configuration.
