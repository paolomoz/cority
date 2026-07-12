/*
 * figures — attributed big-number ledgers.
 * Variants: results (customer story, cool band, dash-connected captions)
 *           band (our-story By The Numbers, navy cells row).
 * Rows: [head: meta-rail <p> + <h2>] then 2-cell rows (number | caption).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h2'));
  const statRows = rows.filter((row) => row !== headRow && row.children.length >= 2);
  const band = block.classList.contains('band');

  const out = [];
  if (headRow) {
    const cell = headRow.children[0];
    const heading = cell.querySelector('h2');
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P' && el !== heading) el.classList.add('meta-rail');
      out.push(el);
    });
  }

  const stats = statRows.map((row) => {
    const [numCell, capCell] = row.children;
    const item = document.createElement('div');
    item.className = band ? 'num-cell' : 'stat-row';
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = numCell.textContent.trim();
    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = capCell.textContent.trim();
    item.append(n, cap);
    return item;
  });

  if (band) {
    const numRow = document.createElement('div');
    numRow.className = 'num-row';
    numRow.style.gridTemplateColumns = `repeat(${stats.length}, minmax(0, 1fr))`;
    numRow.append(...stats);
    out.push(numRow);
  } else {
    out.push(...stats);
  }

  block.textContent = '';
  block.append(...out);
}
