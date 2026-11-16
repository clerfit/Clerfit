"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeScript = fs.readFileSync(path.join(root, "js", "home.js"), "utf8");
const navigation = fs.readFileSync(path.join(root, "js", "navigation.js"), "utf8");

function getRegistry() {
  const match = navigation.match(/const CALCULATORS = (\[.*?\]);/s);
  assert.ok(match, "The calculator registry must be available.");
  return JSON.parse(match[1]);
}

test("homepage exposes the full calculator directory before JavaScript runs", () => {
  const registry = getRegistry();
  const directory = html.match(/<div class="cf-directory-grid" id="cf-directory-grid"[^>]*>([\s\S]*?)<\/div>\s*<div class="cf-empty-state"/);
  assert.ok(directory, "A server-rendered calculator directory is required.");
  const hrefs = [...directory[1].matchAll(/href="html\/([^"]+)"/g)].map((match) => decodeURI(match[1]));
  assert.equal(registry.length, 164);
  assert.equal(hrefs.length, registry.length);
  assert.deepEqual([...hrefs].sort(), registry.map((item) => item.file).sort());
  registry.forEach(({ file }) => {
    assert.ok(fs.existsSync(path.join(root, "html", file)), \`Missing calculator route: html/\${file}\`);
  });
});

test("homepage has static category and popular calculator content", () => {
  const registry = getRegistry();
  const categoryCount = new Set(registry.map((item) => item.category)).size;
  const categoryMarkup = html.match(/<div class="cf-category-grid" id="cf-category-grid">([\s\S]*?)<\/div>/);
  const popularMarkup = html.match(/<div class="cf-feature-grid" id="cf-popular-grid">([\s\S]*?)<\/div>/);
  assert.ok(categoryMarkup);
  assert.ok(popularMarkup);
  assert.equal((categoryMarkup[1].match(/class="cf-category-card"/g) || []).length, categoryCount);
  assert.ok((popularMarkup[1].match(/class="cf-feature-card"/g) || []).length >= 6);
});

test("homepage metadata, landmarks and search controls are accessible", () => {
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /name="viewport"/i);
  assert.match(html, /name="description"/i);
  assert.match(html, /<main\b/i);
  assert.match(html, /<form[^>]+role="search"/i);
  assert.match(html, /aria-label="Search calculators"/i);
  assert.match(html, /aria-label="Show calculator search results"/i);
  assert.match(html, /width:44px !important; min-width:44px !important; max-width:44px !important;/);
  assert.match(html, /height:44px !important; min-height:44px !important;/);
  assert.match(html, /color:#596b7e !important/);
  assert.match(html, /\.cf-faq-answer a[\s\S]*?text-decoration: underline/);
});

test("homepage calculator count is accurate and does not animate from zero", () => {
  assert.match(html, /id="cf-total-count">164<\/strong>/);
  assert.doesNotMatch(html, /id="cf-total-count">0\+/);
  assert.match(homeScript, /totalCount\.textContent=String\(registry\.length\|\|164\)/);
  assert.doesNotMatch(homeScript, /requestAnimationFrame\(tick\)/);
});
