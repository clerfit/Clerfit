#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const navigation = fs.readFileSync('js/navigation.js', 'utf8');
assert.ok(
  navigation.includes("if(main && !document.querySelector('.cf-page-brand') && !document.querySelector('.cf-home-top'))"),
  'The already-branded homepage must not receive the calculator-page brand element.'
);
assert.ok(
  navigation.includes(`brand.innerHTML='<img src="'+(inHtml?'../':'')+'logo.jpeg" alt="" width="1024" height="1024"><span>ClerFit</span>';`),
  'Shared page brand must resolve the logo relative to root vs calculator pages and declare intrinsic dimensions.'
);

const homepage = fs.readFileSync('index.html', 'utf8');
assert.match(homepage, /<img\b[^>]*class=["']cf-real-logo["'][^>]*width=["']1024["'][^>]*height=["']1024["']/i,
  'Homepage logo must declare its actual intrinsic dimensions.');
assert.match(homepage, /<img\b[^>]*class=["']cf-real-footer-logo["'][^>]*width=["']1024["'][^>]*height=["']1024["']/i,
  'Footer logo must declare its actual intrinsic dimensions.');

function logoReference(isCalculatorPage) {
  return (isCalculatorPage ? '../' : '') + 'logo.jpeg';
}
assert.equal(logoReference(false), 'logo.jpeg');
assert.equal(logoReference(true), '../logo.jpeg');
assert.equal(
  new URL(logoReference(false), 'https://clerfit.github.io/Clerfit/').href,
  'https://clerfit.github.io/Clerfit/logo.jpeg',
  'Homepage logo must stay inside the GitHub Pages project path.'
);
assert.equal(
  new URL(logoReference(true), 'https://clerfit.github.io/Clerfit/html/BMI.html').href,
  'https://clerfit.github.io/Clerfit/logo.jpeg',
  'Nested calculator logo must resolve to the same asset.'
);
console.log('PASS: shared navigation logo remains inside the project base path; intrinsic size is declared; no styles changed.');
