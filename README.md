# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--apnorcedge--lisongmeinorc.aem.page/
- Live: https://main--apnorcedge--lisongmeinorc.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start the local AP-NORC preview: `npm start`
1. Open the `apnorcedge` directory in your favorite IDE and start coding :)

Open <http://localhost:3000/> for the styled AP-NORC homepage. `npm start` serves the repository's local HTML content at the site root, including navigation and footer fragments. `/index.plain.html` serves the raw homepage fragment, not the rendered page.

Running plain `aem up` instead proxies remote preview content, which may still contain the default AEM tutorial until the migrated content is uploaded and previewed separately.

## DA authoring and deployment

DA content and GitHub code deploy separately. Publishing `index` in DA does not
deploy the CSS or JavaScript on a feature branch. Validate the matching code and
content at <https://feature-card-block--apnorcedge--lisongmeinorc.aem.page/>
before promoting code to `main`.

The homepage retains six `cards` / `columns` blocks and a trailing `metadata`
block. Author story and program collections as lists within the existing column
cells. Each item contains its category (optional), heading/link, summary
(optional), and image (optional). Keep the topic links as a list in the first
directory cell. Do not author `article` wrappers or inner styling classes:
the decorators generate these because DA/EDS normalization does not retain them.

In the second `columns home-news` cell, author a standalone, named link to the
AP polling-tracker embed or a YouTube `/embed/<id>` URL instead of raw iframe
HTML. Keep the polling explanation/fallback immediately after its embed link.
The decorator creates titled, lazy-loaded iframes only for these HTTPS providers.
Other links remain links. In the navigation utility section, author a standalone
`Search AP-NORC` link to `https://apnorc.org/?s=` instead of a form; the header
decorator creates the accessible search controls.
Footer contact links likewise use visible link text in authored content; the
footer decorator adds the existing email/Twitter icons and accessible labels.

For DA uploads, wrap each local fragment in
`<body><header></header><main>...</main><footer></footer></body>` and replace local
image URLs with the corresponding absolute asset URLs. Retain the original
image bytes, alt text, block variants, row/cell structure, and metadata.
Upload source documents as `index.html`, `nav.html`, and `footer.html`, not
`*.plain.html`. Preview and publish are separate, explicitly authorized actions.

### Homepage regression checks

With `npm start` running, open the local homepage and run this in the browser's
developer console:

```js
await (await import('/test/homepage.test.js')).default();
```

The checks cover the six block identities, class-free authored content,
collection decoration, embeds/fallbacks, link/image preservation, missing
optional fields, generic columns, the navigation search marker, and footer
contact labels. The test runner also accepts an HTML round-trip function to
validate against the DA parser/serializer without uploading any content.
Also check desktop/mobile navigation and search interactions in the browser.
