/* Generated from CALCULATOR_VERIFICATION_MATRIX.csv. Keep entries aligned with the verified calculator inventory. */
window.CLERFIT_GUIDE_CATALOG = [
  {
    "title": "BMI Calculator",
    "category": "Body Measurements & Composition",
    "file": "BMI.html",
    "slug": "bmi",
    "method": "BMI = weight (kg) ÷ height (m)²",
    "reference": "CDC adult BMI formula/categories; CDC BMI-for-age guidance",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Body Fat Percentage",
    "category": "Body Measurements & Composition",
    "file": "bodyfat.html",
    "slug": "body-fat",
    "method": "US Navy body-fat estimate: sex-specific logarithmic equations using waist, neck, height and (for women) hip measurements; all lengths converted to inches before logarithms.",
    "reference": "US Navy body-fat equation; documented in page and engine",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Lean Body Mass",
    "category": "Body Measurements & Composition",
    "file": "leanmass.html",
    "slug": "lean-body-mass",
    "method": "Lean body mass = body mass × (1 − body-fat fraction).",
    "reference": "Mathematical basis: Lean body mass = body mass × (1 − body-fat fraction). This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Fat Mass",
    "category": "Body Measurements & Composition",
    "file": "fatmass.html",
    "slug": "fat-mass",
    "method": "Fat mass = body mass × body-fat fraction.",
    "reference": "Mathematical basis: Fat mass = body mass × body-fat fraction. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "FFMI",
    "category": "Body Measurements & Composition",
    "file": "ffmi.html",
    "slug": "ffmi",
    "method": "FFMI = fat-free mass (kg) ÷ height (m)².",
    "reference": "Mathematical basis: FFMI = fat-free mass (kg) ÷ height (m)². This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Body Surface Area",
    "category": "Body Measurements & Composition",
    "file": "bsa.html",
    "slug": "body-surface-area",
    "method": "Mosteller method: BSA (m²) = √(height (cm) × weight (kg) ÷ 3600).",
    "reference": "Mosteller 1987, PubMed 3657876",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Waist-to-Hip Ratio",
    "category": "Body Measurements & Composition",
    "file": "whr.html",
    "slug": "waist-to-hip",
    "method": "Waist-to-hip ratio = waist circumference ÷ hip circumference.",
    "reference": "Mathematical basis: Waist-to-hip ratio = waist circumference ÷ hip circumference. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Waist-to-Height Ratio",
    "category": "Body Measurements & Composition",
    "file": "wht.html",
    "slug": "waist-to-height",
    "method": "Waist-to-height ratio = waist circumference ÷ height.",
    "reference": "Mathematical basis: Waist-to-height ratio = waist circumference ÷ height. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Ideal Body Weight",
    "category": "Body Measurements & Composition",
    "file": "idealweight.html",
    "slug": "ideal-body-weight",
    "method": "Devine ideal-body-weight estimate: male = 50 kg + 2.3 kg per inch above 5 ft; female = 45.5 kg + 2.3 kg per inch above 5 ft. This is an equation-based estimate, not a universal target.",
    "reference": "Devine (1974) equation; formula review: https://pmc.ncbi.nlm.nih.gov/articles/PMC8646317/ and FDA appendix: https://www.accessdata.fda.gov/cdrh_docs/pdf16/P160013c.pdf",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Body Shape / Somatotype",
    "category": "Body Measurements & Composition",
    "file": "somatotype.html",
    "slug": "somatotype",
    "method": "Heath–Carter somatotype method: endomorphy from corrected skinfolds and height; mesomorphy from bone breadths, height and skinfold-corrected arm/calf girths; ectomorphy from height–weight ratio.",
    "reference": "Heath & Carter (1967), “A modified somatotype method,” American Journal of Physical Anthropology, DOI https://doi.org/10.1002/ajpa.1330270108. Method source identified; exact implementation still requires component-level comparison.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Relative Fat Mass",
    "category": "Body Measurements & Composition",
    "file": "rfm.html",
    "slug": "rfm",
    "method": "Common RFM equations: male estimate = 64 − 20 × (height ÷ waist); female estimate = 76 − 20 × (height ÷ waist), using compatible length units.",
    "reference": "Woolcott & Bergman 2018, Scientific Reports DOI 10.1038/s41598-018-29362-1",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Ponderal Index",
    "category": "Body Measurements & Composition",
    "file": "ponderal.html",
    "slug": "ponderal-index",
    "method": "Rohrer/Ponderal index = mass (kg) ÷ height (m)³, yielding kg/m³; no universal adult categories are assigned.",
    "reference": "Measurement Toolkit anthropometric indices: https://www.measurement-toolkit.org/anthropometry/anthropometric-indices/ponderal; Rohrer index uses mass divided by height cubed. No universal adult clinical cutoff is assigned by this page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "ABSI",
    "category": "Body Measurements & Composition",
    "file": "absi.html",
    "slug": "absi",
    "method": "ABSI = waist circumference ÷ (BMI^(2/3) × height^(1/2)), using compatible canonical units.",
    "reference": "Krakauer & Krakauer 2012, PLOS ONE DOI 10.1371/journal.pone.0039504",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Face Shape",
    "category": "Face & Aesthetics",
    "file": "face-shape.html",
    "slug": "face-shape",
    "method": "Site-defined heuristic classification from relative face length, forehead, cheekbone and jaw measurements; not a clinically or scientifically universal face-shape standard.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Face Length Ratio",
    "category": "Face & Aesthetics",
    "file": "face-length.html",
    "slug": "face-length-ratio",
    "method": "Lower-face length ÷ total face length, after converting both measurements to the same unit.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Facial Thirds",
    "category": "Face & Aesthetics",
    "file": "facial-thirds.html",
    "slug": "facial-thirds",
    "method": "Site-defined ratios comparing upper, middle and lower facial thirds with total facial height; descriptive measurements only, not a universal aesthetic standard.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Jaw Width Ratio",
    "category": "Face & Aesthetics",
    "file": "jaw-width-ratio.html",
    "slug": "jaw-width-ratio",
    "method": "Site-defined jaw-width ratio using the measured jaw width and the comparison measurement specified on the page; descriptive only, with no universal attractiveness threshold.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Chin Height Ratio",
    "category": "Face & Aesthetics",
    "file": "chin-height-ratio.html",
    "slug": "chin-height-ratio",
    "method": "Measured chin height ÷ the reference facial height specified on the page; descriptive only.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Nose Length Ratio",
    "category": "Face & Aesthetics",
    "file": "nose-length-ratio.html",
    "slug": "nose-length-ratio",
    "method": "Measured nose length ÷ the reference facial height specified on the page; descriptive only.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Mouth Width Ratio",
    "category": "Face & Aesthetics",
    "file": "mouth-width-ratio.html",
    "slug": "mouth-width-ratio",
    "method": "Measured mouth width ÷ the reference facial width specified on the page; descriptive only.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Eye Spacing",
    "category": "Face & Aesthetics",
    "file": "eye-spacing.html",
    "slug": "eye-spacing",
    "method": "Site-defined eye-spacing ratio from the entered interocular and reference-width measurements; descriptive only.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Lower Face Height",
    "category": "Face & Aesthetics",
    "file": "lower-face-height.html",
    "slug": "lower-face-height",
    "method": "Lower-face height ÷ total facial height, using consistent units; descriptive only.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "Facial Balance Index",
    "category": "Face & Aesthetics",
    "file": "facial-balance.html",
    "slug": "facial-balance",
    "method": "Site-defined facial balance index from the displayed facial measurements; no universal clinical or attractiveness standard.",
    "reference": "Site-defined descriptive measurement; no universal clinical/aesthetic standard. Formula disclosed and tested as arithmetic only.",
    "referenceStatus": "Method documented and vector-tested; no universal external standard exists; edge-case review remains"
  },
  {
    "title": "BMR Calculator",
    "category": "Metabolism & Calories",
    "file": "bmr.html",
    "slug": "bmr",
    "method": "If using Mifflin–St Jeor: male equation = 10 × mass(kg) + 6.25 × height(cm) − 5 × age + 5; female equation uses −161 instead of +5.",
    "reference": "Mifflin et al. 1990, PubMed 2305711: https://pubmed.ncbi.nlm.nih.gov/2305711/",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "RMR Calculator",
    "category": "Metabolism & Calories",
    "file": "rmr.html",
    "slug": "rmr",
    "method": "Resting metabolic rate is estimated from the equation selected by this calculator; published equations are not interchangeable.",
    "reference": "Mifflin et al. 1990, PubMed 2305711: https://pubmed.ncbi.nlm.nih.gov/2305711/",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "TDEE Calculator",
    "category": "Metabolism & Calories",
    "file": "tdee.html",
    "slug": "tdee",
    "method": "A common estimate is TDEE = estimated BMR × activity factor.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. TDEE is estimated resting energy × selected activity factor; document the activity-factor assumptions as heuristic, not a measurement.",
    "referenceStatus": "Mifflin–St Jeor method/source recorded; TDEE-specific input bounds tested (20–500 kg, 100–250 cm, adult age 18–120 integer) and unit-selector bounds covered; exhaustive combinations not claimed"
  },
  {
    "title": "Maintenance Calories",
    "category": "Metabolism & Calories",
    "file": "maintenance.html",
    "slug": "maintenance-calories",
    "method": "Maintenance energy is commonly estimated from TDEE; the starting estimate is adjusted using observed weight trends over time.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. Maintenance intake is an initial estimate requiring adjustment using observed trends; not a personalized prediction.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Calorie Deficit",
    "category": "Metabolism & Calories",
    "file": "deficit.html",
    "slug": "calorie-deficit",
    "method": "Estimated target intake = estimated TDEE − selected daily deficit.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. Target = estimated TDEE − user-selected deficit; deficit choice is a user input, not a clinical prescription.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Calorie Surplus",
    "category": "Metabolism & Calories",
    "file": "surplus.html",
    "slug": "calorie-surplus",
    "method": "Estimated target intake = estimated TDEE + selected daily surplus.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. Target = estimated TDEE + user-selected surplus; surplus choice is a user input, not a clinical prescription.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Energy Balance",
    "category": "Metabolism & Calories",
    "file": "energy-balance.html",
    "slug": "energy-balance",
    "method": "Estimated energy balance = energy intake − energy expenditure.",
    "reference": "Mathematical basis: energy intake − estimated energy expenditure. Expenditure depends on the selected resting-energy equation/activity factor and is an estimate, not measured energy balance.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Daily Energy Need",
    "category": "Metabolism & Calories",
    "file": "daily-energy.html",
    "slug": "daily-energy",
    "method": "Daily energy need is estimated using the selected resting-energy equation and activity factor.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. Document selected equation, activity factor and adult population assumptions; estimated daily energy is not a direct measurement.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Calories per kg",
    "category": "Metabolism & Calories",
    "file": "calories-kg.html",
    "slug": "calories-per-kg",
    "method": "Estimated daily energy expenditure divided by body mass in kg, using the page’s selected resting-energy equation and activity factor.",
    "reference": "Mifflin–St Jeor source family: https://pubmed.ncbi.nlm.nih.gov/2305711/. Derived estimate divided by mass in kg; verify units and preserve the estimation caveat.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Metabolic Age",
    "category": "Metabolism & Calories",
    "file": "metabolic-age.html",
    "slug": "metabolic-age",
    "method": "Reports the selected adult resting-energy estimate; does not calculate a metabolic-age score because no validated universal score equation is established.",
    "reference": "Mifflin et al. 1990, PubMed 2305711; no validated universal metabolic-age score",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Protein Intake",
    "category": "Nutrition & Hydration",
    "file": "protein.html",
    "slug": "protein",
    "method": "Daily protein target = body mass in kg × the selected activity/goal-specific grams-per-kg factor shown by the calculator; a planning estimate, not an individualized clinical prescription.",
    "reference": "User-selected g/kg factor; the factor is shown in the formula output. General adult reference: National Academies DRI publication https://www.nationalacademies.org/publications/10490; this tool does not prescribe a clinical target.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Carbohydrate Intake",
    "category": "Nutrition & Hydration",
    "file": "carbs.html",
    "slug": "carbohydrates",
    "method": "Carbohydrate grams = selected daily energy target × carbohydrate energy percentage ÷ 4 kcal/g.",
    "reference": "Energy conversion convention: carbohydrate 4 kcal/g; macro energy ranges are described in National Academies DRI https://www.nationalacademies.org/publications/10490.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Fat Intake",
    "category": "Nutrition & Hydration",
    "file": "fat.html",
    "slug": "fat-intake",
    "method": "Fat grams = selected daily energy target × fat energy percentage ÷ 9 kcal/g.",
    "reference": "Energy conversion convention: fat 9 kcal/g; macro energy ranges are described in National Academies DRI https://www.nationalacademies.org/publications/10490.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Macro Split",
    "category": "Nutrition & Hydration",
    "file": "macro-split.html",
    "slug": "macro-split",
    "method": "Daily energy target is split by the selected goal/macro percentages; grams use 4 kcal/g for protein and carbohydrate and 9 kcal/g for fat.",
    "reference": "Energy conversion conventions (protein/carbohydrate 4 kcal/g, fat 9 kcal/g); acceptable macro distribution ranges: National Academies DRI https://www.nationalacademies.org/publications/10490.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Fiber Intake",
    "category": "Nutrition & Hydration",
    "file": "fiber.html",
    "slug": "fiber",
    "method": "Fiber target is estimated from the selected reference method and age/sex/energy inputs; reference guidance is not a personalized medical prescription.",
    "reference": "National Academies DRI 2005 https://www.nationalacademies.org/publications/10490; Academy of Nutrition and Dietetics position paper https://pubmed.ncbi.nlm.nih.gov/26514720/.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Water Intake",
    "category": "Nutrition & Hydration",
    "file": "water.html",
    "slug": "water",
    "method": "Daily water estimate based on body mass and the page’s selected activity adjustment; not a universal fluid prescription.",
    "reference": "Heuristic mass-based estimate (35 mL/kg × selected factor); not a universal medical fluid prescription. See National Academies DRI for water reference context: https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sodium Intake",
    "category": "Nutrition & Hydration",
    "file": "sodium.html",
    "slug": "sodium",
    "method": "Daily sodium reference is selected by age/life-stage reference guidance; it is not scaled arbitrarily by body mass or exercise.",
    "reference": "National Academies Dietary Reference Intakes for Sodium and Potassium (2019)",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Potassium Intake",
    "category": "Nutrition & Hydration",
    "file": "potassium.html",
    "slug": "potassium",
    "method": "Daily potassium adequate intake is selected by age/sex life-stage reference guidance; it is not scaled arbitrarily by body mass or exercise.",
    "reference": "National Academies Dietary Reference Intakes for Sodium and Potassium (2019)",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Meal Calorie Split",
    "category": "Nutrition & Hydration",
    "file": "meal-split.html",
    "slug": "meal-calorie-split",
    "method": "Total daily calories are distributed across the selected number of meals using the user-selected relative meal-heaviness weights; shares sum to the entered total.",
    "reference": "Site-defined weighted allocation; meal weights are normalized to sum to 100% of entered daily calories.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Water Loss Replacement",
    "category": "Nutrition & Hydration",
    "file": "hydration-loss.html",
    "slug": "water-loss-replacement",
    "method": "Estimated fluid replacement based on body-mass change and exercise duration/intensity; weigh-in changes can include factors other than sweat, so this is an estimate.",
    "reference": "Approximate exercise-fluid replacement heuristic; not a universal clinical hydration prescription. See ACSM position stand on exercise and fluid replacement: https://pubmed.ncbi.nlm.nih.gov/17277604/.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "One-Rep Max",
    "category": "Muscle, Strength & Performance",
    "file": "1rm.html",
    "slug": "one-rep-max",
    "method": "Predicted 1RM uses the selected equation: Epley = load × (1 + reps/30); Brzycki = load × 36/(37 − reps); Lander = load × 100/(101.3 − 2.67123×reps); Lombardi = load × reps^0.10. Supported input range is 1–15 reps; estimates vary by exercise, protocol and person.",
    "reference": "Epley/Brzycki/Lombardi are prediction equations, not guarantees; empirical validation varies by exercise and population. https://pubmed.ncbi.nlm.nih.gov/7500624/ ; https://pubmed.ncbi.nlm.nih.gov/31164044/",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Relative Strength",
    "category": "Muscle, Strength & Performance",
    "file": "relative-strength.html",
    "slug": "relative-strength",
    "method": "Relative strength = estimated 1RM ÷ body mass after unit normalization; no universal tier is assigned.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Training Volume",
    "category": "Muscle, Strength & Performance",
    "file": "training-volume.html",
    "slug": "training-volume",
    "method": "Training volume-load = load per repetition × repetitions per set × number of sets.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weekly Load",
    "category": "Muscle, Strength & Performance",
    "file": "weekly-load.html",
    "slug": "weekly-load",
    "method": "Weekly volume-load = load × repetitions per set × sets per session × sessions per week.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Strength-to-Weight",
    "category": "Muscle, Strength & Performance",
    "file": "strength-weight.html",
    "slug": "strength-to-weight",
    "method": "Strength-to-weight ratio = lifted load ÷ body mass, with compatible units.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Push-Up Index",
    "category": "Muscle, Strength & Performance",
    "file": "pushup-index.html",
    "slug": "pushup-index",
    "method": "Site-defined push-up index based on repetition count and body-mass inputs; not a validated universal performance or health score.",
    "reference": "Mathematical basis: Site-defined push-up index based on repetition count and body-mass inputs; not a validated universal performance or health score. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Pull-Up Index",
    "category": "Muscle, Strength & Performance",
    "file": "pullup-index.html",
    "slug": "pullup-index",
    "method": "Site-defined pull-up index based on repetition count and body-mass inputs; not a validated universal performance or health score.",
    "reference": "Mathematical basis: Site-defined pull-up index based on repetition count and body-mass inputs; not a validated universal performance or health score. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Squat Ratio",
    "category": "Muscle, Strength & Performance",
    "file": "squat-ratio.html",
    "slug": "squat-ratio",
    "method": "Squat-to-body-mass ratio = squat load ÷ body mass after unit normalization; no universal tier is assigned.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Work Output",
    "category": "Muscle, Strength & Performance",
    "file": "work-output.html",
    "slug": "work-output",
    "method": "Mechanical work estimate = load (kg) × gravitational acceleration (9.81 m/s²) × vertical displacement (m) × repetitions.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Performance Score",
    "category": "Muscle, Strength & Performance",
    "file": "performance-score.html",
    "slug": "performance-score",
    "method": "Site-defined combined score using the displayed work-output and strength-to-body-mass components; not a standardized sports-science score.",
    "reference": "Mathematical basis: Site-defined combined score using the displayed work-output and strength-to-body-mass components; not a standardized sports-science score. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Running Pace",
    "category": "Cardio & Endurance",
    "file": "running-pace.html",
    "slug": "running-pace",
    "method": "Pace = elapsed time ÷ distance. Common formats are min/km and min/mile.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Walking Speed",
    "category": "Cardio & Endurance",
    "file": "walking-speed.html",
    "slug": "walking-speed",
    "method": "Average speed = distance ÷ elapsed time.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Distance-Time",
    "category": "Cardio & Endurance",
    "file": "distance-time.html",
    "slug": "distance-time",
    "method": "Distance = speed × time; time = distance ÷ speed when speed is non-zero.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Calories Burned",
    "category": "Cardio & Endurance",
    "file": "cardio-calories.html",
    "slug": "calories-burned",
    "method": "Estimated kcal = MET × 3.5 × body mass (kg) × duration (minutes) ÷ 200, using the activity MET selected from the page; estimate only.",
    "reference": "2024 Adult Compendium of Physical Activities https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/; standard MET energy equation; estimate varies by individual.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "METs Calorie Calculator",
    "category": "Cardio & Endurance",
    "file": "mets.html",
    "slug": "mets-calorie",
    "method": "Estimated kcal = MET × 3.5 × body mass (kg) × duration (minutes) ÷ 200.",
    "reference": "2024 Adult Compendium of Physical Activities https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/; kcal estimate uses the standard MET energy equation.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Step Length",
    "category": "Cardio & Endurance",
    "file": "step-length.html",
    "slug": "step-length",
    "method": "Average step length = distance covered ÷ number of steps, with distance converted to metres.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Stride Length",
    "category": "Cardio & Endurance",
    "file": "stride-length.html",
    "slug": "stride-length",
    "method": "Average stride length = distance covered ÷ number of strides, with distance converted to metres.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Cadence",
    "category": "Cardio & Endurance",
    "file": "cadence.html",
    "slug": "cadence",
    "method": "Cadence = counted steps or repetitions ÷ elapsed time, expressed in the selected time basis.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Cooper Test",
    "category": "Cardio & Endurance",
    "file": "cooper-test.html",
    "slug": "cooper-test",
    "method": "A commonly cited 12-minute Cooper estimate is VO₂ max (mL/kg/min) = (distance in metres − 504.9) ÷ 44.73.",
    "reference": "Cooper 12-minute run test equation; validation literature https://pmc.ncbi.nlm.nih.gov/articles/PMC4314605/.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Endurance Time",
    "category": "Cardio & Endurance",
    "file": "endurance-time.html",
    "slug": "endurance-time",
    "method": "Estimated time = distance × selected pace, after converting distance and pace units to compatible bases.",
    "reference": "Mathematical basis: Estimated time = distance × selected pace, after converting distance and pace units to compatible bases. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Speed-Weight Ratio",
    "category": "Cardio & Endurance",
    "file": "speed-weight.html",
    "slug": "speed-weight",
    "method": "Speed-to-body-mass ratio = speed (m/s) ÷ body mass (kg); no universal performance tier is assigned.",
    "reference": "Mathematical basis: Speed-to-body-mass ratio = speed (m/s) ÷ body mass (kg); no universal performance tier is assigned. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "VO2 Max Estimate",
    "category": "Cardio & Endurance",
    "file": "vo2max.html",
    "slug": "vo2max",
    "method": "Cooper 12-minute run estimate = (distance in metres − 504.9) ÷ 44.73; result is a field-test estimate, not a laboratory measurement. Distances producing non-positive estimates are rejected; no universal fitness category is assigned.",
    "reference": "Cooper 12-minute run equation; validation literature https://pmc.ncbi.nlm.nih.gov/articles/PMC4314605/; no universal fitness category claimed.",
    "referenceStatus": "PASS — Cooper equation known-answer vector; unit conversion and non-positive-output guard tested; unsupported age/sex category table and progress indicator removed."
  },
  {
    "title": "Weekly Weight Change",
    "category": "Fat Loss & Weight Goals",
    "file": "weekly-weight.html",
    "slug": "weekly-weight-change",
    "method": "Estimated weekly energy balance and weight change depend on the inputs and the assumptions used by the page.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Monthly Weight Change",
    "category": "Fat Loss & Weight Goals",
    "file": "monthly-weight.html",
    "slug": "monthly-weight-change",
    "method": "Monthly change compares the selected weight values over the specified period.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weight Loss Rate",
    "category": "Fat Loss & Weight Goals",
    "file": "weight-loss-rate.html",
    "slug": "weight-loss-rate",
    "method": "Weight-loss rate = weight change ÷ elapsed time, following the page’s sign convention.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weight Gain Rate",
    "category": "Fat Loss & Weight Goals",
    "file": "weight-gain-rate.html",
    "slug": "weight-gain-rate",
    "method": "Weight-gain rate = weight change ÷ elapsed time, following the page’s sign convention.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Goal Timeline",
    "category": "Fat Loss & Weight Goals",
    "file": "goal-timeline.html",
    "slug": "goal-timeline",
    "method": "Estimated time to goal = remaining change ÷ assumed rate of change, when the rate is non-zero.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "BMI Change",
    "category": "Fat Loss & Weight Goals",
    "file": "bmi-change.html",
    "slug": "bmi-change",
    "method": "Current BMI = current mass (kg) ÷ height (m)²; goal BMI = goal mass (kg) ÷ height (m)²; signed change = goal BMI − current BMI. Adult BMI categories are not shown because age is not collected.",
    "reference": "CDC BMI equation: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html; difference sign convention is goal minus current (defined by this calculator).",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Waist Change",
    "category": "Fat Loss & Weight Goals",
    "file": "waist-change.html",
    "slug": "waist-change",
    "method": "Waist change = current waist circumference − initial waist circumference, after unit conversion.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Hip Change",
    "category": "Fat Loss & Weight Goals",
    "file": "hip-change.html",
    "slug": "hip-change",
    "method": "Hip change = current hip circumference − initial hip circumference, after unit conversion.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Circumference Tracker",
    "category": "Fat Loss & Weight Goals",
    "file": "circumference-track.html",
    "slug": "circumference-tracker",
    "method": "For each entered body site, change = current circumference − initial circumference after unit conversion.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weight Stability",
    "category": "Fat Loss & Weight Goals",
    "file": "weight-stability.html",
    "slug": "weight-stability",
    "method": "Total weight change = current mass − initial mass; daily change = total change ÷ elapsed days.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sleep Duration",
    "category": "Recovery, Sleep & Fatigue",
    "file": "sleep-duration.html",
    "slug": "sleep-duration",
    "method": "Sleep duration is the elapsed time between sleep and wake times or the duration entered.",
    "reference": "CDC sleep duration recommendations https://www.cdc.gov/sleep/about/.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sleep Consistency",
    "category": "Recovery, Sleep & Fatigue",
    "file": "sleep-consistency.html",
    "slug": "sleep-consistency",
    "method": "Mean sleep duration and standard deviation across the entered nights; consistency score is the site-defined transformation of variability, not a clinical sleep-quality score.",
    "reference": "Mathematical basis: Mean sleep duration and standard deviation across the entered nights; consistency score is the site-defined transformation of variability, not a clinical sleep-quality score. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sleep Timing",
    "category": "Recovery, Sleep & Fatigue",
    "file": "sleep-timing.html",
    "slug": "sleep-timing",
    "method": "Recommended clock times are calculated by adding/subtracting the selected sleep-cycle duration and cycle count; 90 minutes is an approximation, not a diagnostic sleep protocol.",
    "reference": "Mathematical basis: Recommended clock times are calculated by adding/subtracting the selected sleep-cycle duration and cycle count; 90 minutes is an approximation, not a diagnostic sleep protocol. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Training-Rest Ratio",
    "category": "Recovery, Sleep & Fatigue",
    "file": "training-rest.html",
    "slug": "training-rest-ratio",
    "method": "Training/rest ratio = training duration ÷ rest duration, after conversion to a common time unit; any intensity label is site-defined guidance.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Rest Interval",
    "category": "Recovery, Sleep & Fatigue",
    "file": "rest-interval.html",
    "slug": "rest-interval",
    "method": "Site-defined rest-interval guidance based on the selected training context and entered work/rest parameters; recommendations are heuristic, not a universal physiologic equation.",
    "reference": "Mathematical basis: Site-defined rest-interval guidance based on the selected training context and entered work/rest parameters; recommendations are heuristic, not a universal physiologic equation. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Session Density",
    "category": "Recovery, Sleep & Fatigue",
    "file": "session-density.html",
    "slug": "session-density",
    "method": "Session density = work time ÷ total session time (work + rest) × 100, when those fields are the selected method; site-defined metric.",
    "reference": "Mathematical basis: Session density = work time ÷ total session time (work + rest) × 100, when those fields are the selected method; site-defined metric. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Load-Recovery Ratio",
    "category": "Recovery, Sleep & Fatigue",
    "file": "load-recovery-ratio.html",
    "slug": "load-recovery-ratio",
    "method": "Site-defined load-to-recovery ratio from the entered load and recovery values; it is not a validated clinical fatigue or injury-risk score.",
    "reference": "Mathematical basis: Site-defined load-to-recovery ratio from the entered load and recovery values; it is not a validated clinical fatigue or injury-risk score. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weekly Training Count",
    "category": "Recovery, Sleep & Fatigue",
    "file": "weekly-training-count.html",
    "slug": "weekly-training-count",
    "method": "Weekly training count = sum of the selected training sessions/days in the entered week; does not itself establish an optimal training frequency.",
    "reference": "Mathematical basis: Weekly training count = sum of the selected training sessions/days in the entered week; does not itself establish an optimal training frequency. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Recovery Time",
    "category": "Recovery, Sleep & Fatigue",
    "file": "recovery-time.html",
    "slug": "recovery-time",
    "method": "Estimated recovery time is based on the calculator’s selected activity/load inputs and its displayed rule; individual recovery is variable and not clinically predicted.",
    "reference": "Mathematical basis: Estimated recovery time is based on the calculator’s selected activity/load inputs and its displayed rule; individual recovery is variable and not clinically predicted. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Fatigue Index",
    "category": "Recovery, Sleep & Fatigue",
    "file": "fatigue-index.html",
    "slug": "fatigue-index",
    "method": "Site-defined fatigue index from the selected self-reported/performance inputs; no universal clinical threshold is assigned.",
    "reference": "Mathematical basis: Site-defined fatigue index from the selected self-reported/performance inputs; no universal clinical threshold is assigned. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "BMI for Age",
    "category": "Health, Posture & Medical",
    "file": "bmi-for-age.html",
    "slug": "bmi-for-age",
    "method": "BMI = mass (kg) ÷ height (m)²; interpretation requires age- and sex-specific reference percentiles.",
    "reference": "CDC Child and Teen BMI Calculator; BMI formula only, no invented percentile",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Waist Risk",
    "category": "Health, Posture & Medical",
    "file": "waist-risk.html",
    "slug": "waist-risk",
    "method": "Waist measurement is displayed with source-qualified context; risk interpretation depends on population, sex, ethnicity and guideline, not a universal threshold.",
    "reference": "NICE NG246, Identifying and assessing overweight, obesity and central adiposity: https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity. Confirm the calculator’s thresholds, sex/population applicability and measurement protocol match the cited guidance before treating the risk interpretation as verified.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Hip Risk",
    "category": "Health, Posture & Medical",
    "file": "hip-risk.html",
    "slug": "hip-risk",
    "method": "Hip circumference is a measurement; the page’s displayed ratios/descriptors are site-defined and are not a validated standalone clinical risk score.",
    "reference": "Mathematical basis only: hip circumference is a measurement; the page's ratio/descriptors are site-defined and are not a validated standalone clinical risk score. No external hip-only risk threshold is claimed.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Waist-Height Risk",
    "category": "Health, Posture & Medical",
    "file": "waist-height-risk.html",
    "slug": "waist-height-risk",
    "method": "Waist-to-height ratio = waist circumference ÷ height after unit normalization; any risk context is a screening heuristic, not a diagnosis.",
    "reference": "NICE NG246, Identifying and assessing overweight, obesity and central adiposity: https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity. NICE describes waist-to-height ratio bands for adults with BMI under 35 kg/m²; confirm exact implementation and exclusions before claiming guideline parity.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Forward Head Index",
    "category": "Health, Posture & Medical",
    "file": "forward-head-index.html",
    "slug": "forward-head-index",
    "method": "Site-defined forward-head/posture measurement ratio from the displayed landmarks; no universal diagnostic cutoff is claimed.",
    "reference": "Mathematical basis: Site-defined forward-head/posture measurement ratio from the displayed landmarks; no universal diagnostic cutoff is claimed. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Shoulder Symmetry",
    "category": "Health, Posture & Medical",
    "file": "shoulder-symmetry.html",
    "slug": "shoulder-symmetry",
    "method": "Shoulder symmetry difference = absolute difference between left and right measurements; percentage symmetry is calculated relative to the stated reference measurement.",
    "reference": "Mathematical basis: Shoulder symmetry difference = absolute difference between left and right measurements; percentage symmetry is calculated relative to the stated reference measurement. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Leg Length Difference",
    "category": "Health, Posture & Medical",
    "file": "leg-length-difference.html",
    "slug": "leg-length-difference",
    "method": "Leg-length difference = absolute difference between the two entered leg measurements after unit conversion.",
    "reference": "Mathematical basis: Leg-length difference = absolute difference between the two entered leg measurements after unit conversion. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sit-Stand Ratio",
    "category": "Health, Posture & Medical",
    "file": "sit-stand-ratio.html",
    "slug": "sit-stand-ratio",
    "method": "Sit-to-stand ratio = seated measurement ÷ standing measurement (or the page’s explicitly labeled numerator/denominator) using consistent units.",
    "reference": "Mathematical basis: Sit-to-stand ratio = seated measurement ÷ standing measurement (or the page’s explicitly labeled numerator/denominator) using consistent units. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Chest Expansion",
    "category": "Health, Posture & Medical",
    "file": "chest-expansion.html",
    "slug": "chest-expansion",
    "method": "Chest expansion = expanded chest circumference − relaxed chest circumference, after unit conversion.",
    "reference": "Mathematical basis: Chest expansion = expanded chest circumference − relaxed chest circumference, after unit conversion. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Body Alignment",
    "category": "Health, Posture & Medical",
    "file": "body-alignment.html",
    "slug": "body-alignment",
    "method": "Site-defined alignment score from entered posture measurements; descriptive only and not a diagnosis or validated universal normal range.",
    "reference": "Mathematical basis: Site-defined alignment score from entered posture measurements; descriptive only and not a diagnosis or validated universal normal range. This is a site-defined/descriptive method; no universal clinical or performance norm is asserted.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Heart Rate",
    "category": "Health, Posture & Medical",
    "file": "heartrate.html",
    "slug": "heart-rate",
    "method": "Predicted maximum heart rate = 208 − 0.7 × age (Tanaka et al.); target rate uses resting heart rate and the selected intensity fraction (Karvonen-style reserve method). Adult equation is not applied to minors.",
    "reference": "Tanaka, Monahan & Seals 2001, PubMed 11153730",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Health Risk Overview",
    "category": "Health, Posture & Medical",
    "file": "healthrisk.html",
    "slug": "health-risk",
    "method": "Calculates BMI from mass and height, then reports age-appropriate contextual guidance; adult categories are not applied to ages 2–19 without age/sex percentiles.",
    "reference": "CDC adult BMI formula/categories: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html; CDC Child and Teen BMI Calculator: https://www.cdc.gov/bmi/child-teen-calculator/index.html. Adult categories must not be applied to ages 2–19 without age/sex percentile references.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Unit Converter",
    "category": "Utility & Tools",
    "file": "unit.html",
    "slug": "unit-converter",
    "method": "Converted value = input value expressed in the target unit using the corresponding conversion factor or offset.",
    "reference": "NIST conversion factors https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors; temperature uses Celsius as canonical and applies offsets.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Height Converter",
    "category": "Utility & Tools",
    "file": "height-convert.html",
    "slug": "height-converter",
    "method": "The same physical height is expressed in a different length unit using the exact unit conversion factor.",
    "reference": "NIST conversion factors https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Weight Converter",
    "category": "Utility & Tools",
    "file": "weight-convert.html",
    "slug": "weight-converter",
    "method": "The same physical mass is expressed in a different mass unit using the relevant conversion factor.",
    "reference": "NIST conversion factors https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Distance Converter",
    "category": "Utility & Tools",
    "file": "distance-convert.html",
    "slug": "distance-converter",
    "method": "The same physical distance is expressed in the selected length unit.",
    "reference": "NIST conversion factors https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Time Converter",
    "category": "Utility & Tools",
    "file": "time-convert.html",
    "slug": "time-converter",
    "method": "The same duration is expressed in the selected time unit.",
    "reference": "SI/time unit definitions; conversion factors are arithmetic definitions and are checked against exact ratios.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "BMI Comparison",
    "category": "Utility & Tools",
    "file": "bmi-compare.html",
    "slug": "bmi-comparison",
    "method": "For each person: BMI = mass (kg) ÷ height (m)².",
    "reference": "Mathematical basis: For each person: BMI = mass (kg) ÷ height (m)². This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Ratio Calculator",
    "category": "Utility & Tools",
    "file": "ratio.html",
    "slug": "ratio-calculator",
    "method": "Ratio = first quantity ÷ second quantity.",
    "reference": "Standard arithmetic: reduce integer ratio by greatest common divisor; decimal ratio is numerator ÷ denominator.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Percentage Tool",
    "category": "Utility & Tools",
    "file": "percentage.html",
    "slug": "percentage-tool",
    "method": "The formula depends on the selected mode: part ÷ whole × 100; percentage change = (new − old) ÷ old × 100.",
    "reference": "Standard arithmetic: part ÷ whole × 100; percent change = (new − old) ÷ old × 100; zero reference values are rejected.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Average Calculator",
    "category": "Utility & Tools",
    "file": "average.html",
    "slug": "average-calculator",
    "method": "Arithmetic mean = sum of values ÷ number of values.",
    "reference": "Standard arithmetic mean, sum, minimum and maximum over the entered finite numeric list.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Difference Calculator",
    "category": "Utility & Tools",
    "file": "difference.html",
    "slug": "difference-calculator",
    "method": "Difference = first value − second value, following the page’s sign convention.",
    "reference": "Standard arithmetic difference and symmetric percent difference; denominator conventions are displayed in result labels.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Length Converter",
    "category": "Utility & Tools",
    "file": "length.html",
    "slug": "length-converter",
    "method": "Length conversion using the source and target units from the supported length-unit table.",
    "reference": "NIST conversion factors https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors; historical units are listed as approximate where appropriate.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Age Calculator",
    "category": "Lifestyle, Age & Environment",
    "file": "age.html",
    "slug": "age-calculator",
    "method": "Age is the completed time between the birth date and the selected reference date.",
    "reference": "Gregorian calendar date arithmetic; calendar month lengths and leap years are handled by JavaScript Date calculations.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Steps to Distance",
    "category": "Lifestyle, Age & Environment",
    "file": "steps-distance.html",
    "slug": "steps-to-distance",
    "method": "Estimated distance = step count × assumed step length.",
    "reference": "Mathematical basis: Estimated distance = step count × assumed step length. This is the stated arithmetic definition; confirm implementation, units and invalid-input behavior against this formula.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Steps to Calories",
    "category": "Lifestyle, Age & Environment",
    "file": "steps-calories.html",
    "slug": "steps-to-calories",
    "method": "Calorie expenditure is estimated from the entered activity and body data using assumptions in the calculator.",
    "reference": "MET source family: 2024 Adult Compendium https://pacompendium.com/ and paper https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/. Verify the selected activity/MET assumption and units; output remains an estimate.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Activity Time",
    "category": "Lifestyle, Age & Environment",
    "file": "activity-time.html",
    "slug": "activity-time",
    "method": "Estimated calorie range = selected activity MET range × 3.5 × body mass (kg) × duration (minutes) ÷ 200; same equation as the METs and Calories Burned calculators.",
    "reference": "Activity MET range lookup plus standard MET energy equation; Compendium context https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sedentary Ratio",
    "category": "Lifestyle, Age & Environment",
    "file": "sedentary.html",
    "slug": "sedentary-ratio",
    "method": "Sedentary ratio = sedentary duration ÷ (sedentary duration + active duration) × 100; fatigue/status labels are site-defined and not clinical measures.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Work-Rest Balance",
    "category": "Lifestyle, Age & Environment",
    "file": "work-rest.html",
    "slug": "work-rest-balance",
    "method": "Work/rest ratio = work duration ÷ rest duration after unit conversion; fatigue/status labels are site-defined guidance, not a validated clinical score.",
    "reference": "Standard arithmetic/time/distance relation; calculator-specific convention documented in formula matrix and page.",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Heat Exposure",
    "category": "Lifestyle, Age & Environment",
    "file": "heat-exposure.html",
    "slug": "heat-exposure",
    "method": "Heat index uses the US National Weather Service heat-index method from air temperature and relative humidity; it is not a safe-exposure-time predictor.",
    "reference": "US National Weather Service heat-index method",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Cold Exposure",
    "category": "Lifestyle, Age & Environment",
    "file": "cold-exposure.html",
    "slug": "cold-exposure",
    "method": "Wind chill uses the US National Weather Service wind-chill equation from air temperature and wind speed; it does not predict exact frostbite time.",
    "reference": "US National Weather Service wind-chill method",
    "referenceStatus": "Method/source recorded and route vector-tested; exhaustive boundary combinations not yet certified"
  },
  {
    "title": "Sunlight Duration",
    "category": "Lifestyle, Age & Environment",
    "file": "sunlight.html",
    "slug": "sunlight-duration",
    "method": "UV context indicator = UV index × entered duration; it is not a safe-time, vitamin-D or sunburn prediction.",
    "reference": "WHO, The ultraviolet (UV) index: https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-%28uv%29-index. UV index indicates UV radiation level and need for protection; UV index × duration must not be presented as safe exposure duration, vitamin-D estimate or sunburn prediction.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  },
  {
    "title": "Physical Activity Level",
    "category": "Lifestyle, Age & Environment",
    "file": "pal.html",
    "slug": "physical-activity-level",
    "method": "Physical Activity Level (PAL) is assigned from the page’s age/sex/activity selection and its displayed lookup table; it is not a measured physiological value.",
    "reference": "FAO/WHO/UNU, Human energy requirements, section on physical activity level: https://www.fao.org/4/y5686e/y5686e05.htm and https://www.fao.org/4/y5686e/y5686e07.htm. PAL is total daily energy expenditure divided by BMR; verify the page's lookup labels/ranges and adult applicability.",
    "referenceStatus": "Source/method traceability updated; route-specific implementation comparison and semantic boundary review still required; exhaustive boundaries not certified."
  }
];
