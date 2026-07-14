/*
 * Cority chrome — code-owned, locale-aware header. Chrome renders in the current
 * locale (locale.js LABELS, fallback en); the switcher routes to the locale path;
 * hreflang alternates + <html lang/dir> set (RTL-ready for Arabic). Internal
 * links are locale-prefixed; externals stay absolute.
 */
import {
  LOCALES, RTL, currentLocale, basePath, localeHref, labelsFor,
} from '../../scripts/locale.js';

const LANGNAMES = {
  en: 'English', ar: 'العربية', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', es: 'Español',
};

export default async function decorate(block) {
  const loc = currentLocale();
  const L = labelsFor(loc);
  const base = basePath();
  const pre = (href) => (href.startsWith('/') && loc !== 'en' ? `/${loc}${href === '/' ? '' : href}` : href);

  document.documentElement.lang = loc;
  document.documentElement.dir = RTL.has(loc) ? 'rtl' : 'ltr';

  // hreflang alternates (+ x-default) for the language switcher / SEO
  const { head } = document;
  [...LOCALES, 'x-default'].forEach((code) => {
    const l = document.createElement('link');
    l.rel = 'alternate';
    l.hreflang = code === 'x-default' ? 'x-default' : code;
    l.href = localeHref(code === 'x-default' ? 'en' : code, base);
    head.append(l);
  });

  const navItems = L.nav.map(([label, href]) => `<li><a href="${pre(href)}">${label}</a></li>`).join('');
  const langItems = LOCALES.map((code) => `<li role="none"><a role="menuitem" class="lang-item" data-lang="${code}" lang="${code}" href="${localeHref(code, base)}"${code === loc ? ' aria-current="true"' : ''}>${LANGNAMES[code]}</a></li>`).join('');

  block.innerHTML = `
<div class="utility" role="region" aria-label="Announcements and language">
  <div class="wrap">
    <p><span class="story-tag">${L.story}</span>${L.storyText} <a href="${pre('/customer-stories-1/aptiv-environmental-software-case-study')}">${L.storyLink}</a></p>
    <div class="lang">
      <button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select language">
        <span class="lang-current">${loc.toUpperCase()}</span><span class="lang-caret" aria-hidden="true">▾</span>
      </button>
      <ul class="lang-menu" role="menu" hidden>${langItems}</ul>
    </div>
  </div>
</div>
<div class="site">
  <div class="wrap">
    <a class="logo" href="${pre('/')}" aria-label="Cority — home">
      <img src="https://www.cority.com/wp-content/uploads/2025/06/Cority_Logo_RGB_orange.svg" alt="Cority" width="120" height="40">
    </a>
    <input type="checkbox" id="nav-toggle" class="burger" aria-label="Open menu">
    <label class="burger-btn" for="nav-toggle" aria-hidden="true">☰</label>
    <nav class="primary" id="primary-nav" aria-label="Primary"><ul>${navItems}</ul></nav>
    <a class="btn btn-primary header-cta" href="${pre('/get-a-demo')}">${L.cta}</a>
  </div>
</div>`;

  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  if (!document.querySelector('a.skip')) {
    const skip = document.createElement('a');
    skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  const toggle = block.querySelector('.burger');
  toggle.setAttribute('aria-controls', 'primary-nav');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('change', () => toggle.setAttribute('aria-expanded', String(toggle.checked)));

  // language dropdown (items are real locale links — navigation does the switch)
  const lang = block.querySelector('.lang');
  const langBtn = lang.querySelector('.lang-btn');
  const menu = lang.querySelector('.lang-menu');
  const items = [...menu.querySelectorAll('.lang-item')];
  const open = (state) => { langBtn.setAttribute('aria-expanded', String(state)); menu.hidden = !state; if (state) items.find((i) => i.getAttribute('aria-current') === 'true')?.focus(); };
  langBtn.addEventListener('click', () => open(menu.hidden));
  document.addEventListener('click', (e) => { if (!lang.contains(e.target)) open(false); });
  menu.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { open(false); langBtn.focus(); } else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  });
}
