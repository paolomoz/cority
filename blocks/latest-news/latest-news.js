/*
 * latest-news — ruled index of recent cards (D3 latest-feeds). Renders static
 * authored cards, then enhances from /query-index.json (most-recent-by-type).
 * Config: an optional 2-cell `type | news` / `count | 3` row; else defaults.
 * Rows: [config] [head: <h2>] then 2-cell rows (thumb | kicker + h3 + desc + link).
 */
import { loadIndex, query } from '../../scripts/query-index.js';

function feedCard(row) {
  const card = document.createElement('article');
  card.className = 'res-item';
  if (row.image) {
    const img = document.createElement('img');
    img.src = row.image;
    img.alt = row.title || '';
    img.loading = 'lazy';
    card.append(img);
  }
  const body = document.createElement('div');
  if (row.type || row.topic) {
    const kick = document.createElement('p');
    kick.className = 'kicker';
    kick.textContent = (row.type || row.topic || '').split(',')[0].trim();
    body.append(kick);
  }
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = row.path;
  a.textContent = row.title || row.path;
  h3.append(a);
  body.append(h3);
  if (row.description) {
    const d = document.createElement('p');
    d.className = 'desc';
    d.textContent = row.description;
    body.append(d);
  }
  card.append(body);
  return card;
}

export default function decorate(block) {
  block.dataset.dynamic = 'latest-feeds';

  // config rows
  const cfg = { type: block.dataset.queryType || 'news', count: 3 };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length === 2 && (key === 'type' || key === 'count' || key === 'template')) {
      const val = cells[1].textContent.trim();
      if (key === 'count') cfg.count = parseInt(val, 10) || 3;
      else cfg[key] = val;
      row.remove();
    }
  });
  block.dataset.queryType = cfg.type;
  block.dataset.pageSize = String(cfg.count);

  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h2'));
  const cardRows = rows.filter((row) => row !== headRow && row.children.length >= 2);

  const out = [];
  if (headRow) out.push(...headRow.children[0].children);

  const index = document.createElement('div');
  index.className = 'res-index';
  cardRows.forEach((row) => {
    const [imgCell, textCell] = row.children;
    const card = document.createElement('article');
    card.className = 'res-item';
    const img = imgCell.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      card.append(img);
    }
    const body = document.createElement('div');
    const heading = textCell.querySelector('h3');
    let beforeHeading = true;
    [...textCell.children].forEach((el) => {
      if (el === heading) beforeHeading = false;
      if (el.tagName === 'P') {
        if (beforeHeading) {
          el.classList.add('kicker');
        } else if (el.querySelector(':scope > a:only-child')) {
          el.classList.add('more');
        } else {
          el.classList.add('desc');
        }
      }
      body.append(el);
    });
    card.append(body);
    index.append(card);
  });
  out.push(index);

  block.textContent = '';
  block.append(...out);

  // dynamic enhancement: most-recent-by-type from the query-index
  loadIndex().then((all) => {
    const recent = query(all, {
      template: cfg.template, type: cfg.template ? undefined : cfg.type, sort: 'published',
    }).slice(0, cfg.count);
    if (!recent.length) return; // keep authored fallback
    index.textContent = '';
    recent.forEach((r) => index.append(feedCard(r)));
  });
}
