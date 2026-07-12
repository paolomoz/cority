/*
 * values — ruled 3-up grid of value cards (our-story).
 * Rows: [head: <h2> + lede <p>] then 2-cell rows (icon image | h3 + p).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h2'));
  const itemRows = rows.filter((row) => row !== headRow && row.children.length >= 2);

  const out = [];
  if (headRow) {
    const cell = headRow.children[0];
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P') el.classList.add('lede');
      out.push(el);
    });
  }

  const grid = document.createElement('div');
  grid.className = 'val-grid';
  itemRows.forEach((row) => {
    const [imgCell, textCell] = row.children;
    const val = document.createElement('div');
    val.className = 'val';
    const img = imgCell.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      val.append(img);
    }
    const body = document.createElement('div');
    body.append(...textCell.children);
    val.append(body);
    grid.append(val);
  });
  out.push(grid);

  block.textContent = '';
  block.append(...out);
}
