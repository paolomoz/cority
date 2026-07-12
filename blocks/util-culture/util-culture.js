/*
 * util-culture — careers culture rail: an intro head plus alternating
 * media / navy-text tiles.
 * Rows: optional head [h2 + p] then tile rows [img | h2|h3 + p].
 * Tiles alternate the image side (odd = media left, even = media right).
 */

export default function decorate(block) {
  const rows = [...block.children];
  const headRow = rows.find((row) => row.children.length === 1 && row.querySelector('h2'));
  const tileRows = rows.filter((row) => row !== headRow && row.children.length >= 2);

  const out = [];
  if (headRow) {
    const cell = headRow.children[0];
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P') el.classList.add('c-lede');
      out.push(el);
    });
  }

  tileRows.forEach((row) => {
    const [mediaCell, textCell] = row.children;
    const tile = document.createElement('div');
    tile.className = 'c-tile';

    const media = document.createElement('div');
    media.className = 'c-media';
    const img = mediaCell.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      media.append(img);
    }

    const text = document.createElement('div');
    text.className = 'c-text';
    text.append(...textCell.childNodes);

    tile.append(media, text);
    out.push(tile);
  });

  block.textContent = '';
  block.append(...out);
}
