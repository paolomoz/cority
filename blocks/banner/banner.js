/*
 * banner — navy head bands (customer story, event detail, about hero).
 * Variants: story | event | about.
 * Rows: [head: kicker <p><strong>, h1, lede <p>] then optional 2-cell
 * key-fact rows (label | value) rendered as the cells grid at the band base.
 */

/*
 * Runtime shim: this repo's aem.js decorateSections does NOT process
 * `section-metadata` blocks into section classes (upstream boilerplate does).
 * Until scripts/aem.js is fixed, apply the metadata here — banner is the
 * first block on every page this project ships, so it runs before any other
 * section is loaded. No-op once the runtime handles it (nodes already gone).
 */
function toClassName(name) {
  return name
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function applySectionMetadata() {
  document.querySelectorAll('main div.section-metadata').forEach((meta) => {
    const section = meta.closest('.section');
    if (section) {
      meta.querySelectorAll(':scope > div').forEach((row) => {
        const [keyCell, valueCell] = row.children;
        if (!keyCell || !valueCell) return;
        const key = toClassName(keyCell.textContent);
        const value = valueCell.textContent.trim();
        if (key === 'style') {
          value.split(',').filter((s) => s.trim()).forEach((style) => {
            section.classList.add(toClassName(style));
          });
        } else if (key) {
          section.dataset[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
        }
      });
    }
    const wrapper = meta.parentElement;
    if (wrapper && wrapper.classList.contains('section-metadata-wrapper')) {
      wrapper.remove();
    } else {
      meta.remove();
    }
  });
}

export default function decorate(block) {
  applySectionMetadata();

  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h1, h2'));
  const factRows = rows.filter((row) => row !== headRow && row.children.length >= 2);

  // head: kicker (p > strong before the heading), heading, lede
  const head = document.createElement('div');
  head.className = 'wrap banner-head';
  if (headRow) {
    const cell = headRow.children[0];
    const heading = cell.querySelector('h1, h2');
    let beforeHeading = true;
    [...cell.children].forEach((el) => {
      if (el === heading) beforeHeading = false;
      if (el.tagName === 'P') {
        const strong = el.querySelector(':scope > strong:only-child');
        if (strong && beforeHeading) {
          el.classList.add('kicker');
        } else {
          el.classList.add('lede');
        }
      }
      head.append(el);
    });
  }

  // key facts: label | value cells on a ruled grid at the band base
  let facts = null;
  if (factRows.length) {
    facts = document.createElement('div');
    facts.className = 'facts';
    const grid = document.createElement('div');
    grid.className = 'wrap facts-grid';
    grid.style.gridTemplateColumns = `repeat(${factRows.length}, minmax(0, 1fr))`;
    factRows.forEach((row) => {
      const [labelCell, valueCell] = row.children;
      const cell = document.createElement('div');
      cell.className = 'cell';
      const k = labelCell.querySelector('p') || labelCell;
      const v = valueCell.querySelector('p') || valueCell;
      const kp = document.createElement('p');
      kp.className = 'k';
      kp.textContent = k.textContent.trim();
      const vp = document.createElement('p');
      vp.className = 'v';
      vp.textContent = v.textContent.trim();
      cell.append(kp, vp);
      grid.append(cell);
    });
    facts.append(grid);
  }

  block.textContent = '';
  block.append(head);
  if (facts) block.append(facts);
}
