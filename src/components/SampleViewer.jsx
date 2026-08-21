import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileCode, FileText, BookOpen, AlertCircle, Copy, Check,
  Folder, Cpu, Layers,
} from "lucide-react";
import { makeMarkdownComponents, CodeBlock } from "./AgentCoreMarkdown";
import WanderingEyesLoader from "./WanderingEyesLoader";

const KIND_LABEL = {
  "getting-started": "Getting started", feature: "Feature", "use-case": "Use case",
  integration: "Integration", iac: "Infrastructure as code", blueprint: "Blueprint",
  workshop: "Workshop", overview: "Overview", other: "Sample",
};

const prettyBytes = (n) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`;

/* Group a flat file list into folders for the tree. */
function groupFiles(files) {
  const groups = new Map();
  files.forEach((f) => {
    const idx = f.path.lastIndexOf("/");
    const dir = idx === -1 ? "" : f.path.slice(0, idx);
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir).push(f);
  });
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export default function SampleViewer({ sample, sectionLabel, sectionColor }) {
  // `null` = the README tab; otherwise the file path being viewed.
  const [activeFile, setActiveFile] = useState(null);
  const [readme, setReadme] = useState("");
  const [fileBody, setFileBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef(null);

  const grouped = useMemo(() => groupFiles(sample.files || []), [sample]);
  const mdComponents = useMemo(
    () => makeMarkdownComponents({ baseUrl: sample.base }),
    [sample.base]
  );

  /* README */
  useEffect(() => {
    setActiveFile(null);
    setReadme("");
    setError(null);
    if (!sample.readme) return;
    let alive = true;
    setLoading(true);
    fetch(sample.readme)
      .then((r) => { if (!r.ok) throw new Error(`Could not load README (${r.status})`); return r.text(); })
      .then((t) => { if (alive) { setReadme(t); setLoading(false); } })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [sample]);

  /* selected file */
  useEffect(() => {
    if (!activeFile) { setFileBody(""); return; }
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(`${sample.base}/${activeFile.path}`)
      .then((r) => { if (!r.ok) throw new Error(`Could not load file (${r.status})`); return r.text(); })
      .then((t) => { if (alive) { setFileBody(t); setLoading(false); if (bodyRef.current) bodyRef.current.scrollTop = 0; } })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [activeFile, sample.base]);

  const copyFile = () => {
    navigator.clipboard?.writeText(fileBody).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="ac-sample" style={{ "--sc": sectionColor || "var(--neon)" }}>
      {/* header — navigating back lives in the surrounding topbar */}
      <div className="ac-sample-head">
        <div className="ac-sample-meta">
          <h1 className="ac-sample-title">{sample.title}</h1>
          <div className="ac-sample-tags">
            <span className="ac-tag ac-tag-kind">{KIND_LABEL[sample.kind] || sample.kind}</span>
            {sectionLabel && <span className="ac-tag ac-tag-sec">{sectionLabel}</span>}
            {(sample.frameworks || []).map((f) => (
              <span key={f} className="ac-tag"><Cpu size={10} /> {f}</span>
            ))}
            {(sample.languages || []).map((l) => (
              <span key={l} className="ac-tag">{l}</span>
            ))}
            {sample.hasNotebook && <span className="ac-tag">notebook</span>}
          </div>
          <div className="ac-sample-path" title="Path in the upstream samples repository">
            {sample.slug}
          </div>
        </div>
      </div>

      <div className="ac-sample-split">
        {/* file rail */}
        <aside className="ac-sample-files">
          <button
            className={`ac-file ${!activeFile ? "active" : ""}`}
            onClick={() => setActiveFile(null)}
            disabled={!sample.readme}
          >
            <BookOpen size={12} /> <span className="ac-file-name">README</span>
          </button>
          {grouped.map(([dir, files]) => (
            <div key={dir || "."} className="ac-file-group">
              {dir && (
                <div className="ac-file-dir"><Folder size={10} /> {dir}</div>
              )}
              {files.map((f) => {
                const name = f.path.slice(f.path.lastIndexOf("/") + 1);
                const Icon = f.lang === "markdown" ? FileText : FileCode;
                return (
                  <button
                    key={f.path}
                    className={`ac-file ${activeFile?.path === f.path ? "active" : ""}`}
                    onClick={() => setActiveFile(f)}
                    title={f.path}
                  >
                    <Icon size={12} />
                    <span className="ac-file-name">{name}</span>
                    <span className="ac-file-size">{prettyBytes(f.bytes)}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {!sample.files?.length && (
            <div className="ac-file-empty">No code files in this entry.</div>
          )}
        </aside>

        {/* content */}
        <div className="ac-sample-body" ref={bodyRef}>
          {loading ? (
            <div className="ac-state"><WanderingEyesLoader size={22} /><span>Loading…</span></div>
          ) : error ? (
            <div className="ac-state ac-state-err"><AlertCircle size={24} /><span>{error}</span></div>
          ) : activeFile ? (
            activeFile.lang === "markdown" ? (
              <div className="ac-md ac-sample-md">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {fileBody}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="ac-sample-file">
                <div className="ac-sample-filebar">
                  <span className="ac-sample-filepath"><FileCode size={12} /> {activeFile.path}</span>
                  <button className="ac-btn" onClick={copyFile}>
                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy file"}
                  </button>
                </div>
                <CodeBlock language={activeFile.lang} code={fileBody} />
              </div>
            )
          ) : sample.readme ? (
            <div className="ac-md ac-sample-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {readme}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="ac-state"><Layers size={24} /><span>No README for this entry.</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
