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

function publication(item) {
  const imageUrl = safeUrl(item.image, { image:true });
  const titleUrl = safeUrl(item.url) || safeUrl(item.links?.[0]?.url);
  return `<article class="publication${imageUrl ? ' has-image' : ''}">
    <div class="publication-copy"><h3>${link(item.title, titleUrl)}</h3>
    ${item.authors?.length ? `<p class="authors">${escape(item.authors.join(', '))}</p>` : ''}
    <p class="venue">${escape([item.venue, item.year].filter(Boolean).join(' · '))}</p>
    ${item.description ? `<p class="publication-description">${escape(item.description)}</p>` : ''}
    ${resources(item.links)}</div>
    ${imageUrl ? `<img class="publication-image" src="${escape(imageUrl)}" alt="${escape(item.imageAlt || item.title)}" width="180" height="120" loading="lazy">` : ''}
  </article>`;
}

function project(item) {
  const imageUrl = safeUrl(item.image, { image:true });
  return `<article class="project" data-project data-categories="${escape(JSON.stringify(item.categories || []))}">
    ${imageUrl ? `<img class="project-image" src="${escape(imageUrl)}" alt="${escape(item.imageAlt || item.title)}" width="600" height="400" loading="lazy">` : ''}
    <div class="project-copy"><h3>${link(item.title, item.url)}</h3>
    ${item.description ? `<p>${escape(item.description)}</p>` : ''}${resources(item.links)}</div>
  </article>`;
}

export function renderSite(site) {
  const {profile:p, publications = [], projects = []} = site;
  const categories = [...new Set(projects.flatMap(item => item.categories || []))];
  const navItems = [['about','About'],['publications','Publications'],['projects','Projects'],['contact','Contact']];
  const email = safeUrl(`mailto:${p.email}`);
  const github = safeUrl(p.github);
  const portrait = safeUrl(p.portrait, { image:true });
  const canonical = safeUrl(site.url);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(p.name)} | ${escape(p.institution)}</title>
  <meta name="description" content="${escape(site.description)}">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${escape(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(p.name)} — Academic Homepage">
  <meta property="og:description" content="${escape(site.description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preload" href="/assets/fonts/roboto-400.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/fonts/montserrat-400.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container nav-shell">
    <a class="brand" href="#about">${escape(p.name)}</a>
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
            ${p.scholar && safeUrl(p.scholar) ? link('Scholar',p.scholar) : ''}
            ${p.cv && safeUrl(p.cv) ? link('CV',p.cv) : ''}
          </div>
        </div>
        <div class="about-copy">
          <h2 id="about-heading">About Me</h2>
          <div class="biography">${(p.bio || []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>
          <div class="background-grid">
            <div><h3>Research interests</h3><ul class="interests">${(p.interests || []).map(interest=>`<li>${escape(interest)}</li>`).join('')}</ul></div>
            <div><h3>Education</h3><ul class="education">${(p.education || []).map(item=>`<li>${icon('education')}<div><p class="degree">${escape(item.degree)}</p><p class="education-detail">${escape(item.institution)}<br>${escape(item.period)}</p></div></li>`).join('')}</ul></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section publications-section" id="publications" aria-labelledby="publications-heading">
      <div class="container section-grid"><div class="section-heading"><h2 id="publications-heading">Publications</h2></div>
      <div class="section-content">${publications.length ? `<div class="publication-list">${publications.map(publication).join('')}</div>` : `<div class="empty-state"><p>Publication details will be added soon.</p><p class="muted">Selected papers and research contributions.</p></div>`}</div></div>
    </section>
    <section class="section projects-section" id="projects" aria-labelledby="projects-heading">
      <div class="container section-grid"><div class="section-heading"><h2 id="projects-heading">Projects</h2></div>
      <div class="section-content">${projects.length ? `
        ${categories.length ? `<div class="project-filters" role="group" aria-label="Filter projects"><button type="button" data-filter="" aria-pressed="true">All</button>${categories.map(category=>`<button type="button" data-filter="${escape(category)}" aria-pressed="false">${escape(category)}</button>`).join('')}</div>` : ''}
        <p class="sr-only" id="project-status" role="status" aria-live="polite"></p>
        <div class="project-grid">${projects.map(project).join('')}</div>` : `<div class="empty-state"><p>Project details will be added soon.</p><p class="muted">Research projects, code, and demonstrations.</p></div>`}</div></div>
    </section>
    <section class="section contact-section" id="contact" aria-labelledby="contact-heading">
      <div class="container section-grid"><div class="section-heading"><h2 id="contact-heading">Contact</h2></div>
      <div class="section-content"><ul class="contact-list">
        ${email ? `<li>${icon('mail')}<a href="${escape(email)}">${escape(p.email)}</a></li>` : ''}
        ${github ? `<li>${icon('github')}<a href="${escape(github)}">${escape(github.replace(/^https?:\/\//,''))}</a></li>` : ''}
      </ul></div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="container"><p>© ${new Date().getUTCFullYear()} ${escape(p.name)}</p><a href="#about" aria-label="Back to top">Back to top <span aria-hidden="true">↑</span></a></div></footer>
</body>
</html>`;
}
