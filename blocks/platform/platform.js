/*
 * platform — unified platform ruled columns (safety-cloud unified-platform).
 * Rows: head [h2 + lede p] · trio [h3+p | h3+p | h3+p] · ask [p > a].
 */
export default function decorate(block) {
  let head = null;
  let trio = null;
  let ask = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      trio = cells;
    } else if (row.querySelector('h2')) {
      [head] = cells;
    } else if (row.querySelector('a')) {
      ask = row.querySelector('a');
    } else if (cells[0] && cells[0].querySelector('h3')) {
      trio = [cells[0]];
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (head) {
    [...head.children].forEach((el) => {
      if (el.tagName === 'P') el.className = 'lede-c';
      wrap.append(el);
    });
  }

  if (trio) {
    const cols = document.createElement('div');
    cols.className = 'trio-cols';
    trio.forEach((cell) => {
      const div = document.createElement('div');
      div.append(...cell.childNodes);
      cols.append(div);
    });
    wrap.append(cols);
  }

  if (ask) {
    ask.classList.add('ask');
    const p = document.createElement('p');
    p.className = 'askrow';
    p.append(ask);
    wrap.append(p);
  }
  block.append(wrap);
}
