/*
 * resources — front-page cross-promo (home + safety-cloud `light` variant).
 * Rows: [h2] · lead [img | kicker p<strong> + h3 + p>a] · item rows (same shape).
 * First content row renders as the lead story; the rest as index items.
 */
const CATS = {
  blog: 'one',
  news: 'one',
  ebooks: 'health',
  reports: 'quality',
  webinars: 'sus',
};

function buildCopy(cell) {
  const div = document.createElement('div');
  [...cell.children].forEach((el) => {
    if (el.tagName === 'P') {
      const strong = el.querySelector(':scope > strong:only-child');
      const a = el.querySelector('a');
      if (strong && !a) {
        const label = strong.textContent.trim();
        const cat = CATS[label.toLowerCase()] || 'one';
        const k = document.createElement('span');
        k.className = `kicker k-${cat}`;
        k.textContent = label;
        div.append(k);
        return;
      }
      if (a) a.classList.add('typed');
    }
    div.append(el);
  });
  return div;
}

export default function decorate(block) {
  let heading = null;
  const stories = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('h2') && cells.length === 1) {
      heading = row.querySelector('h2');
    } else if (cells.length > 1) {
      stories.push(cells);
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  stories.forEach(([media, copy], i) => {
    const img = media.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('alt', img.getAttribute('alt') || '');
    }
    const art = document.createElement('article');
    if (i === 0) {
      art.className = 'lead-story';
      if (img) art.append(img);
      art.append(buildCopy(copy));
      wrap.append(art);
      const index = document.createElement('div');
      index.className = 'res-index';
      wrap.append(index);
    } else {
      art.className = 'res-item';
      if (img) art.append(img);
      art.append(buildCopy(copy));
      wrap.querySelector('.res-index').append(art);
    }
  });

  block.append(wrap);
}
