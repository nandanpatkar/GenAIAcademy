import React, { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, Circle, CircleCheck, CircleX, Lock, Plus, Trash2 } from "lucide-react";
import WanderingEyesLoader from "../../../components/WanderingEyesLoader";

const compact = (value) => (value === undefined ? "—" : JSON.stringify(value));
const pretty = (value) => (value === undefined ? "—" : JSON.stringify(value, null, 2));

const parseObject = (text) => {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
};

/** One labelled input field, as a read-only value or an editable JSON cell. */
function Field({ label, value, onChange, id }) {
  return (
    <div className="dsa-ws-field">
      <label htmlFor={id}>{label}</label>
      {onChange
        ? <textarea id={id} spellCheck="false" rows={Math.min(6, Math.max(1, value.split("\n").length))} value={value} onChange={(event) => onChange(event.target.value)} />
        : <output id={id}>{value}</output>}
    </div>
  );
}

/**
 * Custom cases are stored as `{ id, inputText, expectedText }` JSON strings
 * (shared with the LeetCode page). When the input parses to an object each
 * argument gets its own field; otherwise the raw JSON is edited as one.
 */
function CustomCase({ test, onChange, onRemove }) {
  const argumentsObject = parseObject(test.inputText);
  // Text being typed that isn't valid JSON yet ("[1,2") lives here, per argument,
  // and is only written back to the case once it parses.
  const [drafts, setDrafts] = useState({});
  useEffect(() => { setDrafts({}); }, [test.id]);

  const setArgument = (name, text) => {
    try {
      const value = JSON.parse(text);
      setDrafts(({ [name]: _dropped, ...rest }) => rest);
      onChange({ ...test, inputText: JSON.stringify({ ...argumentsObject, [name]: value }) });
    } catch {
      setDrafts((prev) => ({ ...prev, [name]: text }));
    }
  };

  return (
    <>
      <div className="dsa-ws-case-caption">
        <span>Input:</span>
        <button type="button" onClick={onRemove}><Trash2 size={13} /> Remove case</button>
      </div>
      {argumentsObject && Object.keys(argumentsObject).length
        ? Object.entries(argumentsObject).map(([name, value]) => (
          <Field
            key={name}
            id={`dsa-ws-custom-${test.id}-${name}`}
            label={name in drafts ? `${name} · not valid JSON yet` : name}
            value={drafts[name] ?? JSON.stringify(value)}
            onChange={(text) => setArgument(name, text)}
          />
        ))
        : <Field id={`dsa-ws-custom-${test.id}-input`} label="Input (JSON object)" value={test.inputText} onChange={(text) => onChange({ ...test, inputText: text })} />}
      <span className="dsa-ws-case-caption"><span>Expected output:</span></span>
      <Field id={`dsa-ws-custom-${test.id}-expected`} label="Output · leave empty to just run" value={test.expectedText} onChange={(text) => onChange({ ...test, expectedText: text })} />
    </>
  );
}

function ResultView({ result, activeCaseId, onActiveCaseChange }) {
  const cases = result.cases || [];
  const active = cases.find((test) => test.id === activeCaseId) || cases.find((test) => !test.passed) || cases[0];
  const failed = result.summary?.failed;
  const unjudged = result.summary?.unjudged || 0;
  const onlyRan = !failed && unjudged > 0 && unjudged === result.summary?.total;
  const verdict = result.accepted ? "Accepted" : failed ? (active?.status === "runtime_error" ? "Runtime Error" : "Wrong Answer") : onlyRan ? "Ran" : "All cases passed";

  return (
    <>
      <div className={`dsa-ws-verdict ${failed ? "is-fail" : onlyRan ? "is-neutral" : "is-pass"}`}>
        <b>{verdict}</b>
        <span>{onlyRan
          ? "No expected output is known for these cases yet — compare your output with the example."
          : `${(result.summary?.passed || 0) - unjudged} / ${(result.summary?.total || 0) - unjudged} test cases passed`}{result.runtime ? ` · ${result.runtime}s` : ""}</span>
      </div>
      <div className="dsa-ws-case-row" role="tablist" aria-label="Case results">
        {cases.map((test, index) => (
          <button type="button" role="tab" key={`${test.id}-${index}`} aria-selected={test.id === active?.id} className={`dsa-ws-case${test.id === active?.id ? " is-active" : ""}`} onClick={() => onActiveCaseChange(test.id)}>
            {test.unjudged ? <Circle size={13} /> : test.passed ? <CircleCheck size={13} className="is-pass" /> : <CircleX size={13} className="is-fail" />}
            {test.hidden ? `Hidden ${index + 1}` : `Case ${index + 1}`}
          </button>
        ))}
      </div>
      {active && (active.hidden ? (
        <p className="dsa-ws-note"><Lock size={13} /> Hidden case — input and expected output are private.{active.error ? ` ${active.error}` : ""}</p>
      ) : (
        <>
          <span className="dsa-ws-case-caption"><span>Input:</span></span>
          {Object.entries(active.input || {}).map(([name, value]) => <Field key={name} id={`dsa-ws-result-${name}`} label={name} value={compact(value)} />)}
          {!active.unjudged && <Field id="dsa-ws-result-expected" label="Expected output" value={pretty(active.expected)} />}
          <Field id="dsa-ws-result-actual" label="Your output" value={pretty(active.actual)} />
          {active.error && <div className="dsa-ws-error" role="alert"><b>Error</b><pre>{active.error}</pre></div>}
          {(active.stdout || active.traceback) && <Field id="dsa-ws-result-stdout" label="Stdout" value={active.traceback || active.stdout} />}
        </>
      ))}
    </>
  );
}

export default function WorkspaceTestPanel({
  detail,
  tab,
  onTabChange,
  activeCaseId,
  onActiveCaseChange,
  customCases,
  onCustomCasesChange,
  result,
  requestError,
  busy,
  collapsed,
  onToggleCollapsed,
}) {
  const visibleCases = detail?.visibleTests || [];
  const activeVisible = visibleCases.find((test) => test.id === activeCaseId);
  const activeCustom = customCases.find((test) => test.id === activeCaseId);
  const hiddenCount = detail?.hiddenTestCount || 0;

  const addCase = () => {
    const number = customCases.reduce((max, test) => Math.max(max, Number(test.id.split("-").pop()) || 0), 0) + 1;
    const seed = activeVisible || visibleCases[0];
    const next = {
      id: `custom-${number}`,
      inputText: JSON.stringify(seed?.input || {}),
      // Empty means "just run it" — also the only option where no output is known.
      expectedText: seed && "expected" in seed ? JSON.stringify(seed.expected) : "",
    };
    onCustomCasesChange([...customCases, next]);
    onActiveCaseChange(next.id);
    onTabChange("sample");
  };

  const updateCustom = (next) => onCustomCasesChange(customCases.map((test) => (test.id === next.id ? next : test)));
  const removeCustom = (id) => {
    const next = customCases.filter((test) => test.id !== id);
    onCustomCasesChange(next);
    onActiveCaseChange(visibleCases[0]?.id || next[0]?.id || "");
  };

  const tabs = [
    { id: "sample", label: "Sample" },
    { id: "hidden", label: "Hidden" },
    ...(result || requestError || busy ? [{ id: "result", label: "Result" }] : []),
  ];

  return (
    <section className={`dsa-ws-tests${collapsed ? " is-collapsed" : ""}`} aria-label="Test cases">
      <header className="dsa-ws-tests-head">
        <span className="dsa-ws-tests-title">Test Case <ChevronRight size={14} /></span>
        <div className="dsa-ws-tests-tabs" role="tablist" aria-label="Test case sets">
          {tabs.map(({ id, label }) => (
            <button type="button" role="tab" key={id} aria-selected={tab === id} className={tab === id ? "is-active" : ""} onClick={() => { onTabChange(id); if (collapsed) onToggleCollapsed(); }}>
              {id === "result" && busy ? <WanderingEyesLoader size={10} label="Judging" /> : null}{label}
            </button>
          ))}
        </div>
        <button type="button" className="dsa-ws-icon-btn" onClick={onToggleCollapsed} aria-expanded={!collapsed} aria-label={collapsed ? "Expand test cases" : "Collapse test cases"}>
          <ChevronDown size={16} className={collapsed ? "is-flipped" : ""} />
        </button>
      </header>

      {!collapsed && (
        <div className="dsa-ws-tests-body" role="tabpanel">
          {requestError && tab === "result" && <div className="dsa-ws-error" role="alert"><AlertTriangle size={14} /> <span>{requestError}</span></div>}

          {tab === "sample" && (!(detail?.judgeAvailable || detail?.runnable) ? (
            <p className="dsa-ws-note"><AlertTriangle size={13} /> This problem doesn't have a runnable example yet, so it can't be judged here.</p>
          ) : (
            <>
              <div className="dsa-ws-case-row" role="tablist" aria-label="Cases">
                {visibleCases.map((test, index) => (
                  <button type="button" role="tab" key={test.id} aria-selected={activeCaseId === test.id} className={`dsa-ws-case${activeCaseId === test.id ? " is-active" : ""}`} onClick={() => onActiveCaseChange(test.id)}>Case {index + 1}</button>
                ))}
                {customCases.map((test, index) => (
                  <button type="button" role="tab" key={test.id} aria-selected={activeCaseId === test.id} className={`dsa-ws-case is-custom${activeCaseId === test.id ? " is-active" : ""}`} onClick={() => onActiveCaseChange(test.id)}>Case {visibleCases.length + index + 1}</button>
                ))}
                <button type="button" className="dsa-ws-icon-btn" onClick={addCase} aria-label="Add a custom case" title="Add a custom case (starts as a copy of the selected one)"><Plus size={16} /></button>
              </div>
              {activeVisible && (
                <>
                  <span className="dsa-ws-case-caption"><span>Input:</span></span>
                  {Object.entries(activeVisible.input || {}).map(([name, value]) => <Field key={name} id={`dsa-ws-case-${activeVisible.id}-${name}`} label={name} value={compact(value)} />)}
                  {"expected" in activeVisible && <Field id={`dsa-ws-case-${activeVisible.id}-expected`} label="Expected output" value={compact(activeVisible.expected)} />}
                </>
              )}
              {activeCustom && <CustomCase test={activeCustom} onChange={updateCustom} onRemove={() => removeCustom(activeCustom.id)} />}
            </>
          ))}

          {tab === "hidden" && (!detail?.judgeAvailable ? (
            <p className="dsa-ws-note"><Lock size={13} /> This problem has no hidden tests yet, so Submit is off. Run shows what your code returns for the sample cases.</p>
          ) : (
            <p className="dsa-ws-note"><Lock size={13} /> {hiddenCount ? `${hiddenCount} hidden test case${hiddenCount === 1 ? "" : "s"} run` : "Hidden test cases run"} when you submit. Their inputs stay private — only the verdict is shown.</p>
          ))}

          {tab === "result" && (busy ? (
            <p className="dsa-ws-note"><WanderingEyesLoader size={12} label="Judging" /> {busy === "submit" ? "Judging against every test case…" : "Running the selected case…"}</p>
          ) : result ? (
            <ResultView result={result} activeCaseId={activeCaseId} onActiveCaseChange={onActiveCaseChange} />
          ) : requestError ? null : (
            <p className="dsa-ws-note">Run a case or submit to see the verdict here.</p>
          ))}
        </div>
      )}
    </section>
  );
}
