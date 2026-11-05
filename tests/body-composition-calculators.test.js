#!/usr/bin/env node
'use strict';const assert=require('node:assert/strict'),fs=require('node:fs');
const slugs=["jp3","jp7","durnin-womersley","ymca-body-fat","body-fat-comparison","total-body-water","intracellular-water","extracellular-water","bone-mass","visceral-fat","subcutaneous-fat","waist-arm-ratio","waist-thigh-ratio","chest-waist-ratio","shoulder-waist-ratio","shoulder-hip-ratio","chest-height-ratio","hip-height-ratio","upper-arm-height-ratio","biacromial-width-ratio","body-fat-change","fat-free-mass-change"],js=fs.readFileSync('js/body-composition-methods.js','utf8');new Function(js);
for(const s of slugs){const h=fs.readFileSync('html/'+s+'.html','utf8');assert.ok(h.includes('data-calculator="'+s+'"'));assert.ok(h.includes('../css/style.css'));assert.ok(h.includes('../js/body-composition-methods.js'));assert.ok(h.includes('<form id="calc-form"'));assert.ok(h.includes('aria-live="polite"'));}
const nav=fs.readFileSync('js/navigation.js','utf8'),map=fs.readFileSync('sitemap.xml','utf8');for(const s of slugs){assert.ok(nav.includes('"'+s+'"'));assert.ok(map.includes('/html/'+s+'.html'));}
console.log('Body composition calculator checks passed: '+slugs.length+' pages.');
