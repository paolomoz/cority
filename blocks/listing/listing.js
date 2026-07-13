/*
 * listing — D2 filtered resource listing, index-driven with static fallback.
 *
 * Authored structure:
 *   - config rows (2 cells, first is a known key): template | T6-blog ;
 *     type | blog ; page-size | 12 ; heading | Blog
 *   - optional static post rows [img | kick?/h3-link/excerpt] — rendered as the
 *     progressive-enhancement fallback if the query-index is empty/unreachable
 *   - optional single-cell link row → Load More slot
 *
 * On decorate: render the authored fallback, then enhance from /query-index.json
 * (filter by template/type + facet filters, sort by published desc, paginate).
 * Listens for `listing:filter` events from the page-head filter console.
 */
import { loadIndex, query } from '../../scripts/query-index.js';

const CONFIG_KEYS = ['template', 'type', 'page-size', 'pagesize', 'heading', 'sort',
  'filter-topic', 'filter-author', 'filter-cloud', 'filter-solution'];

function postCard(row, lead) {
  const article = document.createElement('article');
  article.className = lead ? 'lead-post' : 'post-row';
  if (row.image) {
    const img = document.createElement('img');
    img.src = row.image;
    img.alt = row.title || '';
    img.loading = lead ? 'eager' : 'lazy';
    if (lead) img.setAttribute('fetchpriority', 'high');
    article.append(img);
  }
  const text = document.createElement('div');
  if (row.type || row.topic) {
    const kick = document.createElement('p');
    kick.className = 'kick';
    kick.textContent = (row.type || row.topic || '').split(',')[0].trim();
    text.append(kick);
  }
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = row.path;
  a.textContent = row.title || row.path;
  a.setAttribute('aria-label', `Read: ${a.textContent}`);
  h3.append(a);
  text.append(h3);
  if (row.description) {
    const p = document.createElement('p');
    p.textContent = row.description;
    text.append(p);
  }
  article.append(text);
  return article;
}

export default function decorate(block) {
  // ---- parse authored rows into config + fallback content ----
  const cfg = { pageSize: 12 };
  const contentRows = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length === 2 && CONFIG_KEYS.includes(key)) {
      const val = cells[1].textContent.trim();
      if (key === 'page-size' || key === 'pagesize') cfg.pageSize = parseInt(val, 10) || 12;
      else if (key === 'template') cfg.template = val;
      else if (key === 'type') cfg.type = val;
      else if (key === 'heading') cfg.heading = val;
      else if (key === 'sort') cfg.sort = val;
      else if (key.startsWith('filter-')) { (cfg.fixed ||= {})[key.slice(7)] = val; }
    } else {
      contentRows.push(row);
    }
  });
  // URL params (?topic=…&author=…) also seed fixed filters (taxonomy pages)
  const params = new URLSearchParams(window.location.search);
  ['topic', 'author', 'cloud', 'solution', 'type'].forEach((k) => {
    const v = params.get(k);
    if (v) (cfg.fixed ||= {})[k] = v;
  });

  block.dataset.dynamic = 'query-listing';
  if (cfg.template) block.dataset.queryTemplate = cfg.template;
  if (cfg.type) block.dataset.queryType = cfg.type;
  block.dataset.pageSize = String(cfg.pageSize);

  // ---- static fallback render (authored rows) ----
  const heading = document.createElement('h2');
  heading.className = 'sr-title';
  heading.textContent = cfg.heading || 'Resources';
  const index = document.createElement('div');
  index.className = 'post-index';
  const loadRow = document.createElement('div');
  loadRow.className = 'load-row';
  const fallback = document.createDocumentFragment();
  let leadDone = false;
  contentRows.forEach((row) => {
    const cells = [...row.children];
    const img = row.querySelector('img');
    if (row.querySelector('h2')) return;
    if (img && cells.length >= 2) {
      const article = document.createElement('article');
      const text = cells[1];
      text.removeAttribute('class');
      const link = text.querySelector('h3 a');
      if (link) link.setAttribute('aria-label', `Read: ${link.textContent.trim()}`);
      article.append(img, text);
      if (!leadDone) { article.className = 'lead-post'; fallback.append(article); leadDone = true; } else { article.className = 'post-row'; index.append(article); }
    }
  });

  block.textContent = '';
  block.append(heading, fallback, index, loadRow);

  // ---- dynamic enhancement from the query-index ----
  let filters = {};
  let rendered = 0;
  let results = [];
  let allRows = [];

  const renderPage = () => {
    const slice = results.slice(rendered, rendered + cfg.pageSize);
    slice.forEach((r) => {
      if (rendered === 0 && index.children.length === 0) {
        // first result becomes the lead
        const lead = block.querySelector('.lead-post');
        const card = postCard(r, true);
        if (lead) lead.replaceWith(card); else heading.after(card);
      } else {
        index.append(postCard(r, false));
      }
      rendered += 1;
    });
    loadRow.hidden = rendered >= results.length;
  };

  const refresh = () => {
    rendered = 0;
    index.textContent = '';
    const existingLead = block.querySelector('.lead-post');
    if (existingLead) existingLead.remove();
    results = query(allRows, {
      template: cfg.template,
      type: cfg.type,
      filters: { ...(cfg.fixed || {}), ...filters },
      sort: cfg.sort || 'published',
    });
    renderPage();
  };

  loadIndex().then((rows) => {
    allRows = rows;
    const filtered = query(rows, {
      template: cfg.template, type: cfg.type, filters: cfg.fixed || {},
    });
    if (!filtered.length) return; // keep authored fallback
    // replace fallback with dynamic
    const lead = block.querySelector('.lead-post');
    if (lead) lead.remove();
    index.textContent = '';
    refresh();

    // Load More
    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'btn btn-secondary';
    moreBtn.textContent = 'Load More';
    moreBtn.addEventListener('click', renderPage);
    loadRow.textContent = '';
    loadRow.append(moreBtn);

    // filter console events
    document.addEventListener('listing:filter', (e) => {
      filters = e.detail || {};
      refresh();
    });
  });
}
