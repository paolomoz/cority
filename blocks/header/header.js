/*
 * Cority chrome — code-owned header. English chrome; the language switcher is the
 * GTranslate free widget (client-side Google translation, same URL), mirroring the
 * source site's mechanism (gtranslate, url_structure "none", langs ar/en/fr/de/it/pt/es).
 * Machine-translated locale pages live under content/<code>/ for review only; they
 * are NOT the language mechanism.
 */
const NAV = [
  ['Cortex AI', '/cortex-ai'],
  ['Platform', '/corityone'],
  ['Solutions', '/corityone/compliance-management-software'],
  ['Industries', '/industries'],
  ['Resources', '/resources'],
  ['About Us', '/our-story'],
];
const GT_LANGS = ['en', 'ar', 'fr', 'de', 'it', 'pt', 'es'];

function loadGTranslate() {
  window.gtranslateSettings = window.gtranslateSettings || {
    default_language: 'en',
    native_language_names: true,
    detect_browser_language: false,
    languages: GT_LANGS,
    wrapper_selector: '.gtranslate_wrapper',
    flag_style: '3d',
  };
  if (!document.getElementById('gtranslate-widget-js')) {
    const s = document.createElement('script');
    s.id = 'gtranslate-widget-js';
    s.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
    s.defer = true;
    document.body.append(s);
  }
}

export default async function decorate(block) {
  const navItems = NAV.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');

  block.innerHTML = `
<div class="utility" role="region" aria-label="Announcements and language">
  <div class="wrap">
    <p><span class="story-tag">Customer story</span>How Aptiv cut workplace incidents in half. <a href="/customer-stories-1/aptiv-environmental-software-case-study">The Story</a></p>
    <div class="lang notranslate">
      <div class="gtranslate_wrapper" aria-label="Select language"></div>
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

  loadGTranslate();
}
