/*
 * related — ruled cross-promo index (prototype .rel). Reabsorbs its section
 * head: an h2 row is the band heading; each link row becomes a ruled row
 * with a trailing arrow.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const h2 = row.querySelector('h2');
    const a = row.querySelector('a');
    if (h2) {
      row.replaceWith(h2);
    } else if (a) {
      a.className = 'row';
      const label = document.createElement('span');
      label.textContent = a.textContent.trim();
      const go = document.createElement('span');
      go.className = 'go';
      go.setAttribute('aria-hidden', 'true');
      go.textContent = '➜';
      a.textContent = '';
      a.append(label, go);
      row.replaceWith(a);
    } else {
      row.remove();
    }
  });
}
