"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const matrixPath = path.join(root, "CALCULATOR_VERIFICATION_MATRIX.csv");
const catalogPath = path.join(root, "js", "calculator-guide-catalog.js");
const guidePath = path.join(root, "js", "calculator-guide.js");
const chromePath = path.join(root, "js", "page-chrome.js");
const stylesheetPath = path.join(root, "css", "style.css");

function parseCsv(source) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records
    .filter((record) => record.some(Boolean))
    .map((record) =>
      Object.fromEntries(headers.map((header, index) => [header, record[index] || ""]))
    );
}

function loadCatalog() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(catalogPath, "utf8"), context);
  return context.window.CLERFIT_GUIDE_CATALOG;
}

test("guide catalog covers all 164 active calculator routes exactly once", () => {
  const navigation = fs.readFileSync(path.join(root, "js", "navigation.js"), "utf8");
  const registryMatch = navigation.match(/const CALCULATORS = (\[[\s\S]*?\]);/);
  assert.ok(registryMatch, "Could not read the active calculator registry.");
  const registry = JSON.parse(registryMatch[1]);
  const matrix = parseCsv(fs.readFileSync(matrixPath, "utf8"));
  const catalog = loadCatalog();
  const registryFiles = registry.map((record) => record.file);
  const catalogFiles = catalog.map((record) => record.file);
  const matrixByFile = new Map(matrix.map((record) => [record.file, record]));

  assert.equal(registry.length, 164, "Update this expected count only when the active calculator registry changes.");
  assert.equal(new Set(registryFiles).size, 164, "The active calculator registry must not contain duplicate files.");
  assert.equal(catalog.length, registry.length);
  assert.equal(new Set(catalogFiles).size, catalogFiles.length, "Catalog file names must be unique.");
  assert.deepEqual([...catalogFiles].sort(), [...registryFiles].sort());

  catalog.forEach((record) => {
    const route = registry.find((item) => item.file === record.file);
    assert.ok(route, `Catalog entry is not an active route: ${record.file}`);
    assert.equal(record.title, route.title, `Title mismatch for ${record.file}`);
    assert.equal(record.category, route.category, `Category mismatch for ${record.file}`);
    assert.equal(record.slug, route.slug, `Slug mismatch for ${record.file}`);
    assert.ok(record.method, `Missing method guidance for ${record.file}`);
    assert.ok(record.reference, `Missing formula/reference note for ${record.file}`);
    if (matrixByFile.has(record.file)) {
      assert.ok(matrixByFile.get(record.file).formula_or_method_summary);
    }
  });

  assert.equal(matrix.length, 118, "The verification matrix is a separate, smaller evidence inventory.");
});

test("every active calculator route loads shared page chrome and has calculator controls", () => {
  const navigation = fs.readFileSync(path.join(root, "js", "navigation.js"), "utf8");
  const registryMatch = navigation.match(/const CALCULATORS = (\[[\s\S]*?\]);/);
  assert.ok(registryMatch, "Could not read the active calculator registry.");
  const registry = JSON.parse(registryMatch[1]);

  registry.forEach(({ file }) => {
    const pagePath = path.join(root, "html", file);
    assert.ok(fs.existsSync(pagePath), `Missing active calculator page: html/${file}`);
    const html = fs.readFileSync(pagePath, "utf8");
    assert.match(html, /page-chrome\\.js/i, `Shared guide loader missing from html/${file}`);
    assert.ok(/<(?:input|select|textarea)\b/i.test(html) || (/id=["']advanced-fields["']/i.test(html) && /advanced-calculators\.js/i.test(html)), "No static or runtime-generated calculator controls found in html/" + file);
  });
});

test("every inventoried calculator page loads shared page chrome and has calculator controls", () => {
  const matrix = parseCsv(fs.readFileSync(matrixPath, "utf8"));
  matrix.forEach(({ file }) => {
    const pagePath = path.join(root, "html", file);
    assert.ok(fs.existsSync(pagePath), `Missing calculator page: html/${file}`);
    const html = fs.readFileSync(pagePath, "utf8");
    assert.match(html, /page-chrome\.js/i, `Shared guide loader missing from html/${file}`);
    assert.ok(/<(?:input|select|textarea)\b/i.test(html) || (/id=["']advanced-fields["']/i.test(html) && /advanced-calculators\.js/i.test(html)), "No static or runtime-generated calculator controls found in html/" + file);
  });
});

test("shared loader and guide expose the accessible collapsible guide implementation", () => {
  const loader = fs.readFileSync(chromePath, "utf8");
  const guide = fs.readFileSync(guidePath, "utf8");
  const stylesheet = fs.readFileSync(stylesheetPath, "utf8");

  assert.match(loader, /calculator-guide-catalog\.js/);
  assert.match(loader, /calculator-guide\.js/);
  assert.match(guide, /createElement\("details"\)/);
  assert.match(guide, /createElement\("summary"\)/);
  assert.match(guide, /Step-by-step instructions/);
  assert.match(guide, /Equipment you may need/);
  assert.match(guide, /Limitations and safety/);
  assert.match(stylesheet, /\.cf-practical-guide/);
  assert.match(stylesheet, /\.cf-guide-section/);
});
