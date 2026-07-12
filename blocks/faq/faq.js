/*
 * faq — accordion (home faq). Rows: [h2] · q/a rows [question p | answer ps] · coda [p].
 * Native <details>; first item open (prototype default).
 */
export default function decorate(block) {
  let heading = null;
  const qas = [];
  let coda = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      qas.push(cells);
    } else if (row.querySelector('h2')) {
      heading = row.querySelector('h2');
    } else if (row.textContent.trim()) {
      coda = row.querySelector('p') || cells[0];
    }
  });

  block.textContent = '';
  const inner = document.createElement('div');
  inner.className = 'inner';
  if (heading) inner.append(heading);

  qas.forEach(([q, a], i) => {
    const details = document.createElement('details');
    if (i === 0) details.setAttribute('open', '');
    const summary = document.createElement('summary');
    summary.textContent = q.textContent.trim();
    details.append(summary);
    const answer = document.createElement('div');
    answer.className = 'answer';
    answer.append(...a.childNodes);
    details.append(answer);
    inner.append(details);
  });

  if (coda) {
    coda.className = 'coda';
    inner.append(coda);
  }
  block.append(inner);
}
