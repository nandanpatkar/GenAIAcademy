# AlgoWar

## AlgoWar Arena

![AlgoWar Arena.](/docs-shots/sections/algowar-arena.jpg)

Sets `showAlgoWar`; the panel is `src/components/algowar/AlgoWarApp.jsx`.

Unlike most destinations, this one is a small application in its own right rather than a single component. Its directory holds views and supporting modules:

| Path | Role |
|---|---|
| `src/components/algowar/AlgoWarApp.jsx` | Shell and routing between views |
| `src/components/algowar/views/` | Home, Arena, Daily, Level, Career, Leaderboard, Profile, Dream, Streak heatmap, Solution console |
| `src/components/algowar/judge.js` | Verdict logic for submitted solutions |
| `src/components/algowar/progress.js` | Streaks and progression |
| `src/components/algowar/data.js`, `statement.js` | Problem data and statement rendering |
| `src/components/algowar/avatars.js`, `icons.jsx`, `contentImages.js` | Presentation assets |
| `src/data/algowar/`, `src/assets/algowar/` | Bundled data and images |

Styling is in `src/styles/algowar.css`.

## Content provenance

Several scripts under `scripts/` fetch and localise the arena's content — `fetch_algowars_pages.mjs`, `fetch_algowars_career.mjs`, `fetch_algowars_site.mjs`, `scrape_algowars_career.mjs`, `render_algowars_pages.mjs` and `localize_algowars_images.mjs`. None of them are wired into an npm script or the root build; they were run to produce the committed output under `src/data/algowar/` and `src/assets/algowar/`.
