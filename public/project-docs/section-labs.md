# Labs

## Labs

![The Labs hub.](/docs-shots/sections/labs.jpg)

Sets `showLabs` (and an active lab id); the panel is `src/components/LabsHub.jsx`.

## One sidebar entry over many labs

The registry defines around 100 individual lab ids — `lab_retrieval_tuning`, `lab_agent_anatomy`, `lab_bias_variance`, `lab_attention_mechanism`, and so on — each with its own icon, label and description in `SIDEBAR_ITEM_REGISTRY`.

None of them appear in the sidebar. `resolveEffectiveLayout()` strips every id in `LAB_ITEM_IDS` and leaves a single `labs` entry in its place:

```javascript
groups.forEach((group) => {
  group.itemIds = group.itemIds.filter((id) => id !== "labs" && !LAB_ITEM_IDS.includes(id));
});
```

They are also excluded from the orphan sweep at the end of that function, so the consolidation is not undone by the fallback that normally rescues unlisted ids into "More tools":

```javascript
const orphanIds = Object.keys(SIDEBAR_ITEM_REGISTRY)
  .filter((id) => !covered.has(id) && !LAB_ITEM_IDS.includes(id));
```

The individual ids still work as navigation targets — the hub uses them, and `handleNavClick` has a case covering all of them — they simply have no sidebar row of their own.

## What the labs cover

Grouped roughly by subject: retrieval and RAG, agents and tool calling, evaluation and observability, classical ML, deep learning, computer vision, statistics, GenAI technique selection, and platform/DevOps topics.

> [!NOTE]
> The retrieval and RAG labs are simulations. They teach chunking, reranking, grounding and citation behaviour through modelled pipelines; there is no vector store, embedding model or retrieval infrastructure anywhere in this repository.

Lab implementations live in `src/labs/` (`LabKit.jsx`, `ConceptSimulator.jsx`, `AdvancedLabsA.jsx`, `AdvancedLabsB.jsx`) plus lab-specific components. `LabsHub` is the catalogue and launcher over them.

A lab configuration can be shared, which is what the `shared_labs` table and its RLS policy exist for.
