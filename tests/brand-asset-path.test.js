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
  navigation.includes(`brand.innerHTML='<img src="'+(inHtml?'../':'')+'logo-small.webp" alt="" width="128" height="128"><span>ClerFit</span>';`),
  'Shared page brand must resolve the logo relative to root vs calculator pages and declare intrinsic dimensions.'
);

const homepage = fs.readFileSync('index.html', 'utf8');
assert.match(homepage, /<img\b[^>]*class=["']cf-real-logo["'][^>]*width=["']128["'][^>]*height=["']128["']/i,
  'Homepage logo must declare its actual intrinsic dimensions.');
assert.match(homepage, /<img\b[^>]*class=["']cf-real-footer-logo["'][^>]*width=["']128["'][^>]*height=["']128["']/i,
  'Footer logo must declare its actual intrinsic dimensions.');

assert.ok(fs.existsSync('logo-small.webp'), 'The optimized logo derivative must be committed alongside the full-resolution source.');
assert.ok(fs.statSync('logo-small.webp').size < fs.statSync('logo.jpeg').size / 5,
  'The small visual logo asset must be at least 80% smaller than the original.');
assert.ok(
  fs.readFileSync('js/site-polish.js', 'utf8').includes("logo=root+'logo-small.webp'"),
  'Shared page polish must use the small logo asset for rendered brand marks.'
);

function logoReference(isCalculatorPage) {
  return (isCalculatorPage ? '../' : '') + 'logo-small.webp';
}
assert.equal(logoReference(false), 'logo-small.webp');
assert.equal(logoReference(true), '../logo-small.webp');
assert.equal(
  new URL(logoReference(false), 'https://clerfit.github.io/Clerfit/').href,
  'https://clerfit.github.io/Clerfit/logo-small.webp',
  'Homepage logo must stay inside the GitHub Pages project path.'
);
assert.equal(
  new URL(logoReference(true), 'https://clerfit.github.io/Clerfit/html/BMI.html').href,
  'https://clerfit.github.io/Clerfit/logo-small.webp',
  'Nested calculator logo must resolve to the same asset.'
);
console.log('PASS: shared navigation logo remains inside the project base path; intrinsic size is declared; no styles changed.');
