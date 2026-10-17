const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WHR calculator works end-to-end on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors = [];
  const localFailures = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) {
      localFailures.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto('http://127.0.0.1:8000/html/whr.html', { waitUntil: 'networkidle' });
  await expect(page.locator('#waist')).toBeVisible();
  await expect(page.locator('#hip')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);

  // Known answer: 80cm waist / 100cm hip = 0.80.
  await page.locator('#waist').fill('80');
  await page.locator('#hip').fill('100');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('WHR: 0.80');
  await expect(page.locator('#formula')).toContainText('80.0 ÷ 100.0 = 0.80');

  // The ratio is independent of the sex/reference selector; no unsupported classification is shown.
  await page.locator('#gender').selectOption('female');
  await expect(page.locator('#result')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('WHR: 0.80');
  await expect(page.locator('#result')).not.toContainText(/low|moderate|high risk/i);

  // Unit selectors convert the current physical values and keep consistent input ranges.
  await page.locator('#waistUnit').selectOption('inch');
  await expect.poll(async () => Number(await page.locator('#waist').inputValue())).toBeCloseTo(31.4961, 3);
  await expect(page.locator('#waist')).toHaveAttribute('min', '3.93701');
  await expect(page.locator('#waist')).toHaveAttribute('max', '118.1102');
  await page.locator('#hipUnit').selectOption('inch');
  await expect.poll(async () => Number(await page.locator('#hip').inputValue())).toBeCloseTo(39.3701, 3);
  await expect(page.locator('#hip')).toHaveAttribute('min', '3.93701');
  await expect(page.locator('#hip')).toHaveAttribute('max', '118.1102');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('WHR: 0.80');

  await page.locator('#waistUnit').selectOption('m');
  await expect(page.locator('#waist')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#waist')).toHaveAttribute('max', '3');
  await page.locator('#hipUnit').selectOption('ft');
  await expect(page.locator('#hip')).toHaveAttribute('min', '0.328084');
  await expect(page.locator('#hip')).toHaveAttribute('max', '9.84251');

  // Missing input shows an accessible error rather than producing a ratio.
  await page.locator('#waist').fill('');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('Enter valid positive waist and hip measurements');
  await expect(page.locator('#result [role="alert"]')).toBeVisible();

  // A value beyond a declared range is blocked; it must not reuse an old ratio.
  await page.locator('#waistUnit').selectOption('cm');
  await page.locator('#hipUnit').selectOption('cm');
  await expect(page.locator('#waistUnit')).toHaveValue('cm');
  await expect(page.locator('#hipUnit')).toHaveValue('cm');
  await expect(page.locator('#waist')).toHaveAttribute('max', '300');
  await expect(page.locator('#hip')).toHaveAttribute('max', '300');
  await page.locator('#waist').fill('301');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('.clerfit-input-error').first()).toBeVisible();
  await expect(page.locator('#result')).not.toContainText('WHR:');

  // Boundary measurements at 10cm and 300cm are accepted.
  await page.locator('#waist').fill('10');
  await page.locator('#hip').fill('10');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('WHR: 1.00');
  await page.locator('#waist').fill('300');
  await page.locator('#hip').fill('300');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#result')).toContainText('WHR: 1.00');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#waist')).toHaveValue('');
  await expect(page.locator('#hip')).toHaveValue('');
  await expect(page.locator('#gender')).toHaveValue('male');
  await expect(page.locator('#waistUnit')).toHaveValue('cm');
  await expect(page.locator('#hipUnit')).toHaveValue('cm');
  await expect(page.locator('#waist')).toHaveAttribute('min', '10');
  await expect(page.locator('#waist')).toHaveAttribute('max', '300');
  await expect(page.locator('#result')).toBeEmpty();
  await expect(page.locator('#formula')).toBeEmpty();
  await expect(page.locator('#waist')).toBeFocused();

  await page.keyboard.press('Tab');
  const focusOutline = await page.locator('#waistUnit').evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(focusOutline), 'Keyboard focus indicator should be visible').toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('link', { name: /Go to ClerFit home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us at ClerFit/i })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document, 'WHR page should not overflow on 390px viewport').toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 320, height: 844 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(narrow.document, 'WHR page should not overflow on 320px viewport').toBeLessThanOrEqual(narrow.viewport);
  expect(pageErrors, 'No uncaught browser errors').toEqual([]);
  expect(localFailures, 'All local assets should load successfully').toEqual([]);
});

test('WHR page has no automated axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000/html/whr.html', { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
    'Automated accessibility violations'
  ).toEqual([]);
});
