# Render Quality Overhaul — Plan

**Goal:** Match (then beat) Mermaid's render quality. Add bezier/curved edge mode alongside orthogonal. Make the overall diagram experience feel smooth and polished end-to-end.

**Status:** Research + plan. No code yet.

---

## 1. Why our diagrams look worse than Mermaid

After auditing both pipelines:

| Dimension | Mermaid | Flow Design (today) | Gap |
|---|---|---|---|
| Layout engine | dagre or ELK (v11 pluggable) | ELK only | none |
| ELK edge routing | `ORTHOGONAL` | `ORTHOGONAL` | none |
| Post-layout edge smoothing | **`d3.line().curve(d3.curveBasis)`** over ELK waypoints | None — orthogonal waypoints rendered as polylines via React Flow `getSmoothStepPath` / `getBezierPath` based on a `variant` flag that doesn't actually consume ELK bend points for bezier | **Critical** |
| Default node font | `"trebuchet ms", verdana, arial` (warm, soft) | App default (Inter/system) | Aesthetic |
| Default corner radius / padding | 5px / 15px, consistent | Varies per shape component | Inconsistency |
| Per-diagram edge curve config | `flowchart.curve: 'basis'` + per-edge `linkStyle ... interpolate ...` | Not exposed; no DSL directive | Missing |
| Hand-drawn look | `look: handDrawn` via rough.js | Not supported | Missing |
| Pan/zoom | App-specific | React Flow built-in (good, but worth checking GPU compositing) | Probably fine |

**Root cause of the visual gap:** we ask ELK for orthogonal routes (good) but never run the d3-curve smoothing pass that Mermaid does. ELK returns polyline bend points; we then either feed them to `getSmoothStepPath` (rounded right-angles — engineering look) or compute a fresh cubic bezier from source/target tangents that **ignores ELK's bend points entirely** (`pathUtils.ts:254`). Neither path gives Mermaid's signature soft B-spline through the routed corridor.

## 2. Strategy

Adopt Mermaid's recipe. It is well-proven, well-documented, and small in scope:

> **Keep ELK with `edgeRouting: ORTHOGONAL`. Replace the final path-generation step with `d3.line().curve(curveFn)` over the full ELK waypoint sequence.**

This gives us:
- Same orthogonal corridor (no edge-edge overlaps, ELK's strength)
- Smooth, organic curves through that corridor (Mermaid's strength)
- A single `curve` setting controls the look (`basis`, `linear`, `monotoneX`, `cardinal`, `catmullRom`, `bumpY`, `step`, …)
- The orthogonal vs bezier toggle the user asked for is just `'step' | 'basis'`

For users who want hard right-angles with rounded corners ("engineering look"), keep the existing `getSmoothStepPath` route available as a third option.

## 3. Per-diagram bezier setting (UX)

User picked **per-diagram** (not per-edge) for v1. Surface it three ways, in priority order:

1. **DSL frontmatter** (Mermaid-compatible):
   ```
   ---
   config:
     flowchart:
       curve: basis        # basis | linear | step | cardinal | monotoneX | catmullRom
   ---
   flowchart TD
     A --> B
   ```
2. **Init directive** (Mermaid-compatible): `%%{init: {'flowchart': {'curve': 'basis'}}%%`
3. **UI toggle** in the diagram settings panel: dropdown `Edge style: Orthogonal | Smooth (curved) | Rounded steps | Straight`.

Internally, all three write to the same `EdgeCurveConfig` field on the scene. Per-edge override (`linkStyle N interpolate ...`) is a follow-up — not v1.

## 4. Edge-style taxonomy (final)

We collapse the current scattered concepts (`variant`, `routingMode`, `stroke`) into one clean model:

```ts
type EdgeCurve =
  | 'basis'       // Mermaid default — smooth B-spline through waypoints
  | 'linear'      // straight polyline
  | 'step'        // orthogonal, sharp corners
  | 'smoothstep'  // orthogonal, rounded corners (engineering look)
  | 'monotoneX'   // monotone in X — good for LR flows
  | 'monotoneY'   // monotone in Y — good for TD flows
  | 'cardinal'
  | 'catmullRom'
  | 'bumpY';      // pure cubic bezier between endpoints (React Flow style)

type EdgeRouting =
  | 'orthogonal'  // ELK ORTHOGONAL — corridor routing
  | 'polyline'    // ELK POLYLINE — minimal waypoints
  | 'direct';     // ignore ELK, straight source→target
```

`EdgeCurve` controls the *visual* smoothing pass. `EdgeRouting` controls what ELK does. They are orthogonal axes. Mermaid-equivalent default: `routing: 'orthogonal'`, `curve: 'basis'`.

## 5. Implementation plan

### Phase 1 — Edge smoothing core (the big visual win) [1–2 days]

1. **Add `curveFromName(name): CurveFactory`** helper next to `src/services/elk-layout/`. One file, maps strings to `d3-shape` curve factories. Mirror Mermaid's `interpolateToCurve`.
2. **New path builder `buildCurvedEdgePath(waypoints, curve)`** in `src/lib/edgePaths/` (new file). Uses `d3.line().x().y().curve(curveFn)` over the *full* waypoint list (source port → ELK bend points → target port).
3. **Plumb ELK waypoints through.** Today `pathUtils.ts:130–254` consults `shouldUseElkRoute` then re-derives a bezier from endpoints. Replace the bezier branch: when `curve !== 'step' && curve !== 'smoothstep'`, call `buildCurvedEdgePath(elkWaypoints, curve)`. Keep `getSmoothStepPath` for `'smoothstep'`. Keep `getBezierPath` only as fallback when ELK has zero waypoints (e.g., manual/imported routes).
4. **Default `curve` per diagram type:**
   - flowchart / state / class / ER / architecture / journey: `'basis'`
   - mindmap: keep custom branch path (already curved)
   - sequence: N/A (manual layout)
5. **Type sweep.** Remove `variant: 'bezier' | 'smoothstep' | 'step' | 'straight'` from `pathUtilsTypes.ts:36`; replace with `curve: EdgeCurve`. Update all call sites.

**Acceptance:** identical Mermaid input renders visually within ~5% of Mermaid's output side-by-side on a 10-edge flowchart. Manual A/B with screenshots.

### Phase 2 — Config plumbing [1 day]

1. **Scene-level `edgeCurve` field** on the diagram model.
2. **DSL frontmatter parser** in `src/services/mermaid/` — read `config.flowchart.curve`, `config.flowchart.layout`, write to scene. Mermaid uses YAML frontmatter; we already accept frontmatter-ish blocks in some flows — confirm and extend.
3. **Init directive parser** — Mermaid's `%%{init: {...}}%%` regex. Extract and merge.
4. **UI toggle** in settings panel. Persists to scene.
5. **Per-edge override (deferred to v2):** `linkStyle 3 interpolate cardinal`. Note the field on the edge model now (`edge.curve?: EdgeCurve`) so we don't break the schema later.

### Phase 3 — Node aesthetics polish [1–2 days]

The render gap is not only edges. Mermaid's nodes feel softer because of:
- Consistent 15px padding
- 5–8px corner radius across rect-like shapes
- Trebuchet/Verdana font (we don't need to match exactly, but we should audit ours)
- Subtle 1px stroke at the theme's contrast color, no shadow by default

Action:
1. Audit `src/components/custom-nodes/` for inconsistent padding/radius. One pass, normalize via tokens in `theme/nodeDefaults.ts`.
2. Add a `look: 'classic' | 'soft' | 'handDrawn'` scene-level config. `soft` = our normalized defaults; `classic` = current; `handDrawn` = rough.js wrapper (Phase 5).
3. Verify our default text color has enough contrast on both theme palettes.

### Phase 4 — Layout tuning [0.5 day]

Mermaid v11 ELK defaults are tighter than ours. Compare:

| Setting | Mermaid (ELK) | Ours | Note |
|---|---|---|---|
| `spacing.nodeNode` | 50 | 40–76 (preset-driven) | Mermaid sits in the middle — fine |
| `spacing.edgeNode` | (default) | 24–42 | We're heavier; loosen the architecture preset only |
| `nodeLayer` | 50 | 60–116 | Ours is generous — confirm with eye-test |
| `layered.mergeEdges` | optional (v11) | not used | Try enabling for dense flowcharts |
| `nodePlacement.strategy` | `BRANDES_KOEPF` (v11 default) | `NETWORK_SIMPLEX` for flow | Test BK; usually produces more centered chains |

Action: small A/B in `src/services/elk-layout/options.ts:13–125`. Don't over-tune.

### Phase 5 — Hand-drawn mode [1 day, optional]

Add `look: 'handDrawn'`. Wrap final SVG `<path d=…>` strings through **rough.js** `roughSVG.path(d, { roughness: 1.2, bowing: 1, fillStyle: 'hachure' })` before mounting. Same for node shape outlines (recompute their `d`/rect → rough). Behind a feature flag.

### Phase 6 — Smoothness (pan/zoom + interactions) [1 day]

We use React Flow's built-in pan/zoom. Verify:
- Transform is applied via CSS `transform: translate3d(...) scale(...)` on the wrapper (React Flow does this by default → ✅)
- No layout work on the main thread during pan; we currently re-run ELK on data change only → ✅
- Edge labels are not re-measured on every zoom tick — check `src/services/elkLayout.ts` text sizing usage
- Drag-to-create edge has snap thresholds tuned for 60fps (no DOM thrash)

Specific risks to test:
1. Big graphs (200+ nodes): does our SVG-only render path stay smooth, or do we need to virtualize edges (don't paint off-screen)?
2. First-render flicker: ELK runs async — confirm we show a measured skeleton instead of a jump.

## 6. Critical extension points (file:line)

From the codebase audit, the changes land in:

- [src/services/elk-layout/options.ts:125](src/services/elk-layout/options.ts#L125) — `'elk.edgeRouting'` value; keep ORTHOGONAL, expose `EdgeRouting` setting
- [src/services/elkLayout.ts:70-84](src/services/elkLayout.ts#L70-L84) — `collectEdgePoints` already harvests ELK bend points; this is what we feed to d3 curve
- [src/lib/edgePaths/](src/lib/edgePaths/) — new directory for `buildCurvedEdgePath`, `curveFromName`
- [src/lib/pathUtils.ts:130-254](src/lib/pathUtils.ts#L130-L254) — replace bezier-from-endpoints branch with curved path through ELK waypoints
- [src/lib/pathUtilsTypes.ts:36](src/lib/pathUtilsTypes.ts#L36) — replace `variant` enum with `curve: EdgeCurve`
- [src/services/mermaid/importSceneProjection.ts:37](src/services/mermaid/importSceneProjection.ts#L37) — extend edge metadata with optional `curve`, parse Mermaid `linkStyle ... interpolate ...`
- [src/services/mermaid/parseMermaidByType.ts:26-35](src/services/mermaid/parseMermaidByType.ts#L26-L35) — frontmatter + init directive parsing entry
- [src/theme/nodeDefaults.ts](src/theme/nodeDefaults.ts) — normalize padding/radius
- [src/components/custom-nodes/](src/components/custom-nodes/) — apply normalized tokens

## 7. Open questions

1. Do we want to keep React Flow's `getBezierPath` at all? Probably yes, as the fallback when ELK returns zero waypoints (manual edges, dragged edges-in-progress).
2. How aggressive on backwards-compat for the `variant` field? Old saved scenes carry `variant: 'bezier'`. Migration: `variant: 'bezier' → curve: 'basis'`, `variant: 'smoothstep' → curve: 'smoothstep'`, `variant: 'step' → curve: 'step'`, `variant: 'straight' → curve: 'linear'`. Single migration step in scene load.
3. Should the DSL `flowchart.layout` knob (Mermaid uses it to switch `dagre` vs `elk`) do anything for us, since we only have ELK? Suggest: ignore for now, document as no-op.
4. Hand-drawn mode: ship in v1 or defer? Defer — Phase 5 is optional.

## 8. Sequencing & estimate

| Phase | Effort | Ship gate |
|---|---|---|
| 1. Edge smoothing core | 1–2 d | A/B vs Mermaid screenshots |
| 2. Config plumbing | 1 d | Frontmatter + init directive parse correctly |
| 3. Node polish | 1–2 d | Audit + token normalization |
| 4. Layout tuning | 0.5 d | Eye-test on 5 stock diagrams |
| 5. Hand-drawn (optional) | 1 d | Behind flag |
| 6. Smoothness verify | 1 d | 200-node graph at 60fps |

**Total: ~6–8 days** for v1 (skipping Phase 5). Phase 1 alone closes most of the visible quality gap and is the right first PR.

## 9. References

- [Mermaid v11 layout engines (DeepWiki)](https://deepwiki.com/mermaid-js/mermaid/2.3-layout-engines)
- [Mermaid v11 release blog](https://docs.mermaidchart.com/blog/posts/mermaid-v11)
- [Mermaid flowchart config schema](https://mermaid.js.org/config/schema-docs/config-defs-flowchart-diagram-config.html)
- [Mermaid flowchart syntax (linkStyle interpolate)](https://mermaid.js.org/syntax/flowchart.html)
- [ELK edgeRouting reference](https://eclipse.dev/elk/reference/groups/org-eclipse-elk-layered-edgeRouting.html)
- [React Flow getBezierPath](https://reactflow.dev/api-reference/utils/get-bezier-path)
- [React Flow getSmoothStepPath](https://reactflow.dev/api-reference/utils/get-smooth-step-path)
- [perfect-arrows (tldraw style)](https://github.com/steveruizok/perfect-arrows)
- [draw.io + Mermaid ELK layout](https://www.drawio.com/blog/mermaid-elk-layout)
