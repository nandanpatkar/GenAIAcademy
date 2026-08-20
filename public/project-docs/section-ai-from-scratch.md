# AI from Scratch

Three entries over one panel. The track id doubles as the nav id, minus a prefix, so the sidebar highlight needs only a small transformation rather than a lookup.

```javascript
case "aifs_curriculum":
case "aifs_certification":
case "aifs_reference": {
  const track = id === "aifs_reference" ? "guides" : id.replace("aifs_", "");
  if (p.setAifsTrack) p.setAifsTrack(track);
  if (p.setShowAiFromScratch) p.setShowAiFromScratch(true);
  break;
}
```

and in reverse:

```javascript
if (p.showAiFromScratch) return `aifs_${p.aifsTrack === "guides" ? "reference" : p.aifsTrack || "curriculum"}`;
```

Note the asymmetry: the third track is called `guides` internally but `reference` in the nav id, so both directions special-case it. That mismatch is the kind of thing to preserve rather than tidy — changing one side without the other breaks the sidebar highlight silently.

The panel is `src/components/AiFromScratch.jsx`, behind `showAiFromScratch`, and it also accepts a `lesson` prop for deep links into a specific lesson.

## Curriculum

![AI from Scratch — Curriculum.](/docs-shots/sections/curriculum.jpg)

## Certification

![AI from Scratch — Certification.](/docs-shots/sections/certification.jpg)

## Roadmap & Glossary

![AI from Scratch — Roadmap and glossary.](/docs-shots/sections/roadmap-glossary.jpg)

## Content

Two generators, neither in the root build chain:

```bash
npm run build:aifs        # python3 scripts/build_ai_from_scratch.py
npm run build:aifs-path   # node scripts/build_aifs_path.mjs
```

The first produces the course; the second produces the learning path that threads it into the curriculum model. Page bodies are served through the `/ai-from-scratch/*` rewrite to `docs-cdn-worker`.

The three ids are listed in `AIFS_ITEM_IDS` and re-homed as a set by `resolveEffectiveLayout()`, immediately after the Agents section.
