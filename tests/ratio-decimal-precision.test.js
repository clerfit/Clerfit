#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('html/ratio.html', 'utf8');
const match = html.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'ratio page must have its inline calculation script');

function calculate(a, b) {
  const fields = {
    ratioA: { value: String(a) },
    ratioB: { value: String(b) },
    ratioResult: { innerHTML: '' }
  };
  const document = { getElementById: id => fields[id] || null };
  const context = vm.createContext({ document, Number, Math, parseFloat });
  vm.runInContext(match[1], context, { filename: 'html/ratio.html:inline-script', timeout: 1000 });
  context.calculateRatio();
  return fields.ratioResult.innerHTML;
}

assert.match(calculate('1.5', '3.5'), /Simplified Ratio:<\/b> 3 : 7/,
  'ordinary decimal ratios must still simplify correctly');
assert.match(calculate('2', '5'), /Simplified Ratio:<\/b> 2 : 5/,
  'integer ratios must remain unchanged');
const tiny = calculate('0.000000000001', '1000000');
assert.doesNotMatch(tiny, /Simplified Ratio:<\/b> 0 : 1/,
  'unsafe decimal scaling must never report a false zero ratio');
assert.match(tiny, /Not safely reducible at this precision/,
  'ratio must disclose when safe integer simplification is not possible');
assert.match(tiny, /Decimal Form:<\/b> 1e-18/,
  'small non-zero decimal ratio must not be rounded to zero');
assert.match(calculate('1', '0'), /positive second value/,
  'zero denominator must be rejected');
console.log('PASS: ratio simplification, precision fallback, small-value formatting and zero-denominator rejection.');
