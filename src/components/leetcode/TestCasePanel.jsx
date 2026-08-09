import React from "react";
import { AlertTriangle, CheckCircle2, Circle, Code2, Plus, RotateCcw, Terminal, Trash2, XCircle } from "lucide-react";

const pretty = (value) => value === undefined ? "—" : JSON.stringify(value, null, 2);
const compact = (value) => value === undefined ? "—" : JSON.stringify(value);

function CaseArguments({ input }) {
  const entries = Object.entries(input || {});

  if (!entries.length) {
    return <div className="leetcode-case-empty">This testcase has no input arguments.</div>;
  }

  return (
    <div className="leetcode-case-fields leetcode-case-arguments" aria-label="Test case input">
      {entries.map(([name, value]) => (
        <div className="leetcode-case-field" key={name}>
          <div className="leetcode-case-argument-label"><span>{name}</span><b>=</b></div>
          <pre aria-label={`${name} testcase value`}><code>{compact(value)}</code></pre>
        </div>
      ))}
    </div>
  );
}

function VerdictIcon({ status }) {
  if (status === "passed") return <CheckCircle2 size={15} aria-hidden="true" />;
  if (status === "wrong_answer" || status === "runtime_error") return <XCircle size={15} aria-hidden="true" />;
  return <Circle size={15} aria-hidden="true" />;
}

export default function TestCasePanel({
  manifest,
  tab,
  onTabChange,
  activeCaseId,
  onActiveCaseChange,
  customCases,
  onCustomCasesChange,
  result,
  requestError,
}) {
  const visibleCases = manifest?.visibleTests || [];
  const resultCases = result?.cases || [];
  const activeVisible = visibleCases.find((test) => test.id === activeCaseId);
  const activeCustomIndex = customCases.findIndex((test) => test.id === activeCaseId);
  const activeCustom = customCases[activeCustomIndex];
  const activeResult = resultCases.find((test) => test.id === activeCaseId) || resultCases.find((test) => !test.passed) || resultCases[0];

  const addCustomCase = () => {
    const nextNumber = customCases.reduce((max, test) => Math.max(max, Number(test.id.split("-").pop()) || 0), 0) + 1;
    const next = { id: `custom-${nextNumber}`, inputText: "{}", expectedText: "null" };
    onCustomCasesChange([...customCases, next]);
    onActiveCaseChange(next.id);
    onTabChange("testcase");
  };

  const updateCustom = (field, value) => {
    onCustomCasesChange(customCases.map((test, index) => index === activeCustomIndex ? { ...test, [field]: value } : test));
  };

  const removeCustom = () => {
    const next = customCases.filter((_, index) => index !== activeCustomIndex);
    onCustomCasesChange(next);
    onActiveCaseChange(visibleCases[0]?.id || next[0]?.id || "");
  };

  return (
    <div className="leetcode-test-panel">
      <div className="leetcode-test-tabs" role="tablist" aria-label="Test workspace">
        <button role="tab" aria-selected={tab === "testcase"} className={tab === "testcase" ? "active" : ""} onClick={() => onTabChange("testcase")}><Code2 size={14} /> Testcase <span>{visibleCases.length + customCases.length}</span></button>
        <button role="tab" aria-selected={tab === "result"} className={tab === "result" ? "active" : ""} onClick={() => onTabChange("result")}><CheckCircle2 size={14} /> Test Result {result?.summary && <span>{result.summary.passed}/{result.summary.total}</span>}</button>
        <button role="tab" aria-selected={tab === "console"} className={tab === "console" ? "active" : ""} onClick={() => onTabChange("console")}><Terminal size={14} /> Console</button>
      </div>

      {requestError && <div className="leetcode-judge-alert" role="alert"><AlertTriangle size={15} /><span>{requestError}</span></div>}

      {tab === "testcase" && (
        <div className="leetcode-test-content" role="tabpanel">
          {!manifest?.judgeAvailable ? (
            <div className="leetcode-empty-result"><AlertTriangle size={19} /><b>Judge metadata needs review</b><p>This legacy problem does not yet have a safely parsed executable example.</p></div>
          ) : (
            <>
              <div className="leetcode-case-picker" aria-label="Available test cases">
                {visibleCases.map((test, index) => <button key={test.id} className={activeCaseId === test.id ? "active" : ""} onClick={() => onActiveCaseChange(test.id)}>Case {index + 1}</button>)}
                {customCases.map((test, index) => <button key={test.id} className={activeCaseId === test.id ? "active" : ""} onClick={() => onActiveCaseChange(test.id)}>Custom {index + 1}</button>)}
                <button className="leetcode-add-case" onClick={addCustomCase} aria-label="Add custom test case"><Plus size={14} /> Add</button>
              </div>
              {activeVisible && <CaseArguments input={activeVisible.input} />}
              {activeCustom && <div className="leetcode-case-fields custom"><div className="leetcode-custom-heading"><span>Custom JSON test</span><button onClick={removeCustom}><Trash2 size={13} /> Remove</button></div><label htmlFor="leetcode-custom-input">Input object</label><textarea id="leetcode-custom-input" spellCheck="false" value={activeCustom.inputText} onChange={(event) => updateCustom("inputText", event.target.value)} /><label htmlFor="leetcode-custom-expected">Expected output</label><textarea id="leetcode-custom-expected" spellCheck="false" value={activeCustom.expectedText} onChange={(event) => updateCustom("expectedText", event.target.value)} /></div>}
            </>
          )}
        </div>
      )}

      {tab === "result" && (
        <div className="leetcode-test-content" role="tabpanel" aria-live="polite">
          {!result ? <div className="leetcode-empty-result"><RotateCcw size={18} /><b>No result yet</b><p>Run a test case or submit your solution to see the verdict.</p></div> : <>
            <div className={`leetcode-verdict ${result.accepted ? "accepted" : result.summary?.failed ? "rejected" : "passed"}`}><div><VerdictIcon status={result.accepted || !result.summary?.failed ? "passed" : "wrong_answer"} /><span><b>{result.accepted ? "Accepted" : result.summary?.failed ? "Some cases failed" : "All selected cases passed"}</b><small>{result.summary?.passed || 0} of {result.summary?.total || 0} test cases passed</small></span></div>{result.runtime && <span>{result.runtime}s</span>}</div>
            <div className="leetcode-result-layout">
              <div className="leetcode-result-cases" role="listbox" aria-label="Test results">{resultCases.map((test, index) => <button key={`${test.id}-${index}`} role="option" aria-selected={test.id === activeResult?.id} className={`${test.id === activeResult?.id ? "active" : ""} ${test.passed ? "passed" : "failed"}`} onClick={() => onActiveCaseChange(test.id)}><VerdictIcon status={test.status} /><span>{test.hidden ? `Hidden case ${index + 1}` : `Case ${index + 1}`}</span><small>{test.runtimeMs != null ? `${test.runtimeMs} ms` : ""}</small></button>)}</div>
              {activeResult && <div className="leetcode-result-detail">{activeResult.hidden ? <div className="leetcode-hidden-case"><AlertTriangle size={16} /><span><b>Hidden test case</b><small>{activeResult.error || "Input and expected output are private."}</small></span></div> : <><label>Input</label><pre>{pretty(activeResult.input)}</pre><div className="leetcode-actual-grid"><div><label>Expected</label><pre>{pretty(activeResult.expected)}</pre></div><div><label>Actual</label><pre>{pretty(activeResult.actual)}</pre></div></div></>}{activeResult.error && !activeResult.hidden && <div className="leetcode-runtime-error" role="alert"><b>Runtime error</b><pre>{activeResult.error}</pre></div>}</div>}
            </div>
          </>}
        </div>
      )}

      {tab === "console" && <div className="leetcode-test-content leetcode-console" role="tabpanel"><pre>{activeResult?.traceback || activeResult?.stdout || result?.error || "Program output will appear here after a run."}</pre></div>}
    </div>
  );
}
