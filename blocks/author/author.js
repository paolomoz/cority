/*
 * author — article attribution box (+ optional prev/next row).
 * Row with an image = the author box ([logo/portrait | name (strong) + bio]).
 * Row of two link cells = prev/next navigation (styled as canon link-asks).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.querySelector('img')) {
      row.className = 'bio';
      const strong = row.querySelector('strong');
      if (strong) {
        const holder = strong.closest('p') || strong;
        const nm = document.createElement('p');
        nm.className = 'nm';
        nm.textContent = strong.textContent.trim();
        holder.replaceWith(nm);
      }
    } else if (row.querySelector('a')) {
      const nav = document.createElement('nav');
      nav.className = 'pn-nav';
      nav.setAttribute('aria-label', 'More articles');
      [...row.querySelectorAll('a')].forEach((a) => {
        a.classList.add('ask');
        nav.append(a);
      });
      row.replaceWith(nav);
    }
  });
}
