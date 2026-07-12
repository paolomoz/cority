/*
 * steps — numbered sequence rail (safety-cloud how-it-works).
 * Rows: head [h2 + lede p] · step rows [img | h3 + p] · ask [p > a].
 */
export default function decorate(block) {
  let head = null;
  let ask = null;
  const steps = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      steps.push(cells);
    } else if (row.querySelector('h2')) {
      [head] = cells;
    } else if (row.querySelector('a')) {
      ask = row.querySelector('a');
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (head) {
    [...head.children].forEach((el) => {
      if (el.tagName === 'P') el.className = 'lede-s';
      wrap.append(el);
    });
  }

  const rail = document.createElement('div');
  rail.className = 'step-rail';
  steps.forEach(([media, copy], i) => {
    const col = document.createElement('div');
    col.className = 'step-col';
    const img = media.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('alt', img.getAttribute('alt') || '');
      col.append(img);
    }
    const marker = document.createElement('div');
    marker.className = 'marker';
    const num = document.createElement('span');
    num.className = 'num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = String(i + 1);
    marker.append(num);
    const h3 = copy.querySelector('h3');
    if (h3) marker.append(h3);
    col.append(marker);
    [...copy.children].forEach((el) => col.append(el));
    rail.append(col);
  });
  wrap.append(rail);

  if (ask) {
    ask.classList.add('ask');
    const p = document.createElement('p');
    p.className = 'askrow';
    p.append(ask);
    wrap.append(p);
  }
  block.append(wrap);
}
