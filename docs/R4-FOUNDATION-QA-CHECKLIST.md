# ClerFit R4 Foundation QA checklist

This checklist is a release gate, not a statement that tests have already passed.

## Static foundation checks
- [x] Dedicated R4 stylesheet exists and is scoped under `.cf-r4`.
- [x] Tooltip styling exists with keyboard focus and touch-friendly button dimensions.
- [x] Accessible tooltip interaction helper is provided.
- [x] Per-field unit selector pattern uses the existing unit engine's `data-unit-for` association.
- [x] Responsive breakpoints, reduced-motion and forced-colors rules exist.
- [x] R4 files are isolated on `r4/calculator-design-system`.
- [x] Starter page is marked noindex/nofollow and explicitly non-functional.

## Required before an individual calculator is accepted
- [ ] Formula and intended population independently checked against primary/authoritative source.
- [ ] Unit list checked against formula; analyte-specific conversion factors independently verified.
- [ ] Inputs have defensible min/max and validation messages.
- [ ] Tests cover normal, blank, zero, negative, min, max, extreme and invalid inputs.
- [ ] Rounding and significant figures checked.
- [ ] Tooltip measurement protocol verified against a cited standard.
- [ ] Keyboard-only and screen-reader tests completed.
- [ ] Mobile, tablet and desktop browser tests completed.
- [ ] Console/network errors checked.
- [ ] Clinical review completed where the calculator is medical or risk-related.

## Important integration note
The existing unit engine is reused through explicit `data-unit-for` attributes. Its generic conversion table must not be used for analyte-specific conversions (for example mg/dL to mmol/L) without an analyte-specific factor and tests. Keep each unit selector local to its own input; never add a global unit preference.

## R4 release gates
- [ ] Full calculator inventory deduplicated against the active 118-page registry.
- [ ] Every new calculator has a distinct URL and documented owner/category.
- [ ] All new calculator pages pass functional, accessibility and responsive tests.
- [ ] R3 regression suite passes with R4 assets excluded.
- [ ] R4 preview is reviewed before any merge/deployment.
