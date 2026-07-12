/*
 * about-modules — a responsive grid of platform-solution links.
 * Rows: head [h2 + optional intro <p><a>] · list [ul/ol of links] · ask [p > a].
 * Parses structurally by content so missing optional rows are tolerated.
 */
export default function decorate(block) {
  let head = null;
  let list = null;
  let ask = null;

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    if (cell.querySelector('h2')) {
      head = cell;
    } else if (cell.querySelector('ul, ol')) {
      list = cell;
    } else if (cell.querySelector('a')) {
      ask = cell.querySelector('a');
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (head) {
    [...head.children].forEach((el) => {
      if (el.tagName === 'P' && el.querySelector('a')) {
        el.className = 'am-intro';
        el.querySelector('a').classList.add('ask');
      }
      wrap.append(el);
    });
  }

  if (list) {
    const grid = document.createElement('div');
    grid.className = 'am-grid';
    [...list.querySelectorAll('li')].forEach((li) => {
      const item = document.createElement('div');
      item.className = 'am-item';
      const a = li.querySelector('a');
      if (a) item.append(a);
      else item.append(...li.childNodes);
      grid.append(item);
    });
    wrap.append(grid);
  }

  if (ask) {
    ask.classList.add('ask');
    const p = document.createElement('p');
    p.className = 'am-ask';
    p.append(ask);
    wrap.append(p);
  }

  block.append(wrap);
}
