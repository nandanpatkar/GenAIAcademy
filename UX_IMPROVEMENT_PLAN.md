# GenAI Academy — UX Improvement Plan

**Goal:** Reduce the "too many sections, too overwhelming" feedback without removing a single feature, tool, lab, or page. Every current capability stays live and reachable — this plan only changes *how it's organized, defaulted, and discovered*.

---

## 0. The constraint this plan is built around

> Nothing gets deleted. The fix is entirely in information architecture, defaults, and progressive disclosure — not feature cuts.

Every recommendation below is additive: new wrappers, new defaults, new entry points layered on top of what exists. Old routes/flags keep working underneath.

---

## 1. Audit — where the overwhelm actually comes from

This is grounded in the current codebase, not a generic checklist:

- **The sidebar registry (`src/config/sidebarRegistry.js`) has ~40 distinct top-level destinations across 10 groups** (Learn, Practice, Python Labs, AlgoWar, Labs, Agents, Library, Career, Community, More tools). Labs alone consolidates **130+ individual simulators** behind one "Labs" entry — that consolidation already happened once and is the right pattern; it just hasn't been applied everywhere else yet.
- **Six overlapping "home" experiences exist at once**: the pre-login `LandingPage`/`NewLandingPage` (via `LandingWrapper`), `IntelligenceHub` ("Home"), `Home2Dashboard` ("Home 2.0" / mission control), a Legacy Intelligence Hub, `HomePage3`, plus the onboarding chat. `App.jsx` picks between them via boolean flags (`showIntelligenceHub`, `showHome2`, `showLegacyIntelligenceHub`, …), so which one a user sees isn't a single deliberate front door.
- **Five separate views answer the same question** — "show me my learning path": Curriculum Map, Roadmap 2.0, Roadmap 3.0, Explore Concepts (Galaxy), Concept Connections (Knowledge Graph). Same job, five sidebar rows, five mental models.
- **Two sidebar implementations ship side by side** — `Sidebar.jsx` (1,708 lines, legacy) and `SidebarModern.jsx` (1,043 lines), both reading the same registry. This is a mid-migration state; it doubles the surface area that has to stay consistent.
- **`App.jsx` is a 2,150-line file driven by 54 `show*` booleans** — not user-facing directly, but it's *why* new features tend to land as "one more sidebar row + one more flag" instead of nesting into an existing surface.
- **A command palette already exists** (`GlobalSearchPalette.jsx`, Cmd/Ctrl+K, with a lazy-loaded search index). This is a strong, underused asset — its value depends entirely on whether users know it exists.
- **A good "mini-landing" pattern already exists** (`FeatureHome.jsx`) for about 10 tools (Interview Prep, Quiz, Algo Visualizer, Playground, AI Interviewer, DSA Animator, Notion, …) — each gets a title, description, stats, and a clear "Open" action before the real tool loads. Most other sections (Labs hub, Agents docs, Manual, Reference, the "More tools" group) skip straight to content without this framing.
- **Personalization infrastructure already exists but is framed as admin-only**: `resolveItemVisibility` and `resolveEffectiveLayout` already support per-item visibility overrides and custom sidebar layouts — today that's used for admin curation, not for helping every user get a calmer default.
- **A mobile redesign is already in progress, section by section** (`docs/MOBILE_REDESIGN.md`, `MobileShell`/`MobileSheet`). This plan should slot into that same phased cadence, not compete with it.

---

## 2. Principles

1. **Additive only** — reorganize, layer, default; never delete a route, component, or capability.
2. **One front door** — a single adaptive Home, not five homes competing for the title.
3. **Progressive disclosure** — a curated first layer, with full breadth one click or one search away.
4. **Search-first for power users, browse-first for new ones** — both fully supported, not a tradeoff.
5. **Consistent shell everywhere** — every section gets the same title/breadcrumb/back/related-tools frame instead of bespoke navigation.
6. **Personalization over deletion** — usage and role collapse things; nothing is ever permanently hidden.
7. **Ship in slices** — each phase independently shippable and reversible, same cadence the mobile redesign already uses.

---

## 3. Target information architecture

### 3.1 Collapse 10 sidebar groups into 7 pillars (relabel + regroup, remove nothing)

| Proposed pillar | Rolls up | Item count stays the same |
|---|---|---|
| **Home** | Single adaptive entry point (see 3.2) | — |
| **Learn** | Curriculum Map, Roadmap 2.0/3.0, Galaxy, Knowledge Graph, Progress — unified as one "Learning Map" entry (see 3.3) | 8 → 1 visible row, 8 reachable |
| **Practice** | IDE, LeetCode/Code Lab, Playground, Gen AI Playground 2.0, System Design, Algo Visualizer, Visualize, SQL Lab, Concurrency Quest | unchanged, same 9 items |
| **Labs** | The existing 130+-simulator Labs hub | unchanged — already the model to copy |
| **Agents & Cloud** | LangChain, LangGraph, Deep Agents, LangSmith, LangChain Samples, Strands, AWS AgentCore, Amazon Connect, Agent Library | unchanged, same 9 items |
| **Career** | Interview Prep, AI Interviewer, Gemini Interview, Quiz, Emotional Support | unchanged |
| **Library** | Manual, Reference, Resources, Blog, Links, GitHub | unchanged |
| **Community & Tools** | Community, Notes, AIML Companion, Projects, AWS Simulator, DSA Animator, K8s Games, Git Visualizer, Flow Design, Notion, NoSignups, Free System Design | unchanged |

Within each pillar, show only the 3–5 most-used items by default with a **"Show N more"** toggle — every remaining item is one click away, never removed from the DOM or the routing.

### 3.2 Unify the Home experience

Keep every existing home screen. Change how they're reached:

- Pick **one** default landing (recommend `IntelligenceHub`, today's `overview`) as the daily driver.
- Turn `Home2Dashboard`, the Legacy Intelligence Hub, and `HomePage3` into **tabs/views inside that same Home screen** ("Classic," "Mission Control," "Legacy") instead of separate sidebar rows discovered by accident.
- `LandingPage`/`NewLandingPage` stay exactly as-is — that's the logged-out acquisition page, a different job entirely.

This satisfies "don't drop anything" literally: all four in-app home variants keep working, just behind one door with a switcher instead of four sidebar entries.

### 3.3 Unify the "see my learning path" views

Merge Curriculum Map, Roadmap 2.0, Roadmap 3.0, Galaxy, and Knowledge Graph behind one sidebar row — **"Learning Map"** — that opens with a view switcher: `List · Highway (2.0) · Flight (3.0) · Concept Galaxy · Connections`. All five renderers stay exactly as built; only the entry point consolidates.

### 3.4 Give every top-level destination a FeatureHome landing

Extend the existing `FeatureHome.jsx` pattern (title, one-line description, 2–3 stat chips, "Continue" if there's saved progress else "Start") to sections that currently skip straight to content: Labs hub, each Agents/docs surface, Manual, Reference, and the "More tools" group. This is pure reuse of a component that already works well in ~10 places.

### 3.5 Converge on one sidebar implementation

Once `SidebarModern.jsx` is verified at parity with `Sidebar.jsx`, retire the legacy file. This is codebase hygiene, but it directly protects UX consistency — two implementations reading one registry is how subtle drift (a group that renders correctly in one but not the other) creeps in.

---

## 4. Discoverability & wayfinding

- **Make Cmd/Ctrl+K visible.** Add a persistent search pill in the top bar or sidebar header, not just a keyboard-shortcut tooltip — most users never learn palette shortcuts unless they see a clickable entry point first.
- **"Recently visited" shelf on Home** — last 5 destinations, backed by `localStorage`, no backend change needed.
- **"Pinned" shelf on Home** — a star toggle on any sidebar item, same storage approach.
- **Persistent breadcrumb strip** on every tool view: `Practice > System Design`, with a one-click way back to Home.
- **"Related" chips** at the bottom of each FeatureHome landing (e.g., inside Algo Visualizer, surface DSA Animator + Code Lab) so lateral discovery doesn't require a trip back through the sidebar.

---

## 5. Progressive disclosure & personalization

- **First-run defaults from the existing onboarding path picker** (`onboardingCatalog.js`): picking "Data Science" expands Career + Learn + Library and collapses Agents/Cloud + Community & Tools under "More" — without hiding anything permanently.
- **A single "Show everything" toggle** for users who prefer full density immediately — one setting, not a redesign, and it's honest about the tradeoff instead of forcing a curated view on power users.
- **Extend `resolveItemVisibility`/`resolveEffectiveLayout` from admin-only to per-user personal defaults.** The infrastructure for "some items are collapsed/hidden for some people" already exists in the codebase — this is reusing it for everyone's default comfort, not building it from scratch.

---

## 6. Visual & interaction consistency

- Apply the tokens already defined in `design-system/genai-academy/MASTER.md` (spacing scale, bento-card treatment, motion timing) uniformly across every FeatureHome-style landing, so sections built in different eras read as one product.
- Standardize card hover/spacing/iconography on the Lucide set already used in `sidebarRegistry.js`; sections predating the registry (ad hoc buttons/lists) get aligned last since they're functionally fine today.

---

## 7. Mobile

Continue the existing section-by-section rollout in `docs/MOBILE_REDESIGN.md` (`MobileShell`/`MobileSheet`). Apply the same Learning Map and unified-Home consolidation to the mobile bottom nav, so mobile doesn't inherit the 40-item sprawl in a harder-to-scroll form.

---

## 8. Phased roadmap

**Phase 0 — days, zero architecture change**
- Visible search entry point that opens the existing Cmd+K palette.
- "Recently visited" shelf on Home (localStorage, last 5).
- Sane default sidebar collapse (only "Learn"/"Practice" expanded on first load).

**Phase 1 — about a week**
- Breadcrumb / back-to-Home strip on every tool view.
- "Pinned" shelf on Home (star icon per sidebar item).
- "Show N more" collapse pattern inside each sidebar group beyond the top 4–5 items.

**Phase 2 — a few weeks**
- Build the "Learning Map" view-switcher wrapper uniting Curriculum Map/Roadmap 2.0/3.0/Galaxy/Graph.
- Build the unified Home view-switcher uniting overview/Home2/legacy hub/HomePage3.
- Extend FeatureHome landings to the remaining top-level sections that lack them.

**Phase 3 — ongoing engineering hygiene**
- Consolidate `Sidebar.jsx` into `SidebarModern.jsx` once parity is verified.
- Extend the visibility/layout system to per-user personalization, not just admin curation.
- Apply `MASTER.md` tokens uniformly across the oldest sections.

---

## 9. Success metrics

- % of sessions using Cmd+K search (discoverability of the palette).
- Median clicks from Home to each of the top 10 destinations (should drop).
- Bounce rate off Home within 10 seconds (should drop).
- Expand-rate on "Show N more" sidebar overflow (tunes future defaults from real data, not guesses).
- Trend of "can't find X" feedback/support mentions (should decline).

---

## 10. Non-goals

- No section, tool, lab, or page is removed or made unreachable.
- No change to the underlying functionality or data of any existing feature.
- No forced migration mid-session — new defaults apply on next visit; existing flags and routes keep working underneath.
