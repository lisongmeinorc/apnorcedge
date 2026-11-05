function decorateCollection(column, itemClass, categoryClass) {
  const list = column?.querySelector(':scope > ul');
  if (!list) return null;
  const collection = document.createElement('div');
  [...list.children].forEach((item) => {
    const article = document.createElement('article');
    if (itemClass) article.className = itemClass;
    article.append(...item.childNodes);
    const category = article.querySelector('h3')?.previousElementSibling;
    if (categoryClass && category?.matches('p') && !category.querySelector('picture')) {
      category.classList.add(categoryClass);
    }
    // EDS wraps standalone pictures in paragraphs during content normalization.
    article.querySelectorAll(':scope > p').forEach((p) => {
      if (p.children.length === 1 && p.querySelector('picture') && !p.textContent.trim()) {
        p.replaceWith(p.firstElementChild);
      }
    });
    collection.append(article);
  });
  list.replaceWith(collection);
  return collection;
}

function decorateEmbeds(column) {
  column?.querySelectorAll(':scope > p > a[href]').forEach((link) => {
    const url = new URL(link.href);
    const poll = url.origin === 'https://interactives.ap.org'
      && url.pathname === '/ap-norc-poll-tracker/embed/';
    const video = url.origin === 'https://www.youtube.com'
      && /^\/embed\/[\w-]+$/.test(url.pathname);
    const paragraph = link.parentElement;
    if ((!poll && !video) || paragraph.textContent.trim() !== link.textContent.trim()) return;
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = link.textContent.trim();
    iframe.loading = 'lazy';
    if (video) {
      iframe.width = '640';
      iframe.height = '360';
      iframe.allowFullscreen = true;
    } else {
      paragraph.nextElementSibling?.classList.add('home-news-fallback');
    }
    paragraph.replaceWith(iframe);
  });
}

function decorateLinks(column, className) {
  column?.querySelectorAll(':scope > p').forEach((p) => {
    const link = p.querySelector(':scope > a');
    if (link && new URL(link.href).origin === 'https://apnorc.org'
      && p.textContent.trim() === link.textContent.trim()) p.classList.add(className);
  });
}

export default function decorate(block) {
  const cols = [...(block.firstElementChild?.children || [])];
  block.classList.add(`columns-${cols.length}-cols`);

  if (block.classList.contains('featured-news-sidebar')) {
    decorateCollection(cols[0], '', 'featured-news-category');
  }
  if (block.classList.contains('home-news')) {
    cols[0]?.classList.add('home-news-latest');
    cols[1]?.classList.add('home-news-trends');
    decorateCollection(cols[0], 'latest-item', 'home-news-category');
    decorateEmbeds(cols[1]);
    cols.forEach((column) => decorateLinks(column, 'home-news-link'));
  }
  if (block.classList.contains('home-directory')) {
    cols[0]?.querySelector(':scope > ul')?.classList.add('topic-links');
    decorateCollection(cols[1])?.classList.add('program-list');
    cols.forEach((column) => decorateLinks(column, 'home-directory-link'));
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
