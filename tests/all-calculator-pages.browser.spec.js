const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const inventory = fs.readFileSync('PHASE_1_CALCULATOR_INVENTORY.csv','utf8').trim().split(/\r?\n/).slice(1);
const routes = inventory.map(line => {
  const match = line.match(/^"([^"]*)","([^"]*)","([^"]*)","([^"]+)"/);
  if (!match) throw new Error('Cannot parse calculator inventory row: '+line);
  return { title: match[1], file: match[4] };
});
if (routes.length !== 118) throw new Error('Expected 118 registered calculator pages, found '+routes.length);

for (const routeInfo of routes) {
  test('registered calculator page: '+routeInfo.title+' ('+routeInfo.file+')', async ({page}) => {
    test.setTimeout(15000);
    await page.setViewportSize({width:390,height:844});
    const pageErrors=[]; const localFailures=[];
    page.on('pageerror',e=>pageErrors.push(e.message));
    page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8000/')&&r.status()>=400)localFailures.push(r.status()+' '+r.url());});
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') return route.abort();
      return route.continue();
    });
    const response=await page.goto('http://127.0.0.1:8000/'+routeInfo.file,{waitUntil:'networkidle'});
    expect(response && response.status(), 'page should load successfully').toBe(200);
    await expect(page.locator('h1').first()).toBeVisible({timeout:3000});
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({timeout:3000});
    await expect(page.locator('.cf-page-actions .cf-page-home, .clerfit-fixed-actions .clerfit-fixed-home')).toHaveAttribute('href',/index\.html/,{timeout:3000});
    await expect(page.locator('.cf-page-actions .cf-page-contact, .clerfit-fixed-actions .clerfit-fixed-contact')).toHaveAttribute('href',/contact\.html/,{timeout:3000});
    const controls=await page.locator('input:not([type="hidden"]),select,textarea,button').evaluateAll(nodes=>nodes.filter(el=>!el.disabled&&!el.closest('[hidden]')&&el.getClientRects().length).filter(el=>{
      if(el.matches('button,input[type="button"],input[type="submit"],input[type="reset"]')) return !String(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.innerText||el.value||el.title||'').trim();
      if(el.matches('select,textarea,input:not([type="hidden"])')) {
        const explicitLabel=el.id && document.querySelector('label[for="'+CSS.escape(el.id)+'"]');
        const associatedLabel=el.labels && Array.from(el.labels).some(label=>label.textContent.trim());
        return !(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.title||associatedLabel||(explicitLabel&&explicitLabel.textContent.trim()));
      }
      return false;
    }).map(el=>({tag:el.tagName,id:el.id,type:el.type||'',text:(el.innerText||el.value||'').slice(0,60)})));
    expect(controls,'visible form controls must have accessible names').toEqual([]);
    for(const width of [390,320]) {
      await page.setViewportSize({width,height:844});
      const dims=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));
      expect(dims.document,'no horizontal overflow at '+width+'px').toBeLessThanOrEqual(dims.viewport);
    }
    expect(pageErrors,'no uncaught JavaScript exceptions').toEqual([]);
    expect(localFailures,'no missing local assets').toEqual([]);
  });
}
