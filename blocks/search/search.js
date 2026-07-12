/*
 * search — D4 site search over /query-index.json. Reads ?q= from the URL,
 * renders a search field + result cards (title/description/type link).
 * Progressive: with no index or no q, shows the empty search field only.
 */
import { loadIndex, search as runSearch } from '../../scripts/query-index.js';

function resultCard(row) {
  const li = document.createElement('li');
  li.className = 'sr-hit';
  const a = document.createElement('a');
  a.href = row.path;
  a.className = 'sr-hit-link';
  const h3 = document.createElement('h3');
  h3.textContent = row.title || row.path;
  a.append(h3);
  if (row.type) {
    const kick = document.createElement('span');
    kick.className = 'sr-kind';
    kick.textContent = row.type;
    a.append(kick);
  }
  if (row.description) {
    const p = document.createElement('p');
    p.textContent = row.description;
    a.append(p);
  }
  li.append(a);
  return li;
}

export default async function decorate(block) {
  block.textContent = '';
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || params.get('s') || '').trim();

  const form = document.createElement('form');
  form.className = 'sr-form';
  form.setAttribute('role', 'search');
  form.method = 'get';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.value = q;
  input.placeholder = 'Search cority.com';
  input.setAttribute('aria-label', 'Search');
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn-primary';
  submit.textContent = 'Search';
  form.append(input, submit);
  block.append(form);

  const status = document.createElement('p');
  status.className = 'sr-status';
  status.setAttribute('aria-live', 'polite');
  block.append(status);

  const list = document.createElement('ul');
  list.className = 'sr-results';
  block.append(list);

  if (!q) { status.textContent = 'Enter a search term.'; return; }
  status.textContent = 'Searching…';
  const all = await loadIndex();
  const hits = runSearch(all, q);
  status.textContent = hits.length
    ? `${hits.length} result${hits.length === 1 ? '' : 's'} for "${q}"`
    : `No results for "${q}".`;
  hits.slice(0, 50).forEach((r) => list.append(resultCard(r)));
}
