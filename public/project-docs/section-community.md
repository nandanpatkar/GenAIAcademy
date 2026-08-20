# Community

Three destinations: a shared space, a notes workspace, and a gated companion app.

## Community

![Community.](/docs-shots/sections/community.jpg)

Tool home `community`, then `src/components/Community/Community.jsx` behind `showCommunity`, with `src/components/Community/LetterAvatar.jsx` for identity chips.

Backed by four tables the client uses directly — `community_members`, `community_groups`, `channels` and `messages`. None of them have a migration in `supabase/migrations/`, so a fork must recreate them by hand.

> [!NOTE]
> `Community.jsx.bak` sits next to the live component. It is a leftover backup file, not part of the build — nothing imports it.

## Notes

![Notes.](/docs-shots/sections/notes.jpg)

Tool home `notes`, then `src/components/WorkplaceLab.jsx` behind `showWorkplaceLab`.

Per-module notes persist to the `module_notes` table via `src/components/ModuleNotes.jsx`; that table does have a migration, with RLS enabled in the same file.

This is distinct from the **Notion** destination under More tools, which renders a different thing entirely.

## AIML Companion

![AIML Companion.](/docs-shots/sections/aiml-companion.jpg)

Sets `showAimlCompanion`; the panel is `src/components/aimlcompanion/AimlCompanionApp.jsx`, with data in `src/data/aimlcompanion/` and assets in `src/assets/aimlcompanion/`.

This item is **admin-gated by default**, and it is the one exception hardcoded into the visibility resolver:

```javascript
export const resolveItemVisibility = (itemId, { overrides, allowAimlForAll } = {}) => {
  if (overrides && overrides[itemId]) return overrides[itemId];
  if (itemId === "aiml_companion") return allowAimlForAll ? "all" : "admin";
  return SIDEBAR_ITEM_REGISTRY[itemId]?.defaultVisibility || "all";
};
```

The `allowAimlForAll` fallback exists for compatibility with configuration saved before the registry did visibility at all. An explicit override in the admin panel still wins over both.

Its catalogue is extracted by `scripts/extract_aimlcompanion_catalog.mjs`, and `aiml_comprehensive_roadmap.json` at the repo root is a related source file.
