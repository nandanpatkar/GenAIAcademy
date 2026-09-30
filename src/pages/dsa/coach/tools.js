import { practiceProblems } from "../practice/practiceData";
import { readStore } from "../prep/lib/store";
import { KEYS } from "../prep/keys";
import { relativeTime } from "../prep/lib/dates";
import { summarizeResult, TOOL_SPECS } from "./prompt";
import { approachText, editorialApproaches, findApproach, problemText } from "./editorial.js";

export { approachText, editorialApproaches, findApproach, problemText };

export const submissionsFor = (slug) => (readStore(KEYS.submissions, []) || []).filter((entry) => entry.slug === slug);

export const submissionLabel = (entry) => `${entry.verdict === "accepted" ? "Accepted" : String(entry.verdict || "").replace(/_/g, " ")} · ${entry.passed}/${entry.total} · ${relativeTime(entry.at)}`;

export const submissionText = (entry) => `Submission ${submissionLabel(entry)}\n\`\`\`python\n${String(entry.code || "").slice(0, 6000)}\n\`\`\``;

const norm = (value) => String(value || "").toLowerCase();

/**
 * The coach's tools. Each reads the live workspace through `getWorkspace()`
 * (a ref, so a long agent turn always sees the current editor and results).
 *
 * The workspace object: { problem, detail, tabs, activeTabId, notes,
 * runReady, runCode(code, cases) }.
 */
export function createCoachTools(getWorkspace) {
  const ws = () => getWorkspace() || {};
  const tools = {
    read_problem: {
      label: () => "Reading the problem",
      run: () => {
        const { detail } = ws();
        if (!detail) throw new Error("The problem hasn't loaded.");
        return { text: problemText(detail), summary: "Statement and constraints" };
      },
    },
    read_editorial: {
      label: (args) => `Reading the editorial${args.approach ? ` · ${args.approach}` : ""}`,
      run: (args) => {
        const approaches = editorialApproaches(ws().detail);
        if (!approaches.length) throw new Error("This problem has no editorial in the practice set.");
        const approach = findApproach(approaches, args.approach);
        if (!approach) return { text: `No approach matches "${args.approach}". Available: ${approaches.map((item) => item.name).join(", ")}.`, summary: "No match" };
        return { text: `${approachText(approach)}\n\nOther approaches: ${approaches.filter((item) => item !== approach).map((item) => item.name).join(", ") || "none"}`, summary: approach.name };
      },
    },
    read_editor_tab: {
      label: (args) => `Reading ${args.tab || "an editor tab"}`,
      run: (args) => {
        const { tabs = [] } = ws();
        const wanted = norm(args.tab).replace(/\s+/g, "");
        const tab = tabs.find((item) => norm(item.name).replace(/\s+/g, "") === wanted || item.id === args.tab) || null;
        if (!tab) return { text: `No tab named "${args.tab}". Tabs: ${tabs.map((item) => item.name).join(", ")}.`, summary: "No match" };
        return { text: `\`\`\`python\n${tab.code.slice(0, 8000)}\n\`\`\``, summary: tab.name };
      },
    },
    run_code: {
      label: (args) => (args.code ? "Running a solution on the samples" : "Running your code on the samples"),
      run: async (args) => {
        const { runReady, runCode, tabs = [], activeTabId, allowRuns } = ws();
        if (allowRuns === false) throw new Error("The learner turned off running code from the coach.");
        if (!runReady || !runCode) throw new Error("This problem can't be run on the judge; reason about it instead.");
        const code = typeof args.code === "string" && args.code.trim() ? args.code : tabs.find((tab) => tab.id === activeTabId)?.code || "";
        if (!code.trim()) throw new Error("There is no code to run.");
        const cases = Array.isArray(args.cases) ? args.cases.filter((item) => item && typeof item.input === "object" && !Array.isArray(item.input)).slice(0, 5) : [];
        const result = await runCode(code, cases.map((item, index) => ({ id: `coach-${index + 1}`, input: item.input, ...("expected" in item ? { expected: item.expected } : {}) })));
        const summary = result.summary || {};
        return {
          text: summarizeResult(result, { max: 5 }) || "No result.",
          summary: `${summary.passed ?? 0}/${summary.total ?? 0} passed`,
        };
      },
    },
    list_submissions: {
      label: () => "Checking your submissions",
      run: () => {
        const list = submissionsFor(ws().problem?.slug);
        if (!list.length) return { text: "No submissions for this problem yet.", summary: "None yet" };
        return {
          text: [`${list.length} submission(s), newest first:`, ...list.slice(0, 8).map((entry) => `- ${submissionLabel(entry)}`), "", `Latest code:\n${submissionText(list[0])}`].join("\n"),
          summary: `${list.length} found`,
        };
      },
    },
    search_problems: {
      label: (args) => `Searching problems · ${args.query || ""}`.trim(),
      run: (args) => {
        const words = norm(args.query).split(/[^a-z0-9]+/).filter((word) => word.length > 1);
        const current = ws().problem?.slug;
        const scored = practiceProblems
          .filter((problem) => problem.id !== current)
          .map((problem) => {
            const haystack = norm(`${problem.title} ${(problem.topics || []).join(" ")} ${(problem.patterns || []).join(" ")}`);
            return { problem, score: words.reduce((sum, word) => sum + (haystack.includes(word) ? (norm(problem.title).includes(word) ? 3 : 1) : 0), 0) };
          })
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        if (!scored.length) return { text: "No matching problems.", summary: "No matches" };
        return {
          text: scored.map(({ problem }) => `- id=${problem.id} · ${problem.title} · ${problem.difficulty} · ${(problem.topics || []).slice(0, 3).join(", ")}`).join("\n"),
          summary: `${scored.length} matches`,
        };
      },
    },
    read_notes: {
      label: () => "Reading your notes",
      run: () => {
        const notes = String(ws().notes || "").trim();
        return notes ? { text: notes.slice(0, 5000), summary: "Notes" } : { text: "The learner has no notes for this problem.", summary: "No notes" };
      },
    },
  };
  return tools;
}

/** The tool specs to advertise, given what this problem supports. */
export function availableToolSpecs(workspace, contextTypes = []) {
  return TOOL_SPECS.filter((spec) => {
    if (spec.name === "run_code") return workspace?.runReady && workspace?.allowRuns !== false;
    if (spec.name === "read_problem") return !contextTypes.includes("problem_description");
    if (spec.name === "read_editorial") return editorialApproaches(workspace?.detail).length > 0;
    if (spec.name === "read_editor_tab") return (workspace?.tabs || []).length > 1;
    return true;
  });
}

/** The session's tools with the unavailable ones removed. */
export function toolsFor(tools, specs) {
  const names = new Set(specs.map((spec) => spec.name));
  return Object.fromEntries(Object.entries(tools).filter(([name]) => names.has(name)));
}
