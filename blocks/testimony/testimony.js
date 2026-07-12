/*
 * testimony — vertical reveal cards, blue reveal on hover/focus (home customer-quote).
 * Rows: head [p<strong> kicker + h2] · card rows
 * [bw img, blue img, logo img | quote p + attribution p].
 */

function buildCite(p) {
  const cite = document.createElement('cite');
  const strong = p.querySelector('strong');
  if (strong) {
    cite.append(strong.textContent);
    cite.append(document.createElement('br'));
    strong.remove();
    cite.append(p.textContent.trim());
  } else {
    cite.append(p.textContent.trim());
  }
  return cite;
}

export default function decorate(block) {
  const head = [];
  const cards = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1 && row.querySelector('img')) {
      cards.push(cells);
    } else {
      head.push(cells[0]);
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  head.forEach((cell) => {
    if (!cell) return;
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P') {
        const strong = el.querySelector(':scope > strong:only-child');
        if (strong) {
          el.className = 'meta-rail';
          el.textContent = strong.textContent;
        }
      }
      wrap.append(el);
    });
  });

  const grid = document.createElement('div');
  grid.className = 't-grid';

  cards.forEach(([media, copy]) => {
    const fig = document.createElement('figure');
    fig.className = 't-card';
    fig.setAttribute('tabindex', '0');
    const imgs = [...media.querySelectorAll('img')];
    const roles = ['bw', 'blue', 'clientlogo'];
    imgs.forEach((img, i) => {
      img.className = roles[i] || '';
      img.setAttribute('loading', 'lazy');
      if (roles[i] === 'blue') img.setAttribute('alt', '');
    });
    if (imgs[0]) fig.append(imgs[0]);
    if (imgs[1]) fig.append(imgs[1]);
    const veil = document.createElement('span');
    veil.className = 'veil';
    veil.setAttribute('aria-hidden', 'true');
    fig.append(veil);
    if (imgs[2]) fig.append(imgs[2]);

    const story = document.createElement('div');
    story.className = 'story';
    const qmark = document.createElement('span');
    qmark.className = 'qmark';
    qmark.setAttribute('aria-hidden', 'true');
    qmark.textContent = '“';
    story.append(qmark);
    const ps = [...copy.querySelectorAll('p')];
    const bq = document.createElement('blockquote');
    if (ps[0]) bq.append(...ps[0].childNodes);
    story.append(bq);
    if (ps[1]) story.append(buildCite(ps[1]));
    fig.append(story);
    grid.append(fig);
  });

  wrap.append(grid);
  block.append(wrap);
}
