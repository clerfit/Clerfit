/* Shared unit conversion helpers; calculator-specific formulas remain unchanged. */
(() => {
  "use strict";
  window.ClerFitUnits=Object.freeze({
    kgToLb:v=>Number(v)*2.2046226218,
    lbToKg:v=>Number(v)/2.2046226218,
    cmToIn:v=>Number(v)/2.54,
    inToCm:v=>Number(v)*2.54,
    cmToFt:v=>Number(v)/30.48,
    ftToCm:v=>Number(v)*30.48
  });
})();