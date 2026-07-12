/*
 * capabilities — file-row accordion (safety-cloud capabilities).
 * Rows: [h2] · capability rows [thumb img | h3 + count p | feature ps (+ ask link p) | panel img].
 * Feature ps come in pairs: <p><strong>Title</strong></p> then <p>description</p>.
 */

function buildFeats(cell) {
  const div = document.createElement('div');
  let feat = null;
  [...cell.children].forEach((el) => {
    const strong = el.tagName === 'P' && el.querySelector(':scope > strong:only-child');
    const link = el.querySelector('a');
    if (strong && el.textContent.trim() === strong.textContent.trim()) {
      feat = document.createElement('div');
      feat.className = 'feat';
      const h4 = document.createElement('h4');
      h4.textContent = strong.textContent;
      feat.append(h4);
      div.append(feat);
    } else if (link) {
      link.classList.add('ask');
      el.className = 'explore';
      div.append(el);
      feat = null;
    } else if (feat) {
      feat.append(el);
      feat = null;
    } else {
      div.append(el);
    }
  });
  return div;
}

export default function decorate(block) {
  let heading = null;
  const caps = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && row.querySelector('h2')) {
      heading = row.querySelector('h2');
    } else if (cells.length > 1) {
      caps.push(cells);
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const files = document.createElement('div');
  files.className = 'cap-files';

  caps.forEach((cells, i) => {
    // parse cells by content: name cell has the h3; image-only cells are
    // thumb (first, when two exist) + panel (last); the remainder is feature copy
    const nameCell = cells.find((c) => c.querySelector('h3')) || cells[0];
    const imgCells = cells.filter((c) => c.querySelector('img') && !c.querySelector('h3'));
    const thumbCell = imgCells.length > 1 ? imgCells[0] : null;
    const panelCell = imgCells.length ? imgCells[imgCells.length - 1] : null;
    const featCell = cells.find((c) => c !== nameCell && !imgCells.includes(c));

    const details = document.createElement('details');
    if (i === 0) details.setAttribute('open', '');
    const summary = document.createElement('summary');
    const thumb = thumbCell && thumbCell.querySelector('img');
    if (thumb) {
      thumb.setAttribute('loading', 'lazy');
      thumb.setAttribute('alt', '');
      summary.append(thumb);
    } else {
      summary.classList.add('no-thumb');
    }
    const h3 = nameCell.querySelector('h3');
    if (h3) {
      h3.className = 'nm';
      summary.append(h3);
    }
    const count = nameCell.querySelector('p');
    if (count) {
      const span = document.createElement('span');
      span.className = 'count';
      span.textContent = count.textContent.trim();
      summary.append(span);
    }
    details.append(summary);

    const spread = document.createElement('div');
    spread.className = 'cap-spread';
    if (featCell) spread.append(buildFeats(featCell));
    const panel = panelCell && panelCell.querySelector('img');
    if (panel) {
      panel.setAttribute('loading', 'lazy');
      spread.append(panel);
    }
    details.append(spread);
    files.append(details);
  });

  wrap.append(files);
  block.append(wrap);
}
