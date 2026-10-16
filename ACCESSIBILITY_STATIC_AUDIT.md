# ClerFit R3 — Accessibility and Mobile Layout Verification

Audit date: 2026-10-16.

## Static checks and implemented fixes

- All registered calculator pages have `lang`, viewport, description and theme-color metadata.
- Existing static audit records show no missing programmatic names for visible controls, duplicate IDs, or missing image `alt` attributes in the audited runtime snapshots.
- Sidebar uses `aria-controls`/`aria-expanded`, closes with Escape, returns focus to the trigger, and is hidden from focus when closed according to the existing accessibility audit.
- Tooltip controls are styled as compact round controls; reduced-motion support is present in the shared styling.
- Related-calculator section is generated with up to 11 compact links per registered calculator; the grid uses two columns on typical phones and one column on very narrow screens.
- Tables now receive `data-label` attributes from their header cells and are restyled as labelled stacked rows below 600 CSS pixels, rather than requiring horizontal scrolling for the common table layout.
- Visual progress bars and moving range indicators are hidden to comply with the no-dynamic-progress requirement; numerical results and text guidance remain.
- Static source scan found no emoji-range characters in user-facing page source.

## Evidence and limitations

`node tests/verify.js` passes after these changes. The package also retains the earlier `BROWSER_QA_REPORT_FINAL.json` and related runtime smoke reports, which recorded 118 mobile route runs with no horizontal overflow or JavaScript errors at that time.

A fresh browser navigation run in this execution was blocked by the environment's browser policy (`ERR_BLOCKED_BY_ADMINISTRATOR` for local HTTP and file URLs), so the latest table-card CSS could not be visually rerun here. Full manual keyboard-only testing, complete screen-reader testing (TalkBack/VoiceOver/NVDA), contrast across every dynamic state, and physical device portrait/landscape testing remain unverified. Physical-device checks are intentionally left to the owner.
