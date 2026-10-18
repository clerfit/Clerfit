#!/usr/bin/env node
'use strict';

// Regression test: GitHub Pages keeps a missing URL in the address bar when serving
// 404.html. Verify the fallback page roots its CSS, images, scripts and links correctly
// without altering the normal website UI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('404.html', 'utf8');
assert.match(html, /<html\b[^>]*\blang=["']en["']/i, '404 page must declare its document language');
assert.match(html, /<meta\b[^>]*name=["']description["']/i, '404 page must have a meta description');
assert.match(html, /<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex, follow["']/i, '404 page should not be indexed');

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const resolver = inlineScripts.find(script => script.includes("const marker = '/Clerfit/'"));
assert.ok(resolver, '404 page must have a site-root resolver before asset links');

function run(pathname, origin) {
  let baseHref = null;
  const head = { appendChild(element) { baseHref = element.href; } };
  const document = {
    head,
    createElement(tag) {
      assert.equal(tag, 'base');
      return { href: '' };
    }
  };
  const window = { location: { pathname, origin } };
  vm.runInNewContext(resolver, { window, document, URL }, { timeout: 1000 });
  return baseHref;
}

assert.equal(run('/Clerfit/missing/deep/page.html', 'https://clerfit.github.io'),
  'https://clerfit.github.io/Clerfit/', 'deep missing GitHub Pages routes must resolve to project root');
assert.equal(run('/missing/deep/page.html', 'https://example.com'),
  'https://example.com/', 'root-hosted deployments must resolve to site root');
console.log('PASS: 404 deep-path asset/navigation base resolution; no visual styles were changed.');
