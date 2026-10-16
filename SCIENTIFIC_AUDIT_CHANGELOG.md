# ClerFit Scientific Audit Changelog

Date: 2026-10-16

## Findings corrected in this pass

1. BMI Change documentation used the opposite sign convention from the implementation. It now consistently reports `goal BMI − current BMI`, and the tests verify the sign.
2. BMI Change applied adult category labels without collecting age. Those labels were removed; the tool now reports the numeric BMI values and a context caveat.
3. One-Rep Max allowed repetition values that could make the Brzycki equation invalid or meaningless. Input is now constrained to integer repetitions 1–15 and validated again in JavaScript.
4. One-Rep Max advertised unsupported universal accuracy grades. These were removed, and the result notes uncertainty varies by exercise, protocol and person.
5. One-Rep Max returned kg even when the user selected pounds. Output now follows the selected weight unit.
6. Formula matrix and scientific register rows were updated to match the BMI Change, One-Rep Max and Ponderal Index implementation/methods.
7. Static input boundary CSVs were regenerated from the current calculator HTML and synchronized to source constraints (238 static numeric controls).

## Fresh local checks

- `node tests/verify.js` — PASS, including the added formula/sign/unit/boundary assertions.
- `node tests/contact-form.test.js` — PASS with mocked responses only.
- `node tests/unit-conversion-property.test.js` — PASS.
- `node scripts/generate-sitemap.js --check` — PASS.

## Remaining limits

These are source-code and desk-review findings, not a claim of external clinical certification. A browser process was attempted in this environment but did not return before the command timeout. No live site was contacted for real form delivery or deployed response-header inspection in this pass.
