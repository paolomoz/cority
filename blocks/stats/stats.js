/*
 * stats — evidence ledger on navy (safety-cloud + industry stats-band).
 * Rows: head [p<strong> kicker + h2] · stat rows [figure p | caption p].
 * Generic: any number of stat rows; kicker and h2 optional.
 */
export default function decorate(block) {
  let head = null;
  const stats = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      stats.push(cells);
    } else if (cells[0]) {
      [head] = cells;
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (head) {
    [...head.children].forEach((el) => {
      if (el.tagName === 'P') {
        const strong = el.querySelector(':scope > strong:only-child');
        if (strong) {
          el.className = 'meta-rail';
          el.textContent = strong.textContent;
        }
      }
      wrap.append(el);
    });
  }

  stats.forEach(([n, cap]) => {
    const row = document.createElement('div');
    row.className = 'stat-row';
    const num = document.createElement('span');
    num.className = 'n';
    num.textContent = n.textContent.trim();
    const capSpan = document.createElement('span');
    capSpan.className = 'cap';
    const capP = cap.querySelector('p');
    capSpan.append(...(capP || cap).childNodes);
    row.append(num, capSpan);
    wrap.append(row);
  });

  block.append(wrap);
}
