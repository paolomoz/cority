/*
 * control-trio — labeled diagram (home control section).
 * Rows: [h2] · callout [img|h3|p] · center [img] · callout [img|h3|p]
 *       · callout [h3|p] (no img) · ask [p > a].
 */
export default function decorate(block) {
  let heading = null;
  let center = null;
  let ask = null;
  const callouts = [];

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const hasH3 = cell.querySelector('h3');
    const img = cell.querySelector('img');
    if (cell.querySelector('h2')) {
      heading = cell.querySelector('h2');
    } else if (hasH3) {
      callouts.push(cell);
    } else if (img) {
      center = img;
    } else if (cell.querySelector('a')) {
      ask = cell.querySelector('a');
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(heading);

  const diagram = document.createElement('div');
  diagram.className = 'diagram';
  const classes = ['co-a', 'co-b', 'co-c'];
  const built = callouts.map((cell, i) => {
    const div = document.createElement('div');
    div.className = `callout ${classes[i % classes.length]}`;
    div.append(...cell.childNodes);
    div.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'lazy'));
    return div;
  });

  if (built[0]) diagram.append(built[0]);
  if (center) {
    center.setAttribute('loading', 'lazy');
    const c = document.createElement('div');
    c.className = 'center';
    c.append(center);
    diagram.append(c);
  }
  if (built[1]) diagram.append(built[1]);
  if (built[2]) diagram.append(built[2]);
  wrap.append(diagram);

  if (ask) {
    ask.classList.add('ask');
    const p = document.createElement('p');
    p.className = 'askrow';
    p.append(ask);
    wrap.append(p);
  }
  block.append(wrap);
}
