/* ClerFit R3 menu visibility and consistent fixed navigation */
(() => {
  "use strict";
  const start = () => {
    const root = new URL(location.pathname.includes("/html/") ? "../" : "./", location.href);
    if (document.querySelector(".cf-menu-toggle")) return;
    const menu = document.createElement("button");
    menu.className = "cf-menu-toggle";
    menu.type = "button";
    menu.setAttribute("aria-label", "Open site menu");
    menu.setAttribute("aria-expanded", "false");
    menu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    document.body.appendChild(menu);
    const backdrop = document.createElement("button");
    backdrop.className = "cf-menu-backdrop";
    backdrop.type = "button";
    backdrop.setAttribute("aria-label", "Close site menu");
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
    const drawer = document.createElement("nav");
    drawer.className = "cf-menu-drawer";
    drawer.id = "cf-site-menu";
    drawer.setAttribute("aria-label", "Site navigation");
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = '<div class="cf-menu-drawer-head"><a href="' + new URL("index.html", root).href + '" class="cf-menu-brand">ClerFit</a><button type="button" class="cf-menu-close" aria-label="Close menu">×</button></div><label class="cf-menu-search-label" for="cf-menu-search">Find a calculator</label><input id="cf-menu-search" class="cf-menu-search" type="search" placeholder="Search calculators…" autocomplete="off"><div class="cf-menu-primary"><a href="' + new URL("index.html", root).href + '">Home</a><a href="' + new URL("contact.html", root).href + '">Contact Us</a></div><div class="cf-menu-list" id="cf-menu-list"><p>Loading calculators…</p></div>';
    document.body.appendChild(drawer);
    menu.setAttribute("aria-controls", drawer.id);
    const close = () => {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      backdrop.hidden = true;
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open site menu");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cf-menu-open");
    };
    const open = () => {
      drawer.classList.add("is-open");
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add("is-open"));
      menu.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-label", "Close site menu");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("cf-menu-open");
    };
    menu.addEventListener("click", () => menu.getAttribute("aria-expanded") === "true" ? close() : open());
    backdrop.addEventListener("click", close);
    drawer.querySelector(".cf-menu-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    fetch(new URL("sitemap.xml", root).href, {cache:"no-cache"}).then(res => {
      if (!res.ok) throw new Error("sitemap unavailable");
      return res.text();
    }).then(text => {
      const xml = new DOMParser().parseFromString(text, "application/xml");
      const pages = [...xml.querySelectorAll("loc")].map(n => n.textContent.trim()).filter(href => {
        try { const u = new URL(href); return u.origin === root.origin && u.pathname.startsWith(root.pathname) && /\/html\/[^/]+\.html$/i.test(u.pathname); } catch { return false; }
      });
      const links = [...new Set(pages)].map(href => {
        const u = new URL(href);
        const slug = decodeURIComponent(u.pathname.split("/").pop().replace(/\.html$/i, ""));
        const label = slug.replace(/[-_]+/g," ").replace(/\b\w/g,c=>c.toUpperCase());
        return {href:u.href,label};
      }).sort((a,b)=>a.label.localeCompare(b.label));
      const list = drawer.querySelector("#cf-menu-list");
      list.innerHTML = links.length ? links.map(x => '<a class="cf-menu-calc-link" href="' + x.href + '">' + x.label.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])) + '</a>').join("") : '<p>No calculator pages are listed yet.</p>';
      drawer.querySelector("#cf-menu-search").addEventListener("input", e => {
        const q = e.target.value.trim().toLowerCase();
        list.querySelectorAll("a").forEach(a => { a.hidden = !a.textContent.toLowerCase().includes(q); });
      });
    }).catch(() => { drawer.querySelector("#cf-menu-list").innerHTML = "<p>Calculator list is temporarily unavailable.</p>"; });
    // Add consistent Home / Contact controls to calculator pages that do not already have them.
    let actions = document.querySelector(".top-right-buttons, .clerfit-fixed-actions");
    if (!actions) {
      actions = document.createElement("nav");
      actions.className = "top-right-buttons";
      actions.setAttribute("aria-label", "Quick navigation");
      actions.innerHTML = '<button type="button" onclick="location.href=' + JSON.stringify(new URL("index.html",root).href) + '">Home</button><button type="button" onclick="location.href=' + JSON.stringify(new URL("contact.html",root).href) + '">Contact Us</button>';
      document.body.appendChild(actions);
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();