import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSite } from '../scripts/render.mjs';

const profile = {
  name: 'Libo Zhu', nameNative: '朱力博', role: 'PhD Student',
  institution: 'Shanghai Jiao Tong University', institutionUrl: 'https://www.sjtu.edu.cn/',
  department: 'Computer Science and Technology', portrait: '/assets/portrait.jpg',
  email: 'labor030073@gmail.com', github: 'https://github.com/libozhu03',
  bio: ['A short biography.'], interests: ['Image restoration'],
  education: [{degree:'PhD in Computer Science and Technology', institution:'Shanghai Jiao Tong University', period:'2025 – present'}]
};
const site = { url:'https://libozhu03.github.io', description:'Academic homepage', profile, publications:[], collaborations:[] };

test('empty framework has honest empty states and no dummy resources', () => {
  const html = renderSite(site);
  assert.match(html, /Publication details will be added soon\./);
  assert.doesNotMatch(html, /id="projects"/);
  assert.doesNotMatch(html, /href="#"|href="javascript:|Download CV/);
  assert.match(html, /朱力博/);
});

test('publication text and resource links cannot inject markup or executable URLs', () => {
  const html = renderSite({...site, publications:[{
    title:'<img src=x onerror=alert(1)>', authors:[{name:'Libo Zhu',equal:true},{name:'<script>alert(1)</script>',corresponding:true}], year:2026,
    venue:'A & B', links:[{label:'Paper',url:'https://example.org/paper'},{label:'Bad',url:'javascript:alert(1)'}]
  }]});
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /A &amp; B/);
  assert.match(html, /<strong>Libo Zhu<\/strong><sup>\*<\/sup>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<sup>†<\/sup>/);
  assert.match(html, /href="https:\/\/example.org\/paper"/);
  assert.doesNotMatch(html, /href="javascript:|<img src=x/);
});

test('collaboration content and links are retained', () => {
  const html = renderSite({...site, collaborations:[
    {title:'图像研究',description:'A real description',categories:['Restoration'],links:[]},
    {title:'Second work',description:'Another description',categories:['Efficiency'],links:[{label:'Code',url:'https://github.com/example/repo'}]}
  ]});
  assert.match(html, /图像研究/);
  assert.match(html, /id="collaborations"/);


  assert.doesNotMatch(html, /Project details will be added soon\./);
});

test('local asset paths are preserved and invalid image paths are excluded', () => {
  const html = renderSite({...site, projects:[{title:'Example',description:'',image:'data:text/html,<script>x</script>',categories:[],links:[]}]});
  assert.match(html, /src="\/assets\/portrait.jpg"/);
  assert.doesNotMatch(html, /src="data:/);
});

test('latest papers are pinned, then accepted papers and preprints sort newest first without mutating data', () => {
  const publications = [
    {title:'Preprint older',sortDate:'2025-03-07'},
    {title:'Accepted older',acceptedConference:'CVPR 2025',sortDate:'2025-06'},
    {title:'Pinned paper',latest:true,sortDate:'2024-01'},
    {title:'Preprint newer',sortDate:'2026-05-20'},
    {title:'Accepted newer',acceptedConference:'NeurIPS 2026',sortDate:'2026-12',firstPublished:'2026-06-29'},
    {title:'Accepted same conference',acceptedConference:'NeurIPS 2026',sortDate:'2026-12',firstPublished:'2025-09-29'}
  ];
  const before=JSON.stringify(publications);
  const html=renderSite({...site,publications});
  const order=['Pinned paper','Accepted newer','Accepted same conference','Accepted older','Preprint newer','Preprint older'];
  order.slice(1).forEach((title,i)=>assert.ok(html.indexOf(order[i])<html.indexOf(title)));
  assert.match(html,/class="publication-divider"/);
  assert.equal(JSON.stringify(publications),before);
});
