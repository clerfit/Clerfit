# ClerFit — Formula Sources and Method Notes

This document records credible primary/official sources used for the formula families reviewed in this release pass. A source for a formula does **not** mean that every route using that family has been independently validated against all edge cases. Where a calculator is a custom arithmetic descriptor, it must not be presented as a validated clinical or attractiveness score.

## Official / primary references

| Formula or guidance family | Source | Implementation rule |
|---|---|---|
| Adult BMI formula and categories | CDC: [Adult BMI Categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html), [Calculating BMI](https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html) | Adult categories apply to age 20+; age 2–19 requires sex- and age-specific growth-chart percentiles. BMI is a screening measure, not a diagnosis. |
| BMI-for-age | CDC: [Child and Teen BMI Calculator](https://www.cdc.gov/bmi/child-teen-calculator/index.html) | ClerFit calculates BMI only and links to the CDC reference tool; it does not invent percentiles without the reference data. |
| SI and customary unit conversions | NIST: [Guide to the SI, Appendix B](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors), [Unit Conversion](https://www.nist.gov/pml/owm/metric-si/unit-conversion) | Preserve dimensions, use exact factors where available, and round only displayed final values. |
| Mifflin–St Jeor resting energy expenditure | Mifflin et al., *A new predictive equation for resting energy expenditure in healthy individuals* (1990), [PubMed](https://pubmed.ncbi.nlm.nih.gov/2305711/) | Treat BMR/RMR as estimates. Do not present them as direct measurements or diagnoses. |
| Mosteller body surface area | Mosteller, *Simplified calculation of body-surface area* (1987), [PubMed](https://pubmed.ncbi.nlm.nih.gov/3657876/) | BSA is a calculated estimate; do not assign unsupported universal low/normal/high health categories. |
| Relative Fat Mass | Woolcott & Bergman, *Relative fat mass (RFM) as a new estimator of whole-body fat percentage* (2018), [Scientific Reports](https://www.nature.com/articles/s41598-018-29362-1) | RFM is an adult estimate derived in a specific study population, not a direct body-fat measurement or universal diagnostic category. |
| A Body Shape Index | Krakauer & Krakauer, *A New Body Shape Index Predicts Mortality Hazard Independently of Body Mass Index* (2012), [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0039504) | Raw ABSI values require reference-population standardization for risk interpretation; this site reports the raw index without unsupported universal tiers. |
| Cooper 12-minute run estimate | Cooper test equation and validation literature, including [PubMed Central study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4314605/) | VO₂ max is an estimate from a field test; fitness norms vary by age, sex and population. |
| MET activity values | 2024 Adult Compendium of Physical Activities, [paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/), [Compendium website](https://pacompendium.com/) | MET values depend on activity definition and population. Calorie estimates use the MET convention and remain estimates. |
| Dietary fiber adequacy | National Academies, *Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, and Protein* (2005), [publication](https://www.nationalacademies.org/publications/10490); Academy of Nutrition and Dietetics position paper, [PubMed 26514720](https://pubmed.ncbi.nlm.nih.gov/26514720/) | Use age/sex adequate-intake references or 14 g/1,000 kcal. Do not multiply fiber recommendations by an arbitrary activity factor. |
| Sodium and potassium intake reference values | National Academies, *Dietary Reference Intakes for Sodium and Potassium* (2019), [potassium chapter](https://www.nationalacademies.org/read/25353/chapter/8), [summary](https://www.nationalacademies.org/read/25353/chapter/2) | Use age/life-stage-specific adequate intakes where implemented. Do not multiply reference values by arbitrary exercise or body-size factors. |
| Sleep-duration recommendations | CDC summary of AASM recommendations: [Sleep and Health](https://www.cdc.gov/healthy-schools/sleep/index.html) | Use age-group recommendations rather than invented activity-level ranges. |
| Heat index and wind chill | U.S. National Weather Service: [Heat Index](https://www.weather.gov/tbw/heatindex), [Wind Chill FAQ](https://www.weather.gov/safety/cold-faqs) | Provide the estimated environmental index and general safety context; do not promise an exact safe exposure duration or frostbite time. |
| Predicted maximum heart rate | Tanaka, Monahan & Seals (2001), [PubMed](https://pubmed.ncbi.nlm.nih.gov/11153730/) | Age-based maximum-heart-rate equations have individual error. Target zones are estimates, not a substitute for clinical exercise guidance. |

| Heath–Carter somatotype | Heath & Carter, “A modified somatotype method” (1967), *American Journal of Physical Anthropology*, [DOI 10.1002/ajpa.1330270108](https://doi.org/10.1002/ajpa.1330270108) | This is a specific anthropometric method, not a universal health or performance rating; compare each implemented component equation and measurement protocol with the source. |
| Physical activity level (PAL) | FAO/WHO/UNU, *Human energy requirements*, [PAL definition](https://www.fao.org/4/y5686e/y5686e05.htm) and [adult energy requirements](https://www.fao.org/4/y5686e/y5686e07.htm) | PAL is total daily energy expenditure divided by BMR; group-based classifications are estimates and must not be treated as direct individual measurements. |
| Waist-to-height ratio and central adiposity | NICE NG246, [Identifying and assessing overweight, obesity and central adiposity](https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity) | NICE describes adult waist-to-height interpretation with applicability conditions. ClerFit routes that report ratios without categories must not be represented as reproducing NICE risk classifications. |
| UV index and sun-protection context | WHO, [The ultraviolet (UV) index](https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-%28uv%29-index) | UV index indicates ambient UV intensity and the need for protection; multiplying UVI by duration is not a validated safe-exposure, sunburn or vitamin-D prediction. |

## Metabolic age limitation

No validated universal equation converts a single estimated resting metabolic rate into an individual metabolic age. The `Metabolic Age` route now reports a Mifflin–St Jeor resting-energy estimate for adults aged 20 and older and explicitly declines to assign a fabricated metabolic-age score. The original equation source is listed above.

## Custom / descriptive calculations

The following types of metrics are defined by their explicitly displayed arithmetic rather than a universally accepted clinical norm: facial measurement ratios, facial thirds variation, manually measured posture asymmetry, simple work/rest ratios, session density, self-reported fatigue indicators, and personal load/recovery ratios. These should show the formula, inputs and limitations and must not imply a medically validated normal range or diagnosis.

## Known-answer testing coverage

`node tests/verify.js` now enforces one known-answer or method-specific regression vector for every one of the 118 registered routes (24 advanced-engine vectors, 20 existing direct/shared vectors and 74 added route-specific vectors), plus unit conversion and boundary-inventory checks. `FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv` document each route’s formula/method and reference basis. This establishes route-level vector coverage, not exhaustive boundary combinations or scientific validation of site-defined heuristics.


## Full route-level formula audit update (2026-10-15)

`FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv` record all 118 routes, their formula/method summaries, route-specific known-answer or method-specific test status, and reference basis. The regression suite now contains a route-level vector for each registered calculator. All 242 static numeric inputs plus runtime-generated controls have min/max/step and are inventoried in `INPUT_BOUNDARY_VERIFIED.csv`. Route-level known-answer coverage is not the same as exhaustive semantic boundary testing or production certification.


## MET equation consistency correction (2026-10-15)

Calories Burned, Activity Time and METs now use the same estimate: `kcal ≈ MET × 3.5 × body mass (kg) × duration (minutes) ÷ 200`. It remains an estimate, not a measured calorie expenditure. Relative-strength, squat-ratio and speed-to-weight pages no longer attach universal normative tiers to ratios that depend on population and protocol.

## Additional method notes from the 2026-10-16 follow-up

- **BMI Change:** BMI is weight in kilograms divided by height in metres squared (CDC: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html). The signed change is defined by this calculator as goal BMI minus current BMI. Negative values indicate a lower goal BMI. Adult BMI category labels are not shown because the calculator does not collect age; pediatric interpretation requires age- and sex-specific reference percentiles.
- **One-repetition maximum (1RM):** Epley, Brzycki, Lander and Lombardi equations are empirical predictions, not direct measurements or universally accurate equations. Published comparisons find accuracy depends on exercise and population (e.g., https://pubmed.ncbi.nlm.nih.gov/7500624/ and https://pubmed.ncbi.nlm.nih.gov/31164044/). ClerFit accepts 1–15 repetitions, avoids universal accuracy grades, and displays the estimate in the selected weight unit.
- **Ponderal/Rohrer Index:** the implementation uses mass in kg divided by height in metres cubed, with units kg/m³; see Measurement Toolkit: https://www.measurement-toolkit.org/anthropometry/anthropometric-indices/ponderal. No universal adult categories are assigned.


## Additional anthropometry — Batch 1

- **MUAC-derived arm areas:** The calculator uses the standard anthropometric relationship MUAMC = MUAC − π × triceps skinfold, after converting both readings to the same length unit. It then derives total arm area = MUAC²/(4π), MUAMA = MUAMC²/(4π), and estimated arm fat area = total arm area − MUAMA. Method reference: [Nutritional Assessment — Anthropometry](https://nutritionalassessment.mumc.nl/en/anthropometry) and [Nutritional Assessment of Body Composition](https://nutritionalassessment.org/bodycomposition/). The circular model is approximate; MUAMA includes bone area and is not a direct muscle-mass measurement. No population percentile or clinical classification is inferred.
- **Neck, mid-thigh and calf geometry:** Diameter = C/π, radius = C/(2π), and circle-equivalent cross-sectional area = C²/(4π). These are mathematical circle identities, not validated anatomical or clinical estimators. The optional segment-volume output is area × length under a constant circular-cylinder assumption; it must not be described as measured muscle or tissue volume.
- **Body Adiposity Index:** Bergman et al., *A better index of body adiposity* (2011), [Obesity](https://doi.org/10.1038/oby.2011.38), proposed BAI = hip circumference (cm)/height (m)^1.5 − 18 from adult study populations. The calculator therefore requires age 18 or older and does not assign health-risk categories. A comparative evaluation by Freedman et al. (2012), [Obesity](https://doi.org/10.1038/oby.2012.81), reported bias by sex and body-fat level and found no accuracy advantage over BMI or circumference measures. BAI is presented as an approximate population-derived index, not a direct measurement or diagnosis. The implementation's 0–100% output guard is solely a computational plausibility check to prevent impossible displayed percentages; it is not a validated clinical reference interval, diagnostic cutoff or health category.


## Batch 4 — anthropometric segment methods

These five calculators use transparent mathematical descriptors rather than clinical reference standards:

- Upper-to-lower body segment ratio: sitting height is used as the upper segment; lower segment = standing height − sitting height; ratio = upper ÷ lower. Sitting height must be less than standing height.
- Femur-to-height ratio: user-entered femur length ÷ standing height, after converting both lengths to centimetres.
- Tibia-to-height ratio: user-entered tibia length ÷ standing height, after converting both lengths to centimetres.
- Body proportion deviation: measured segment ÷ standing height × 100, compared with a reference percentage entered by the user. No population norm is supplied or implied.
- Anthropometric measurement change: current measurement − baseline; percentage change = difference ÷ baseline × 100.

For femur and tibia lengths, the user must follow a consistent landmark and measurement protocol. Surface measurements are not interchangeable with imaging. All results are descriptive and are not diagnoses, clinical cutoffs, attractiveness scores or athletic-potential ratings. Batch 4 known-answer and invalid-domain tests are present; exact-commit CI and browser verification remain pending.


## Batch 5 — Micronutrient reference values

- [NIH ODS Vitamin A and Carotenoids (health professional)](https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/): RDA by age, sex and pregnancy/lactation; units are mcg retinol activity equivalents (RAE). The UL applies only to preformed vitamin A, not total RAE from carotenoids.
- [NIH ODS Vitamin B12 (health professional)](https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional): RDA by age and life stage. No tolerable upper intake level has been established.
- [NIH ODS Vitamin B6 (health professional)](https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional): RDA by age, sex and pregnancy/lactation; U.S. UL values are shown only as context.
- [NIH ODS Vitamin C (health professional)](https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/): RDA by age, sex and pregnancy/lactation; U.S. UL values are shown only as context.

Implementation scope: ages 14+; values are U.S. Dietary Reference Intakes for healthy populations. RDA percentages are planning comparisons, not diagnoses, and these calculators do not prescribe supplements.
