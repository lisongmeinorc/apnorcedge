import decorateCards from '../blocks/cards/cards.js';
import decorateColumns from '../blocks/columns/columns.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parse(html) {
  return new DOMParser().parseFromString(`<main>${html}</main>`, 'text/html').querySelector('main');
}

function imageIdentity(img) {
  return [
    new URL(img.getAttribute('src'), window.location.href).pathname,
    img.alt,
    img.getAttribute('width'),
    img.getAttribute('height'),
  ].join('|');
}

export default async function runTests(roundTrip = (html) => html) {
  const response = await fetch('/index.plain.html');
  assert(response.ok, `Homepage fixture failed: ${response.status}`);
  const html = await response.text();
  const source = parse(html);
  const main = parse(await roundTrip(html));
  const results = [];
  const expected = [
    'cards vertical featured-news-secondary',
    'cards vertical featured featured-news-lead',
    'columns featured-news-sidebar',
    'columns home-news',
    'cards staff-picks horizontal',
    'columns home-directory',
    'metadata',
  ];
  assert(
    JSON.stringify([...main.querySelectorAll(':scope > div > div[class]')].map((b) => b.className))
      === JSON.stringify(expected),
    'Approved block identities and order must be preserved',
  );
  assert(!main.querySelector('article, iframe, form, script, style'), 'Author only DA-safe content');
  const authoredLinks = [...main.querySelectorAll('a')].map((a) => a.getAttribute('href')).sort();
  const authoredImages = [...main.querySelectorAll('img')].map(imageIdentity).sort();
  assert(authoredImages.length === 11, 'Preserve all 11 homepage images');
  results.push('Approved block structure and DA-safe source');

  // Model the pipeline removing styling hooks while retaining block identity.
  main.querySelectorAll('[class]').forEach((el) => {
    if (!el.matches('main > div > div[class]')) el.removeAttribute('class');
  });
  main.querySelectorAll('.cards').forEach(decorateCards);
  main.querySelectorAll('.columns').forEach(decorateColumns);
  assert(main.querySelectorAll('.featured-news-sidebar article').length === 2, 'Sidebar stories');
  assert(main.querySelectorAll('.latest-item').length === 3, 'Latest research stories');
  assert(main.querySelectorAll('.home-news-category').length === 3, 'Latest categories');
  assert(main.querySelectorAll('.staff-picks-category').length === 3, 'Staff Picks categories');
  assert(main.querySelectorAll('.program-list article').length === 2, 'Signature programs');
  assert(main.querySelectorAll('.topic-links > li').length === 12, 'Topic links');
  assert(main.querySelectorAll('.latest-item > picture').length === 3, 'Normalized picture wrappers');
  results.push('Collections and CSS hooks survive class-free content');

  const frames = [...main.querySelectorAll('iframe')];
  assert(frames.length === 2 && frames.every((f) => f.title && f.loading === 'lazy'), 'Named lazy embeds');
  assert(main.querySelector('iframe[allowfullscreen]'), 'Video fullscreen support');
  assert(main.querySelector('.home-news-fallback a'), 'Persistent polling fallback');
  const decoratedLinks = [
    ...[...main.querySelectorAll('a')].map((a) => a.getAttribute('href')),
    ...frames.map((f) => f.getAttribute('src')),
  ].sort();
  assert(JSON.stringify(authoredLinks) === JSON.stringify(decoratedLinks), 'Preserve every destination');
  assert(
    JSON.stringify([...main.querySelectorAll('img')].map(imageIdentity).sort())
      === JSON.stringify(authoredImages),
    'Preserve image paths, alt text and dimensions',
  );
  assert(main.textContent.includes(source.querySelector('h1').textContent), 'Preserve lead headline');
  results.push('Embeds, fallbacks, images and destinations preserved');

  const missing = parse('<div class="columns home-news"></div><div class="columns home-directory"><div><div><h2>Topics</h2></div></div></div><div class="cards staff-picks"><div><div><h3>No category or image</h3></div></div></div>');
  missing.querySelectorAll('.columns').forEach(decorateColumns);
  missing.querySelectorAll('.cards').forEach(decorateCards);
  assert(!missing.querySelector('.staff-picks-category'), 'Do not invent optional categories');
  assert(!missing.querySelector('iframe'), 'Do not invent missing embeds');
  results.push('Missing cells, images, categories and collections');

  const generic = parse('<div class="columns"><div><div><picture><img src="/images/93da3275878da44896e24a163d606008.jpg" alt="Example"></picture></div><div><p>Text</p></div></div></div>');
  decorateColumns(generic.firstElementChild);
  assert(generic.querySelector('.columns-2-cols .columns-img-col'), 'Generic columns image decoration');
  const invalid = parse('<div class="columns home-news"><div><div></div><div><p><a href="https://example.com/embed/test">External</a></p><p><a href="https://www.youtube.com/embed/test">Video</a> plus other text</p><p><a href="http://www.youtube.com/embed/test">Insecure video</a></p></div></div></div>');
  decorateColumns(invalid.firstElementChild);
  assert(!invalid.querySelector('iframe'), 'Only supported standalone HTTPS embed links');
  assert(invalid.querySelectorAll('a').length === 3, 'Unsupported links remain usable');
  results.push('Generic columns and unsupported embed links unchanged');

  const nav = await fetch('/nav.plain.html');
  assert(nav.ok, `Navigation fixture failed: ${nav.status}`);
  const navigation = parse(await roundTrip(await nav.text()));
  assert(!navigation.querySelector('form, input, button'), 'Navigation authors a link, not raw controls');
  assert(navigation.querySelector('a[href="https://apnorc.org/?s="]'), 'Search authoring marker');
  results.push('DA-safe navigation search content');
  const footer = await fetch('/footer.plain.html');
  assert(footer.ok, `Footer fixture failed: ${footer.status}`);
  const footerContent = parse(await roundTrip(await footer.text()));
  ['mailto:info@apnorc.org', 'https://twitter.com/APNORC'].forEach((href) => {
    assert(footerContent.querySelector(`a[href="${href}"]`)?.textContent.trim(), 'Labeled footer contact links');
  });
  results.push('Footer contact links retain accessible text');
  return results;
}
