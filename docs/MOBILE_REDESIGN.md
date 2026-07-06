# Mobile Redesign — Phase 0 (Foundation)

## What changed in this pass

1. **`src/hooks/useIsMobile.js`** — centralized mobile-breakpoint hook using
   `matchMedia` (only re-renders on an actual boolean flip, not every resize
   pixel). `App.jsx`'s `isMobile` now comes from here instead of an inline
   `width <= 768` calc, and the now-unused `useWindowWidth` import/call was
   removed from `App.jsx`. Any new mobile-aware code — in `App.jsx` or in a
   section component — should import this hook rather than re-deriving the
   breakpoint.

2. **`src/components/mobile/MobileShell.jsx`** — a local header + scroll
   container for a single mobile-optimized section view. Not a replacement
   for the existing global `MobileHeader` / `MobileBottomNav` in `App.jsx`
   (those stay as the app-level shell) — this is the per-section wrapper a
   new `XyzMobile.jsx` view uses for its own title/back-button/content area.

3. **`src/components/mobile/MobileSheet.jsx`** — shared bottom-sheet
   component (slide up, backdrop, drag-down-to-dismiss, optional in-sheet
   tabs). This is meant to replace the current pattern of duplicated
   `isMobile` branches that turn `ModulePanel` / `DetailPanel` /
   `ResourcePanel` into separate fixed full-screen overlays. A future
   mobile roadmap view can combine "module details" + "resources" into one
   sheet with two tabs instead of two panels with separate mobile logic.

4. **`src/styles/mobile-foundation.css`** — styles for the two components
   above, built from the existing CSS variable system (`--bg`, `--text`,
   `--border`, `--neon`, etc.) so they automatically pick up the
   light/dark theme. Imported globally from `App.jsx`.

Nothing in the existing render tree (the big conditional chain in
`App.jsx`'s `<main>`) was touched beyond the `isMobile` source — Phase 0
intentionally avoids touching that logic until each section gets its own
mobile view, section by section, in Phase 1.

## How to build a section's mobile view (Phase 1 pattern)

For each section (Roadmap first, per the agreed priority order):

```jsx
// src/pages/roadmap/RoadmapMobile.jsx
import MobileShell from "../../components/mobile/MobileShell";
import MobileSheet from "../../components/mobile/MobileSheet";

export default function RoadmapMobile({ pathData, activeModule, ...}) {
  return (
    <MobileShell title={pathData.label} accentColor={pathData.color}>
      {/* vertical list of module cards instead of the graph canvas */}
    </MobileShell>
    <MobileSheet
      open={!!activeModule}
      onClose={...}
      title={activeModule?.title}
      tabs={[{ id: "details", label: "Details" }, { id: "resources", label: "Resources" }]}
      activeTab={sheetTab}
      onTabChange={setSheetTab}
    >
      {sheetTab === "details" ? <ModuleDetails .../> : <ModuleResources .../>}
    </MobileSheet>
  );
}
```

Then in `App.jsx`, route to it at the top of the relevant branch:

```jsx
{isMobile ? <RoadmapMobile ... /> : <RoadmapGraph ... />}
```

This keeps each mobile view isolated and independently shippable, rather
than growing more `isMobile` branches inside the existing desktop
components.

## Phase 1 — Roadmap mobile view (wired in)

`src/pages/roadmap/RoadmapMobile.jsx` replaces `RoadmapGraph`'s zigzag/
central-line layout with a vertical, scrollable card list when
`isMobile && !isEditMode`. It mirrors `RoadmapGraph`'s data shape and
calls the same `onNodeClick(node)` callback, so the existing
`ModulePanel -> DetailPanel -> ResourcePanel` mobile drill-down flow in
`App.jsx` is untouched — only the top-level node list changed.

- Path-switch tabs, progress bar, and per-node status are preserved from
  the desktop view, restyled for a single-column touch layout.
- Edit mode intentionally still falls back to `RoadmapGraph` on mobile
  (`isMobile && !isEditMode` gate) — node add/edit/delete flows haven't
  been rebuilt for the mobile list yet, so editing stays on the
  desktop-style graph for now rather than losing that functionality.
  Revisit this once mobile add/edit/delete affordances are designed.
- Styles: `src/styles/roadmap-mobile.css`, using the same CSS variable
  theme system as the rest of the app.

## Remaining phases

- **Phase 2**: System Design Playground (view-only pan/zoom on mobile,
  editing pushed to desktop) and WorkplaceLab mind map (touch-first
  interactions).
- **Phase 3**: AlgoVisualizer (tabbed Code/Visualization/Output), DSA
  Animator (fallback content when the iframe can't render usably), and
  Blog/Community built mobile-first from the start.
