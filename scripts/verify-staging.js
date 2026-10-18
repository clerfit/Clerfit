#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const rawBase = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;
assert.ok(fs.existsSync(DIST), 'dist/ must exist; run scripts/build-site.js first');
assert.ok(rawBase, 'SITE_URL, URL, or DEPLOY_PRIME_URL must be set');

const base = new URL(rawBase.replace(/\/+$/, '') + '/');
const basePath = base.pathname.endsWith('/') ? base.pathname : base.pathname + '/';
const baseWithoutTrailingSlash = (base.origin + basePath).replace(/\/+$/, '');
function read(relative) { return fs.readFileSync(path.join(DIST, relative), 'utf8'); }
function exists(relative) { return fs.existsSync(path.join(DIST, relative)); }
function decodeXml(value) {
  return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

const nav = read('js/navigation.js');
const registryMatch = nav.match(/const CALCULATORS\s*=\s*(\[[\s\S]*?\]);\s*\nconst path=/);
assert.ok(registryMatch, 'central calculator registry must be parseable');
const calculators = JSON.parse(registryMatch[1]);
const routeFiles = [...new Set(calculators.map(item => item.file))];
assert.equal(routeFiles.length, 118, 'the production route inventory must contain 118 unique calculators');

const required = ['index.html', 'contact.html', '404.html', 'privacy.html', 'terms-of-use.html', 'educational-disclaimer.html', 'robots.txt', 'sitemap.xml', 'css/style.css', 'js/navigation.js'];
for (const file of required) assert.ok(exists(file), 'missing required production file: ' + file);
for (const file of routeFiles) assert.ok(exists(path.join('html', file)), 'missing registered production route: html/' + file);

const sitemap = read('sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map(match => decodeXml(match[1].trim()));
assert.equal(locations.length, 123, 'sitemap must include 5 main URLs plus 118 registered calculators');
assert.equal(new Set(locations).size, locations.length, 'sitemap URLs must be unique');
assert.ok(locations.includes(baseWithoutTrailingSlash + '/'), 'sitemap must include the home page');
assert.ok(locations.includes(baseWithoutTrailingSlash + '/contact.html'), 'sitemap must include Contact Us');
for (const file of routeFiles) {
  assert.ok(locations.includes(baseWithoutTrailingSlash + '/html/' + encodeURI(file)), 'sitemap is missing calculator route ' + file);
}
assert.ok(read('robots.txt').includes('Sitemap: ' + baseWithoutTrailingSlash + '/sitemap.xml'), 'robots.txt must point at the generated sitemap');

const rootCanonical = read('index.html');
assert.ok(rootCanonical.includes('rel="canonical" href="' + baseWithoutTrailingSlash + '/"'), 'home canonical URL must match the configured base');
assert.ok(read('contact.html').includes('rel="canonical" href="' + baseWithoutTrailingSlash + '/contact.html"'), 'contact canonical URL must match the configured base');

const htmlFiles = ['index.html', 'contact.html', '404.html', 'privacy.html', 'terms-of-use.html', 'educational-disclaimer.html'];
for (const entry of fs.readdirSync(path.join(DIST, 'html'))) {
  if (entry.toLowerCase().endsWith('.html')) htmlFiles.push('html/' + entry);
}
const failures = [];
function checkReference(ref, fromFile) {
  const value = ref.trim();
  if (!value || value.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return;
  let url;
  try { url = new URL(value, new URL(fromFile, base)); } catch { return; }
  if (url.origin !== base.origin || !url.pathname.startsWith(basePath)) return;
  let relative;
  try { relative = decodeURIComponent(url.pathname.slice(basePath.length)); } catch { relative = url.pathname.slice(basePath.length); }
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const target = path.resolve(DIST, relative);
  if (!target.startsWith(DIST + path.sep) && target !== path.join(DIST, 'index.html')) {
    failures.push(fromFile + ' has a local path escaping dist/: ' + value);
    return;
  }
  if (!fs.existsSync(target)) failures.push(fromFile + ' references missing local file: ' + value);
  else if (fs.statSync(target).isDirectory() && !fs.existsSync(path.join(target, 'index.html'))) {
    failures.push(fromFile + ' references a directory without index.html: ' + value);
  }
}
for (const file of htmlFiles) {
  const html = read(file);
  assert.match(html, /<html\b[^>]*\blang=["'][^"']+["']/i, file + ' HTML documents must declare a language');
  assert.match(html, /<title\b[^>]*>\s*[^<]+\s*<\/title>/i, file + ' must have a non-empty title');
  assert.match(html, /<meta\b[^>]*name=["']description["']/i, file + ' must have a meta description');
  for (const match of html.matchAll(/\b(?:href|src|poster|action)\s*=\s*(["'])(.*?)\1/gi)) {
    checkReference(match[2], file);
  }
}
const cssFiles = [];
function collectCss(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectCss(absolute);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.css')) cssFiles.push(absolute);
  }
}
collectCss(path.join(DIST, 'css'));
for (const absolute of cssFiles) {
  const relativeFile = path.relative(DIST, absolute).split(path.sep).join('/');
  const css = fs.readFileSync(absolute, 'utf8');
  for (const match of css.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^'")\s][^)]*))\s*\)/gi)) {
    const ref = (match[2] || match[3] || '').trim();
    if (!ref || ref.startsWith('data:') || ref.startsWith('#')) continue;
    checkReference(ref, relativeFile);
  }
}
assert.deepEqual(failures, [], 'all local links and asset references must resolve:\n' + failures.slice(0, 50).join('\n'));

for (const forbidden of ['README.md', 'AUDIT_REPORT.md', 'tests/verify.js', 'SCIENTIFIC_REVIEW_REGISTER.csv', 'scripts/verify-production.js']) {
  assert.equal(exists(forbidden), false, 'development/audit artifact must not be published: ' + forbidden);
}
assert.equal(exists('scripts'), false, 'build helper scripts must not be published as website content');

console.log('Staging verification passed: ' + routeFiles.length + ' calculator routes, ' + htmlFiles.length + ' HTML pages, ' + locations.length + ' unique sitemap URLs, canonical/robots checks, and local HTML/CSS reference integrity.');
