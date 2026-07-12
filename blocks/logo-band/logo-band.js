/*
 * logo-band — manifest frame cells trust band (AZERO device, carbon substrate).
 * Default: label as first (wider) cell — home.
 * Variant `labeled`: uppercase label line above equal cells — safety-cloud / industry.
 */
export default function decorate(block) {
  const labeled = block.classList.contains('labeled');
  const logos = [];
  let label = null;
  [...block.children].forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      logos.push(img);
    } else if (row.textContent.trim()) {
      label = row.querySelector('p') || row.firstElementChild;
    }
  });

  block.textContent = '';
  const cells = document.createElement('div');
  cells.className = 'cells';
  cells.style.setProperty('--cols', logos.length);

  if (labeled && label) {
    label.classList.add('trust-label');
    block.append(label);
  } else if (label) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.append(label);
    cells.append(cell);
  }

  logos.forEach((img) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.append(img);
    cells.append(cell);
  });
  block.append(cells);
}
