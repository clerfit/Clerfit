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

test("guide catalog covers every calculator in the verification matrix exactly once", () => {
  const matrix = parseCsv(fs.readFileSync(matrixPath, "utf8"));
  const catalog = loadCatalog();
  const matrixFiles = matrix.map((record) => record.file).filter(Boolean);
  const catalogFiles = catalog.map((record) => record.file);

  assert.equal(matrixFiles.length, 118, "Update this expected count when the verified inventory changes.");
  assert.equal(catalog.length, matrixFiles.length);
  assert.equal(new Set(catalogFiles).size, catalogFiles.length, "Catalog file names must be unique.");
  assert.deepEqual([...catalogFiles].sort(), [...matrixFiles].sort());

  catalog.forEach((record) => {
    assert.ok(record.title, `Missing title for ${record.file}`);
    assert.ok(record.category, `Missing category for ${record.file}`);
    assert.ok(record.slug, `Missing route slug for ${record.file}`);
    assert.ok(record.method, `Missing method summary for ${record.file}`);
    assert.ok(record.reference, `Missing reference/method note for ${record.file}`);
  });
});

test("every inventoried calculator page loads shared page chrome and has calculator controls", () => {
  const matrix = parseCsv(fs.readFileSync(matrixPath, "utf8"));
  matrix.forEach(({ file }) => {
    const pagePath = path.join(root, "html", file);
    assert.ok(fs.existsSync(pagePath), `Missing calculator page: html/${file}`);
    const html = fs.readFileSync(pagePath, "utf8");
    assert.match(html, /page-chrome\.js/i, `Shared guide loader missing from html/${file}`);
    assert.match(html, /<(?:input|select|textarea)\b/i, `No calculator input control found in html/${file}`);
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
