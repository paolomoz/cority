/*
 * latest-news — ruled index of news cards (our-story). Static verbatim cards;
 * marked as a dynamic slot per contract D3 (data-dynamic="latest-feeds").
 * Rows: [head: <h2>] then 2-cell rows (thumb image | kicker p + h3 + p + link p).
 */
export default function decorate(block) {
  block.dataset.dynamic = 'latest-feeds';
  block.dataset.queryType = 'news';
  block.dataset.pageSize = '3';

  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h2'));
  const cardRows = rows.filter((row) => row !== headRow && row.children.length >= 2);

  const out = [];
  if (headRow) out.push(...headRow.children[0].children);

  const index = document.createElement('div');
  index.className = 'res-index';
  cardRows.forEach((row) => {
    const [imgCell, textCell] = row.children;
    const card = document.createElement('article');
    card.className = 'res-item';
    const img = imgCell.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      card.append(img);
    }
    const body = document.createElement('div');
    const heading = textCell.querySelector('h3');
    let beforeHeading = true;
    [...textCell.children].forEach((el) => {
      if (el === heading) beforeHeading = false;
      if (el.tagName === 'P') {
        if (beforeHeading) {
          el.classList.add('kicker');
        } else if (el.querySelector(':scope > a:only-child')) {
          el.classList.add('more');
        } else {
          el.classList.add('desc');
        }
      }
      body.append(el);
    });
    card.append(body);
    index.append(card);
  });
  out.push(index);

  block.textContent = '';
  block.append(...out);
}
