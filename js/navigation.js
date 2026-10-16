/* ClerFit R3 navigation safety: preserve existing calculator sidebars and links. */
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded",()=>{
    const side=document.querySelector("body > .sidebar, body > aside.sidebar");
    const home=document.querySelector(".cf-home");
    if(home && side && !side.children.length) side.setAttribute("aria-hidden","true");
    document.querySelectorAll(".top-right-buttons").forEach(nav=>{
      nav.setAttribute("aria-label","Page navigation");
    });
  });
})();