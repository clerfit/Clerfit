/*
 * ClerFit R4 accessible contextual tooltips
 * Scoped to .cf-r4; does not change R3 pages.
 * Tooltips are opt-in: add .cf-r4__info and a concise data-tooltip string.
 */
(function () {
  'use strict';
  const ROOT = '.cf-r4';
  const TRIGGER = '.cf-r4__info[data-tooltip]';

  function closeAll(except) {
    document.querySelectorAll(ROOT + ' ' + TRIGGER + '[aria-expanded="true"]').forEach(button => {
      if (button !== except) button.setAttribute('aria-expanded', 'false');
    });
  }

  function initButton(button) {
    if (button.dataset.cfR4TooltipReady === 'true') return;
    button.dataset.cfR4TooltipReady = 'true';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');
    button.addEventListener('click', event => {
      event.preventDefault();
      const opening = button.getAttribute('aria-expanded') !== 'true';
      closeAll(button);
      button.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        button.setAttribute('aria-expanded', 'false');
        button.blur();
      }
    });
  }

  function scan(node) {
    if (!node) return;
    if (node.matches && node.matches(ROOT)) {
      if (node.matches(TRIGGER)) initButton(node);
      node.querySelectorAll(TRIGGER).forEach(initButton);
    } else if (node.querySelectorAll) {
      node.querySelectorAll(ROOT + ' ' + TRIGGER).forEach(initButton);
    }
  }

  document.addEventListener('click', event => {
    if (!event.target.closest(ROOT + ' ' + TRIGGER)) closeAll(null);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll(null);
  });

  function start() {
    scan(document);
    if (typeof MutationObserver === 'function') {
      const observer = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(scan));
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
