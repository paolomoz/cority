/*
 * toc — sticky article rail. Pairs with the `.section.toc-layout` section
 * style: this block is the rail, the article body is prose default content
 * in the SAME section. Links are auto-built from that prose's h2s; slug ids
 * are generated at decorate time. Labels over 64 chars are shortened with an
 * ellipsis (canon rail density).
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function shorten(text) {
  if (text.length <= 64) return text;
  return `${text.slice(0, 61).replace(/\s+\S*$/, '')} …`;
}

export default function decorate(block) {
  const label = block.textContent.trim() || 'On this page';
  const section = block.closest('.section');
  const headings = section
    ? [...section.querySelectorAll('.default-content-wrapper h2')]
    : [];
  block.textContent = '';
  if (!headings.length) return;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', label);
  const rail = document.createElement('p');
  rail.className = 'meta-rail';
  rail.textContent = label;
  const ol = document.createElement('ol');
  headings.forEach((h2) => {
    if (!h2.id) {
      let id = slugify(h2.textContent.trim()) || 'section';
      let n = 1;
      while (document.getElementById(id)) {
        n += 1;
        id = `${slugify(h2.textContent.trim())}-${n}`;
      }
      h2.id = id;
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h2.id}`;
    a.textContent = shorten(h2.textContent.trim());
    li.append(a);
    ol.append(li);
  });
  nav.append(rail, ol);
  block.append(nav);
}
