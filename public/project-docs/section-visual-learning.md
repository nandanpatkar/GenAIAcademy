# Visual Learning

## Visual Learning

![The Visual Learning course.](/docs-shots/sections/visual-learning.jpg)

Sets `showChaiVisual`; the panel is `src/components/ChaiVisualCourse.jsx`.

## How the content is produced

Three scripts, in order:

```bash
npm run fetch:chaivisual   # node scripts/fetch_chaivisual_content.mjs
npm run build:chaivisual   # build_chaivisual_course.py && build_chaivisual_mirror.py
```

The fetch step is separate from the build step because it reaches the network — keeping them apart means a rebuild does not re-scrape.

Production serves the page bodies through the `/chai-visual/` rewrite in `vercel.json`, which points at `docs-cdn-worker` rather than at anything in this repository:

```json
{ "source": "/chai-visual/(.*)", "destination": "https://docs-cdn.gen-ai-academy.workers.dev/chai-visual/$1" }
```

That is why the course loads same-origin in the browser while its content lives in R2.

Visual Learning sits directly after Data Science in the sidebar because the two are the same shape of thing — an animated course read in-app — and `resolveEffectiveLayout()` re-homes it there for saved layouts as well.
