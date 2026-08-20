# Python Labs

A single destination, given its own sidebar section because it is a beginner track rather than a tool.

## Sync / Async Quest

![Sync / Async Quest.](/docs-shots/sections/sync-async-quest.jpg)

Sets `showConcurrencyLab`; the panel is `src/components/ConcurrencyLab.jsx`. Teaches Python concurrency through animated missions with runnable code.

`tests/concurrencyQuest.test.mjs` covers part of its logic. That file has no npm script, so run it directly:

```bash
node --test tests/concurrencyQuest.test.mjs
```

## Why it has its own section

`resolveEffectiveLayout()` in `src/config/sidebarRegistry.js` re-homes this item into a `python_labs` group on every load, including for users with a saved custom layout:

```javascript
groups.forEach((group) => {
  group.itemIds = group.itemIds.filter((id) => id !== "concurrency_lab");
});
let pythonLabsGroup = groups.find((group) => group.id === "python_labs");
if (!pythonLabsGroup) {
  pythonLabsGroup = { id: "python_labs", label: "Python Labs", itemIds: [] };
  const practiceIndex = groups.findIndex((group) => group.id === "practice");
  groups.splice(practiceIndex === -1 ? 0 : practiceIndex + 1, 0, pythonLabsGroup);
}
```

The section sits immediately after Practice, and Data Science follows it — the comment in the source gives the reason: a reader working through concurrency is the same reader who wants NumPy next.
