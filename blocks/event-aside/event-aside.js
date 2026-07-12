/*
 * event-aside — image aside for the event split section (5fr column).
 * Single row, single cell: the event image (page LCP candidate).
 */
export default function decorate(block) {
  const img = block.querySelector('img');
  block.textContent = '';
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
    block.append(img);
  }
}
