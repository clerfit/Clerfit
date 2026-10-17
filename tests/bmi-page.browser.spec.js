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

  // Under-20 users must not receive adult BMI category classifications.
  await page.locator('#age').fill('17');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('Age-specific interpretation required');
  await expect(page.locator('#result')).toContainText('does not estimate a pediatric percentile');

  // Bad entries must not leave the previous successful result on screen.
  await page.locator('#age').fill('30');
  await page.locator('#weight').fill('0');
  await page.getByRole('button', { name: 'Calculate BMI' }).click();
  await expect(page.locator('#result')).toContainText('Enter a valid positive weight and height');
  await expect(page.locator('#result [role="alert"]')).toBeVisible();

  // Reset clears results/errors, restores defaults and places focus at the first input.
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#weight')).toHaveValue('');
  await expect(page.locator('#height')).toHaveValue('');
  await expect(page.locator('#age')).toHaveValue('');
  await expect(page.locator('#weightUnit')).toHaveValue('kg');
  await expect(page.locator('#heightUnit')).toHaveValue('cm');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#weight')).toBeFocused();

  // Check narrow layout and collect browser/runtime failures.
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'Page should not overflow horizontally on a 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local page assets should load successfully').toEqual([]);
});

test('BMI calculator has no serious or critical automated accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/BMI.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(v => ['serious', 'critical'].includes(v.impact));
  expect(
    blocking.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Serious/critical accessibility violations'
  ).toEqual([]);
});
