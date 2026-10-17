const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Body Fat Percentage works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/bodyfat.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#bf-height')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate Body Fat %' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.locator('#bf-hip')).not.toHaveAttribute('required', '');

  // Male known answer on canonical metric values.
  await page.locator('#bf-gender').selectOption('male');
  await page.locator('#bf-height').fill('180');
  await page.locator('#bf-waist').fill('85');
  await page.locator('#bf-neck').fill('38');
  await page.locator('#bf-hip').fill('');
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toContainText('16.2%');
  await expect(page.locator('#bf-formula')).toContainText('US Navy male equation');

  // Unit dropdowns must convert existing input values and keep valid unit bounds.
  await page.locator('#bf-height-unit').selectOption('inch');
  await page.locator('#bf-waist-unit').selectOption('inch');
  await page.locator('#bf-neck-unit').selectOption('inch');
  await expect.poll(async () => Number(await page.locator('#bf-height').inputValue())).toBeCloseTo(70.8661, 3);
  await expect(page.locator('#bf-height')).toHaveAttribute('min', '39.3701');
  await expect(page.locator('#bf-height')).toHaveAttribute('max', '98.4252');
  await expect.poll(async () => Number(await page.locator('#bf-waist').inputValue())).toBeCloseTo(33.4646, 3);
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toContainText('16.2%');

  // A female estimate requires hip, uses the distinct formula, and accepts the valid input.
  await page.locator('#bf-gender').selectOption('female');
  await expect(page.locator('#bf-hip')).toHaveAttribute('required', '');
  await page.locator('#bf-height-unit').selectOption('cm');
  await page.locator('#bf-waist-unit').selectOption('cm');
  await page.locator('#bf-neck-unit').selectOption('cm');
  await page.locator('#bf-height').fill('165');
  await page.locator('#bf-waist').fill('75');
  await page.locator('#bf-neck').fill('33');
  await page.locator('#bf-hip').fill('95');
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toContainText('27.2%');
  await expect(page.locator('#bf-formula')).toContainText('US Navy female equation');

  // Shared validation must require hip for female equation, clear output, and recover when corrected.
  await page.locator('#bf-hip').fill('');
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toBeEmpty();
  await expect(page.locator('#bf-formula')).toBeEmpty();
  await expect(page.locator('#bf-hip').locator('xpath=following-sibling::*[1]')).toContainText('enter a value before calculating');
  await page.locator('#bf-hip').fill('95');
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toContainText('27.2%');

  // Invalid semantic relationship must replace, not preserve, the previous result.
  await page.locator('#bf-waist').fill('30');
  await page.locator('#bf-neck').fill('38');
  await page.getByRole('button', { name: 'Calculate Body Fat %' }).click();
  await expect(page.locator('#bf-result')).toContainText('waist must exceed neck');
  await expect(page.locator('#bf-formula')).toBeEmpty();

  // Reset clears validation/output and restores all unit defaults and focus.
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#bf-height')).toHaveValue('');
  await expect(page.locator('#bf-waist')).toHaveValue('');
  await expect(page.locator('#bf-neck')).toHaveValue('');
  await expect(page.locator('#bf-hip')).toHaveValue('');
  await expect(page.locator('#bf-gender')).toHaveValue('male');
  for (const id of ['bf-height-unit', 'bf-waist-unit', 'bf-neck-unit', 'bf-hip-unit']) {
    await expect(page.locator('#' + id)).toHaveValue('cm');
  }
  await expect(page.locator('#bf-hip')).not.toHaveAttribute('required', '');
  await expect(page.locator('#bf-result')).toBeEmpty();
  await expect(page.locator('#bf-formula')).toBeEmpty();
  await expect(page.locator('#bf-height')).toBeFocused();

  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();
  await page.keyboard.press('Tab');
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'Body Fat page should not overflow horizontally on a 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'Body Fat page should not overflow horizontally on a 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('Body Fat Percentage has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/bodyfat.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
