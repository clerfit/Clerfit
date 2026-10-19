#!/usr/bin/env node
'use strict';

// Source-level regression guard for shared calculator chrome and responsive numeric inputs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const chrome = fs.readFileSync(path.join(root, 'js/page-chrome.js'), 'utf8');
const polish = fs.readFileSync(path.join(root, 'js/site-polish.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

assert.doesNotMatch(chrome, /fresh\.searchParams\.set\(["']v["']/,
  'shared page chrome must not rewrite a stylesheet URL after the initial CSS request');
const publicHtml = [
  'index.html', '404.html', 'contact.html', 'educational-disclaimer.html', 'privacy.html', 'terms-of-use.html',
  ...fs.readdirSync(path.join(root, 'html')).filter(name => name.endsWith('.html')).map(name => path.join('html', name))
].map(file => path.join(root, file)).filter(file => fs.existsSync(file));
const staleCssUrls = publicHtml.filter(file => {
  const html = fs.readFileSync(file, 'utf8');
  return /href=["'][^"']*css\/style\.css(?:\?[^"']*)?["']/i.test(html) &&
    !/href=["'][^"']*css\/style\.css\?v=20261019-performance-cls-v1["']/i.test(html);
});
assert.deepEqual(staleCssUrls, [], 'all static pages using the shared stylesheet must use the same versioned URL');

assert.match(polish, /header:not\(\.clerfit-page-header\):not\(\.cf-legal-heading\)/,
  'legacy shell cleanup must preserve legal content headers and their H1 headings');
assert.ok(polish.includes('const isLegacyBrand=/clerfit\\s*(?:health\\s*&?\\s*performance|health.*fitness calculators)|all rights reserved/.test(text);'),
  'legacy header cleanup must target known branding instead of deleting every header that mentions ClerFit');
assert.match(chrome, /function ensureSiteFooter\(\)/, 'shared page chrome must define footer injection');
assert.match(chrome, /const existingFooter = document\.querySelector\("footer"\);[\s\S]*?existingFooter\.classList\.add\("cf-footer"\)/, 'existing footers must receive shared styling without duplication');
assert.match(chrome, /new URL\("index\.html", root\)/, 'footer home link must respect root versus html/ paths');
assert.match(chrome, /new URL\("contact\.html", root\)/, 'footer contact link must respect root versus html/ paths');
assert.match(chrome, /main\.appendChild\(footer\)/, 'shared footer must be attached to calculator content');
assert.match(polish, /function normalizeTables\\(scope\\)[\\s\\S]*?normalizeTables\\(document\\)/,
  'all existing calculator tables must be normalized on initial load');
assert.match(polish, /removeAttribute\\('data-label'\\)/,
  'column names must not be copied into data cells');
assert.match(polish, /new MutationObserver[\\s\\S]*?tableObserver\\.observe\\(main,\\{childList:true,subtree:true\\}\\)/,
  'tables created dynamically by calculator submissions must receive the same normalization');
assert.match(polish, /aria-label','Calculator table; scroll horizontally to view all columns/,
  'table scroll regions must have a useful accessible name');
assert.match(css, /R3 correction: every calculator table keeps one canonical header row[\s\S]*?overflow-x:\s*auto !important;[\s\S]*?td:before[\s\S]*?display:\s*none !important;/,
  'mobile tables must preserve the header row and scroll horizontally without repeated field labels');
assert.match(css, /Homepage quick links must remain a single horizontal pair[\s\S]*?flex-flow:\s*row nowrap !important;/,
  'homepage Home and Contact Us links must stay side by side');
assert.match(css, /\.cf-advanced-input-row[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1\.35fr\)\s+minmax\(100px,\s*\.85fr\)/,
  'generated numeric inputs must receive more width than unit selectors');
assert.match(css, /@media \(max-width: 430px\)[\s\S]*?\.cf-advanced-input-row[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1\.2fr\)\s+minmax\(88px,\s*\.8fr\)/,
  'numeric input/unit layout must remain responsive on narrow phones');

const htmlDir = path.join(root, 'html');
const pages = fs.readdirSync(htmlDir).filter(name => name.endsWith('.html'));
assert.ok(pages.length > 0, 'calculator HTML directory must not be empty');
const missingChrome = pages.filter(name => !fs.readFileSync(path.join(htmlDir, name), 'utf8').includes('js/page-chrome.js'));
assert.deepEqual(missingChrome, [], 'all calculator pages must load shared page chrome: ' + missingChrome.join(', '));
console.log('PASS: shared footer is non-duplicating, all ' + pages.length + ' calculator HTML pages load shared page chrome, and numeric input sizing has responsive guardrails.');
