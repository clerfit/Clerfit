/* Route-specific user guides for the final 50 calculator pages. */
(() => {
  "use strict";
  const guides = {
    "heat-exposure": [
      ["How to use it", "Enter the air temperature in °C, relative humidity as a percentage, and the planned duration. Select the relevant sunlight and work-intensity context, then calculate. The duration and activity selections are displayed as context; they are not used to create a personal safe-exposure limit."],
      ["Method", "The calculator converts air temperature to °F and applies the National Weather Service heat-index procedure: the simple Steadman estimate at lower apparent temperatures and the Rothfusz regression with its humidity adjustments when applicable. The result is converted back to °C."],
      ["Limitations and safety", "Heat index is an apparent-temperature estimate for shaded conditions. Direct sun can increase heat burden, and workload, clothing, acclimatization, hydration, medications and health conditions matter. This tool does not calculate cumulative heat strain or safe work/rest duration. Follow local heat warnings and occupational heat-safety guidance.", "National Weather Service heat-index method", "https://www.weather.gov/ctp/heat"]
    ],
    "cold-exposure": [
      ["How to use it", "Enter actual air temperature in °C, wind speed and its unit, and planned exposure duration. Use a wind-speed reading representative of the exposed location."],
      ["Method", "The standard wind-chill equation combines air temperature and wind speed. This page converts wind speed to km/h when needed and applies the Celsius form of the National Weather Service equation."],
      ["Limitations and safety", "The standard formula applies only at air temperatures of 10°C or below and wind speeds above 4.8 km/h. Wind chill is not actual air temperature and does not predict an exact frostbite time. Wet clothing, exposed skin, sunlight and individual factors are not fully represented.", "National Weather Service wind-chill guidance", "https://www.weather.gov/safety/cold-faqs"]
    ],
    "sunlight-duration": [
      ["How to use it", "Enter the forecast or measured UV Index (UVI) and the exposure duration. Use the UVI for the correct location and time; it changes through the day and with cloud, altitude and reflection."],
      ["Method", "The page reports the UVI category and a simple relative indicator equal to UVI multiplied by minutes. This product is a site-defined comparison aid, not a standardized personal UV dose."],
      ["Limitations and protection", "UVI communicates the level of UV radiation and the need for protection; it does not determine a safe exposure time, vitamin-D production or an individual's sunburn threshold. WHO protection bands are 0–2 low, 3–5 moderate, 6–7 high, 8–10 very high and 11+ extreme. Use shade, clothing, sunglasses and sunscreen as appropriate.", "World Health Organization: UV Index", "https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-%28UV%29-INDEX"]
    ],
    "physical-activity-level": [
      ["How to use it", "Enter average total energy expenditure (TEE) over 24 hours and basal metabolic rate (BMR) over 24 hours. Both must use the same energy unit; this page uses kcal/day. Use measured or appropriately estimated values from the same period."],
      ["Method", "PAL = 24-hour TEE ÷ 24-hour BMR. For example, 2,970 kcal/day ÷ 1,700 kcal/day gives PAL 1.75. The calculator computes the ratio; it does not infer TEE or BMR from exercise frequency."],
      ["Interpretation and limitations", "FAO/WHO/UNU adult population lifestyle bands are 1.40–1.69 sedentary/light, 1.70–1.99 active/moderate and 2.00–2.40 vigorous. These are population reference categories, not precise individual clinical cut-offs. The result inherits uncertainty from both inputs; children, pregnancy and lactation need separate assessment.", "FAO/WHO/UNU Human energy requirements, PAL definition and classification", "https://www.fao.org/4/y5686e/y5686e07.htm"]
    ],
    "jp3": [
      ["How to use it", "Select the equation group. For the male equation, measure chest, abdomen and thigh skinfolds. For the female equation, measure triceps, suprailiac and thigh skinfolds. Enter age in years and all skinfold readings in millimetres; use a trained measurer and calibrated skinfold caliper."],
      ["Method", "Jackson–Pollock 3-site equations estimate body density from the sex-specific sum of three skinfolds and age. The page converts estimated density to body-fat percentage with the Siri equation: 495 ÷ density − 450."],
      ["Limitations", "This is an adult population-derived estimate, not a direct body-fat measurement. The female equation is restricted here to ages 18–55 and the male equation to 18–61. Measurement site placement, caliper technique, population and equation choice affect accuracy. Do not use for children or as a diagnosis.", "Jackson–Pollock equations and skinfold method overview", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10453806/"]
    ],
    "jp7": [
      ["How to use it", "Select the equation group, enter age, and measure all seven sites in millimetres: chest, midaxillary, triceps, subscapular, abdomen, suprailiac and thigh. Use the same trained measurer, anatomical landmarks and caliper protocol for repeat measurements."],
      ["Method", "The sex-specific Jackson–Pollock 7-site polynomial estimates body density from the sum of seven skinfolds and age. Siri conversion then estimates body-fat percentage as 495 ÷ density − 450."],
      ["Limitations", "This is an adult population-derived estimate, not a direct measurement. The supported age range is 18–61 for the male equation and 18–55 for the female equation. Skinfold technique, population differences and equation selection can produce meaningful error; do not interpret it as a diagnosis.", "Jackson–Pollock equations and skinfold method overview", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10453806/"]
    ],
    "durnin-womersley": [
      ["How to use it", "Select the equation group and enter age in completed years. Measure biceps, triceps, subscapular and suprailiac skinfolds in millimetres using the standard landmarks and a suitable caliper."],
      ["Method", "The Durnin–Womersley method takes log10 of the sum of the four skinfolds, applies a sex- and age-band-specific body-density equation, then uses Siri conversion: body-fat % = 495 ÷ density − 450."],
      ["Limitations", "The source study covered ages 16–72; the page enforces that range. These equations are population estimates and can be biased when applied to different populations or measurement protocols. They are not direct body-fat measurements or a diagnosis.", "Durnin and Womersley (1974), four-site skinfold study", "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/E8EA87847D7481F0CF6800090F9FB130/S0007114521003950a.pdf/the-making-of-a-classic-the-1974-durnin-womersley-body-composition-paper.pdf"]
    ],
    "ymca-body-fat": [
      ["How to use it", "Select the equation group and enter body mass in kg and waist circumference in cm. Measure waist at a consistent anatomical site with the tape level and without compressing the skin."],
      ["Method", "The YMCA estimate converts kg to pounds and cm to inches, then applies the sex-specific waist-and-weight equation. The male constant is 98.42 and the female constant is 76.76."],
      ["Limitations", "This is a rough circumference-based estimate, not a direct body-fat measurement. Waist landmark, body shape and population differences affect the result. Use the same measurement method for comparisons and do not treat the output as a diagnosis."]
    ],
    "body-fat-comparison": [
      ["How to use it", "Enter the earlier and later body-fat percentages using the same measurement method and comparable conditions. Values must be between 0% and 75%."],
      ["Method", "The calculator reports later percentage minus earlier percentage in percentage points. Relative change is calculated against the earlier value; it is undefined when the earlier value is zero."],
      ["Limitations", "Body-fat methods have measurement error. Small differences may reflect device, hydration, timing or technique rather than a true change. Do not compare results from different methods as if they were interchangeable."]
    ],
    "total-body-water": [
      ["How to use it", "Enter total body water in kg as reported by a suitable body-composition assessment and enter body mass in kg. Do not estimate total body water from height and weight alone."],
      ["Method", "The reported proportion is measured total body water ÷ body mass × 100."],
      ["Limitations", "The result inherits the device or assessment method's error and assumptions. It is not a hydration diagnosis, fluid prescription or a substitute for clinical assessment."]
    ],
    "intracellular-water": [
      ["How to use it", "Enter assessment-reported intracellular water and total body water in litres, plus body mass in kg. Use values from the same assessment and time point."],
      ["Method", "The page reports intracellular water ÷ total body water and intracellular water ÷ body mass. It checks that the compartment does not exceed total water and that total water does not exceed body mass numerically."],
      ["Limitations", "These are proportions of supplied assessment values, not estimates generated from tape measurements. Bioimpedance and other devices use model assumptions; litres-to-kilograms comparisons rely on an approximate water-density equivalence."]
    ],
    "extracellular-water": [
      ["How to use it", "Enter assessment-reported extracellular water and total body water in litres, plus body mass in kg. Use values from the same assessment and time point."],
      ["Method", "The page reports extracellular water ÷ total body water and extracellular water ÷ body mass. It checks that the compartment does not exceed total water and that total water does not exceed body mass numerically."],
      ["Limitations", "These are proportions of supplied assessment values, not direct clinical measures of fluid status. Device assumptions and measurement conditions affect the inputs; litres-to-kilograms comparisons use an approximate water-density equivalence."]
    ],
    "bone-mass": [
      ["How to use it", "Enter bone mass in kg exactly as reported by the assessment device or method and enter body mass in kg from the same time point."],
      ["Method", "The result is the supplied bone-mass value divided by body mass, multiplied by 100."],
      ["Limitations", "This calculator does not estimate bone mass from body measurements and does not measure bone mineral density, bone strength or fracture risk. Device-defined 'bone mass' values are not interchangeable with DXA bone mineral measurements."]
    ],
    "visceral-fat": [
      ["How to use it", "Enter the visceral-fat area in cm² from an assessment method that actually reports this quantity, such as a validated imaging or device output. Keep the source and date with the result."],
      ["Method", "The calculator records and formats the supplied area; it performs no prediction from waist, weight or BMI."],
      ["Limitations", "Different devices and imaging methods may report different visceral-fat metrics. Do not apply a universal cutoff unless it is validated for the specific method and population."]
    ],
    "subcutaneous-fat": [
      ["How to use it", "Enter the subcutaneous-fat thickness in millimetres from the measuring device or protocol that produced the reading."],
      ["Method", "The calculator records the assessment-reported thickness; it does not infer tissue thickness from unrelated body measurements."],
      ["Limitations", "Site, probe pressure, skinfold technique, device and operator affect the result. Use the same anatomical site and protocol for comparisons; no universal clinical interpretation is assigned."]
    ],
    "waist-arm-ratio": [
      ["How to use it", "Measure waist circumference and upper-arm circumference at clearly defined landmarks. Enter both readings and select the common unit."],
      ["Method", "Waist-to-arm ratio = waist circumference ÷ upper-arm circumference after conversion to a common length unit."],
      ["Limitations", "This is a descriptive ratio, not a validated health-risk score. Tape placement, arm relaxation or flexion and waist protocol can change the result. No universal cutoff is assigned."]
    ],
    "waist-thigh-ratio": [
      ["How to use it", "Measure waist and thigh circumference at repeatable anatomical landmarks, with consistent posture and tape tension. Select the same unit for both."],
      ["Method", "Waist-to-thigh ratio = waist circumference ÷ thigh circumference after unit conversion."],
      ["Limitations", "This is a descriptive measurement ratio, not a diagnosis or a validated health or athletic-performance threshold. Use consistent landmarks when comparing measurements."]
    ],
    "chest-waist-ratio": [
      ["How to use it", "Measure chest circumference at a consistent chest landmark and waist circumference using a defined waist protocol. Enter both in the selected common unit."],
      ["Method", "Chest-to-waist ratio = chest circumference ÷ waist circumference after unit conversion."],
      ["Limitations", "Breathing phase, posture, tape tension and landmark choice affect circumferences. The ratio is descriptive only; no universal health, attractiveness or performance cutoff is established."]
    ],
    "shoulder-waist-ratio": [
      ["How to use it", "Measure shoulder circumference using the same tape path each time and measure waist at a defined landmark. Enter both measurements in the same unit."],
      ["Method", "Shoulder-to-waist ratio = shoulder circumference ÷ waist circumference after unit conversion."],
      ["Limitations", "Shoulder circumference is not the same as biacromial skeletal breadth. Muscle, posture, tape path and breathing can affect the value. This is a descriptive ratio, not a clinical or attractiveness standard."]
    ],
    "shoulder-hip-ratio": [
      ["How to use it", "Measure shoulder circumference and hip circumference using clearly defined tape paths and consistent posture. Select one common unit."],
      ["Method", "Shoulder-to-hip ratio = shoulder circumference ÷ hip circumference after unit conversion."],
      ["Limitations", "The result depends on whether shoulder and hip are measured as circumferences or breadths. Use the page's specified circumference protocol consistently. No universal health or aesthetic threshold is assigned."]
    ],
    "chest-height-ratio": [
      ["How to use it", "Measure chest circumference and standing height. Use the same length unit for both inputs and stand in a consistent posture."],
      ["Method", "Chest-to-height ratio = chest circumference ÷ standing height after unit conversion."],
      ["Limitations", "This is a descriptive proportion, not a validated health-risk score. Chest measurement varies with breathing, posture and tape placement; no universal cutoff is assigned."]
    ],
    "hip-height-ratio": [
      ["How to use it", "Measure hip circumference at the widest gluteal level using a level tape, and measure standing height without shoes. Use the same unit."],
      ["Method", "Hip-to-height ratio = hip circumference ÷ standing height after unit conversion."],
      ["Limitations", "The ratio is descriptive and should not be treated as a diagnosis or a direct body-fat estimate. Landmark and posture consistency are essential."]
    ],
    "upper-arm-height-ratio": [
      ["How to use it", "Measure upper-arm circumference at a defined midpoint and standing height using a consistent protocol. Select the same unit for both."],
      ["Method", "Upper-arm-to-height ratio = upper-arm circumference ÷ standing height after unit conversion."],
      ["Limitations", "Arm flexion, muscle contraction, tape tension and midpoint selection affect the reading. This descriptive ratio has no universal clinical or performance cutoff."]
    ],
    "biacromial-width-ratio": [
      ["How to use it", "Measure biacromial breadth between the acromial landmarks with an appropriate anthropometric caliper, then measure standing height. Use the same unit."],
      ["Method", "Biacromial width ratio = biacromial breadth ÷ standing height after unit conversion."],
      ["Limitations", "This is a skeletal breadth-to-height proportion, not shoulder circumference. Landmark palpation, caliper technique and posture affect results; no universal cutoff is assigned."]
    ],
    "body-fat-change": [
      ["How to use it", "Enter earlier and current body-fat percentages from the same assessment method, device and comparable measurement conditions. Values must be within the supported 0–75% range."],
      ["Method", "Change in percentage points = current body-fat percentage − earlier body-fat percentage. Relative change is calculated against the earlier percentage when it is non-zero."],
      ["Limitations", "Hydration, device algorithms, skinfold technique and timing can affect body-fat readings. Small changes may be measurement noise; this comparison is not evidence of a health outcome."]
    ],
    "fat-free-mass-change": [
      ["How to use it", "Enter earlier and current body mass in kg and body-fat percentage from the same or comparable assessment method."],
      ["Method", "For each time point, fat-free mass = body mass × (1 − body-fat fraction). The reported change is current fat-free mass minus earlier fat-free mass."],
      ["Limitations", "The calculation inherits error from body mass and especially body-fat estimates. It does not directly measure muscle gain or loss; changes in water, glycogen and other fat-free tissues also contribute."]
    ],
    "neck-circumference": [
      ["How to use it", "Measure the neck at the same defined anatomical landmark each time, with the tape horizontal and gently touching the skin without compression. Enter the circumference and unit."],
      ["Method", "The calculator derives the diameter, radius and area of a circle with the same circumference: diameter = C ÷ π, radius = C ÷ 2π and area = C² ÷ 4π."],
      ["Limitations", "The human neck is not circular. These are circle-equivalent geometric approximations; they do not estimate airway size, tissue composition, body fat or medical risk."]
    ],
    "muac": [
      ["How to use it", "Measure mid-upper-arm circumference at the midpoint between the acromion and olecranon landmarks. At the same site, measure triceps skinfold with a suitable caliper. Enter both values with their units."],
      ["Method", "The model estimates mid-upper-arm muscle circumference as MUAC − π × triceps skinfold, then derives circular total-arm and muscle-plus-bone areas. The page reports the residual area as a fat-area estimate."],
      ["Limitations", "This simplified concentric-circle model assumes circular compartments and does not apply the sex-specific bone-area correction described in some corrected arm-muscle-area methods. It is not a direct muscle-mass measurement or diagnosis; skinfold compressibility and bone size affect accuracy.", "Heymsfield et al. (1982), revised arm muscle area equations", "https://pubmed.ncbi.nlm.nih.gov/7124671/"]
    ],
    "mid-thigh-circumference": [
      ["How to use it", "Measure thigh circumference at a precisely recorded midpoint or other consistent protocol. If using the optional segment length, measure the length of the same thigh segment and enter its unit."],
      ["Method", "The calculator derives circle-equivalent diameter, radius and cross-sectional area from circumference. Optional volume proxy = circular area × segment length, treating the segment as a cylinder."],
      ["Limitations", "The thigh is not a perfect circle or uniform cylinder. The derived area and volume are geometric proxies, not anatomical muscle volume, fat volume or a clinical measurement."]
    ],
    "calf-circumference": [
      ["How to use it", "Measure the calf at its maximum circumference with the participant standing or seated in a consistently defined posture. If using segment length, measure the corresponding calf segment."],
      ["Method", "The calculator derives circle-equivalent diameter, radius and area from circumference. Optional volume proxy = circular area × segment length."],
      ["Limitations", "The calf is not a perfect circle or uniform cylinder. These are geometric approximations, not muscle volume or a diagnosis. For clinical or population comparisons, use a validated protocol and reference appropriate to the population."]
    ],
    "bai": [
      ["How to use it", "Enter hip circumference and standing height with their units, plus age in completed years. This page restricts use to adults aged 18 years or older."],
      ["Method", "Body Adiposity Index = hip circumference in cm ÷ height in metres raised to 1.5, minus 18. The result is presented as a population-derived percentage estimate."],
      ["Limitations", "BAI is not a direct body-fat measurement. Independent evaluation found sex- and adiposity-related bias and no greater accuracy than BMI or circumference measures. Do not use it as a diagnosis or sole assessment.", "Bergman et al. (2011) and independent evaluation (2012)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3477292/"]
    ],
    "relative-muscle-mass": [
      ["How to use it", "Enter skeletal muscle mass from a suitable body-composition assessment and body mass from the same time point. Select the correct unit for each measurement."],
      ["Method", "Relative muscle mass (%) = assessment-reported skeletal muscle mass ÷ body mass × 100 after converting both values to kg."],
      ["Limitations", "The calculator does not estimate skeletal muscle mass or verify the device's method. Device definitions differ; the result is a proportion of the supplied input, not a universal fitness or health category."]
    ],
    "skeletal-muscle-mass": [
      ["How to use it", "Enter assessment-reported skeletal muscle mass, body mass and standing height. Use measurements from the same time point and select the correct units."],
      ["Method", "The page reports the supplied skeletal muscle mass, its percentage of body mass, and SMMI = skeletal muscle mass in kg ÷ height in metres squared."],
      ["Limitations", "This tool does not predict muscle mass. Device algorithms and definitions vary, and SMMI interpretation requires a population-, sex-, age- and method-matched reference. No universal threshold is assigned."]
    ],
    "almi": [
      ["How to use it", "Enter appendicular lean mass reported by a suitable body-composition assessment, such as DXA, and standing height. Select the correct mass and height units."],
      ["Method", "ALMI = appendicular lean mass in kg ÷ height in metres squared."],
      ["Limitations", "The calculator does not estimate appendicular lean mass. Interpretation depends on the assessment method and an appropriate sex-, age- and population-specific reference; do not apply a universal cutoff."]
    ],
    "fmi": [
      ["How to use it", "Enter fat mass reported by a body-composition assessment and standing height. Use the same assessment time point and select the correct units."],
      ["Method", "FMI = fat mass in kg ÷ height in metres squared."],
      ["Limitations", "Fat mass must come from an assessment; this calculator does not infer it from BMI or circumference. Interpretation depends on the device and a population-matched reference."]
    ],
    "ffmi-comparison": [
      ["How to use it", "For each person, enter body mass, body-fat percentage and standing height. Choose units independently for each person's mass and height; use comparable measurement methods."],
      ["Method", "For each person, fat-free mass = body mass × (1 − body-fat fraction), then FFMI = fat-free mass in kg ÷ height in metres squared. The calculator compares the two indices."],
      ["Limitations", "Body-fat estimation error propagates into FFMI. Small differences may be within measurement error. FFMI is descriptive and does not independently assess health, strength or athletic ability; no universal performance tier is assigned."]
    ],
    "chest-hip-ratio": [
      ["How to use it", "Measure chest and hip circumferences at defined landmarks, with consistent posture and tape tension. Enter each value and choose the applicable unit."],
      ["Method", "Chest-to-hip ratio = chest circumference ÷ hip circumference after both values are converted to centimetres."],
      ["Limitations", "This is descriptive arithmetic, not a validated health-risk score, diagnosis, attractiveness measure or athletic-potential score. Landmark and breathing differences can alter the result."]
    ],
    "shoulder-chest-ratio": [
      ["How to use it", "Measure shoulder circumference using the page's tape path and chest circumference at a consistent chest landmark. Enter both readings and their units."],
      ["Method", "Shoulder-to-chest ratio = shoulder measurement ÷ chest circumference after conversion to centimetres."],
      ["Limitations", "Do not substitute biacromial skeletal breadth for shoulder circumference. Posture, muscle contraction, breathing and tape path affect the measurements. No universal cutoff is established."]
    ],
    "biacromial-biacristal-width-ratio": [
      ["How to use it", "Measure biacromial breadth between the acromial landmarks and biacristal breadth between the iliac-crest landmarks with an appropriate anthropometric caliper. Use a trained measurer and the same protocol."],
      ["Method", "Biacromial-to-biacristal ratio = shoulder skeletal breadth ÷ pelvic skeletal breadth after conversion to centimetres."],
      ["Limitations", "These are skeletal breadth measurements, not shoulder or hip circumferences. Landmark palpation and caliper placement matter; no universal health or aesthetic cutoff is assigned."]
    ],
    "sitting-height-arm-span-ratio": [
      ["How to use it", "Measure sitting height with the participant seated upright against a suitable measuring surface, then measure arm span fingertip-to-fingertip with arms horizontal. Use consistent posture and units."],
      ["Method", "Sitting-height-to-arm-span ratio = sitting height ÷ arm span after conversion to centimetres."],
      ["Limitations", "Posture, arm position, spinal compression and landmark technique affect both readings. This is a descriptive proportion; interpretation requires a suitable population reference."]
    ],
    "arm-span-difference": [
      ["How to use it", "Measure arm span fingertip-to-fingertip with arms horizontal and standing height without shoes. Use the same units and consistent posture."],
      ["Method", "Difference = arm span − standing height. Percentage difference = signed difference ÷ standing height × 100."],
      ["Limitations", "A positive value means arm span is longer; a negative value means standing height is greater. Small differences may be measurement error and are not diagnostic."]
    ],
    "waist-circumference-reference": [
      ["How to use it", "Measure waist circumference with a non-stretch tape at the anatomical site required by the reference guideline you intend to use. Keep the tape horizontal and measure after a normal exhalation without compressing the skin."],
      ["Method", "This page records the supplied waist circumference in the selected unit and converts it to the displayed reference unit. It deliberately does not assign a universal risk category."],
      ["Limitations", "Waist protocols differ between guidelines and populations. Any interpretation must use a sex-, ethnicity- and guideline-appropriate reference and the exact measurement site."]
    ],
    "waist-height-comparison": [
      ["How to use it", "For each person, measure waist circumference at the same defined landmark and standing height without shoes. Use consistent units and measurement conditions."],
      ["Method", "Each waist-to-height ratio = waist circumference ÷ standing height. The page reports both ratios and their absolute difference."],
      ["Limitations", "Waist-to-height ratio is a screening measure in some guidelines, not a diagnosis. This comparison does not assign a risk category; use appropriate age-, sex- and population-specific guidance."]
    ],
    "body-volume": [
      ["How to use it", "Enter mass in kg and density in kg/L. Density must come from a suitable measurement or a clearly stated assumption; do not assume a generic human-body density for an individual."],
      ["Method", "Volume in litres = mass in kg ÷ density in kg/L."],
      ["Limitations", "The output is only as valid as the supplied density and matching measurement conditions. This calculation does not measure body volume or infer density from BMI."]
    ],
    "body-density": [
      ["How to use it", "Enter mass in kg and measured volume in litres. Ensure both refer to the same object and measurement time point."],
      ["Method", "Average density in kg/L = mass in kg ÷ volume in litres."],
      ["Limitations", "This is a physical density calculation, not a body-fat estimate. Converting body density to body-fat percentage requires a separately justified model and assumptions; none is applied here."]
    ],
    "anthropometric-z-score": [
      ["How to use it", "Enter the observed measurement, reference-population mean and reference standard deviation in the same unit. Select reference data matching age, sex, population and the exact measurement protocol."],
      ["Method", "Z-score = (observed value − reference mean) ÷ reference standard deviation."],
      ["Limitations", "The calculator does not supply or validate the reference dataset. A z-score is only meaningful when the reference population and method match. Percentile conversion additionally depends on distributional assumptions; this result alone is not a diagnosis."]
    ],
    "body-measurement-symmetry": [
      ["How to use it", "Measure left and right sides at the same anatomical landmark, in the same posture and under comparable conditions. Enter both readings using the same unit."],
      ["Method", "Absolute difference = |left − right|. Relative difference = absolute difference ÷ mean(left, right) × 100."],
      ["Limitations", "This is a descriptive side-to-side comparison, not a diagnosis of injury, weakness or dysfunction. Natural asymmetry and measurement error are common; no universal threshold is assigned."]
    ],
    "arm-waist-ratio": [
      ["How to use it", "Measure upper-arm circumference at a defined midpoint and waist circumference at a defined waist landmark. Use the same unit and consistent tape tension."],
      ["Method", "Arm-to-waist ratio = upper-arm circumference ÷ waist circumference."],
      ["Limitations", "This is a descriptive ratio without a universal clinical cutoff. Arm flexion, tape placement, breathing and waist protocol affect the result."]
    ],
    "leg-height-ratio": [
      ["How to use it", "Measure leg length using a clearly defined anatomical protocol and standing height without shoes. Do not mix different definitions of leg length between measurements."],
      ["Method", "Leg-to-height ratio = entered leg length ÷ standing height after unit conversion."],
      ["Limitations", "Leg-length definitions and landmarks vary. This is descriptive arithmetic, not a diagnosis or a universal body-proportion standard."]
    ],
    "sitting-height-ratio": [
      ["How to use it", "Measure sitting height while seated upright on a firm surface, using a consistent head position and measuring surface. Measure standing height without shoes."],
      ["Method", "Sitting-height ratio = sitting height ÷ standing height after unit conversion."],
      ["Limitations", "Posture, spinal compression and measurement technique affect the result. Interpretation requires age- and population-matched references; no universal cutoff is assigned."]
    ]
  };

  const aliases = { sunlight: "sunlight-duration", pal: "physical-activity-level" };
  const path = (window.location && window.location.pathname ? window.location.pathname : "").split("/").pop().replace(/\.html$/i, "");
  const slug = (document.body && document.body.dataset && document.body.dataset.calculator) || aliases[path] || path;
  const guide = guides[slug];
  const target = document.querySelector(".cf-education-card .cf-education-content");
  if (!guide || !target) return;

  while (target.firstChild) target.removeChild(target.firstChild);
  guide.forEach(([heading, copy, sourceTitle, sourceUrl]) => {
    const section = document.createElement("div");
    section.className = "cf-education-section";
    const h = document.createElement("h3");
    h.textContent = heading;
    const p = document.createElement("p");
    p.textContent = copy;
    section.appendChild(h);
    section.appendChild(p);
    if (sourceTitle && sourceUrl) {
      const a = document.createElement("a");
      a.href = sourceUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = sourceTitle;
      const source = document.createElement("p");
      source.className = "cf-education-source";
      source.appendChild(a);
      section.appendChild(source);
    }
    target.appendChild(section);
  });
  window.ClerFitCalculatorGuides = Object.keys(guides);
})();
