#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const pages = [
'neck-circumference','muac','mid-thigh-circumference','calf-circumference','bai',
'relative-muscle-mass','skeletal-muscle-mass','almi','fmi','ffmi-comparison',
'waist-circumference-reference','waist-height-comparison','body-volume','body-density',
'anthropometric-z-score','body-measurement-symmetry','arm-waist-ratio','leg-height-ratio','sitting-height-ratio'
];
const engine = fs.readFileSync('js/anthropometric-calculators.js','utf8');
new Function(engine);
for (const slug of pages) {
 const html = fs.readFileSync('html/'+slug+'.html','utf8');
 assert.match(html,new RegExp('data-calculator="'+slug+'"'));
 assert.match(html,/\.\.\/css\/style\.css/);
 assert.match(html,/\.\.\/js\/anthropometric-calculators\.js/);
 assert.match(html,/\.\.\/js\/tooltips\.js/);
 assert.match(html,/\.\.\/js\/page-chrome\.js/);
 assert.match(html,/<meta name="viewport"/);
 assert.match(html,/<form id="calc-form"/);
 assert.match(html,/aria-live="polite"/);
}
const navigation=fs.readFileSync('js/navigation.js','utf8');
for (const slug of pages) assert.ok(navigation.includes('"'+slug+'"'), 'Navigation missing '+slug);
const sitemap=fs.readFileSync('sitemap.xml','utf8');
for (const slug of pages) assert.ok(sitemap.includes('/html/'+slug+'.html'), 'Sitemap missing '+slug);
console.log('Anthropometric calculator page checks passed: '+pages.length+' pages.');
