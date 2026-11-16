# ClerFit — Calculator Page Acceptance Standard

Status: Mandatory engineering and QA standard for all 164 active calculator routes.
Applies to: every page in `js/navigation.js`, not only routes listed in the historical 118-entry verification matrix.

## Acceptance rule

A route is not complete because it has a title, visible inputs, a Calculate button, or a plausible-looking number. Each applicable requirement below must be verified against the actual page and calculation engine. A route may be marked PASS only when reproducible evidence is recorded. Use NOT_APPLICABLE only with a short explanation; do not silently skip a requirement.

## Required page checklist

1. **Identity and scope** — title, category, purpose and intended user population match the route registry.
2. **Formula or method** — exact equation, algorithm or measurement-derived operation is documented. State whether it is a standard equation, empirical estimate, arithmetic comparison, geometry proxy or user-supplied assessment value. Never invent a clinical estimate.
3. **Reference and assumptions** — cite a primary or authoritative source for published methods; document coefficient tables, population, sex/age restrictions, canonical units and assumptions. Mark descriptive metrics as descriptive rather than validated clinical standards.
4. **Inputs** — every required field has a clear label, accessible association, appropriate type, unit, range and step. Conditional fields must appear only when relevant.
5. **Page-local units** — offer appropriate selectors for convertible physical quantities and convert to canonical units before calculation. Unit selectors must be local to the calculator; never add a global unit preference. Dimensionless values, percentages, age-in-years and fixed-protocol quantities such as skinfold millimetres may remain unitless/fixed when that is method-correct.
6. **Formula execution** — Calculate invokes the real calculation path; outputs are derived from current inputs and never hard-coded or decorative.
7. **Known-answer tests** — at least one independent known-answer vector per formula path, including sex/age branches and conditional variants where applicable.
8. **Unit-equivalence tests** — equivalent metric and imperial inputs produce the same canonical result within a stated numerical tolerance wherever alternate units are supported.
9. **Validation and boundaries** — test empty, non-numeric, non-finite, zero-denominator, negative, exact lower/upper, just-outside and incompatible-unit cases. Reject invalid values with actionable messages.
10. **Results and interpretation** — show units, precision, method and meaning. Separate numerical arithmetic from clinical interpretation; avoid unsupported categories, thresholds or guarantees.
11. **Reset and recovery** — Reset clears fields, errors and outputs; editing a field or changing a unit invalidates stale results; a corrected input can calculate again.
12. **Tooltips** — provide the small round contextual help control for specialist or non-obvious inputs, explaining what to measure and how.
13. **Complete guide** — include a collapsed-by-default, calculator-specific guide with purpose, equipment where relevant, preparation, step-by-step use, accuracy tips, interpretation and limitations/safety.
14. **Accessibility** — semantic landmarks and headings, visible focus, keyboard operation, accessible labels/names, announced results/errors, adequate contrast and WCAG 2.2 AA checks.
15. **Responsive behavior** — verify narrow mobile portrait, mobile landscape, tablet and desktop; no horizontal overflow, clipped controls, overlapping navigation or undersized touch targets.
16. **Reliability and privacy** — no uncaught console errors, broken local assets/routes, accidental network submission or browser storage of measurement data. Any external data transfer must be explicitly disclosed and consented to.

## Test evidence required per route

- Route and exact source commit SHA.
- Formula/method and source reference.
- Input inventory with units and bounds.
- Known-answer input/output pair and independent expected result.
- Unit-conversion equivalence pair where applicable.
- Invalid/boundary test results.
- Browser interaction result (load, calculate, reset, edit/recalculate).
- Mobile/tablet/desktop overflow result.
- Accessibility scan findings and manual checks still outstanding.
- Defects, fix commit and successful retest SHA.

## Status vocabulary

- **PASS** — directly tested and passed on the recorded SHA.
- **FAIL** — a reproducible defect exists.
- **PENDING** — not yet tested on the candidate SHA.
- **NOT_APPLICABLE** — requirement genuinely does not apply, with reason.
- **BLOCKED** — cannot be tested due to an external dependency; state the dependency.

## Release gate

All 164 active routes must have a complete audit-register row. No route may be called formula-verified unless it has a route-specific method/reference and known-answer evidence. All P0/P1 defects must be fixed and retested. A clean automated suite does not replace manual screen-reader, physical-device or qualified clinical review.
