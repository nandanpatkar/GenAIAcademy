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

## Phase 2 — Playground tap-to-place + Mind Map touch support (wired in)

**System Design Playground — simplified mobile editing**
Drag-and-drop from the sidebar onto the ReactFlow canvas doesn't work on
touch, so on mobile the sidebar is now collapsed by default and replaced
with:
- `src/pages/playground/components/MobileNodePicker.jsx` — a
  `MobileSheet`-based picker: tap the floating `+` button
  (`.pg-mobile-fab`, bottom-right of the canvas) to open it, tap a
  category to expand it, tap a node to place it.
- `addNodeFromPicker()` in `SystemDesignPlayground.jsx` mirrors the
  existing `onDrop` node-construction logic exactly, just computing a
  center-of-viewport position (with a small cascading offset per tap)
  instead of a drop coordinate — so placed nodes are identical in shape
  to drag-and-dropped ones and Inspector/validation/export all work on
  them unchanged.
- Desktop behavior is untouched: `isMobile` gates all of this, and the
  sidebar still defaults open with full drag-and-drop on desktop.
- Editing/canvas-editing tools not yet mobile-specific (multi-select,
  precise resize/drag of existing nodes, connecting edges by dragging
  between handles) still rely on ReactFlow's own touch support, which is
  serviceable but not redesigned here — this pass covers node *placement*
  specifically, per the agreed scope.

**WorkplaceLab Mind Map — touch-first interactions**
`MindMapCanvas` in `WorkplaceLab.jsx` was mouse-only (`onMouseDown` /
`onMouseMove` / `onMouseUp` / `onWheel`, all keyed off `clientX/clientY`).
Added, without duplicating the underlying drag/pan/zoom logic:
- **Node drag**: `onTouchStart` on each node (`MapNode`) feeds the same
  `onNodeDown` handler using `e.touches[0]`.
- **Canvas pan**: single-finger drag on empty canvas reuses `setPan`
  exactly as the mouse path does.
- **Pinch-to-zoom**: two-finger touch computes distance and scales
  `zoom` relative to the pinch start.
- **Double-tap to edit**: a second tap on the same node within 320ms
  triggers `onNodeDbl` (the double-click-to-edit behavior), since
  double-click doesn't exist on touch.
- `touch-action: none` is set on the root `<svg>` so the browser's native
  scroll/pinch-zoom doesn't fight the custom pan/zoom.
- Declaration order matters here: the new touch handlers depend on
  `onNodeDown`/`onNodeDbl`, so they're declared after both in
  `MindMapCanvas` (JS `const` bindings aren't hoisted — an earlier version
  of this patch had them declared too early and would have thrown a
  "Cannot access before initialization" error at runtime; worth knowing
  if this file gets restructured later).

## Remaining phases

- **Phase 3**: AlgoVisualizer (tabbed Code/Visualization/Output), DSA
  Animator (fallback content when the iframe can't render usably), and
  Blog/Community built mobile-first from the start.
