# Learn

The curriculum surfaces. Nine destinations that all read the same underlying curriculum model and present it differently — three home screens, three roadmap treatments, and three views over progress and concept relationships.

> [!NOTE]
> Everything in this section is curriculum-driven. Without a populated `user_curriculum` row these screens render their chrome and an empty state, which is what the screenshots below show for the graph views. That is the correct empty state, not a fault.

## Home

The default landing destination after sign-in, and the fallback `getActiveNavId` returns when nothing else is active.

![Home — the Intelligence Hub dashboard.](/docs-shots/sections/home.jpg)

Clicking it sets `showIntelligenceHub`. The panel is `src/components/IntelligenceHub.jsx`, which composes the greeting, the next-step card, an "ask the hub" prompt box and progress tiles.

## Home 2.0

![Home 2.0.](/docs-shots/sections/home-2-0.jpg)

`src/components/Home2Dashboard.jsx`, behind `showHome2`. A mission-control treatment of the same progress data.

## Home 3.0

![Home 3.0.](/docs-shots/sections/home-3-0.jpg)

`src/components/Home3.jsx` with `src/components/Home3Scenes.jsx`, behind `showHome3`. This is also what an unauthenticated visitor sees as the landing page, via `src/pages/LandingWrapper.jsx` — a scroll-driven narrative with a Three.js scene.

Because it carries the 3D scene, it is one of the heaviest chunks in the app and a good example of why every panel is `React.lazy()`-loaded.

## Roadmaps

![Roadmaps — the study map.](/docs-shots/sections/roadmaps.jpg)

Sets `showCurriculumMap`; the panel is `src/components/CurriculumTreePanel.jsx`. It offers a directory list and a hybrid flowchart with expand/collapse and zoom controls.

## Roadmap 2.0

![Roadmap 2.0.](/docs-shots/sections/roadmap-2-0.jpg)

`src/components/Roadmap2.jsx` (with `Roadmap2NodeView.jsx` for a single node), behind `showRoadmap2`. Presents the path as a road you drive along.

## Roadmap 3.0

![Roadmap 3.0.](/docs-shots/sections/roadmap-3-0.jpg)

`src/pages/roadmap/Roadmap3.jsx`, behind `showRoadmap3`, with `RoadmapMobile.jsx` as the small-screen variant. Scrolls to fly through the path as a world.

## Progress

![Progress.](/docs-shots/sections/progress.jpg)

`src/components/ProgressTracker.jsx`, behind `showProgress`. Reads completion state from the curriculum row.

## Explore Concepts

![Explore Concepts — the knowledge galaxy.](/docs-shots/sections/explore-concepts.jpg)

`src/components/KnowledgeGalaxy.jsx`, behind `showGalaxy`. A spatial browse over topics.

## Concept Connections

![Concept Connections.](/docs-shots/sections/concept-connections.jpg)

`src/pages/KnowledgeGraph.jsx`, behind `showKnowledgeGraph`. Renders relationships between concepts as a graph.

## Where the curriculum comes from

The default paths live in `src/data/roadmap` and total roughly 600 KB. `App.jsx` loads that module on demand through a single shared promise so its three call sites fetch it once, and so it never sits in the entry chunk:

```javascript
let pathsModulePromise = null;
const loadDefaultPaths = () => {
  if (!pathsModulePromise) {
    pathsModulePromise = import("./data/roadmap").then((m) => m.PATHS);
  }
  return pathsModulePromise;
};
```

Per-user progress is merged over that default from the `user_curriculum` table, cached by `src/services/curriculumCache.js`. Which paths are visible is decided by `filterVisiblePaths` in `src/config/pathRegistry.js`.
