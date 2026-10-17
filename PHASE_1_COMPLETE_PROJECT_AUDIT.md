# ClerFit Phase 1 — Complete Existing-Project Audit

Audit branch: `phase-1-complete-project-audit`  
Baseline branch inspected: `main`  
Repository: https://github.com/clerfit/Clerfit  
Audit date: 2026-10-17  
Scope: repository tree, central calculator registry, sitemap, existing SEO/performance/security/release reports, supplied PageSpeed screenshots, shared accessibility code, documentation consistency, and a 123-page sign-off register.

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

## Page-by-page remediation status

### Page 1 — BMI Calculator (`html/BMI.html`) — source-local sign-off achieved

Completed on the audit branch and tested in GitHub Actions run #45:

- Fixed input limits to match the selected weight and height units, including kg/lb and cm/m/in/ft.
- Used the exact pound-to-kilogram conversion factor consistently and covered the converted 500 kg boundary with a focused test.
- Added reset behavior that clears inputs, validation errors, output and indicator, restores metric defaults, and returns focus to Weight.
- Cleared stale BMI output whenever relevant values/units change. This fixes the case where shared validation intercepts an invalid Calculate click and the older answer could otherwise remain visible.
- Matched the age input bounds to the calculator's actual 2–120 year domain and preserved the special age-specific interpretation message for ages 2–19 rather than assigning adult categories.
- Added an accessible result announcement region, formula text and table column-header scopes.
- Added a VM-based behavioral test and Chromium/Playwright checks for metric and imperial known answers, supported-unit bounds, pediatric interpretation, invalid values, reset, focus, no horizontal overflow at 320 px, clean local asset/runtime results, and Axe accessibility.
- Updated the generated Home/Contact link labels to match their visible content after Axe identified label-content mismatches.

**Result:** GitHub Actions run #45 reports both `formula-regression` and `bmi-browser` jobs successful. The Axe scan reports zero violations for this local test build.

**Not claimed:** This is not yet production/live sign-off. The deployed BMI URL returned “not accessible via this tool” from the web inspection path, which is not an HTTP status result; a direct live HTTP response, PageSpeed rerun and the current release-ZIP comparison still need evidence.

The per-page register now records these distinctions instead of marking BMI “not run.”

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

1. Inspected the repository tree and central calculator registry.
2. Confirmed 118/118 calculator target files exist in the repository tree; no duplicate registry slugs or case-insensitive filenames were found.
3. Compared the 118 calculator routes to sitemap mappings; sitemap has 123 unique URLs.
4. Read existing SEO, performance/security, accessibility and release-status reports and preserved their explicit test limitations.
5. Reviewed all supplied PageSpeed screenshots. Recorded the reported mobile scores: Performance 100, Accessibility 55, Best Practices 92, SEO 82. Findings shown include insufficient text contrast, links distinguished by color alone, links without discernible names, missing main landmark, and a failed HTTP 404 status.
6. Added a **123-page sign-off register** at `PHASE_1_SIGNOFF_REGISTER.csv`. It records per-page verification state instead of treating route presence as proof of working behavior.
7. Implemented a shared runtime fallback in `js/page-chrome.js`: legacy `.main` containers receive a main landmark if none exists, and unnamed anchors receive a fallback accessible name derived from their destination or identifying class/ID.
8. Added visible link underlines, keyboard focus indicators, a forced-colors focus fallback, and darker text for table row labels/breadcrumbs in `css/style.css`.
9. Corrected stale README instructions that incorrectly described Home/Contact links as floating and global unit preference as persistent.
10. Kept the changes on the separate audit branch; production/main has not been changed or deployed.

## Phase 1 exit blockers and next verification actions

These are deliberately marked open; a source patch is not proof that Lighthouse, a real browser, or the deployed host now passes.

- [ ] **Release ZIP:** The current turn's mounted uploads contain the PageSpeed screenshots but not the named `ClerFit_R3_COMPLETE_PRODUCT.zip`. Archive hashes and ZIP-to-repository parity cannot be established without the actual archive.
- [ ] **Production:** Direct live-site inspection was not accessible from the available web inspection path in this run. Verify exact public URLs, response codes, redirects, assets, console errors and headers using a live HTTP/browser environment.
- [ ] **PageSpeed:** Re-run the exact same production URL on mobile and desktop. The screenshot's 404 may refer to a URL/path error; it must not be assumed to be fixed by the source edits.
- [ ] **Interaction testing:** The 123-page sign-off register marks interactions, validation, results, reset/unit behavior, keyboard operation and mobile layout as not yet run in this environment. Exercise every calculator, not just the home page or a sample.
- [ ] **Accessibility:** Re-run Lighthouse/axe and manual keyboard checks after deployment. Verify each contrast pair, each previously unnamed link, main landmark, labels/errors, focus order, zoom/reflow and reduced-motion behavior. Runtime fallback patches are not yet browser-verified.
- [ ] **Calculator correctness:** Existing reports say 118 routes have regression vectors and that a scientific review register exists; those are prior evidence, not a fresh rerun. Execute all tests from the exact source revision and reconcile the per-calculator scientific register.
- [ ] **Contact delivery:** Mocked tests do not prove live Formspree delivery. Confirm an authorized test submission reaches the intended inbox.
- [ ] **Privacy/security/hosting:** Confirm the actual host and response headers. GitHub Pages does not enforce `netlify.toml` or `_headers` rules merely because they exist in the repository.
- [ ] **Sign-off:** Reclassify each row of `PHASE_1_SIGNOFF_REGISTER.csv` only after evidence is collected. Do not convert an untested or blocked row to PASS.

## Phase 1 exit criteria

Phase 1 is complete only when the exact source archive, repository, and live release are reconciled; every registered calculator and public page has an evidence-backed status; PageSpeed issues have been reproduced or explicitly disproven; fixes have been re-tested; and the sign-off register has no unresolved release-blocking rows. BMI has passed source-local CI/browser checks, but the site-wide phase is **not signed off** because 117 other calculator pages and the remaining public routes still need the same page-by-page treatment, and archive parity/live-host checks remain open.

## Safety of changes

This branch includes targeted shared accessibility and documentation changes, plus audit artifacts. It does not alter calculator formulas or deploy to production. All new runtime behavior must be regression-tested before merge.
