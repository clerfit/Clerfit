# ClerFit Browser QA Report

Date: 2026-10-15

## Result

**Source-inlined Chromium smoke tests passed.** Direct navigation to the local HTTP/file URL was blocked by the execution environment, so the harness rendered the actual project HTML and CSS in Chromium and injected the page's actual local JavaScript in document order. This exercises the source and browser DOM, but it is not a substitute for testing the deployed production URL.

## All-page smoke results

- 124 HTML documents inspected in the full page-load harness, including homepage, root contact, 404 and calculator/utility pages.
- 121 HTML documents under `html/` were exercised with a primary action click; all 118 registered calculator routes are included.
- 0 fatal page-load failures, 0 uncaught JavaScript errors, 0 browser-console errors and 0 pages without an action target.
- All 121 `html/` pages passed the 390 px mobile horizontal-overflow check after fixing the somatotype image width.
- Static local-reference audit: zero missing local static `href`/`src` references across 124 HTML files.

## Interaction tests passed

- FAQ: 7 items, all closed initially; a tap/click opens an item.
- Sidebar: opens and closes; the menu toggle is hidden while the sidebar is open.
- Homepage Explore by Topic filters to the complete Face & Aesthetics category (10 calculators), topic search narrows to Jaw Width Ratio, and clearing the filter restores all 118 registered routes.
- Face & Aesthetics sidebar dropdown expands and exposes 10 calculator links.
- Sidebar search for “jaw width” returns Jaw Width Ratio.
- Global unit round-trip: 70 kg → 154.3236 lb → 70 kg.
- Full-screen image viewer opens and closes.
- Actual BMI page at age 16 shows “Age-specific interpretation required”; male/female US Navy body-fat known-answer outputs are 14.5% and 25.7% for the documented sample inputs.
- Representative pages (homepage, BMI, Jaw Width Ratio and Contact) showed no horizontal overflow at 360, 390, 768, 1024 and 1365 px.
- Impossible BMI weight input of 1,000,000 is marked invalid; representative valid body-fat height and calorie values are accepted.
- Advanced calculator reset clears the stale result and restores the formula prompt.

## Bugs found and fixed during this pass

- Shared page-shell insertion attempted to insert a header before a nested breadcrumb, causing `insertBefore` errors on calculator pages. It now chooses a direct child.
- Navigation and page polish had competing image-viewer click bindings. Navigation's duplicate viewer was removed.
- Resetting advanced forms could leave a previous result visible; reset now clears result and validation states.
- Some specialist facial measurements containing “height” were incorrectly excluded from contextual tooltips. Only ordinary demographic fields are excluded now.
- The somatotype image overflowed the mobile viewport; shared content-image sizing now constrains it.
- US Navy body-fat formulas used centimetres with inch-based constants; measurements are now converted to inches before applying logarithms.
- Heath–Carter mesomorphy now uses corrected arm and calf girths.
- Teen BMI no longer receives unvalidated adult-like categories; the page explains the need for age- and sex-specific growth-chart percentiles.
- Length/distance conversions such as m↔km are now compatible; incompatible dimensions return `NaN` rather than silently preserving the input.

## Still required for a true production release

1. Independently verify every calculator formula and boundary vector against a credible reference. The automated suite includes 24 advanced-calculator known-answer cases, 13 shared legacy known-answer cases, a somatotype case and a pediatric BMI interpretation check, but that is not every formula.
2. Confirm the configured Formspree endpoint is authorized and test real message delivery/failure states.
3. Deploy to the chosen host and verify the real production URL, HTTPS, deep links, cache/security headers, 404 handling and form delivery. The build now generates sitemap and canonical URLs from `SITE_URL` or Netlify’s `URL`; verify these values on the deployed site.

The source-inlined browser results are genuine smoke-test evidence, but they do not justify a claim that every formula is independently certified or that live contact delivery has been proven.

## Post-smoke verification addendum (2026-10-15)

After the recorded source-inlined Chromium pass, the release pass changed BMI interpretation at age 19, improved label associations/accessibility names, and adjusted signed-value validation. These final changes were checked by the updated regression suite and static accessibility/integrity audits. The source-inlined browser report above is the last recorded browser interaction pass; it was not rerun after every final accessibility-name edit. Production URL and real-device QA remain pending.
