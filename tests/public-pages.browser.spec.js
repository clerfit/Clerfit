const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function assertNoHorizontalOverflow(page, widths=[390,320]) {
  for (const width of widths) {
    await page.setViewportSize({width,height:844});
    const dims=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));
    expect(dims.document,'no horizontal overflow at '+width+'px').toBeLessThanOrEqual(dims.viewport);
  }
}

test('homepage directory search, categories, FAQ and sidebar work',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:8000/index.html',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#cf-total-count')).toHaveText('118');
  await expect(page.locator('#cf-category-grid .cf-category-card')).toHaveCount(11);
  await expect(page.locator('#cf-directory-grid .cf-directory-card')).toHaveCount(118);
  await page.locator('#cf-directory-query').fill('pace');
  await expect(page.locator('#cf-directory-count')).toContainText('1 calculator');
  await expect(page.locator('#cf-directory-grid a').first()).toHaveAttribute('href','html/running-pace.html');
  await page.getByRole('button',{name:'Clear search'}).click();
  await expect(page.locator('#cf-directory-count')).toContainText('118 calculators');
  await page.locator('#cf-category-grid .cf-category-card').first().click();
  await expect(page.locator('#cf-clear-filter')).toBeVisible();
  await expect(page.locator('#cf-directory-count')).toContainText('13 calculators');
  await page.locator('#cf-clear-filter').click();
  await expect(page.locator('#cf-directory-count')).toContainText('118 calculators');
  const faq=page.locator('#faq details').first();
  await expect(faq).not.toHaveAttribute('open',/.*/);
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open','');
  await page.locator('.cf-menu-toggle').click();
  await expect(page.locator('#cf-sidebar')).toHaveAttribute('aria-hidden','false');
  await page.locator('#cf-sidebar .cf-sidebar-close').click();
  await expect(page.locator('#cf-sidebar')).toHaveAttribute('aria-hidden','true');
  await expect(page.locator('.cf-menu-toggle')).toBeFocused();
  await assertNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test('contact form handles mocked success without contacting Formspree',async({page})=>{
  await page.route('https://formspree.io/f/xaqqwlew',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:8000/contact.html',{waitUntil:'domcontentloaded'});
  await page.locator('#name').fill('ClerFit Test');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('Automated test message; no live delivery.');
  await page.locator('#privacyConsent').check();
  await page.getByRole('button',{name:'Send Message'}).click();
  await expect(page.locator('#formMessage')).toContainText('Message sent successfully');
  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#email')).toHaveValue('');
  await expect(page.locator('#message')).toHaveValue('');
  await expect(page.getByRole('button',{name:'Send Message'})).toBeEnabled();
  await assertNoHorizontalOverflow(page);
});

test('contact form handles provider failure and restores the submit button',async({page})=>{
  await page.route('https://formspree.io/f/xaqqwlew',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Temporary provider outage'})}));
  await page.goto('http://127.0.0.1:8000/contact.html',{waitUntil:'domcontentloaded'});
  await page.locator('#name').fill('ClerFit Test');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('Failure-path test; no live delivery.');
  await page.locator('#privacyConsent').check();
  await page.getByRole('button',{name:'Send Message'}).click();
  await expect(page.locator('#formMessage')).toContainText('Message could not be sent');
  await expect(page.locator('#formMessage')).toContainText('Temporary provider outage');
  await expect(page.locator('#name')).toHaveValue('ClerFit Test');
  await expect(page.getByRole('button',{name:'Send Message'})).toBeEnabled();
});

test('404, legacy aliases and site-verification file resolve to their intended content',async({page,request})=>{
  await page.goto('http://127.0.0.1:8000/404.html',{waitUntil:'domcontentloaded'});
  await expect(page.locator('h1')).toContainText(/couldn't find|not found/i);
  await expect(page.locator('a[href*="index.html"]')).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.goto('http://127.0.0.1:8000/html/calories.html',{waitUntil:'domcontentloaded'});
  await page.waitForURL(/html\/daily-energy\.html/);
  await page.goto('http://127.0.0.1:8000/html/pace.html',{waitUntil:'domcontentloaded'});
  await page.waitForURL(/html\/running-pace\.html/);
  await page.goto('http://127.0.0.1:8000/html/contact.html',{waitUntil:'domcontentloaded'});
  await page.waitForURL(/\/contact\.html$/);
  const response=await request.get('http://127.0.0.1:8000/googlee616aa88163475c1.html');
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe('google-site-verification: googlee616aa88163475c1.html');
});

for (const target of [
  {name:'homepage',path:'/index.html'},
  {name:'contact page',path:'/contact.html'},
  {name:'404 page',path:'/404.html'}
]) {
  test(target.name+' has no automated axe accessibility violations',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto('http://127.0.0.1:8000'+target.path,{waitUntil:'domcontentloaded'});
    const results=await new AxeBuilder({page}).analyze();
    expect(results.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  });
}
