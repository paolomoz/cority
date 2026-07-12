/*
 * quote — attributed customer quotes.
 * Default (ledger, safety-cloud): head [p<strong> kicker + h2] · quote rows
 *   [quote p + attribution p<strong>Name</strong> role | logo img].
 * Variant `navy` (industry): head [p<strong> kicker] · one quote row
 *   [quote p + attribution p] — feature quote on navy, single-line cite.
 */

function buildCite(p, singleLine) {
  const cite = document.createElement('cite');
  const strong = p.querySelector('strong');
  if (strong && !singleLine) {
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
  const navy = block.classList.contains('navy');
  const head = [];
  const quotes = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hasQuoteShape = cells[0] && cells[0].querySelectorAll('p').length > 1;
    if (cells.length > 1 || (hasQuoteShape && !row.querySelector('h2'))) {
      quotes.push(cells);
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

  quotes.forEach(([copy, media]) => {
    const fig = document.createElement('figure');
    fig.className = navy ? 'feature' : 'q-row';
    const ps = [...copy.querySelectorAll('p')];
    const bq = document.createElement('blockquote');
    if (ps[0]) bq.append(...ps[0].childNodes);
    if (!navy) {
      const qm = document.createElement('span');
      qm.className = 'qm';
      qm.setAttribute('aria-hidden', 'true');
      qm.textContent = '“';
      fig.append(qm);
    }
    fig.append(bq);
    const fc = document.createElement('figcaption');
    if (ps[1]) fc.append(buildCite(ps[1], navy));
    const logo = media && media.querySelector('img');
    if (logo) {
      logo.setAttribute('loading', 'lazy');
      fc.append(logo);
    }
    fig.append(fc);
    wrap.append(fig);
  });

  block.append(wrap);
}
