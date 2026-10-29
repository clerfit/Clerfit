/* ClerFit R3 quick navigation: Home and Contact Us at the top-right of each page header, in normal flow. */
(() => {
  "use strict";
  // Each HTML document versions its stylesheet URL directly to avoid a second CSS request after first paint.

  const selector = ".clerfit-fixed-actions, .top-right-buttons, .cf-floating-links, .cf-page-actions";
  const placeInHeader = (nav) => {
    // Keep the homepage actions inside its branded header; do not detach them from that background.
    if (nav.closest(".cf-home-top")) return;
    const main = document.querySelector("main.main, main, .main") || document.body;
    const header = main.querySelector(":scope > .header, :scope > header, .header");
    if (header && header.parentNode) {
      if (nav !== header.previousElementSibling) header.parentNode.insertBefore(nav, header);
      return;
    }
    if (nav.parentNode !== main || nav !== main.firstElementChild) main.insertBefore(nav, main.firstElementChild);
  };

  // Add a shared, non-duplicated footer to legacy calculator pages.
  // Pages that already define their own footer keep it unchanged.
  function ensureSiteFooter() {
    const existingFooter = document.querySelector("footer");
    if (existingFooter) { existingFooter.classList.add("cf-footer"); return; }
    const main = document.querySelector("main.main, main, .main");
    if (!main) return;
    const root = new URL(location.pathname.includes("/html/") ? "../" : "./", location.href);
    const home = new URL("index.html", root).href;
    const contact = new URL("contact.html", root).href;
    const footer = document.createElement("footer");
    footer.className = "cf-footer";
    footer.innerHTML =
      '<div class="cf-footer-category-icons" aria-hidden="true"><span><svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6v5m4-5v3m4-3v5"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M12 3c-4.2 0-7 3.2-7 8 0 5.1 3 9 7 10 4-1 7-4.9 7-10 0-4.8-2.8-8-7-8Z"/><path d="M9 10h.01M15 10h.01M9 15q3 2 6 0"/></svg></span><span><svg viewBox="0 0 24 24"><path d="m13 2-8 11h6l-1 9 9-13h-6z"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M3 9v6m4-9v12m10-12v12m4-9v6M7 12h10"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M2 12h4l3-7 4 14 3-7h6"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M4 18 10 12l4 3 6-8M14 7h6v6"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M19 15A8 8 0 0 1 9 5a8 8 0 1 0 10 10Z"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 6.5-8 11-8 11Z"/><path d="M12 8v7m-3.5-3.5h7"/></svg></span><span><svg viewBox="0 0 24 24"><path d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4z"/></svg></span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19"/></svg></span></div>' +
      '<div class="cf-footer-main">' +
        '<a class="cf-footer-brand" href="' + home + '"><span>ClerFit</span></a>' +
        '<p>Clear tools for better-informed everyday decisions.</p>' +
        '<nav class="cf-footer-links" aria-label="Footer navigation">' +
          '<a href="' + home + '#all-calculators">Explore calculators</a>' +
          '<a href="' + contact + '">Contact</a>' +
        '</nav>' +
      '</div>' +
      '<div class="cf-footer-bottom">' +
        '<span>© <span class="cf-footer-year"></span> ClerFit. Educational estimates, not medical diagnoses.</span>' +
        '<a href="#top" class="cf-back-top">Back to top ↑</a>' +
      '</div>';
    const year = footer.querySelector(".cf-footer-year");
    if (year) year.textContent = String(new Date().getFullYear());
    const backTop = footer.querySelector(".cf-back-top");
    if (backTop) backTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    main.appendChild(footer);
  }

  const init = () => {
    ensureSiteFooter();
    const root = new URL(location.pathname.includes("/html/") ? "../" : "./", location.href);
    let nav = document.querySelector(selector);
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "cf-page-actions";
      nav.setAttribute("aria-label", "Quick navigation");
      const home = new URL("index.html", root).href;
      const contact = new URL("contact.html", root).href;
      nav.innerHTML = '<a class="cf-page-home" href="' + home + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5.5 9v11h13V9M9 20v-6h6v6"/></svg><span>Home</span></a>' +
        '<a class="cf-page-contact" href="' + contact + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>Contact Us</span></a>';
    }
    // Normalize legacy navigation containers so the same styling, tests and accessibility hooks work everywhere.
    nav.classList.add("cf-page-actions");
    nav.setAttribute("aria-label", nav.getAttribute("aria-label") || "Quick navigation");
    const homeLink = nav.querySelector('a[href*="index.html"], a[href="./"], a[href="../"]');
    const contactLink = nav.querySelector('a[href*="contact.html"]');
    if (homeLink) homeLink.classList.add("cf-page-home");
    if (contactLink) { contactLink.classList.add("cf-page-contact"); contactLink.setAttribute("aria-label", "Contact Us at ClerFit"); }
    placeInHeader(nav);
    ensureAccessibleLandmarksAndLinks();
  };

  // Preserve semantic landmarks on legacy calculator pages that still use a .main div.
  // Give icon-only links a useful accessible name when their markup has no text/label.
  function ensureAccessibleLandmarksAndLinks() {
    if (!document.querySelector("main, [role=main]")) {
      const content = document.querySelector(".main") || document.querySelector("#content");
      if (content) content.setAttribute("role", "main");
    }
    const labelControl = (control) => {
      if (!control || !control.matches('input:not([type="hidden"]), select, textarea, button')) return;
      const hasName = Boolean(
        control.getAttribute("aria-label")?.trim() ||
        control.getAttribute("aria-labelledby")?.trim() ||
        control.getAttribute("title")?.trim() ||
        (control.labels && [...control.labels].some((label) => label.textContent.trim())) ||
        (control.matches("button") && control.textContent?.replace(/\s+/g, " ").trim()) ||
        (control.matches('input[type="button"], input[type="submit"], input[type="reset"]') && (control.value || "").trim())
      );
      if (hasName) return;
      const svgTitle = control.querySelector("svg title")?.textContent?.trim() || "";
      const parentHint = control.closest("[aria-label], [title], label")?.getAttribute("aria-label") ||
        control.closest("[aria-label], [title], label")?.getAttribute("title") || "";
      const raw = control.getAttribute("data-label") || control.getAttribute("data-tooltip") ||
        control.getAttribute("data-action") || control.id || control.name ||
        control.getAttribute("placeholder") || svgTitle || parentHint ||
        (control.matches("button") ? control.className : "");
      const label = String(raw).replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
      if (label) {
        control.setAttribute("aria-label", label.charAt(0).toUpperCase() + label.slice(1));
      } else if (control.matches("button")) {
        // Last-resort accessible name for legacy icon-only controls with no semantic metadata.
        // The audit still reports these for source-level cleanup; this prevents an unnamed control.
        control.setAttribute("aria-label", "Calculator action");
      } else {
        const preceding = control.previousElementSibling;
        const nearbyLabel = preceding?.matches("label") ? preceding.textContent.trim() : "";
        if (nearbyLabel) control.setAttribute("aria-label", nearbyLabel);
      }
    };
    const labelControls = (root = document) => {
      if (root.matches?.('input:not([type="hidden"]), select, textarea, button')) labelControl(root);
      root.querySelectorAll?.('input:not([type="hidden"]), select, textarea, button').forEach(labelControl);
    };
    labelControls();
    // Several legacy pages add icon controls after DOMContentLoaded. Keep their accessible names
    // synchronized without changing their click behavior or requiring a page-specific fork.
    if (!window.__clerfitControlLabelObserver && document.documentElement) {
      window.__clerfitControlLabelObserver = new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) labelControls(node);
        }));
      });
      window.__clerfitControlLabelObserver.observe(document.documentElement, { childList: true, subtree: true });
    }
    document.querySelectorAll("a").forEach((anchor) => {
      const hasName = Boolean(
        anchor.getAttribute("aria-label")?.trim() ||
        anchor.getAttribute("aria-labelledby")?.trim() ||
        anchor.getAttribute("title")?.trim() ||
        anchor.textContent?.replace(/\s+/g, " ").trim() ||
        [...anchor.querySelectorAll("img")].some((img) => img.getAttribute("alt")?.trim())
      );
      if (hasName) return;
      const href = anchor.getAttribute("href") || "";
      let label = "";
      if (href.startsWith("#") && href.length > 1) {
        label = "Jump to " + href.slice(1).replace(/[-_]+/g, " ");
      } else if (href) {
        try {
          const target = new URL(href, document.baseURI);
          const leaf = target.pathname.split("/").filter(Boolean).pop() || "";
          if (!leaf || leaf.toLowerCase() === "index.html") label = "ClerFit home";
          else if (/^contact(?:\.html)?$/i.test(leaf)) label = "Contact ClerFit";
          else {
            const name = decodeURIComponent(leaf).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
            label = name ? "Open " + name : "Open linked page";
          }
          if (target.origin !== location.origin) label += " (external link)";
        } catch (_) {
          label = "Open linked page";
        }
      } else {
        const hint = (anchor.id || anchor.className || "icon link").toString()
          .replace(/\b(?:btn|button|link|icon)\b/gi, " ")
          .replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
        label = hint ? hint.charAt(0).toUpperCase() + hint.slice(1) : "Open link";
      }
      anchor.setAttribute("aria-label", label);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
