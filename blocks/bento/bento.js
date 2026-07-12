/*
 * bento — performance bento on navy (home performance-bento, source anatomy).
 * Rows: [h2] · card rows [h3+p | img] ×3 · quote row [headshot img | quote p + attribution p]
 *       · ask row [p > a].
 */

function splitAttribution(p) {
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
  const spans = ['b-data', 'b-work', 'b-insight'];
  let heading = null;
  const cards = [];
  let quote = null;
  let ask = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('h2')) {
      heading = row.querySelector('h2');
    } else if (row.querySelector('h3')) {
      cards.push(cells);
    } else if (cells.length > 1) {
      quote = cells;
    } else if (row.querySelector('a')) {
      ask = row.querySelector('a');
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const grid = document.createElement('div');
  grid.className = 'bento-grid';

  cards.forEach((cells, i) => {
    const art = document.createElement('article');
    art.className = `bento-card ${spans[i % spans.length]}`;
    const [copy, media] = cells;
    art.append(...copy.childNodes);
    const img = media && media.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      art.append(img);
    }
    grid.append(art);
  });

  if (quote) {
    const fig = document.createElement('figure');
    fig.className = 'bento-quote';
    const headshot = quote[0].querySelector('img');
    if (headshot) {
      headshot.className = 'headshot';
      headshot.setAttribute('loading', 'lazy');
      fig.append(headshot);
    }
    const qmark = document.createElement('span');
    qmark.className = 'qmark';
    qmark.setAttribute('aria-hidden', 'true');
    qmark.textContent = '“';
    fig.append(qmark);
    const ps = [...quote[1].querySelectorAll('p')];
    const bq = document.createElement('blockquote');
    if (ps[0]) bq.append(...ps[0].childNodes);
    fig.append(bq);
    if (ps[1]) {
      const fc = document.createElement('figcaption');
      fc.append(splitAttribution(ps[1]));
      fig.append(fc);
    }
    grid.append(fig);
  }
  wrap.append(grid);

  if (ask) {
    ask.classList.add('ask', 'on-dark');
    const p = document.createElement('p');
    p.className = 'askrow';
    p.append(ask);
    wrap.append(p);
  }
  block.append(wrap);
}
