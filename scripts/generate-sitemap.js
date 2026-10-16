#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const navigationPath = path.join(root, 'js', 'navigation.js');
const source = fs.readFileSync(navigationPath, 'utf8');
const match = source.match(/const CALCULATORS\s*=\s*(\[[\s\S]*?\]);\s*\nconst path=/);
if (!match) {
  console.error('Unable to parse the central calculator registry in js/navigation.js.');
  process.exit(1);
}

let calculators;
try {
  calculators = JSON.parse(match[1]);
} catch (error) {
  console.error(`Calculator registry is not valid JSON: ${error.message}`);
  process.exit(1);
}

const uniqueFiles = [...new Set(calculators.map(item => item.file))];
const missing = uniqueFiles.filter(file => !fs.existsSync(path.join(root, 'html', file)));
if (missing.length) {
  console.error(`Sitemap generation stopped: missing registered calculator files: ${missing.join(', ')}`);
  process.exit(1);
}

if (process.argv.includes('--check')) {
  console.log(`Sitemap registry check passed: ${uniqueFiles.length} unique calculator pages and all files exist.`);
  process.exit(0);
}

const rawBase = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;
if (!rawBase) {
  console.error('Set SITE_URL, URL (provided by Netlify), or DEPLOY_PRIME_URL before generating a production sitemap.');
  process.exit(1);
}
let base;
try {
  const parsed = new URL(rawBase);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL must use HTTP or HTTPS.');
  // Preserve a project-site path such as /Clerfit on GitHub Pages. Netlify/custom domains normally use '/'.
  base = (parsed.origin + parsed.pathname).replace(/\/+$/, '');
  if (!base) base = parsed.origin;
} catch (error) {
  console.error(`Invalid site URL: ${error.message}`);
  process.exit(1);
}

// Canonical tags are injected during the host build so the ZIP can remain domain-neutral.
const aliasCanonical = {
  'contact.html': `${base}/contact.html`,
  'calories.html': `${base}/html/daily-energy.html`,
  'pace.html': `${base}/html/running-pace.html`
};
const canonicalFiles = [
  { file: path.join(root, 'index.html'), url: `${base}/` },
  { file: path.join(root, 'contact.html'), url: `${base}/contact.html` },
  { file: path.join(root, 'privacy.html'), url: `${base}/privacy.html` },
  { file: path.join(root, 'terms-of-use.html'), url: `${base}/terms-of-use.html` },
  { file: path.join(root, 'educational-disclaimer.html'), url: `${base}/educational-disclaimer.html` },
  ...fs.readdirSync(path.join(root, 'html')).filter(file => file.toLowerCase().endsWith('.html')).map(file => ({
    file: path.join(root, 'html', file),
    url: aliasCanonical[file] || (uniqueFiles.includes(file) ? `${base}/html/${encodeURI(file)}` : `${base}/html/${encodeURI(file)}`)
  }))
];
for (const entry of canonicalFiles) {
  let html = fs.readFileSync(entry.file, 'utf8');
  const tag = `<link rel="canonical" href="${entry.url.replace(/&/g, '&amp;').replace(/\"/g, '&quot;')}">`;
  if (/rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/i, tag);
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${tag}\n</head>`);
  } else {
    throw new Error(`Cannot insert canonical URL: ${entry.file} has no closing head tag.`);
  }
  fs.writeFileSync(entry.file, html);
}

const urls = [
  { loc: `${base}/`, priority: '1.0' },
  { loc: `${base}/contact.html`, priority: '0.4' },
  { loc: `${base}/privacy.html`, priority: '0.3' },
  { loc: `${base}/terms-of-use.html`, priority: '0.3' },
  { loc: `${base}/educational-disclaimer.html`, priority: '0.3' },
  ...uniqueFiles.map(file => ({ loc: `${base}/html/${encodeURI(file)}`, priority: '0.7' }))
];
const xmlEscape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(item => `  <url><loc>${xmlEscape(item.loc)}</loc><changefreq>monthly</changefreq><priority>${item.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);

const robotsPath = path.join(root, 'robots.txt');
let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : 'User-agent: *\nAllow: /\n';
robots = robots.replace(/^\s*# Add a Sitemap:.*\n?/gim, '').replace(/^\s*Sitemap:\s*.*\n?/gim, '').trimEnd();
robots += `\n\nSitemap: ${base}/sitemap.xml\n`;
fs.writeFileSync(robotsPath, robots);
console.log(`Generated sitemap.xml with ${urls.length} URLs for ${base}; updated robots.txt.`);
