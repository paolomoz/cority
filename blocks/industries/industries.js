/*
 * industries — feature + index split (home industries).
 * Rows: [h2] · lead [img + p annot] · item rows [p > a | img].
 */
export default function decorate(block) {
  let heading = null;
  let lead = null;
  const items = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('h2')) {
      heading = row.querySelector('h2');
    } else if (cells.length > 1 && row.querySelector('a')) {
      items.push(cells);
    } else if (row.querySelector('img')) {
      [lead] = cells;
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const split = document.createElement('div');
  split.className = 'ind-split';

  if (lead) {
    const fig = document.createElement('figure');
    fig.className = 'ind-lead';
    const img = lead.querySelector('img');
    img.setAttribute('loading', 'lazy');
    fig.append(img);
    const cap = lead.querySelector('p');
    if (cap) {
      const fc = document.createElement('figcaption');
      fc.className = 'annot';
      fc.append(...cap.childNodes);
      fig.append(fc);
    }
    split.append(fig);
  }

  const ol = document.createElement('ol');
  ol.className = 'ind-index';
  items.forEach(([copy, media]) => {
    const src = copy.querySelector('a');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = src.getAttribute('href');
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = src.textContent;
    a.append(nm);
    const img = media && media.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('alt', '');
      a.append(img);
    }
    const go = document.createElement('span');
    go.className = 'go';
    go.setAttribute('aria-hidden', 'true');
    go.textContent = '➜';
    a.append(go);
    li.append(a);
    ol.append(li);
  });
  split.append(ol);

  wrap.append(split);
  block.append(wrap);
}
