/*
 * story-quote — ruled pull-quote inside the customer-story prose narrative.
 * Rows: [quote text] then optional [attribution].
 */
export default function decorate(block) {
  const rows = [...block.children];
  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  if (rows[0]) blockquote.append(...rows[0].children[0].childNodes);
  figure.append(blockquote);
  if (rows[1]) {
    const figcaption = document.createElement('figcaption');
    const cite = document.createElement('cite');
    cite.append(...rows[1].children[0].childNodes);
    figcaption.append(cite);
    figure.append(figcaption);
  }
  block.textContent = '';
  block.append(figure);
}
