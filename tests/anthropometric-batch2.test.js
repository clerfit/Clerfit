#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const window = {};
const document = { body:{dataset:{calculator:''}}, getElementById:()=>null, querySelectorAll:()=>[], addEventListener(){} };
const source = fs.readFileSync('js/anthropometric-calculators.js','utf8');
vm.runInNewContext(source, vm.createContext({window,document,console,Number,Math}), {filename:'js/anthropometric-calculators.js',timeout:3000});
const api=window.ClerFitAnthropometric;
assert.ok(api, 'body-composition API is exported');
const close=(a,b,msg,tol=1e-6)=>assert.ok(Math.abs(a-b)<=tol,msg+': expected '+b+', got '+a);

// Relative muscle mass: 20 kg / 80 kg = 25%; pounds must be equivalent.
close(api.relativeMuscleMetrics(20,'kg',80,'kg').percent,25,'relative muscle mass');
close(api.relativeMuscleMetrics(44.0924524,'lb',176.3698096,'lb').percent,25,'relative muscle mass in pounds');
assert.throws(()=>api.relativeMuscleMetrics(81,'kg',80,'kg'),/cannot exceed/i);
assert.throws(()=>api.relativeMuscleMetrics(20,'stone',80,'kg'),/Choose kg or lb/i);
assert.throws(()=>api.relativeMuscleMetrics(NaN,'kg',80,'kg'),/positive finite/i);

// Skeletal muscle index and relative percentage use normalized mass and height.
const smm=api.skeletalMuscleMetrics(25,'kg',80,'kg',175,'cm');
close(smm.percent,31.25,'skeletal muscle percentage');
close(smm.index,25/Math.pow(1.75,2),'skeletal muscle mass index');
close(api.skeletalMuscleMetrics(55.1155655,'lb',176.3698096,'lb',68.8976378,'in').index,smm.index,'skeletal muscle imperial equivalence');
assert.throws(()=>api.skeletalMuscleMetrics(25,'kg',80,'kg',79,'cm'),/Height must be between/i);

// ALMI uses appendicular lean mass, not total lean mass.
const almi=api.almiMetrics(20,'kg',175,'cm');
close(almi.value,20/Math.pow(1.75,2),'ALMI');
close(api.almiMetrics(44.0924524,'lb',68.8976378,'in').value,almi.value,'ALMI imperial equivalence');
assert.throws(()=>api.almiMetrics(0.5,'kg',175,'cm'),/Appendicular lean mass must be between/i);
assert.throws(()=>api.almiMetrics(20,'kg',0,'cm'),/positive finite/i);

// FMI uses assessed fat mass and rejects mass greater than total body weight.
const fmi=api.fmiMetrics(15,'kg',80,'kg',175,'cm');
close(fmi.value,15/Math.pow(1.75,2),'FMI');
close(api.fmiMetrics(33.0693393,'lb',176.3698096,'lb',68.8976378,'in').value,fmi.value,'FMI imperial equivalence');
assert.throws(()=>api.fmiMetrics(81,'kg',80,'kg',175,'cm'),/cannot exceed/i);
assert.throws(()=>api.fmiMetrics(15,'kg',80,'kg',79,'cm'),/Height must be between/i);

// FFMI comparison: fat-free mass is weight × (1 − body-fat fraction).
const ffmi=api.ffmiMetrics(80,'kg',15,175,'cm',70,'kg',20,170,'cm');
close(ffmi.fatFreeMassA,68,'Person A fat-free mass');
close(ffmi.ffmiA,68/Math.pow(1.75,2),'Person A FFMI');
close(ffmi.fatFreeMassB,56,'Person B fat-free mass');
close(ffmi.ffmiB,56/Math.pow(1.7,2),'Person B FFMI');
close(ffmi.difference,Math.abs(ffmi.ffmiA-ffmi.ffmiB),'FFMI difference');
const imperial=api.ffmiMetrics(176.3698096,'lb',15,68.8976378,'in',154.3235835,'lb',20,66.9291339,'in');
close(imperial.ffmiA,ffmi.ffmiA,'FFMI imperial equivalence A');
close(imperial.ffmiB,ffmi.ffmiB,'FFMI imperial equivalence B');
assert.throws(()=>api.ffmiMetrics(80,'kg',76,175,'cm',70,'kg',20,170,'cm'),/body-fat percentage must be between/i);
assert.throws(()=>api.ffmiMetrics(80,'kg',15,79,'cm',70,'kg',20,170,'cm'),/height must be between/i);

// Check the real five page forms expose the fields and local unit selectors wired to the engine.
const pages={
 'relative-muscle-mass.html':['muscle','weight'],
 'skeletal-muscle-mass.html':['muscle','weight','height'],
 'almi.html':['alm','height'],
 'fmi.html':['fat','weight','height'],
 'ffmi-comparison.html':['weightA','fatA','heightA','weightB','fatB','heightB']
};
for(const [file,ids] of Object.entries(pages)){
 const html=fs.readFileSync('html/'+file,'utf8');
 assert.match(html,/id="calc-form"/,file+' has calculator form');
 for(const id of ids) assert.match(html,new RegExp('id="'+id+'"[^>]*data-field'),file+' wires '+id);
 assert.match(html,/data-unit-for=/,file+' has calculator-local unit selector');
 assert.match(html,/id="calc-result"/,file+' has live result region');
 assert.match(html,/Method and limitations/,file+' discloses method and limits');
}
console.log('PASS: Batch 2 formula, unit-equivalence, domain, boundary and five-page wiring tests.');
