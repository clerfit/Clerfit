# ClerFit Phase 5 — Production Readiness and Acceptance Closure

Status: STARTED (parallel work may proceed; does not waive Phase 4 or Phase 3 gates).

Baseline: `main` after Phase 4 Mosteller BSA regression merge `421de95517531dec0af868d9f76c908daa4f22fe` (2026-10-18). Re-run applicable checks against the exact candidate SHA before release.

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


## Execution log — 2026-10-18

- Phase 4 PR #30 added reference-derived Mosteller BSA and input-domain tests; formula regression and Phase 1/2 verification passed on the PR head before squash.
- Phase 4 PR #31 added a source-gap snapshot covering 41 route rows; PR #34 is the cleanly rebased continuation to replace generic reference placeholders and consolidate official/primary sources. It must pass the full workflow before merge.
- Phase 4 PR #33 adds non-diagnostic interpretation boundary regressions for waist, waist-to-height and waist-to-hip context. Formula regression passed; the full Phase 1/2 run was cancelled by workflow concurrency and must be rerun after the current verification run completes.
- Current main's exact-SHA production/live route and security-header evidence has not yet been recorded after the latest merges. Older live audit results in the Phase 3 register are not post-merge verification.
- Owner-required items remain open: exact reference ZIP parity, manual/device accessibility, consented real contact delivery, exact PageSpeed 404 URL, hosting/header control and independent qualified review.


## Execution log — exact main revision `799bcce2232a69c5923ef3e98bc696831fc3ae32` (2026-10-18, latest run)

- **Deployment build: PASS** — [Pages build/deployment run 39115533834](https://github.com/clerfit/Clerfit/actions/runs/39115533834).
- **Live production verifier: PASS** — [run 39115534388](https://github.com/clerfit/Clerfit/actions/runs/39115534388).
- **Live performance/header audit workflow: PASS** — [run 39115534382](https://github.com/clerfit/Clerfit/actions/runs/39115534382). This is a passing automated audit, not a claim that GitHub Pages can set arbitrary response headers; see the hosting caveat above.
- **Live calculator interaction smoke: first attempt FAILED on a single transient HTTP 503 for `html/bmi-change.html`** — 117/118 routes loaded, 117 primary actions clicked, zero mobile overflows. The failure also produced derivative “missing input/action/navigation” assertions because the route returned 503; these are not independently proven page defects. A rerun of the failed job has been queued to distinguish transient host/CDN availability from a reproducible broken route: [run 39115534348](https://github.com/clerfit/Clerfit/actions/runs/39115534348).
- **PAL input-domain fix is on main** at this revision. Its dedicated browser tests are being preserved in the open PAL PR; do not call that dedicated suite passed until its exact current revision checks complete.
- Phase 1/2 full exact-main verification was interrupted by workflow concurrency on the first attempt; a new run was triggered on the subsequent candidate. Keep the exact-SHA gate open until it finishes.
- **Still owner/external-dependent:** exact reference ZIP parity, manual device/keyboard/screen-reader acceptance, real consented contact submission and inbox confirmation, the exact PageSpeed 404 URL, control of production response headers beyond GitHub Pages capabilities, and independent qualified review of health-related formulas.


## Execution log — exact main candidate `9b89a0c81ef6af8e5abe43ea9300bf966459653d` (2026-10-18)

- **Pages deployment: PASS** — [run 39115777210](https://github.com/clerfit/Clerfit/actions/runs/39115777210).
- **Live production verification: PASS** — [run 39115777476](https://github.com/clerfit/Clerfit/actions/runs/39115777476).
- **Phase 3 boundary guardrail: PASS** — [run 39115777544](https://github.com/clerfit/Clerfit/actions/runs/39115777544).
- **Live performance/header audit workflow: PASS** — [run 39115777396](https://github.com/clerfit/Clerfit/actions/runs/39115777396). The report observed HSTS (`max-age=31556952`) but no CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy or Permissions-Policy response headers. GitHub Pages does not apply repository `_headers`/Netlify header configuration; these headers remain a hosting/CDN owner decision.
- **Live 118-route interaction smoke: PASS** — [run 39115777368](https://github.com/clerfit/Clerfit/actions/runs/39115777368): 118/118 routes loaded, 118 primary actions clicked, zero mobile overflow, zero page errors, zero console errors, seven targeted unit checks passed.
- **Full Phase 1/2 verification on this exact SHA: PASS** — [run 39115777450](https://github.com/clerfit/Clerfit/actions/runs/39115777450), including regression checks, staged route/canonical/local-asset verification, 118-route interaction/semantic-boundary smoke, and all-page axe accessibility smoke.
- The earlier live smoke HTTP 503 for `html/bmi-change.html` was transient: the retry passed without code changes. Keep the failed first attempt in the evidence history; the successful retry is the current result.
- PAL input validation and its educational definition are now on main. A zero-age PAL regression was added. The target-heart-rate input validation fix is also on main at this candidate and its Phase 3 boundary guardrail passed.
- **Open remediation:** [PR #44](https://github.com/clerfit/Clerfit/pull/44) addresses carbohydrate/fat intake calculator age truncation, invalid activity/unit/macro domains, converted-measurement validation, stale results and accessible inline errors. It remains unmerged and is not counted as shipped in this candidate.
- **Phase 5 remains open for release acceptance**, not for lack of these automated results but because the following require unavailable owner evidence or authorization: exact `ClerFit_R3_NEW_UI_COMPLETE.zip` parity; manual keyboard/screen-reader/zoom and physical-device acceptance; a consented real contact submission plus destination inbox confirmation; exact PageSpeed 404 URL; supported host/CDN configuration for missing response headers; and independent qualified review of health-related formula interpretation. Do not mark these passed by inference.
