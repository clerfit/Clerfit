const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('BSA calculator works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/bsa.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#weight')).toBeVisible();
  await expect(page.locator('#height')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate BSA' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  // Known answer: Mosteller BSA for 70 kg and 175 cm is approximately 1.84 m².
  await page.locator('#weight').fill('70');
  await page.locator('#height').fill('175');
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toContainText('BSA: 1.84 m²');
  await expect(page.locator('#formula')).toContainText('Mosteller formula');

  // Changing units converts the entered physical values and recalculation is equivalent.
  await page.locator('#weightUnit').selectOption('lbs');
  await expect.poll(async () => Number(await page.locator('#weight').inputValue())).toBeCloseTo(154.3236, 3);
  await expect(page.locator('#weight')).toHaveAttribute('min', '2.20462262');
  await expect(page.locator('#weight')).toHaveAttribute('max', '1102.31');
  await page.locator('#heightUnit').selectOption('in');
  await expect.poll(async () => Number(await page.locator('#height').inputValue())).toBeCloseTo(68.8976, 3);
  await expect(page.locator('#height')).toHaveAttribute('min', '19.685');
  await expect(page.locator('#height')).toHaveAttribute('max', '98.4252');
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toContainText('BSA: 1.84 m²');

  // Other supported height units keep the same 50–250cm physical range.
  await page.locator('#heightUnit').selectOption('m');
  await expect(page.locator('#height')).toHaveAttribute('min', '0.5');
  await expect(page.locator('#height')).toHaveAttribute('max', '2.5');
  await page.locator('#heightUnit').selectOption('ft');
  await expect(page.locator('#height')).toHaveAttribute('min', '1.6404');
  await expect(page.locator('#height')).toHaveAttribute('max', '8.2021');

  // Empty inputs are explicitly blocked by input validation, not interpreted as zero.
  await page.locator('#weight').fill('');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error').first()).toBeVisible();

  // Convert back to metric and test the domain boundaries.
  await page.locator('#weightUnit').selectOption('kg');
  await page.locator('#heightUnit').selectOption('cm');
  await page.locator('#weight').fill('1');
  await page.locator('#height').fill('50');
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toContainText('BSA: 0.12 m²');
  await page.locator('#weight').fill('500');
  await page.locator('#height').fill('250');
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toContainText('BSA: 5.89 m²');

  // Values past the permitted domains must not keep an old result.
  await page.locator('#weight').fill('500.1');
  await page.getByRole('button', { name: 'Calculate BSA' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error').first()).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#weight')).toHaveValue('');
  await expect(page.locator('#height')).toHaveValue('');
  await expect(page.locator('#weightUnit')).toHaveValue('kg');
  await expect(page.locator('#heightUnit')).toHaveValue('cm');
  await expect(page.locator('#weight')).toHaveAttribute('min', '1');
  await expect(page.locator('#weight')).toHaveAttribute('max', '500');
  await expect(page.locator('#height')).toHaveAttribute('min', '50');
  await expect(page.locator('#height')).toHaveAttribute('max', '250');
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
  expect(dimensions.document, 'BSA page should not overflow on 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'BSA page should not overflow on 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('BSA has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/bsa.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
