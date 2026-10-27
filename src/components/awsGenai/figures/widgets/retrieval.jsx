import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge, Controls, FigureFrame, GridY, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, clamp, fmt, linePath, scale, usePlayback, useSweep,
} from "../kit";

/* Retrieval widgets: embeddings, chunking, hybrid search and reranking,
   ANN indexes, OpenSearch sizing and semantic caching. */

/* ── vector space ──────────────────────────────────────────────────────── */

const DOCS = [
  { text: "Reset my password", topic: "login", angle: 14, r: 0.92, tenant: "acme" },
  { text: "Can't sign in to my account", topic: "login", angle: 22, r: 0.86, tenant: "globex" },
  { text: "2FA code never arrives", topic: "login", angle: 30, r: 0.95, tenant: "globex" },
  { text: "Account locked after retries", topic: "login", angle: 8, r: 0.78, tenant: "acme" },
  { text: "Charged twice this month", topic: "billing", angle: 78, r: 0.9, tenant: "acme" },
  { text: "Download my last invoice", topic: "billing", angle: 88, r: 0.8, tenant: "globex" },
  { text: "Cancel my subscription", topic: "billing", angle: 70, r: 0.84, tenant: "globex" },
  { text: "Refund a double payment", topic: "billing", angle: 82, r: 0.97, tenant: "acme" },
  { text: "Where is my parcel?", topic: "shipping", angle: 140, r: 0.9, tenant: "acme" },
  { text: "Delivery is three days late", topic: "shipping", angle: 150, r: 0.84, tenant: "globex" },
  { text: "Change the delivery address", topic: "shipping", angle: 132, r: 0.8, tenant: "acme" },
  { text: "Print a return label", topic: "shipping", angle: 158, r: 0.94, tenant: "globex" },
];
const QUERIES = [
  { id: "login", text: "I can't get into my account", angle: 19, r: 0.88 },
  { id: "billing", text: "Why was I billed two times?", angle: 80, r: 0.9 },
  { id: "shipping", text: "Has my package shipped yet?", angle: 145, r: 0.86 },
];
const TOPIC_COLOR = { login: KIND_COLOR.security, billing: KIND_COLOR.compute, shipping: KIND_COLOR.storage };

export function VectorSpace({ config = {} }) {
  const [queryId, setQueryId] = useState("login");
  const [k, setK] = useState(3);
  const [filter, setFilter] = useState(config.filter ? "post" : "off");
  const query = QUERIES.find((item) => item.id === queryId);

  const ranked = useMemo(() => DOCS
    .map((doc, index) => ({ ...doc, index, sim: Math.cos(((doc.angle - query.angle) * Math.PI) / 180) }))
    .sort((a, b) => b.sim - a.sim), [query]);

  const passes = (doc) => doc.tenant === "acme";
  let results;
  if (filter === "pre") results = ranked.filter(passes).slice(0, k);
  else if (filter === "post") results = ranked.slice(0, k).filter(passes);
  else results = ranked.slice(0, k);
  const chosen = new Set(results.map((doc) => doc.index));
  const considered = filter === "post" ? new Set(ranked.slice(0, k).map((doc) => doc.index)) : chosen;

  const W = 700;
  const H = 300;
  const ox = 330;
  const oy = 262;
  const R = 230;
  const pos = (item) => [ox + Math.cos((item.angle * Math.PI) / 180) * R * item.r, oy - Math.sin((item.angle * Math.PI) / 180) * R * item.r];
  const [qx, qy] = pos(query);

  return (
    <FigureFrame
      kind="Interactive"
      title={config.filter ? "Nearest neighbours, with a metadata filter" : "Similar meaning lands close together"}
      caption={filter === "post" && results.length < k
        ? `Post-filtering took the top ${k} first and then dropped other tenants, so only ${results.length} result${results.length === 1 ? "" : "s"} came back. Filter during the search (pre-filter) to get k results.`
        : config.filter
          ? "Metadata filters (tenant, department, date) narrow the search to documents the caller may see and that match the question's scope."
          : "Cosine similarity compares direction, not length. A 2-D sketch of what a 1,024-dimension embedding does: paraphrases share almost no words but point the same way."}
    >
      <Controls>
        <Segmented label="Question" value={queryId} options={QUERIES.map((item) => ({ id: item.id, label: item.text }))} onChange={setQueryId} />
        <Slider label="k (results)" value={k} min={1} max={6} onChange={setK} />
        {config.filter ? (
          <Segmented label="Filter tenant = acme" value={filter} onChange={setFilter} options={[
            { id: "off", label: "No filter" }, { id: "pre", label: "Pre-filter" }, { id: "post", label: "Post-filter" },
          ]} />
        ) : null}
      </Controls>
      <div className="aipf-split aipf-split--wide">
        <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
          <path d={`M${ox - R - 10},${oy} L${ox + R + 10},${oy}`} className="aipf-axis" />
          <path d={`M${ox + R} ${oy} A ${R} ${R} 0 0 0 ${ox - R} ${oy}`} className="aipf-arc" />
          {results.map((doc) => {
            const [x, y] = pos(doc);
            return <line key={`ray-${queryId}-${doc.index}`} x1={ox} y1={oy} x2={x} y2={y} className="aipf-ray is-hit" />;
          })}
          <line key={`q-${queryId}`} x1={ox} y1={oy} x2={qx} y2={qy} className="aipf-ray is-query" />
          {DOCS.map((doc, index) => {
            const [x, y] = pos(doc);
            const hit = chosen.has(index);
            const dropped = filter !== "off" && !passes(doc);
            return (
              <g key={doc.text} className={`aipf-dot${hit ? " is-hit" : ""}${dropped ? " is-dropped" : ""}`}>
                <circle cx={x} cy={y} r={hit ? 7 : 5} style={{ fill: TOPIC_COLOR[doc.topic] }} />
                {hit || considered.has(index) ? (
                  <text x={x + (doc.angle > 90 ? -10 : 10)} y={y - 8} textAnchor={doc.angle > 90 ? "end" : "start"} className="aipf-dot-label">{doc.text}</text>
                ) : null}
              </g>
            );
          })}
          <g style={{ transform: `translate(${qx}px, ${qy}px)`, transition: "transform .6s cubic-bezier(.4,0,.2,1)" }}>
            <circle r="9" className="aipf-query" />
            <text y="4" textAnchor="middle" className="aipf-query-text">Q</text>
          </g>
          <circle cx={ox} cy={oy} r="3" className="aipf-origin" />
        </svg>
        <ol className="aipf-rank">
          {ranked.slice(0, 6).map((doc, position) => {
            const kept = chosen.has(doc.index);
            const cut = filter === "post" && position < k && !kept;
            return (
              <li key={doc.text} className={`${kept ? "is-hit" : ""}${cut ? " is-cut" : ""}`}>
                <b>{doc.sim.toFixed(2)}</b>
                <span>{doc.text}</span>
                {config.filter ? <em className={doc.tenant === "acme" ? "is-acme" : ""}>{doc.tenant}</em> : null}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="aipf-stats">
        <Stat label="Returned" value={`${results.length} of k=${k}`} tone={results.length < k ? "bad" : "ok"} />
        <Stat label="Best match" value={results[0]?.text || "—"} />
      </div>
    </FigureFrame>
  );
}

/* ── chunker ───────────────────────────────────────────────────────────── */

const SENTENCES = [
  { s: 0, text: "Refund policy.", section: 0 },
  { s: 1, text: "You can return unused items within 30 days of delivery for a full refund to your original payment method.", section: 0 },
  { s: 2, text: "Items returned after 30 days, and up to 90 days, receive store credit instead of a refund.", section: 0, answer: true },
  { s: 3, text: "Shipping fees are not refunded unless the item arrived damaged.", section: 0 },
  { s: 4, text: "Damaged items must be reported within 7 days with a photo.", section: 0 },
  { s: 5, text: "Digital products cannot be returned once downloaded.", section: 0 },
  { s: 6, text: "Exchanges.", section: 1 },
  { s: 7, text: "You may exchange an item for a different size within 30 days.", section: 1 },
  { s: 8, text: "Exchanges ship free of charge.", section: 1 },
  { s: 9, text: "Contact support with your order number to start a return or exchange.", section: 1 },
];
const SEMANTIC_GROUPS = [[0, 1, 2], [3, 4], [5], [6, 7, 8, 9]];
const QUERY_TERMS = ["refund", "money", "back", "after", "days", "30", "90", "store", "credit", "returned"];
const CHUNK_COLORS = ["#2f7de1", "#e07a1f", "#1f9d74", "#a855f7", "#d6455d", "#0ea5b7", "#c08a12", "#5b6be8"];

const WORDS = SENTENCES.flatMap((sentence) => sentence.text.split(" ").map((word) => ({ word, s: sentence.s, section: sentence.section })));

function chunkWords(strategy, size, overlap) {
  if (strategy === "none") return [WORDS.map((_, index) => index)];
  if (strategy === "semantic") {
    return SEMANTIC_GROUPS.map((group) => WORDS.map((word, index) => (group.includes(word.s) ? index : -1)).filter((index) => index >= 0));
  }
  if (strategy === "hierarchical") {
    // Children of ~14 words inside each section; retrieval returns the parent section.
    const out = [];
    [0, 1].forEach((section) => {
      const ids = WORDS.map((word, index) => (word.section === section ? index : -1)).filter((index) => index >= 0);
      for (let start = 0; start < ids.length; start += 14) out.push(ids.slice(start, start + 14));
    });
    return out;
  }
  const step = Math.max(1, Math.round(size * (1 - overlap / 100)));
  const out = [];
  for (let start = 0; start < WORDS.length; start += step) {
    out.push(WORDS.slice(start, start + size).map((_, offset) => start + offset));
    if (start + size >= WORDS.length) break;
  }
  return out;
}

const scoreChunk = (ids) => ids.reduce((sum, index) => {
  const word = WORDS[index].word.toLowerCase().replace(/[^a-z0-9]/g, "");
  return sum + (QUERY_TERMS.includes(word) ? 1 : 0);
}, 0) / Math.sqrt(ids.length + 4);

export function Chunker() {
  const [strategy, setStrategy] = useState("fixed");
  const [size, setSize] = useState(24);
  const [overlap, setOverlap] = useState(10);
  const chunks = useMemo(() => chunkWords(strategy, size, overlap), [strategy, size, overlap]);
  const scores = chunks.map(scoreChunk);
  const best = scores.indexOf(Math.max(...scores));
  // Hierarchical retrieval matches a child but hands the model its parent section.
  const returned = strategy === "hierarchical"
    ? WORDS.map((word, index) => (word.section === WORDS[chunks[best][0]].section ? index : -1)).filter((index) => index >= 0)
    : chunks[best];
  const answerIds = WORDS.map((word, index) => (SENTENCES[word.s].answer ? index : -1)).filter((index) => index >= 0);
  const intact = answerIds.every((index) => returned.includes(index));
  const noise = Math.round((1 - answerIds.filter((index) => returned.includes(index)).length / returned.length) * 100);
  const owners = WORDS.map((_, index) => chunks.map((ids, chunk) => (ids.includes(index) ? chunk : -1)).filter((chunk) => chunk >= 0));
  const embedded = chunks.reduce((sum, ids) => sum + ids.length, 0);

  return (
    <FigureFrame
      kind="Interactive"
      title="Where you cut a document decides what retrieval can find"
      caption={intact
        ? strategy === "none"
          ? "One chunk holds everything, so the answer is in there, buried in unrelated text. Precision drops and every retrieval pays for the whole document."
          : strategy === "hierarchical"
            ? "The small child chunk matched precisely, and its parent section supplies the surrounding context: precise match, broad context."
            : "The best-matching chunk carries the whole answer, with little unrelated text."
        : "The answer sentence was split across chunks, so the best match carries only half of it. The model will answer from a fragment. Try a bigger chunk or more overlap."}
    >
      <Controls>
        <Segmented label="Strategy" value={strategy} onChange={setStrategy} options={[
          { id: "fixed", label: "Fixed size" }, { id: "hierarchical", label: "Hierarchical" },
          { id: "semantic", label: "Semantic" }, { id: "none", label: "No chunking" },
        ]} />
        {strategy === "fixed" ? (
          <>
            <Slider label="Chunk size (words)" value={size} min={8} max={60} onChange={setSize} />
            <Slider label="Overlap" value={overlap} min={0} max={40} step={5} onChange={setOverlap} format={(v) => `${v}%`} />
          </>
        ) : null}
      </Controls>
      <p className="aipf-query-line"><Badge tone="accent">query</Badge> Can I get my money back after 45 days?</p>
      <div className="aipf-doc">
        {WORDS.map((word, index) => {
          const mine = owners[index];
          const colors = mine.map((chunk) => CHUNK_COLORS[chunk % CHUNK_COLORS.length]);
          const background = colors.length > 1
            ? `repeating-linear-gradient(135deg, color-mix(in srgb, ${colors[0]} 30%, transparent) 0 4px, color-mix(in srgb, ${colors[1]} 30%, transparent) 4px 8px)`
            : `color-mix(in srgb, ${colors[0]} 18%, transparent)`;
          const inBest = returned.includes(index);
          return (
            <span key={index} className={`aipf-word${inBest ? " is-best" : ""}${SENTENCES[word.s].answer ? " is-answer" : ""}`} style={{ background }}>
              {word.word}{" "}
            </span>
          );
        })}
      </div>
      <div className="aipf-stats">
        <Stat label="Chunks" value={chunks.length} />
        <Stat label="Words embedded" value={embedded} sub={embedded > WORDS.length ? `+${embedded - WORDS.length} overlap` : "no overlap"} />
        <Stat label="Answer intact" value={intact ? "yes" : "split"} tone={intact ? "ok" : "bad"} />
        <Stat label="Unrelated text sent" value={`${noise}%`} tone={noise > 75 ? "warn" : undefined} />
      </div>
    </FigureFrame>
  );
}

/* ── hybrid search + reranker ──────────────────────────────────────────── */

const PASSAGES = [
  { id: "P1", text: "AX-4471: export fails when the invoice template has an empty logo field. Re-upload the logo.", rel: 0.96, answer: true },
  { id: "P2", text: "Exporting invoices to PDF: open Billing → Invoices → Export.", rel: 0.48 },
  { id: "P3", text: "PDF exports time out for invoices with more than 500 lines.", rel: 0.55 },
  { id: "P4", text: "Error codes AX-4400 to AX-4499 are export errors; see the index.", rel: 0.52 },
  { id: "P5", text: "How to change the invoice logo and template.", rel: 0.4 },
  { id: "P6", text: "Release notes: AX-4471 fixed in 3.2, for CSV exports only.", rel: 0.71 },
  { id: "P7", text: "Printing invoices from the mobile app.", rel: 0.08 },
  { id: "P8", text: "Billing errors when your card expires.", rel: 0.05 },
];
const KEYWORD_ORDER = ["P6", "P1", "P4", "P3", "P2", "P8", "P5", "P7"];
const VECTOR_ORDER = ["P2", "P3", "P5", "P1", "P7", "P6", "P4", "P8"];

export function RerankFusion() {
  const [mode, setMode] = useState("hybrid");
  const [rrfK, setRrfK] = useState(60);
  const [rerank, setRerank] = useState(false);

  const order = useMemo(() => {
    let list;
    if (mode === "keyword") list = [...KEYWORD_ORDER];
    else if (mode === "vector") list = [...VECTOR_ORDER];
    else {
      const score = (id) => 1 / (rrfK + KEYWORD_ORDER.indexOf(id) + 1) + 1 / (rrfK + VECTOR_ORDER.indexOf(id) + 1);
      list = PASSAGES.map((item) => item.id).sort((a, b) => score(b) - score(a));
    }
    if (rerank) {
      const head = list.slice(0, 6).sort((a, b) => PASSAGES.find((p) => p.id === b).rel - PASSAGES.find((p) => p.id === a).rel);
      list = [...head, ...list.slice(6)];
    }
    return list;
  }, [mode, rrfK, rerank]);

  const answerRank = order.indexOf("P1") + 1;
  const rowH = 38;
  return (
    <FigureFrame
      kind="Interactive"
      title="Hybrid search finds the exact code; a reranker puts it first"
      caption={answerRank === 1
        ? "The passage that names AX-4471 and the fix is now first, so the top-3 context window carries the answer."
        : mode === "vector"
          ? "Semantic search alone ranks generic PDF-export pages above the one with the exact error code: embeddings blur rare identifiers."
          : `The answer is at rank ${answerRank}. Keyword search loves exact codes, even in the wrong release note; fuse both signals and let a reranker read query and passage together.`}
    >
      <Controls>
        <Segmented label="Retrieval" value={mode} onChange={setMode} options={[
          { id: "keyword", label: "Keyword (BM25)" }, { id: "vector", label: "Vector" }, { id: "hybrid", label: "Hybrid (RRF)" },
        ]} />
        {mode === "hybrid" ? <Slider label="RRF constant k" value={rrfK} min={1} max={100} onChange={setRrfK} /> : null}
        <Toggle label="Rerank the top 6" checked={rerank} onChange={setRerank} />
      </Controls>
      <p className="aipf-query-line"><Badge tone="accent">query</Badge> Error AX-4471 when exporting invoices to PDF</p>
      <div className="aipf-reorder" style={{ height: PASSAGES.length * rowH }}>
        {PASSAGES.map((passage) => {
          const rank = order.indexOf(passage.id);
          return (
            <div key={passage.id} className={`aipf-reorder-row${rank < 3 ? " is-top" : ""}${passage.answer ? " is-answer" : ""}`}
              style={{ transform: `translateY(${rank * rowH}px)` }}>
              <b>{rank + 1}</b>
              <span className="aipf-reorder-text">{passage.text}</span>
              <span className="aipf-reorder-tags">
                <em>kw #{KEYWORD_ORDER.indexOf(passage.id) + 1}</em>
                <em>vec #{VECTOR_ORDER.indexOf(passage.id) + 1}</em>
                {rerank ? <em className="is-rr">rr {passage.rel.toFixed(2)}</em> : null}
              </span>
            </div>
          );
        })}
        <div className="aipf-reorder-cut" style={{ top: 3 * rowH - 2 }}><span>top 3 → prompt</span></div>
      </div>
      <div className="aipf-stats">
        <Stat label="Rank of the answer" value={`#${answerRank}`} tone={answerRank === 1 ? "ok" : answerRank <= 3 ? "warn" : "bad"} />
        <Stat label="In the top 3?" value={answerRank <= 3 ? "yes" : "no"} tone={answerRank <= 3 ? "ok" : "bad"} />
      </div>
    </FigureFrame>
  );
}

/* ── ANN index trade-off ───────────────────────────────────────────────── */

const ANN_MODELS = {
  exact: {
    label: "Exact (flat)",
    recall: () => 1,
    latency: (_, n) => 0.15 + n * 2e-5,
  },
  hnsw: {
    label: "HNSW",
    param: { label: "ef_search", min: 10, max: 400, step: 10, initial: 40 },
    recall: (ef, n) => clamp(1 - 0.32 * Math.exp(-ef / 45) - 0.02 * Math.log10(n / 1e4) * Math.exp(-ef / 150), 0, 1),
    latency: (ef, n) => 0.25 + ef * 0.006 + 0.08 * Math.log2(n / 1e4 + 1),
  },
  ivfflat: {
    label: "IVFFlat",
    param: { label: "probes (of 100 lists)", min: 1, max: 50, step: 1, initial: 1 },
    recall: (probes) => clamp(1 - 0.6 * Math.exp(-probes / 6), 0, 1),
    latency: (probes, n) => 0.25 + (probes / 100) * n * 2e-5,
  },
};

export function AnnIndex() {
  const [kind, setKind] = useState("hnsw");
  const [values, setValues] = useState({ hnsw: 40, ivfflat: 1 });
  const [logN, setLogN] = useState(6);
  const n = 10 ** logN;
  const model = ANN_MODELS[kind];
  const value = values[kind];
  const recall = model.recall(value, n);
  const latency = model.latency(value, n);

  const W = 700;
  const H = 230;
  const x = (ms) => scale(-1, 3, 60, W - 20)(Math.log10(clamp(ms, 0.1, 1000)));
  const y = scale(0.4, 1, H - 30, 14);
  const curve = model.param
    ? Array.from({ length: 40 }, (_, index) => {
      const p = model.param.min + ((model.param.max - model.param.min) * index) / 39;
      return [x(model.latency(p, n)), y(model.recall(p, n))];
    })
    : [];

  return (
    <FigureFrame
      kind="Interactive"
      title="Approximate indexes trade a little recall for a lot of speed"
      caption={kind === "exact"
        ? `Exact search compares the query with every vector: perfect recall, but latency grows with the collection (${fmt(latency, latency < 10 ? 2 : 0)} ms at ${fmt(n)} vectors).`
        : kind === "hnsw"
          ? `HNSW walks a layered graph. Raising ef_search (pgvector: hnsw.ef_search, default 40) explores more of it: recall ${(recall * 100).toFixed(1)}% at about ${fmt(latency, 2)} ms. Illustrative numbers.`
          : `IVFFlat searches only the closest clusters. probes = 1 (pgvector's default) is fast but misses neighbours in other lists; raise ivfflat.probes for recall. Illustrative numbers.`}
    >
      <Controls>
        <Segmented label="Index" value={kind} onChange={setKind} options={Object.entries(ANN_MODELS).map(([id, item]) => ({ id, label: item.label }))} />
        {model.param ? (
          <Slider label={model.param.label} value={value} min={model.param.min} max={model.param.max} step={model.param.step}
            onChange={(next) => setValues((prev) => ({ ...prev, [kind]: next }))} />
        ) : null}
        <Slider label="Vectors" value={logN} min={4} max={7} step={0.25} onChange={setLogN} format={(v) => fmt(10 ** v)} />
      </Controls>
      <svg viewBox={`0 0 ${W} ${H}`} className="aipf-svg">
        <GridY x0={60} x1={W - 20} ticks={[0.5, 0.75, 0.9, 1]} y={y} format={(v) => `${Math.round(v * 100)}%`} />
        {[0.1, 1, 10, 100, 1000].map((ms) => (
          <g key={ms} className="aipf-grid">
            <line x1={x(ms)} x2={x(ms)} y1="14" y2={H - 30} />
            <text x={x(ms)} y={H - 14} textAnchor="middle">{ms < 1 ? ms : fmt(ms)} ms</text>
          </g>
        ))}
        {curve.length ? <path d={linePath(curve)} className="aipf-line is-on" style={{ stroke: "var(--aipf-accent)" }} /> : null}
        <g style={{ transform: `translate(${x(ANN_MODELS.exact.latency(0, n))}px, ${y(1)}px)` }}>
          <rect x="-5" y="-5" width="10" height="10" className="aipf-exact" />
          <text x="10" y="4" className="aipf-small">exact</text>
        </g>
        <g style={{ transform: `translate(${x(latency)}px, ${y(recall)}px)`, transition: "transform .35s ease" }}>
          <circle r="13" className="aipf-pulse" />
          <circle r="6.5" className="aipf-point" />
        </g>
        <text x="16" y="20" className="aipf-small" transform={`rotate(-90 16 20)`} textAnchor="end">recall</text>
      </svg>
      <div className="aipf-stats">
        <Stat label="Recall@10" value={`${(recall * 100).toFixed(1)}%`} tone={recall > 0.95 ? "ok" : recall < 0.8 ? "bad" : "warn"} />
        <Stat label="Latency (illustrative)" value={`${fmt(latency, latency < 10 ? 2 : 0)} ms`} />
      </div>
    </FigureFrame>
  );
}

/* ── OpenSearch shard sizing ───────────────────────────────────────────── */

export function ShardSizing() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [source, setSource] = useState(300);
  const [target, setTarget] = useState(25);
  const [replicas, setReplicas] = useState(1);
  const [nodes, setNodes] = useState(4);
  const [vectorsM, setVectorsM] = useState(20);
  const [dims, setDims] = useState(1024);

  const primaries = Math.max(1, Math.ceil((source * 1.1) / target));
  const total = primaries * (1 + replicas);
  const storage = source * (1 + replicas) * 1.45;
  // HNSW: about 1.1 × (4 × dimensions + 8 × M) bytes per vector, M = 16.
  const memoryGiB = (1.1 * (4 * dims + 8 * 16) * vectorsM * 1e6 * (1 + replicas)) / 1024 ** 3;

  const shards = [];
  for (let p = 0; p < primaries; p += 1) {
    shards.push({ id: `P${p}`, primary: true, node: p % nodes });
    for (let r = 0; r < replicas; r += 1) shards.push({ id: `R${p}.${r}`, primary: false, node: (p + r + 1) % nodes, of: p });
  }
  const [t, setT] = useSweep(playback, 2600, { hold: 2600 });
  useEffect(() => { setT(0); }, [primaries, replicas, nodes, setT]);
  const placed = Math.floor(t * shards.length + 0.001);
  const perNode = Array.from({ length: nodes }, (_, node) => shards.slice(0, placed).filter((shard) => shard.node === node));
  const colW = Math.min(150, 660 / nodes);
  const maxStack = Math.max(...perNode.map((items) => items.length), 1);
  const cell = Math.min(22, 150 / Math.max(maxStack, Math.ceil(total / nodes)));

  return (
    <FigureFrame
      kind="Interactive"
      title="Size an OpenSearch domain: shards, replicas, vector memory"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={`${primaries} primary shard${primaries === 1 ? "" : "s"} of about ${fmt((source * 1.1) / primaries, 1)} GiB (aim for 10–30 GiB on search workloads). Replicas never share a node with their primary. Storage ≈ source × (1 + replicas) × 1.45; HNSW keeps every vector graph in memory.`}
    >
      <Controls>
        <Slider label="Source data (GiB)" value={source} min={10} max={2000} step={10} onChange={setSource} />
        <Slider label="Target shard size (GiB)" value={target} min={10} max={50} onChange={setTarget} />
        <Slider label="Replicas" value={replicas} min={0} max={2} onChange={setReplicas} />
        <Slider label="Data nodes" value={nodes} min={2} max={9} onChange={setNodes} />
        <Slider label="Vectors (millions)" value={vectorsM} min={1} max={100} onChange={setVectorsM} />
        <Segmented label="Dimensions" value={dims} options={[256, 512, 1024].map((value) => ({ id: value, label: String(value) }))} onChange={setDims} />
      </Controls>
      <svg viewBox="0 0 700 210" className="aipf-svg">
        {perNode.map((items, node) => {
          const x0 = 20 + node * colW;
          return (
            <g key={node}>
              <rect x={x0 + 4} y="8" width={colW - 8} height="172" rx="8" className="aipf-node-col" />
              <text x={x0 + colW / 2} y="198" textAnchor="middle" className="aipf-mono aipf-small">node {node + 1}</text>
              {items.map((shard, index) => {
                const perRow = Math.max(1, Math.floor((colW - 16) / (cell + 3)));
                const cx = x0 + 10 + (index % perRow) * (cell + 3);
                const cy = 170 - cell - Math.floor(index / perRow) * (cell + 3);
                return <rect key={shard.id} className="aipf-pop" x={cx} y={cy} width={cell} height={cell} rx="3"
                  style={{ fill: shard.primary ? KIND_COLOR.db : `color-mix(in srgb, ${KIND_COLOR.db} 35%, var(--aipf-bg))`, stroke: KIND_COLOR.db }} />;
              })}
            </g>
          );
        })}
      </svg>
      <div className="aipf-legend">
        <span><i style={{ background: KIND_COLOR.db }} />primary shard</span>
        <span><i style={{ background: `color-mix(in srgb, ${KIND_COLOR.db} 35%, transparent)`, borderColor: KIND_COLOR.db }} />replica</span>
      </div>
      <div className="aipf-stats">
        <Stat label="Primary shards" value={primaries} />
        <Stat label="Total shards" value={total} />
        <Stat label="Storage needed" value={`${fmt(storage)} GiB`} />
        <Stat label="HNSW memory" value={`${fmt(memoryGiB, 1)} GiB`} tone={memoryGiB > 200 ? "warn" : undefined} sub="incl. replicas" />
      </div>
    </FigureFrame>
  );
}

/* ── semantic cache ────────────────────────────────────────────────────── */

const CACHED_Q = "Can I cancel my order within 30 days?";
const INCOMING = [
  { text: "Can I cancel my order within 30 days", sim: 0.99, same: true },
  { text: "Is cancelling within thirty days free?", sim: 0.91, same: true },
  { text: "How do I update my address?", sim: 0.29, same: false },
  { text: "Can I cancel my order after 30 days?", sim: 0.87, same: false },
  { text: "cancel order 30 days?", sim: 0.84, same: true },
  { text: "Can my teammate cancel my order?", sim: 0.78, same: false },
  { text: "Refund policy for damaged items?", sim: 0.52, same: false },
  { text: "Can I cancel my order within 30 days?", sim: 1.0, same: true, tenant: "globex" },
];

export function SemanticCache() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [threshold, setThreshold] = useState(0.85);
  const [tenantKey, setTenantKey] = useState(true);
  const [t, setT] = useSweep(playback, INCOMING.length * 800, { hold: 2400 });
  const shown = Math.min(INCOMING.length, Math.floor(t * INCOMING.length) + 1);

  const outcomes = INCOMING.map((item) => {
    const otherTenant = item.tenant === "globex";
    if (otherTenant && tenantKey) return { ...item, result: "miss", right: true };
    const hit = item.sim >= threshold;
    if (otherTenant) return { ...item, result: hit ? "leak" : "miss", right: !hit };
    return { ...item, result: hit ? "hit" : "miss", right: hit === item.same };
  });
  const visible = outcomes.slice(0, shown);
  const hits = outcomes.filter((item) => item.result === "hit" || item.result === "leak");
  const wrong = outcomes.filter((item) => (item.result === "hit" && !item.same) || item.result === "leak");

  return (
    <FigureFrame
      kind="Simulation"
      title="A semantic cache: one threshold between savings and wrong answers"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={wrong.length
        ? `${wrong.length} wrong answer${wrong.length === 1 ? "" : "s"} served from cache. “After 30 days” is 0.87 similar to “within 30 days” and means the opposite: tune the threshold on real traffic, keep risky intents on an exact or verified path, and key entries per tenant.`
        : `${hits.length} of ${outcomes.length} questions served from cache with no wrong answers. Raise the threshold too far and paraphrases miss, so you pay for the model again.`}
    >
      <Controls>
        <Slider label="Similarity threshold" value={threshold} min={0.5} max={1} step={0.01} onChange={setThreshold} format={(v) => v.toFixed(2)} />
        <Toggle label="Tenant in the cache key" checked={tenantKey} onChange={setTenantKey} />
      </Controls>
      <p className="aipf-query-line"><Badge tone="ok">cached</Badge> “{CACHED_Q}” → “Yes: free cancellation within 30 days.” (tenant acme)</p>
      <ul className="aipf-feed">
        {visible.map((item, index) => (
          <li key={index} className={`aipf-pop is-${item.result}${item.right ? "" : " is-wrong"}`}>
            <span className="aipf-feed-sim">{item.sim.toFixed(2)}</span>
            <span className="aipf-feed-text">{item.text}{item.tenant ? <em> · tenant {item.tenant}</em> : null}</span>
            <Badge tone={item.result === "miss" ? "muted" : item.right ? "ok" : "bad"}>
              {item.result === "leak" ? "LEAK" : item.result === "hit" ? (item.right ? "HIT" : "WRONG HIT") : "MISS"}
            </Badge>
          </li>
        ))}
      </ul>
      <div className="aipf-stats">
        <Stat label="Served from cache" value={`${hits.length}/${outcomes.length}`} />
        <Stat label="Wrong answers" value={wrong.length} tone={wrong.length ? "bad" : "ok"} />
        <Stat label="Model calls" value={outcomes.length - hits.length} />
      </div>
    </FigureFrame>
  );
}
