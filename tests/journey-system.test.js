'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const journey = read('js/journey-system.js');
const chrome = read('js/page-chrome.js');
const privacy = read('privacy.html');
const sitemap = read('scripts/generate-sitemap.js');
const staging = read('scripts/verify-staging.js');
const hub = read('workflows.html');

assert.match(chrome, /js\/journey-system\.js/, 'shared page chrome must load the journey system');
assert.match(journey, /clerfit\.journey\.transfer\.v1/, 'journey handoff must use a tab-scoped transfer key');
assert.match(journey, /clerfit\.profile\.v1/, 'optional local profile must use a versioned storage key');
assert.match(journey, /cf-save-profile/, 'persistent input reuse must have an explicit opt-in control');
assert.match(journey, /cf-clear-profile/, 'users must be able to clear saved inputs');
assert.match(journey, /MAX_PROFILE_AGE\s*=\s*90/, 'saved profile must expire');
assert.doesNotMatch(journey, /URLSearchParams|location\.search/, 'personal measurements must not be placed in URLs');
assert.match(journey, /sessionStorage/, 'one-step transfer must be tab-scoped');
assert.match(journey, /localStorage/, 'persistent profile reuse must be browser-local');
assert.match(journey, /readValue\("heightUnit"\).*values\.heightUnit/, 'height values must only transfer when units match');
assert.match(journey, /readValue\("weightUnit"\).*values\.weightUnit/, 'weight values must only transfer when units match');
assert.match(privacy, /opt in/i, 'privacy notice must disclose optional persistent saving');
assert.match(privacy, /session storage/i, 'privacy notice must disclose temporary handoff');
assert.match(privacy, /90 days/i, 'privacy notice must disclose retention expiry');
assert.match(sitemap, /workflows\.html/, 'workflow hub must be included in generated canonical and sitemap entries');
assert.match(staging, /workflows\.html/, 'staging verification must require the workflow hub');
assert.match(hub, /Body composition and nutrition/);
assert.match(hub, /Strength and lifting/);
assert.match(hub, /Running and cardio/);

const destinations = [...journey.matchAll(/file:\s*"([^"]+\.html)"/g)].map(match => match[1]);
for (const file of destinations) {
  assert.ok(fs.existsSync(path.join(root, 'html', file)), 'journey destination must exist: ' + file);
}
const hubDestinations = [...hub.matchAll(/href="html\/([^"]+\.html)"/g)].map(match => match[1]);
for (const file of hubDestinations) {
  assert.ok(fs.existsSync(path.join(root, 'html', file)), 'workflow hub destination must exist: ' + file);
}
console.log('PASS: privacy-first journey storage, disclosures, hub links and destination routes.');
