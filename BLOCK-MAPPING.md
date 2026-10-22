# Homepage block mapping

This document maps the AP-NORC homepage areas represented in the local
`index.plain.html` to their EDS sections, blocks, and implementation files.
It describes the current local implementation, not a new comparison against the
live source page.

Source site: <https://apnorc.org/>

## Mapping

| Source page area | EDS section or block | Generated files / existing dependencies | Notes |
| --- | --- | --- | --- |
| Featured stories: secondary stories, main election-confidence story, and In the News sidebar | Section 1: custom `featured-news` block | New: `index.plain.html`, `blocks/featured-news/featured-news.js`, `blocks/featured-news/featured-news.css`; three images under `images/`. Modified: `styles/styles.css`. | One authored row contains three cells: secondary stories, lead story, and news sidebar. The decorator assigns semantic layout classes. Desktop displays three columns; smaller screens place the lead story first, followed by secondary stories and the sidebar. The sidebar uses text links rather than separate nested blocks. |
| The Latest research list | Section 2: first cell of `columns home-news` | New content: `index.plain.html`; three images under `images/`. Modified: `styles/styles.css`. Reused unchanged: `blocks/columns/columns.js`, `blocks/columns/columns.css`. | Three article entries contain category, heading, summary, and thumbnail, followed by View all Research. `home-news` is a variant class on the existing `columns` block, not a separate block implementation. |
| Seeing the numbers: polling trends and anniversary video | Section 2: second cell of the same `columns home-news` block | New content: `index.plain.html`. Modified: `styles/styles.css`. Reused unchanged: the `columns` block. | Uses direct external AP polling-tracker and YouTube iframes, explanatory fallback text, and outbound links. No custom chart, video, or embed block was generated. The two section columns stack below 900px. |
| Staff Picks | Section 3: default-content heading followed by `cards staff-picks` | New content: `index.plain.html`; three images under `images/`. Modified: `styles/styles.css`. Reused unchanged: `blocks/cards/cards.js`, `blocks/cards/cards.css`. | Three cards use image and text cells. The existing cards decorator converts rows into list items and creates optimized pictures. `staff-picks` is a styling variant, not a separate block. Cards form three columns on desktop and one column below 900px. |
| Specialty Topics | Section 4: first cell of `columns home-directory` | New content: `index.plain.html`. Modified: `styles/styles.css`. Reused unchanged: the `columns` block. | Contains a heading, 12 topic links, and View All Topics. Topic links use a three-column grid on desktop and two columns below 900px. No separate topic-list block was generated. |
| Signature Programs | Section 4: second cell of the same `columns home-directory` block | New content: `index.plain.html`; two images under `images/`. Modified: `styles/styles.css`. Reused unchanged: the `columns` block. | Contains two image-and-title program entries and View All Signature Programs. Entries are authored articles, not nested cards blocks. The directory columns stack below 900px. |
| Site navigation / header | Page shell: existing `header` block, outside the four content sections | Reused unchanged: `head.html`, `scripts/scripts.js`, `blocks/header/header.js`, and existing header styles. No local navigation content file was generated. | The CLI supplies the header wrapper for the local preview. The default `/nav.plain.html` content request returned 404 during diagnosis, so navigation content remains unavailable. |
| Site footer | Page shell: existing `footer` block, outside the four content sections | Reused unchanged: `scripts/scripts.js`, `blocks/footer/footer.js`, and existing footer styles. No local footer content file was generated. | The CLI supplies the footer wrapper. The default `/footer.plain.html` content request returned 404 during diagnosis, so footer content remains unavailable. |

## Image mapping

All 11 images are new, currently untracked assets referenced by
`index.plain.html`.

| Source page area | Generated image files |
| --- | --- |
| Featured stories | `images/8c7902b98d90b48d305f292cb82f3550.jpg`, `images/77cf8cb137d0c1f5fe7750de2a9bf82b.jpg`, `images/2c00fd399bc5344530e44b204ea2e238.jpg` |
| The Latest | `images/39f1dbd04baf5a2dc68cf3bef9b9d148.jpg`, `images/93da3275878da44896e24a163d606008.jpg`, `images/fcc19ebb73f6dbf4580d1c8d0ad988c9.jpg` |
| Staff Picks | `images/6d62fa778553a1adbe39ac6922852842.jpg`, `images/d6aca3875b92a0352aa24f116649add0.jpg`, `images/1cb1ef7be212bc62bb88fc01cfad1ece.png` |
| Signature Programs | `images/0447beb473c67f214bfe3ab9330ffe33.png`, `images/504d85820d2c8a0f0f4fa9314147ebaf.png` |

## Section and decoration notes

- The content contains four top-level section divs and four block instances:
  one `featured-news`, two `columns`, and one `cards`.
- EDS decoration creates section/container and block-wrapper classes such as
  `featured-news-container`, `featured-news-wrapper`, `home-news-container`,
  `cards-wrapper`, and `home-directory-container`; these are not additional
  authored blocks.
- `scripts/scripts.js` runs auto-blocking before section and block decoration.
  It then loads the block implementations and their styles through the existing
  EDS helpers. No changes were made to the vendored `scripts/aem.js`.
- Only `featured-news` has a new block implementation. Homepage variants of
  `columns` and `cards` reuse existing decorators, with additional styling in
  `styles/styles.css`.
- Homepage content and the implementation files above predate this mapping
  document; creating this document does not modify them.

## Local preview

From the repository root:

```sh
aem up --html-folder . --html-mount / --no-open
```

Open <http://localhost:3000/>. The CLI wraps `index.plain.html` with the page
shell and `head.html`, which loads the EDS scripts and stylesheet. Opening
`/index.plain.html` directly serves the raw fragment instead.

This local preview does not require external content-source configuration.
Normal remote-proxy preview and the hosted homepage still require external site
configuration. Local header and footer content remain missing as noted above.
