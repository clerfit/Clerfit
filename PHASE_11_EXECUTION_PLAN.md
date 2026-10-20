# ClerFit Phase 11 — Release Hardening and Evidence Alignment

Status: STARTED — documentation and reproducible checks first; runtime changes require a demonstrated defect and regression test.

Baseline: `main` at `0c5afcaafefbbd54a2804ca6e074a1a51bf8a82d` (2026-10-19). Phase work must be tested against the exact commit being reviewed.

## Objective

Make the release evidence match the current source, close reproducible software defects without disturbing the 118-calculator inventory, and prepare an honest release decision. This phase does not claim that physical-device testing, independent expert review, or live contact delivery has been completed.

## Workstreams

1. **Evidence freshness and traceability**
   - Reconcile formula, input-boundary, scientific-review, and phase status files with current HTML/JS and current test output.
   - Flag any audit output that was generated from earlier constraints or source revisions; regenerate it from current source rather than treating historical output as current proof.
   - Record the exact tested SHA and links to the associated workflow runs.

2. **Mathematical regression and input-domain guardrails**
   - Preserve the 118-route registry and per-route known-answer coverage.
   - Run current formula, page-specific, unit-conversion, boundary-inventory, and sitemap tests.
   - Add regression assertions only for reproducible defects or gaps, including unit-switch round trips, zero denominators, non-finite inputs, invalid enum values, and just-outside limits.
   - Keep formula arithmetic correctness separate from clinical validity of empirical estimates and descriptive metrics.

3. **Release consistency**
   - Ensure the calculator registry, inventory, sitemap, canonical URLs, and staged output remain aligned.
   - Verify all 118 calculator routes and required supporting pages/assets remain included.
   - Do not change hosting, DNS, form destinations, or user-facing health claims without a verified reason.

4. **Regression and acceptance record**
   - Re-run relevant workflows after every runtime change and record exact results.
   - Do not mark manual phone/tablet/desktop acceptance, full keyboard/screen-reader review, independent qualified formula review, production contact delivery, or live performance acceptance as passed without direct evidence.
   - Physical-device testing remains a later owner-led gate as requested.

## Exit criteria

- No route is removed or duplicated; all 118 registered calculators remain represented in inventory and sitemap.
- Formula and input-boundary evidence is generated from the current source revision.
- All relevant automated tests pass on the exact Phase 11 candidate SHA.
- Any defects found are fixed with regression tests or explicitly listed as open with the reason.
- The release record clearly separates automated engineering checks from owner/expert/manual acceptance.

## Initial findings carried into Phase 11

- Main has a central 118-route registry and a formula/method vector for each route.
- A prior boundary JSON report does not fully reflect current BMI limits (the source currently validates canonical weight 2–500 kg and height 0.5–2.74 m). Historical boundary reports must not be cited as fresh proof until regenerated.
- The current BMI, RFM, BMI-change, Mosteller BSA, Ponderal Index and ABSI implementations were spot-checked. Those spot-checks do not substitute for the full regression suite.
- Existing workflow results are tied to their respective historical SHAs; they must not be represented as having run against a later Phase 11 candidate.
- Independent scientific review and manual/live acceptance remain separate from code-level mathematical regression.

## Execution log

- 2026-10-20: Created the Phase 11 work branch from main. Baseline SHA: `0c5afcaafefbbd54a2804ca6e074a1a51bf8a82d`.
- 2026-10-20: Started source-aligned release hardening. No runtime code has been changed in this initial plan commit.
