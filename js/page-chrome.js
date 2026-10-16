/* ClerFit R3 quick navigation: consistent fixed Home and Contact Us controls. */
(() => {
  "use strict";
  // Force browsers to request the current R3 stylesheet after a release update.
  // This avoids a stale cached UI on mobile devices.
  for (const link of document.querySelectorAll('link[rel~="stylesheet"][href*="css/style.css"]')) {
    try {
      const fresh = new URL(link.href, document.baseURI);
      fresh.searchParams.set("v", "20261017-r3-live-release");
      if (link.href !== fresh.href) link.href = fresh.href;
    } catch (_) {}
  }
  const init = () => {
    const root = new URL(location.pathname.includes("/html/") ? "../" : "./", location.href);
    if (document.querySelector(".clerfit-fixed-actions, .top-right-buttons, .cf-floating-links, .cf-page-actions")) return;
    const nav = document.createElement("nav");
    nav.className = "cf-page-actions";
    nav.setAttribute("aria-label", "Quick navigation");
    const home = new URL("index.html", root).href;
    const contact = new URL("contact.html", root).href;
    nav.innerHTML = '<a class="cf-page-home" href="' + home + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5.5 9v11h13V9M9 20v-6h6v6"/></svg><span>Home</span></a>' +
      '<a class="cf-page-contact" href="' + contact + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>Contact Us</span></a>';
    document.body.appendChild(nav);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true}); else init();
})();
