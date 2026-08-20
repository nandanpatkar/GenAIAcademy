# More tools

Nine destinations, and the section with the most variety in what a "panel" actually is. Several are not React at all — they are pre-built bundles in `public/` that a thin wrapper component drops into an iframe.

> [!NOTE]
> "More tools" is also the fallback bucket. Any registry id that belongs to no group gets appended here by `resolveEffectiveLayout()`, which is why a nav item that appears in this section unexpectedly usually means a missing migration rather than a deliberate placement.

## Cloud Projects

![Cloud Projects.](/docs-shots/sections/cloud-projects.jpg)

Tool home `projects`, then `src/components/Projects/ProjectIDE.jsx` behind `showProjects`.

The most substantial feature in this section, and the one with the deepest backend dependency. Its parts:

| Path | Role |
|---|---|
| `Projects/ProjectsDashboard.jsx` | Project list |
| `Projects/ProjectIDE.jsx` | The workspace shell |
| `Projects/FileExplorer.jsx`, `EditorPane.jsx` | Tree and Monaco editor |
| `Projects/GitPanel.jsx`, `ImportGitHubModal.jsx` | Git operations and GitHub import |
| `Projects/VersionHistory.jsx` | File history |
| `Projects/AIAssistant.jsx` | In-IDE assistance |
| `Projects/NotebookViewer.jsx` | Notebook rendering |
| `Projects/BottomPanel.jsx`, `ProjectSettings.jsx`, `useEditorSettings.js` | Supporting UI |

State lives in `src/contexts/ProjectsContext.jsx` and `src/services/projectService.js`; persistence spans the `projects`, `project_files` and `file_versions` tables plus S3 through `/api/blob` and `/api/upload`. GitHub import uses `src/services/githubIDEService.js`.

## AWS System Design

![AWS System Design.](/docs-shots/sections/aws-system-design.jpg)

Sets `showAwsSimulator`; the wrapper is `src/pages/simulator/AWSSystemDesignSimulator.jsx`.

The simulator itself is an **Angular application** in `system-design-simulator/`, built separately and copied into `public/aws-simulator/`:

```bash
npm run build:aws-simulator
```

It has its own Cloudflare Worker for AWS pricing, cached in KV and read by the SPA through `/api/prices`. Its own architecture notes are in `system-design-simulator/docs/ARCHITECTURE.md`.

## DSA Animator

![DSA Animator.](/docs-shots/sections/dsa-animator.jpg)

Tool home `dsa`, then `src/components/DSAAnimator.jsx` behind `showDSAAnimator`. Supporting data is in `src/components/dsaData.js` and `dsaEdgeCases.js`; `build_dsa.py` at the repo root and the `dsa_data_*.txt` files are its source material.

## Kubernetes Games

![Kubernetes Games.](/docs-shots/sections/kubernetes-games.jpg)

Tool home `kubernetes`, then `src/components/K8sGames.jsx` behind `showK8sGames`, wrapping the pre-built bundle in `public/k8sgames/`.

A game about Kubernetes concepts. There is no Kubernetes infrastructure anywhere in this repository.

## Git Visualizer

![Git Visualizer.](/docs-shots/sections/git-visualizer.jpg)

Sets `showGitVisualizer`; the wrapper is `src/components/GitVisualizer.jsx` over `public/git-visualizer/`.

> [!WARNING]
> The source directory `Git Visualizer/` is gitignored while its build output is committed. `npm run build:git` therefore fails on a fresh clone. This is expected — production uses the committed bundle.

## Flow Design

![Flow Design.](/docs-shots/sections/flow-design.jpg)

Tool home `flow`, then `src/components/FlowDesign.jsx` behind `showFlowDesign`, over `public/flow-design/` with icons in `public/flow-design-icons/`.

Same arrangement as Git Visualizer: `flow-design/` is gitignored, `npm run build:flow-design` fails on a fresh clone, and the committed output is what ships.

## Notion

![Notion.](/docs-shots/sections/notion.jpg)

Tool home `notion`, then `src/components/notion/NotionRenderer.jsx` behind `showNotion`, with `BlockRenderer.jsx`, `RichTextRenderer.jsx` and per-block renderers under `notion/renderers/`.

Notion API calls go through the `/notion-api/` rewrite in `vercel.json`, or through the `notion-fetch` Supabase edge function, which holds `NOTION_API_KEY`.

This is separate from the vendored workspace app in `public/editor/`, which is what `api/graphql.js` and `api/copilot.js` emulate a backend for.

## NoSignups

![NoSignups.](/docs-shots/sections/nosignups.jpg)

Sets `showNoSignups`; the panel is `src/components/NoSignups.jsx`.

## Free System Design

Sets nothing. This is the only sidebar entry that navigates away from the app entirely:

```javascript
case "free_system_design": window.open("https://freesystemdesign.com/", "_blank", "noopener,noreferrer"); break;
```

There is no panel and no view flag, so `getActiveNavId` can never return it and the sidebar never highlights it. `src/components/FreeSystemDesign.jsx` exists and is wired to a `showFreeSystemDesign` flag, but the sidebar path does not use it.

Because clicking it opens a new tab and leaves the current panel untouched, it has no screenshot here — there is nothing of its own to show.
