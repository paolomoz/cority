/*
 * section-metadata — runtime shim. This repo's trimmed aem.js decorateSections
 * does not consume `section-metadata` divs (standard boilerplate does), so
 * they fall through to decorateBlocks as a block named "section-metadata".
 * This block restores the standard contract: a `style | value[, value…]` row
 * becomes classes on the enclosing .section; other rows become data-* on the
 * section. The block then removes itself.
 */
import { toClassName, toCamelCase } from '../../scripts/aem.js';

export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    [...block.children].forEach((row) => {
      const cells = [...row.children];
      if (cells.length < 2) return;
      const key = toClassName(cells[0].textContent);
      const value = cells[1].textContent.trim();
      if (key === 'style') {
        value.split(',')
          .map((style) => toClassName(style.trim()))
          .filter((style) => style)
          .forEach((style) => section.classList.add(style));
      } else if (key) {
        section.dataset[toCamelCase(key)] = value;
      }
    });
  }
  const wrapper = block.parentElement;
  if (wrapper && wrapper.classList.contains('section-metadata-wrapper')) {
    wrapper.remove();
  } else {
    block.remove();
  }
}
