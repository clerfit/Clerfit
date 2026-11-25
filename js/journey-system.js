/* ClerFit calculator journeys and optional on-device input reuse.
 * Health measurements are never placed in URLs. One-step transfers use sessionStorage;
 * persistent reuse is disabled until the visitor explicitly opts in.
 */
(() => {
  "use strict";

  const PROFILE_KEY = "clerfit.profile.v1";
  const TRANSFER_KEY = "clerfit.journey.transfer.v1";
  const MAX_PROFILE_AGE = 90 * 24 * 60 * 60 * 1000;
  const page = decodeURIComponent(location.pathname.split("/").pop() || "").toLowerCase();

  const journeys = {
    "bmi.html": {
      result: ["#result", "#bmiResult"],
      next: [{ title: "Estimate resting energy needs", description: "Use the same basic measurements to estimate resting energy expenditure.", file: "bmr.html" }]
    },
    "bodyfat.html": {
      result: ["#result", "#bodyFatResult"],
      next: [{ title: "Estimate resting energy needs", description: "Continue with an equation-based resting-energy estimate.", file: "bmr.html" }]
    },
    "bmr.html": {
      result: ["#result"],
      next: [{ title: "Estimate daily energy needs", description: "Add an activity estimate to explore total daily energy expenditure.", file: "tdee.html" }]
    },
    "tdee.html": {
      result: ["#result"],
      next: [
        { title: "Explore an energy-balance target", description: "Review a cautious energy-balance scenario using your measurements.", file: "deficit.html" },
        { title: "Plan a macronutrient split", description: "Continue to the nutrition calculator and review its assumptions.", file: "macro-split.html" }
      ]
    },
    "deficit.html": {
      result: ["#result", "#details"],
      next: [{ title: "Review macronutrient targets", description: "Explore a protein, carbohydrate and fat distribution.", file: "macro-split.html" }]
    },
    "1rm.html": {
      result: ["#oneRMResult"],
      next: [{ title: "Plan training volume", description: "Use your lifting context to explore sets, repetitions and training volume.", file: "training-volume.html" }]
    },
    "training-volume.html": {
      result: ["#tv-result"],
      next: [{ title: "Compare relative strength", description: "Compare a lifting result with body weight; enter the required values on the next page.", file: "relative-strength.html" }]
    },
    "heartrate.html": {
      result: ["#result"],
      next: [{ title: "Plan a running pace", description: "Use a measured distance and time to explore a pace estimate.", file: "running-pace.html" }]
    },
    "cooper-test.html": {
      result: ["#cooperResult"],
      next: [{ title: "Explore a VO₂ max estimate", description: "Review the Cooper-test estimate and its limitations.", file: "vo2max.html" }]
    },
    "vo2max.html": {
      result: ["#result"],
      next: [{ title: "Plan running pace", description: "Continue to a pace calculation using a measured distance and time.", file: "running-pace.html" }]
    }
  };

  const profileFields = ["age", "gender", "height", "weight"];
  const htmlRoot = new URL("./", location.href);

  function getStorage(name) { try { return window[name] || null; } catch (_) { return null; } }
  const localStore = getStorage("localStorage");
  const sessionStore = getStorage("sessionStorage");

  function storageGet(storage, key) {
    try { return storage.getItem(key); } catch (_) { return null; }
  }
  function storageSet(storage, key, value) {
    try { storage.setItem(key, value); return true; } catch (_) { return false; }
  }
  function storageRemove(storage, key) {
    try { storage.removeItem(key); } catch (_) {}
  }
  function getElement(id) {
    const node = document.getElementById(id);
    return node && !node.disabled ? node : null;
  }
  function readValue(id) {
    const node = getElement(id);
    if (!node || !("value" in node)) return "";
    return String(node.value).trim();
  }
  function currentMeasurements() {
    const values = {};
    for (const id of profileFields) {
      const value = readValue(id);
      if (value) values[id] = value;
    }
    const height = values.height;
    const weight = values.weight;
    if (height) values.heightUnit = readValue("heightUnit") || "";
    if (weight) values.weightUnit = readValue("weightUnit") || "";
    return values;
  }
  function validForTarget(id, value) {
    const node = getElement(id);
    if (!node || !value) return false;
    if (node.tagName === "SELECT") {
      return Array.from(node.options).some(option => option.value === value);
    }
    if (node.type === "number") {
      const number = Number(value);
      if (!Number.isFinite(number)) return false;
      if (node.min !== "" && number < Number(node.min)) return false;
      if (node.max !== "" && number > Number(node.max)) return false;
    }
    return true;
  }
  function applyMeasurements(values, onlyEmpty) {
    if (!values || typeof values !== "object") return;
    for (const id of profileFields) {
      const value = values[id];
      if (value == null || value === "") continue;
      const node = getElement(id);
      if (!node || (onlyEmpty && String(node.value || "").trim())) continue;
      if ((id === "height" && (!values.heightUnit || !readValue("heightUnit") || readValue("heightUnit") !== values.heightUnit)) ||
          (id === "weight" && (!values.weightUnit || !readValue("weightUnit") || readValue("weightUnit") !== values.weightUnit))) continue;
      if (!validForTarget(id, String(value))) continue;
      node.value = String(value);
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  function readSavedProfile() {
    const raw = storageGet(localStore, PROFILE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || Date.now() - Number(parsed.savedAt) > MAX_PROFILE_AGE) {
        storageRemove(localStore, PROFILE_KEY);
        return null;
      }
      return parsed.values && typeof parsed.values === "object" ? parsed.values : null;
    } catch (_) {
      storageRemove(localStore, PROFILE_KEY);
      return null;
    }
  }
  function saveProfile() {
    const values = currentMeasurements();
    const existing = readSavedProfile() || {};
    const merged = { ...existing, ...values };
    const ok = storageSet(localStore, PROFILE_KEY, JSON.stringify({ savedAt: Date.now(), values: merged }));
    const status = document.getElementById("cf-profile-status");
    if (status) status.textContent = ok ? "Compatible inputs saved on this device." : "Browser storage is unavailable. Inputs were not saved.";
  }
  function addProfileControl() {
    const main = document.querySelector("main.main, main, .main") || document.body;
    if (!main || document.getElementById("cf-profile-preferences")) return;
    const saved = readSavedProfile();
    const section = document.createElement("section");
    section.className = "cf-profile-preferences";
    section.id = "cf-profile-preferences";
    section.setAttribute("aria-labelledby", "cf-profile-title");
    section.innerHTML =
      '<h2 id="cf-profile-title">Input preferences</h2>' +
      '<label class="cf-profile-consent"><input type="checkbox" id="cf-save-profile"' + (saved ? " checked" : "") + '> Save compatible age, height and weight inputs on this device</label>' +
      '<p>Optional. Nothing is uploaded to ClerFit. Unit selectors remain calculator-specific. You can clear saved inputs here at any time.</p>' +
      '<div class="cf-profile-actions"><button type="button" id="cf-clear-profile">Clear saved inputs</button><span id="cf-profile-status" role="status" aria-live="polite"></span></div>';
    const header = main.querySelector(":scope > .header, :scope > header, .header");
    if (header && header.parentNode) header.insertAdjacentElement("afterend", section);
    else main.insertBefore(section, main.firstChild);

    const consent = section.querySelector("#cf-save-profile");
    consent.addEventListener("change", () => {
      if (consent.checked) saveProfile();
      else {
        storageRemove(localStore, PROFILE_KEY);
        storageRemove(sessionStore, TRANSFER_KEY);
        section.querySelector("#cf-profile-status").textContent = "Saved inputs cleared.";
      }
    });
    section.querySelector("#cf-clear-profile").addEventListener("click", () => {
      storageRemove(localStore, PROFILE_KEY);
      storageRemove(sessionStore, TRANSFER_KEY);
      consent.checked = false;
      section.querySelector("#cf-profile-status").textContent = "Saved inputs cleared from this browser.";
    });
    if (saved) applyMeasurements(saved, true);
    const update = () => { if (consent.checked) saveProfile(); };
    main.addEventListener("input", update);
    main.addEventListener("change", update);
  }
  function receiveTransfer() {
    const raw = storageGet(sessionStore, TRANSFER_KEY);
    if (!raw) return;
    storageRemove(sessionStore, TRANSFER_KEY);
    try {
      const transfer = JSON.parse(raw);
      if (transfer && transfer.target === page && Date.now() - Number(transfer.createdAt) < 10 * 60 * 1000) {
        applyMeasurements(transfer.values, true);
      }
    } catch (_) {}
  }
  function makeTransferLink(item) {
    const link = document.createElement("a");
    link.className = "cf-journey-link";
    link.href = new URL(item.file, htmlRoot).href;
    link.innerHTML = '<span class="cf-journey-link-title"></span><span class="cf-journey-link-description"></span><span class="cf-journey-link-arrow" aria-hidden="true">→</span>';
    link.querySelector(".cf-journey-link-title").textContent = item.title;
    link.querySelector(".cf-journey-link-description").textContent = item.description;
    link.addEventListener("click", () => {
      storageSet(sessionStore, TRANSFER_KEY, JSON.stringify({
        createdAt: Date.now(),
        target: item.file.toLowerCase(),
        values: currentMeasurements()
      }));
    });
    return link;
  }
  function showNextSteps(config) {
    const output = config.result.map(selector => document.querySelector(selector)).find(Boolean);
    if (!output || !String(output.textContent || "").trim()) return;
    const message = String(output.textContent || "");
    if (/\b(?:enter|choose|select|valid|error|must be|outside the valid)\b/i.test(message)) return;
    let panel = document.getElementById("cf-next-steps");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "cf-next-steps";
      panel.className = "cf-next-steps";
      panel.setAttribute("aria-labelledby", "cf-next-steps-title");
      panel.innerHTML = '<h2 id="cf-next-steps-title">Continue with a related calculator</h2><p>Your compatible inputs can be carried to the next calculator in this tab. Check units and assumptions before calculating again.</p><div class="cf-next-step-links"></div>';
      output.insertAdjacentElement("afterend", panel);
    }
    const list = panel.querySelector(".cf-next-step-links");
    if (list.childElementCount) return;
    config.next.forEach(item => list.appendChild(makeTransferLink(item)));
  }

  function init() {
    if (!/\/html\/[^/]+\.html$/i.test(location.pathname)) return;
    const config = journeys[page];
    receiveTransfer();
    addProfileControl();
    if (!config) return;
    const watch = () => showNextSteps(config);
    config.result.forEach(selector => {
      const node = document.querySelector(selector);
      if (!node) return;
      new MutationObserver(watch).observe(node, { childList: true, subtree: true, characterData: true });
    });
    watch();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();