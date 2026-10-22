import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const cleanups = new WeakMap();

/**
 * Loads shared navigation content and decorates its responsive controls.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  cleanups.get(block)?.();
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) throw new Error(`Unable to load navigation fragment: ${navPath}`);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary');
  nav.append(...fragment.children);
  ['brand', 'sections', 'tools', 'contact'].forEach((name, i) => {
    nav.children[i]?.classList.add(`nav-${name}`);
  });

  const brand = nav.querySelector('.nav-brand');
  const sections = nav.querySelector('.nav-sections');
  if (!brand || !sections) throw new Error('Navigation requires brand and links sections');

  const panel = document.createElement('div');
  panel.id = 'nav-panel';
  panel.className = 'nav-panel';
  ['tools', 'sections', 'contact'].forEach((name) => {
    const section = nav.querySelector(`.nav-${name}`);
    if (section) panel.append(section);
  });

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'nav-toggle';
  menuButton.textContent = 'Menu';
  menuButton.setAttribute('aria-controls', panel.id);
  menuButton.setAttribute('aria-expanded', 'false');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'nav-close';
  closeButton.textContent = 'Close menu';
  panel.prepend(closeButton);
  nav.append(menuButton, panel);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  const main = document.querySelector('body > main');
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  if (main) {
    if (!main.id) main.id = 'main-content';
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
    skipLink.href = `#${main.id}`;
    block.replaceChildren(skipLink, wrapper);
  } else {
    block.replaceChildren(wrapper);
  }

  const controller = new AbortController();
  const { signal } = controller;
  skipLink.addEventListener('click', () => main?.focus(), { signal });
  const desktop = window.matchMedia('(min-width: 1024px)');
  const form = panel.querySelector('form');
  const searchInput = form?.querySelector('input[type="search"]');
  let searchToggle;
  if (form) {
    form.id = 'nav-search-form';
    searchToggle = document.createElement('button');
    searchToggle.type = 'button';
    searchToggle.className = 'nav-search-toggle';
    searchToggle.textContent = 'Search';
    searchToggle.setAttribute('aria-controls', form.id);
    searchToggle.setAttribute('aria-expanded', 'false');
    form.before(searchToggle);
  }

  const setSearch = (open, restoreFocus = false) => {
    if (!form) return;
    form.hidden = desktop.matches && !open;
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) searchInput?.focus();
    else if (restoreFocus) searchToggle.focus();
  };

  let menuOpen = false;
  let previousOverflow = '';
  let background = [];
  const setMenu = (open, restoreFocus = false) => {
    if (open === menuOpen) return;
    menuOpen = open;
    menuButton.setAttribute('aria-expanded', String(open));
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      background = [...document.querySelectorAll('body > main, body > footer')]
        .map((element) => ({ element, inert: element.inert }));
      background.forEach(({ element }) => { element.inert = true; });
      brand.inert = true;
      menuButton.inert = true;
      skipLink.inert = true;
      panel.hidden = false;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'Site navigation');
      closeButton.focus();
    } else {
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      background = [];
      brand.inert = false;
      menuButton.inert = false;
      skipLink.inert = false;
      panel.hidden = !desktop.matches;
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      panel.removeAttribute('aria-label');
      if (restoreFocus) menuButton.focus();
    }
  };

  menuButton.addEventListener('click', () => setMenu(true), { signal });
  closeButton.addEventListener('click', () => setMenu(false, true), { signal });
  searchToggle?.addEventListener('click', () => {
    setSearch(searchToggle.getAttribute('aria-expanded') !== 'true');
  }, { signal });
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a') && menuOpen) setMenu(false, true);
  }, { signal });

  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (menuOpen) {
        event.preventDefault();
        setMenu(false, true);
      } else if (searchToggle?.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setSearch(false, true);
      }
    }
    if (event.key === 'Tab' && menuOpen) {
      const focusable = [...panel.querySelectorAll('a[href], button, input')]
        .filter((element) => element.getClientRects().length && !element.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }, { signal });

  const syncLayout = () => {
    const focusInPanel = panel.contains(document.activeElement);
    setMenu(false);
    panel.hidden = !desktop.matches;
    setSearch(false);
    if (!desktop.matches && focusInPanel) menuButton.focus();
    else if (nav.contains(document.activeElement)
      && !document.activeElement.getClientRects().length) {
      if (desktop.matches) brand.querySelector('a')?.focus();
      else menuButton.focus();
    }
  };
  desktop.addEventListener('change', syncLayout, { signal });
  syncLayout();

  let observer;
  const cleanup = () => {
    setMenu(false);
    controller.abort();
    observer.disconnect();
    cleanups.delete(block);
  };
  // Fragment reloads and page teardown must release modal state and listeners.
  observer = new MutationObserver(() => {
    if (!block.isConnected) cleanup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) setMenu(false);
    else cleanup();
  }, { signal });
  cleanups.set(block, cleanup);
}
