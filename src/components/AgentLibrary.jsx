import { useEffect, useMemo, useRef, useState } from "react";
import { NinjaEye } from "./NinjaEye";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GitBranch,
  History,
  Layers3,
  Library,
  Link,
  LoaderCircle,
  PackageOpen,
  Plus,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap
} from "lucide-react";
import {
  createManualRecord,
  DEFAULT_SKILLS_SOURCE,
  filterAllowedSkills,
  loadAgentLibrary,
  loadGitHubSkills,
  loadSavedSkillSource,
  makeId,
  mcpConfigText,
  saveAgentLibrary,
  saveSkillSource
} from "../services/agentLibraryService";
import "./AgentLibrary.css";

const TABS = [
  { id: "skills", label: "Skills", icon: PackageOpen },
  { id: "prompts", label: "Prompts", icon: FileText },
  { id: "mcps", label: "MCP servers", icon: Server }
];

const now = () => new Date().toISOString();
const latestPromptVersion = (prompt) => prompt?.versions?.[prompt.versions.length - 1];
const tagsFromText = (value) => [...new Set(String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean))];
const markdownBody = (value) => String(value || "").replace(/^---\s*\n[\s\S]*?\n---\s*/i, "").trim();

function emptyEditor(kind) {
  return {
    kind,
    id: "",
    name: "",
    description: "",
    tags: "",
    content: kind === "skills"
      ? "---\nname: my-skill\ndescription: Explain when this skill should trigger.\n---\n\nWrite the skill instructions here."
      : "",
    note: "",
    transport: "stdio",
    command: "",
    args: "",
    url: "",
    envVars: ""
  };
}

function sourceKey(record) {
  return `${record.source?.rootUrl || ""}:${record.source?.files?.[0] || record.id}`;
}

export default function AgentLibrary({ onClose }) {
  const [library, setLibrary] = useState(loadAgentLibrary);
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("skills");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [editor, setEditor] = useState(null);
  const [toast, setToast] = useState("");
  const [sourceUrl, setSourceUrl] = useState(loadSavedSkillSource);
  const [lastLoaded, setLastLoaded] = useState(null);
  const [sourceStatus, setSourceStatus] = useState("");
  const [sourceError, setSourceError] = useState("");
  const backupInputRef = useRef(null);

  useEffect(() => {
    saveAgentLibrary(library);
  }, [library]);

  useEffect(() => {
    setLibrary((current) => {
      const skills = filterAllowedSkills(current.skills);
      return skills.length === current.skills.length ? current : { ...current, skills };
    });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const records = library[activeTab] || [];
  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return records;
    return records.filter((record) => [
      record.name,
      record.description,
      ...(record.tags || []),
      ...(record.source?.files || [])
    ].join(" ").toLowerCase().includes(needle));
  }, [activeTab, records, query]);

  const selectedRecord = records.find((record) => record.id === selectedId) || null;
  const selectedVersion = selectedRecord?.versions?.find((version) => version.id === selectedVersionId)
    || latestPromptVersion(selectedRecord);

  useEffect(() => {
    if (!filteredRecords.some((record) => record.id === selectedId)) setSelectedId(filteredRecords[0]?.id || "");
  }, [filteredRecords, selectedId]);

  useEffect(() => {
    setSelectedVersionId(latestPromptVersion(selectedRecord)?.id || "");
  }, [selectedRecord?.id, selectedRecord?.versions?.length]);

  const notify = (message) => setToast(message);

  const copy = async (content, message = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(content || "");
      notify(message);
    } catch {
      notify("Clipboard permission was denied");
    }
  };

  const openLibrary = (tab = "skills") => {
    setActiveTab(tab);
    setScreen("library");
    setQuery("");
  };

  const syncSkills = async () => {
    setSourceError("");
    setSourceStatus("Scanning every SKILL.md under this path…");
    saveSkillSource(sourceUrl.trim() || DEFAULT_SKILLS_SOURCE);
    try {
      const result = await loadGitHubSkills(sourceUrl.trim() || DEFAULT_SKILLS_SOURCE);
      setLibrary((current) => {
        const oldFromSource = new Map(
          current.skills
            .filter((skill) => skill.source?.rootUrl === result.source.url)
            .map((skill) => [sourceKey(skill), skill])
        );
        const refreshed = result.skills.map((skill) => {
          const previous = oldFromSource.get(sourceKey(skill));
          return previous ? { ...skill, id: previous.id, createdAt: previous.createdAt } : skill;
        });
        return {
          ...current,
          skills: [
            ...current.skills.filter((skill) => skill.source?.rootUrl !== result.source.url),
            ...refreshed
          ]
        };
      });
      setLastLoaded({ ...result, loadedAt: now() });
      setActiveTab("skills");
      setScreen("library");
      setSelectedId(result.skills[0]?.id || "");
      notify(`${result.skills.length} skill${result.skills.length === 1 ? "" : "s"} loaded`);
    } catch (error) {
      setSourceError(error.message);
    } finally {
      setSourceStatus("");
    }
  };

  const openEditor = (kind, record = null) => {
    if (!record) {
      setEditor(emptyEditor(kind));
      return;
    }
    setEditor({
      ...emptyEditor(kind),
      id: record.id,
      name: record.name,
      description: record.description || "",
      tags: (record.tags || []).join(", "),
      content: kind === "prompts" ? latestPromptVersion(record)?.content || "" : record.content || "",
      note: "",
      transport: record.config?.transport || "stdio",
      command: record.config?.command || "",
      args: (record.config?.args || []).join("\n"),
      url: record.config?.url || "",
      envVars: (record.config?.envVars || []).join(", ")
    });
  };

  const saveEditor = () => {
    if (!editor?.name.trim()) {
      notify("A name is required");
      return;
    }
    setLibrary((current) => {
      const list = [...(current[editor.kind] || [])];
      const index = list.findIndex((record) => record.id === editor.id);
      const existing = list[index];
      const record = createManualRecord(editor.kind, editor, existing);
      if (index >= 0) list[index] = record;
      else list.unshift(record);
      return { ...current, [editor.kind]: list };
    });
    setSelectedId(editor.id || "");
    setEditor(null);
    notify(editor.id ? "Changes saved" : "Item created");
  };

  const deleteRecord = (record) => {
    if (!window.confirm(`Delete “${record.name}”? This cannot be undone.`)) return;
    setLibrary((current) => ({ ...current, [activeTab]: current[activeTab].filter((item) => item.id !== record.id) }));
    setSelectedId("");
    notify("Item deleted");
  };

  const restorePromptVersion = () => {
    if (!selectedRecord || !selectedVersion) return;
    const restoredAt = now();
    setLibrary((current) => ({
      ...current,
      prompts: current.prompts.map((prompt) => prompt.id !== selectedRecord.id ? prompt : {
        ...prompt,
        updatedAt: restoredAt,
        versions: [...prompt.versions, {
          id: makeId("version"),
          number: (latestPromptVersion(prompt)?.number || 0) + 1,
          content: selectedVersion.content,
          note: `Restored from v${selectedVersion.number}`,
          createdAt: restoredAt
        }]
      })
    }));
    notify(`Restored v${selectedVersion.number} as a new version`);
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `agent-library-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Backup exported");
  };

  const importBackup = async (file) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      setLibrary({
        schemaVersion: 1,
        prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
        skills: filterAllowedSkills(parsed.skills),
        mcps: Array.isArray(parsed.mcps) ? parsed.mcps : []
      });
      notify("Library backup imported");
    } catch {
      notify("That backup is not valid JSON");
    }
  };

  const stats = {
    prompts: library.prompts.length,
    versions: library.prompts.reduce((sum, prompt) => sum + (prompt.versions?.length || 0), 0),
    skills: library.skills.length,
    mcps: library.mcps.length
  };

  const renderTopbar = (isHome = false) => (
    <header className="al-topbar">
      <button className="al-brand" onClick={() => setScreen("home")} aria-label="Agent Library home">
        <span className="al-brand-mark"><Database size={19} /></span>
        <span><strong>Agent Library</strong><small>your agent operating system</small></span>
      </button>
      {!isHome && (
        <div className="al-breadcrumb"><span>Agent Library</span><ChevronRight size={13} /><strong>{activeTab === "mcps" ? "MCP servers" : activeTab}</strong></div>
      )}
      <div className="al-top-actions">
        <input ref={backupInputRef} type="file" accept="application/json,.json" hidden onChange={(event) => importBackup(event.target.files?.[0])} />
        <button onClick={() => backupInputRef.current?.click()} title="Import a library backup"><Upload size={14} /><span>Import backup</span></button>
        <button onClick={exportBackup} title="Export a library backup"><Download size={14} /><span>Export</span></button>
        <button className="al-close" onClick={onClose} title="Close Agent Library"><X size={17} /></button>
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="al-home">
      {renderTopbar(true)}
      <main className="al-home-inner">
        <section className="al-hero">
          <div className="al-hero-copy">
            <span className="al-eyebrow"><span className="al-live-dot" /> AGENT BUILDER WORKSPACE</span>
            <h1>Every skill.<br /><em>One calm place.</em></h1>
            <p>Pull an entire skills collection from GitHub, keep it searchable, and reuse the exact instructions your agents need — without a noisy import workflow.</p>
            <div className="al-hero-actions">
              <button className="al-primary" onClick={() => openLibrary("skills")}><Library size={15} /> Browse library <ArrowUpRight size={14} /></button>
              <a className="al-quiet-link" href={sourceUrl || DEFAULT_SKILLS_SOURCE} target="_blank" rel="noreferrer"><GitBranch size={14} /> View source on GitHub</a>
            </div>
          </div>
          <div className="al-hero-visual" aria-hidden="true">
            <div className="al-orbit al-orbit-one" />
            <div className="al-orbit al-orbit-two" />
            <div className="al-hero-core"><Sparkles size={23} /><span>AGENT<br />READY</span></div>
            <span className="al-float-card al-float-card-one"><Code2 size={13} /> SKILL.md</span>
            <span className="al-float-card al-float-card-two"><Zap size={13} /> SYNCED</span>
          </div>
        </section>

        <section className="al-source-card">
          <div className="al-source-card-head">
            <div className="al-source-icon"><FolderGit2 size={18} /></div>
            <div><span className="al-card-kicker">GITHUB SKILL SOURCE</span><h2>Load a complete collection</h2></div>
            <span className="al-source-safe"><ShieldCheck size={13} /> Read-only scan</span>
          </div>
          <p>Paste any public repository, folder, or <code>SKILL.md</code> URL. Agent Library finds every skill below that path and saves them as individual, searchable records.</p>
          <div className="al-source-input-row">
            <div className="al-url-input"><Link size={15} /><input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && syncSkills()} placeholder={DEFAULT_SKILLS_SOURCE} /></div>
            <button className="al-primary" onClick={syncSkills} disabled={Boolean(sourceStatus)}>{sourceStatus ? <NinjaEye size={16} labelled={false} /> : <RefreshCw size={15} />}{sourceStatus ? "Loading…" : "Load all skills"}</button>
          </div>
          {sourceError && <div className="al-source-error"><X size={14} /> {sourceError}</div>}
          <div className="al-source-hint"><GitBranch size={13} /> Try the default collection: <button onClick={() => setSourceUrl(DEFAULT_SKILLS_SOURCE)}>agentic-awesome-skills / skills</button><span>·</span><span>Every skill stays linked to its original file.</span></div>
        </section>

        <section className="al-stat-grid">
          <div className="al-stat-card al-stat-card-featured"><span className="al-stat-icon"><PackageOpen size={17} /></span><strong>{stats.skills}</strong><span>skills in your shelf</span><small>{lastLoaded ? `Last loaded ${new Date(lastLoaded.loadedAt).toLocaleDateString()}` : "Ready for your first collection"}</small></div>
          <div className="al-stat-card"><span className="al-stat-icon"><FileText size={17} /></span><strong>{stats.prompts}</strong><span>saved prompts</span><small>{stats.versions} versions tracked</small></div>
          <div className="al-stat-card"><span className="al-stat-icon"><Server size={17} /></span><strong>{stats.mcps}</strong><span>MCP servers</span><small>Configurations kept local</small></div>
        </section>

        <section className="al-how-section">
          <div className="al-section-heading"><div><span className="al-card-kicker">A SIMPLE LOOP</span><h2>From repository to ready-to-use</h2></div><button className="al-text-button" onClick={() => openLibrary("skills")}>Open workspace <ArrowUpRight size={14} /></button></div>
          <div className="al-how-grid">
            <article><span className="al-step-number">01</span><div className="al-how-icon"><GitBranch size={18} /></div><h3>Point to a path</h3><p>Use a repository, folder, or individual skill file from GitHub.</p></article>
            <article><span className="al-step-number">02</span><div className="al-how-icon"><Layers3 size={18} /></div><h3>Sync the whole set</h3><p>Every <code>SKILL.md</code> under the path becomes its own record.</p></article>
            <article><span className="al-step-number">03</span><div className="al-how-icon"><Zap size={18} /></div><h3>Use the exact source</h3><p>Search, copy, and open the original file whenever you need it.</p></article>
          </div>
        </section>
      </main>
    </div>
  );

  const renderLibrary = () => (
    <div className="al-library">
      {renderTopbar(false)}
      <div className="al-library-context">
        <button className="al-back-button" onClick={() => setScreen("home")}><ArrowLeft size={15} /> Home</button>
        <div className="al-context-source"><GitBranch size={13} /><span>{lastLoaded?.source ? `${lastLoaded.source.owner}/${lastLoaded.source.repo}` : "Local library"}</span>{lastLoaded?.filesDiscovered ? <small>{lastLoaded.filesDiscovered} files scanned</small> : null}</div>
        <button className="al-refresh-button" onClick={syncSkills} disabled={Boolean(sourceStatus)}><RefreshCw size={14} className={sourceStatus ? "al-spin" : ""} /> Sync source</button>
      </div>
      <nav className="al-library-tabs">{TABS.map(({ id, label, icon: Icon }) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => { setActiveTab(id); setQuery(""); setSelectedId(""); }}><Icon size={14} /> {label}<b>{stats[id]}</b></button>)}</nav>
      <main className="al-workspace">
        <aside className="al-browser">
          <div className="al-browser-head"><div><span>YOUR SHELF</span><strong>{filteredRecords.length} {activeTab}</strong></div><button onClick={() => openEditor(activeTab)} title={`Add ${activeTab}`}><Plus size={15} /></button></div>
          <div className="al-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeTab}…`} /></div>
          <div className="al-record-list">{filteredRecords.map((record) => <button className={record.id === selectedId ? "active" : ""} key={record.id} onClick={() => setSelectedId(record.id)}><span className="al-record-icon">{activeTab === "skills" ? <PackageOpen size={14} /> : activeTab === "prompts" ? <FileText size={14} /> : <Server size={14} />}</span><span><strong>{record.name}</strong><small>{record.description || (record.source?.files?.[0] || "Saved locally")}</small></span>{activeTab === "prompts" && <em>v{latestPromptVersion(record)?.number || 1}</em>}</button>)}{!filteredRecords.length && <div className="al-empty-list"><PackageOpen size={24} /><p>No {activeTab} yet.</p><button onClick={() => activeTab === "skills" ? setScreen("home") : openEditor(activeTab)}>{activeTab === "skills" ? "Load a source" : "Create one"} <ChevronRight size={13} /></button></div>}</div>
        </aside>

        <section className="al-detail">
          {selectedRecord ? <>
            <div className="al-detail-header"><div><span className="al-detail-type">{activeTab === "mcps" ? "MCP SERVER" : activeTab.slice(0, -1).toUpperCase()}</span><h1>{selectedRecord.name}</h1><p>{selectedRecord.description || "No description yet."}</p><div className="al-tags">{(selectedRecord.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="al-detail-actions">{selectedRecord.source?.url && <a href={selectedRecord.source.url} target="_blank" rel="noreferrer" title="Open source on GitHub"><ExternalLink size={15} /></a>}<button onClick={() => openEditor(activeTab, selectedRecord)} title="Edit"><Code2 size={15} /></button><button className="danger" onClick={() => deleteRecord(selectedRecord)} title="Delete"><X size={15} /></button></div></div>
            {activeTab === "prompts" ? <><div className="al-code-toolbar"><span><History size={13} /> VERSION HISTORY</span><select value={selectedVersion?.id || ""} onChange={(event) => setSelectedVersionId(event.target.value)}>{[...(selectedRecord.versions || [])].reverse().map((version) => <option value={version.id} key={version.id}>v{version.number} · {version.note || "Saved version"}</option>)}</select><button onClick={restorePromptVersion}>Restore as new</button><button onClick={() => copy(selectedVersion?.content, "Prompt copied")}><Copy size={13} /> Copy</button></div><div className="al-version-meta"><b>v{selectedVersion?.number}</b><span>{selectedVersion?.note}</span><time>{selectedVersion?.createdAt ? new Date(selectedVersion.createdAt).toLocaleString() : ""}</time></div><pre className="al-content">{selectedVersion?.content}</pre></>
              : activeTab === "skills" ? <><div className="al-code-toolbar"><span><BookOpen size={13} /> RENDERED SKILL <small>{selectedRecord.source?.files?.[0] || "local file"}</small></span><button onClick={() => copy(selectedRecord.content, "Skill copied")}><Copy size={13} /> Copy raw</button></div>{selectedRecord.content ? <article className="al-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownBody(selectedRecord.content)}</ReactMarkdown></article> : <div className="al-content al-content-empty">This skill is indexed locally, but its full instructions are not persisted in browser storage. Sync the GitHub source to restore the file body.</div>}</>
                : <><div className="al-mcp-summary"><div><span>Transport</span><strong>{selectedRecord.config?.transport || "unknown"}</strong></div><div><span>Endpoint / command</span><strong>{selectedRecord.config?.url || selectedRecord.config?.command || "not configured"}</strong></div><div><span>Environment variables</span><strong>{selectedRecord.config?.envVars?.join(", ") || "none declared"}</strong></div></div><div className="al-code-toolbar"><span><Server size={13} /> CODEX CONFIG PREVIEW</span><button onClick={() => copy(mcpConfigText(selectedRecord), "MCP configuration copied")}><Copy size={13} /> Copy</button></div><pre className="al-content">{mcpConfigText(selectedRecord)}</pre>{selectedRecord.content && <pre className="al-content secondary">{selectedRecord.content}</pre>}</>}
            {selectedRecord.source && <div className="al-provenance"><ShieldCheck size={14} /><span>Synced from <strong>{selectedRecord.source.label}</strong></span><a href={selectedRecord.source.url} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={12} /></a></div>}
          </> : <div className="al-empty-detail"><div className="al-empty-detail-icon"><Clipboard size={24} /></div><span className="al-card-kicker">A QUIET PLACE FOR GOOD INSTRUCTIONS</span><h2>Select an asset to inspect it.</h2><p>Pick a record from your shelf, or load a complete skills collection from GitHub to get started.</p><button className="al-primary" onClick={() => activeTab === "skills" ? setScreen("home") : openEditor(activeTab)}>{activeTab === "skills" ? <GitBranch size={14} /> : <Plus size={14} />}{activeTab === "skills" ? "Load GitHub skills" : `Create ${activeTab.slice(0, -1)}`}</button></div>}
        </section>
      </main>
    </div>
  );

  return <section className="agent-library">{screen === "home" ? renderHome() : renderLibrary()}{editor && <div className="al-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditor(null)}><div className="al-modal"><header><div><span>{editor.id ? "EDIT" : "CREATE"}</span><h2>{editor.kind === "mcps" ? "MCP server" : editor.kind.slice(0, -1)}</h2></div><button onClick={() => setEditor(null)}><X size={17} /></button></header><div className="al-modal-body"><div className="al-field-grid"><label><span>Name *</span><input value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} /></label><label><span>Tags</span><input value={editor.tags} onChange={(event) => setEditor({ ...editor, tags: event.target.value })} placeholder="coding, review, python" /></label></div><label><span>Description</span><input value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} /></label>{editor.kind === "mcps" && <><div className="al-field-grid"><label><span>Transport</span><select value={editor.transport} onChange={(event) => setEditor({ ...editor, transport: event.target.value })}><option value="stdio">STDIO</option><option value="http">Streamable HTTP</option></select></label>{editor.transport === "http" ? <label><span>Server URL</span><input value={editor.url} onChange={(event) => setEditor({ ...editor, url: event.target.value })} placeholder="https://server.example.com/mcp" /></label> : <label><span>Command</span><input value={editor.command} onChange={(event) => setEditor({ ...editor, command: event.target.value })} placeholder="npx" /></label>}</div>{editor.transport === "stdio" && <label><span>Arguments · one per line</span><textarea className="short" value={editor.args} onChange={(event) => setEditor({ ...editor, args: event.target.value })} placeholder={"-y\n@vendor/server"} /></label>}<label><span>Environment variable names only</span><input value={editor.envVars} onChange={(event) => setEditor({ ...editor, envVars: event.target.value })} placeholder="GITHUB_TOKEN, API_KEY" /></label></>}<label><span>{editor.kind === "prompts" ? "Prompt" : editor.kind === "skills" ? "SKILL.md" : "Notes / source manifest"}</span><textarea className="code" value={editor.content} onChange={(event) => setEditor({ ...editor, content: event.target.value })} /></label>{editor.kind === "prompts" && editor.id && <label><span>Version note</span><input value={editor.note} onChange={(event) => setEditor({ ...editor, note: event.target.value })} placeholder="What changed in this version?" /></label>}</div><footer><button onClick={() => setEditor(null)}>Cancel</button><button className="al-primary" onClick={saveEditor}><Check size={14} /> Save{editor.kind === "prompts" && editor.id ? " new version" : ""}</button></footer></div></div>}{toast && <div className="al-toast"><Check size={13} /> {toast}</div>}</section>;
}
