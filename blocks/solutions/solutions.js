/*
 * solutions — solution ledger rows (industry solutions).
 * Rows: head [h2 + lede p] · solution rows [h3 + p | img] · ask [p > a].
 */
export default function decorate(block) {
  let head = null;
  let ask = null;
  const rows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      rows.push(cells);
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
      if (el.tagName === 'P') el.className = 'lede-c';
      wrap.append(el);
    });
  }

  rows.forEach(([copy, media]) => {
    const div = document.createElement('div');
    div.className = 'sol-row';
    div.append(...copy.childNodes);
    const img = media && media.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      div.append(img);
    }
    wrap.append(div);
  });

  if (ask) {
    ask.classList.add('ask');
    const p = document.createElement('p');
    p.className = 'askrow';
    p.append(ask);
    wrap.append(p);
  }
  block.append(wrap);
}
