/**
 * Turns a coach reply (Markdown with fenced blocks) into renderable segments.
 *
 * The model writes plain Markdown and, where a structured view helps, fenced
 * blocks:
 *
 *   ```artifact            a JSON artifact: {"type": "hints", ...}
 *   ```tool                a tool call: {"name": "run_code", "args": {...}}
 *   ```mermaid             a diagram
 *   ```python              code (rendered as a code card with Apply / Run)
 *
 * Model JSON is often slightly off (raw newlines inside strings, trailing
 * commas, a truncated tail), so artifacts go through a tolerant parser and a
 * per-type normalizer. Anything that still can't be read falls back to a plain
 * code block rather than disappearing.
 */

export const ARTIFACT_TYPES = [
  "hints",
  "test_cases",
  "solution",
  "dry_run",
  "trace",
  "complexity",
  "review",
  "pattern",
  "approach",
  "mcq",
  "table",
  "problems",
  "flashcards",
  "lessons",
  "flow",
  "tree",
  "graph",
  "bars",
  "linked_list",
  "follow_ups",
];

const TYPE_ALIASES = {
  hint: "hints",
  initial_hints: "hints",
  testcases: "test_cases",
  test_case: "test_cases",
  tests: "test_cases",
  full_solution: "solution",
  code: "solution",
  dryrun: "dry_run",
  visualization: "trace",
  visualisation: "trace",
  animation: "trace",
  complexity_review: "complexity",
  code_review: "review",
  code_improvements: "review",
  pattern_direction: "pattern",
  detailed_guidance: "approach",
  algorithm: "approach",
  quiz: "mcq",
  comparison: "table",
  practice: "problems",
  cards: "flashcards",
  flashcard: "flashcards",
  lesson: "lessons",
  reading: "lessons",
  reactflow: "flow",
  flowchart: "flow",
  architecture: "flow",
  pipeline: "flow",
  binary_tree: "tree",
  bst: "tree",
  network: "graph",
  bar: "bars",
  histogram: "bars",
  chart: "bars",
  linkedlist: "linked_list",
  list_nodes: "linked_list",
  followups: "follow_ups",
  follow_up: "follow_ups",
  suggestions: "follow_ups",
};

export const artifactType = (value) => {
  const key = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ARTIFACT_TYPES.includes(key) ? key : TYPE_ALIASES[key] || "";
};

/* ── Tolerant JSON ──────────────────────────────────────────────────────── */

/**
 * JSON.parse, then a repair pass: raw newlines/tabs inside strings are
 * escaped, trailing commas dropped, smart quotes outside strings straightened,
 * and a truncated document is closed. Throws if it still isn't JSON.
 */
export function parseLooseJSON(raw) {
  const text = String(raw ?? "").trim().replace(/^﻿/, "");
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(repairJSON(text));
  }
}

function repairJSON(text) {
  let out = "";
  let inString = false;
  // A string opened with a smart quote also closes with one.
  let smartString = false;
  let escaped = false;
  const stack = [];
  const dropTrailingComma = () => { out = out.replace(/,\s*$/, ""); };
  const isSmart = (ch) => ch === "“" || ch === "”";

  for (const raw of text) {
    const ch = raw;
    if (inString) {
      if (escaped) { out += ch; escaped = false; continue; }
      if (ch === "\\") { out += ch; escaped = true; continue; }
      if (ch === "\"" || (smartString && isSmart(ch))) { inString = false; smartString = false; out += "\""; continue; }
      if (ch === "\n") { out += "\\n"; continue; }
      if (ch === "\r") continue;
      if (ch === "\t") { out += "\\t"; continue; }
      out += ch;
      continue;
    }
    if (isSmart(ch)) { inString = true; smartString = true; out += "\""; continue; }
    if (ch === "\"") { inString = true; out += ch; continue; }
    if (ch === "{" || ch === "[") stack.push(ch === "{" ? "}" : "]");
    if (ch === "}" || ch === "]") { dropTrailingComma(); stack.pop(); }
    out += ch;
  }
  if (escaped) out = out.slice(0, -1);
  if (inString) out += "\"";
  dropTrailingComma();
  while (stack.length) out += stack.pop();
  return out;
}

/* ── Python-ish literals and "a = 1, b = [2]" inputs ─────────────────────── */

/** A value written as Python or JSON: `True`, `None`, `'a'`, `[1, 2]`. */
export function parseLiteral(value) {
  if (typeof value !== "string") return value;
  const text = value.trim();
  if (!text) return "";
  try { return JSON.parse(text); } catch { /* try the Python spelling */ }
  const pythonish = text
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null")
    .replace(/'((?:[^'\\]|\\.)*)'/g, (_, inner) => JSON.stringify(inner.replace(/\\'/g, "'")));
  try { return JSON.parse(pythonish); } catch { return text; }
}

/** Split at top-level commas (not inside brackets or quotes). */
function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let quote = "";
  let current = "";
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    if (quote) {
      current += ch;
      if (ch === "\\") { current += text[index + 1] ?? ""; index += 1; } else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "\"" || ch === "'") quote = ch;
    else if ("[{(".includes(ch)) depth += 1;
    else if ("]})".includes(ch)) depth -= 1;
    if (ch === "," && depth === 0) { parts.push(current); current = ""; continue; }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

/**
 * A test input as an object keyed by parameter name. Accepts an object, a
 * JSON string, or the "nums = [2, 7], target = 9" form problem pages use.
 * Returns null when the input can't be read as named arguments.
 */
export function parseCaseInput(input, params = []) {
  if (input && typeof input === "object" && !Array.isArray(input)) return input;
  if (typeof input !== "string") return null;
  const text = input.trim();
  if (!text) return null;
  const literal = parseLiteral(text);
  if (literal && typeof literal === "object" && !Array.isArray(literal)) return literal;
  const assignments = splitTopLevel(text).map((part) => part.match(/^\s*([A-Za-z_]\w*)\s*[=:]\s*([\s\S]+?)\s*$/));
  if (assignments.length && assignments.every(Boolean)) {
    return Object.fromEntries(assignments.map((match) => [match[1], parseLiteral(match[2])]));
  }
  // A single bare value for a one-parameter problem.
  if (params.length === 1) return { [params[0]]: literal };
  return null;
}

/* ── Artifact normalizers ─────────────────────────────────────────────────── */

const text = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value) && value.length && value.every((item) => typeof item === "string")) return value.join("\n").trim();
  }
  return "";
};
const list = (...values) => values.find(Array.isArray) || [];
const cellText = (value) => (value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value));

const tableOf = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const headers = list(value.headers, value.columns).map(cellText);
  const rows = list(value.rows, value.data)
    .map((row) => (Array.isArray(row) ? row.map(cellText) : row && typeof row === "object" ? headers.map((header) => cellText(row[header])) : null))
    .filter((row) => row && row.length);
  return headers.length && rows.length ? { headers, rows } : null;
};

const NORMALIZERS = {
  hints: (data) => {
    const hints = list(data.hints, data.items, data.steps).map((hint, index) => {
      if (typeof hint === "string") return hint.trim() ? { title: `Hint ${index + 1}`, body: hint.trim() } : null;
      if (!hint || typeof hint !== "object") return null;
      const body = text(hint.body, hint.content, hint.text, hint.hint);
      return body ? { title: text(hint.title, hint.label) || `Hint ${index + 1}`, body } : null;
    }).filter(Boolean);
    return hints.length ? { title: text(data.title, data.heading) || "Hints", hints } : null;
  },

  test_cases: (data) => {
    const cases = list(data.cases, data.test_cases, data.tests, data.items).map((test, index) => {
      if (!test || typeof test !== "object") return null;
      const input = test.input ?? test.inputs ?? test.args;
      if (input === undefined) return null;
      return {
        name: text(test.name, test.title, test.label) || `Case ${index + 1}`,
        input,
        expected: test.expected ?? test.output ?? test.expected_output,
        hasExpected: ["expected", "output", "expected_output"].some((key) => key in test),
        explanation: text(test.explanation, test.why, test.note, test.description),
      };
    }).filter(Boolean);
    return cases.length ? { title: text(data.title) || "Test cases", cases } : null;
  },

  solution: (data) => {
    const code = text(data.code, data.full_code, data.source);
    if (!code) return null;
    return {
      title: text(data.title, data.heading) || "Full solution",
      language: text(data.language, data.lang) || "python",
      code,
      intro: text(data.intro, data.summary, data.description),
      time: text(data.time, data.time_complexity),
      space: text(data.space, data.space_complexity),
    };
  },

  dry_run: (data) => {
    const toRun = (run, index) => {
      if (typeof run === "string") return run.trim() ? { name: `Case ${index + 1}`, walkthrough: run.trim(), steps: [] } : null;
      if (!run || typeof run !== "object") return null;
      const steps = list(run.steps, run.process).map((step) => (typeof step === "string" ? step : cellText(step?.text ?? step?.description ?? step))).filter(Boolean);
      const result = {
        name: text(run.name, run.title, run.label) || (index === null ? "" : `Case ${index + 1}`),
        intro: text(run.intro, run.description),
        input: typeof run.input === "string" ? run.input : run.input ? JSON.stringify(run.input) : "",
        steps,
        table: tableOf(run.table ?? run.trace_table ?? run.grid),
        walkthrough: text(run.walkthrough, run.explanation, run.markdown),
        result: text(run.result, run.output, run.footer, run.conclusion),
      };
      return result.steps.length || result.table || result.walkthrough || result.intro ? result : null;
    };
    const runs = list(data.runs, data.dry_runs, data.cases).map(toRun).filter(Boolean);
    if (!runs.length) {
      const single = toRun(data, null);
      if (single) runs.push(single);
    }
    return runs.length ? { title: text(data.title, data.heading) || "Dry run", runs } : null;
  },

  trace: (data) => {
    const frames = list(data.frames, data.steps).map((frame) => {
      if (!frame || typeof frame !== "object") return null;
      const array = Array.isArray(frame.array) ? frame.array : Array.isArray(frame.values) ? frame.values : null;
      const grid = Array.isArray(frame.grid) && frame.grid.every(Array.isArray) ? frame.grid : null;
      if (!array && !grid) return null;
      const pointers = frame.pointers && typeof frame.pointers === "object" && !Array.isArray(frame.pointers) ? frame.pointers : {};
      return {
        array,
        grid,
        pointers: Object.fromEntries(Object.entries(pointers).filter(([, value]) => Number.isInteger(value) || (Array.isArray(value) && value.length === 2))),
        highlight: list(frame.highlight, frame.active).filter((value) => Number.isInteger(value) || Array.isArray(value)),
        done: list(frame.done, frame.settled).filter(Number.isInteger),
        vars: frame.vars && typeof frame.vars === "object" && !Array.isArray(frame.vars) ? frame.vars : null,
        note: text(frame.note, frame.caption, frame.text, frame.description),
      };
    }).filter(Boolean).slice(0, 80);
    return frames.length ? { title: text(data.title) || "Step-by-step", frames } : null;
  },

  complexity: (data) => {
    const yours = data.yours && typeof data.yours === "object" ? data.yours : {};
    const expected = data.expected && typeof data.expected === "object" ? data.expected : {};
    const result = {
      intro: text(data.intro),
      yoursTime: text(yours.time, data.actual_time, data.your_time),
      yoursSpace: text(yours.space, data.actual_space, data.your_space),
      expectedTime: text(expected.time, data.expected_time, data.optimal_time),
      expectedSpace: text(expected.space, data.expected_space, data.optimal_space),
      meetsExpected: typeof data.meets_expected === "boolean" ? data.meets_expected : typeof data.meetsExpected === "boolean" ? data.meetsExpected : null,
      summary: text(data.summary, data.verdict, data.explanation),
    };
    return result.yoursTime || result.expectedTime ? result : null;
  },

  review: (data) => {
    const improvements = list(data.improvements, data.suggestions).map((item) => {
      if (typeof item === "string") return item.trim() ? { focus: "", advice: item.trim() } : null;
      const advice = text(item?.advice, item?.detail, item?.text);
      return advice ? { focus: text(item?.focus, item?.title, item?.area), advice } : null;
    }).filter(Boolean);
    const result = {
      verdict: text(data.verdict, data.summary),
      good: text(data.what_you_did_well, data.strengths, data.good),
      missing: text(data.whats_missing, data.what_is_missing, data.issues, data.missing),
      improvements,
    };
    return result.good || result.missing || improvements.length ? result : null;
  },

  pattern: (data) => {
    const result = {
      pattern: text(data.pattern, data.name, data.title),
      why: text(data.why, data.reason),
      whenToUse: text(data.when_to_use, data.whenToUse, data.signals),
    };
    return result.pattern && (result.why || result.whenToUse) ? result : null;
  },

  approach: (data) => {
    const result = {
      title: text(data.title, data.name) || "Approach",
      intro: text(data.intro, data.idea, data.summary),
      algorithm: text(data.algorithm, data.steps),
      pseudocode: text(data.pseudocode, data.pseudo_code, data.pseudoCode),
    };
    return result.algorithm || result.pseudocode ? result : null;
  },

  mcq: (data) => {
    const options = list(data.options, data.choices).map((option, index) => {
      if (typeof option === "string" || typeof option === "number") return { id: String(index), label: String(option) };
      const label = text(option?.label, option?.text, option?.option);
      return label ? { id: String(option.id ?? index), label } : null;
    }).filter(Boolean);
    const question = text(data.question, data.prompt);
    if (!question || options.length < 2) return null;
    const rawAnswer = data.answer ?? data.correct ?? data.correct_option;
    const answer = rawAnswer === undefined || rawAnswer === null ? null
      : options.find((option) => option.id === String(rawAnswer))?.id
        ?? options.find((option) => option.label.toLowerCase() === String(rawAnswer).toLowerCase())?.id
        ?? (Number.isInteger(rawAnswer) && options[rawAnswer] ? options[rawAnswer].id : null);
    return { question, options, answer, explanation: text(data.explanation, data.why) };
  },

  table: (data) => {
    const table = tableOf(data);
    return table ? { title: text(data.title), caption: text(data.caption, data.note), ...table } : null;
  },

  problems: (data) => {
    const items = list(data.items, data.problems).map((item) => {
      if (typeof item === "string") return { id: item.trim(), reason: "" };
      const id = text(item?.id, item?.slug);
      return id ? { id, title: text(item.title), reason: text(item.reason, item.why, item.note) } : null;
    }).filter(Boolean);
    return items.length ? { title: text(data.title) || "Practice next", items } : null;
  },

  flashcards: (data) => {
    const cards = list(data.cards, data.items, data.flashcards).map((card) => {
      if (!card || typeof card !== "object") return null;
      const front = text(card.front, card.question, card.term, card.q);
      const back = text(card.back, card.answer, card.definition, card.a);
      return front && back ? { front, back } : null;
    }).filter(Boolean).slice(0, 30);
    return cards.length ? { title: text(data.title) || "Flashcards", cards } : null;
  },

  lessons: (data) => {
    const items = list(data.items, data.lessons).map((item) => {
      if (typeof item === "string") return item.trim() ? { slug: item.trim(), reason: "" } : null;
      const slug = text(item?.slug, item?.id);
      return slug ? { slug, reason: text(item.reason, item.why, item.note) } : null;
    }).filter(Boolean);
    return items.length ? { title: text(data.title) || "Read next", items } : null;
  },

  flow: (data) => {
    const endpoint = (value) => (value === null || value === undefined ? "" : String(value).trim());
    const nodes = list(data.nodes).map((node) => {
      if (typeof node === "string" || typeof node === "number") return { id: String(node), label: String(node), kind: "", detail: "", group: "" };
      const id = endpoint(node?.id ?? node?.key ?? node?.label);
      return id ? { id, label: text(node.label, node.title, node.name) || id, sublabel: text(node.sublabel, node.subtitle, node.caption), kind: text(node.kind, node.type, node.role).toLowerCase(), detail: text(node.detail, node.details, node.description, node.info), group: endpoint(node.group ?? node.parent), position: node.position && Number.isFinite(node.position.x) && Number.isFinite(node.position.y) ? node.position : null } : null;
    }).filter(Boolean).slice(0, 80);
    const ids = new Set(nodes.map((node) => node.id));
    const edges = list(data.edges, data.links).map((edge, index) => {
      if (typeof edge === "string") {
        const match = edge.match(/^\s*(.+?)\s*-+>\s*(.+?)\s*$/);
        return match ? { id: `e${index}`, source: match[1], target: match[2], label: "" } : null;
      }
      if (Array.isArray(edge)) return { id: `e${index}`, source: endpoint(edge[0]), target: endpoint(edge[1]), label: edge[2] ? String(edge[2]) : "" };
      if (!edge || typeof edge !== "object") return null;
      return { id: `e${index}`, source: endpoint(edge.source ?? edge.from), target: endpoint(edge.target ?? edge.to), label: text(edge.label, edge.text), animated: Boolean(edge.animated), dashed: Boolean(edge.dashed || edge.style === "dashed") };
    }).filter((edge) => edge && ids.has(edge.source) && ids.has(edge.target)).slice(0, 160);
    const groups = list(data.groups).map((group) => {
      const id = endpoint(group?.id ?? group?.label);
      const members = list(group?.nodes, group?.members).map(endpoint).filter((member) => ids.has(member));
      return id ? { id, label: text(group.label, group.title) || id, nodes: members } : null;
    }).filter(Boolean);
    // Group membership can come from either side.
    groups.forEach((group) => group.nodes.forEach((member) => { const node = nodes.find((entry) => entry.id === member); if (node && !node.group) node.group = group.id; }));
    nodes.forEach((node) => { if (node.group && !groups.some((group) => group.id === node.group)) groups.push({ id: node.group, label: node.group, nodes: [] }); });
    groups.forEach((group) => { group.nodes = nodes.filter((node) => node.group === group.id).map((node) => node.id); });
    const steps = list(data.steps, data.walkthrough).map((step, index) => {
      if (!step || typeof step !== "object") return null;
      const stepNodes = list(step.nodes, step.active).map(endpoint).filter((id) => ids.has(id));
      const stepEdges = list(step.edges).map((edge) => (typeof edge === "string" ? edge.replace(/\s+/g, "").replace(/-+>/, "->") : Array.isArray(edge) ? `${endpoint(edge[0])}->${endpoint(edge[1])}` : edge && typeof edge === "object" ? `${endpoint(edge.source ?? edge.from)}->${endpoint(edge.target ?? edge.to)}` : "")).filter(Boolean);
      return stepNodes.length || stepEdges.length ? { title: text(step.title, step.label) || `Step ${index + 1}`, note: text(step.note, step.description, step.text), nodes: stepNodes, edges: stepEdges } : null;
    }).filter(Boolean).slice(0, 40);
    if (!nodes.length) return null;
    const direction = /^(tb|td|vertical|top)/i.test(String(data.direction || data.layout || "")) ? "TB" : "LR";
    return { title: text(data.title) || "Flow", description: text(data.description, data.intro, data.summary), direction, nodes, edges, groups, steps };
  },

  tree: (data) => {
    const frames = (list(data.frames, data.steps).length ? list(data.frames, data.steps) : [data]).map((frame) => {
      if (!frame || typeof frame !== "object") return null;
      const tree = Array.isArray(frame.tree) ? frame.tree : Array.isArray(frame.values) ? frame.values : Array.isArray(data.tree) ? data.tree : null;
      if (!tree) return null;
      const pointers = frame.pointers && typeof frame.pointers === "object" && !Array.isArray(frame.pointers) ? frame.pointers : {};
      return {
        tree,
        highlight: list(frame.highlight, frame.active),
        visited: list(frame.visited, frame.done),
        pointers,
        labels: frame.labels && typeof frame.labels === "object" && !Array.isArray(frame.labels) ? frame.labels : {},
        vars: frame.vars && typeof frame.vars === "object" && !Array.isArray(frame.vars) ? frame.vars : null,
        note: text(frame.note, frame.caption, frame.text),
      };
    }).filter(Boolean).slice(0, 80);
    return frames.length ? { title: text(data.title) || "Tree", frames } : null;
  },

  graph: (data) => {
    const endpoint = (value) => String(value ?? "").trim();
    const rawNodes = list(data.nodes, data.vertices);
    const edges = list(data.edges, data.links).map((edge) => {
      if (Array.isArray(edge)) return { source: endpoint(edge[0]), target: endpoint(edge[1]), weight: edge[2] ?? null };
      if (!edge || typeof edge !== "object") return null;
      return { source: endpoint(edge.source ?? edge.from ?? edge.u), target: endpoint(edge.target ?? edge.to ?? edge.v), weight: edge.weight ?? edge.w ?? edge.label ?? null };
    }).filter((edge) => edge && edge.source && edge.target).slice(0, 200);
    const nodes = (rawNodes.length ? rawNodes : [...new Set(edges.flatMap((edge) => [edge.source, edge.target]))]).map((node) => (
      node && typeof node === "object" ? { id: endpoint(node.id ?? node.label), label: text(node.label) || endpoint(node.id) } : { id: endpoint(node), label: endpoint(node) }
    )).filter((node) => node.id).slice(0, 60);
    if (!nodes.length) return null;
    const frames = (list(data.frames, data.steps).length ? list(data.frames, data.steps) : [{}]).map((frame) => (frame && typeof frame === "object" ? {
      active: list(frame.active, frame.current, frame.highlight).map(endpoint),
      visited: list(frame.visited, frame.done).map(endpoint),
      path: list(frame.path, frame.edges).map((edge) => (Array.isArray(edge) ? `${endpoint(edge[0])}->${endpoint(edge[1])}` : String(edge).replace(/\s+/g, "").replace(/-+>/, "->"))),
      labels: frame.labels && typeof frame.labels === "object" && !Array.isArray(frame.labels) ? frame.labels : {},
      queue: Array.isArray(frame.queue) ? frame.queue : null,
      stack: Array.isArray(frame.stack) ? frame.stack : null,
      vars: frame.vars && typeof frame.vars === "object" && !Array.isArray(frame.vars) ? frame.vars : null,
      note: text(frame.note, frame.caption, frame.text),
    } : null)).filter(Boolean).slice(0, 80);
    const layout = String(data.layout || "").toLowerCase();
    return { title: text(data.title) || "Graph", directed: Boolean(data.directed), weighted: edges.some((edge) => edge.weight !== null && edge.weight !== ""), layout: ["circle", "layered", "tree", "force"].includes(layout) ? layout : "", nodes, edges, frames };
  },

  bars: (data) => {
    const numbers = (value) => (Array.isArray(value) ? value.map((item) => Number(item) || 0) : null);
    const frames = (list(data.frames, data.steps).length ? list(data.frames, data.steps) : [data]).map((frame) => {
      if (!frame || typeof frame !== "object") return null;
      const values = numbers(frame.values ?? frame.heights ?? frame.array) || numbers(data.values ?? data.heights ?? data.array);
      if (!values || !values.length) return null;
      return {
        values,
        water: numbers(frame.water ?? frame.fill ?? frame.overlay),
        highlight: list(frame.highlight, frame.active).filter(Number.isInteger),
        done: list(frame.done, frame.settled).filter(Number.isInteger),
        pointers: frame.pointers && typeof frame.pointers === "object" && !Array.isArray(frame.pointers) ? frame.pointers : {},
        vars: frame.vars && typeof frame.vars === "object" && !Array.isArray(frame.vars) ? frame.vars : null,
        note: text(frame.note, frame.caption, frame.text),
      };
    }).filter(Boolean).slice(0, 80);
    return frames.length ? { title: text(data.title) || "Bars", overlayLabel: text(data.overlay_label, data.water_label) || "water", frames } : null;
  },

  linked_list: (data) => {
    const frames = (list(data.frames, data.steps).length ? list(data.frames, data.steps) : [data]).map((frame) => {
      if (!frame || typeof frame !== "object") return null;
      const nodes = Array.isArray(frame.nodes) ? frame.nodes : Array.isArray(frame.values) ? frame.values : Array.isArray(data.nodes) ? data.nodes : null;
      if (!nodes || !nodes.length) return null;
      const links = Array.isArray(frame.links) ? frame.links.filter((link) => Array.isArray(link) && Number.isInteger(link[0]) && (Number.isInteger(link[1]) || link[1] === null))
        : Array.isArray(frame.next) ? frame.next.map((target, index) => [index, Number.isInteger(target) ? target : null])
          : nodes.map((_, index) => [index, index + 1 < nodes.length ? index + 1 : null]);
      return {
        nodes,
        links,
        pointers: frame.pointers && typeof frame.pointers === "object" && !Array.isArray(frame.pointers) ? frame.pointers : {},
        highlight: list(frame.highlight, frame.active).filter(Number.isInteger),
        vars: frame.vars && typeof frame.vars === "object" && !Array.isArray(frame.vars) ? frame.vars : null,
        note: text(frame.note, frame.caption, frame.text),
      };
    }).filter(Boolean).slice(0, 80);
    return frames.length ? { title: text(data.title) || "Linked list", frames } : null;
  },

  follow_ups: (data) => {
    const items = list(data.items, data.suggestions, data.prompts)
      .map((item) => (typeof item === "string" ? item.trim() : text(item?.label, item?.prompt)))
      .filter(Boolean)
      .slice(0, 4);
    return items.length ? { items } : null;
  },
};

/** `{type, ...}` in, a normalized artifact or null out. */
export function normalizeArtifact(data, typeHint = "") {
  // A bare list under a type-named fence (```hints [ … ]) is that type's items.
  if (Array.isArray(data) && artifactType(typeHint)) return normalizeArtifact({ type: typeHint, items: data });
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const type = artifactType(data.type || data.response_type || typeHint);
  if (!type) return null;
  const payload = data.payload && typeof data.payload === "object" && !Array.isArray(data.payload) ? { ...data, ...data.payload } : data;
  const normalized = NORMALIZERS[type](payload);
  return normalized ? { type, ...normalized } : null;
}

/* ── Segments ────────────────────────────────────────────────────────────── */

const CODE_LANGS = new Set(["python", "py", "python3"]);
const REACT_LANGS = new Set(["jsx", "tsx", "react"]);

/** `title="Agentic RAG"` (or bare words) after the fence language. */
export const fenceTitle = (meta) => {
  const value = String(meta || "").trim();
  const quoted = value.match(/title\s*=\s*["']([^"']+)["']/i) || value.match(/^["']([^"']+)["']$/);
  if (quoted) return quoted[1].trim();
  return value && !/[={}]/.test(value) ? value.slice(0, 80) : "";
};
const htmlTitle = (source) => (String(source).match(/<title>([^<]{1,80})<\/title>/i) || [])[1]?.trim() || "";
/** A page worth rendering (vs. a short HTML snippet to read). */
export const isHtmlArtifact = (source) => /<(!doctype|html|body|script|style|svg|canvas)\b/i.test(source) || String(source).split("\n").length >= 12;
/** A whole component (vs. a JSX fragment in an explanation). */
export const isReactArtifact = (source) => /export\s+default\b/.test(source) || /\bfunction\s+App\s*\(/.test(source);

/**
 * Segments, in order: `markdown`, `artifact`, `code`, `mermaid`, `tool`,
 * `invalid` (a fenced artifact/tool whose JSON couldn't be read). An
 * unclosed fence at the end is kept as `pending` when `partial` is set.
 */
export function splitReply(content, { partial = false } = {}) {
  const lines = String(content ?? "").replace(/\r\n?/g, "\n").split("\n");
  const segments = [];
  let markdown = [];
  const flush = () => {
    const body = markdown.join("\n").trim();
    if (body) segments.push({ type: "markdown", text: body });
    markdown = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const open = lines[index].match(/^\s{0,3}(`{3,}|~{3,})\s*([\w.+#-]*)\s*(.*)$/);
    if (!open) { markdown.push(lines[index]); continue; }
    const fence = open[1];
    const lang = open[2].toLowerCase();
    const meta = open[3].trim();
    const closer = new RegExp(`^\\s{0,3}${fence[0] === "`" ? "`" : "~"}{${fence.length},}\\s*$`);
    const body = [];
    let end = index + 1;
    while (end < lines.length && !closer.test(lines[end])) { body.push(lines[end]); end += 1; }
    const closed = end < lines.length;
    const source = body.join("\n");
    index = end;

    if (!closed && partial) { flush(); segments.push({ type: "pending", lang }); continue; }
    const hinted = lang === "artifact" || lang === "json" ? "" : artifactType(lang);
    if (lang === "artifact" || lang === "tool" || hinted || lang === "json") {
      let data = null;
      try { data = parseLooseJSON(source); } catch { data = null; }
      if (lang === "tool" || (lang === "json" && data && typeof data === "object" && typeof data.tool === "string")) {
        const name = data && typeof data === "object" ? String(data.name || data.tool || "") : "";
        flush();
        segments.push(name ? { type: "tool", call: { name, args: data.args || data.arguments || data.input || {} } } : { type: "invalid", lang, source });
        continue;
      }
      const artifact = normalizeArtifact(data, hinted);
      if (artifact) { flush(); segments.push({ type: "artifact", artifact }); continue; }
      if (lang !== "json") { flush(); segments.push({ type: "invalid", lang, source }); continue; }
    }
    if (lang === "mermaid") { flush(); segments.push({ type: "mermaid", code: source, title: fenceTitle(meta) }); continue; }
    if (lang === "svg" && /<svg[\s>]/i.test(source)) { flush(); segments.push({ type: "svg", code: source, title: fenceTitle(meta) || "SVG" }); continue; }
    if ((lang === "html" || lang === "htm") && isHtmlArtifact(source)) { flush(); segments.push({ type: "html", code: source, title: fenceTitle(meta) || htmlTitle(source) || "HTML artifact" }); continue; }
    if (REACT_LANGS.has(lang) && isReactArtifact(source)) { flush(); segments.push({ type: "react", code: source, title: fenceTitle(meta) || "React artifact" }); continue; }
    flush();
    segments.push({ type: "code", lang: CODE_LANGS.has(lang) ? "python" : lang || "text", meta, code: source.replace(/\s+$/, "") });
  }
  flush();
  return segments;
}

/** The tool calls in a reply, in order. */
export const toolCallsOf = (content) => splitReply(content).filter((segment) => segment.type === "tool").map((segment) => segment.call);

/** A reply with its tool blocks removed (what the learner sees). */
export function stripToolBlocks(content) {
  return String(content ?? "").replace(/^\s{0,3}(`{3,})\s*tool\b[^\n]*\n[\s\S]*?^\s{0,3}\1\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}
