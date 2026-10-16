# Calculator Interaction Smoke Report

Date: 2026-10-15

- HTML pages exercised: **121** (includes all 118 registered calculator routes plus aliases/utility/contact pages).
- Primary action target found and invoked: **121/121**.
- Fatal page-load failures: **0**.
- Uncaught JavaScript errors: **0**.
- Browser-console errors: **0**.
- Horizontal overflow at a 390 px viewport: **0 pages** after the somatotype image fix.

The harness used actual local HTML, CSS and JavaScript in Chromium with local assets inlined to avoid the environment's local-URL navigation restriction. Inputs were populated with representative values chosen from labels, units and HTML constraints. This is a smoke test: it proves that the pages load and primary actions can execute without uncaught errors, not that every output is mathematically correct. The additional interaction report verifies category filtering, sidebar search/open/close, global kg/lb conversion, full-screen images, pediatric BMI messaging and male/female body-fat known-answer outputs. See `CALCULATOR_INTERACTION_SMOKE_REPORT.json` for per-page samples.
