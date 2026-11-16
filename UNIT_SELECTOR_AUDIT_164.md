# ClerFit — Unit Selector and Conversion Audit (164 routes)

Audit snapshot: 2026-11-16  
Branch: `feature/calculator-guides-all-pages`  
Status: Static review completed; automated equivalence verification pending current Phase 1/2 CI.

## Scope and method

- Reviewed the 164-route navigation registry and the generated field-bound inventory.
- Reviewed 297 numeric input-field records in `FIELD_VALIDATION_AUDIT.csv`.
- Investigated fields whose labels contain physical units but whose selector was not directly associated through `data-unit-for`.
- Distinguished a genuine missing unit control from a selector wired through a legacy/manual conversion path or a method whose protocol intentionally fixes the measurement unit.
- Preserved calculator-local unit controls; no global metric/imperial switch was introduced.

## Gaps found and corrected

| Page | Previously fixed unit | Added behavior |
|---|---|---|
| ABSI | Body mass | Local kg/lb selector; formula normalizes to kg before BMI/ABSI calculation |
| Heat Exposure | Air temperature | Local °C/°F selector; heat-index formula normalizes to Celsius |
| Cold Exposure | Air temperature | Local °C/°F selector; wind-chill formula normalizes to Celsius |
| Waist Circumference Review | Waist circumference | cm/in selector; output normalized to cm |
| Waist-to-Height Comparison | Waist and height values | Shared cm/in/mm selector converts all four fields together |
| Body Volume | Mass | kg/lb selector; density remains explicitly kg/L |
| Body Density | Mass and volume | kg/lb and L/mL selectors; output normalized to kg/L |
| Anthropometric Z-score | Observed value, mean and SD | Shared cm/mm/in selector; all three values normalized consistently |
| Body Measurement Symmetry | Left and right values | Shared cm/mm/in selector; output difference normalized to cm |
| Arm/Waist, Leg/Height and Sitting/Height ratios | Paired lengths | Shared local selector converts both values together |
| Body-composition family | Mass, length, water volume, area and thickness inputs | Local kg/lb, cm/in, L/mL, cm²/in² and mm/cm/in selectors where method-appropriate |

Some measurements intentionally retain protocol-specific units: for example, skinfold caliper readings are entered in millimetres, heart rate in beats per minute, and body-fat percentages as percentages. A selector is not added where it would create a meaningless or misleading unit choice.

## Conversion engine changes

- Added area aliases for cm², m² and in² to the shared unit system.
- Added canonical-unit conversion before formula evaluation for body mass, length, volume, area and temperature paths.
- Shared selectors can now associate with multiple fields using comma-separated `data-unit-for` IDs.
- Editing a value or changing a unit clears stale results on the affected calculators.
- Reset actions restore the default units and clear values/results on ABSI, heat exposure and cold exposure.

## Verification added

- Unit property tests cover kg/lb, cm/m, temperature, distance, volume, area aliases and round-trip conversion.
- Body-composition browser tests cover metric/imperial equivalence on the newly unit-enabled routes.
- Remaining anthropometric browser tests cover shared-unit equivalence.
- Legacy browser tests cover ABSI, heat index and wind chill in alternate units, stale-result clearing and reset behavior.

## Release status

The static selector review and code changes are recorded. Do not mark all 164 routes as unit-equivalence PASS until the latest browser workflow passes. The audit register keeps unit-equivalence evidence separate from formula, accessibility and responsive status.
