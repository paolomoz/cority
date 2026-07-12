/*
 * listing — D2 filtered resource listing, static page 1 (front-page layout:
 * lead post + ruled post index + Load More). Rows: [img | kick?/h3-link/excerpt];
 * a single-cell h2 row becomes the visually-hidden section heading; a single-cell
 * link row becomes the Load More slot.
 */
export default function decorate(block) {
  block.dataset.dynamic = 'query-listing';
  block.dataset.queryType = 'blog';
  block.dataset.filters = 'cloud,solution,topic';
  block.dataset.pageSize = '12';
  block.dataset.items = '12';

  const out = [];
  const index = document.createElement('div');
  index.className = 'post-index';
  let leadDone = false;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const img = row.querySelector('img');
    const h2 = row.querySelector('h2');
    if (h2) {
      h2.classList.add('sr-title');
      out.push(h2);
    } else if (img && cells.length >= 2) {
      const article = document.createElement('article');
      const text = cells[1];
      text.removeAttribute('class');
      const link = text.querySelector('h3 a');
      if (link) link.setAttribute('aria-label', `Read: ${link.textContent.trim()}`);
      const h3 = text.querySelector('h3');
      const kick = text.querySelector('p');
      if (kick && h3
        // eslint-disable-next-line no-bitwise
        && (kick.compareDocumentPosition(h3) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        kick.classList.add('kick');
      }
      article.append(img, text);
      if (!leadDone) {
        article.className = 'lead-post';
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
        out.push(article);
        leadDone = true;
      } else {
        article.className = 'post-row';
        img.setAttribute('loading', 'lazy');
        index.append(article);
      }
    } else if (row.querySelector('a')) {
      const loadRow = document.createElement('div');
      loadRow.className = 'load-row';
      const a = row.querySelector('a');
      a.dataset.dynamic = 'load-more';
      loadRow.append(a.closest('p') || a);
      out.push(index, loadRow);
    }
    row.remove();
  });

  if (!out.includes(index) && index.children.length) out.push(index);
  block.append(...out);
}
