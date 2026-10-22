# File change details

This report describes the working-tree changes observed on October 22, 2026.
The homepage, styles, images, README changes, and skill directories listed below
already existed before the preview diagnosis. The diagnosis changed no project
files. This report is the only file created in response to the documentation
request.

## Modified files

| File | Description |
| --- | --- |
| `README.md` | Adds a local-development note explaining the root-route 404 and linking to `/index.plain.html`. That URL serves raw content, not the styled and decorated homepage; see the preview instructions below. |
| `styles/styles.css` | Adds homepage layout and responsive styling for the featured-news section, latest research, trends embeds and fallback text, staff picks, specialty topics, and signature programs. |

## New homepage files

These files are currently untracked by Git.

| File | Description |
| --- | --- |
| `index.plain.html` | Local homepage content fragment containing featured stories, an In the News sidebar, latest research, polling trends and video embeds, staff picks, specialty-topic links, and signature programs. Uses the `featured-news`, `columns`, and `cards` blocks. |
| `blocks/featured-news/featured-news.js` | Decorates the first block row by assigning layout classes to the secondary stories, lead story, and news sidebar. Guards against a missing row and omitted cells. |
| `blocks/featured-news/featured-news.css` | Defines the featured-news typography, imagery, category labels, separators, and sidebar styling. Uses a stacked layout on smaller screens and a three-column layout at widths of 900px and above. |

## New image assets

All images below are currently untracked and referenced by `index.plain.html`.
Descriptions reflect their use and alternative text in that file.

| File | Homepage use |
| --- | --- |
| `images/8c7902b98d90b48d305f292cb82f3550.jpg` | Featured AAPI Data story: voters at a polling place. |
| `images/77cf8cb137d0c1f5fe7750de2a9bf82b.jpg` | Featured politics story: United States Capitol building. |
| `images/2c00fd399bc5344530e44b204ea2e238.jpg` | Lead story: election workers counting ballots. |
| `images/39f1dbd04baf5a2dc68cf3bef9b9d148.jpg` | Latest research: people at a public event. |
| `images/93da3275878da44896e24a163d606008.jpg` | Latest research: technology research site. |
| `images/fcc19ebb73f6dbf4580d1c8d0ad988c9.jpg` | Latest research: campaign sign outside a building. |
| `images/6d62fa778553a1adbe39ac6922852842.jpg` | Staff picks: teenagers in a classroom. |
| `images/d6aca3875b92a0352aa24f116649add0.jpg` | Staff picks: wind turbines. |
| `images/1cb1ef7be212bc62bb88fc01cfad1ece.png` | Staff picks: young people learning about news and media. |
| `images/0447beb473c67f214bfe3ab9330ffe33.png` | Signature programs: journalists and members of the public in discussion. |
| `images/504d85820d2c8a0f0f4fa9314147ebaf.png` | Signature programs: participants in an AAPI Data event. |

## New supporting directories

These existing untracked directories are grouped rather than listing every
supporting file individually.

| Directory | Description |
| --- | --- |
| `.agents/` | Contains 1,387 skill and supporting files, including the AEM CLI, preview-import, and content-driven-development documentation consulted during diagnosis. These are assistant resources, not homepage runtime assets. |
| `.claude/` | Contains 1,387 skill and supporting files for the Claude integration, including corresponding AEM development documentation. These are not homepage runtime assets. |

## Preview diagnosis and correct local workflow

Run this command from the repository root using the installed AEM CLI:

```sh
aem up --html-folder . --html-mount / --no-open
```

Open **http://localhost:3000/** for the styled homepage with block-decoration
scripts. The CLI resolves the root route to `index.plain.html`, wraps it in a
complete HTML document, and includes `head.html`. That head loads
`/styles/styles.css`, `/scripts/aem.js`, and `/scripts/scripts.js`.

Opening **http://localhost:3000/index.plain.html** directly serves the raw
fragment instead.

Plain `aem up` proxies the root route to the remote preview. During diagnosis,
`https://main--apnorcedge--lisongmeinorc.aem.page/` returned HTTP 404 with
`x-error: Missing configuration (404)`. External site/content-source
configuration is required for the hosted homepage and normal remote-proxy
workflow, but not for the local HTML-folder preview above.

The local root response included the stylesheet and scripts, and the
featured-news JavaScript and CSS were available. Navigation and footer content
were still unavailable: `/nav.plain.html` and `/footer.plain.html` returned 404.
The temporary diagnostic server was stopped.

## Files inspected but not changed

`AGENTS.md`, `package.json`, `head.html`, `.hlxignore`, `scripts/scripts.js`,
`blocks/header/header.js`, and `blocks/footer/footer.js` were inspected but not
modified. The installed AEM CLI help and routing implementation were also
inspected without modification.

No preview configuration, package scripts, or application code were changed as
part of the diagnosis or this documentation request.
