# Contributing to ClerFit

ClerFit is a static HTML, CSS, and JavaScript project. Keep changes readable, focused, and safe for the existing calculator experience.

## Code style

- Use UTF-8 text, LF line endings, two spaces for indentation, and a final newline.
- Keep JavaScript functions small and give variables and functions descriptive names.
- Prefer `const`; use `let` only when a value must be reassigned.
- Keep calculator formulas, input validation, unit conversion, and result presentation in clearly separated sections.
- Use semantic HTML and preserve accessible names, labels, keyboard interaction, and focus states.
- Group CSS by component or page area. Prefer editing the original component rule over appending another override.
- Add comments to explain intent or non-obvious constraints, not to narrate obvious code.
- Avoid unrelated formatting or behavior changes in a calculator-specific change.

## Calculator registry

`js/navigation.js` is the central calculator registry. When adding or changing a calculator, keep its title, category, slug, file path, and search keywords in sync. Check that the target HTML file exists and that the calculator remains discoverable from the homepage and sidebar.

## Safe change process

1. Work on a feature or maintenance branch; do not make broad cleanup commits directly on `main`.
2. Make one logical change at a time.
3. Preserve existing formulas and user-facing behavior unless the change explicitly targets them.
4. Check for duplicate IDs, missing assets, broken relative links, and console errors.
5. Run available automated checks and manually test representative desktop, tablet, and phone layouts before merging.
6. Describe any checks that could not be run. Never report an unperformed test as passed.
