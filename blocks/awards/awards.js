/*
 * awards — trophy shelf (home awards-band; `navy` variant = safety-cloud awards-hi).
 * Rows: info [h2 + rating p (stars img + text) + ask p>a] · shelf [imgs] · caption [p] (optional).
 */
export default function decorate(block) {
  let info = null;
  let shelf = null;
  let caption = null;
  let cta = null;

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    if (cell.querySelector('h2')) {
      info = cell;
    } else if (cell.querySelectorAll('img').length > 1) {
      shelf = cell;
    } else if (cell.querySelector('a')) {
      cta = cell.querySelector('a').closest('p') || cell;
    } else if (cell.textContent.trim()) {
      caption = cell.querySelector('p') || cell;
    }
  });

  block.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';

  const left = document.createElement('div');
  if (info) {
    [...info.children].forEach((el) => {
      if (el.tagName === 'P' && el.querySelector('img')) {
        el.className = 'rating';
        el.querySelector('img').setAttribute('loading', 'lazy');
      } else if (el.tagName === 'P' && el.querySelector('a')) {
        el.className = 'askrow';
        el.querySelector('a').classList.add('ask');
      }
      left.append(el);
    });
  }
  grid.append(left);

  const right = document.createElement('div');
  if (shelf) {
    const shelfDiv = document.createElement('div');
    shelfDiv.className = 'shelf';
    shelf.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy');
      shelfDiv.append(img);
    });
    right.append(shelfDiv);
  }
  if (caption) {
    caption.className = 'shelf-cap';
    right.append(caption);
  }
  grid.append(right);

  wrap.append(grid);

  if (cta) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'awards-cta';
    ctaWrap.append(cta);
    wrap.append(ctaWrap);
  }

  block.append(wrap);
}
