/*
 * industry-accordion — file-row accordion of industry challenge/solution grids.
 * Rows: [h2] · industry rows
 * [h3 name | p<strong>Challenges</strong> + ul | p<strong>Solutions</strong> + ul].
 */

function buildCol(cell) {
  const div = document.createElement('div');
  [...cell.children].forEach((el) => {
    const strong = el.tagName === 'P' && el.querySelector(':scope > strong:only-child');
    if (strong) {
      const h4 = document.createElement('h4');
      h4.textContent = strong.textContent;
      div.append(h4);
    } else {
      div.append(el);
    }
  });
  return div;
}

export default function decorate(block) {
  let heading = null;
  const industries = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && row.querySelector('h2')) {
      heading = row.querySelector('h2');
    } else if (cells.length > 1) {
      industries.push(cells);
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const files = document.createElement('div');
  files.className = 'ind-files';

  industries.forEach(([nameCell, challenges, solutions], i) => {
    const details = document.createElement('details');
    if (i === 0) details.setAttribute('open', '');
    const summary = document.createElement('summary');
    const h3 = nameCell.querySelector('h3') || document.createElement('h3');
    if (!h3.parentElement) h3.textContent = nameCell.textContent.trim();
    summary.append(h3);
    details.append(summary);

    const grid = document.createElement('div');
    grid.className = 'cs-grid';
    if (challenges) grid.append(buildCol(challenges));
    if (solutions) grid.append(buildCol(solutions));
    details.append(grid);
    files.append(details);
  });

  wrap.append(files);
  block.append(wrap);
}
