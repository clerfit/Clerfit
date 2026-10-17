#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('contact.html', 'utf8');
for (const file of ['html/contact.html', 'html/calories.html', 'html/pace.html']) {
  const legacyHtml = fs.readFileSync(file, 'utf8');
  assert.match(
    legacyHtml,
    /<meta\s+name="robots"\s+content="noindex,follow"/i,
    'legacy redirect must stay out of search results: ' + file
  );
}
const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .find(body => body.includes("form.addEventListener('submit'"));
assert.ok(script, 'contact page must contain the contact submission handler');
assert.match(html, /id="privacyConsent"[^>]*required/, 'contact form must require privacy acknowledgement');
assert.match(html, /\.contact-consent\{display:flex;/, 'privacy consent checkbox must use the intended accessible layout styles');
assert.doesNotMatch(html, /\\n\.contact-consent/, 'contact consent CSS must not contain a literal escaped newline that disables its selector');

function fixture(fetchImpl, validForm) {
  let submitHandler = null;
  let resetCount = 0;
  let fetchCount = 0;
  const attributes = {};
  const button = { textContent: 'Send Message', disabled: false };
  const message = {
    className: '',
    textContent: '',
    setAttribute(name, value) { attributes[name] = value; }
  };
  const form = {
    action: 'https://formspree.io/f/xaqqwlew',
    addEventListener(type, handler) { if (type === 'submit') submitHandler = handler; },
    querySelector(selector) { return selector === 'button[type="submit"]' ? button : null; },
    reportValidity() { return validForm !== false; },
    reset() { resetCount++; }
  };
  const document = {
    getElementById(id) {
      if (id === 'contactForm') return form;
      if (id === 'formMessage') return message;
      return null;
    }
  };
  const fetch = async (...args) => {
    fetchCount++;
    return fetchImpl(...args);
  };
  class FakeFormData { constructor(sourceForm) { this.form = sourceForm; } }
  const context = vm.createContext({ document, fetch, FormData: FakeFormData, console });
  vm.runInContext(script, context, { filename: 'contact.html', timeout: 3000 });
  assert.equal(typeof submitHandler, 'function', 'submit handler must be registered');
  return {
    submit: () => submitHandler({ preventDefault() {} }),
    button, message, attributes,
    get resetCount() { return resetCount; },
    get fetchCount() { return fetchCount; }
  };
}

async function main() {
  let t = fixture(async () => ({ ok: true }), true);
  await t.submit();
  assert.equal(t.message.className, 'success-message');
  assert.equal(t.message.textContent, 'Message sent successfully.');
  assert.equal(t.resetCount, 1, 'successful submission resets the form');
  assert.equal(t.button.disabled, false, 'button is re-enabled after success');
  assert.equal(t.button.textContent, 'Send Message', 'button label is restored after success');
  assert.equal(t.attributes.role, 'status', 'form status is announced accessibly');
  assert.equal(t.attributes['aria-live'], 'polite');
  
  t = fixture(async () => ({
    ok: false,
    async json() { return { error: 'The service rejected this request.' }; }
  }), true);
  await t.submit();
  assert.equal(t.message.className, 'error-message');
  assert.match(t.message.textContent, /The service rejected this request/);
  assert.equal(t.resetCount, 0, 'failed submission must preserve the entered message');
  assert.equal(t.button.disabled, false, 'button is re-enabled after server error');
  assert.equal(t.button.textContent, 'Send Message', 'button label is restored after server error');

  t = fixture(async () => { throw new Error('network unavailable'); }, true);
  await t.submit();
  assert.equal(t.message.className, 'error-message');
  assert.match(t.message.textContent, /network unavailable/);
  assert.equal(t.button.disabled, false, 'button is re-enabled after network error');
  assert.equal(t.button.textContent, 'Send Message', 'button label is restored after network error');

  t = fixture(async () => ({ ok: true }), false);
  await t.submit();
  assert.equal(t.fetchCount, 0, 'invalid form must not submit to the provider');
  assert.equal(t.resetCount, 0, 'invalid form must preserve user input');

  console.log('Contact form mocked regression checks passed: success, provider error, network recovery, browser validation, consent and live-region setup.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
