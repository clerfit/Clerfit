# ClerFit site quality review — 20 November 2026

## Scope

Reviewed all 164 calculator routes and their education panels, the 172 sitemap URLs, SEO audit metadata, the scientific review register, shared calculator logic, page markup, and the available route and layout regressions. This is a source-level review with automated checks; it is not external clinical certification or a full manual visual review on every device and browser.

## Findings and corrections

- Forty-six newer calculator pages had generic guides and lacked Open Graph and Twitter metadata. Each now has a route-specific explanation of its method, measurement protocol, and interpretation limits; social titles and descriptions match the page metadata and canonical URL.
- Added scientific-review register entries for those calculators; the register now covers all 164 registered routes.
- Corrected health copy that implied BMI, resting-energy estimates, heart rate, body composition, MET values, nutrition estimates, or sleep-duration variability could diagnose or predict disease. The BMI page distinguishes adult screening from child and teen BMI-for-age interpretation.
- Removed unsupported individual-risk claims from the ABSI applications list. The page reports raw ABSI without inventing an individual risk tier.
- Expanded the reference library with the original Jackson–Pollock and Durnin–Womersley papers and original and independent evaluations of the Body Adiposity Index.
- Updated the SEO audit summary to cover the current public URL set and metadata checks.

## Scientific notes

The named skinfold and BAI methods now identify their source studies and population limits. The YMCA formula remains labeled as a rough estimate because its original source lineage and validation sample were not established during this review. Ratio, circumference, z-score, and body-composition pages distinguish exact arithmetic from empirical or device-reported measurements and avoid unsupported universal thresholds.

The scientific register records code-level desk review only. No external clinician or subject-matter expert certification is claimed.

## Verification

Added regression checks for public sitemap metadata, canonical/Open Graph URL agreement, unique calculator-guide coverage, scientific-register consistency, and known-answer vectors for the shared body-composition formulas. Existing route, formula, sitemap, and layout checks were also run against the review snapshot. GitHub Actions supplies clean-checkout verification when the pull request opens.
