import React, { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import {
  Badge, Controls, FigureFrame, PlayControls, Segmented, Slider, Stat, Toggle,
  KIND_COLOR, fmt, scale, seeded, usePlayback, useSweep,
} from "../kit";

/* Data widgets: quality gates, PII handling, key design, storage tiers,
   fine-grained access and human review. */

/* ── Glue Data Quality ─────────────────────────────────────────────────── */

const DQ_ROWS = [
  { id: "Q-101", answer: "Use the Forgot password link on the sign-in page.", lang: "en", age: 12 },
  { id: "Q-102", answer: "Yes, from Settings → Billing at any time.", lang: "en", age: 30 },
  { id: "Q-103", answer: "Desde Ajustes → Suscripción, en cualquier momento.", lang: "es", age: 45 },
  { id: "Q-104", answer: "Yes, for iOS and Android.", lang: "en", age: 60 },
  { id: "Q-105", answer: "Under Billing → Invoices, with a PDF download.", lang: "en", age: 20 },
  { id: "Q-106", answer: "Yes, SAML 2.0 and OIDC on the Business plan.", lang: "en", age: 75 },
  { id: "Q-107", answer: "14 days, no card required.", lang: "en", age: 10 },
  { id: "Q-108", answer: "Yes, as CSV or JSON from Settings → Data.", lang: "en", age: 5 },
];
const DQ_BAD = [
  { id: "Q-104", answer: "Yes.", lang: "en", age: 2 },
  { id: "Q-109", answer: "", lang: "en", age: 400 },
  { id: "Q-110", answer: "Über Einstellungen.", lang: "de", age: 3 },
];
const DQ_RULES = [
  { id: "complete", text: 'IsComplete "answer"', fails: (row) => !row.answer },
  { id: "unique", text: 'IsUnique "id"', fails: (row, rows) => rows.filter((other) => other.id === row.id).length > 1 },
  { id: "lang", text: 'ColumnValues "lang" in ["en", "es"]', fails: (row) => !["en", "es"].includes(row.lang) },
  { id: "length", text: 'ColumnLength "answer" > 10', fails: (row) => row.answer.length <= 10 },
  { id: "fresh", text: 'DataFreshness "updated_at" <= 365 days', fails: (row) => row.age > 365 },
  { id: "count", text: "RowCount > 6", table: (rows) => rows.length > 6 },
];

export function DataQuality() {
  const [bad, setBad] = useState(true);
  const [threshold, setThreshold] = useState(90);
  const [focus, setFocus] = useState(null);
  const rows = bad ? [...DQ_ROWS, ...DQ_BAD] : DQ_ROWS;
  const results = DQ_RULES.map((rule) => {
    if (rule.table) return { ...rule, pass: rule.table(rows), failing: [] };
    const failing = rows.map((row, index) => (rule.fails(row, rows) ? index : -1)).filter((index) => index >= 0);
    return { ...rule, pass: failing.length === 0, failing };
  });
  const passed = results.filter((rule) => rule.pass).length;
  const score = Math.round((passed / results.length) * 100);
  const badRows = new Set(results.flatMap((rule) => rule.failing));
  const gate = score >= threshold;
  const focused = results.find((rule) => rule.id === focus);

  return (
    <FigureFrame
      kind="Interactive"
      title="Glue Data Quality scores a batch by the rules it passes"
      caption={`Score = ${passed} of ${results.length} rules passed = ${score}%, even though ${badRows.size} of ${rows.length} rows are bad: the score counts rules, not rows. ${gate ? "At or above the threshold, so the batch goes to the clean prefix." : "Below the threshold, so the batch is quarantined and the knowledge base never sees it."} Use ETL mode to find which rows failed.`}
    >
      <Controls>
        <Toggle label="Include the new (bad) batch" checked={bad} onChange={setBad} />
        <Slider label="Pass threshold" value={threshold} min={50} max={100} step={5} onChange={setThreshold} format={(v) => `${v}%`} />
      </Controls>
      <div className="aipf-split aipf-split--wide">
        <ul className="aipf-rules">
          {results.map((rule) => (
            <li key={rule.id} className={`${rule.pass ? "is-pass" : "is-fail"}${focus === rule.id ? " is-focus" : ""}`}
              onMouseEnter={() => setFocus(rule.id)} onMouseLeave={() => setFocus(null)}>
              <Badge tone={rule.pass ? "ok" : "bad"}>{rule.pass ? "PASS" : "FAIL"}</Badge>
              <code>{rule.text}</code>
            </li>
          ))}
        </ul>
        <div className="aipf-table-wrap">
          <table className="aipf-table">
            <thead><tr><th>id</th><th>answer</th><th>lang</th><th>age</th></tr></thead>
            <tbody>
              {rows.map((row, index) => {
                const hit = focused ? focused.failing.includes(index) : badRows.has(index);
                return (
                  <tr key={`${row.id}-${index}`} className={`${hit ? "is-bad" : ""}${index >= DQ_ROWS.length ? " is-new aipf-pop" : ""}`}>
                    <td>{row.id}</td>
                    <td>{row.answer || <em>null</em>}</td>
                    <td>{row.lang}</td>
                    <td>{row.age}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="aipf-stats">
        <Stat label="Data quality score" value={`${score}%`} tone={gate ? "ok" : "bad"} />
        <Stat label="Bad rows" value={`${badRows.size}/${rows.length}`} />
        <Stat label="Destination" value={gate ? "clean/ → ingestion" : "quarantine/"} tone={gate ? "ok" : "bad"} />
      </div>
    </FigureFrame>
  );
}

/* ── PII redaction ─────────────────────────────────────────────────────── */

const PII_TEXT = "Hi, this is Jordan Lee calling about my order. My card number is 4111 1111 1111 1111 and you can email me at jordan.lee@example.com or call (206) 555-0142. My account number is 8823 1904.";
const PII_ENTITIES = [
  { text: "Jordan Lee", type: "NAME", score: 0.99 },
  { text: "4111 1111 1111 1111", type: "CREDIT_DEBIT_NUMBER", score: 0.98 },
  { text: "jordan.lee@example.com", type: "EMAIL", score: 0.99 },
  { text: "(206) 555-0142", type: "PHONE", score: 0.97 },
  { text: "8823 1904", type: "BANK_ACCOUNT_NUMBER", score: 0.62 },
].map((entity) => ({ ...entity, start: PII_TEXT.indexOf(entity.text), end: PII_TEXT.indexOf(entity.text) + entity.text.length }));

export function PiiRedact() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [mode, setMode] = useState("type");
  const [threshold, setThreshold] = useState(0.7);
  const [t, setT] = useSweep(playback, 4200, { hold: 3000 });
  useEffect(() => { setT(0); }, [mode, threshold, setT]);
  const cursor = t * PII_TEXT.length;
  const anyFound = PII_ENTITIES.some((entity) => entity.score >= threshold);
  const blocked = mode === "block" && anyFound && cursor >= PII_TEXT.length;

  const pieces = [];
  let at = 0;
  PII_ENTITIES.forEach((entity) => {
    pieces.push({ text: PII_TEXT.slice(at, entity.start) });
    pieces.push({ text: entity.text, entity });
    at = entity.end;
  });
  pieces.push({ text: PII_TEXT.slice(at) });

  const render = (piece, index) => {
    if (!piece.entity) return <span key={index}>{piece.text}</span>;
    const { entity } = piece;
    const scanned = cursor >= entity.start;
    const caught = entity.score >= threshold;
    if (!scanned) return <span key={index}>{piece.text}</span>;
    if (!caught) {
      return <span key={index} className="aipf-pii is-missed" title={`${entity.type} · ${entity.score} < threshold`}>{piece.text}</span>;
    }
    const label = mode === "detect" ? piece.text
      : mode === "mask" ? piece.text.replace(/[A-Za-z0-9]/g, "*")
        : mode === "type" ? `[${entity.type}]`
          : `{${entity.type}}`;
    return (
      <span key={index} className={`aipf-pii is-caught is-${mode}`} title={`${entity.type} · score ${entity.score}`}>
        {label}
        {mode === "detect" ? <sup>{entity.type} {entity.score.toFixed(2)}</sup> : null}
      </span>
    );
  };

  return (
    <FigureFrame
      kind="Interactive"
      title="Detect, mask or replace PII before it reaches a model or a log"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={PII_ENTITIES.some((entity) => entity.score < threshold)
        ? `The account number scored ${PII_ENTITIES[4].score}, below your ${threshold.toFixed(2)} threshold, so it went through unredacted. Thresholds trade missed PII against over-redaction; test them on real text.`
        : mode === "block"
          ? "A Guardrails sensitive-information policy set to BLOCK rejects the whole message when PII is found. ANONYMIZE masks it and lets the request continue."
          : "Comprehend DetectPiiEntities finds the spans with a score each; you choose to mask them or replace them with the entity type. Guardrails does the same at inference time; Macie finds PII sitting in S3."}
    >
      <Controls>
        <Segmented label="Action" value={mode} onChange={setMode} options={[
          { id: "detect", label: "Detect" }, { id: "mask", label: "Mask ****" }, { id: "type", label: "Entity type" },
          { id: "anonymize", label: "Guardrails ANONYMIZE" }, { id: "block", label: "Guardrails BLOCK" },
        ]} />
        <Slider label="Minimum confidence" value={threshold} min={0.5} max={1} step={0.01} onChange={setThreshold} format={(v) => v.toFixed(2)} />
      </Controls>
      <div className={`aipf-pii-box${blocked ? " is-blocked" : ""}`}>
        {blocked
          ? <><b>Blocked.</b> Sorry, I can't process messages that contain personal information.</>
          : <>{pieces.map(render)}<span className="aipf-scan" style={{ left: `${Math.min(100, (cursor / PII_TEXT.length) * 100)}%` }} /></>}
      </div>
      <div className="aipf-stats">
        <Stat label="Entities found" value={PII_ENTITIES.filter((entity) => entity.score >= threshold).length} />
        <Stat label="Missed (below threshold)" value={PII_ENTITIES.filter((entity) => entity.score < threshold).length} tone={PII_ENTITIES.some((entity) => entity.score < threshold) ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── DynamoDB partition keys ───────────────────────────────────────────── */

const PARTITION_KEYS = {
  session: { label: "session_id", shares: [0.25, 0.25, 0.25, 0.25] },
  user: { label: "user_id", shares: [0.3, 0.27, 0.23, 0.2] },
  date: { label: "date (today)", shares: [1, 0, 0, 0] },
  status: { label: "status (3 values)", shares: [0.8, 0.12, 0.08, 0] },
};
const WCU_LIMIT = 1000;

export function DynamoPartitions() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [key, setKey] = useState("date");
  const [writes, setWrites] = useState(3000);
  const [phase] = useSweep(playback, 1600, { hold: 0 });
  const loads = PARTITION_KEYS[key].shares.map((share) => share * writes);
  const throttled = loads.reduce((sum, load) => sum + Math.max(0, load - WCU_LIMIT), 0);
  const hottest = Math.max(...loads);

  return (
    <FigureFrame
      kind="Simulation"
      title="The partition key decides whether DynamoDB spreads or concentrates load"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} />}
      caption={throttled
        ? `${fmt(hottest)} writes/s land on one partition, which tops out around ${fmt(WCU_LIMIT)} WCU: ${Math.round((throttled / writes) * 100)}% of writes throttle even with spare capacity elsewhere. Pick a high-cardinality key such as session_id.`
        : "A high-cardinality key spreads writes across partitions, so no single one hits its per-partition limit."}
    >
      <Controls>
        <Segmented label="Partition key" value={key} onChange={setKey} options={Object.entries(PARTITION_KEYS).map(([id, item]) => ({ id, label: item.label }))} />
        <Slider label="Writes per second" value={writes} min={500} max={6000} step={100} onChange={setWrites} />
      </Controls>
      <svg viewBox="0 0 700 200" className="aipf-svg">
        <g className="aipf-src">
          <rect x="16" y="76" width="110" height="48" rx="10" />
          <text x="71" y="98" textAnchor="middle">writes</text>
          <text x="71" y="114" textAnchor="middle" className="aipf-mono aipf-small">{fmt(writes)}/s</text>
        </g>
        {loads.map((load, index) => {
          const y0 = 14 + index * 46;
          const over = load > WCU_LIMIT;
          const fill = Math.min(1, load / WCU_LIMIT);
          const dots = Math.round((load / writes) * 10);
          return (
            <g key={index}>
              {Array.from({ length: dots }, (_, d) => {
                const p = (phase + d / Math.max(1, dots)) % 1;
                const bounce = over && d % 3 === 0;
                const xPos = 126 + p * 330;
                const yPos = 100 + (y0 + 20 - 100) * p;
                return <circle key={d} cx={bounce && p > 0.8 ? 126 + (1.6 - p) * 330 : xPos} cy={yPos} r="3.2" className={`aipf-flow-dot${bounce && p > 0.8 ? " is-bad" : ""}`} />;
              })}
              <rect x="470" y={y0} width="200" height="38" rx="8" className={`aipf-part${over ? " is-hot" : ""}`} />
              <rect x="470" y={y0 + 30} width={200 * fill} height="8" rx="3" className={`aipf-fill${over ? " is-bad" : fill > 0.75 ? " is-wait" : " is-ok"}`} />
              <text x="480" y={y0 + 18} className="aipf-small">partition {index + 1}</text>
              <text x="660" y={y0 + 18} textAnchor="end" className="aipf-mono aipf-small">{fmt(load)} WCU</text>
            </g>
          );
        })}
      </svg>
      <div className="aipf-stats">
        <Stat label="Hottest partition" value={`${fmt(hottest)} WCU`} tone={hottest > WCU_LIMIT ? "bad" : "ok"} sub={`limit ≈ ${fmt(WCU_LIMIT)}`} />
        <Stat label="Throttled writes" value={`${Math.round((throttled / writes) * 100)}%`} tone={throttled ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── S3 lifecycle ──────────────────────────────────────────────────────── */

const S3_CLASSES = {
  STANDARD: { cost: 1, retrieval: "milliseconds", min: 0, color: KIND_COLOR.storage },
  STANDARD_IA: { cost: 0.54, retrieval: "milliseconds + retrieval fee", min: 30, color: "#5f9a1f" },
  GLACIER_IR: { cost: 0.17, retrieval: "milliseconds + retrieval fee", min: 90, color: "#2f8f8a" },
  DEEP_ARCHIVE: { cost: 0.043, retrieval: "up to 12 hours (restore first)", min: 180, color: "#3a5fa8" },
};
const LIFECYCLE_MAX = 730;

export function S3Lifecycle() {
  const frameRef = useRef(null);
  const playback = usePlayback(frameRef);
  const [ia, setIa] = useState(30);
  const [gir, setGir] = useState(90);
  const [archive, setArchive] = useState(180);
  const [expire, setExpire] = useState(730);
  const [t, setT] = useSweep(playback, 9000, { hold: 2600 });
  useEffect(() => { setT(0); }, [ia, gir, archive, expire, setT]);
  const age = Math.round(t * LIFECYCLE_MAX);

  const stops = [["STANDARD", 0], ["STANDARD_IA", ia], ["GLACIER_IR", gir], ["DEEP_ARCHIVE", archive]]
    .filter(([, day]) => day !== null && day < LIFECYCLE_MAX).sort((a, b) => a[1] - b[1]);
  const classAt = (day) => stops.filter(([, start]) => start <= day).pop()?.[0] || "STANDARD";
  const expired = expire !== null && age >= expire;
  const current = classAt(age);

  const problems = [];
  if (ia !== null && ia < 30) problems.push("Standard-IA needs at least 30 days in Standard first.");
  const chain = [ia, gir, archive].filter((day) => day !== null);
  if (chain.some((day, index) => index && day <= chain[index - 1])) {
    problems.push("Transitions only go down the waterfall: Standard-IA, then Glacier Instant Retrieval, then Deep Archive.");
  }
  stops.forEach(([name, start], index) => {
    if (!index) return;
    const [prev, prevStart] = stops[index - 1];
    const stay = start - prevStart;
    if (S3_CLASSES[prev].min > stay) problems.push(`Leaving ${prev} after ${stay} days still bills its ${S3_CLASSES[prev].min}-day minimum.`);
  });

  let costDays = 0;
  for (let day = 0; day < Math.min(age, expire ?? LIFECYCLE_MAX); day += 1) costDays += S3_CLASSES[classAt(day)].cost;
  const relative = age ? costDays / Math.min(age, expire ?? LIFECYCLE_MAX) : 1;
  const x = scale(0, LIFECYCLE_MAX, 20, 680);
  const pick = (value, setter) => setter(value === "never" ? null : Number(value));

  return (
    <FigureFrame
      kind="Simulation"
      title="Lifecycle rules walk an object down the storage classes"
      frameRef={frameRef}
      {...playback.hoverProps}
      controls={<PlayControls playback={playback} onReset={() => setT(0)} />}
      caption={problems[0] || `Day ${age}: ${expired ? "expired and deleted by the lifecycle rule" : `${current.replace("_", " ")}, retrieval in ${S3_CLASSES[current].retrieval}`}. Unknown access patterns? Intelligent-Tiering moves objects for you with no retrieval fees. Relative prices are illustrative.`}
    >
      <Controls>
        <Segmented label="→ Standard-IA" value={ia ?? "never"} onChange={(v) => pick(v, setIa)} options={[15, 30, 60, "never"].map((v) => ({ id: v, label: v === "never" ? "never" : `day ${v}` }))} />
        <Segmented label="→ Glacier IR" value={gir ?? "never"} onChange={(v) => pick(v, setGir)} options={[45, 90, 120, "never"].map((v) => ({ id: v, label: v === "never" ? "never" : `day ${v}` }))} />
        <Segmented label="→ Deep Archive" value={archive ?? "never"} onChange={(v) => pick(v, setArchive)} options={[180, 365, "never"].map((v) => ({ id: v, label: v === "never" ? "never" : `day ${v}` }))} />
        <Segmented label="Expire" value={expire ?? "never"} onChange={(v) => pick(v, setExpire)} options={[365, 730, "never"].map((v) => ({ id: v, label: v === "never" ? "never" : `day ${v}` }))} />
      </Controls>
      <svg viewBox="0 0 700 110" className="aipf-svg">
        {stops.map(([name, start], index) => {
          const end = index + 1 < stops.length ? stops[index + 1][1] : (expire ?? LIFECYCLE_MAX);
          return (
            <g key={name}>
              <rect x={x(start)} y="30" width={Math.max(0, x(Math.min(end, LIFECYCLE_MAX)) - x(start))} height="30" className={`aipf-tier${current === name && !expired ? " is-on" : ""}`} style={{ fill: S3_CLASSES[name].color }} />
              {x(Math.min(end, LIFECYCLE_MAX)) - x(start) > 70 ? <text x={x(start) + 6} y="50" className="aipf-tier-text">{name}</text> : null}
            </g>
          );
        })}
        {expire !== null ? <text x={x(expire) - 4} y="22" textAnchor="end" className="aipf-mono aipf-small aipf-bad">expire</text> : null}
        <g style={{ transform: `translate(${x(Math.min(age, expire ?? LIFECYCLE_MAX))}px, 0)` }}>
          <line x1="0" x2="0" y1="24" y2="68" className="aipf-cursor-line" />
          <rect x="-9" y="72" width="18" height="16" rx="3" className={`aipf-object${expired ? " is-gone" : ""}`} />
        </g>
        {[0, 90, 180, 365, 730].map((day) => <text key={day} x={x(day)} y="104" textAnchor="middle" className="aipf-small">day {day}</text>)}
      </svg>
      <div className="aipf-stats">
        <Stat label="Storage class" value={expired ? "deleted" : current} />
        <Stat label="Avg cost vs Standard" value={`${Math.round(relative * 100)}%`} tone={relative < 0.5 ? "ok" : undefined} sub="relative, illustrative" />
        <Stat label="Rule check" value={problems.length ? `${problems.length} issue${problems.length === 1 ? "" : "s"}` : "valid"} tone={problems.length ? "bad" : "ok"} />
      </div>
    </FigureFrame>
  );
}

/* ── Lake Formation data filters ───────────────────────────────────────── */

const LF_COLUMNS = ["order_id", "region", "customer", "email", "amount"];
const LF_ROWS = [
  [1001, "EU", "Ana M.", "ana@example.com", 120],
  [1002, "US", "Ben K.", "ben@example.com", 80],
  [1003, "EU", "Chloé D.", "chloe@example.com", 305],
  [1004, "US", "Dev P.", "dev@example.com", 42],
  [1005, "EU", "Emil R.", "emil@example.com", 199],
  [1006, "APAC", "Fumi T.", "fumi@example.com", 66],
];
const LF_PRINCIPALS = {
  engineer: { label: "Data engineer", rows: () => true, cols: LF_COLUMNS, grant: "SELECT on the table" },
  eu: { label: "EU analyst", rows: (row) => row[1] === "EU", cols: ["order_id", "region", "customer", "amount"], grant: "data filter: region = 'EU', exclude email" },
  agent: { label: "Text-to-SQL agent (for the EU analyst)", rows: (row) => row[1] === "EU", cols: ["order_id", "region", "customer", "amount"], grant: "the same filter, carried by the role the agent uses" },
  marketing: { label: "Marketing", rows: () => true, cols: ["order_id", "region", "amount"], grant: "columns order_id, region, amount only" },
};

export function LfFilter() {
  const [who, setWho] = useState("eu");
  const principal = LF_PRINCIPALS[who];
  const visibleRows = LF_ROWS.filter(principal.rows).length;

  return (
    <FigureFrame
      kind="Interactive"
      title="Lake Formation data filters: rows, columns, cells"
      caption={`${principal.label}: ${principal.grant}. Row filter plus column exclusion is cell-level security, enforced by the query engine through credential vending. A GenAI agent must query with permissions no wider than the user it serves.`}
    >
      <Controls>
        <Segmented label="Principal" value={who} onChange={setWho} options={Object.entries(LF_PRINCIPALS).map(([id, item]) => ({ id, label: item.label }))} />
      </Controls>
      <div className="aipf-table-wrap">
        <table className="aipf-table aipf-lf">
          <thead>
            <tr>{LF_COLUMNS.map((column) => <th key={column} className={principal.cols.includes(column) ? "" : "is-hidden"}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {LF_ROWS.map((row) => {
              const rowOk = principal.rows(row);
              return (
                <tr key={row[0]} className={rowOk ? "" : "is-hidden"}>
                  {row.map((cell, index) => {
                    const ok = rowOk && principal.cols.includes(LF_COLUMNS[index]);
                    return <td key={index} className={ok ? "" : "is-hidden"}>{ok ? cell : <Lock size={11} />}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="aipf-stats">
        <Stat label="Rows visible" value={`${visibleRows}/${LF_ROWS.length}`} />
        <Stat label="Columns visible" value={`${principal.cols.length}/${LF_COLUMNS.length}`} />
      </div>
    </FigureFrame>
  );
}

/* ── confidence gate ───────────────────────────────────────────────────── */

const EXTRACTIONS = (() => {
  const rand = seeded(17);
  return Array.from({ length: 36 }, (_, index) => {
    const confidence = index < 26 ? 0.85 + rand() * 0.14 : 0.5 + rand() * 0.33;
    const wrong = index < 26 ? rand() < 0.06 : rand() < 0.5;
    return { index, confidence, wrong };
  }).sort((a, b) => a.confidence - b.confidence);
})();

export function ConfidenceGate() {
  const [threshold, setThreshold] = useState(0.8);
  const [reveal, setReveal] = useState(true);
  const routed = EXTRACTIONS.map((item) => ({ ...item, human: item.confidence < threshold }));
  const humans = routed.filter((item) => item.human).length;
  const slipped = routed.filter((item) => !item.human && item.wrong).length;
  const auto = routed.length - humans;
  const x = scale(0.5, 1, 30, 670);
  const stacks = {};

  return (
    <FigureFrame
      kind="Interactive"
      title="Route low-confidence extractions to a person"
      caption={`${humans} of ${routed.length} fields go to review; ${slipped} wrong value${slipped === 1 ? "" : "s"} still pass automatically. Confidence is a signal, not a guarantee: set the threshold from the cost of an error versus the cost of a review. (A2I is closed to new customers; a Step Functions or SQS review queue works the same way.)`}
    >
      <Controls>
        <Slider label="Auto-accept at confidence ≥" value={threshold} min={0.5} max={0.99} step={0.01} onChange={setThreshold} format={(v) => v.toFixed(2)} />
        <Toggle label="Reveal which values are wrong" checked={reveal} onChange={setReveal} />
      </Controls>
      <svg viewBox="0 0 700 170" className="aipf-svg">
        <rect x={x(0.5)} y="14" width={x(threshold) - x(0.5)} height="120" className="aipf-band is-warn" />
        <text x={(x(0.5) + x(threshold)) / 2} y="30" textAnchor="middle" className="aipf-small">human review</text>
        <text x={(x(threshold) + x(1)) / 2} y="30" textAnchor="middle" className="aipf-small">auto-accept</text>
        <line x1={x(threshold)} x2={x(threshold)} y1="10" y2="140" className="aipf-limit is-bad" />
        {routed.map((item) => {
          const bucket = Math.round(item.confidence * 50);
          stacks[bucket] = (stacks[bucket] || 0) + 1;
          const cy = 130 - stacks[bucket] * 13;
          const tone = reveal ? (item.wrong ? "var(--aipf-bad)" : "var(--aipf-ok)") : "var(--aipf-ink-3)";
          return <circle key={item.index} cx={x(item.confidence)} cy={cy} r="5.5" style={{ fill: tone, transition: "fill .3s" }} />;
        })}
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v) => <text key={v} x={x(v)} y="160" textAnchor="middle" className="aipf-small">{v.toFixed(1)}</text>)}
      </svg>
      <div className="aipf-stats">
        <Stat label="Sent to people" value={`${humans} (${Math.round((humans / routed.length) * 100)}%)`} />
        <Stat label="Wrong but auto-accepted" value={slipped} tone={slipped ? "bad" : "ok"} />
        <Stat label="Auto path precision" value={auto ? `${Math.round(((auto - slipped) / auto) * 100)}%` : "—"} />
      </div>
    </FigureFrame>
  );
}

