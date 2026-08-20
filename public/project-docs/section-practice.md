# Practice

Eight destinations where you write, run, or manipulate something rather than read. This is the densest section technically: it holds two code editors, an in-browser Postgres, a server-backed judge, and two design simulators.

## Tool homes

Six items in this section do not open their panel directly. They call `onOpenToolHome(...)` with a family name, which renders an intermediate landing screen for that family; the panel itself opens from there.

```javascript
case "ide": if (p.onOpenToolHome) p.onOpenToolHome("coding"); else if (p.setShowIDE) p.setShowIDE(true); break;
```

The `else` branch is the fallback for contexts that have no tool home. This is why `getActiveNavId` checks `activeToolHome` *before* it checks any view flag — otherwise the sidebar would highlight nothing while a tool home is open.

## Coding Practice

![Coding Practice.](/docs-shots/sections/coding-practice.jpg)

Tool home `coding`, then `src/components/PythonIDE.jsx` behind `showIDE`. Python runs in the browser through Pyodide (`react-py`); editing is Monaco, loaded via `src/config/monacoLoader.js`. Nothing is sent to a server.

## Code Lab

![Code Lab.](/docs-shots/sections/code-lab.jpg)

Sets `showLeetCode` directly; the panel is `src/pages/LeetCodePage.jsx` with `src/components/leetcode/`. 322 problems mapped to 70 interview patterns, with a daily challenge, a streak and a year heatmap.

Unlike Coding Practice, this one is server-backed: submissions go to `/api/leetcode-judge`, which builds a harness around your source and runs it against stored visible and hidden test cases. See [Backend & API reference](doc:backend) for the response shapes and the rate limits.

Problem manifests live in `src/data/codelab/` and `api/_data/`, both committed, because the corpus they are generated from is gitignored.

## AI Playground

![AI Playground.](/docs-shots/sections/ai-playground.jpg)

Tool home `playground`, then `src/pages/playground/SystemDesignPlayground.jsx` behind `showPlayground`. Calls models through `src/services/aiService.js`, so it uses whichever provider and credentials the user has configured.

## Gen AI Playground 2.0

![Gen AI Playground 2.0.](/docs-shots/sections/gen-ai-playground-2-0.jpg)

The only item routed through its own dedicated callback rather than a flag or a tool home:

```javascript
case "genai_playground2": if (p.onOpenGenAIPlayground2) p.onOpenGenAIPlayground2(); break;
```

The panel is `src/pages/playground2/GenAIPlayground2.jsx` — diagrams, whiteboards and system design with AI assistance.

## System Design

![System Design.](/docs-shots/sections/system-design.jpg)

Tool home `system`, then `src/pages/simulator/SystemDesignSimulator.jsx` behind `showSimulator`. Practice architecture decisions against scenarios.

Not to be confused with **AWS System Design** under More tools, which is a separate vendored Angular application.

## Algorithm Practice

![Algorithm Practice.](/docs-shots/sections/algorithm-practice.jpg)

Tool home `algo`, then `src/components/CodeVisualizer.jsx` behind `showAlgoVisualizer`. Step-by-step algorithm walkthroughs.

The similarly-named `showAlgoStudio` flag renders `src/components/AlgoVisualizer.jsx` and is reached from the Admin section, not here — the two names are crossed relative to what you would expect, which is worth knowing before you go editing either.

## Visualize

![Visualize.](/docs-shots/sections/visualize.jpg)

Tool home `visualize`, then `src/components/LearnBugEmbed.jsx` behind `showLearnBug`. Debug Python with memory, structure and timeline views.

> [!WARNING]
> This panel embeds an external tool in an iframe that occupies the whole viewport, including the space the sidebar normally holds. Navigating away means closing the panel first. Automated tooling that drives the sidebar has to account for this — it is the one destination that removes its own navigation.

## SQL & Query Plans

![SQL & Query Plans.](/docs-shots/sections/sql-query-plans.jpg)

Sets `showSqlLab`; the panel is `src/components/SqlLab.jsx` with `src/components/SqlLab.css`. Runs real Postgres in the browser through PGlite (`@electric-sql/pglite`) and shows `EXPLAIN ANALYZE` output — no server and no database connection involved.
