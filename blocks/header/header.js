/*
 * Cority chrome — code-owned header (stardust canon: header.html d34c5991).
 * Utility bar + primary nav + demo CTA. Mobile nav is a CSS checkbox hack;
 * JS only syncs aria-expanded. In-scope pages link root-relative; everything
 * else stays absolute to the live origin (archetype-scope link policy).
 */
const CHROME = `
<div class="utility" role="region" aria-label="Announcements and language">
  <div class="wrap">
    <p><span class="story-tag">Customer story</span>How Aptiv cut workplace incidents in half. <a href="/customer-stories-1/aptiv-environmental-software-case-study">The Story</a></p>
    <ul class="langs" aria-label="Language">
      <li><a href="#" hreflang="ar">AR</a></li>
      <li><a href="#" hreflang="en" aria-current="true">EN</a></li>
      <li><a href="#" hreflang="fr">FR</a></li>
      <li><a href="#" hreflang="de">DE</a></li>
      <li><a href="#" hreflang="it">IT</a></li>
      <li><a href="#" hreflang="pt">PT</a></li>
      <li><a href="#" hreflang="es">ES</a></li>
    </ul>
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
        <li><a href="https://www.cority.com/cortex-ai/">Cortex AI</a></li>
        <li><a href="https://www.cority.com/corityone/">Platform</a></li>
        <li><a href="https://www.cority.com/corityone/compliance-management-software/">Solutions</a></li>
        <li><a href="https://www.cority.com/industries/">Industries</a></li>
        <li><a href="https://www.cority.com/resources/">Resources</a></li>
        <li><a href="/our-story">About Us</a></li>
      </ul>
    </nav>
    <a class="btn btn-primary header-cta" href="https://www.cority.com/get-a-demo/">Get a Demo</a>
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
}
