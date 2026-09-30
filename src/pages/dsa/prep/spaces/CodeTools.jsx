import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { AlertTriangle, Loader2, Play, Terminal } from "lucide-react";
import { configureMonaco } from "../../../../config/monacoLoader";
import { useTheme } from "../../../../contexts/ThemeContext";
import { executeCode, RUN_PROVIDERS } from "../../../../services/jdoodleService";

configureMonaco();

export function CodeEditor({ value, language, onChange, readOnly = false, height = "100%" }) {
  const { theme } = useTheme() || {};
  return (
    <Editor
      height={height}
      language={language}
      theme={theme === "light" ? "vs" : "vs-dark"}
      value={value}
      onChange={(next) => onChange?.(next || "")}
      options={{ readOnly, minimap: { enabled: false }, fontSize: 14, lineHeight: 22, scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 14 }, tabSize: 4 }}
    />
  );
}

/**
 * stdin + Run + output. Code goes to the /api/execute proxy (JDoodle or
 * HackerEarth) — never executed by this app itself. A failure of the runner is
 * shown as a runner problem, distinct from your program's own errors.
 */
export function RunPanel({ code, runLanguage }) {
  const [stdin, setStdin] = useState("");
  const [provider, setProvider] = useState("jdoodle");
  const [state, setState] = useState({ running: false, result: null, error: "" });

  const run = async () => {
    if (!runLanguage || state.running) return;
    setState({ running: true, result: null, error: "" });
    try {
      const result = await executeCode({ script: code, language: runLanguage, stdin, provider });
      setState({ running: false, result, error: "" });
    } catch (error) {
      setState({ running: false, result: null, error: error.message || "The runner didn't respond." });
    }
  };

  if (!runLanguage) {
    return <div className="dsp-runner is-disabled"><Terminal size={15} /> This file type can't be run — use .py, .js, .java, .cpp or .go.</div>;
  }

  return (
    <div className="dsp-runner">
      <div className="dsp-run-io">
        <label className="dsp-field"><span className="dsp-run-label">Input (stdin)</span><textarea className="dsp-textarea dsp-mono" value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder="Optional program input" /></label>
        <div className="dsp-field">
          <span className="dsp-run-label">Output{state.result?.cpuTime != null ? ` · ${state.result.cpuTime}s` : ""}{state.result?.memory != null ? ` · ${state.result.memory} KB` : ""}</span>
          <pre className={`dsp-run-output${state.error ? " is-error" : ""}`} aria-live="polite">
            {state.running ? "Running…" : state.error ? <><AlertTriangle size={13} /> Runner problem: {state.error}</> : state.result ? (state.result.output || "(no output)") : "Run to see output here."}
          </pre>
        </div>
      </div>
      <div className="dsp-row">
        <select className="dsp-select dsp-run-provider" value={provider} onChange={(event) => setProvider(event.target.value)} aria-label="Execution provider">{RUN_PROVIDERS.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select>
        <button type="button" className="dsp-btn is-primary" onClick={run} disabled={state.running || !code.trim()}>{state.running ? <Loader2 size={14} className="dsp-spin" /> : <Play size={14} />} Run</button>
        <span className="dsp-muted dsp-small">Runs in a remote sandbox via the execution proxy.</span>
      </div>
    </div>
  );
}
