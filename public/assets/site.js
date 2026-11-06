const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
document.documentElement.classList.add('js');

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-shell')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

const navLinks = [...navigation.querySelectorAll('a')];
const sections = [...document.querySelectorAll('main > section')];
let navigationFrame = 0;
function updateActiveSection() {
  navigationFrame = 0;
  const threshold = document.querySelector('.site-header').getBoundingClientRect().bottom + 28;
  const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
  const active = atBottom ? sections.at(-1) : sections.findLast(section=>section.getBoundingClientRect().top <= threshold) || sections[0];
  for (const anchor of navLinks) {
    if (anchor.hash === `#${active.id}`) anchor.setAttribute('aria-current','location');
    else anchor.removeAttribute('aria-current');
  }
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateActiveSection);
}
window.addEventListener('scroll', scheduleNavigationUpdate, {passive:true});
window.addEventListener('resize', scheduleNavigationUpdate);
window.addEventListener('load', scheduleNavigationUpdate);
updateActiveSection();

const filters = document.querySelector('.project-filters');
if (filters) {
  const projects = [...document.querySelectorAll('[data-project]')];
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    let count = 0;
    for (const item of projects) {
      item.hidden = Boolean(category) && !JSON.parse(item.dataset.categories).includes(category);
      if (!item.hidden) count += 1;
    }
    filters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item === button)));
    document.querySelector('#project-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown${category ? ` in ${category}` : ''}.`;
  });
}
