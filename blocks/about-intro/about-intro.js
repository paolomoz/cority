/*
 * about-intro — our-story intro (h2 + left-aligned 72ch paragraphs).
 * Single row, single cell: h2 followed by paragraphs.
 */
export default function decorate(block) {
  const content = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children]);
  block.textContent = '';
  block.append(...content);
}
