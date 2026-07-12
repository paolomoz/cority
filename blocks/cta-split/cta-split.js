/*
 * cta-split — canon CTA band with split layout (h2 left, copy + button right).
 * Content: one row, two cells [h2 | p + p<strong><a> button]. Tolerates the
 * h2 and copy arriving in a single cell.
 */

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  block.textContent = '';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'cta-grid';
  const right = document.createElement('div');

  cells.forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'H2') grid.append(node);
      else right.append(node);
    });
  });

  grid.append(right);
  wrap.append(grid);
  block.append(wrap);
}
