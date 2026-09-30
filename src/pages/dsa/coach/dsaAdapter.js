import { Code2, FileText, FlaskConical, History, NotebookText } from "lucide-react";
import { buildSystemPrompt, QUICK_ACTIONS, summarizeResult } from "./prompt";
import { approachText, availableToolSpecs, editorialApproaches, problemText, submissionLabel, submissionsFor, submissionText } from "./tools";

/**
 * What the learner can attach with "@": the problem description (on by
 * default), an editorial approach, a submission, an editor tab, the last
 * test result, or text selected in the problem panel.
 *
 * An item is { key, type, label, ...ref } and is resolved to prompt text
 * only when a message is sent, so it always reflects the current state.
 */
export const PROBLEM_ITEM = { key: "problem_description", type: "problem_description", label: "Problem description", implicit: true };

export function contextGroups(workspace) {
  const approaches = editorialApproaches(workspace?.detail);
  const submissions = submissionsFor(workspace?.problem?.slug).slice(0, 8);
  const tabs = workspace?.tabs || [];
  return [
    { id: "problem", icon: FileText, label: "Problem description", item: PROBLEM_ITEM },
    {
      id: "editorial",
      icon: NotebookText,
      label: "Editorial",
      empty: "No editorial for this problem",
      items: approaches.map((approach, index) => {
        const short = approach.name.replace(/\s*approach\s*$/i, "") || approach.name;
        return { key: `editorial:${index}`, type: "editorial", index, short, label: `Editorial · ${short}` };
      }),
    },
    {
      id: "submissions",
      icon: History,
      label: "Submissions",
      empty: "No submissions yet",
      items: submissions.map((entry) => ({ key: `submission:${entry.id}`, type: "submission", id: entry.id, label: submissionLabel(entry) })),
    },
    {
      id: "tabs",
      icon: Code2,
      label: "Editor tabs",
      items: tabs.map((tab) => ({ key: `tab:${tab.id}`, type: "editor_tab", id: tab.id, label: tab.name })),
    },
    ...(workspace?.lastResult ? [{ id: "result", icon: FlaskConical, label: "Last test result", item: { key: "test_result", type: "test_result", label: "Last test result" } }] : []),
  ];
}

/** Attached items → [{ label, text }] for the system prompt. */
export function resolveContext(items, workspace) {
  const approaches = editorialApproaches(workspace?.detail);
  return items.map((item) => {
    if (item.type === "problem_description") return workspace?.detail ? { label: "Problem description", text: problemText(workspace.detail) } : null;
    if (item.type === "editorial") {
      const approach = approaches[item.index];
      return approach ? { label: `Editorial · ${approach.name}`, text: approachText(approach) } : null;
    }
    if (item.type === "submission") {
      const entry = submissionsFor(workspace?.problem?.slug).find((submission) => submission.id === item.id);
      return entry ? { label: "A past submission", text: submissionText(entry) } : null;
    }
    if (item.type === "editor_tab") {
      const tab = (workspace?.tabs || []).find((candidate) => candidate.id === item.id);
      return tab ? { label: `Editor tab ${tab.name}`, text: `\`\`\`python\n${tab.code.slice(0, 8000)}\n\`\`\`` } : null;
    }
    if (item.type === "test_result") return workspace?.lastResult ? { label: "Last test result", text: summarizeResult(workspace.lastResult, { max: 6 }) } : null;
    if (item.type === "selected_text") return { label: "Text the learner selected", text: `> ${item.text.slice(0, 3000).replace(/\n/g, "\n> ")}` };
    return null;
  }).filter(Boolean);
}

/**
 * The coach for a DSA problem. `getWorkspace()` returns the live workspace
 * (see DsaProblemWorkspace); `tools` is createCoachTools(getWorkspace).
 */
export function createDsaAdapter({ workspace, getWorkspace, tools, pattern }) {
  const problem = workspace?.problem;
  return {
    sessionKey: problem?.slug,
    noun: "problem",
    subject: problem?.title,
    defaultContext: [PROBLEM_ITEM],
    contextGroups: () => contextGroups(getWorkspace()),
    resolveContext: (items) => resolveContext(items, getWorkspace()),
    toolSpecs: (contextTypes, prefs) => availableToolSpecs({ ...getWorkspace(), allowRuns: prefs.allowRuns }, contextTypes),
    tools,
    systemPrompt: ({ context, prefs, tools: specs }) => {
      const ws = getWorkspace();
      return buildSystemPrompt({
        problem: ws.problem,
        detail: ws.detail,
        pattern,
        activeTab: (ws.tabs || []).find((tab) => tab.id === ws.activeTabId),
        tabs: ws.tabs,
        lastResult: ws.lastResult,
        context,
        prefs,
        tools: specs,
        params: ws.params,
      });
    },
    quickActions: QUICK_ACTIONS,
    intro: {
      title: "I'm your DSA coach",
      body: "I read the problem, the editorial and your code, run your code on the samples, and answer with hints, dry runs, visual traces and reviews.",
    },
  };
}
