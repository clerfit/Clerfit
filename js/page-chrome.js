/* ClerFit R3 quick navigation: Home and Contact Us at the top-right of each page header, in normal flow. */
(() => {
  "use strict";
  // Version-bust the shared stylesheet after a release so mobile clients request current layout rules.
  for (const link of document.querySelectorAll('link[rel~="stylesheet"][href*="css/style.css"]')) {
    try {
      const fresh = new URL(link.href, document.baseURI);
      fresh.searchParams.set("v", "20261017-nav-v4");
      if (link.href !== fresh.href) link.href = fresh.href;
    } catch (_) {}
  }

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

  const init = () => {
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
    document.querySelectorAll('input:not([type="hidden"]), select, textarea, button').forEach((control) => {
      const hasName = Boolean(
        control.getAttribute("aria-label")?.trim() ||
        control.getAttribute("aria-labelledby")?.trim() ||
        control.getAttribute("title")?.trim() ||
        (control.labels && [...control.labels].some((label) => label.textContent.trim())) ||
        (control.matches("button") && control.textContent?.replace(/\\s+/g, " ").trim()) ||
        (control.matches('input[type="button"], input[type="submit"], input[type="reset"]') && (control.value || "").trim())
      );
      if (hasName) return;
      const raw = control.id || control.name || control.getAttribute("placeholder") || control.getAttribute("data-label") || "";
      const label = raw.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ").replace(/\\s+/g, " ").trim();
      if (label) control.setAttribute("aria-label", label.charAt(0).toUpperCase() + label.slice(1));
    });
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
