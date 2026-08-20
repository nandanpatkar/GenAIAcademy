// Navigation model for the in-app project documentation (About → Documentation).
//
// Only this index is bundled. Page bodies live in public/project-docs/*.md and
// are fetched on demand by Documentation.jsx, the same arrangement the
// LangChain, Strands and AI-from-Scratch viewers already use — prose is far too
// large to carry in the entry chunk, and a reader opens two or three pages, not
// twelve.
//
// `slug` is both the markdown filename and the id used by `doc:` cross-links.

export const DOC_SECTIONS = [
  {
    id: "start",
    label: "Start here",
    pages: [
      { slug: "overview", title: "Overview", blurb: "What this repository is, and what it is not." },
      { slug: "architecture", title: "Architecture", blurb: "How the SPA, functions, database and edge fit together." },
      { slug: "feature-tour", title: "Feature tour", blurb: "The product surfaces, screen by screen." },
      { slug: "local-setup", title: "Local setup", blurb: "Clone to running app, with the ordering that actually matters." },
    ],
  },
  {
    id: "internals",
    label: "How it works",
    pages: [
      { slug: "app-shell", title: "App shell & navigation", blurb: "The view-flag state machine behind every panel." },
      { slug: "ai-layer", title: "AI providers & services", blurb: "The provider registry, adapters and dispatch path." },
      { slug: "backend", title: "Backend & API reference", blurb: "Every serverless handler and edge function." },
      { slug: "data-layer", title: "Data & persistence", blurb: "Supabase, RLS, migrations and local stores." },
      { slug: "content-pipeline", title: "Content pipeline", blurb: "How build scripts bake datasets into the app." },
    ],
  },
  {
    id: "working",
    label: "Working on it",
    pages: [
      { slug: "extending", title: "Extending the app", blurb: "Add a panel, a provider, an endpoint, a generator." },
      { slug: "deployment", title: "Deployment", blurb: "Vercel, Supabase, Cloudflare, Render and Tauri." },
      { slug: "troubleshooting", title: "Troubleshooting", blurb: "Failure modes this codebase actually produces." },
    ],
  },
];

export const DOC_PAGES = DOC_SECTIONS.flatMap((section) =>
  section.pages.map((page) => ({ ...page, sectionId: section.id, sectionLabel: section.label }))
);

export const DOC_ORDER = DOC_PAGES.map((page) => page.slug);

export const DOC_BY_SLUG = DOC_PAGES.reduce((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {});

export const DEFAULT_DOC_SLUG = DOC_ORDER[0];

/* Where the markdown lives. Served straight out of public/ — unlike the
   external documentation archives, these pages are written in this repo and
   ship with the build, so there is no CDN rewrite in front of them. */
export const docUrl = (slug) => `/project-docs/${slug}.md`;
