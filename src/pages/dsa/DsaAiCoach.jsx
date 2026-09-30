import React, { useMemo, useRef } from "react";
import CoachPanel from "./coach/CoachPanel";
import { createDsaAdapter } from "./coach/dsaAdapter";
import { createCoachTools } from "./coach/tools";

/**
 * The problem workspace's AI coach: CoachPanel with the DSA adapter. It can
 * read the problem, editorial, submissions and editor tabs, run code on the
 * judge, and answer with artifacts (hints, test cases, dry runs, visual
 * traces, complexity reviews, full solutions with Apply to compiler…).
 *
 * `workspace` exposes the live problem state and actions (see
 * DsaProblemWorkspace). `request` starts a turn from outside: each new
 * `request.id` attaches `request.context` and sends `request.prompt`.
 */
export default function DsaAiCoach({ pattern, workspace, request, onSaveNote, onClose, closeLabel }) {
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;
  const tools = useMemo(() => createCoachTools(() => workspaceRef.current), []);

  const actions = useMemo(() => ({
    applyCode: workspace?.applyCode,
    runCode: workspace?.runReady ? (code) => workspaceRef.current.runCode(code, []) : null,
    runReady: Boolean(workspace?.runReady),
    addCustomCase: workspace?.addCustomCase,
    openProblem: workspace?.openProblem,
    params: workspace?.params || [],
    isDark: workspace?.isDark !== false,
  }), [workspace?.applyCode, workspace?.runReady, workspace?.addCustomCase, workspace?.openProblem, workspace?.params, workspace?.isDark]);

  const adapter = useMemo(
    () => ({ ...createDsaAdapter({ workspace, getWorkspace: () => workspaceRef.current, tools, pattern }), actions }),
    // The adapter reads live state through the ref; it only changes identity per problem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace?.problem?.slug, workspace?.problem?.title, pattern, tools, actions],
  );

  return <CoachPanel adapter={adapter} request={request} onSaveNote={onSaveNote} onClose={onClose} closeLabel={closeLabel} />;
}
