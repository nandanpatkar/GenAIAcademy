# LangChain Docs (Python) in the "Agents" sidebar section — SHIPPED

> **Status: implemented.** See §9 for what the build actually produced and
> where it diverged from the plan below.

**v2.** Revised for three changes: Python only, lives in the main `genai-roadmap`
sidebar under a new **Agents** section, and is styled after docs.langchain.com.

---

## 0. What changed from v1, and why it matters

v1 targeted the standalone `Claude Certeficate` app. The real target is this
repo — which changes the plan substantially, mostly in our favour:

| v1 assumed | Reality in `genai-roadmap-src` |
|---|---|
| Hand-write a markdown parser (React-only, no deps) | `react-markdown@10` + `remark-gfm@4` already installed |
| Hand-write a ~150-line syntax tokenizer | `react-syntax-highlighter@16` already installed |
| Defer mermaid — too heavy a dependency | `mermaid@11` installed **and** [MermaidDiagram.jsx](src/components/MermaidDiagram.jsx) exists → 99 diagrams render for real, in Phase 1 |
| Invent a docs-viewer architecture | **[AgentCoreViewer.jsx](src/components/AgentCoreViewer.jsx) is exactly this feature already**, for the AWS AgentCore guide — 516 pages, same shape |

The last row is the important one. `scripts/build_agentcore_samples.py` →
`src/data/agentcoreData.js` + `public/agentcore/md/*.md` + on-demand `fetch` in
the viewer, with markdown rendering factored into
[AgentCoreMarkdown.jsx](src/components/AgentCoreMarkdown.jsx) — that is the
house pattern for "docs folder → sidebar-navigable reader," and this plan
follows it rather than inventing a second one.

---

## 1. Source material (measured)

**Content:** `LangChain-website/` — Mintlify MDX exported to `.md` with all
snippets pre-inlined, so every page is self-contained.

**Navigation:** `Claude Certeficate/Langchain/src/docs.json` — the real Mintlify
nav config (products → menus → dropdowns → tabs → groups), with per-item icons
and `Beta` tags.

Dropping JavaScript resolves the plan's one loose end from v1:

| | All languages | **Python only** |
|---|---|---|
| Nav slugs | 888 | **690** |
| Resolvable against the archive | 850 (38 broken) | **690 — all of them** |
| `:::python` / `:::js` blocks | 1222 / 1132 | keep python, drop js |
| Referenced assets | 466 → 308 MB | **464 → 306 MB** |

The 38 unresolvable slugs in v1 were *all* `oss/javascript/**`. Python-only
means zero dead nav entries.

Constructs the renderer must handle (counts across the corpus):
`<Note>` 1110 · `<Warning>` 465 · `<Tip>` 408 · `<Info>` 231 · `<Columns>` 57 ·
`<Card>` 28 · `<Expandable>` 17 · `<Accordion>` 2 · code fences ~12,000
(7434 python, 2228 bash, 1049 typescript, 263 json, 178 yaml, **99 mermaid**) ·
464 image refs · heavy internal cross-linking.

**Brand assets are all present locally** — `docs.json` gives the exact palette
(primary `#161F34`, light `#7FC8FF`, dark `#006DDD`, dark bg `#030710`), and
`LangChain-website/assets/images/brand/` holds per-product icons
(`langchain-icon.png`, `langgraph-icon.png`, `deep-agents-icon.png`,
`evaluation-`, `observability-`, `deployment-`, `fleet-`, `engine-`), which the
sidebar subsections use directly. `Langchain/src/fonts/` has the real TWK
Lausanne woff2 family. (Licensing note in §6.)

---

## 2. Change #2 — the "Agents" sidebar section

The sidebar is registry-driven: [sidebarRegistry.js](src/config/sidebarRegistry.js)
defines `SIDEBAR_ITEM_REGISTRY` (id → icon/label/description) and
`DEFAULT_SIDEBAR_LAYOUT` (groups → itemIds); [sidebarNav.js](src/config/sidebarNav.js)
maps ids to `App.jsx` view flags via `getActiveNavId` / `runNavClick`.

**New group, placed after `labs` and before `library`:**

```js
{ id: "agents", label: "Agents", itemIds: [
    "langchain", "langgraph", "deepagents", "langsmith",
    "aws_agentcore", "agent_library",
]}
```

New registry entries — each is a subsection landing inside one viewer, scoped to
one product:

| id | label | description |
|---|---|---|
| `langchain` | LangChain | Build agents with models, tools, and middleware |
| `langgraph` | LangGraph | Stateful graphs, persistence, and time travel |
| `deepagents` | Deep Agents | Long-horizon agents with skills and sandboxes |
| `langsmith` | LangSmith | Trace, evaluate, deploy, and monitor agents |

`aws_agentcore` and `agent_library` **move here** from `library` / `more_tools`
— they are agent surfaces, and the section reads as incomplete without them.
No behaviour change; only their group membership changes.

**Wiring** (four small, mechanical edits):
1. `sidebarRegistry.js` — add the four entries + the `agents` group.
2. `sidebarNav.js` `runNavClick` — reset `setShowLangChainDocs(false)` alongside
   the other resets, then one `case` per product setting
   `setLangChainProduct(id)` + `setShowLangChainDocs(true)`.
3. `sidebarNav.js` `getActiveNavId` — `if (p.showLangChainDocs) return p.langChainProduct;`
   (the product id *is* the nav id, so highlighting is free).
4. `App.jsx` — `showLangChainDocs` / `langChainProduct` state, added to the
   `savedViews` persistence list, a `React.lazy` import, and one render branch
   in the existing chain.

> **Trap to handle.** `resolveEffectiveLayout` dumps any registry id not present
> in a *saved* layout into `more_tools`. Every existing user has a saved layout,
> so without a migration the new items land in the wrong place. Follow the
> `LAB_ITEM_IDS` precedent already in that file ([lines 97–109](src/config/sidebarRegistry.js#L97-L109)):
> strip the agent ids from wherever they sit, then force-insert the `agents`
> group before `library`. This is why `aws_agentcore` moving groups is safe.

---

## 3. Phase 1 — Build script (`scripts/build_langchain_docs.py`)

Python 3, mirroring `build_agentcore_samples.py` conventions (same imports, same
PIL-optional handling, same "regenerate rather than hand-edit" header).

**3.1 Nav.** Walk `docs.json` `navigation.products[].menu[]`, keeping
product → menu → dropdown → tab → group depth, plus `icon` and `tag`. **Skip
every `oss/javascript/**` slug and the JS dropdown branches entirely.** Resolve
each remaining slug as `<slug>.md`, falling back to the language-stripped path
(`oss/python/deepagents/overview` → `oss/deepagents/overview.md`). Assign each
top-level branch to one of the four products so the sidebar subsections have
disjoint trees. Expect 690/690 resolved — **the script fails loudly if any slug
misses**, since we now know the correct number.

**3.2 Page normalization.** The corpus is MDX; `react-markdown` drops unknown
JSX. So the script lowers MDX to markdown that the renderer's component map can
intercept, choosing forms that **keep the body parseable as markdown** (nested
bold, links, and lists inside callouts must survive):

| Source | Emitted markdown | Rendered by |
|---|---|---|
| `<Note>`, `<Info>` | `> [!NOTE]` blockquote | `blockquote` override |
| `<Tip>` | `> [!TIP]` | ” |
| `<Warning>`, `:::caution` | `> [!WARNING]` | ” |
| `<Expandable>`, `<Accordion>` | `> [!DETAILS] Title` | ” → `<details>` |
| `<Columns>` + `<Card>` | ` ```lc-cards ` fenced JSON | `pre` override |
| ` ```python Anthropic ` runs | ` ```lc-tabs ` fenced JSON | `pre` override |
| `:::python … :::` | unwrapped inline | — |
| `:::js … :::` | **dropped** | — |
| unknown tag | tag stripped, children kept | — (never lose text) |

Card bodies are short label+description text, so JSON-in-a-fence costs nothing
there; callouts keep full markdown because blockquotes nest natively.

**3.3 Links.** `/oss/...` and `/langsmith/...` → in-app slugs, resolved against
the built page set. Unresolved internal links become
`https://docs.langchain.com/...` externals. Reuses the `resolveDoc` / `onDocLink`
contract `makeMarkdownComponents` already defines.

**3.4 Images.** `/oss/images/x.png` → `assets/oss/images/x.png` (mapping
verified). Copy to `public/langchain/images/`, rewrite `src`. Apply the
AgentCore budget rules — `MAX_IMAGE_WIDTH = 1400`, re-encode via PIL — which on
this corpus matters a lot:

- **439 files ≤ 2 MB = 73.6 MB** → ship (downscaling should cut this to ~15–20 MB).
- **25 files > 2 MB = 232.7 MB**, all LangSmith UI screencast GIFs (largest
  18.9 MB) → `build_agentcore_samples.py` simply excludes `.gif`. Here they are
  often the only illustration of a workflow, so instead: **keep them, but
  click-to-load.** The page renders a labelled placeholder ("▶ Play walkthrough ·
  18.9 MB") and sets `src` on click. Nothing heavy is ever fetched unattended.

**3.5 Emit.**
- `src/data/langchainDocsData.js` — nav tree, slug→{title, desc, product, file}, counts
- `public/langchain/md/<slug>.md` — normalized page bodies
- `public/langchain/images/**` — pruned, downscaled assets
- `build-report.json` — resolved/skipped counts, unknown tags, missing assets

**Checkpoint:** 690/690 pages, 0 unknown tags surviving, 0 unresolved internal
links, and five hand-checked pages (`oss/langchain/agents`,
`oss/langgraph/graph-api`, `oss/deepagents/overview`, `langsmith/evaluation`,
`oss/integrations/providers/overview`) losing no text.

---

## 4. Phase 2 — Viewer (`src/components/LangChainDocs.jsx`)

Modelled on `AgentCoreViewer` and reusing `makeMarkdownComponents` /
`extractToc` from `AgentCoreMarkdown.jsx`, extended with the four overrides from
§3.2. Same on-demand `fetch` + cache, same `localStorage` recents, same search
scoring, same lazy-loading.

Layout is three-column, as docs.langchain.com is:

```
┌ 264px ────────────┬─ article (max 52rem) ────────────┬ 220px ──┐
│ ◆ LangChain       │  Build › LangChain › Agents      │ On this │
│   Python docs     │                                  │  page   │
│ 🔍 Search    ⌘K   │  # Agents                        │  ─────  │
│                   │  An agent is a model calling…    │  Core   │
│ ▾ Get started     │                                  │   compo │
│     Overview      │  ┌ python ─────────── ⧉ Copy ─┐  │   Model │
│   ▸ Agents     ●  │  │ from langchain.agents…     │  │   Tools │
│   ▸ Models        │  └────────────────────────────┘  │  Config │
│ ▾ Core            │                                  │         │
│     Middleware    │  ⓘ Note — Agent = Model + Harness│         │
│     Tools   Beta  │                                  │         │
└───────────────────┴──────────────────────────────────┴─────────┘
```

New pieces beyond what AgentCore already provides:

- **`LcCodeTabs`** — provider-variant tab strip (Anthropic / OpenAI / Google /
  OpenRouter / Fireworks), the single most characteristic LangChain-docs
  element. Remembers the chosen provider across pages via `localStorage`.
- **`LcCallout`** — the four alert variants, icon + tinted left border.
- **`LcCards`** — bordered card grid with brand icons, hover lift, internal hrefs.
- **`LcMermaid`** — wraps the existing `MermaidDiagram` component; 99 diagrams
  render as real diagrams. *(Verify its prop contract in step 4 of §7.)*
- **Product switcher** in the rail header, since the sidebar enters scoped to
  one of four products but readers cross between them.
- **Scroll-spy TOC** via `IntersectionObserver` on the ids `extractToc` already
  produces.

---

## 5. Change #3 — LangChain visual design

Everything is scoped under a `.lc-root` class in `src/styles/LangChainDocs.css`,
mapping the brand palette onto the app's existing tokens (`--bg`, `--bg2`,
`--text`, `--border`, `--mono`) so **ThemeContext light/dark keeps working** —
the same discipline `AgentCore.css` documents in its header comment.

```css
.lc-root {
  --lc-accent:   #006DDD;   /* docs.json colors.dark  — links, active nav */
  --lc-accent-2: #7FC8FF;   /* colors.light — dark-mode accent */
  --lc-ink:      #161F34;   /* colors.primary — headings */
  --lc-canvas:   #FFFFFF;   /* background.color.light */
}
.lc-root[data-theme="dark"] { --lc-canvas: #030710; --lc-accent: #7FC8FF; }
```

Design decisions that make it read as LangChain rather than as a generic reader:

- **Typography** — TWK Lausanne 700 for headings over Inter body, the actual
  docs pairing. Self-hosted `@font-face` from `public/langchain/fonts/`.
- **Breadcrumb eyebrow** above every `h1` (`docs.json` sets
  `styling.eyebrows: "breadcrumbs"`).
- **Code theme** — `docs.json` specifies catppuccin-latte / catppuccin-mocha.
  `react-syntax-highlighter` doesn't ship those, but it accepts a plain style
  object, so a ~40-line catppuccin token map gives exact fidelity. Fallback if
  that's not worth it: bundled `oneLight` / `oneDark`.
- **Rail** — flat, quiet, 13px, tabler-style icons (`docs.json`
  `icons.library: "tabler"`); active page marked with a left accent bar and a
  tinted row, not a heavy pill. `Beta` tags render as small outline chips from
  the `tag` field.
- **Measure** 52rem, generous heading rhythm, hairline `--border` rules — the
  airy feel of the real site rather than this app's denser tool chrome.
- **Article motion** — a short fade/slide on page change via `framer-motion`
  (already a dependency, already used across the app).

Mobile: TOC drops below 1280px; rail becomes an off-canvas drawer below 1000px,
matching how `AgentCore.css` already handles the same breakpoints.

---

## 6. Decisions worth your input (not blocking — I have a default for each)

1. **TWK Lausanne is a commercial licensed font.** The files sit in the
   `Langchain` repo you cloned, but shipping them in your app is a licensing
   question I can't resolve for you. **Default if you don't say otherwise:**
   build with Inter (already loaded) for both, and leave a single-line
   `@font-face` block commented in the CSS so you can switch it on if your
   license covers it. Visual difference is small; legal difference isn't.
2. **The 25 heavy GIFs (233 MB).** Default is click-to-load, described in §3.4.
   Say the word if you'd rather drop them entirely (AgentCore's choice) and keep
   `public/` small.
3. **`langsmith` is 477 pages** — larger than the three OSS products combined,
   and much of it is platform/admin material (SSO, audit logs, RBAC) rather than
   learning material. Default is to ingest all of it but sort the learning tabs
   (Observability, Evaluation, Deployment) above the platform tabs in the rail.

---

## 7. Build order

| # | Step | Done when |
|---|---|---|
| 1 | Build script: nav only | 690/690 slugs resolve, 0 JS entries, tree splits cleanly into 4 products |
| 2 | Build script: MDX normalization | 5 spot-check pages lose no text; unknown-tag count is 0 |
| 3 | Build script: images + links | 464 assets copied/downscaled, 0 unresolved internal links, report clean |
| 4 | Markdown overrides + `MermaidDiagram` contract check | One page renders with callouts, provider tabs, images, a real mermaid diagram |
| 5 | `LangChainDocs.jsx` shell | Rail + article + scroll-spy TOC, search, prev/next all work |
| 6 | Sidebar wiring incl. layout migration | All four subsections appear under **Agents** for a *saved-layout* account, not just a fresh one |
| 7 | LangChain theming pass | Light and dark both correct; side-by-side against docs.langchain.com |
| 8 | Full-corpus + responsive + a11y | Every one of the 690 pages opens clean; keyboard nav through rail; no horizontal scroll at 360px |

## 8. Risks

- **`resolveEffectiveLayout` migration** — the highest-likelihood bug in the
  whole plan, and invisible on a fresh profile. Step 6 explicitly tests against
  an account with a saved `sidebarConfig.layout`.
- **`react-markdown` v10 `pre`/`code` semantics** — v10 dropped the `inline`
  flag, which `AgentCoreMarkdown.jsx` already works around ([lines 74–83](src/components/AgentCoreMarkdown.jsx#L74-L83)).
  Reusing that file inherits the fix; the new `pre` overrides must preserve it.
- **MDX nesting depth** — the tag lowering assumes ≤2 levels. Step 2 scans the
  corpus for deeper nesting and upgrades to a stack parser if any is found.
- **Payload** — even after downscaling, ~15–20 MB of images enters `public/`.
  In line with the existing `public/agentcore/` and `public/agentcore-samples/`
  trees, so no new precedent, but worth watching at build time.


---

## 9. As-built notes

`npm run build:langchain` regenerates everything. Final numbers:

| | Planned | Built |
|---|---|---|
| Pages | 690 | **1001** |
| Markdown | — | 19.2 MB |
| Images | ~15–20 MB | 70 MB (454 files) |
| Code tab strips | — | 503 |
| Callouts | — | 2,068 |
| Mermaid diagrams | deferred | **97, rendering live** |
| Broken internal links | 0 | **0** (of ~6,600) |
| Pages rendering without error | — | **1001 / 1001** |

### Divergences

1. **1001 pages, not 690.** `docs.json` lists only the per-component *index*
   pages, leaving ~340 provider pages under `oss/python/integrations/`
   unreachable even though the prose links to them constantly. They are swept
   into an "Integrations catalog" tab. This cut unresolved links from 610 to 115.
2. **Heavy GIFs became poster frames.** Copying the 25 LangSmith screencasts
   whole put `public/langchain` at 284 MB. The build now extracts a first-frame
   PNG (~80 KB each) and the viewer loads the animation from
   docs.langchain.com on click. 284 MB → 90 MB.
3. **Redirect stubs.** 35 pages are frontmatter-only `url:` stubs. 18 resolve
   internally and the viewer forwards through them; 17 point off-site and render
   a link-out card. None are blank.
4. **Both sidebars wired.** `Sidebar.jsx` (the `variant: "legacy"` path) keeps
   its own inline copy of the nav switch, so the Agents entries were added there
   too — otherwise they would render but not respond on a legacy layout.

### Bugs worth remembering

- **`urlTransform` is mandatory.** react-markdown v10 sanitizes unknown URL
  protocols, so every `lc:` cross-reference silently lost its href — 6,576 dead
  links that still *looked* fine. `langChainUrlTransform` in
  `LangChainMarkdown.jsx` fixes it; do not remove it.
- **96 snippet files carry a stray 4-space indent** left by the export stripping
  `<CodeGroup>` wrappers. Without `dedent_snippet`, every fence but the first
  parses as an indented code block and no tab strip forms.
- **`<Columns>` with no `<Card>` inside must keep its body.** The export
  flattened most card grids into `### [Title](#)` headings; returning `""` for a
  cardless grid silently deleted whole sections.
- **Product icons need copying explicitly** — nothing in the markdown references
  them, so the asset sweep misses them and the rail renders broken images.

### Still open

- `public/langchain` is **90 MB and not gitignored**. `public/agentcore` (18 MB)
  is committed, so the precedent is to commit it, but this is 5× larger — worth
  a deliberate decision.
- TWK Lausanne ships as Inter; the `@font-face` block in `LangChainDocs.css` is
  commented out pending a licence (§6.1).
- 115 links resolve to docs.langchain.com because those pages are genuinely
  absent from the export (mostly `/langsmith/smith-api/**` endpoint reference).
