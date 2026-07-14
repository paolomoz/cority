/*
 * Cority chrome — code-owned header. English chrome; the language switcher drives
 * Google's website-translate element (the same engine the source's GTranslate plugin
 * uses) for client-side translation on the same URL. The choice persists in the
 * `googtrans` cookie so it re-applies on every page. Machine-translated locale pages
 * under content/<code>/ are retained for review only — they are NOT the mechanism.
 */
const NAV = [
  ['Cortex AI', '/cortex-ai'],
  ['Platform', '/corityone'],
  ['Solutions', '/corityone/compliance-management-software'],
  ['Industries', '/industries'],
  ['Resources', '/resources'],
  ['About Us', '/our-story'],
];
const LANGS = [
  ['en', 'English'], ['ar', 'العربية'], ['fr', 'Français'], ['de', 'Deutsch'],
  ['it', 'Italiano'], ['pt', 'Português'], ['es', 'Español'],
];
const RTL = new Set(['ar']);
const INCLUDED = 'ar,fr,de,it,pt,es';

function currentLang() {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/(\w+)/);
  return m ? m[1] : 'en';
}

function setGoogTransCookie(code) {
  const host = window.location.hostname;
  const root = host.replace(/^www\./, '');
  const val = code === 'en' ? '' : `/en/${code}`;
  const expire = code === 'en' ? ';expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
  [';path=/', `;path=/;domain=${host}`, `;path=/;domain=.${root}`].forEach((scope) => {
    document.cookie = `googtrans=${val}${scope}${expire}`;
  });
}

function loadEngine() {
  if (document.getElementById('google-translate-engine')) return;
  const holder = document.createElement('div');
  holder.id = 'google_translate_element';
  holder.className = 'notranslate';
  holder.style.display = 'none';
  document.body.append(holder);
  window.googleTranslateElementInit = () => {
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: INCLUDED, autoDisplay: false },
      'google_translate_element',
    );
  };
  const s = document.createElement('script');
  s.id = 'google-translate-engine';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.append(s);
}

function applyLang(code) {
  if (code === 'en') { setGoogTransCookie('en'); window.location.reload(); return; }
  setGoogTransCookie(code);
  document.documentElement.dir = RTL.has(code) ? 'rtl' : 'ltr';
  const combo = document.querySelector('.goog-te-combo');
  if (combo) { combo.value = code; combo.dispatchEvent(new Event('change')); } else window.location.reload();
}

export default async function decorate(block) {
  const loc = currentLang();
  if (RTL.has(loc)) document.documentElement.dir = 'rtl';
  const navItems = NAV.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');
  const options = LANGS.map(([code, name]) => `<option value="${code}"${code === loc ? ' selected' : ''}>${name}</option>`).join('');

  block.innerHTML = `
<div class="utility" role="region" aria-label="Announcements and language">
  <div class="wrap">
    <p><span class="story-tag">Customer story</span>How Aptiv cut workplace incidents in half. <a href="/customer-stories-1/aptiv-environmental-software-case-study">The Story</a></p>
    <div class="lang notranslate">
      <select class="lang-select" aria-label="Select language">${options}</select>
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
    <nav class="primary" id="primary-nav" aria-label="Primary"><ul>${navItems}</ul></nav>
    <a class="btn btn-primary header-cta" href="/get-a-demo">Get a Demo</a>
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

  block.querySelector('.lang-select').addEventListener('change', (e) => applyLang(e.target.value));

  loadEngine();
}
