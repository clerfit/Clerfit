#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const homepage = fs.readFileSync('index.html', 'utf8');
const favicon48Path = 'favicon-48.png';
assert.ok(fs.existsSync(favicon48Path), 'A stable 48x48 PNG favicon must exist at the site root.');
const png = fs.readFileSync(favicon48Path);
assert.equal(png.readUInt32BE(16), 48, 'favicon-48.png must be exactly 48 pixels wide.');
assert.equal(png.readUInt32BE(20), 48, 'favicon-48.png must be exactly 48 pixels high.');
assert.match(homepage, /<link\b(?=[^>]*rel=["']icon["'])(?=[^>]*type=["']image\/png["'])(?=[^>]*sizes=["']48x48["'])(?=[^>]*href=["']\.\/favicon-48\.png["'])[^>]*>/i,
  'Homepage head must explicitly advertise the stable 48x48 favicon PNG.');
assert.ok(fs.existsSync('favicon.ico'), 'ICO fallback must be present.');
assert.ok(fs.existsSync('app-icon-192.png'), '192x192 icon must remain present.');
assert.ok(fs.existsSync('site.webmanifest'), 'Web app manifest must remain present.');
const robots = fs.readFileSync('robots.txt', 'utf8');
assert.match(robots, /^User-agent:\s*\*\s*\nAllow:\s*\//m, 'Robots must not block the homepage by default.');
assert.doesNotMatch(robots, /^Disallow:\s*\/Clerfit\/?\s*$/m, 'Robots must not disallow the project site.');
console.log('PASS: explicit 48x48 PNG favicon, ICO fallback, manifest, and crawlable homepage configuration.');
