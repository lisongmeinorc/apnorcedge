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
