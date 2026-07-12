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

  caps.forEach(([thumbCell, nameCell, featCell, panelCell], i) => {
    const details = document.createElement('details');
    if (i === 0) details.setAttribute('open', '');
    const summary = document.createElement('summary');
    const thumb = thumbCell.querySelector('img');
    if (thumb) {
      thumb.setAttribute('loading', 'lazy');
      thumb.setAttribute('alt', '');
      summary.append(thumb);
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
    spread.append(buildFeats(featCell));
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
