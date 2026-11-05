import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) throw new Error(`Unable to load footer fragment: ${footerPath}`);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  ['center', 'programs', 'topics', 'legal'].forEach((name, i) => {
    footer.children[i]?.classList.add(`footer-${name}`);
  });
  const iconNames = new Map([
    ['mailto:info@apnorc.org', 'email'],
    ['https://twitter.com/APNORC', 'twitter'],
  ]);
  footer.querySelectorAll('a[href]').forEach((link) => {
    const iconName = iconNames.get(link.href);
    const label = link.textContent.trim();
    if (!iconName || !label) return;
    const icon = document.createElement('span');
    icon.className = `icon icon-${iconName}`;
    icon.setAttribute('aria-hidden', 'true');
    link.setAttribute('aria-label', label);
    link.title = label;
    link.replaceChildren(icon);
  });
  decorateIcons(footer);
  block.append(footer);
}
