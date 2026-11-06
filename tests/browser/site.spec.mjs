import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { renderSite } from '../../scripts/render.mjs';

test('homepage loads with real profile, local assets, empty content and no browser errors', async ({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Libo Zhu',exact:true})).toBeVisible();
  await expect(page.getByText('Publication details will be added soon.',{exact:true})).toBeVisible();
  await expect(page.getByText('Project details will be added soon.',{exact:true})).toBeVisible();
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
  await page.getByRole('navigation').getByRole('link',{name:'Projects',exact:true}).click();
  await expect(page).toHaveURL(/#projects$/);
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

test('future project content can be filtered with a keyboard without publishing fixtures', async ({page})=>{
  const site=JSON.parse(await readFile(new URL('../../content/site.json',import.meta.url),'utf8'));
  site.projects=[
    {title:'Restoration example',description:'Test-only content',categories:['Restoration'],links:[]},
    {title:'Efficiency example',description:'Test-only content',categories:['Efficiency'],links:[]},
  ];
  await page.route('**/filter-fixture',route=>route.fulfill({status:200,contentType:'text/html',body:renderSite(site)}));
  await page.goto('/filter-fixture');
  const filter=page.getByRole('button',{name:'Restoration',exact:true});
  await filter.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading',{name:'Restoration example'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Efficiency example'})).toBeHidden();
  await expect(page.getByRole('status')).toHaveText('1 project shown in Restoration.');
  await page.getByRole('button',{name:'All',exact:true}).click();
  await expect(page.locator('[data-project]:visible')).toHaveCount(2);
});

test('all fragment navigation targets exist and content has one main heading', async ({page})=>{
  await page.goto('/');
  expect(await page.locator('h1').count()).toBe(1);
  expect(await page.locator('a[href^="#"]').evaluateAll(links=>links.every(link=>document.getElementById(link.hash.slice(1))))).toBe(true);
});
