const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Lean Body Mass calculator works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/leanmass.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#weight')).toBeVisible();
  await expect(page.locator('#fat')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  // Known answer and formula text.
  await page.locator('#weight').fill('70');
  await page.locator('#fat').fill('20');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Lean Mass: 56.00 kg (80.0%)');
  await expect(page.locator('#formula')).toContainText('56.00 kg');

  // Change to pounds, verify automatic conversion and compatible bounds, then recalculate.
  await page.locator('#weightUnit').selectOption('lb');
  await expect.poll(async () => Number(await page.locator('#weight').inputValue())).toBeCloseTo(154.3236, 3);
  await expect(page.locator('#weight')).toHaveAttribute('min', '0.22046227');
  await expect(page.locator('#weight')).toHaveAttribute('max', '1102.31');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Lean Mass: 56.00 kg (80.0%)');

  // Changing inputs clears stale results; a missing body-fat value must not be treated as zero.
  await page.locator('#fat').fill('');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Enter a positive weight and a body-fat percentage');
  await expect(page.locator('#result [role="alert"]')).toBeVisible();

  // Body-fat 0 and 100 boundaries are valid; values outside the bounds are rejected.
  await page.locator('#fat').fill('0');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('70.00 kg (100.0%)');
  await page.locator('#fat').fill('100');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('0.00 kg (0.0%)');
  await page.locator('#fat').fill('100.1');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error')).toBeVisible();

  // Reset clears form errors/results and restores kg defaults and focus.
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#weight')).toHaveValue('');
  await expect(page.locator('#fat')).toHaveValue('');
  await expect(page.locator('#weightUnit')).toHaveValue('kg');
  await expect(page.locator('#weight')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#weight')).toHaveAttribute('max', '500');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await expect(page.locator('#weight')).toBeFocused();

  await page.keyboard.press('Tab');
  const focused = await page.locator('#weightUnit').evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(focused), 'Keyboard focus indicator should be visible').toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'Lean Mass page should not overflow on 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'Lean Mass page should not overflow on 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('Lean Body Mass has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/leanmass.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
