/**
 * Adds semantic classes to the featured story layout cells.
 * @param {Element} block the featured news block
 */
export default function decorate(block) {
  const layout = block.firstElementChild;
  if (!layout) return;

  layout.classList.add('featured-news-layout');
  // EDS wraps cells beginning with an article in a paragraph.
  layout.querySelectorAll(':scope > div > p').forEach((paragraph) => {
    if (paragraph.querySelector(':scope > article')) {
      paragraph.replaceWith(...paragraph.childNodes);
    }
  });
  const [lead, secondary, news] = [...layout.children];
  secondary?.classList.add('featured-news-secondary');
  lead?.classList.add('featured-news-lead-column');
  news?.classList.add('featured-news-aside');
}
