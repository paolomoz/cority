/*
 * hero — evidence-dossier hero band (stardust home-proposed-C canon).
 * Variants: (default) home annotated exhibit + manifest run,
 *           product   claim-checklist split (safety-cloud),
 *           industry  split hero (industry pages).
 */

function metaRailify(scope) {
  scope.querySelectorAll('p').forEach((p) => {
    const strong = p.querySelector(':scope > strong:only-child');
    if (strong && p.textContent.trim() === strong.textContent.trim()) {
      p.className = 'meta-rail';
      p.textContent = strong.textContent;
    }
  });
}

export default function decorate(block) {
  const isProduct = block.classList.contains('product');
  const isIndustry = block.classList.contains('industry');

  let content = null;
  let media = null;
  let manifest = null;
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    if (cell.querySelector('h1')) content = cell;
    else if (cell.querySelector('img')) media = cell;
    else if (cell.querySelector('ul')) manifest = cell;
  });
  if (!content) return;

  metaRailify(content);

  // checklist (product): the ul inside the copy cell
  const checklist = content.querySelector('ul');
  if (checklist) checklist.className = 'checklist';

  // first non-button, non-meta paragraph after the h1 = lede (home/industry)
  if (!isProduct) {
    const lede = [...content.querySelectorAll('p')]
      .find((p) => !p.classList.contains('button-wrapper') && !p.classList.contains('meta-rail'));
    if (lede) lede.classList.add('lede');
  }

  // ask link (plain <a> alone in a p) → underlined on-dark ask
  const askPs = [...content.querySelectorAll('p')]
    .filter((p) => !p.classList.contains('button-wrapper') && p.querySelector(':scope > a:only-child'));
  askPs.forEach((p) => p.querySelector('a').classList.add('ask', 'on-dark'));

  // group primary button + ask into one cta row (product)
  if (isProduct) {
    const buttonP = content.querySelector('p.button-wrapper');
    if (buttonP) {
      const ctaRow = document.createElement('p');
      ctaRow.className = 'cta-row';
      buttonP.before(ctaRow);
      ctaRow.append(...[buttonP, ...askPs].map((p) => p.querySelector('a')).filter(Boolean));
      [buttonP, ...askPs].forEach((p) => p.remove());
    }
  }

  // media → exhibit figure (home/product) or plain img (industry)
  let exhibit = null;
  if (media) {
    const img = media.querySelector('img');
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    if (isIndustry) {
      exhibit = img;
    } else {
      exhibit = document.createElement('figure');
      exhibit.className = 'exhibit';
      exhibit.append(img);
      const cap = media.querySelector('p');
      if (cap) {
        const fc = document.createElement('figcaption');
        fc.className = 'annot';
        fc.append(...cap.childNodes);
        exhibit.append(fc);
      }
    }
  }

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (isProduct || isIndustry) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    const copy = document.createElement('div');
    copy.append(...content.childNodes);
    grid.append(copy);
    if (exhibit) grid.append(exhibit);
    wrap.append(grid);
    block.append(wrap);
  } else {
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.append(...content.childNodes);
    if (exhibit) stage.append(exhibit);
    wrap.append(stage);
    block.append(wrap);
    if (manifest) {
      const m = document.createElement('div');
      m.className = 'manifest';
      m.setAttribute('aria-label', 'Platform capabilities');
      m.append(manifest.querySelector('ul'));
      block.append(m);
    }
  }
}
