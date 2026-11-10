const escape = (value = '') => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

function safeUrl(value, { image = false } = {}) {
  if (typeof value !== 'string' || /[\s\\\u0000-\u001f]/u.test(value)) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    const protocols = image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:'];
    return protocols.includes(url.protocol) ? value : '';
  } catch { return ''; }
}

const icons = {
  dblp: '<path fill="currentColor" stroke="none" d="m4 2 8 4v8l-8-4Zm9 7 7 4v9l-7-4ZM4 12l7 4-7 4Zm9-10 7 4-7 3Z"/>',
  orcid: '<circle cx="12" cy="12" r="10"/><circle cx="7.5" cy="7" r=".8" fill="currentColor" stroke="none"/><path d="M7.5 10v7m4-10v10h2a5 5 0 0 0 0-10Z"/>',
  linkedin: '<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><path d="M7 11v7m5-7v7m0-4a3 3 0 0 1 6 0v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  github: '<path fill="currentColor" stroke="none" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.09.67-3.74-1.31-3.74-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.23-5.06-5.49 0-1.21.43-2.2 1.14-2.98-.12-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.22c.94 0 1.88.13 2.76.37 2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.27-2.6 5.21-5.08 5.49.4.35.75 1.02.75 2.06v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/>',
  education: '<path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? ''}</svg>`;

function link(label, url, className = '') {
  const safe = safeUrl(url);
  return safe ? `<a class="${className}" href="${escape(safe)}">${escape(label)}</a>` : escape(label);
}

function resources(links = []) {
  const valid = links.filter(item => item?.label && safeUrl(item.url));
  return valid.length ? `<div class="resource-links">${valid.map(item => link(item.label, item.url, 'resource-link')).join('')}</div>` : '';
}

function publication(item, profileName) {
  const imageUrl = safeUrl(item.image, { image:true });
  const titleUrl = safeUrl(item.url) || safeUrl(item.links?.[0]?.url);
  const authors = (item.authors || []).map(author => {
    const name = typeof author === 'string' ? author : author.name;
    const marks = typeof author === 'string' ? '' : `${author.equal ? '*' : ''}${author.corresponding ? '†' : ''}`;
    return `${name === profileName ? `<strong>${escape(name)}</strong>` : escape(name)}${marks ? `<sup>${marks}</sup>` : ''}`;
  }).join(', ');
  return `<article class="publication${imageUrl ? ' has-image' : ''}">
    ${imageUrl ? `<a class="publication-visual${item.acceptedConference ? ' has-conference' : ''}" href="${escape(titleUrl || imageUrl)}" aria-label="${escape(item.title)} — ${titleUrl ? 'paper details' : 'view figure'}">${item.acceptedConference ? `<span class="conference-badge">${escape(item.acceptedConference)}</span>` : ''}<img class="publication-image" src="${escape(imageUrl)}" alt="${escape(item.imageAlt || item.title)}" width="${escape(item.imageWidth || 1000)}" height="${escape(item.imageHeight || 600)}" loading="lazy"></a>` : ''}
    <div class="publication-copy"><h3>${link(item.title, titleUrl)}</h3>
    ${authors ? `<p class="authors">${authors}</p>` : ''}
    ${item.venue || item.year || item.links?.length ? `<div class="publication-meta">${item.venue || item.year ? `<p class="venue">${item.acceptedConference ? `In <em>${escape(item.acceptedConference)}</em>` : escape([item.venue, item.year].filter(Boolean).join(' · '))}</p>` : ''}${resources(item.links)}</div>` : ''}</div>
  </article>`;
}

function publicationList(items, profileName) {
  const newestFirst = (a,b) => String(b.sortDate || b.year || '').localeCompare(String(a.sortDate || a.year || ''))
    || String(b.firstPublished || '').localeCompare(String(a.firstPublished || ''));
  const latest = items.filter(item=>item.latest).sort(newestFirst);
  const remaining = items.filter(item=>!item.latest).sort((a,b)=>Number(Boolean(b.acceptedConference))-Number(Boolean(a.acceptedConference)) || newestFirst(a,b));
  return `${latest.length ? `<div class="latest-publications" aria-labelledby="latest-publications-heading"><h3 class="publication-group-heading" id="latest-publications-heading">Latest</h3><div class="publication-list">${latest.map(item=>publication(item,profileName)).join('')}</div></div>${remaining.length ? '<hr class="publication-divider">' : ''}` : ''}
    ${remaining.length ? `<div class="publication-list publication-archive">${remaining.map(item=>publication(item,profileName)).join('')}</div>` : ''}`;
}

function contentChecklist(site, key) {
  const items = site.contentOutline?.enabled ? site.contentOutline[key] : [];
  if (!items?.length) return '';
  return `<aside class="content-checklist" lang="zh-Hans" aria-label="本栏内容清单"><p class="checklist-label">内容清单 · 待整理</p><ul>${items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul></aside>`;
}

function internship(entry) {
  const logo = safeUrl(entry.logo, { image:true });
  return `<li class="internship-entry">
    ${logo ? `<img class="internship-logo" src="${escape(logo)}" alt="${escape(entry.organization)} logo" width="56" height="56" loading="lazy">` : ''}
    <div class="internship-copy"><div class="internship-headline"><h3><strong>${escape(entry.organization)}</strong>${entry.role ? `, ${escape(entry.role)}` : ''}</h3>${entry.date ? `<p class="internship-date">${escape(entry.date)}</p>` : ''}</div>
    ${entry.department ? `<p class="internship-department">${escape(entry.department)}</p>` : ''}
    ${entry.description ? `<p>${escape(entry.description)}</p>` : ''}${resources(entry.links)}</div>
  </li>`;
}

function collaboration(entry) {
  const logo = safeUrl(entry.logo, { image:true });
  return `<li class="collaboration-entry">
    ${logo ? `<img class="collaboration-logo" src="${escape(logo)}" alt="${escape(entry.organization)} logo" width="56" height="56" loading="lazy">` : ''}
    <div class="collaboration-copy"><h3>${link(entry.title,entry.url)}${entry.organization ? ` (${escape(entry.organization)})` : ''}</h3>
    ${entry.role || entry.description ? `<p>${entry.role ? `<strong>${escape(entry.role)}.</strong> ` : ''}${escape(entry.description || '')}</p>` : ''}
    ${entry.application ? `<p class="collaboration-application">${escape(entry.application)}</p>` : ''}
    ${entry.date ? `<p class="entry-date">${escape(entry.date)}</p>` : ''}${resources(entry.links)}</div>
  </li>`;
}

function news(entry) {
  const symbol = {paper:'🎉',award:'🏅',competition:'🏆'}[entry.type] || '📌';
  const papers = entry.papers || (entry.paper ? [{name:entry.paper,url:entry.url}] : []);
  const names = papers.map(paper=>link(paper.name,paper.url));
  const paperList = names.length > 1 ? `${names.slice(0,-1).join(', ')} and ${names.at(-1)}` : names[0];
  const message = entry.type === 'paper' && papers.length && entry.conference
    ? `Our ${papers.length > 1 ? 'papers' : 'paper'} ${paperList} ${papers.length > 1 ? 'were' : 'was'} accepted to <strong>${escape(entry.conference)}</strong>!`
    : link(entry.title,entry.url);
  return `<li class="news-entry"><p class="entry-date">${escape(entry.date)}</p><span class="news-icon" aria-hidden="true">${symbol}</span><p class="news-message">${message}</p></li>`;
}

function outlineSection(site, key, id, title) {
  const entries = site[key] || [];
  if (!entries.length && !site.contentOutline?.enabled && key !== 'news') return '';
  return `<section class="section outline-section" id="${id}" aria-labelledby="${id}-heading">
    <div class="container section-grid"><div class="section-heading"><h2 id="${id}-heading">${title}</h2></div>
    <div class="section-content">${entries.length ? `<ul class="experience-list">${entries.map(entry=>key === 'news' ? news(entry) : key === 'internships' ? internship(entry) : key === 'collaborations' ? collaboration(entry) : `<li>
      ${entry.date ? `<p class="entry-date">${escape(entry.date)}</p>` : ''}
      <h3>${key === 'honors' && entry.badge ? `<span class="award-badge">${escape(entry.badge)}</span> ` : ''}${link(entry.title,entry.url)}</h3>
      ${entry.organization || entry.role ? `<p class="entry-meta">${escape([entry.organization,entry.role].filter(Boolean).join(' · '))}</p>` : ''}
      ${entry.description ? `<p>${escape(entry.description)}</p>` : ''}${resources(entry.links)}</li>`).join('')}</ul>` : ''}
    ${contentChecklist(site,key)}</div></div>
  </section>`;
}

export function renderSite(site) {
  const {profile:p, publications = []} = site;
  const hasSection = key => key === 'news' || site[key]?.length || site.contentOutline?.enabled;
  const navItems = [['about','About'],...(hasSection('news') ? [['news','News']] : []),['publications','Publications'],...(hasSection('honors') ? [['honors','Awards']] : []),...(hasSection('internships') ? [['internships','Experience']] : []),...(hasSection('collaborations') ? [['collaborations','Collaborative Projects']] : []),['contact','Contact']];
  const email = safeUrl(`mailto:${p.email}`);
  const secondaryEmail = p.secondaryEmail ? safeUrl(`mailto:${p.secondaryEmail}`) : '';
  const github = safeUrl(p.github);
  const portrait = safeUrl(p.portrait, { image:true });
  const canonical = safeUrl(site.url);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(p.name)}</title>
  <meta name="description" content="${escape(site.description)}">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${escape(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(p.name)}">
  <meta property="og:description" content="${escape(site.description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <link rel="icon" type="image/png" href="/assets/branding/labor-icon.png">
  <link rel="preload" href="/assets/fonts/roboto-400.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/fonts/montserrat-400.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container nav-shell">
    <a class="brand" href="#about" aria-label="${escape(p.name)} — Home"><img class="brand-logo" src="/assets/branding/labor-airy-swash.png" alt="Labor" width="2021" height="778"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation">${icon('menu')}</button>
    <nav id="primary-navigation" aria-label="Main navigation">${navItems.map(([id,label]) => `<a href="#${id}"${id==='about'?' aria-current="location"':''}>${label}</a>`).join('')}</nav>
  </div></header>
  <main id="main">
    <section class="section about-section" id="about" aria-labelledby="about-heading">
      <div class="container about-grid">
        <div class="profile">
          ${portrait ? `<img class="portrait" src="${escape(portrait)}" alt="Portrait of ${escape(p.name)}" width="240" height="240" fetchpriority="high">` : ''}
          <h1>${escape(p.name)}</h1>
          ${p.nameNative ? `<p class="native-name" lang="zh-Hans">${escape(p.nameNative)}</p>` : ''}
          <p class="role">${escape(p.role)}</p>
          <p class="institution">${link(p.institution,p.institutionUrl)}</p>
          <div class="social-links" aria-label="Profile links">
            ${email ? `<a href="${escape(email)}" aria-label="Email ${escape(p.name)}">${icon('mail')}</a>` : ''}
            ${github ? `<a href="${escape(github)}" aria-label="GitHub profile">${icon('github')}</a>` : ''}
            ${p.scholar && safeUrl(p.scholar) ? `<a href="${escape(safeUrl(p.scholar))}" aria-label="Google Scholar profile" title="Google Scholar">${icon('education')}</a>` : ''}
            ${[['dblp','DBLP'],['orcid','ORCID'],['linkedin','LinkedIn']].map(([key,label])=>p[key] && safeUrl(p[key]) ? `<a href="${escape(safeUrl(p[key]))}" aria-label="${label} profile" title="${label}">${icon(key)}</a>` : '').join('')}
            ${p.cv && safeUrl(p.cv) ? link('CV',p.cv) : ''}
          </div>
        </div>
        <div class="about-copy">
          <h2 id="about-heading">About Me</h2>
          <div class="biography">${(p.bio || []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>
          <div class="background-grid">
            <div><h3>Research interests</h3><ul class="interests">${(p.interests || []).map(interest=>`<li>${escape(interest)}</li>`).join('')}</ul>${p.advisor?.name ? `<div class="advisor"><h3>Advisor</h3><div class="advisor-details"><p class="advisor-name">${link(p.advisor.name,p.advisor.url)}</p>${p.advisor.position ? `<p class="advisor-position">${escape(p.advisor.position)}</p>` : ''}${p.advisor.institution ? `<p class="advisor-institution">${escape(p.advisor.institution)}</p>` : ''}</div></div>` : ''}</div>
            <div id="education"><h3>Education</h3><ul class="education">${(p.education || []).map(item=>`<li>${icon('education')}<div><p class="degree">${escape(item.degree)}</p><p class="education-detail">${escape(item.institution)}<br>${escape(item.period)}</p></div></li>`).join('')}</ul>${contentChecklist(site,'education')}</div>
          </div>
          ${contentChecklist(site,'about')}
        </div>
      </div>
    </section>
    ${outlineSection(site,'news','news','News')}
    <section class="section publications-section" id="publications" aria-labelledby="publications-heading">
      <div class="container section-grid"><div class="section-heading"><h2 id="publications-heading">Publications</h2></div>
      <div class="section-content">${publications.length ? `<p class="publication-legend">* Equal contribution · † Corresponding author</p>${publicationList(publications,p.name)}` : `<div class="empty-state"><p>Publication details will be added soon.</p><p class="muted">Selected papers and research contributions.</p></div>`}${contentChecklist(site,'publications')}</div></div>
    </section>
    ${outlineSection(site,'honors','honors','Honors and Awards')}
    ${outlineSection(site,'internships','internships','Internships')}
    ${outlineSection(site,'collaborations','collaborations','Collaborative Projects')}
    <section class="section contact-section" id="contact" aria-labelledby="contact-heading">
      <div class="container section-grid"><div class="section-heading"><h2 id="contact-heading">Contact</h2></div>
      <div class="section-content"><ul class="contact-list">
        ${email ? `<li>${icon('mail')}<a href="${escape(email)}">${escape(p.email)}</a></li>` : ''}
        ${secondaryEmail ? `<li>${icon('mail')}<a href="${escape(secondaryEmail)}">${escape(p.secondaryEmail)}</a></li>` : ''}
        ${github ? `<li>${icon('github')}<a href="${escape(github)}">${escape(github.replace(/^https?:\/\//,''))}</a></li>` : ''}
      </ul>${contentChecklist(site,'contact')}</div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="container"><p>© ${new Date().getUTCFullYear()} ${escape(p.name)}</p><a href="#about" aria-label="Back to top">Back to top <span aria-hidden="true">↑</span></a></div></footer>
</body>
</html>`;
}
