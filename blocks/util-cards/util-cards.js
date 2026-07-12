/*
 * util-cards — simple heading + text-card grid for the T14 utility pages.
 * Rows: optional head [h2 (+ optional trailing img, e.g. a map)] then one
 * card per row (each card cell holds h3/h4 + p, optionally a tel/link).
 *
 * Variants: `trio` (3-up intro cards, centered), `offices` (3-up address
 * cards + full-width media below), `benefits` (4-up compact label cards).
 */

export default function decorate(block) {
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h2'));
  const cardRows = rows.filter((row) => row !== headRow && (row.querySelector('h3, h4, p')));

  const out = [];
  let media = null;

  if (headRow) {
    const cell = headRow.children[0];
    const img = cell.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      media = img;
    }
    [...cell.children].forEach((el) => {
      if (el.tagName === 'H2') out.push(el);
      else if (el.tagName === 'P') {
        el.classList.add('lede');
        out.push(el);
      }
    });
  }

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  cardRows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'card';
    const cell = row.children[0];
    card.append(...cell.childNodes);
    grid.append(card);
  });
  out.push(grid);

  if (media) {
    const figure = document.createElement('div');
    figure.className = 'card-media';
    figure.append(media);
    out.push(figure);
  }

  block.textContent = '';
  block.append(...out);
}
