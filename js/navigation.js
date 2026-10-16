(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    if (!sidebar.children.length) {
      sidebar.innerHTML = '<a class="cf-sidebar-brand" href="index.html">ClerFit</a><button class="cf-sidebar-toggle" type="button" aria-expanded="false">Browse calculators <span aria-hidden="true">▾</span></button><nav class="cf-sidebar-links" aria-label="Calculator categories"><a href="index.html#all-calculators">All calculators</a><a href="index.html#browse-categories">Categories</a><a href="index.html#faq">Help & FAQ</a><a href="contact.html">Contact Us</a></nav>';
    }
    const toggle=sidebar.querySelector(".cf-sidebar-toggle"), links=sidebar.querySelector(".cf-sidebar-links");
    if(toggle && links) toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));links.hidden=!open;});
    document.querySelectorAll(".top-right-buttons").forEach(nav=>{nav.style.position="fixed";nav.style.top="12px";nav.style.right="12px";nav.style.zIndex="1000";});
  });
})();