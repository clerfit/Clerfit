# ClerFit R3 — Release Status Report

Report date: 2026-10-16

## Verdict

**Locally verified release candidate; not yet production-certified.** The exact live release and real contact-message delivery are left to the owner, as requested.

## Completed locally

- 118 registered calculator routes are present; each has a passing known-answer or method-specific regression vector.
- 238 static numeric inputs declare `min`, `max` and `step`; the generated boundary inventory is `INPUT_BOUNDARY_VERIFIED.csv`.
- `SCIENTIFIC_REVIEW_REGISTER.csv` contains a row for every route, with method, classification, source basis, regression status and limitations.
- `INDEPENDENT_FORMULA_REVIEW.md` documents the route-by-route desk review, source families, interpretation guardrails and scientific limitations.
- `node tests/verify.js`, `node tests/contact-form.test.js`, `node tests/unit-conversion-property.test.js`, sitemap check and production build pass.
- Mobile table row-card styling and accessible header labels were added; chart-like bars and moving range indicators are hidden; the floating Home/Contact foreground controls remain disabled.
- No analytics/tag-manager scripts or browser storage APIs were found in user-facing page source. The contact form transmits submitted messages to Formspree after acknowledgement, as disclosed in the privacy notice.
- Terms, Privacy Notice and Educational Disclaimer are included; copyright wording does not claim ownership of third-party trademarks/assets.

## Owner tasks

1. Publish this exact `dist/` build.
2. Verify live domain, HTTPS, deep links, canonical URLs, assets and deployed version.
3. Send a consented test contact message and confirm delivery.
4. Complete real phone/tablet/laptop testing.

## Remaining technical evidence

- Full manual keyboard-only and screen-reader testing.
- Fresh browser visual verification of the latest mobile table CSS (the browser environment blocked local navigation during the last run; earlier browser QA results are retained as historical reports).
- Live performance measurements under throttled/weak-network conditions.
- Production network/storage and response-header inspection.
- Exhaustive semantic range/boundary checks across all inputs and qualified external scientific review where a specialist judgment is needed.

The formula review classifies custom face/posture/fatigue/recovery/performance indices as descriptive where no universal standard exists. A known-answer test is not proof of universal scientific validity. See `FINAL_COMPLETION_REPORT.md` and `PERFORMANCE_SECURITY_AUDIT.md`.
