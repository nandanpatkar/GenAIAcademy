import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, FlaskConical, Loader2, Play } from "lucide-react";
import { AifsCode } from "../AiFromScratchMarkdown";
import { executeCode } from "../../services/jdoodleService";

/* The Code tab of an AWS GenAI lesson: every code block from the lesson's
 * hands-on lab (§8), plus any labs-code/ file the lesson links to.
 *
 * Blocks tagged `python lab-run` are offline simulations that use only the
 * standard library, so they can run in the app's code sandbox; the lesson's
 * own captured output (`text lab-out`) is shown next to them, and a run is
 * compared against it. Everything else (CLI steps, IAM JSON, code that calls
 * AWS) is for reading and copying.
 */

const KIND_COPY = {
  lab: "Runnable lab · offline, standard library only",
  step: "Lab step · from the lesson's instructions",
  snippet: "Snippet · needs AWS credentials; not run",
  file: "File from the guide's labs-code folder",
};

const normalize = (text) => String(text || "").replace(/\r/g, "").split("\n").map((line) => line.trimEnd()).join("\n").trim();

export default function AwsLabCode({ files = [], dark, focusPath }) {
  const [active, setActive] = useState(0);
  const [runs, setRuns] = useState({});

  useEffect(() => { setActive(0); setRuns({}); }, [files]);
  useEffect(() => {
    if (!focusPath) return;
    const index = files.findIndex((file) => file.path === focusPath || file.path.endsWith(focusPath));
    if (index >= 0) setActive(index);
  }, [focusPath, files]);

  if (!files.length) return <div className="aifs-state">This page ships no lab code.</div>;
  const file = files[Math.min(active, files.length - 1)];
  const run = runs[file.path];

  const execute = async () => {
    setRuns((prev) => ({ ...prev, [file.path]: { status: "running" } }));
    try {
      const result = await executeCode({ script: file.source, language: "python3" });
      const output = String(result.output ?? "");
      setRuns((prev) => ({ ...prev, [file.path]: { status: "done", output, cpuTime: result.cpuTime } }));
    } catch (error) {
      setRuns((prev) => ({ ...prev, [file.path]: { status: "error", output: error.message || "The code runner is unavailable." } }));
    }
  };

  const matches = run?.status === "done" && file.expected && normalize(run.output) === normalize(file.expected);

  return (
    <div className="aifs-files aip-lab">
      {files.length > 1 ? (
        <div className="aifs-file-strip" role="tablist">
          {files.map((item, index) => (
            <button
              key={item.path}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={`aifs-file${index === active ? " aifs-file--on" : ""}${item.runnable ? " aip-file--run" : ""}`}
              onClick={() => setActive(index)}
            >
              {item.runnable ? <Play size={10} /> : null}{item.path}
            </button>
          ))}
        </div>
      ) : null}

      <div className="aip-lab-head">
        <span className={`aip-lab-kind is-${file.kind}`}><FlaskConical size={13} />{KIND_COPY[file.kind] || KIND_COPY.step}</span>
        {file.section ? <span className="aip-lab-section">{file.section}</span> : null}
        {file.runnable ? (
          <button type="button" className="aip-run" onClick={execute} disabled={run?.status === "running"}>
            {run?.status === "running" ? <Loader2 size={13} className="aifs-spin" /> : <Play size={13} />}
            {run?.status === "running" ? "Running…" : "Run"}
          </button>
        ) : null}
      </div>

      <AifsCode language={file.lang} code={file.source} filename={file.path} dark={dark} />

      {run && run.status !== "running" ? (
        <div className={`aip-run-out${run.status === "error" ? " is-error" : ""}`}>
          <div className="aip-run-out-head">
            {run.status === "error" ? <AlertCircle size={13} /> : matches ? <CheckCircle2 size={13} /> : null}
            <span>
              {run.status === "error"
                ? "Could not run"
                : file.expected
                  ? matches ? "Output matches the lesson's captured output" : "Your output (compare with the captured output below)"
                  : "Output"}
              {run.cpuTime != null ? ` · ${run.cpuTime}s` : ""}
            </span>
          </div>
          <pre>{run.output || "(no output)"}</pre>
        </div>
      ) : null}

      {file.expected ? (
        <details className="aip-expected" open={!run}>
          <summary>Captured output from the lesson</summary>
          <pre>{file.expected}</pre>
        </details>
      ) : null}
    </div>
  );
}
