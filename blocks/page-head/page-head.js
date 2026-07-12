/*
 * page-head — navy head band (variants: article | listing | resource).
 * article: kicker + h1 + byline (author / updated / tag links)
 * listing: h1 + filter console (labelled selects) + type tabs
 * resource: kicker + h1 + lede
 */

function buildByline(cell) {
  const byline = document.createElement('div');
  byline.className = 'byline';
  [...cell.querySelectorAll('p')].forEach((p) => {
    const links = [...p.querySelectorAll('a')];
    if (links.length) {
      const tags = document.createElement('span');
      tags.className = 'tags';
      tags.append(...links);
      byline.append(tags);
    } else if (p.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = p.textContent.trim();
      byline.append(span);
    }
  });
  return byline;
}

function buildFilterGroup(labelText, list) {
  const key = labelText.trim().toLowerCase();
  const group = document.createElement('div');
  group.className = 'f-group';
  const label = document.createElement('label');
  label.setAttribute('for', `f-${key}`);
  label.textContent = labelText.trim();
  const select = document.createElement('select');
  select.id = `f-${key}`;
  select.name = key;
  select.dataset.filterKey = key;
  [...list.querySelectorAll('li')].forEach((li, i) => {
    const option = document.createElement('option');
    const text = li.textContent.trim();
    if (i === 0 && /^select\b/i.test(text)) option.value = '';
    option.textContent = text;
    select.append(option);
  });
  group.append(label, select);
  return group;
}

function buildTabs(list) {
  const nav = document.createElement('nav');
  nav.className = 'type-tabs';
  nav.setAttribute('aria-label', 'Resource types');
  [...list.querySelectorAll('li')].forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    if (li.querySelector('strong')) a.setAttribute('aria-current', 'page');
    nav.append(a);
  });
  return nav;
}

export default function decorate(block) {
  const isResource = block.classList.contains('resource');
  const out = [];
  const filters = [];
  let tabs = null;
  let seenTitle = false;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const h1 = row.querySelector('h1');
    const list = row.querySelector('ul, ol');
    if (h1) {
      out.push(h1);
      seenTitle = true;
    } else if (cells.length >= 2 && list) {
      filters.push(buildFilterGroup(cells[0].textContent, list));
    } else if (list && list.querySelector('a')) {
      tabs = buildTabs(list);
    } else if (!seenTitle) {
      const kicker = document.createElement('p');
      kicker.className = 'kicker';
      kicker.textContent = row.textContent.trim();
      out.push(kicker);
    } else if (isResource) {
      [...row.querySelectorAll('p')].forEach((p) => {
        p.classList.add('lede');
        out.push(p);
      });
    } else {
      out.push(buildByline(row));
    }
    row.remove();
  });

  if (filters.length) {
    const console = document.createElement('div');
    console.className = 'console';
    const form = document.createElement('form');
    form.method = 'get';
    form.action = '/resources/blog';
    form.dataset.dynamic = 'filter-console';
    form.append(...filters);
    console.append(form);
    out.push(console);
  }
  if (tabs) out.push(tabs);
  block.append(...out);
}
