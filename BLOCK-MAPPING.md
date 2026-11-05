# Homepage block mapping

This document maps the AP-NORC homepage areas represented in the local
`index.plain.html` to their EDS sections, blocks, and implementation files.
It describes the current local implementation, not a new comparison against the
live source page.

Source site: <https://apnorc.org/>

## DA-safe authoring

The six block identities and their row/cell structure are unchanged. Repeating
stories and signature programs are authored as lists inside their existing
column cells. The columns decorator creates article wrappers and styling hooks
at runtime; inner classes and `article` HTML are not authoring inputs.
Staff Picks category classes are likewise inferred by the cards decorator.

The polling tracker and YouTube embed are authored as standalone named links
in the second `columns home-news` cell. The columns decorator creates the
iframes, preserving the authored polling fallback and video link. Search is
authored as a `https://apnorc.org/?s=` link in the navigation utility section;
the header decorator creates the form. Footer icon links use authored text,
with icons and accessible labels supplied by the footer decorator.

The older implementation/diagnosis notes below are historical where they
describe raw iframes, authored articles, or unavailable navigation/footer.
See [README.md](./README.md#da-authoring-and-deployment) for current deployment
and test instructions. Content publication does not deploy feature-branch CSS:
the matching code must be reviewed and promoted separately.

## Mapping

| Source page area | EDS section or block | Generated files / existing dependencies | Notes |
| --- | --- | --- | --- |
| Featured stories: secondary stories, main election-confidence story, and In the News sidebar | Section 1: `cards vertical`, `cards vertical featured`, and `columns` | New: `index.plain.html`; three images under `images/`. Modified: `blocks/cards/cards.css`, `styles/styles.css`. Reused: `blocks/cards/cards.js`, `blocks/columns/columns.js`, and `blocks/columns/columns.css`. | The section contains sibling blocks, not nested blocks: a vertical cards collection for secondary stories, a single featured vertical card for the lead story, and a one-column `columns` block for the text-only In the News sidebar. Desktop displays secondary/lead/sidebar; smaller screens place the lead first. |
| The Latest research list | Section 2: first cell of `columns home-news` | New content: `index.plain.html`; three images under `images/`. Modified: `styles/styles.css`. Reused unchanged: `blocks/columns/columns.js`, `blocks/columns/columns.css`. | Three article entries contain category, heading, summary, and thumbnail, followed by View all Research. `home-news` is a variant class on the existing `columns` block, not a separate block implementation. |
| Seeing the numbers: polling trends and anniversary video | Section 2: second cell of the same `columns home-news` block | New content: `index.plain.html`. Modified: `styles/styles.css`. Reused unchanged: the `columns` block. | Uses direct external AP polling-tracker and YouTube iframes, explanatory fallback text, and outbound links. No custom chart, video, or embed block was generated. The two section columns stack below 900px. |
| Staff Picks | Section 3: default-content heading followed by `cards staff-picks horizontal` | New content: `index.plain.html`; three images under `images/`. Modified: `styles/styles.css`, `blocks/cards/cards.css`. Reused unchanged: `blocks/cards/cards.js`. | Three cards use image and text cells. The existing cards decorator converts rows into list items and creates optimized pictures. `horizontal` places each card's image on the left; `staff-picks` supplies section typography. Cards form three columns on desktop, one column below 900px, and stack image-over-text below 600px. |
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

- The content contains four top-level section divs and six block instances:
  three `cards` and three `columns`.
- EDS decoration creates section/container and block-wrapper classes such as
  `cards-container`, `columns-container`, `home-news-container`,
  `cards-wrapper`, and `home-directory-container`; these are not additional
  authored blocks.
- `scripts/scripts.js` runs auto-blocking before section and block decoration.
  It then loads the block implementations and their styles through the existing
  EDS helpers. No changes were made to the vendored `scripts/aem.js`.
- Homepage-specific variants reuse the existing `columns` and `cards`
  decorators, with additional styling in `styles/styles.css` and
  `blocks/cards/cards.css`.
- Homepage content uses existing card and column blocks for the featured
  section rather than a custom featured-news implementation.

## Cards block fields and variants

Each cards row is one card. The current model uses an image cell and a text cell;
the text cell contains an optional category/eyebrow and a linked heading.

| Field | Requirement | Authoring notes |
| --- | --- | --- |
| Image | Required for image-led cards | Supply alternative text; use empty alt text only when the image is decorative. |
| Category / eyebrow | Required for the current Staff Picks design; optional for the reusable block | Use a short topic label. A category link is optional. |
| Headline | Required | The heading's link supplies the visible link text and destination. |
| Link URL | Required for a navigable card | Add the destination to the headline link; image may link to the same destination. |
| Link text | Optional | A separate link label is only needed when the design includes a distinct CTA. |
| Open in new tab | Optional | Set on the authored link when needed; otherwise links retain the default same-tab behavior. |
| Description / summary | Optional | Include supporting text in the text cell only when the design calls for it. |

Supported block classes are CSS variants; they do not add configuration cells:

| Block class | Layout |
| --- | --- |
| `cards` | Default image-over-text cards in an auto-filling grid. |
| `cards vertical` | Image above text in a single-column stack, suitable for a narrow column. |
| `cards featured` | Single, larger vertical card with a wide image and prominent heading. Use one authored row. |
| `cards horizontal` | Three desktop columns with each card's image on the left; one column below 900px and image-over-text below 600px. |
| `cards horizontal-right` | Same responsive layout as `horizontal`, with the image on the right at wider widths. |

`staff-picks` is an additional content/style class used with `horizontal` on the
homepage; it is not required for other card collections. The featured stories
section uses separate sibling blocks: `cards vertical featured-news-secondary`,
`cards vertical featured featured-news-lead`, and `columns featured-news-sidebar`.
The project has no dedicated text-only news/sidebar block; the existing
`columns` block is used as a single-column wrapper for that authored content.

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
