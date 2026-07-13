/*
 * Cority chrome — code-owned header. Utility bar + primary nav + demo CTA.
 * All internal links are root-relative to the migrated site. Mobile nav is a
 * CSS checkbox hack (JS syncs aria-expanded). Language switcher is an
 * accessible dropdown (below). NOTE: this migration is English-only, so
 * non-EN options set the preference but have no translated target to route to
 * until localized content exists.
 */
const LANGS = [
  ['en', 'EN', 'English'], ['ar', 'AR', 'العربية'], ['fr', 'FR', 'Français'],
  ['de', 'DE', 'Deutsch'], ['it', 'IT', 'Italiano'], ['pt', 'PT', 'Português'],
  ['es', 'ES', 'Español'],
];
const langItems = LANGS.map(([code, , name]) => `<li role="none"><button role="menuitem" type="button" class="lang-item" data-lang="${code}" lang="${code}"${code === 'en' ? ' aria-current="true"' : ''}>${name}</button></li>`).join('');
const CHROME = `
<div class="utility" role="region" aria-label="Announcements and language">
  <div class="wrap">
    <p><span class="story-tag">Customer story</span>How Aptiv cut workplace incidents in half. <a href="/customer-stories-1/aptiv-environmental-software-case-study">The Story</a></p>
    <div class="lang">
      <button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select language">
        <span class="lang-current">EN</span><span class="lang-caret" aria-hidden="true">▾</span>
      </button>
      <ul class="lang-menu" role="menu" hidden>${langItems}</ul>
    </div>
  </div>
</div>
<div class="site">
  <div class="wrap">
    <a class="logo" href="/" aria-label="Cority — home">
      <img src="https://www.cority.com/wp-content/uploads/2025/06/Cority_Logo_RGB_orange.svg" alt="Cority" width="120" height="40">
    </a>
    <input type="checkbox" id="nav-toggle" class="burger" aria-label="Open menu">
    <label class="burger-btn" for="nav-toggle" aria-hidden="true">☰</label>
    <nav class="primary" id="primary-nav" aria-label="Primary">
      <ul>
        <li><a href="/cortex-ai">Cortex AI</a></li>
        <li><a href="/corityone">Platform</a></li>
        <li><a href="/corityone/compliance-management-software">Solutions</a></li>
        <li><a href="/industries">Industries</a></li>
        <li><a href="/resources">Resources</a></li>
        <li><a href="/our-story">About Us</a></li>
      </ul>
    </nav>
    <a class="btn btn-primary header-cta" href="/get-a-demo">Get a Demo</a>
  </div>
</div>
`;

export default async function decorate(block) {
  block.innerHTML = CHROME;

  // skip link + main landmark
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  if (!document.querySelector('a.skip')) {
    const skip = document.createElement('a');
    skip.className = 'skip';
    skip.href = '#main';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  // aria sync for the CSS-only burger
  const toggle = block.querySelector('.burger');
  toggle.setAttribute('aria-controls', 'primary-nav');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('change', () => {
    toggle.setAttribute('aria-expanded', String(toggle.checked));
  });

  // language switcher — accessible dropdown
  const lang = block.querySelector('.lang');
  const btn = lang.querySelector('.lang-btn');
  const menu = lang.querySelector('.lang-menu');
  const current = lang.querySelector('.lang-current');
  const items = [...menu.querySelectorAll('.lang-item')];

  const open = (state) => {
    btn.setAttribute('aria-expanded', String(state));
    menu.hidden = !state;
    if (state) items.find((i) => i.getAttribute('aria-current') === 'true')?.focus();
  };
  btn.addEventListener('click', () => open(menu.hidden));
  document.addEventListener('click', (e) => { if (!lang.contains(e.target)) open(false); });
  menu.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { open(false); btn.focus(); } else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  });

  // restore persisted choice
  let saved = 'en';
  try { saved = localStorage.getItem('cority-lang') || 'en'; } catch (e) { /* no-op */ }
  const setLang = (code) => {
    items.forEach((it) => it.removeAttribute('aria-current'));
    const pick = items.find((it) => it.dataset.lang === code) || items[0];
    pick.setAttribute('aria-current', 'true');
    current.textContent = pick.dataset.lang.toUpperCase();
    document.documentElement.lang = pick.dataset.lang;
  };
  setLang(saved);

  items.forEach((it) => it.addEventListener('click', () => {
    setLang(it.dataset.lang);
    try { localStorage.setItem('cority-lang', it.dataset.lang); } catch (e) { /* no-op */ }
    open(false);
    btn.focus();
    // English-only migration: no localized target to navigate to yet. When
    // localized content exists, route here (e.g. `/${code}${path}`).
  }));
}
