import React, { useEffect, useMemo, useRef, useState } from "react";
import { NinjaEye } from "../../NinjaEye";
import Icon from "../icons";
import { judgeSubmission, judgeStatus } from "../judge";
import { loadCode, saveCode } from "../progress";

// The five targets the live Solution Console offers.
export const LANGUAGES = [
  { value: "python3", label: "Python 3" },
  { value: "cpp17", label: "C++ 17" },
  { value: "cpp20", label: "C++ 20" },
  { value: "java17", label: "Java 17" },
  { value: "pypy3", label: "PyPy 3" },
];

// AlgoWars ships no starter code; an empty buffer is a poor start, so each target gets a
// minimal I/O skeleton. This is the mirror's own addition, not extracted content.
const SKELETON = {
  python3: "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # your solution here\n\nmain()\n",
  pypy3: "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # your solution here\n\nmain()\n",
  cpp17: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // your solution here\n    return 0;\n}\n",
  cpp20: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // your solution here\n    return 0;\n}\n",
  java17: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        // your solution here\n    }\n}\n",
};

const VERDICT_LABEL = {
  ACCEPTED: "Accepted", WRONG_ANSWER: "Wrong Answer", TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  COMPILE_ERROR: "Compile Error", INCOMPLETE: "Incomplete Submission",
};

export default function SolutionConsole({ storageKey, subtitle, problem, onAccepted, footer }) {
  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const provider = judgeStatus();

  useEffect(() => {
    const saved = loadCode(storageKey, language);
    setCode(saved || SKELETON[language] || "");
    setResult(null);
    setError(null);
  }, [storageKey, language]);

  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(code.split("\n").length, 18) }, (_, i) => i + 1),
    [code],
  );

  const persist = (value) => {
    setCode(value);
    saveCode(storageKey, language, value);
  };

  // Tab indents instead of moving focus, as in the site's editor.
  const onKeyDown = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = editorRef.current;
    const { selectionStart: s, selectionEnd: en } = el;
    persist(`${code.slice(0, s)}    ${code.slice(en)}`);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  const submit = async () => {
    if (!code.trim()) { setError("Write a solution before submitting."); return; }
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const verdict = await judgeSubmission({ ...problem, language, code });
      setResult(verdict);
      if (verdict.accepted) onAccepted?.(verdict);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="aw-card aw-lv-console">
      <div className="aw-lv-console-head">
        <div>
          <span className="aw-kicker">Solution Console</span>
          <p className="aw-muted-sm">{subtitle}</p>
        </div>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
          {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      <div className="aw-editor">
        <pre className="aw-gutter" aria-hidden="true">{lineNumbers.join("\n")}</pre>
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => persist(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your solution"
        />
      </div>

      {error && <p className="aw-error">{error}</p>}

      {result && (
        <div className={`aw-verdict is-${result.accepted ? "ok" : "bad"}`}>
          <p className="aw-verdict-head">
            <Icon name={result.accepted ? "check" : "error"} size={15} />
            {VERDICT_LABEL[result.verdict] ?? result.verdict}
          </p>
          <p className="aw-muted-sm">{result.summary}</p>
          {result.reasoning && <p className="aw-muted-sm aw-verdict-reason">{result.reasoning}</p>}
          {result.failingCase && (
            <div className="aw-verdict-case"><span>Failing case</span><pre>{result.failingCase}</pre></div>
          )}
          <div className="aw-verdict-meta">
            {result.timeComplexity && <span><Icon name="schedule" size={13} /> {result.timeComplexity}</span>}
            {result.spaceComplexity && <span><Icon name="memory" size={13} /> {result.spaceComplexity}</span>}
          </div>
          {result.optimalApproach && (
            <div className="aw-coach">
              <p className="aw-verdict-head"><Icon name="psychology" size={14} /> Coach Review</p>
              <p className="aw-muted-sm">{result.optimalApproach}</p>
              {result.hints?.length > 0 && (
                <ul>{result.hints.map((h) => <li key={h}><Icon name="chevron_right" size={13} /> {h}</li>)}</ul>
              )}
            </div>
          )}
        </div>
      )}

      <div className="aw-lv-actions">
        <button type="button" className="aw-btn aw-btn-primary aw-lv-submit" onClick={submit} disabled={running}>
          {running ? <><NinjaEye size={16} labelled={false} /> Judging…</> : "Submit Solution"}
        </button>
        {footer}
      </div>
      <p className="aw-judge-note">
        Judged by {provider.label}{provider.configured ? "" : " — not configured yet"}. AlgoWars' own judge
        is a server, so this mirror reviews submissions with AI instead of executing them.
      </p>
    </section>
  );
}
