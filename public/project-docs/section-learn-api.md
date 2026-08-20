# Learn API

## Learn API

![Learn API.](/docs-shots/sections/learn-api.jpg)

Sets `showApiHub`; the panel is `src/components/ApiHub.jsx`.

An in-product guide to API concepts — a generated documentation archive, read with the same viewer machinery as the Agents section.

## How the content is produced

```bash
npm run build:apihub   # python3 scripts/build_apihub_docs.py
```

Like the other archive generators, this one is not in the root `build` chain; its output is committed and served from `public/`.

Learn API has its own sidebar section, immediately after Labs. `resolveEffectiveLayout()` re-homes it for saved layouts with the same migration shape every other section uses — the source comment notes that without it, anyone with a customised sidebar would find the entry appended to "More tools" as an orphan.
