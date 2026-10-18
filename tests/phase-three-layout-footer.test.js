#!/usr/bin/env node
'use strict';

// Source-level regression guard for shared calculator chrome and responsive numeric inputs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const chrome = fs.readFileSync(path.join(root, 'js/page-chrome.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

assert.match(chrome, /function ensureSiteFooter\(\)/, 'shared page chrome must define footer injection');
assert.match(chrome, /if \(document\.querySelector\("footer"\)\) return;/, 'footer injection must not duplicate existing footers');
assert.match(chrome, /new URL\("index\.html", root\)/, 'footer home link must respect root versus html/ paths');
assert.match(chrome, /new URL\("contact\.html", root\)/, 'footer contact link must respect root versus html/ paths');
assert.match(chrome, /main\.appendChild\(footer\)/, 'shared footer must be attached to calculator content');
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
