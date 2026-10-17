const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Waist-to-height risk validates inputs and respects adolescent interpretation', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  const errors=[]; const failedLocalResponses=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8000/')&&r.status()>=400)failedLocalResponses.push(r.status()+' '+r.url());});
  await page.goto('http://127.0.0.1:8000/html/waist-height-risk.html',{waitUntil:'networkidle'});
  await expect(page.locator('#advanced-form')).toBeVisible();
  await expect(page.locator('#advanced-fields input')).toHaveCount(3);
  await page.locator('#advanced-fields input').nth(0).fill('80');
  await page.locator('#advanced-fields input').nth(1).fill('180');
  await page.locator('#advanced-fields input').nth(2).fill('17');
  await page.getByRole('button',{name:'Calculate result'}).click();
  await expect(page.locator('#advanced-output')).toContainText('0.444');
  await expect(page.locator('#advanced-output')).toContainText('age is under 18');
  await expect(page.locator('#advanced-formula')).toContainText('Waist circumference ÷ height');
  await page.locator('#advanced-fields input').nth(0).fill('0');
  // Shared validation blocks invalid activation; editing the field must clear the previously displayed answer.
  await expect(page.locator('#advanced-output')).toBeEmpty();
  await expect(page.locator('#advanced-formula')).toContainText('Submit the form');
  await page.getByRole('button',{name:'Calculate result'}).click();
  await expect(page.locator('#advanced-fields input').nth(0)).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('#advanced-output')).toBeEmpty();
  await page.getByRole('button',{name:'Reset'}).click();
  await page.locator('#advanced-fields input').nth(0).fill('80');
  await page.locator('#advanced-fields input').nth(1).fill('180');
  await page.locator('#advanced-fields input').nth(2).fill('121');
  await expect(page.locator('#advanced-output')).toBeEmpty();
  await page.getByRole('button',{name:'Calculate result'}).click();
  await expect(page.locator('#advanced-fields input').nth(2)).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('#advanced-output')).toBeEmpty();
  await page.getByRole('button',{name:'Reset'}).click();
  await page.keyboard.press('Tab');
  const widths=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  await page.setViewportSize({width:320,height:844});
  const narrow=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));
  expect(narrow.document).toBeLessThanOrEqual(narrow.viewport);
  expect(errors).toEqual([]); expect(failedLocalResponses).toEqual([]);
});

test('Waist-to-height risk page has no automated axe accessibility violations', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:8000/html/waist-height-risk.html',{waitUntil:'networkidle'});
  const results=await new AxeBuilder({page}).analyze();
  expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
