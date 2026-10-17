# Phase 1 route register — scope and status semantics

Refreshed: 2026-10-17

This folder-level audit evidence is published to make the review actionable:
- `PHASE_1_CALCULATOR_INVENTORY.csv` maps every registered calculator to its file and sitemap route.
- `PHASE_1_SIGNOFF_REGISTER.csv` preserves the route/page-level evidence from the `phase-1-complete-project-audit` remediation branch, including interaction, boundary, reset, keyboard, mobile, Axe and production-parity fields.
- `PHASE_1_FINDINGS_REGISTER.csv` lists the prioritized defects, remediation steps, dependencies and release-gate flags.

Important: this register is a **baseline evidence snapshot**, not a claim that the exact current `main` SHA is signed off. Its source-local PASS records identify tests that passed on the remediation branch at the noted revisions. The current main branch now has the targeted calculator fixes and a new end-to-end CI gate, but the latest exact-main run must pass before carrying any baseline PASS forward as current acceptance. Where evidence is historical, unavailable or owner-gated, the status remains open.

The exact newest NEW_UI_COMPLETE archive was discoverable in the Library but not available as raw bytes in this execution; an older R3 final archive was inspectable. Therefore exact newest-archive parity is not asserted. Live contact delivery, physical-device acceptance and independent domain/expert review remain owner/expert gates.
