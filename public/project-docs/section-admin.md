# Admin

Three destinations, visible only to an admin identity. They appear in the sidebar at all only because `resolveItemVisibility` returned `"admin"` and the current user is one.

## Visibility

Two independent checks guard this section. `Sidebar.jsx` filters the rendered list, and `handleNavClick` checks again before acting:

```javascript
// Defense in depth: registry-governed items must stay unreachable for a
// non-admin even if something other than this component's own filtered
// render triggers the click (e.g. a stale walkthrough target).
if (SIDEBAR_ITEM_REGISTRY[id] && !isItemVisible(id)) return;
```

> [!CAUTION]
> Both checks are client-side. They keep the UI honest; they are not an authorisation boundary. Anything an admin panel reads or writes must be protected by Row Level Security, because a determined caller can reach the same tables directly with the anon key. See [Data & persistence](doc:data-layer), which also records the hardcoded admin credential in `src/components/AuthInterface.jsx` that should be rotated and moved server-side.

Admin state comes from `AuthContext` and is mirrored into `localStorage` under `genai_isAdmin`. The `app_admins` table is the durable allow-list.

## Admin Panel

![Admin Panel.](/docs-shots/sections/admin-panel.jpg)

Sets `showAdminManagement`; the panel is `src/components/AdminManagement.jsx`.

It presents itself as a workspace called "Nucleus", with its own sub-navigation rather than a single screen:

| Tab | Covers |
|---|---|
| Overview | Platform pulse, counts of people, roadmap paths, content nodes and admins, engagement and system health |
| People | Registered accounts |
| Infrastructure | Provider, gateway and access-control status |
| Navigation | The sidebar layout and per-item visibility |
| Content forge | Adding and editing content |

The **Navigation** tab is where the sidebar layout and per-item visibility overrides are edited — the `overrides` argument `resolveItemVisibility` consults, and the saved layout `resolveEffectiveLayout` merges against `DEFAULT_SIDEBAR_LAYOUT`. Changing a layout here is what makes the migration blocks described in [App shell & navigation](doc:app-shell) necessary.

It also manages the admin and locked-user lists held in `AuthContext`.

## Algo Studio

![Algo Studio.](/docs-shots/sections/algo-studio.jpg)

Sets `showAlgoStudio`; the panel is `src/components/AlgoVisualizer.jsx`.

> [!WARNING]
> The naming here is crossed. `showAlgoStudio` renders `AlgoVisualizer.jsx`, while `showAlgoVisualizer` — reached from **Algorithm Practice** under Practice — renders `CodeVisualizer.jsx`. Check which flag you are editing before changing either component.

## AI Pathfinder

![AI Pathfinder.](/docs-shots/sections/ai-pathfinder.jpg)

Backed by `src/services/pathfinderService.js`, which suggests a learning path from the curriculum model.
