import { readFile, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderSite } from './render.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
if (dirname(output) !== root || !output.endsWith('dist')) throw new Error('Unsafe build output directory');
const site = JSON.parse(await readFile(resolve(root, 'content/site.json'), 'utf8'));
if (!site.profile?.name || !site.url || !Array.isArray(site.publications) || !Array.isArray(site.collaborations)) {
  throw new Error('content/site.json requires profile.name, url, publications[] and collaborations[]');
}
const html = renderSite(site);
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(resolve(root, 'public'), output, {recursive:true});
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, '.nojekyll'), '');
await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${new URL(site.url).origin}/</loc></url></urlset>`);
console.log(`Built dist/ — ${site.publications.length} publications, ${site.collaborations.length} collaborations.`);
