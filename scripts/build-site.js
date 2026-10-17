#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const rawBase = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;

if (!rawBase) {
  console.error('Set SITE_URL, URL (Netlify), or DEPLOY_PRIME_URL before building a production site.');
  process.exit(1);
}

let base;
try {
  const parsed = new URL(rawBase);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL must use HTTP or HTTPS.');
  base = (parsed.origin + parsed.pathname).replace(/\/+$/, '');
  if (!base) base = parsed.origin;
} catch (error) {
  console.error('Invalid site URL: ' + error.message);
  process.exit(1);
}

const preflight = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'generate-sitemap.js'), '--check'], {
  cwd: ROOT,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
});
process.stdout.write(preflight);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const directory of ['css', 'js', 'html', 'images']) {
  const source = path.join(ROOT, directory);
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    throw new Error('Required website directory is missing: ' + directory);
  }
  fs.cpSync(source, path.join(DIST, directory), { recursive: true });
}

const allowedRootExtensions = new Set([
  '.html', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg',
  '.xml', '.txt', '.webmanifest', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.mp3'
]);
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (entry.name === '_headers' || allowedRootExtensions.has(path.extname(entry.name).toLowerCase())) {
    fs.copyFileSync(path.join(ROOT, entry.name), path.join(DIST, entry.name));
  }
}
if (fs.existsSync(path.join(ROOT, '_headers'))) {
  fs.copyFileSync(path.join(ROOT, '_headers'), path.join(DIST, '_headers'));
}
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

const generatorTarget = path.join(DIST, 'scripts', 'generate-sitemap.js');
fs.mkdirSync(path.dirname(generatorTarget), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'scripts', 'generate-sitemap.js'), generatorTarget);
try {
  const generated = execFileSync(process.execPath, [generatorTarget], {
    cwd: DIST,
    encoding: 'utf8',
    env: { ...process.env, SITE_URL: base },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  process.stdout.write(generated);
} finally {
  fs.rmSync(path.join(DIST, 'scripts'), { recursive: true, force: true });
}

execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'verify-staging.js')], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, SITE_URL: base }
});

console.log('Production staging build passed. Output directory: ' + DIST);
