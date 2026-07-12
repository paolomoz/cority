/*
 * util-shell — a static shell that marks a dynamic slot to be wired at launch.
 * Renders the authored content and carries the slot marker.
 *
 * Variants:
 *   tool    — data-dynamic="tool-shell" (bayesian interactive tool region);
 *             renders the authored copy as clean prose.
 *   workday — data-dynamic="workday-shell" (careers job-board link-out). Groups
 *             the impersonation notice into a callout and keeps the link-out
 *             button. NOTE: the live careers site uses Lever
 *             (jobs.lever.co/cority) — the button links out there; no board is
 *             embedded. The block id is set to `jobs` so the hero #jobs link
 *             scrolls here.
 */

export default function decorate(block) {
  const workday = block.classList.contains('workday');
  block.dataset.dynamic = workday ? 'workday-shell' : 'tool-shell';
  if (workday) block.id = 'jobs';

  const nodes = [];
  [...block.children].forEach((row) => {
    const cell = row.children.length === 1 ? row.children[0] : row;
    nodes.push(...cell.children);
    row.remove();
  });

  const wrap = document.createElement('div');
  wrap.className = 'shell-inner';

  if (workday) {
    const notice = document.createElement('div');
    notice.className = 'notice';
    const rest = [];
    nodes.forEach((el) => {
      const isButton = el.classList.contains('button-wrapper') || el.querySelector('a.button');
      if (el.tagName === 'P' && !isButton) notice.append(el);
      else rest.push(el);
    });
    const heading = rest.find((el) => /^H[1-6]$/.test(el.tagName));
    if (heading) wrap.append(heading);
    if (notice.children.length) wrap.append(notice);
    rest.filter((el) => el !== heading).forEach((el) => wrap.append(el));
  } else {
    wrap.append(...nodes);
  }

  block.append(wrap);
}
