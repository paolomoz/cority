/*
 * spectrum — imaged spectrum columns (home risk-spectrum).
 * Rows: [h2] · seg rows [thumb img | p<strong> kicker + h3 > a].
 */
const CATS = {
  corityone: 'one',
  environmental: 'env',
  health: 'health',
  safety: 'safety',
  quality: 'quality',
  sustainability: 'sus',
};

export default function decorate(block) {
  let heading = null;
  const segs = [];

  [...block.children].forEach((row) => {
    if (row.querySelector('h2')) {
      heading = row.querySelector('h2');
      return;
    }
    const img = row.querySelector('img');
    const kicker = row.querySelector('p strong');
    const h3 = row.querySelector('h3');
    if (h3) segs.push({ img, kicker, h3 });
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const grid = document.createElement('div');
  grid.className = 'grid';

  segs.forEach(({ img, kicker, h3 }) => {
    const link = h3.querySelector('a');
    const cat = CATS[(kicker ? kicker.textContent : '').trim().toLowerCase()] || 'one';
    const a = document.createElement('a');
    a.className = `seg s-${cat}`;
    if (link) a.href = link.getAttribute('href');
    const bar = document.createElement('span');
    bar.className = 'bar';
    bar.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'inner';
    if (img) {
      img.className = 'thumb';
      img.setAttribute('loading', 'lazy');
      inner.append(img);
    }
    if (kicker) {
      const k = document.createElement('span');
      k.className = `kicker k-${cat}`;
      k.textContent = kicker.textContent;
      inner.append(k);
    }
    const h = document.createElement('h3');
    h.textContent = h3.textContent;
    inner.append(h);
    const go = document.createElement('span');
    go.className = 'go';
    go.setAttribute('aria-hidden', 'true');
    go.textContent = '➜';
    inner.append(go);
    a.append(bar, inner);
    grid.append(a);
  });

  wrap.append(grid);
  block.append(wrap);
}
