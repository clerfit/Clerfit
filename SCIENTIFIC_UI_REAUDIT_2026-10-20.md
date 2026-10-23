# Scientific, Mathematical, UI, and Full-Requirements Re-audit — 20 October 2026

## Executive disposition

**Status: PARTIAL PASS — not independently release-certified.** This is a source-and-evidence re-audit, not a claim that every formula, edge case, health interpretation, physical-device state, or live delivery path has been independently verified. It assesses the `main` baseline `e7ca8b97db5b3683d6df08993c94a268f9473e72` and documents proposed corrections on branch `scientific-ui-audit-2026-10-20`.

## What has been verified from repository evidence

- The current registry contains **118 unique calculator routes** in **11 live categories**, with no repeated route slugs or target files detected in the registry extraction.
- Each registered route has at least one passing known-answer or method-specific regression vector in the verification matrix/test suite. A selected vector passing is not exhaustive proof of a formula or all input combinations.
- The scientific review register has 118 route rows. The route-level method classifications distinguish published/empirical equations from site-defined descriptive or heuristic measures; the register itself states that external clinician/subject-matter expert certification is not claimed.
- The latest baseline Phase 1/2 CI run [39395940163](https://github.com/clerfit/Clerfit/actions/runs/39395940163) reported success for syntax checks, route/formula regression, source/inventory and sitemap consistency, validation/accessibility checks, unit conversion tests, 118-route browser interaction smoke, and automated axe checks. The GitHub Pages deployment run [39395938524](https://github.com/clerfit/Clerfit/actions/runs/39395938524) reported success for the same baseline.
- The inventory on `main` had 242 static numeric input controls. This proposed branch removes one unused numeric age input from the activity-factor page; the current source and synchronized field inventories therefore contain **241 static numeric controls**. Historical phase reports still describe their dated 238/242-field snapshots and are not silently rewritten.

## Corrections included in this branch

### 1. Correct the “PAL” naming and output

**Finding:** The former `pal.html` called a selected factor “PAL” but returned one of six fixed values (1.2, 1.375, 1.55, 1.725, 1.9, 2.0). It collected age and sex even though neither input affected the returned value, displayed the top factor as “2.0+” while code returned exactly 2.0, and rounded 1.375 to 1.38 in the result.

**Scientific basis:** FAO/WHO/UNU defines physical activity level (PAL) as total energy expenditure over 24 hours divided by basal metabolic rate over 24 hours. A conventional activity multiplier selected from a menu is not a measurement of that ratio. See [FAO, Human energy requirements, §3.4.2](https://www.fao.org/4/Y5686E/y5686e05.htm).

**Change:** The page and registry now call it **TDEE Activity Factor** (keeping the existing URL and search aliases for compatibility), remove the unused age/sex fields, label the six values as conventional illustrative multipliers, display the exact value, correct “2.0+” to “2.0”, and state that the page does not calculate formal PAL or TDEE. Tests were added for a known factor and invalid category.

### 2. Make adult BMI categories consistent at class boundaries

**Finding:** The baseline result/indicator showed “Obesity class II or higher” from BMI 35 upward, making class III indistinguishable at BMI 40 and above.

**Basis:** CDC adult categories (age 20+) are class I 30 to less than 35, class II 35 to less than 40, and class III 40 or greater. Child/teen BMI is interpreted with sex- and age-specific percentiles rather than adult cutoffs. Sources: [CDC adult categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html) and [CDC child and teen categories](https://www.cdc.gov/bmi/child-teen-calculator/bmi-categories.html).

**Change:** The BMI result and indicator now use matching class I/II/III boundaries. Regressions exercise BMI values 30, 35, and 40. Existing pediatric interpretation safeguards are retained.

### 3. Make the TDEE equation display match its arithmetic

**Finding:** The TDEE value was calculated using the unrounded BMR estimate, while the displayed equation substituted rounded BMR before multiplication. That could make the displayed equation disagree with the result.

**Change:** The displayed equation now uses BMR to two decimals and states that the final kcal/day value is rounded to the nearest whole kcal. A known-answer test checks 70 kg, 175 cm, age 30, male reference, and factor 1.55.

### 4. Distinguish the Mifflin–St Jeor REE prediction from directly measured BMR

**Observed:** The BMR page, shared engine, and TDEE formula line used the Mifflin–St Jeor equation while labelling the output as BMR. The original 1990 paper explicitly describes a predictive equation for resting energy expenditure (REE) derived from measured REE in healthy adults aged 19–78; it does not produce an individually measured basal metabolic rate. The prior BMR content also listed fatigue, cold sensitivity, weight gain, and possible thyroid problems as “related health problems” from a high/low calculated value, which was not justified by this estimate alone.

**Basis:** [Mifflin et al., *A new predictive equation for resting energy expenditure in healthy individuals* (1990)](https://pubmed.ncbi.nlm.nih.gov/2305711/) describes REE and reports an adult study population aged 19–78.

**Change:** The BMR page and shared engine now label the result as a predicted REE estimate while retaining “BMR” in the route name for search/URL compatibility. The page explains that REE and BMR are not direct synonyms, discloses the original study population, removes unsupported low/high BMR health-problem claims, and warns that the result is neither TDEE nor a personalized calorie prescription. The TDEE formula now identifies the Mifflin–St Jeor REE estimate and the activity multiplier as assumptions. A regression asserts the REE label and displayed equation.

## Full requirement status

| Requirement area | Evidence-backed status | Remaining work / limitation |
|---|---|---|
| Registry, routes, files, sitemap | Automated structural checks pass on baseline; 118 routes are registered | New category coverage requires actual route/source/test implementations, not catalogue documents alone |
| Scientific formulas and mathematical correctness | 118/118 routes have at least one known-answer/method vector and a method/source register | Independent row-by-row source comparison for every route, unit convention, rounding, population applicability, branch conditions and formula-specific boundaries remain open |
| Health/nutrition interpretations | Many methods carry warnings and estimate caveats; register says no external expert certification | Qualified subject-matter review and local/population applicability assessment remain open; outputs are not clinical certification |
| Numeric inputs | Baseline had 242 controls; current proposed branch has 241, with synchronized structural inventories and count tests | Semantic minimum/maximum/step suitability, unit conversion limits, zeros/negatives, cross-field dependencies, and edge vectors for every static and generated control remain open |
| UI behaviour | Baseline passed automated 118-route browser smoke | Full manual review of each field/result/table/tooltip/invalid state/reset, responsive states and stale-result clearing still needs human inspection |
| Accessibility | Automated axe and source-level accessible-name/focus checks passed on baseline | Full keyboard-only journey, real screen-reader review, zoom/reflow, touch target and physical mobile/tablet testing remain open |
| SEO/build/deploy | Baseline canonical/sitemap/assets and Pages deployment CI passed | Verify proposed branch's CI, then confirm deployed SHA/live parity, response headers, and performance under weak/throttled networks |
| Contact, privacy and security | Mocked form success/failure tests and source-level checks exist | Real consented form delivery, production cookie/storage/network inspection, and actual hosting response-header audit remain open |
| Category roadmap | Current website has 11 live route categories | The planned 50-category taxonomy is not implemented in the live registry. Phase 14–17 catalogues are candidate inventories, not built calculators |
| Phase 13 | Re-audit notes exist | Implementation completion is not established; keep Phase 13 open until source/routes/tests prove it |

## Inventory and document consistency

- The live registry contains 11 categories, not 50. Current category counts on the baseline are: Body Measurements & Composition 13; Face & Aesthetics 10; Metabolism & Calories 10; Nutrition & Hydration 10; Muscle, Strength & Performance 10; Cardio & Endurance 12; Fat Loss & Weight Goals 10; Recovery, Sleep & Fatigue 10; Health, Posture & Medical 12; Utility & Tools 11; Lifestyle, Age & Environment 10.
- The master requirements checklist still marks formula/reference validation as pending for some routes. A route's passing test vector must not be interpreted as completion of independent reference validation.
- Some older artefacts contain 238-field audit-time counts; reports dated after that update record 242. The proposed branch has 241 after removing the unused age input. The old artifact-verification JSON has a pre-update timestamp and must not be treated as the current inventory.
- The current `FIELD_VALIDATION_AUDIT.csv`, `INPUT_BOUNDARY_VERIFIED.csv`, `scripts/sync-input-boundaries.js`, and count-enforcing tests have been updated together for the proposed 241-field source.
- No claim is made that the assistant has manually operated every page on real hardware, completed full screen-reader tests, verified actual Formspree email receipt, or received clinical sign-off.

## Exit criteria before claiming complete

1. For all 118 routes, independently record the implemented formula, authoritative source, supported population, units/conversions, rounding policy, expected values and limitations; reconcile every pending status in the master checklist.
2. Test semantic bounds and cross-field/unit combinations for all 241 static numeric controls and the runtime-generated controls, including lower/upper, zero, negative, non-finite and invalid-unit cases where relevant.
3. Wait for the exact pull-request SHA's CI and browser/a11y runs, inspect any failures, then check the merged deployment and live parity.
4. Complete manual keyboard, screen-reader, mobile/tablet portrait/landscape, zoom/reflow, contrast and weak-network/performance tests.
5. Verify real contact-form delivery with consent, production network/storage/cookie boundaries, and actual hosting security headers.
6. Build and test all intended category/phase calculators, reconcile duplicates with the 118 existing routes, and update registry, navigation, sitemap, formulas, tests and accessible UI for every new calculator.

## References used for the focused checks

- FAO/WHO/UNU, [Human energy requirements — PAL definition](https://www.fao.org/4/Y5686E/y5686e05.htm).
- CDC, [Adult BMI categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html).
- CDC, [Child and teen BMI categories](https://www.cdc.gov/bmi/child-teen-calculator/bmi-categories.html).
- CDC, [Extended BMI-for-age growth charts](https://www.cdc.gov/growth-chart-training/hcp/extended-bmi-growth-charts.html).
- Woolcott & Bergman, [Relative Fat Mass as a new estimator of whole-body fat percentage](https://www.nature.com/articles/s41598-018-29362-1).
- Mifflin et al., [Resting energy expenditure prediction equation](https://pubmed.ncbi.nlm.nih.gov/2305711/).
- NIST, [Guide to the SI conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors-numbers).
- W3C, [WCAG 2.2 target-size guidance](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

This is an engineering and source-level re-audit, not clinical certification, regulatory approval, or a guarantee that every real-world interaction is correct.
