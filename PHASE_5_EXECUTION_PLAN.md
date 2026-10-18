# ClerFit Phase 5 — Production Readiness and Acceptance Closure

Status: STARTED (parallel work may proceed; does not waive Phase 4 or Phase 3 gates).

Baseline: `main` after Phase 4 regression merge `2e810ff64db327510f2af7c53d3fe023d247f74e` (2026-10-18). Re-run applicable checks against the exact candidate SHA before release.

## Purpose

Turn the remaining release-readiness evidence into actionable, auditable closure work. Phase 5 may prepare fixes and repeatable checks while Phase 4 completes its formula/source-evidence criteria; it must not mark earlier phases passed by assumption.

## Workstreams

1. **Production parity and deployment evidence**
   - Verify that GitHub Pages serves the intended current main revision after deployment.
   - Check homepage, sitemap, robots, contact page, and representative calculator routes for successful responses, canonical consistency, and required local assets.
   - Record tested SHA, URLs, timestamps, and workflow evidence. A PR-head test is not a post-merge production test.

2. **Security headers and hosting decision**
   - Record actual response headers from the production host.
   - GitHub Pages does not apply Netlify `_headers`; do not claim that file configures production headers there.
   - Document the supported hosting/CDN change needed for CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy and Permissions-Policy. Do not change hosting or DNS without explicit owner authorization.

3. **Performance and accessibility acceptance**
   - Keep automated 118-route browser smoke and axe scans as repeatable regression checks.
   - Capture current performance measurements and route-level failures.
   - Track manual keyboard-only, screen-reader, zoom/contrast and physical phone/tablet/laptop acceptance as owner-required until actual results are recorded.

4. **Contact and broken-link closure**
   - Keep mocked contact tests separate from real delivery evidence.
   - Obtain an owner-authorized, consented submission and inbox confirmation before marking live contact delivery passed.
   - Reproduce the PageSpeed 404 only when the exact reported URL is supplied; do not invent the missing URL.

5. **Formula and content handoff**
   - Carry forward the Phase 4 scientific/source register. Engineering tests are not clinical certification.
   - Track external qualified review for health-related formulas and interpretation separately.
   - Record each remaining issue as fixed with evidence, blocked by a named dependency, or owner-required.

## Exit criteria

- Relevant CI and deployment checks pass on the exact release candidate SHA.
- Live route/asset/canonical checks correspond to that SHA.
- Security-header and hosting status is evidence-based; any unsupported configuration is explicitly marked unresolved.
- Accessibility/device and real-contact checks have actual recorded evidence or remain explicitly open.
- No unresolved blocker is described as passed. Phase 3/4 exit requirements are not bypassed by starting Phase 5.

## Immediate execution order

1. Preserve the merged Phase 4 regression batches and their exact PR-head workflow evidence.
2. Run one exact-main candidate verification after the current merge and record its SHA.
3. Update the release register with evidence and owner blockers rather than rerunning already-passed historical checks.
4. Continue Phase 4 source/boundary review alongside production-readiness preparation.
