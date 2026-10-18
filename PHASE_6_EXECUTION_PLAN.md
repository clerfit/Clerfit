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
