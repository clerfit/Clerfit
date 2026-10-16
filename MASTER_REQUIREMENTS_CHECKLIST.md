# ClerFit Master Requirements Checklist

Source: user-provided Master Engineering Prompt in this conversation, plus the user’s previously stated UI/UX preferences.

## A. Calculator inventory (all requested calculators reconciled to the current registry)

The prompt lists 110 distinct calculator names across 11 categories (numbering skips 51 and has a noted discrepancy around item 44). The current registry contains 118 routes; route presence is not proof of formula correctness.

| Source # | Requested calculator | Matched route title | File | Route | Formula/reference audit | Browser interaction |
|---:|---|---|---|---|---|---|
| 1 | BMI Calculator | BMI Calculator | `html/BMI.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 2 | Body Fat Percentage Calculator | Body Fat Percentage | `html/bodyfat.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 3 | Lean Body Mass Calculator | Lean Body Mass | `html/leanmass.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 4 | Fat Mass Calculator | Fat Mass | `html/fatmass.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 5 | FFMI Calculator | FFMI | `html/ffmi.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 6 | Body Surface Area Calculator | Body Surface Area | `html/bsa.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 7 | Waist-to-Hip Ratio Calculator | Waist-to-Hip Ratio | `html/whr.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 8 | Waist-to-Height Ratio Calculator | Waist-to-Height Ratio | `html/wht.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 9 | Ideal Body Weight Calculator | Ideal Body Weight | `html/idealweight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 10 | Body Shape / Somatotype Calculator | Body Shape / Somatotype | `html/somatotype.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 11 | Face Shape Calculator | Face Shape | `html/face-shape.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 12 | Face Length Ratio | Face Length Ratio | `html/face-length.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 13 | Facial Thirds | Facial Thirds | `html/facial-thirds.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 14 | Jaw Width Ratio | Jaw Width Ratio | `html/jaw-width-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 15 | Chin Height Ratio | Chin Height Ratio | `html/chin-height-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 16 | Nose Length Ratio | Nose Length Ratio | `html/nose-length-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 17 | Mouth Width Ratio | Mouth Width Ratio | `html/mouth-width-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 18 | Eye Spacing Calculator | Eye Spacing | `html/eye-spacing.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 19 | Lower Face Height | Lower Face Height | `html/lower-face-height.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 20 | Facial Balance Index | Facial Balance Index | `html/facial-balance.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 21 | BMR Calculator | BMR Calculator | `html/bmr.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 22 | RMR Calculator | RMR Calculator | `html/rmr.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 23 | TDEE Calculator | TDEE Calculator | `html/tdee.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 24 | Maintenance Calories | Maintenance Calories | `html/maintenance.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 25 | Calorie Deficit | Calorie Deficit | `html/deficit.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 26 | Calorie Surplus | Calorie Surplus | `html/surplus.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 27 | Energy Balance | Energy Balance | `html/energy-balance.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 28 | Daily Energy Need | Daily Energy Need | `html/daily-energy.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 29 | Calories per kg | Calories per kg | `html/calories-kg.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 30 | Metabolic Age | Metabolic Age | `html/metabolic-age.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 31 | Protein Intake | Protein Intake | `html/protein.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 32 | Carbohydrate Intake | Carbohydrate Intake | `html/carbs.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 33 | Fat Intake | Fat Intake | `html/fat.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 34 | Macro Split | Macro Split | `html/macro-split.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 35 | Fiber Intake | Fiber Intake | `html/fiber.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 36 | Water Intake | Water Intake | `html/water.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 37 | Sodium Intake | Sodium Intake | `html/sodium.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 38 | Potassium Intake | Potassium Intake | `html/potassium.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 39 | Meal Calorie Split | Meal Calorie Split | `html/meal-split.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 40 | Water Loss Replacement | Water Loss Replacement | `html/hydration-loss.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 41 | One-Rep Max | One-Rep Max | `html/1rm.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 42 | Relative Strength | Relative Strength | `html/relative-strength.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 43 | Training Volume | Training Volume | `html/training-volume.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 44 | Weekly Load | Weekly Load | `html/weekly-load.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 45 | Strength-to-Weight | Strength-to-Weight | `html/strength-weight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 46 | Push-Up Index | Push-Up Index | `html/pushup-index.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 47 | Pull-Up Index | Pull-Up Index | `html/pullup-index.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 48 | Squat Ratio | Squat Ratio | `html/squat-ratio.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 49 | Work Output | Work Output | `html/work-output.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 50 | Performance Score | Performance Score | `html/performance-score.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 52 | Running Pace | Running Pace | `html/running-pace.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 53 | Walking Speed | Walking Speed | `html/walking-speed.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 54 | Distance-Time | Distance-Time | `html/distance-time.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 55 | Calories Burned | Calories Burned | `html/cardio-calories.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 56 | Step Length | Step Length | `html/step-length.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 57 | Stride Length | Stride Length | `html/stride-length.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 58 | Cadence | Cadence | `html/cadence.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 59 | Cooper Test | Cooper Test | `html/cooper-test.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 60 | Endurance Time | Endurance Time | `html/endurance-time.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 61 | Speed-Weight Ratio | Speed-Weight Ratio | `html/speed-weight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 62 | Weekly Weight Change | Weekly Weight Change | `html/weekly-weight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 63 | Monthly Weight Change | Monthly Weight Change | `html/monthly-weight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 64 | Weight Loss Rate | Weight Loss Rate | `html/weight-loss-rate.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 65 | Weight Gain Rate | Weight Gain Rate | `html/weight-gain-rate.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 66 | Goal Timeline | Goal Timeline | `html/goal-timeline.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 67 | BMI Change | BMI Change | `html/bmi-change.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 68 | Waist Change | Waist Change | `html/waist-change.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 69 | Hip Change | Hip Change | `html/hip-change.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 70 | Circumference Tracker | Circumference Tracker | `html/circumference-track.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 71 | Weight Stability | Weight Stability | `html/weight-stability.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 72 | Sleep Duration | Sleep Duration | `html/sleep-duration.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 73 | Sleep Consistency | Sleep Consistency | `html/sleep-consistency.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 74 | Sleep Timing | Sleep Timing | `html/sleep-timing.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 75 | Training-Rest Ratio | Training-Rest Ratio | `html/training-rest.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 76 | Rest Interval | Rest Interval | `html/rest-interval.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 77 | Session Density | Session Density | `html/session-density.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 78 | Load-Recovery Ratio | Load-Recovery Ratio | `html/load-recovery-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 79 | Weekly Training Count | Weekly Training Count | `html/weekly-training-count.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 80 | Recovery Time | Recovery Time | `html/recovery-time.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 81 | Fatigue Index | Fatigue Index | `html/fatigue-index.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 82 | BMI for Age | BMI for Age | `html/bmi-for-age.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 83 | Waist Risk | Waist Risk | `html/waist-risk.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 84 | Hip Risk | Hip Risk | `html/hip-risk.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 85 | Waist-Height Risk | Waist-Height Risk | `html/waist-height-risk.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 86 | Forward Head Index | Forward Head Index | `html/forward-head-index.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 87 | Shoulder Symmetry | Shoulder Symmetry | `html/shoulder-symmetry.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 88 | Leg Length Difference | Leg Length Difference | `html/leg-length-difference.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 89 | Sit-Stand Ratio | Sit-Stand Ratio | `html/sit-stand-ratio.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 90 | Chest Expansion | Chest Expansion | `html/chest-expansion.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 91 | Body Alignment | Body Alignment | `html/body-alignment.html` | [x] PASS | [x] KNOWN-ANSWER SMOKE TEST; reference audit pending | [x] SOURCE-INLINED SMOKE TEST |
| 92 | Unit Converter | Unit Converter | `html/unit.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 93 | Height Converter | Height Converter | `html/height-convert.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 94 | Weight Converter | Weight Converter | `html/weight-convert.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 95 | Distance Converter | Distance Converter | `html/distance-convert.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 96 | Time Converter | Time Converter | `html/time-convert.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 97 | BMI Comparison | BMI Comparison | `html/bmi-compare.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 98 | Ratio Calculator | Ratio Calculator | `html/ratio.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 99 | Percentage Tool | Percentage Tool | `html/percentage.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 100 | Average Calculator | Average Calculator | `html/average.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 101 | Difference Calculator | Difference Calculator | `html/difference.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 102 | Age Calculator | Age Calculator | `html/age.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 103 | Steps to Distance | Steps to Distance | `html/steps-distance.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 104 | Steps to Calories | Steps to Calories | `html/steps-calories.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 105 | Activity Time | Activity Time | `html/activity-time.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 106 | Sedentary Ratio | Sedentary Ratio | `html/sedentary.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 107 | Work-Rest Balance | Work-Rest Balance | `html/work-rest.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 108 | Heat Exposure | Heat Exposure | `html/heat-exposure.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 109 | Cold Exposure | Cold Exposure | `html/cold-exposure.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 110 | Sunlight Duration | Sunlight Duration | `html/sunlight.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |
| 111 | Physical Activity Level | Physical Activity Level | `html/pal.html` | [x] PASS | [ ] PENDING | [x] SOURCE-INLINED SMOKE TEST |

## B. Website-wide requirements and implementation status

| Requirement from user | Current implementation status | Evidence / remaining work |
|---|---|---|
| Inspect the existing project and preserve working technology | [x] | Existing static HTML/CSS/JS architecture retained. |
| Central registry for route, category, title, keywords and file | [x] | `js/navigation.js` contains the central registry; 118 unique route files. |
| All 110 requested calculator names represented in the registry | [x] Route presence | All requested names were matched to existing routes. Mathematical correctness is not implied. |
| Create missing pages and avoid duplicates | [x] implementation | All requested inventory entries map to registered routes; the existing METs tool was added to the registry, and calories/pace/contact aliases receive canonical URLs at build time. |
| Sidebar categories are logical dropdowns with SVG icons | [x] implementation present | Source-inlined Chromium tests passed for menu open/close, active category dropdown, search, and mobile layout; real hosted-URL QA remains pending. |
| Sidebar closed by default; menu at left; hide menu while open | [x] smoke-tested | Source-inlined Chromium confirms open/close and hidden toggle state; real deployed-device QA remains. |
| Sidebar search covers titles, categories, keywords and aliases | [x] smoke-tested | Source-inlined Chromium returns Jaw Width Ratio for “jaw width”; keyboard paths still need real-device/deployed-host QA. |
| Search icon only in sidebar on calculator pages | [x] shared navigation | Legacy calculator search wrappers are removed by shared navigation; homepage retains the full-directory search field from the master prompt. |
| Home and Contact Us appear as one floating pair | [x] shared shell adjusted | Calculator-page header now contains branding only; floating links are retained. Representative source-inlined layouts showed no horizontal overflow at 360, 390, 768, 1024 and 1365 px; deployed-host overlap checks remain pending. |
| Professional icons, contextual tooltips, accessible labels | [~] | SVG category icons and contextual glossary/face tips exist; audit every icon-only control and tooltip placement. |
| No emoji icons anywhere in the app | [x] | Removed legacy embedded category-menu emoji icons and warning glyphs; HTML/JS emoji-range scan returns zero matches. |
| No copyright C-mark in the UI | [x] | Removed the copyright symbol from homepage/shared footer output. |
| Expandable/collapsible supporting cards | [x] implementation present | Primary calculator form remains open; secondary cards are collapsible. Source-inlined smoke tests exercised the route actions without uncaught JavaScript errors; formula correctness remains a separate check. |
| Responsive mobile/tablet/laptop portrait and landscape | [~] | Responsive CSS exists and keyboard focus/reduced-motion styles were improved; full visual/device testing is not complete. |
| Click-to-full-screen image viewer | [x] implementation present | Static references checked in previous audit; browser image loading/lightbox QA pending. |
| Global metric/imperial unit preference persists | [x] implementation added/improved | `js/unit-system.js` converts recognized units and input bounds; test cases pass. Per-field coverage still needs auditing across all legacy forms. |
| Advanced calculator inputs expose unit selectors | [x] 24 advanced forms | Added selectors and canonical conversion for measurements, mass and durations where applicable; smoke suite passes. |
| Temperature, pace, speed, length, mass, energy and time conversion helpers | [x] shared utility | Conversion unit tests pass; calculator-specific integration across every legacy page remains pending. |
| Field-specific numeric bounds and errors | [~] | Shared validation is unit-aware and fallback maximum reduced; all 238 static numeric fields plus runtime-generated controls still require domain-specific review. |
| Formula explanations and educational sections | [~] | All 118 routes now have a formula/method summary and reference or explicit site-defined-method basis in the audit matrix; a few on-page education sections remain generic and should be reviewed separately. |
| Face & Aesthetics manual measurement guidance | [~] | Specialist tooltip guidance and advanced metric explanations exist; landmarks/formulas require page-by-page review. |
| BMI, BMI-for-age, BMI Change and BMI Comparison distinct | [~] | Separate routes exist; all result interpretations and calculations still need independent validation. |
| Contact form sends real messages | [~] | Root and nested contact forms now share the existing Formspree endpoint; actual delivery and endpoint authorization still need live verification. |
| Syntax and regression tests | [x] | `node tests/verify.js` passes; 186 inline scripts syntax-checked; 24 advanced calculators have known-answer tests; 8 legacy + 13 shared unit checks. |
| Source-inlined Chromium smoke testing | [x] smoke-tested | 122 documents loaded, 119 calculator/utility actions invoked, zero runtime/console errors and zero 390 px overflow. Live-host and real-device QA remain pending. |
| Production domain, HTTPS, SEO and post-deploy checks | [ ] | Cannot be verified until a production deployment is available. |

## C. Remaining release blockers

1. Validate formulas for every calculator against credible references and known-answer test vectors; route existence and smoke tests are insufficient.
2. Review each numeric input for correct field-specific min/max, required/optional status, unit-aware limits and clear invalid-state messaging.
3. Confirm the existing contact-form endpoint is authorized and test actual delivery/failure handling.
4. Complete browser testing for every route, including calculation flows, dropdowns, search, unit switching, images and console/network errors.
5. Complete deployment, HTTPS, deep-link, metadata, accessibility and responsive-device verification.

## D. Test commands

```bash
node --check js/navigation.js
node --check js/unit-system.js
node --check js/input-validation.js
node --check js/advanced-calculators.js
node tests/verify.js
```

Status meanings: `[x]` implementation/check verified by available evidence; `[~]` partially implemented or needs broader verification; `[ ]` not complete or blocked.


## E. Final implementation pass additions (2026-10-15)

- [x] Added page-specific meta descriptions to 97 calculator pages that previously lacked them; all 123 HTML files now include a description and browser theme color.
- [x] Updated shared shell cleanup to preserve non-branded semantic headers/footers within calculator content while removing legacy shell duplicates.
- [x] Added subtle animated particles to calculator-page footers, respecting `prefers-reduced-motion`.
- [x] Fixed facial-help matching order so specific measurement terms are selected before generic face guidance.
- [x] Re-ran the regression suite and syntax checks after these changes.
- [x] Source-inlined Chromium smoke testing exercised the current calculator/utility pages; live-host, real-device and full accessibility QA remain pending.
- [x] Every one of the 118 routes has a formula/method summary, reference or explicit site-defined-method basis, and a passing known-answer/method regression vector in `FORMULA_REFERENCE_AUDIT.md` and `CALCULATOR_VERIFICATION_MATRIX.csv`.
- [ ] Exhaustive semantic boundary combinations for all 238 static numeric fields plus runtime-generated controls remain open; structural min/max/step checks pass, but not every domain-specific extreme has been independently certified.


## Added release requirements (2026-10-15)

- [x] Homepage FAQ is collapsed by default and opens on touch, click, or keyboard activation using native `<details>` controls.
- [x] FAQ controls have mobile-friendly spacing, keyboard focus styling, and reduced-motion support.
- [x] Homepage footer links to the FAQ section.
- [x] Branded 404 fallback page added.
- [x] Static hosting configuration and security/cache headers added.
- [x] `robots.txt` added; `scripts/generate-sitemap.js` creates the sitemap and canonical tags from `SITE_URL` or Netlify’s deployment `URL`.
- [ ] Deploy to the selected host/domain and run post-deployment smoke tests.
- [ ] Test the deployed production URL and real devices after hosting/domain setup; source-inlined Chromium smoke tests have already passed.
- [x] Add a route-specific known-answer/method vector for every calculator and enforce matrix completeness in the regression suite.
- [ ] Complete exhaustive per-field semantic and unit-aware boundary combinations for every calculator.
- [ ] Confirm live contact form delivery.


## Additional existing calculator made discoverable

The existing `html/mets.html` METs calculator was previously outside the central registry. It is now registered as **METs Calorie Calculator** under Cardio & Endurance, bringing the central registry to 118 routes. The legacy `calories.html` and `pace.html` pages remain aliases for their registered canonical calculators and are not listed as duplicate sidebar entries.

## Latest implementation and browser smoke update (2026-10-15)

- All 121 HTML files under `html/` were loaded in a source-inlined Chromium harness; every page exposed an action control, and the first primary action was invoked. No fatal load errors, uncaught JavaScript errors, or browser console errors were recorded. This includes all 118 registered calculator routes plus utility/alias/contact pages.
- All 121 pages passed the 390 px mobile horizontal-overflow check after correcting the somatotype illustration width.
- Seven homepage FAQ items were collapsed initially; clicking one opened it. Sidebar open/close, hide-menu-icon behavior, Face & Aesthetics expansion (10 child links), calculator search, global kg/lb round-trip, and image-viewer open/close passed.
- Fixed the shared header `insertBefore` runtime exception, removed duplicate image-viewer click binding, cleared stale result output on form reset, and made specialist facial-height labels eligible for contextual tooltips.
- Corrected US Navy body-fat calculations to convert validated centimetre measurements to inches before applying the equation. Corrected Heath–Carter mesomorphy to use skinfold-corrected girths. Replaced unsupported teen BMI category thresholds with an age-specific interpretation warning.
- Unit conversion now converts compatible length/distance units across m/km/mi and rejects incompatible dimensions instead of silently returning the original number.
- These are implementation and smoke-test passes, not proof that every formula has been independently sourced and verified.

## Final release pass addendum (2026-10-15)

- [x] Corrected BMI interpretation so adult categories begin at age 20; added a direct link to the official CDC child/teen BMI calculator for age-specific percentiles.
- [x] Corrected shared numeric-validation fallback so signed values use explicit HTML bounds rather than being silently forced to non-negative values.
- [x] Added mocked contact-form success/failure tests, including user feedback, form reset and button recovery.
- [x] Added sitemap/canonical generation coverage for the GitHub Pages `/Clerfit` project path.
- [x] Added GitHub Pages build/deployment workflow and a post-deployment route/sitemap/robots/HTTPS smoke script.
- [x] Improved accessible names/label associations; static audit found no unnamed visible form controls, buttons or links across 124 HTML documents.
- [x] Added `FIELD_VALIDATION_AUDIT.csv`, `CALCULATOR_VERIFICATION_MATRIX.csv`, `SOURCES_AND_METHODS.md`, `DEPLOYMENT_GUIDE.md` and `RELEASE_VERIFICATION_REPORT.md`.
- [x] Re-ran `node tests/verify.js`, JavaScript syntax checks and the sitemap registry check; all passed.
- [x] Route-level formula/method test coverage for all 118 registered calculators is complete; see `FORMULA_REFERENCE_AUDIT.md`.
- [ ] Exhaustive edge-case boundary certification, real-device accessibility QA, and production parity remain open.
- [ ] Domain-specific semantic review for all 238 static numeric fields plus runtime-generated controls remains open; static bounds and accessible names are not proof of scientifically appropriate ranges.
- [ ] Live Formspree delivery and production-host verification remain blocked until the project is deployed and the endpoint is tested with consent.
- [ ] Full real-device and screen-reader accessibility QA remains open.
- [x] Replaced the heart-rate maximum estimate with the Tanaka adult equation, linked the primary study, and prevented adult prediction for users under 18.
- [x] Removed the unsupported metabolic-age score based on sparse average-RMR tables; the page now reports an RMR estimate only and states the limitation.
- [x] Extended the Health Risk page's BMI-for-age caution through age 19 and added Compendium references to MET-based calorie estimates.
- [x] Added `PROJECT_COMPLETION_PLAN.md` with ordered workstreams and objective exit criteria.
