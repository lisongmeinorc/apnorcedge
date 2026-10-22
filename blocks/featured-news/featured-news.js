/**
 * Adds semantic classes to the featured story layout cells.
 * @param {Element} block the featured news block
 */
export default function decorate(block) {
  const layout = block.firstElementChild;
  if (!layout) return;

  layout.classList.add('featured-news-layout');
  const [secondary, lead, news] = [...layout.children];
  secondary?.classList.add('featured-news-secondary');
  lead?.classList.add('featured-news-lead-column');
  news?.classList.add('featured-news-aside');
}
