const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('BMI calculator works end-to-end on phone-sized viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/BMI.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#weight')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate BMI' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  // Metric known-answer: 70 kg / 1.75 m² = BMI 22.9 (rounded).
  await page.locator('#weight').fill('70');
  await page.locator('#height').fill('175');
  await page.locator('#age').fill('30');
  await page.locator('#gender').selectOption('male');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('22.9');
  await expect(page.locator('#result')).toContainText('Normal');

  // Changing units must change HTML bounds, accept a metres entry and keep the result equivalent.
  await page.locator('#heightUnit').selectOption('m');
  await expect(page.locator('#height')).toHaveAttribute('min', '0.5');
  await expect(page.locator('#height')).toHaveAttribute('max', '2.74');
  await page.locator('#height').fill('1.75');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('22.9');

  // Imperial weight and inches height should produce the same rounded result.
  await page.locator('#weightUnit').selectOption('lbs');
  await page.locator('#weight').fill('154.3236');
  await page.locator('#heightUnit').selectOption('in');
  await page.locator('#height').fill('68.8976378');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('22.9');

  // Converted upper domain edge: 1102.31 lb is just under 500 kg.
  await page.locator('#weight').fill('1102.31');
  await page.locator('#heightUnit').selectOption('cm');
  await page.locator('#height').fill('175');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('Obesity class II or higher');

  // Under-20 users must not receive adult BMI category classifications.
  await page.locator('#age').fill('17');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('Age-specific interpretation required');
  await expect(page.locator('#result')).toContainText('does not estimate a pediatric percentile');

  // Bad entries must not leave the previous successful result on screen.
  await page.locator('#age').fill('30');
  await page.locator('#weight').fill('0');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error')).toBeVisible();
  await expect(page.locator('.clerfit-input-error')).toContainText('between 4.41 and 1100');

  // Reset clears results/errors, restores defaults and places focus at the first input.
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#weight')).toHaveValue('');
  await expect(page.locator('#height')).toHaveValue('');
  await expect(page.locator('#age')).toHaveValue('');
  await expect(page.locator('#weightUnit')).toHaveValue('kg');
  await expect(page.locator('#heightUnit')).toHaveValue('cm');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#weight')).toBeFocused();

  // Keyboard focus must be visible, and the page must reflow down to a narrow phone viewport.
  await page.keyboard.press('Tab');
  await expect(page.locator('#weightUnit')).toBeFocused();
  const focusOutline = await page.locator('#weightUnit').evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(focusOutline), 'Keyboard focus indicator should be visible').toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'Page should not overflow horizontally on a 320px viewport').toBeLessThanOrEqual(dimensions.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local page assets should load successfully').toEqual([]);
});

test('BMI calculator has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/BMI.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
