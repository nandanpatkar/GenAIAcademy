# Project documentation

The project documentation is delivered **inside the app**, under the sidebar's
**About → Documentation** entry — not as a separate static site.

That choice follows a pattern this repo already uses for the LangChain, Strands,
AWS AgentCore and exam archives: a bundled navigation index, page bodies fetched
as markdown on demand, and one shared markdown renderer. It adds no new build
step, no second toolchain, and roughly 10 KB to the bundle.

## Where things live

| Path | What it is |
|---|---|
| `public/project-docs/*.md` | The twelve page bodies. Fetched on demand, never bundled |
| `public/docs-shots/*.jpg` | Screenshots, captured from the app running locally |
| `src/data/documentationNav.js` | The nav index — sections, slugs, titles, blurbs. The only bundled part |
| `src/components/Documentation.jsx` | The viewer: rail, reading column, TOC, prev/next, search |
| `src/styles/Documentation.css` | Accent overrides and the two classes the shared sheet lacks |

Rendering, code blocks, callouts, Mermaid, tables and click-to-zoom figures all
come from `src/components/LangChainMarkdown.jsx` and `src/styles/LangChainDocs.css`,
which the viewer reuses rather than duplicating.

## Running it

No separate command. Start the app and open **About → Documentation**:

```bash
npm run build:reference   # first run only
npm run dev
```

Markdown is served straight from `public/`, so editing a page and refreshing is
the whole edit loop — no rebuild.

## Adding a page

1. Write `public/project-docs/<slug>.md`. Open it with a single `# Title` — the
   viewer strips that heading and renders the title from the nav index, so it is
   there purely to keep the file readable on disk.
2. Add an entry to the right section in `src/data/documentationNav.js`:

```javascript
{ slug: "my-page", title: "My page", blurb: "One line for the reading pane." }
```

Ordering, prev/next, the "on this page" rail and search all follow from that.

## What the markdown supports

| Syntax | Renders as |
|---|---|
| GitHub tables, lists, fenced code | Standard prose with syntax highlighting |
| ```` ```mermaid ```` | A rendered diagram |
| `> [!NOTE]`, `[!WARNING]`, `[!IMPORTANT]`, `[!CAUTION]` | Callouts |
| ```` ```lc-cards ```` with a JSON array | A card grid |
| `![Caption](/docs-shots/name.jpg)` | A figure with caption and click-to-zoom |
| `[text](doc:<slug>)` | An in-viewer cross-link |
| `## Heading` | An entry in the "on this page" rail |

`doc:` links are translated to the renderer's own `lc:` scheme on load. A link to
a slug that does not exist renders as plain text rather than a dead link.

## Screenshots

Screenshots live in `public/docs-shots/` and were captured from the app running
on `localhost:5173` at 1600×950, saved as JPEG (quality 82) to keep the repo
small — the whole set is about 1.4 MB.

To refresh one, run the app, navigate to the surface, and replace the file
keeping the same name. Note that curriculum-driven panels (the roadmaps in
particular) render empty without live Supabase data, which is why no roadmap
screenshot is included.

## Related documents

`docs/DOCUMENTATION_PROMPT.md` is the specification this section was built from.
`docs/DOCUMENTATION_ANALYSIS.md` records what the analysis found, including
issues in the repository that are worth fixing separately.
