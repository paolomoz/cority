/*
 * partner — partner overview archetype (partners/*).
 * Default: profile split — intro cell (h1 + about prose + website link) beside a
 *   meta card (definition list: Industry / Category / Cloud / Region / assets).
 * Variant `alliance`: navy Partner Alliance band — heading + prose + tag links
 *   beside a styled static contact form (D1 marketo stub, no live wiring).
 */

function buildMeta(cell) {
  const dl = document.createElement('dl');
  [...cell.querySelectorAll(':scope > p')].forEach((p) => {
    const strong = p.querySelector(':scope > strong');
    const dt = document.createElement('dt');
    dt.textContent = strong ? strong.textContent.trim() : '';
    const dd = document.createElement('dd');
    if (strong) strong.remove();
    dd.append(...p.childNodes);
    if (dd.firstChild && dd.firstChild.nodeType === 3) {
      dd.firstChild.textContent = dd.firstChild.textContent.replace(/^[\s:]+/, '');
    }
    dl.append(dt, dd);
  });
  return dl;
}

function buildForm() {
  const form = document.createElement('form');
  form.className = 'partner-form';
  form.setAttribute('data-dynamic', 'marketo-form');
  form.setAttribute('data-partner-form', 'alliance');
  form.addEventListener('submit', (e) => e.preventDefault());

  const field = (label, type, name, half) => {
    const wrap = document.createElement('div');
    wrap.className = half ? 'field half' : 'field';
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.id = `partner-${name}`;
    input.placeholder = label;
    input.setAttribute('aria-label', label);
    wrap.append(input);
    return wrap;
  };

  const row = document.createElement('div');
  row.className = 'field-row';
  row.append(field('First Name', 'text', 'firstName', true), field('Last Name', 'text', 'lastName', true));
  form.append(row);
  form.append(field('Email Address', 'email', 'email'));
  form.append(field('Phone Number', 'tel', 'phone'));
  form.append(field('Company', 'text', 'company'));

  const selWrap = document.createElement('div');
  selWrap.className = 'field';
  const sel = document.createElement('select');
  sel.name = 'inquiryType';
  sel.id = 'partner-inquiryType';
  sel.setAttribute('aria-label', 'Inquiry Type');
  const opt = document.createElement('option');
  opt.value = '';
  opt.selected = true;
  opt.textContent = 'Inquiry Type…';
  sel.append(opt);
  selWrap.append(sel);
  form.append(selWrap);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = 'Submit';
  form.append(submit);
  return form;
}

function decorateAlliance(block) {
  let heading = null;
  let prose = null;
  let tags = null;

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const ps = [...cell.querySelectorAll(':scope > p')];
    const linkPs = ps.filter((p) => p.querySelector(':scope > a:only-child'));
    if (cell.querySelector('h2')) heading = cell.querySelector('h2');
    else if (ps.length > 1 && linkPs.length === ps.length) tags = cell;
    else prose = cell;
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const grid = document.createElement('div');
  grid.className = 'alliance-grid';
  grid.append(buildForm());

  const aside = document.createElement('div');
  aside.className = 'alliance-copy';
  if (prose) aside.append(...prose.childNodes);
  if (tags) {
    const list = document.createElement('div');
    list.className = 'tag-list';
    tags.querySelectorAll('a').forEach((a) => {
      a.classList.add('tag');
      list.append(a);
    });
    aside.append(list);
  }
  grid.append(aside);
  wrap.append(grid);
  block.append(wrap);
}

function decorateProfile(block) {
  let intro = null;
  let meta = null;

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    if (cell.querySelector('h1')) intro = cell;
    else meta = cell;
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'profile-grid';

  const main = document.createElement('div');
  main.className = 'profile-main';
  if (intro) {
    intro.querySelectorAll('a').forEach((a) => {
      if (a.textContent.trim() === a.getAttribute('href')) a.classList.add('ask');
    });
    main.append(...intro.childNodes);
  }
  grid.append(main);

  if (meta) {
    const card = document.createElement('aside');
    card.className = 'profile-meta';
    card.append(buildMeta(meta));
    grid.append(card);
  }

  wrap.append(grid);
  block.append(wrap);
}

export default function decorate(block) {
  if (block.classList.contains('alliance')) decorateAlliance(block);
  else decorateProfile(block);
}
