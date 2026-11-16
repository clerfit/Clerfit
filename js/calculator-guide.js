/* ClerFit calculator-specific practical guides.
 * Loaded by page-chrome.js on calculator pages. Content is selected from the page title,
 * calculator inputs and the calculator's own displayed method; no calculation code is changed.
 */
(() => {
  "use strict";

  const text = (value) => (value || "").replace(/\\s+/g, " ").trim();
  const titleFromPage = () => {
    const heading = document.querySelector(".card h2, .calculator-card h2, main h1, .main h1");
    return text(heading && heading.textContent) || text(document.title).replace(/^ClerFit\\s*[–—-]\\s*/i, "");
  };
  const inputLabels = () => [...document.querySelectorAll(".main label, main label, .card label")]
    .map((label) => text(label.textContent))
    .filter(Boolean)
    .filter((label, index, all) => all.indexOf(label) === index)
    .slice(0, 12);

  function classify(title, labels) {
    const value = (title + " " + labels.join(" ")).toLowerCase();
    if (/face|facial|jaw|chin|nose|forehead|cheek|eye|lip|brow|aesthetic/.test(value)) return "face";
    if (/skinfold|jackson|durnin|navy|somatotype/.test(value)) return "skinfold";
    if (/waist|hip|chest|neck|thigh|arm|shoulder|calf|wrist|ankle|girth|circumference|width|diameter|ratio/.test(value)) return "circumference";
    if (/height|stature|leg length|sitting height|arm span|span difference|segment|femur|tibia/.test(value)) return "height";
    if (/weight|mass|bmi|body fat|fat-free|lean mass|water|bone|visceral|ponderal|ffmi|bsa|absi|rfm/.test(value)) return "body";
    if (/push.?up|pull.?up|plank|run|walk|step test|jump|sprint|vo2|fitness|strength|endurance|flexibility|sit.?and.?reach/.test(value)) return "fitness";
    if (/protein|calorie|energy|carbohydrate|fat intake|sugar|fibre|fiber|cholesterol|hydration|water intake|nutrition|meal/.test(value)) return "nutrition";
    if (/pace|speed|distance|time|duration|date|age|sleep|interval|unit|conversion/.test(value)) return "utility";
    return "general";
  }

  const guides = {
    face: {
      purpose: "This tool compares manually entered facial dimensions or landmarks. The result is only as consistent as the landmark definitions and measurement technique used.",
      equipment: ["A flexible, non-stretch measuring tape for curved distances, or a small millimetre ruler/caliper for straight distances", "A mirror and good, even lighting", "A washable skin-safe pencil only if you need to mark a landmark"],
      preparation: ["Remove glasses, hats and anything covering the measurement landmarks; tie hair away from the face where relevant.", "Sit or stand upright with your head level, jaw relaxed and eyes looking straight ahead.", "Use the same landmark definitions and tool each time. Do not substitute a photo estimate for a direct measurement unless the calculator explicitly asks for image-based values."],
      steps: ["Identify each named landmark in the calculator before measuring. If a landmark is unclear, check the page's definition rather than guessing.", "Place the ruler or tape against the measurement line without pressing into soft tissue.", "Keep the head neutral; avoid tilting, turning or changing facial expression between measurements.", "Record each value in the unit shown beside that field. Convert only with the calculator's supported unit selector.", "Repeat each measurement two or three times. If readings differ, reposition the tool and repeat; use a consistent averaging method."],
      accuracy: ["Measure in the same posture, lighting and time conditions when comparing sessions.", "Keep the tool aligned to the intended anatomical line; small changes in endpoints can materially change short facial distances.", "Do not pull the skin, compress soft tissue or infer hidden landmarks from an angled photograph."],
      meaning: "Read the output as a geometric comparison of the entered dimensions, not a diagnosis or a universal attractiveness score. The page's displayed method and labels define how this particular result is classified.",
      limits: "Facial proportions vary naturally. There are no universal clinical cut-offs for attractiveness, and a ratio cannot assess health, identity or character. Self-measurement is approximate; seek a qualified clinician for a medical concern."
    },
    skinfold: {
      purpose: "Skinfold equations estimate body-fat percentage from selected subcutaneous skinfold sites. They depend on the exact sites, caliper technique and the equation's intended population.",
      equipment: ["A calibrated skinfold caliper suitable for the method", "A flexible measuring tape and washable skin marker", "A trained helper or assessor; self-measurement at some sites is difficult", "The exact site diagram or protocol specified by the named equation"],
      preparation: ["Confirm which equation is named and whether it applies to the person's age, sex and population.", "Use the same side of the body and the same anatomical site definitions each session.", "Avoid measuring immediately after exercise, when skin temperature and fluid shifts may affect readings."],
      steps: ["Locate and mark every required site using the named protocol; do not swap sites or use a generic pinch location.", "Grasp a firm fold of skin and subcutaneous tissue, keeping muscle out of the pinch.", "Place the caliper jaws at the protocol-specified position, generally across the fold and not directly on the fingers.", "Read the caliper at the specified time after applying pressure; follow the caliper and equation protocol.", "Take repeat readings at each site, rotating through sites between rounds. Recheck any unusually different readings.", "Enter each site value in millimetres and verify that every required site is present before calculating."],
      accuracy: ["Use a consistent assessor, caliper, side, landmark and measurement sequence.", "Do not estimate a skinfold by pinching without a caliper.", "If the fold cannot be grasped reliably or the assessor is untrained, treat the estimate as uncertain."],
      meaning: "The result is an equation-based estimate, not a direct measurement of total body fat. Compare trends only when the same protocol is repeated consistently.",
      limits: "Different equations can produce different estimates. Hydration, age, sex, body-fat distribution, assessor skill and site selection affect accuracy. Do not use the result as a diagnosis or as the sole basis for health decisions."
    },
    circumference: {
      purpose: "Circumference and body-proportion calculators compare external body dimensions. Accurate results require repeatable anatomical landmarks, a level tape and minimal compression of soft tissue.",
      equipment: ["A flexible, non-stretch anthropometric tape marked in millimetres or centimetres", "A mirror or helper to check that the tape is level", "A washable marker for locating a landmark when needed", "A record of the exact landmark and measurement condition used"],
      preparation: ["Measure over light clothing or directly on skin when appropriate; avoid bulky clothing.", "Stand relaxed with weight distributed evenly and muscles not deliberately flexed, unless the calculator's protocol says otherwise.", "Identify the exact landmark first. For waist, hip, chest, arm or thigh measurements, do not assume that the narrowest, widest or most convenient point is the required site."],
      steps: ["Find the anatomical landmark named by the calculator or its on-page instructions.", "Wrap the tape around the body at that level. Check in a mirror or with a helper that it is horizontal and not twisted.", "Keep the tape snug against the skin without indenting or compressing it.", "Use the breathing instruction appropriate to the site; for a relaxed waist measure, read at the end of a normal exhalation rather than sucking in the abdomen.", "Read to the nearest marked increment and record the unit exactly as selected in the calculator.", "Repeat at least twice. If readings disagree, reposition the tape and repeat using the same posture."],
      accuracy: ["Use the same side, landmark, posture, tape tension and breathing phase each time.", "Do not measure over a belt, thick clothing or after deliberately flexing the muscle.", "For ratios, ensure numerator and denominator use compatible length units; the calculator may convert units, but verify the displayed selectors."],
      meaning: "A ratio is a comparison of the entered dimensions. It does not independently establish health, muscularity or body shape; interpretation depends on the specific ratio and the method shown on this page.",
      limits: "Tape measurements are sensitive to landmark choice, posture, breathing, clothing and tape tension. A single value cannot diagnose disease or determine body composition. Use a trained anthropometrist for high-precision assessment."
    },
    height: {
      purpose: "Height, span and segment calculators depend on consistent body position and clearly defined endpoints. Small posture or landmark errors can change the result.",
      equipment: ["A wall-mounted stadiometer or a flat vertical wall with a rigid measuring rule for standing height", "A flat floor and a right-angle headpiece/book for checking head position", "A helper for standing height, arm span or segment measurements", "A rigid ruler or anthropometric tape for shorter distances"],
      preparation: ["Remove shoes, hats and bulky hair accessories. Use a hard, level floor rather than carpet.", "Stand naturally; do not stretch upward, rise onto toes or force the back against the wall.", "For sitting height or limb segments, use the exact seated posture and endpoints defined by the calculator."],
      steps: ["Position the body in the protocol's required stance. For standing stature, keep heels grounded and look straight ahead with the head level.", "Bring the measuring headpiece down to the crown of the head, compressing hair gently but not the scalp.", "For arm span, extend both arms horizontally at shoulder height without twisting the trunk; measure fingertip to fingertip with a helper.", "For a segment or limb length, identify both endpoints before placing the ruler or tape; do not measure along a different path on repeat attempts.", "Record the value and unit, then repeat. Take another reading if the difference is larger than the tool's smallest division."],
      accuracy: ["Measure barefoot at a similar time of day if tracking stature; spinal compression can cause small daily variation.", "Keep the head level and shoulders relaxed. Do not round the value to a preferred number.", "Use the same endpoint definitions for sitting height, arm span and limb-length comparisons."],
      meaning: "The calculator compares the specific lengths entered. A ratio or difference describes those measurements; it does not establish growth, skeletal health or athletic potential on its own.",
      limits: "Posture, equipment, hair, footwear, time of day and landmark selection affect measurements. Growth and clinical assessments require age-appropriate professional interpretation."
    },
    body: {
      purpose: "This calculator uses body measurements or entered body-composition values to produce an estimate or index. The result is determined by the method displayed on this page, not by a direct scan of the body.",
      equipment: ["A reliable digital body-weight scale on a hard, level floor when body mass is required", "A stadiometer or accurate height-measuring setup when stature is required", "A non-stretch tape or other named measurement tool if the calculator requests circumferences", "The source measurement or assessment report when the calculator asks for body-fat or composition values"],
      preparation: ["Check every input's unit and whether it asks for a measured value or a previously estimated value.", "For body weight, use the same scale on a hard floor, ideally at a consistent time and in similar clothing.", "Do not enter a guess for a value that requires a separate assessment, such as body-fat percentage or a circumference."],
      steps: ["Read the label and helper text for every field; note whether the calculator expects kilograms, pounds, centimetres, metres, inches or a percentage.", "Measure or obtain each requested value using the relevant device and a repeatable protocol.", "Enter values without mixing units. Use the page's unit selectors where provided.", "Check that values are positive, plausible and refer to the same person and assessment period.", "Calculate and review the displayed formula, assumptions and result units."],
      accuracy: ["Use calibrated equipment and consistent conditions.", "Do not compare estimates from different equations as though they were direct measurements.", "When tracking change, repeat the same measurement method and avoid over-interpreting small fluctuations."],
      meaning: "An index or estimate is a screening or descriptive number. Its interpretation depends on the named formula, population, units and any category boundaries explicitly shown on the page.",
      limits: "Many body-composition formulas are indirect estimates and can be affected by age, sex, hydration, muscularity and population differences. A result is not a medical diagnosis or a substitute for a clinician's assessment."
    },
    fitness: {
      purpose: "Fitness-test calculators are meaningful only when the test protocol is followed consistently. The test may estimate performance or capacity rather than measure it directly.",
      equipment: ["The exact equipment required by the named test (for example, a measured track, stopwatch, step, mat, pull-up bar or calibrated device)", "A safe, non-slip testing area with adequate space", "A timer and a way to record repetitions, distance, duration or recovery values", "Water and appropriate footwear"],
      preparation: ["Read the full test protocol and confirm the required duration, pace, range of motion and scoring rules.", "Do not test when ill, injured, dizzy or unusually fatigued. Choose a safe surface and remove obstacles.", "Complete a gradual 5–10 minute warm-up appropriate to the activity, followed by easy practice movements."],
      steps: ["Set up the equipment and measure the course or test area before starting.", "Start from the prescribed position and follow the exact cadence, duration and movement standard.", "Count only repetitions that meet the stated range-of-motion and technique criteria.", "Stop if you experience chest pain, faintness, unusual breathlessness or sharp pain.", "Record the raw result immediately, including units, test duration and any protocol deviations.", "Enter the recorded value into the calculator and check that the test version matches the one used."],
      accuracy: ["Use the same protocol, equipment, surface, warm-up and rest conditions for repeat tests.", "Avoid comparing results from different test versions or different scoring rules.", "Prioritise valid technique over a higher repetition or distance count."],
      meaning: "The result reflects performance under the selected test conditions. Norms and estimated values apply only when the calculator identifies a suitable reference population and protocol.",
      limits: "Performance changes with training status, sleep, motivation, environment, pacing and technique. This tool cannot clear someone for exercise or diagnose a heart, lung or musculoskeletal condition."
    },
    nutrition: {
      purpose: "Nutrition calculators estimate intake or compare entered food values with a selected target. They are only as accurate as the food data, portion sizes and time period entered.",
      equipment: ["A kitchen scale or standard measuring cups/spoons for portion sizes", "Food labels or a reliable food-composition source", "A food diary or meal record for the time period being assessed", "A calculator or notes to keep serving sizes and units consistent"],
      preparation: ["Choose the correct time period (per serving, meal, day or another interval) before entering data.", "Check whether values refer to cooked or uncooked food and whether the label is per 100 g or per serving.", "Include drinks, sauces, snacks and cooking ingredients when the calculator's definition requires them."],
      steps: ["Identify the food or nutrient requested and read the unit carefully (g, mg, kcal or servings).", "Weigh or measure the portion rather than relying on memory when precision matters.", "Use the matching food state and serving size from the label or database.", "Add the values for the same time period and avoid double-counting ingredients already included in a prepared food.", "Enter the total and review whether the result is an estimate, a target comparison or a percentage."],
      accuracy: ["Use consistent food records and portion units.", "Prefer product labels for branded foods and a recognised composition database for unlabelled foods.", "Remember that recipes, brands, cooking methods and serving sizes vary."],
      meaning: "The output describes the data entered; it is not a personalised diet prescription. Compare it with an appropriate dietary reference only when the calculator clearly identifies the reference and population.",
      limits: "Food labels and databases have rounding and natural variation. Individual needs vary with age, growth, activity, pregnancy, health and medications. Seek a registered dietitian or clinician for individual nutrition advice."
    },
    utility: {
      purpose: "This utility converts or compares values using the units and definitions selected on the page. Correct unit selection is essential because a numerically valid input can still represent the wrong quantity.",
      equipment: ["The original measurement, record or timing source", "A reliable stopwatch, clock, measuring device or published value if the calculator requires one", "The unit label from the original source"],
      preparation: ["Identify the quantity being converted and its original unit before typing.", "Check whether the input is a duration, rate, distance, date or another quantity; similar-looking units may represent different things.", "Use the exact precision available from the original measurement."],
      steps: ["Select the source unit shown on the original measurement.", "Enter the value without adding unit symbols unless the field specifically requests them.", "Choose the requested output unit and check that it measures the same physical quantity.", "Run the calculation and confirm that the output unit is labelled.", "For rates such as speed or pace, check the distance and time units together."],
      accuracy: ["Do not round intermediate values unless the page instructs you to.", "Check whether the result is a rate, total, interval or simple unit conversion.", "Retain the original value so the conversion can be independently checked."],
      meaning: "The output is a mathematical conversion or comparison of the values supplied. It does not validate the accuracy of the original measurement.",
      limits: "Conversion cannot correct an inaccurate source value or a misunderstood unit. Calendar, time-zone and rate calculations may depend on conventions stated by the page."
    },
    general: {
      purpose: "This guide explains a repeatable way to prepare inputs, use the calculator and assess the reliability of its output. Follow the specific field labels and method shown on this page.",
      equipment: ["The measuring device or original record required by each input field", "A way to record measurements and their units", "A second person or helper when the measurement is difficult to take accurately"],
      preparation: ["Read every field label, tooltip and unit selector before entering values.", "Identify which inputs must be measured and which may be obtained from a separate assessment.", "Use a consistent method and avoid estimating values that can be measured directly."],
      steps: ["Gather every required input and confirm its source.", "Measure or obtain each value using the method appropriate to that quantity.", "Enter values in the selected units and check for missing, implausible or mixed-unit inputs.", "Run the calculator and review the displayed formula, result unit and any assumptions.", "Save the raw measurements and method if you plan to repeat the calculation later."],
      accuracy: ["Use suitable, well-maintained equipment.", "Repeat measurements when practical and investigate large differences.", "Keep the same method, unit conventions and conditions when comparing results."],
      meaning: "Interpret the output according to the formula and definitions presented on this page. A calculator result describes the entered data; it does not automatically establish a diagnosis or recommendation.",
      limits: "Measurement error, assumptions and population differences can affect the result. Seek qualified professional advice where the result may influence a health, safety or training decision."
    }
  };

  function section(parent, heading, content) {
    const wrapper = document.createElement("section");
    wrapper.className = "cf-guide-section";
    const h = document.createElement("h3");
    h.textContent = heading;
    wrapper.appendChild(h);
    if (Array.isArray(content)) {
      const list = document.createElement("ol");
      content.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      wrapper.appendChild(list);
    } else {
      const p = document.createElement("p");
      p.textContent = content;
      wrapper.appendChild(p);
    }
    parent.appendChild(wrapper);
  }

  function addGuide() {
    const main = document.querySelector(".main, main");
    if (!main || document.querySelector(".cf-practical-guide")) return;
    const title = titleFromPage();
    if (!title || /home|contact|privacy|terms/i.test(title)) return;

    const labels = inputLabels();
    const kind = classify(title, labels);
    const guide = guides[kind];
    const card = document.createElement("section");
    card.className = "cf-education-card cf-practical-guide";
    card.setAttribute("aria-labelledby", "cf-practical-guide-title");

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.id = "cf-practical-guide-title";
    summary.append(document.createTextNode("Practical Guide: " + title + " "));
    const toggle = document.createElement("span");
    toggle.className = "cf-education-toggle";
    toggle.setAttribute("aria-hidden", "true");
    toggle.textContent = "+";
    summary.appendChild(toggle);

    const content = document.createElement("div");
    content.className = "cf-education-content cf-practical-guide-content";
    const intro = document.createElement("p");
    intro.className = "cf-guide-intro";
    intro.textContent = guide.purpose;
    content.appendChild(intro);

    section(content, "Equipment you may need", guide.equipment);
    section(content, "Before you begin", guide.preparation);
    section(content, "Step-by-step instructions", guide.steps);
    section(content, "Tips for accurate results", guide.accuracy);
    section(content, "Understanding your result", guide.meaning);
    section(content, "Limitations and safety", guide.limits);

    const formula = document.querySelector("#formula, .formula, [data-formula]");
    if (formula && text(formula.textContent)) {
      const method = document.createElement("div");
      method.className = "cf-education-formula cf-guide-method";
      const label = document.createElement("strong");
      label.textContent = "Method shown on this calculator";
      const detail = document.createElement("p");
      detail.textContent = text(formula.textContent);
      method.append(label, detail);
      content.insertBefore(method, content.children[1] || null);
    }

    if (labels.length) {
      const fields = document.createElement("div");
      fields.className = "cf-guide-fields";
      const heading = document.createElement("strong");
      heading.textContent = "Inputs on this page";
      const list = document.createElement("ul");
      labels.forEach((label) => {
        const item = document.createElement("li");
        item.textContent = label;
        list.appendChild(item);
      });
      fields.append(heading, list);
      content.appendChild(fields);
    }

    const note = document.createElement("p");
    note.className = "cf-education-note";
    note.textContent = "ClerFit is an educational tool. Follow the calculator's stated method and units. This guide does not replace medical, nutrition, exercise or other professional advice.";
    content.appendChild(note);

    details.append(summary, content);
    card.appendChild(details);

    const existingEducation = [...main.querySelectorAll(".cf-education-card")].pop();
    if (existingEducation) existingEducation.insertAdjacentElement("afterend", card);
    else main.appendChild(card);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addGuide, { once: true });
  else addGuide();
})();
