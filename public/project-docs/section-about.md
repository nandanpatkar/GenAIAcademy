# About

## Documentation

![This documentation section.](/docs-shots/sections/documentation.jpg)

Sets `showDocumentation`; the panel is `src/components/Documentation.jsx`.

The section you are reading. It renders the pages in `public/project-docs/`, indexed by `src/data/documentationNav.js`.

## How it is built

It follows the same pattern as the archive viewers rather than introducing a second one:

| Concern | Where |
|---|---|
| Navigation index (bundled) | `src/data/documentationNav.js` |
| Page bodies (fetched on demand) | `public/project-docs/*.md` |
| Screenshots | `public/docs-shots/` |
| Rendering | `src/components/LangChainMarkdown.jsx`, reused |
| Layout and prose styles | `src/styles/LangChainDocs.css`, reused |
| Accent and rail overrides | `src/styles/Documentation.css` |

The bundled chunk is about 9 KB because none of the prose is in it.

## Authoring

Add `public/project-docs/<slug>.md`, then add `{ slug, title, blurb }` to the right section in `documentationNav.js`. Ordering, prev/next, the "on this page" rail and search all follow from the index.

Markdown supports GitHub tables, fenced code, `mermaid` diagrams, `> [!NOTE]`-style callouts, `lc-cards` blocks, figures with captions, and `doc:<slug>` cross-links. Each file opens with its own `# Title`, which the viewer strips because it renders the title from the index — the heading is there so the file still reads standalone on disk.

`docs/README.md` covers this in full, and `docs/DOCUMENTATION_ANALYSIS.md` records what the analysis behind these pages found.
