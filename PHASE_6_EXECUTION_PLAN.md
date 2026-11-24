# ClerFit Phase 6 — Release Packaging and Sign-off

Status: IN PROGRESS. This phase can validate reproducible candidate packaging, but it cannot override unresolved Phase 3–5 acceptance gates.

## Objective

Create a reproducible production-site ZIP from the exact tested main revision, validate archive integrity and required route/assets, retain a SHA-256 checksum and exact commit reference, and publish a candidate artifact for review. Do not replace or modify ClerFit_R3_FINAL_RELEASE.zip; it is a protected reference archive. Do not call a candidate the final release until all required acceptance gates have evidence.

## Workstreams

1. **Candidate packaging**
   - Build the production staging directory with scripts/build-site.js using the canonical GitHub Pages base URL.
   - Package only the staged deployable site, not source-control metadata, tests, or local development files.
   - Record the exact source commit SHA in the artifact metadata.

2. **Archive integrity and content**
   - Run unzip -t against the generated ZIP.
   - Verify the archive includes the homepage, 404 page, contact/privacy/terms/disclaimer pages, CSS, JavaScript, images, sitemap, robots and web manifest.
   - Verify all 118 registered calculator routes are present in the packaged site and match the sitemap.
   - Generate and retain a SHA-256 checksum for reproducibility.

3. **Exact candidate verification**
   - Require the existing Phase 1/2 regression, staging, browser-interaction and accessibility workflows to pass on the candidate SHA.
   - Require deployment and live production checks after any runtime-affecting merge.
   - Treat documentation-only changes separately, but still record the exact SHA and CI outcome.

4. **Release decision**
   - Publish the ZIP as a candidate artifact while required owner/expert gates remain open.
   - Do not mutate or replace ClerFit_R3_FINAL_RELEASE.zip.
   - Keep release acceptance open until exact ClerFit_R3_NEW_UI_COMPLETE.zip parity is possible, the complete 242-field/runtime semantic review is evidenced, manual accessibility/device checks are recorded, a consented live contact submission reaches the intended inbox, the exact PageSpeed 404 URL is checked, supported hosting/CDN headers are resolved or explicitly accepted by the owner, and independent qualified formula review is recorded.

## Exit criteria

- The ZIP is generated from a known, verified commit.
- Archive integrity and required-file/route checks pass.
- The artifact includes a SHA-256 checksum and source SHA.
- Candidate CI and deployment checks are recorded against the same source revision.
- Every remaining blocker is explicitly marked open; no unverified requirement is represented as passed.

## Initial evidence and blockers

- The current site has a 118-route registry, 123-URL sitemap, static build/verification scripts, 242 static numeric fields, and CI for formula regression, staging, browser interaction and automated accessibility.
- Latest runtime revision before this phase: c5586e427684d793b10ec01099f9e24fc84a5c66; its Pages deployment, live production verification, 118-route interaction smoke, Phase 1/2 verification, Phase 3 boundary guardrail and performance/header audit workflows passed.
- A subsequent documentation-only Phase 5 evidence commit a9189af83712eea35e8177d4b42486aac27f1430 has its own deployment and Phase 1/2 workflows running; do not record those as passed until they finish.
- Phase 5 and final release acceptance remain open for the owner/expert/hosting dependencies listed above.


## Execution log — candidate packaging run 39116688149 (2026-10-18)

- **Candidate build and staging validation: PASS** on exact source SHA `ea437f2b8b10e4ec9dc821d4dc477e40030e1aa2`.
- **Required-file and route validation: PASS** — all 118 registered calculator routes were found in the staged package and matched sitemap entries.
- **ZIP integrity: PASS** — `unzip -t` succeeded for the generated candidate archive.
- **Artifact uploaded: PASS** — [Phase 6 packaging run](https://github.com/clerfit/Clerfit/actions/runs/39116688149). Artifact: `clerfit-r3-candidate-ea437f2b8b10e4ec9dc821d4dc477e40030e1aa2`, size 1,280,304 bytes, artifact digest `sha256:115c66dfd3408a34a72fbad24077cc3b243c50f5646af20e285ee2343931f68a`, retained until 2026-11-17. The artifact contains the candidate ZIP, ZIP checksum file, and source-SHA file.
- This is a **release candidate**, not a final release or proof of exact reference-archive parity. Phase 5/overall acceptance blockers remain open as enumerated above.

## Execution log — latest live audit and deployment (2026-10-19)

- **Latest production commit:** \`925625245ab92a77bfc6292736bb50a6471ad72c\`. The Pages deployment completed successfully: [deployment run](https://github.com/clerfit/Clerfit/actions/runs/39258109916). The merge added audit tooling only; calculator/site source files were unchanged.
- **Phase 1/2 regression, staging, 118-route browser interaction and 124-page axe scan: PASS** on the latest main commit: [verification run](https://github.com/clerfit/Clerfit/actions/runs/39258110678).
- **Live production privacy and numeric-boundary audit: PASS** on the latest main commit: [audit run](https://github.com/clerfit/Clerfit/actions/runs/39258110642). It checked 123 published pages (homepage, all 118 calculator routes, Contact, Privacy, Terms and Educational Disclaimer), inspected 291 visible numeric inputs, checked 291 below-min and 291 above-max cases, found zero unexpected third-party requests, zero runtime storage/cookie/beacon write attempts, and zero audit failures. The audit deliberately did not submit the contact form.
- **Live browser interaction smoke: PASS** on the preceding runtime-source revision: 118/118 routes loaded, 118/118 primary actions invoked, zero mobile overflow findings, zero page errors and zero console errors. See [browser run](https://github.com/clerfit/Clerfit/actions/runs/39255001086).
- **Live production structure: PASS** on the preceding runtime-source revision: 118 calculator routes, 123 sitemap URLs, 123 fetched HTML pages, 159 same-site references and zero verifier failures. See [production verification](https://github.com/clerfit/Clerfit/actions/runs/39255001492).
- **Mobile Lighthouse with simulated throttling: PASS** on the preceding runtime-source revision: Performance 98/100, Accessibility 100/100, Best Practices 100/100, SEO 100/100; FCP 1.1 s, LCP 1.3 s, Speed Index 2.3 s, TBT 130 ms, CLS 0.041 and Interactive 1.5 s. See [performance/header run](https://github.com/clerfit/Clerfit/actions/runs/39255001028).
- **Response-header limitation confirmed:** GitHub Pages supplies HTTPS/HSTS, but the live response did not include CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy or Permissions-Policy response headers. Meta CSP/referrer policies exist in the HTML, but cannot replace all response headers. Enforcing the missing headers requires a hosting/CDN configuration with custom-header support; this repository alone cannot configure GitHub Pages response headers.
- **Release verdict remains candidate, not final sign-off.** Remaining non-device dependencies: (1) the exact original \`ClerFit_R3_NEW_UI_COMPLETE.zip\` archive is not available in the current project files, so byte-level archive parity cannot be proven; (2) a consented live contact submission and receipt in the intended inbox have not been verified; (3) the exact PageSpeed-reported 404 URL was not supplied, although generic/deep-path 404 behavior and metadata have regression coverage; (4) response-header hardening requires a host/CDN decision; and (5) independent qualified scientific review is not something automated tests can certify. The current formula register is a code-level desk review, not clinical/peer-reviewed certification.
