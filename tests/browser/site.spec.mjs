import { test, expect } from '@playwright/test';

test('homepage loads with real profile, ten publications, local assets and no browser errors', async ({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Libo Zhu',exact:true})).toBeVisible();
  await expect(page.locator('.publication')).toHaveCount(10);
  await expect(page.locator('.authors strong')).toHaveCount(10);
  await expect(page.locator('.latest-publications .publication')).toHaveCount(1);
  await expect(page.locator('.latest-publications h3').last()).toContainText('TRACE:');
  for (const image of await page.locator('.publication-image').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate(img=>img.complete && img.naturalWidth>0)).toBe(true);
  }
  await expect(page.locator('#projects')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Collaborative Projects',exact:true})).toBeVisible();
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.locator('.portrait').evaluate(image=>image.complete && image.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.fonts.check('18px Roboto'))).toBe(true);
  await page.screenshot({path:'test-results/homepage-desktop.png',fullPage:true});
  expect(errors).toEqual([]);
});

test('mobile navigation opens, follows a section and closes with Escape', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const menu=page.getByRole('button',{name:'Open navigation'});
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeHidden();
  await menu.click();
  await expect(page.getByRole('button',{name:'Close navigation'})).toHaveAttribute('aria-expanded','true');
  await page.getByRole('navigation').getByRole('link',{name:'Collaborative Projects',exact:true}).click();
  await expect(page).toHaveURL(/#collaborations$/);
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-results/homepage-mobile.png',fullPage:true});
});

test('no horizontal overflow at mobile, tablet and desktop widths', async ({page})=>{
  await page.goto('/');
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${width}px viewport`).toBe(true);
  }
});

test('profile and navigation remain usable without JavaScript', async ({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading',{name:'About Me'})).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link',{name:'Contact',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'labor030073@gmail.com',exact:true})).toHaveAttribute('href','mailto:labor030073@gmail.com');
  await context.close();
});

test('all fragment navigation targets exist and content has one main heading', async ({page})=>{
  await page.goto('/');
  expect(await page.locator('h1').count()).toBe(1);
  expect(await page.locator('a[href^="#"]').evaluateAll(links=>links.every(link=>document.getElementById(link.hash.slice(1))))).toBe(true);
});

test('navigation highlights the same section regardless of scroll direction', async ({page})=>{
  await page.setViewportSize({width:1440,height:600});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  const scroll = y => page.evaluate(y=>new Promise(resolve=>{
    window.scrollTo(0,y);
    requestAnimationFrame(()=>requestAnimationFrame(resolve));
  }),y);
  await scroll(500);
  const active=await page.locator('nav [aria-current]').textContent();
  await scroll(850);
  await scroll(700);
  await scroll(500);
  await expect(page.locator('nav [aria-current]')).toHaveText(active);
});
