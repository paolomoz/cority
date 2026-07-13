/*
 * query-index.js — shared client for /query-index.json (D2 listing, D3 feeds,
 * D4 search). AEM builds the index from published pages per helix-query.yaml;
 * each row carries the facet metadata authored in the page metadata block
 * (see stardust/facet-contract.md). Cached per page load.
 */
let cache = null;

export async function loadIndex() {
  if (cache) return cache;
  try {
    const resp = await fetch(`${window.hlx?.codeBasePath || ''}/query-index.json`);
    if (!resp.ok) throw new Error(resp.status);
    const json = await resp.json();
    cache = Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    cache = [];
  }
  return cache;
}

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// facet match: every provided filter must match (comma-lists match on membership).
// Compares slug-normalized forms so a tag slug (esg-management) matches an index
// topic value ("ESG Management").
export function matches(row, filters) {
  return Object.entries(filters).every(([key, want]) => {
    if (!want) return true;
    const have = row[key] || '';
    if (!have) return false;
    const wants = slug(want);
    return have.split(',').map((s) => slug(s)).includes(wants) || slug(have) === wants;
  });
}

export function query(rows, {
  template, type, filters = {}, sort = 'published', dir = 'desc',
} = {}) {
  let out = rows.slice();
  if (template) out = out.filter((r) => (r.template || '') === template);
  if (type) out = out.filter((r) => (r.type || '') === type);
  if (Object.keys(filters).length) out = out.filter((r) => matches(r, filters));
  if (sort) {
    out.sort((a, b) => {
      const av = a[sort] || '';
      const bv = b[sort] || '';
      const cmp = sort === 'published'
        ? (Date.parse(bv) || 0) - (Date.parse(av) || 0)
        : String(av).localeCompare(String(bv));
      return dir === 'desc' ? cmp : -cmp;
    });
  }
  return out;
}

// full-text-ish search over title/description/topic/solution
export function search(rows, term) {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const words = t.split(/\s+/);
  return rows
    .map((r) => {
      const hay = `${r.title || ''} ${r.description || ''} ${r.topic || ''} ${r.solution || ''}`.toLowerCase();
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0);
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r);
}
