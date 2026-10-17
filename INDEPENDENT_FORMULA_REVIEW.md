# ClerFit R3 — Formula-by-Formula Scientific Desk Audit

Audit date: 2026-10-16  
Scope: 118 registered calculator routes, their documented methods, formula implementations, known-answer tests, input constraints, and health/specialist interpretations.

## Outcome

- 118/118 registered routes have a passing known-answer or method-specific regression vector in `tests/verify.js`.
- The implementation was cross-checked against the formula/method matrix and the sources recorded in `SOURCES_AND_METHODS.md`; route-specific notes and classifications are in `SCIENTIFIC_REVIEW_REGISTER.csv`.
- 242 static numeric inputs have explicit HTML `min`, `max`, and `step` constraints and are inventoried in `INPUT_BOUNDARY_VERIFIED.csv`. A few inputs are created dynamically at runtime and are covered only where interaction tests exercise them.
- Unit conversion property tests cover known answers, round trips, incompatible dimensions, and non-finite values.
- Adult BMI categories are not applied to minors; the pediatric BMI route does not invent percentiles. The Metabolic Age route does not fabricate a metabolic-age score. Raw ABSI and custom face/posture/fatigue/recovery indices do not receive unsupported universal risk or quality tiers.
- MET calorie estimates use the documented MET convention; heat index and wind chill are presented as environmental indices, not guaranteed safe exposure times.

## Corrections made during the 16 October follow-up pass

- **BMI Change:** corrected the visible formula documentation and both CSV audit records to `goal BMI − current BMI`, matching the implementation. Removed age-free adult BMI categories because the page does not collect age; the result now presents the signed numeric difference and a screening-measure caveat. Added a regression assertion for the sign convention and absence of unsupported adult categories.
- **One-Rep Max:** constrained repetitions to integers from 1 through 15 to avoid invalid or nonsensical equation domains; added handler-level validation; results now use the selected kg/lb unit. Removed universal “High/Moderate/Low Accuracy” grading and replaced it with uncertainty language. Synced the boundary CSVs to the actual source constraints and added regression tests for invalid repetitions and unit display.
- **Ponderal Index:** aligned the formula audit table with the implementation and scientific register: mass (kg) divided by height (m) cubed, output kg/m³.
- **Audit traceability:** regenerated the static input boundary CSVs from current HTML and synchronized the BMI Change and One-Rep Max method descriptions in the formula matrix and scientific register.

## Important scientific distinction

A known-answer vector verifies a defined input/output pair; it does not prove all inputs, all populations, all measurement protocols, or every boundary combination. Exact arithmetic and unit conversions can be checked mathematically. Published empirical equations can be compared with their source papers and tested for implementation fidelity, but remain estimates. Site-defined face, posture, recovery, fatigue, and performance scores have no universal scientific standard; these are deliberately classified as descriptive/heuristic and must not be presented as diagnoses or validated universal rankings.

This is a formula-by-formula code-level desk review by the assistant, not a regulated clinical validation, peer-reviewed certification, or sign-off by a licensed clinician/engineer. Where the scientific literature does not establish a universal method, the appropriate action is to label the metric as descriptive rather than fabricate a citation or threshold.

## Key authoritative references used

- CDC BMI calculation and age-specific interpretation: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html and https://www.cdc.gov/bmi/child-teen-calculator/index.html
- Mifflin–St Jeor resting energy equation (1990): https://pubmed.ncbi.nlm.nih.gov/2305711/
- Mosteller body-surface area equation (1987): https://pubmed.ncbi.nlm.nih.gov/3657876/
- RFM equation (2018): https://www.nature.com/articles/s41598-018-29362-1
- ABSI original paper (2012): https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0039504
- Rohrer/Ponderal Index (mass ÷ height³) method: https://www.measurement-toolkit.org/anthropometry/anthropometric-indices/ponderal
- National Academies sodium/potassium DRI (2019): https://www.nationalacademies.org/read/25353
- National Academies dietary fiber DRI (2005): https://www.nationalacademies.org/publications/10490
- NIST SI conversion factors: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors
- National Weather Service heat index equation: https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
- National Weather Service wind chill guidance: https://www.weather.gov/safety/cold-wind-chill-chart
- Tanaka et al. predicted maximum heart rate: https://pubmed.ncbi.nlm.nih.gov/11153730/
- Adult Compendium of Physical Activities: https://pacompendium.com/

## Verification commands

- `node tests/verify.js` — PASS
- `node tests/contact-form.test.js` — PASS (mocked Formspree response; not real delivery)
- `node tests/unit-conversion-property.test.js` — PASS
- `node scripts/generate-sitemap.js --check` — PASS
- `SITE_URL=https://clerfit.github.io/Clerfit node scripts/build-site.js` — PASS

## Still outside this local desk audit

Live deployment and actual contact delivery are left to the owner as requested. Real network/header inspection at the live host, production performance under a throttled connection, and manual keyboard/screen-reader/physical-device acceptance are not claimed as complete. GitHub Pages does not apply Netlify `_headers` configuration; if hosted on GitHub Pages, server response headers such as HSTS and `X-Frame-Options` require a hosting/CDN layer that supports them. Meta CSP is present in the HTML, but it is not a substitute for every response header.
