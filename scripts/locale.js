/*
 * locale.js — locale routing + chrome labels for the language switcher.
 * Locale is the first path segment when it's a known code (/fr/…, /de/…);
 * default (no prefix) is English. Chrome (header/footer) reads LABELS[locale]
 * with graceful fallback to en for not-yet-translated locales.
 */
export const LOCALES = ['en', 'ar', 'fr', 'de', 'it', 'pt', 'es'];
export const RTL = new Set(['ar']);

export function currentLocale() {
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(seg) && seg !== 'en' ? seg : 'en';
}

// path without any locale prefix (always starts with /)
export function basePath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (LOCALES.includes(parts[0]) && parts[0] !== 'en') parts.shift();
  return `/${parts.join('/')}`;
}

// route the current page to another locale
export function localeHref(code, base = basePath()) {
  const clean = base === '/' ? '' : base;
  return code === 'en' ? (clean || '/') : `/${code}${clean}`;
}

// chrome labels per locale (en canonical; add locales as they're translated)
export const LABELS = {
  en: {
    nav: [['Cortex AI', 'https://www.cority.com/cortex-ai/'], ['Platform', '/corityone'], ['Solutions', '/corityone/compliance-management-software'], ['Industries', '/industries'], ['Resources', '/resources'], ['About Us', '/our-story']],
    cta: 'Get a Demo',
    story: 'Customer story',
    storyText: 'How Aptiv cut workplace incidents in half.',
    storyLink: 'The Story',
    subscribe: 'Subscribe',
    subscribeMsg: 'Subscribe for EHS & ESG insights, event invites, and industry updates!',
  },
  fr: {
    nav: [['Cortex AI', 'https://www.cority.com/cortex-ai/'], ['Plateforme', '/corityone'], ['Solutions', '/corityone/compliance-management-software'], ['Secteurs', '/industries'], ['Ressources', '/resources'], ['À propos', '/our-story']],
    cta: 'Demander une démo',
    story: 'Témoignage client',
    storyText: 'Comment Aptiv a réduit de moitié ses incidents.',
    storyLink: 'Découvrir',
    subscribe: "S'abonner",
    subscribeMsg: 'Abonnez-vous aux actualités EHS & ESG, invitations et mises à jour du secteur !',
  },
};
export const labelsFor = (loc) => LABELS[loc] || LABELS.en;
