# ClerFit Code Quality Improvement Plan

## Why this work is needed

The codebase has grown through multiple feature and responsive-fix passes. Some source files contain compressed JavaScript, long HTML lines, and CSS overrides that have accumulated over time. This makes the project harder to review and increases the risk of regressions when a shared rule is changed.

## Principles

- Preserve calculator formulas, validation rules, accessibility behavior, URLs, metadata, and visual design unless a change explicitly targets them.
- Prefer small, reviewable changes over a repository-wide rewrite.
- Keep the production branch protected from unreviewed cleanup.
- Remove obsolete CSS only after confirming that no page or component relies on it.
- Keep shared behavior in shared modules rather than copying it across calculator pages.

## Work sequence

### Phase 1 — Formatting baseline

- Add editor and formatter conventions.
- Make the central calculator registry readable without changing its data.
- Establish a contribution guide and a repeatable review process.

### Phase 2 — JavaScript structure

- Refactor `js/navigation.js` into clearly named sections and small functions.
- Refactor `js/home.js` into readable rendering, search, filtering, and event-binding functions.
- Preserve the registry contents and compare before/after behavior.

### Phase 3 — CSS architecture

- Inventory repeated selectors, duplicate declarations, and conflicting media queries.
- Consolidate rules by component and breakpoint.
- Replace repeated magic values with documented custom properties where that improves consistency.
- Remove obsolete overrides only after checking the affected pages at phone, tablet, and desktop widths.

### Phase 4 — HTML and calculator templates

- Establish a clean, semantic template for calculator pages.
- Migrate calculator pages in small batches, preserving each calculator's formula and input/output behavior.
- Keep metadata, canonical URLs, structured data, labels, and accessible controls intact.

### Phase 5 — Verification

- Add automated checks that fit the static-site architecture.
- Check registry-to-file consistency, local links, duplicate IDs, and basic HTML validity.
- Run calculator interaction and input-validation regression checks.
- Verify representative phone, tablet, and desktop layouts before merging.

## Current first-pass changes

- `js/navigation.js`: formatted the existing 164-entry registry as readable multi-line objects. The registry data and order are preserved.
- `.editorconfig`, `.prettierrc.json`, and `.prettierignore`: added shared formatting conventions.
- `CONTRIBUTING.md`: documented expectations for future changes.

## Verification status

The registry was parsed as JSON before formatting and its entry count was confirmed as 164. This is a structural check only; it does not replace browser, calculator, accessibility, or cross-device regression testing. No production deployment has been made as part of this branch.
