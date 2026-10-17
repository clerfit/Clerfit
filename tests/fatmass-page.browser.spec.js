const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Fat Mass calculator works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/fatmass.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#weight')).toBeVisible();
  await expect(page.locator('#fat')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  await page.locator('#weight').fill('70');
  await page.locator('#fat').fill('20');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Fat Mass: 14.00 kg (20.0%)');
  await expect(page.locator('#formula')).toContainText('14.00 kg');

  // Weight unit switch must preserve the same physical result and use converted boundaries.
  await page.locator('#weightUnit').selectOption('lb');
  await expect.poll(async () => Number(await page.locator('#weight').inputValue())).toBeCloseTo(154.3236, 3);
  await expect(page.locator('#weight')).toHaveAttribute('min', '0.22046227');
  await expect(page.locator('#weight')).toHaveAttribute('max', '1102.31');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Fat Mass: 14.00 kg (20.0%)');

  // Missing fat must not silently yield a zero-fat result.
  await page.locator('#fat').fill('');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Enter a positive weight and a body-fat percentage');
  await expect(page.locator('#result [role="alert"]')).toBeVisible();

  // Both endpoints are valid; 100% means all entered weight is estimated fat mass.
  await page.locator('#fat').fill('0');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Fat Mass: 0.00 kg (0.0%)');
  await page.locator('#fat').fill('100');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Fat Mass: 70.00 kg (100.0%)');

  // Values past declared boundaries are intercepted with inline validation and no stale answer.
  await page.locator('#fat').fill('100.1');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error')).toBeVisible();
  await page.locator('#weight').fill('0.05');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error')).toBeVisible();

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
  const focusOutline = await page.locator('#weightUnit').evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(focusOutline), 'Keyboard focus indicator should be visible').toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'Fat Mass page should not overflow on 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'Fat Mass page should not overflow on 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('Fat Mass has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/fatmass.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
