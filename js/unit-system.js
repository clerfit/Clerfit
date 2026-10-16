(() => {
  "use strict";
  const KEY="clerfit-unit-preference";
  try {
    const saved=localStorage.getItem(KEY);
    document.documentElement.dataset.unitPreference=saved==="imperial"?"imperial":"metric";
  } catch (_) { document.documentElement.dataset.unitPreference="metric"; }
  window.ClerFitUnits={
    getPreference(){return document.documentElement.dataset.unitPreference||"metric";},
    setPreference(value){const next=value==="imperial"?"imperial":"metric";document.documentElement.dataset.unitPreference=next;try{localStorage.setItem(KEY,next);}catch(_){}return next;},
    kgToLb(value){return Number(value)*2.2046226218;},
    lbToKg(value){return Number(value)/2.2046226218;},
    cmToIn(value){return Number(value)/2.54;},
    inToCm(value){return Number(value)*2.54;}
  };
})();