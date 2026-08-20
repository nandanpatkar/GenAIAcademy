# Extending the app

Every extension point here is a convention, not a framework. Nothing enforces the steps, so a missed step fails quietly and in a characteristic way. Each recipe below lists the failure mode as well as the fix.

## Add a sidebar destination

This is a five-file ritual. The section you are reading was added exactly this way, so the diff is a working example.

### 1. Register the item — `src/config/sidebarRegistry.js`

```javascript
export const SIDEBAR_ITEM_REGISTRY = {
  // ...
  documentation: { icon: BookMarked, label: "Documentation", description: "How this project is built" },
};
```

Import the icon at the top of the file. Add the id to `DEFAULT_SIDEBAR_LAYOUT`, in a new group if it needs one:

```javascript
{ id: "about", label: "About", itemIds: ["documentation"] },
```

Then add a migration block in `resolveEffectiveLayout()`, following the shape every other section uses.

> [!WARNING]
> Skipping the migration is the classic mistake. A fresh profile looks correct because it falls back to `DEFAULT_SIDEBAR_LAYOUT`; anyone who has ever customised their sidebar has a saved layout, and for them the new item lands in "More tools" as an orphan.

### 2. Own the state — `src/App.jsx`

Four edits in this file:

```javascript
// a. lazy import, next to the others
const Documentation = React.lazy(() => import("./components/Documentation"));

// b. view flag
const [showDocumentation, setShowDocumentation] = useViewState(savedViews.showDocumentation ?? false);

// c. reset it with the rest, in the reset callback and in the nav switch
setShowDocumentation(false);
case "documentation": setShowDocumentation(true); break;

// d. render it in the chain
showDocumentation ? <ErrorBoundary><Documentation onClose={() => setShowDocumentation(false)} /></ErrorBoundary> :
```

Add the flag to the `genai_active_views` persistence object *and* its dependency array, and pass `showDocumentation` / `setShowDocumentation` down in the sidebar props object.

### 3. Teach the shared nav helpers — `src/config/sidebarNav.js`

```javascript
if (p.showDocumentation) return "documentation";           // in getActiveNavId
case "documentation": if (p.setShowDocumentation) p.setShowDocumentation(true); break;
```

### 4. Teach the legacy sidebar — `src/components/Sidebar.jsx`

`Sidebar.jsx` keeps its own inline copy of that logic, so the same two edits are needed here, plus destructuring the two props and adding a reset line in `handleNavClick`.

### 5. Build the panel

A panel takes an `onClose` prop and renders full-screen. Wrap it in `ErrorBoundary` at the call site if it does anything risky.

### Symptom table

| Missed step | What you see |
|---|---|
| Registry entry | Item never appears |
| `DEFAULT_SIDEBAR_LAYOUT` | Appears under "More tools" on a fresh profile |
| Migration block | Appears correctly for you, under "More tools" for existing users |
| `getActiveNavId` / `getActiveId` | Panel opens but no sidebar item highlights |
| Reset lines | Two panels fight; the one earlier in the render chain wins |
| Persistence array | Panel does not survive a reload |

## Add an AI provider

If the provider speaks the OpenAI chat-completions dialect, this is one entry in `src/config/aiProviders.js` and nothing else:

```javascript
myprovider: {
  id: "myprovider",
  label: "My Provider",
  sub: "Model family",
  adapter: "openai",
  icon: "logos:some-icon",
  color: "#3355ff",
  mono: "MP",
  defaultModel: "my-model-latest",
  docsUrl: "https://example.com/api-keys",
  fields: [
    { name: "endpoint", label: "API endpoint", type: "text", required: true },
    { name: "key", label: "API key", type: "password", required: true },
  ],
},
```

The dispatcher, the credential store and every settings UI read from this registry, so they pick it up automatically.

A provider with a genuinely different wire format needs a new adapter branch in `src/services/aiService.js` as well. Route structured responses through the existing JSON-safety helpers rather than calling `JSON.parse` directly.

## Add a serverless endpoint

> [!IMPORTANT]
> `api/` is at Vercel's twelve-function limit. Adding a thirteenth file there breaks the deploy. Extend an existing handler by dispatching on a body field — the pattern `api/leetcode-judge.js` uses — or put shared logic in `api/_lib/`, which does not count.

A handler is plain ESM with a `(req, res)` signature. Handle `OPTIONS`, reject the wrong method with `405`, and remember that `req.body` may arrive as a string or an object depending on runtime — several handlers carry a small helper for exactly that.

If the endpoint needs a non-standard path shape, add a rewrite to `vercel.json` and mirror it in `apiMiddleware()` in `vite.config.js`, or it will work in production and 404 locally.

## Add a Supabase table

1. Write a migration in `supabase/migrations/`, named `YYYYMMDD_thing.sql`.
2. Enable RLS **in the same file** and define the policies alongside the table. A table without a policy returns empty results for a signed-in user, which reads like a bug elsewhere.
3. Access it from the client with `supabase.from('thing')`.

Use a service-role key only in a serverless handler that genuinely must bypass RLS, never from the browser.

## Add a content generator

1. Write `scripts/build_thing.py` or `.mjs`.
2. Emit a **small index** to `src/data/` and a **large body** to `public/`. Bundling the body is the mistake this split exists to prevent.
3. Register a `build:thing` script in `package.json`.
4. Add it to the root `build` chain only if the SPA cannot render without it. Otherwise leave it on-demand and commit the output.
5. If the payload is large, upload to R2 and add a rewrite in `vercel.json` so it stays same-origin.

## Add a documentation page

The section you are reading is data-driven:

1. Write `public/project-docs/<slug>.md`.
2. Add `{ slug, title, blurb }` to the right section in `src/data/documentationNav.js`.

Ordering, prev/next, the table of contents and cross-links all follow from that. Markdown supports GitHub tables, `mermaid` fenced blocks, `> [!NOTE]`-style callouts, `lc-cards` blocks, and `doc:<slug>` links for cross-references.
