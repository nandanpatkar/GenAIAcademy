/**
 * The coach's system prompt: who it is, the teaching policy, the problem and
 * the context the learner attached, the tools it may call and the artifact
 * formats it can answer with. Pure, so it can be unit-tested.
 */

export const PERSONALITIES = [
  { value: "friendly_senior", label: "Friendly senior", prompt: "a friendly senior engineer who has solved this before" },
  { value: "interviewer", label: "Interviewer", prompt: "a calm interviewer who nudges with questions and expects the learner to explain their thinking" },
  { value: "strict_mentor", label: "Strict mentor", prompt: "a strict mentor who holds back answers until the learner has tried" },
  { value: "coding_buddy", label: "Coding buddy", prompt: "a coding buddy thinking out loud alongside the learner" },
  { value: "professor", label: "Professor", prompt: "a professor who explains the underlying idea precisely" },
  { value: "motivational_coach", label: "Motivational coach", prompt: "an upbeat coach who keeps the learner going" },
];
export const STYLES = [
  { value: "professional", label: "Professional" },
  { value: "energetic", label: "Energetic" },
  { value: "casual", label: "Casual" },
  { value: "calm", label: "Calm" },
  { value: "funny", label: "Funny" },
  { value: "direct", label: "Direct" },
];
export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];
export const LEARNING_PREFERENCES = [
  { value: "step_by_step", label: "Step by step" },
  { value: "analogies", label: "Analogies" },
  { value: "interview_style", label: "Interview style" },
  { value: "visual", label: "Visual walkthroughs" },
];
export const DEFAULT_PREFS = {
  nickname: "",
  skillLevel: "",
  personality: "friendly_senior",
  style: "professional",
  preferences: ["step_by_step"],
  hintFirst: true,
  allowRuns: true,
};

/** The TUFY-style status line while a turn is in flight. */
const STATUS_RULES = [
  [/\b(editorial|write-?up|brute|better|optimal)\b/i, "Reviewing editorial context…"],
  [/\b(review|my code|bug|wrong|fail|error|debug)\b/i, "Analyzing your code…"],
  [/\b(problem statement|problem description|constraints|understand)\b/i, "Reading the problem…"],
  [/\b(hint|approach|pattern|strategy|stuck)\b/i, "Planning the best approach…"],
  [/\b(complexity|big-?o|time|space)\b/i, "Evaluating complexity…"],
  [/\b(dry run|trace|walkthrough|visuali[sz]e|animate|step by step)\b/i, "Tracing through an example…"],
  [/\b(compare|alternative|optimi[sz]e|improve)\b/i, "Comparing approaches…"],
  [/\b(test|edge case|case)\b/i, "Designing test cases…"],
  [/\b(quiz|mcq|question)\b/i, "Writing a question…"],
  [/\b(code|solution|answer)\b/i, "Preparing your answer…"],
];
export const statusFor = (message) => STATUS_RULES.find(([pattern]) => pattern.test(message || ""))?.[1] || "Thinking…";

/** Starting points on an empty chat; each asks for a specific artifact. */
export const QUICK_ACTIONS = [
  { id: "hints", label: "Give me hints", prompt: "I'm stuck. Give me progressive hints (not the solution)." },
  { id: "pattern", label: "Which pattern is this?", prompt: "Which pattern fits this problem, why, and how would I recognise it next time?" },
  { id: "review", label: "Review my code", prompt: "Review my current code: what I did well, what's missing, and how to improve it." },
  { id: "dry_run", label: "Visualize it", prompt: "Show me how the optimal solution works on the first example as an animated visual (tree, graph, bars, linked list or array trace — whichever fits this problem)." },
  { id: "complexity", label: "Complexity check", prompt: "What are the time and space complexity of my current code, and do they meet what this problem expects?" },
  { id: "tests", label: "Edge cases to test", prompt: "Give me the edge cases I should test, as test cases I can add." },
  { id: "quiz", label: "Quiz me", prompt: "Quiz me with one multiple-choice question about the key idea of this problem." },
  { id: "solution", label: "Full solution", prompt: "Give me the full solution code with a short explanation." },
];

const clip = (value, max) => {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max)}\n…(truncated)` : text;
};
const compactJSON = (value, max = 300) => clip(typeof value === "string" ? value : JSON.stringify(value), max);

/** A one-paragraph summary of a judge result, for the prompt and tools. */
export function summarizeResult(result, { max = 3 } = {}) {
  if (!result) return "";
  const cases = result.cases || [];
  const summary = result.summary || {};
  const lines = [`${result.accepted ? "Accepted" : summary.failed ? "Failed" : "Ran"}: ${summary.passed ?? 0}/${summary.total ?? cases.length} cases passed${summary.unjudged ? ` (${summary.unjudged} ran without an expected output)` : ""}${result.runtime ? `, ${result.runtime}s` : ""}.`];
  cases.filter((test) => test.status !== "passed").slice(0, max).forEach((test) => {
    if (test.hidden) { lines.push(`- ${test.id}: ${test.status} (hidden case)${test.error ? ` error: ${clip(test.error, 300)}` : ""}`); return; }
    lines.push(`- ${test.id}: ${test.status}; input=${compactJSON(test.input)}${test.unjudged ? "" : `; expected=${compactJSON(test.expected)}`}; got=${compactJSON(test.actual)}${test.error ? `; error: ${clip(test.error, 400)}` : ""}${test.stdout ? `; stdout: ${clip(test.stdout, 200)}` : ""}`);
  });
  return lines.join("\n");
}

export const TOOL_SPECS = [
  { name: "read_problem", args: "{}", use: "the full statement, constraints and examples (only needed if the problem description isn't attached below)" },
  { name: "read_editorial", args: "{\"approach\": \"brute | better | optimal | <approach name>\"}", use: "the official editorial for one approach: explanation and reference Python code" },
  { name: "read_editor_tab", args: "{\"tab\": \"<tab name>\"}", use: "the code in another editor tab" },
  { name: "run_code", args: "{\"code\": \"<python, optional: defaults to the learner's active tab>\", \"cases\": [{\"input\": {<param>: <value>}, \"expected\": <value, optional>}]}", use: "run Python against the sample tests (plus optional extra cases) on the judge and get per-case verdicts" },
  { name: "list_submissions", args: "{}", use: "the learner's recent submissions for this problem with verdicts, and the latest code" },
  { name: "search_problems", args: "{\"query\": \"<topic, pattern or title words>\"}", use: "find real problems in the practice set (returns ids to use in a `problems` artifact)" },
  { name: "read_notes", args: "{}", use: "the learner's own notes for this problem" },
];

// One line per artifact type; each surface lists only the types it renders.
const ARTIFACT_SHAPES = {
  hints: `hints: {"type":"hints","hints":[{"title":"Hint 1","body":"markdown"}]}. 1-3 progressive hints, each one step further; never the full algorithm in the first.`,
  test_cases: `test_cases: {"type":"test_cases","cases":[{"name":"Empty array","input":{<param>:<value>},"expected":<value>,"explanation":"what it tests"}]}. input keys MUST be the exact parameter names; values are JSON.`,
  solution: `solution: {"type":"solution","title":"Full solution","language":"python","intro":"one line","code":"<complete python using the starter signature>","time":"O(n)","space":"O(n)"}.`,
  dry_run: `dry_run: {"type":"dry_run","runs":[{"name":"Example 1","input":"nums = [2,7,11,15], target = 9","steps":["..."],"table":{"headers":["i","nums[i]","need","seen"],"rows":[["0","2","7","{}"]]},"result":"returns [0, 1]"}]}.`,
  trace: `trace (animated visual walkthrough): {"type":"trace","title":"Two pointers on [1,3,5,7]","frames":[{"array":[1,3,5,7],"pointers":{"l":0,"r":3},"highlight":[0,3],"done":[],"vars":{"sum":8},"note":"sum > target, move r left"}]}. Use "grid":[[...]] instead of "array" for matrices/DP tables (pointers/highlight then use [row, col]). 4-14 frames.`,
  complexity: `complexity: {"type":"complexity","yours":{"time":"O(n^2)","space":"O(1)"},"expected":{"time":"O(n)","space":"O(n)"},"meets_expected":false,"summary":"markdown"}.`,
  review: `review: {"type":"review","verdict":"one line","what_you_did_well":"markdown","whats_missing":"markdown","improvements":[{"focus":"Edge cases","advice":"markdown"}]}.`,
  pattern: `pattern: {"type":"pattern","pattern":"Sliding window","why":"markdown","when_to_use":"markdown"}.`,
  approach: `approach: {"type":"approach","title":"Optimal: one-pass hash map","intro":"one line","algorithm":"1. ...\\n2. ...","pseudocode":"plain pseudocode"}.`,
  mcq: `mcq: {"type":"mcq","question":"...","options":["A","B","C","D"],"answer":1,"explanation":"markdown"} (answer = index of the correct option).`,
  table: `table: {"type":"table","title":"Approaches compared","headers":["Approach","Time","Space"],"rows":[["Brute","O(n^2)","O(1)"]]}.`,
  problems: `problems: {"type":"problems","items":[{"id":"<id from search_problems>","reason":"why practise it"}]}. Only ids returned by search_problems.`,
  follow_ups: `follow_ups: {"type":"follow_ups","items":["Show me a dry run","Next hint"]}. 2-3 short next prompts in the learner's voice; end most replies with one.`,
  flashcards: `flashcards: {"type":"flashcards","title":"Attention in 6 cards","cards":[{"front":"What does the softmax in attention do?","back":"markdown"}]}. 4-10 cards, one idea each; the front is a question.`,
  flow: `flow (React Flow diagram with a walkthrough): {"type":"flow","title":"Agentic RAG","direction":"LR","description":"one line","nodes":[{"id":"q","label":"User question","kind":"input","sublabel":"short caption","detail":"markdown shown when the node is clicked","group":"retrieval"}],"edges":[{"from":"q","to":"router","label":"query","animated":true}],"groups":[{"id":"retrieval","label":"Retrieval"}],"steps":[{"title":"1. Route the query","nodes":["q","router"],"edges":["q->router"],"note":"markdown"}]}. kind is one of input, llm, agent, tool, retriever, store, decision, eval, doc, prompt, web, output. 6-30 nodes; loops are fine (grader -> rewrite -> retriever); give 4-10 steps so it plays as a walkthrough; direction "TB" for tall pipelines.`,
  tree: `tree (animated binary tree): {"type":"tree","title":"Level-order traversal","frames":[{"tree":[3,9,20,null,null,15,7],"highlight":[20],"visited":[3,9],"pointers":{"curr":20},"labels":{"20":"h=2"},"vars":{"queue":"[15,7]"},"note":"visit 20, enqueue its children"}]}. tree is the LeetCode level-order array (null for gaps; it may change between frames for inserts/deletes); highlight, visited, pointers and labels refer to node values. 3-16 frames.`,
  graph: `graph (animated graph algorithm): {"type":"graph","title":"Dijkstra from A","directed":false,"layout":"circle","nodes":["A","B","C","D"],"edges":[["A","B",4],["A","C",1],["C","B",2]],"frames":[{"active":["C"],"visited":["A"],"path":[["A","C"]],"labels":{"A":"0","C":"1","B":"4"},"queue":["(1,C)","(4,B)"],"note":"pop C (dist 1), relax C→B"}]}. layout: circle (small), layered (DAGs, topo sort, trees), force (larger). For BFS, DFS, Dijkstra, topological sort, union-find, cycle detection.`,
  bars: `bars (animated bar chart): {"type":"bars","title":"Trapping rain water","overlay_label":"water","frames":[{"values":[0,1,0,2,1,0,1,3,2,1,2,1],"water":[0,0,1,0,1,2,1,0,0,1,0,0],"pointers":{"l":2,"r":9},"highlight":[2],"done":[0,1],"vars":{"leftMax":1,"rightMax":2,"total":1},"note":"leftMax < rightMax, so water at l = leftMax - height"}]}. values are heights; water (optional) is drawn stacked on top — trapped water, profit, capacity. Also histograms, stock prices, container problems.`,
  linked_list: `linked_list (animated): {"type":"linked_list","title":"Reverse a linked list","frames":[{"nodes":[1,2,3,4],"links":[[0,null],[1,2],[2,3],[3,null]],"pointers":{"prev":0,"curr":1,"next":2},"highlight":[1],"note":"point curr.next back to prev"}]}. links are [from index, to index or null]; omit links for a plain forward list.`,
  lessons: `lessons: {"type":"lessons","items":[{"slug":"<slug from search_lessons>","reason":"why read it next"}]}. Only slugs returned by search_lessons.`,
};

export const DSA_ARTIFACTS = ["hints", "test_cases", "solution", "dry_run", "trace", "tree", "graph", "bars", "linked_list", "complexity", "review", "pattern", "approach", "mcq", "table", "flow", "problems", "follow_ups"];
export const LESSON_ARTIFACTS = ["hints", "flashcards", "mcq", "flow", "trace", "graph", "bars", "dry_run", "approach", "table", "lessons", "follow_ups"];

/** Claude-style rich artifacts: sandboxed pages and components, and SVG. */
const RICH_ARTIFACTS = `Rich artifacts (rendered live, like Claude artifacts) — for anything custom, interactive, animated or "extensive":
- \`\`\`html title="Name" — ONE complete, self-contained HTML page (inline <style> and <script>). Libraries only via <script src> from https://cdnjs.cloudflare.com or https://cdn.jsdelivr.net (d3, chart.js, three.js, anime.js…). It runs in a sandbox: no fetch/XHR, no localStorage/cookies, no forms or popups. Make it responsive, readable on a dark background unless you set your own, and interactive where it helps (buttons, sliders, step controls).
- \`\`\`jsx title="Name" — ONE React component with \`export default\`. Available imports only: react, reactflow (v11: ReactFlow, Background, Controls, MiniMap, Handle, Position, MarkerType, useNodesState, useEdgesState), d3, lucide-react, recharts. Tailwind classes work. Give ReactFlow a parent with an explicit height (e.g. style={{height: 520}}).
- \`\`\`svg title="Name" — a static SVG image.
Always write the whole artifact (never "…rest unchanged"), and close the fence.`;

const VISUAL_GUIDE = `Choosing a visual: when the learner asks to see, visualise, animate or draw something, answer with one (then a short explanation):
- arrays and matrices → trace; heights, water, prices → bars; binary trees → tree; graphs and graph algorithms → graph; linked lists → linked_list
- architectures, pipelines, agent loops, data flows → flow (with steps). If they ask for React Flow specifically or need custom interactivity, write a jsx component using reactflow instead.
- simulations, custom animations, charts, playgrounds → html (or jsx)
- quick static diagrams → mermaid`;

export const artifactGuide = (types, codeNote = "Code outside a solution artifact: a normal `python` fenced block.") => `Artifacts: a fenced block tagged \`artifact\` containing ONE JSON object with a "type". JSON must be valid (double quotes; write newlines inside strings as \\n). Put prose outside artifacts. Shapes:
${types.map((type) => `- ${ARTIFACT_SHAPES[type]}`).join("\n")}
Diagrams (recursion trees, graphs, architectures, state machines): a \`mermaid\` fenced block, small and valid (quote labels that contain punctuation: A["f(x) = y"]).
${codeNote}

${RICH_ARTIFACTS}

${VISUAL_GUIDE}`;

export const toolGuide = (specs) => `Tools: to look something up or run code, reply with ONLY a short sentence and one or more fenced blocks tagged \`tool\`, each {"name": "...", "args": {...}}, then stop. You get the results in the next message and can call more tools or answer. Don't call a tool for something already in the context below. Available:
${specs.map((spec) => `- ${spec.name} ${spec.args}: ${spec.use}`).join("\n")}`;

const POLICY = (prefs) => `Teaching policy:
- Answer the learner's actual question; keep replies focused and short. Use an artifact whenever it presents the answer better than prose.
${prefs.hintFirst
    ? "- Hint first. Do not reveal a complete solution or complete code unless the learner explicitly asks for the solution/code/answer. For \"I'm stuck\" give hints; for \"review\" point to issues and let them fix it."
    : "- The learner prefers direct answers: give complete explanations and code when useful."}
- When you give a full solution and the problem is runnable, first verify it with run_code on the samples; mention the result in one line. If it fails, fix it before answering.
- When the learner's code fails, look at the failing case, explain the root cause, and point at the line; don't rewrite everything.
- Use the editorial (read_editorial) when explaining the official approach, so your explanation matches it.
- Python only, using the exact starter signature. Never invent problem ids, test results or submission history.`;

/**
 * `problem` is the workspace problem; `detail` its loaded payload; `context`
 * the learner's attached items (already resolved to text); `prefs` the
 * personalization; `tools` the tool specs actually available.
 */
export function buildSystemPrompt({ problem, detail, pattern, activeTab, tabs = [], lastResult, context = [], prefs = DEFAULT_PREFS, tools = TOOL_SPECS, params = [] }) {
  const persona = PERSONALITIES.find((item) => item.value === prefs.personality) || PERSONALITIES[0];
  const style = STYLES.find((item) => item.value === prefs.style)?.label.toLowerCase() || "professional";
  const learner = [
    prefs.nickname && `Call the learner "${prefs.nickname}".`,
    prefs.skillLevel && `Their level: ${prefs.skillLevel}.`,
    prefs.preferences?.length && `They learn best with: ${prefs.preferences.map((value) => LEARNING_PREFERENCES.find((item) => item.value === value)?.label || value).join(", ")}.`,
  ].filter(Boolean).join(" ");

  const samples = (detail?.visibleTests || []).slice(0, 2).map((test, index) => `Example ${index + 1}: input=${compactJSON(test.input, 400)}${"expected" in test ? `, expected=${compactJSON(test.expected, 200)}` : ""}`);
  const sections = [
    `You are the AI coach inside a DSA practice workspace: ${persona.prompt}. Tone: ${style}. Write in clean Markdown.${learner ? ` ${learner}` : ""}`,
    POLICY(prefs),
    `## Problem
Title: ${problem?.title || "Unknown"}
Level: ${problem?.level || problem?.difficulty || "-"} · Topics: ${(problem?.topicTags || problem?.topics || []).slice(0, 5).join(", ") || "-"} · Pattern: ${pattern || "-"}
Runnable on the judge: ${detail?.judgeAvailable ? "yes (run and submit)" : detail?.runnable ? "run only (no expected outputs)" : "no"}
Parameters: ${params.length ? params.join(", ") : "see starter code"}
Starter code:
\`\`\`python
${clip(detail?.starterCode || "", 1500)}
\`\`\`
${samples.join("\n")}`,
    ...context.map((item) => `## Attached: ${item.label}\n${item.text}`),
    `## Learner's editor
Active tab: ${activeTab?.name || "Tab-1"}${tabs.length > 1 ? ` (other tabs: ${tabs.filter((tab) => tab.id !== activeTab?.id).map((tab) => tab.name).join(", ")})` : ""}
\`\`\`python
${clip(activeTab?.code?.trim() ? activeTab.code : "# (empty)", 8000)}
\`\`\``,
    lastResult ? `## Last run in the editor\n${summarizeResult(lastResult)}` : "",
    toolGuide(tools),
    artifactGuide(DSA_ARTIFACTS),
  ];
  return sections.filter(Boolean).join("\n\n");
}

/** A short chat title from the first message. */
export function titleFrom(message) {
  const words = String(message || "").replace(/[`*_#>[\]()]/g, " ").trim().split(/\s+/).filter(Boolean);
  const title = words.slice(0, 6).join(" ");
  return title ? (title.length > 34 ? `${title.slice(0, 33)}…` : title) + (words.length > 6 && title.length <= 34 ? "…" : "") : "New chat";
}

/* ── AI from Scratch lessons ──────────────────────────────────────────────── */

export const LESSON_QUICK_ACTIONS = [
  { id: "explain", label: "Explain simply", prompt: "Explain the core idea of this lesson simply, with an analogy, then the precise version." },
  { id: "visual", label: "Show it visually", prompt: "Show me the key idea of this lesson visually: a diagram or a step-by-step trace on a tiny example." },
  { id: "flow", label: "Interactive diagram", prompt: "Make an extensive interactive flow diagram of how the system in this lesson works, with a step-by-step walkthrough of one request going through it." },
  { id: "playground", label: "Build a playground", prompt: "Build an interactive HTML artifact that lets me play with the main idea of this lesson (sliders or buttons, and a live visual)." },
  { id: "flashcards", label: "Make flashcards", prompt: "Make flashcards for the key ideas in this lesson." },
  { id: "quiz", label: "Quiz me", prompt: "Quiz me with a few multiple-choice questions on this lesson, one at a time." },
  { id: "code", label: "Walk through the code", prompt: "Walk me through this lesson's main code file: what each part does and why." },
  { id: "hints", label: "I'm stuck on the build", prompt: "I'm stuck building this lesson's project. Give me progressive hints, not the whole answer." },
  { id: "next", label: "What should I read next?", prompt: "Based on this lesson, which lessons should I read next and why?" },
];

export const LESSON_TOOL_SPECS = [
  { name: "read_lesson", args: "{\"section\": \"<heading text, optional>\"}", use: "the lesson text, or one section of it by heading (only needed if the lesson isn't attached below)" },
  { name: "list_code_files", args: "{}", use: "the lesson's code files (paths and languages)" },
  { name: "read_code_file", args: "{\"path\": \"<path from list_code_files>\"}", use: "the full source of one lesson code file" },
  { name: "read_artifact", args: "{\"name\": \"<artifact name, optional>\"}", use: "the lesson's reusable artifact (a prompt, a skill, a checklist…)" },
  { name: "run_python", args: "{\"code\": \"<python>\"}", use: "run a short Python snippet in a remote sandbox (standard library; heavy ML packages may be missing) and get its output" },
  { name: "search_lessons", args: "{\"query\": \"<topic words>\"}", use: "find lessons in the course (returns slugs to use in a `lessons` artifact)" },
  { name: "read_notes", args: "{}", use: "the learner's own notes for this lesson" },
];

const personaLine = (prefs, where) => {
  const persona = PERSONALITIES.find((item) => item.value === prefs.personality) || PERSONALITIES[0];
  const style = STYLES.find((item) => item.value === prefs.style)?.label.toLowerCase() || "professional";
  const learner = [
    prefs.nickname && `Call the learner "${prefs.nickname}".`,
    prefs.skillLevel && `Their level: ${prefs.skillLevel}.`,
    prefs.preferences?.length && `They learn best with: ${prefs.preferences.map((value) => LEARNING_PREFERENCES.find((item) => item.value === value)?.label || value).join(", ")}.`,
  ].filter(Boolean).join(" ");
  return `You are the AI tutor inside ${where}: ${persona.prompt}. Tone: ${style}. Write in clean Markdown.${learner ? ` ${learner}` : ""}`;
};

const LESSON_POLICY = (prefs) => `Teaching policy:
- Ground every answer in this lesson: use its terms, notation and code, and say when you go beyond it. If the lesson and your general knowledge disagree, point it out.
- Keep replies focused and short. Build intuition first (analogy, tiny worked example), then the precise version. Use an artifact whenever it presents the answer better than prose: flashcards for revision, mcq to check understanding, trace or a mermaid diagram to show a process, table to compare.
${prefs.hintFirst
    ? "- For the lesson's build steps and exercises, hint first: don't hand over complete code unless the learner explicitly asks for it."
    : "- The learner prefers direct answers: give complete explanations and code when useful."}
- Never give away the answers to the lesson's own quiz; help the learner reason instead.
- When you run code, keep snippets tiny and dependency-free; say if a result needs packages the sandbox may not have.
- Never invent lesson slugs, file paths or outputs.`;

/** The course a lesson tutor teaches. AI from Scratch is the default. */
export const AIFS_COURSE = {
  description: "\"AI from Scratch\", a hands-on course that builds AI and ML from first principles",
  groupLabel: "Phase",
  notes: [],
};

export const VISUAL_COURSE = {
  description: "\"Visual Learning\", animated step-by-step walkthroughs of data structures and algorithms, low-level design, networking and operating systems",
  groupLabel: "Pattern",
  notes: [
    "The lesson teaches through canvas animations the learner is watching. The attached lesson text is the page's prose, code and complexity notes — you can't see the animation frames, so when the learner refers to \"the animation\" or a step, ask what it shows if it matters.",
    "When the lesson teaches a practice problem, help the learner get from the picture to their own solution; don't paste a full solution unless they ask.",
  ],
};

/**
 * The tutor's prompt for a course lesson. `lesson` is the index entry (title,
 * blurb, type, langs, prereq, time); `phase` the group it sits in; `course`
 * which course it belongs to (AIFS_COURSE unless given).
 */
export function buildLessonPrompt({ lesson, phase, context = [], prefs = DEFAULT_PREFS, tools = LESSON_TOOL_SPECS, codeFiles = [], course = AIFS_COURSE }) {
  return [
    personaLine(prefs, course.description),
    LESSON_POLICY(prefs),
    ...(course.notes?.length ? [`Course notes:\n${course.notes.map((note) => `- ${note}`).join("\n")}`] : []),
    `## Lesson
Title: ${lesson?.title || "Unknown"}
${course.groupLabel || "Phase"}: ${phase?.track === "curriculum" ? `Phase ${phase.n} · ` : ""}${phase?.title || "-"}
Kind: ${lesson?.type || "-"} · Languages: ${lesson?.langs && lesson.langs !== "--" ? lesson.langs : "-"} · Time: ${lesson?.time || "-"}
Prerequisites: ${lesson?.prereq || "None"}
Summary: ${lesson?.blurb || "-"}
Includes: ${[lesson?.code && `${lesson.code} code file(s)${codeFiles.length ? ` (${codeFiles.slice(0, 8).join(", ")})` : ""}`, lesson?.artifacts && `${lesson.artifacts} artifact(s)`, lesson?.quiz && `a ${lesson.quiz}-question quiz`].filter(Boolean).join(" · ") || "reading only"}${lesson?.practice ? `\nPractice problems it teaches: ${lesson.practice}` : ""}`,
    ...context.map((item) => `## Attached: ${item.label}\n${item.text}`),
    toolGuide(tools),
    artifactGuide(LESSON_ARTIFACTS, "Code: a normal fenced block with its language (`python`, `bash`, `javascript`…)."),
  ].filter(Boolean).join("\n\n");
}

/** One section of a Markdown lesson by heading (case-insensitive match). */
export function lessonSection(markdown, heading) {
  const text = String(markdown || "");
  const wanted = String(heading || "").trim().toLowerCase();
  if (!wanted) return text;
  const lines = text.split("\n");
  const start = lines.findIndex((line) => /^#{1,4}\s/.test(line) && line.replace(/^#+\s*/, "").toLowerCase().includes(wanted));
  if (start < 0) return "";
  const level = lines[start].match(/^#+/)[0].length;
  let end = start + 1;
  while (end < lines.length && !(new RegExp(`^#{1,${level}}\\s`).test(lines[end]))) end += 1;
  return lines.slice(start, end).join("\n").trim();
}

/** The headings of a Markdown lesson, for "section not found" replies. */
export const lessonHeadings = (markdown) => String(markdown || "").split("\n").filter((line) => /^#{2,3}\s/.test(line)).map((line) => line.replace(/^#+\s*/, "").trim());
