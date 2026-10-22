# AP-NORC Homepage Migration Summary

## Overview and status

The homepage from <https://apnorc.org/> has been adapted to AEM Edge Delivery
Services (EDS) in `lisongmeinorc/apnorcedge`, using local HTML content, reusable
blocks, imported images, and shared navigation/footer fragments. No runtime
dependencies or build step were added.

This handoff reflects repository inspection on October 22, 2026. Migration work
is partly committed in `576d1b3` and `33627b9`; the remaining working-tree files
are identified below. Hosted deployment and production validation have **not**
been verified.

## Local preview and architecture

From the repository root, start the styled, decorated local preview:

```sh
aem up --html-folder . --html-mount / --no-open
```

Open <http://127.0.0.1:3000/>. The CLI wraps `index.plain.html` with the document
shell and `head.html`; opening `/index.plain.html` directly serves raw content.
The README's raw-fragment URL is not the fully rendered preview.

| Content section | EDS implementation | Contents |
| --- | --- | --- |
| Featured news | `featured-news` | Lead election story, two secondary stories, and In the News sidebar. Source/reading order is lead-first; desktop grid displays secondary/lead/sidebar. |
| Research and trends | `columns home-news` | The Latest research list, polling-tracker iframe with persistent fallback, and anniversary YouTube iframe/link. |
| Staff Picks | Heading plus `cards staff-picks` | Three image-and-text research cards. |
| Topics and programs | `columns home-directory` | Twelve specialty-topic links and two signature-program entries. |

A separate trailing metadata table supplies title, description, canonical URL,
and sharing image; it is not a fifth rendered content section. `head.html` adds
shared Open Graph/Twitter fields. The canonical and sharing image currently
reference the verified source site.

### Shared header/footer lifecycle

The existing `scripts/scripts.js` lifecycle is retained: `decorateMain()` handles
icons, auto-blocking, sections, and blocks; lazy loading invokes `loadHeader()`
and `loadFooter()`. Each shared block uses `loadFragment()` from
`blocks/fragment/fragment.js` to fetch and decorate `/nav.plain.html` or
`/footer.plain.html`. Existing `nav`/`footer` metadata path overrides remain
supported. Shared markup is not duplicated in homepage content.

The header provides the official logo, eight topic links, utility links,
expandable desktop search, and mobile navigation below 1024px. Search submits
GET requests to `https://apnorc.org/` with parameter `s`. The mobile menu supports
focus trapping/restoration, Escape, inert background content, and listener/modal
cleanup. A keyboard-visible skip link focuses main content.

The footer groups center/contact links, signature programs, specialty topics,
copyright, and Terms. Groups stack below 768px. Email and Twitter links display
source-site vector glyphs with accessible labels and tooltips. The legacy Media
Insight destination is replaced by
<https://apnorc.org/projects/the-media-insight-project/>.

## File inventory

Inventory combines Git history, current status, and actual runtime files; it is
not limited to the current diff.

### Content, blocks, styles, and documentation

| Files | Purpose and current state |
| --- | --- |
| `index.plain.html` | Added homepage, later corrected links/order/alts/dimensions, metadata, iframe label, and fullscreen permission; tracked and clean. |
| `nav.plain.html` | Added shared navigation, search, and contact content; **untracked**. |
| `footer.plain.html` | Added shared footer, corrected project link, and icon markup; tracked and clean. |
| `blocks/featured-news/featured-news.js`, `blocks/featured-news/featured-news.css` | Added custom responsive block; decorator handles omitted cells and removes generated paragraph wrappers around articles; tracked and clean. |
| `blocks/header/header.js`, `blocks/header/header.css` | Extended existing block with responsive navigation, search, skip link, accessibility, and cleanup; tracked and clean. |
| `blocks/footer/footer.js`, `blocks/footer/footer.css` | Extended fragment decoration with footer groups and scoped responsive/icon styles; **modified, uncommitted**. |
| `blocks/cards/cards.js` | Reused existing cards decorator and preserved image dimensions during picture optimization; tracked and clean. |
| `styles/styles.css` | Homepage variants, corrected section selectors, category contrast, embed sizing, and responsive header reservation; modified during migration, now tracked and clean. |
| `head.html` | Charset and shared social metadata; modified during migration, now tracked and clean. |
| `README.md` | Earlier preview diagnosis note; tracked and clean, but retains the raw-fragment preview advice noted above. |
| `FILE-CHANGES.md`, `BLOCK-MAPPING.md` | Added earlier migration records; tracked and clean. Historical statements about missing shared fragments, untracked images, cell order, unchanged cards, and variant-container classes are superseded by this handoff/code. |
| `MIGRATION_SUMMARY.md` | This new developer handoff. |

Reused unchanged: `blocks/columns/columns.js`, `blocks/columns/columns.css`,
`blocks/cards/cards.css`, and `blocks/fragment/fragment.js` plus its CSS.
`scripts/scripts.js` and vendored `scripts/aem.js` were not modified.
Other existing blocks and assistant skill directories are not migration runtime
changes. No package manifest or lockfile changes were needed.

### Imported images and icons

All paths below are relative to the repository root. The eleven raster images
are tracked and clean.

| Area | Files |
| --- | --- |
| Lead story | `images/2c00fd399bc5344530e44b204ea2e238.jpg` |
| Secondary stories | `images/8c7902b98d90b48d305f292cb82f3550.jpg`, `images/77cf8cb137d0c1f5fe7750de2a9bf82b.jpg` |
| Latest research | `images/39f1dbd04baf5a2dc68cf3bef9b9d148.jpg`, `images/93da3275878da44896e24a163d606008.jpg`, `images/fcc19ebb73f6dbf4580d1c8d0ad988c9.jpg` |
| Staff Picks | `images/6d62fa778553a1adbe39ac6922852842.jpg`, `images/d6aca3875b92a0352aa24f116649add0.jpg`, `images/1cb1ef7be212bc62bb88fc01cfad1ece.png` |
| Signature programs | `images/0447beb473c67f214bfe3ab9330ffe33.png`, `images/504d85820d2c8a0f0f4fa9314147ebaf.png` |
| Official logo | `images/apnorc-logo.svg` - original downloaded SVG; **untracked**. |
| Footer icons | `icons/email.svg`, `icons/twitter.svg` - vectors from the source site's icon font, with attribution retained; **untracked**. |

## Validation record

Results below are from completed local migration checks earlier in this session,
not new tests performed while writing this document.

| Check | Result |
| --- | --- |
| Chromium responsive checks at 320, 390, 768, 900, 1024, and 1280px | Passed: four rendered sections, no horizontal overflow, all homepage images loaded, footer groups available. Screenshots inspected at 390/768/1280px. |
| Menu/search interactions at 390/768/1280px | Passed where applicable: mouse/touch opening and closing, keyboard operation, focus wrapping/restoration, Escape, search submission, resize cleanup, and removal cleanup. |
| Accessibility/structure checks | Passed targeted checks: skip-to-main focus, lead-first H1/reading order, mobile visual/tab order, image alternatives/dimensions, removal of invalid article wrappers, iframe labels, and video fullscreen attribute. Staff-category contrast measured 4.92:1. |
| Footer icon follow-up at 390/768/1280px | Passed: both icons loaded at 20px, correct destinations and accessible labels, focusability, and no horizontal overflow or application exceptions; screenshots saved. |
| Browser errors/resources | No application exceptions or failed local resource requests observed during remediation. External polling tracker returned 403, as expected. |
| HTTP checks | Homepage, navigation fragment, footer fragment, and logo returned 200. Replacement Media Insight page and sharing image returned 200. |
| Link audit | Navigation, article, footer, social, and subscription destinations reviewed; legacy timeout replaced. Email delivery and subscription completion were not tested. |
| `npm run lint` | Passed after remediation and again after the footer icon update. |
| `git diff --check` | Passed after remediation and the footer icon update. |
| Automated unit tests | Not run: no `test` script is defined. No test framework was added. |
| Hosted/cross-browser/assistive-technology checks | Not performed: no hosted release validation, Firefox/Safari matrix, screen-reader audit, formal WCAG certification, Lighthouse/field performance run, or end-to-end video fullscreen playback test. |

Browser JSON and screenshot evidence was saved outside the repository in the
session workspace; it is not a committed regression suite.

## Known limitations

- **Hosted EDS configuration:** normal `aem up` proxies to remote preview, which
  returned 404/Missing configuration during diagnosis. Authorized external
  site/content-source setup is still required; local HTML-folder preview does
  not establish a working hosted publishing workflow.
- **Polling tracker:** the external iframe returns 403. Its original URL/data
  are retained without bypassing access controls. The visible fallback links
  to the working AP-NORC polling-trends page.
- **Layout shifts:** responsive header reservation removed the observed
  header-induced main-content shift. Small residual shifts remain; summed
  recorded entries ranged approximately 0.001-0.029 across the six local
  viewport runs. These observations are not a field CLS or Lighthouse score,
  and their remaining causes have not been conclusively isolated.
- **Visual/content fidelity:** Georgia substitutes for the source site's
  proprietary heading face. The power-station thumbnail uses a 150px source
  variant. Content is a migration snapshot, not a synchronized source feed.

## Recommended next steps

1. Review the complete migration and remaining diff, including accessibility,
   fragment content, outbound destinations, icon attribution, and assets.
   Reconcile the older README/mapping documents in a separate approved change.
2. Explicitly stage the intended files, including untracked navigation/logo/icons,
   and commit only after review. Do not assume the existing migration commits
   contain the complete working implementation.
3. With authorized external access, configure the EDS content source, make the
   homepage and shared fragments available through the publishing workflow, and
   verify metadata/canonical policy. Do not invent retired local configuration.
4. Validate an actual branch preview at
   `https://{branch}--apnorcedge--lisongmeinorc.aem.page/`; include that URL in
   any subsequent PR. Repeat local checks plus hosted resource, metadata,
   keyboard, browser/assistive-technology, and performance checks.
5. Obtain release approval before merging. Code shipping and content publishing
   are separate operations; verify both and perform a post-release smoke test.
   This documentation task creates no commit, PR, deployment, or release.
