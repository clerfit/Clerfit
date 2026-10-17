const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('FFMI calculator works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/ffmi.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#height')).toBeVisible();
  await expect(page.locator('#weight')).toBeVisible();
  await expect(page.locator('#fat')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  // Known answer: 70kg, 20% body fat, height 1.75m -> 56kg lean / FFMI 18.29.
  await page.locator('#height').fill('175');
  await page.locator('#weight').fill('70');
  await page.locator('#fat').fill('20');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Lean Mass: 56.00 kg (80.0%)');
  await expect(page.locator('#result')).toContainText('FFMI: 18.29');
  await expect(page.locator('#ffmi-formula')).toContainText('FFMI = lean mass');

  // Convert height to inches and weight to pounds; the same body should have the same FFMI.
  await page.locator('#heightUnit').selectOption('inch');
  await expect.poll(async () => Number(await page.locator('#height').inputValue())).toBeCloseTo(68.8976, 3);
  await expect(page.locator('#height')).toHaveAttribute('min', '19.685');
  await expect(page.locator('#height')).toHaveAttribute('max', '98.4252');
  await page.locator('#weightUnit').selectOption('lb');
  await expect.poll(async () => Number(await page.locator('#weight').inputValue())).toBeCloseTo(154.3236, 3);
  await expect(page.locator('#weight')).toHaveAttribute('min', '0.22046227');
  await expect(page.locator('#weight')).toHaveAttribute('max', '1102.31');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('FFMI: 18.29');

  // Empty input must not be silently converted to zero percent.
  await page.locator('#fat').fill('');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#ffmi-formula')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Enter a positive height and weight and a body-fat percentage');
  await expect(page.locator('#result [role="alert"]')).toBeVisible();

  // Endpoints 0% and 100% are mathematically valid; out-of-domain values must be blocked.
  await page.locator('#fat').fill('0');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('FFMI: 22.86');
  await page.locator('#fat').fill('100');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('FFMI: 0.00');
  await page.locator('#fat').fill('100.1');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error').first()).toBeVisible();

  // Invalid converted height is rejected before reusing any prior valid result.
  await page.locator('#heightUnit').selectOption('cm');
  await page.locator('#height').fill('251');
  await page.locator('#fat').fill('20');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error').first()).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#height')).toHaveValue('');
  await expect(page.locator('#weight')).toHaveValue('');
  await expect(page.locator('#fat')).toHaveValue('');
  await expect(page.locator('#heightUnit')).toHaveValue('cm');
  await expect(page.locator('#weightUnit')).toHaveValue('kg');
  await expect(page.locator('#height')).toHaveAttribute('min', '50');
  await expect(page.locator('#height')).toHaveAttribute('max', '250');
  await expect(page.locator('#weight')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#weight')).toHaveAttribute('max', '500');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#ffmi-formula')).toBeEmpty();
  await expect(page.locator('#height')).toBeFocused();

  await page.keyboard.press('Tab');
  const focusOutline = await page.locator('#heightUnit').evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(focusOutline), 'Keyboard focus indicator should be visible').toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'FFMI page should not overflow on 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'FFMI page should not overflow on 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('FFMI has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/ffmi.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
