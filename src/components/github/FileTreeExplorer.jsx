import { useState, useCallback, useEffect } from "react";
import { FolderOpen, File, ChevronRight, ChevronDown, Loader2, Search, ArrowLeft, Copy, ExternalLink, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetchRepoTree, fetchFileContent, parseGitHubUrl, EXT_LANG, FILE_COLORS } from "../../services/githubService";

function buildTree(items) {
  const root = { name: "/", type: "tree", children: {}, path: "" };
  for (const item of items) {
    const parts = item.path.split("/");
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const n = parts[i];
      if (i === parts.length - 1) cur.children[n] = { name: n, type: item.type, path: item.path, size: item.size };
      else { if (!cur.children[n]) cur.children[n] = { name: n, type: "tree", children: {}, path: parts.slice(0, i + 1).join("/") }; cur = cur.children[n]; }
    }
  }
  return root;
}

function sorted(node) {
  if (!node.children) return [];
  return Object.values(node.children).sort((a, b) => {
    if (a.type === "tree" && b.type !== "tree") return -1;
    if (a.type !== "tree" && b.type === "tree") return 1;
    return a.name.localeCompare(b.name);
  });
}

function TreeNode({ node, depth, onFileClick, exp, toggle }) {
  const isDir = node.type === "tree";
  const open = exp.has(node.path);
  const ext = node.name.includes(".") ? "." + node.name.split(".").pop().toLowerCase() : "";
  return (
    <>
      <div className={`gh-tree-node ${isDir ? "folder" : "file"}`} style={{ paddingLeft: 12 + depth * 16 }}
        onClick={() => isDir ? toggle(node.path) : onFileClick(node)}>
        {isDir ? (<><span className="gh-tree-arrow">{open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}</span><FolderOpen size={14} className="gh-tree-icon folder-icon"/></>)
        : (<><span className="gh-tree-arrow" style={{visibility:"hidden"}}><ChevronRight size={14}/></span><span className="gh-file-dot" style={{background: FILE_COLORS[ext]||"#666"}}/></>)}
        <span className="gh-tree-name">{node.name}</span>
        {!isDir && node.size && <span className="gh-tree-size">{node.size>1024?`${(node.size/1024).toFixed(1)}KB`:`${node.size}B`}</span>}
      </div>
      {isDir && open && sorted(node).map(c => <TreeNode key={c.path} node={c} depth={depth+1} onFileClick={onFileClick} exp={exp} toggle={toggle}/>)}
    </>
  );
}

export default function FileTreeExplorer({ initialUrl }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exp, setExp] = useState(new Set());
  const [selFile, setSelFile] = useState(null);
  const [content, setContent] = useState(null);
  const [fLoading, setFLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    const p = parseGitHubUrl(url);
    if (!p) { setError("Invalid GitHub URL"); return; }
    setInfo(p); setLoading(true); setError(null); setSelFile(null); setContent(null);
    try {
      const d = await fetchRepoTree(p.owner, p.repo);
      setTree(buildTree(d.tree || []));
      setExp(new Set([""]));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [url]);

  const onFile = useCallback(async (node) => {
    if (!info) return;
    setSelFile(node); setFLoading(true);
    try { setContent(await fetchFileContent(info.owner, info.repo, node.path)); }
    catch (e) { setContent({ decodedContent: `Error: ${e.message}` }); }
    finally { setFLoading(false); }
  }, [info]);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      load();
    }
  }, [initialUrl]); // Only run on mount or when initialUrl changes explicitly
  
  const toggle = useCallback((path) => { setExp(prev => { const n = new Set(prev); n.has(path)?n.delete(path):n.add(path); return n; }); }, []);

  const ext = selFile?.name.includes(".") ? "."+selFile.name.split(".").pop().toLowerCase() : "";
  const lang = EXT_LANG[ext]||"text";
  const isMd = ext === ".md";

  const quickFiles = tree ? ["README.md","package.json","requirements.txt","pyproject.toml","setup.py","Cargo.toml","go.mod","Dockerfile"]
    .filter(n => tree.children && Object.keys(tree.children).some(k => k.toLowerCase() === n.toLowerCase())) : [];

  return (
    <div className="gh-explorer">
      <div className="gh-explorer-input-bar">
        <Search size={16} style={{color:"var(--text3)",flexShrink:0}}/>
        <input className="gh-explorer-input" placeholder="Paste GitHub repo URL…" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")load();}}/>
        <button className="gh-explore-btn" onClick={load} disabled={loading||!url}>{loading?<Loader2 size={14} className="gh-spin"/>:"Explore"}</button>
      </div>
      {error && <div className="gh-error-msg">⚠️ {error}</div>}
      {tree && (
        <div className="gh-explorer-body">
          <div className="gh-tree-panel">
            <div className="gh-tree-header"><span className="gh-tree-title">{info?.owner}/{info?.repo}</span></div>
            {quickFiles.length > 0 && <div className="gh-quick-access">{quickFiles.map(n=><button key={n} className="gh-quick-btn" onClick={()=>onFile({name:n,path:n,type:"blob"})}><File size={10}/> {n}</button>)}</div>}
            <div className="gh-tree-filter">
              <input placeholder="Filter files…" value={filter} onChange={e=>setFilter(e.target.value)} className="gh-tree-filter-input"/>
              {filter && <button className="gh-tree-filter-clear" onClick={()=>setFilter("")}><X size={12}/></button>}
            </div>
            <div className="gh-tree-scroll">
              {sorted(tree)
                .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
                .map(c => <TreeNode key={c.path} node={c} depth={0} onFileClick={onFile} exp={exp} toggle={toggle} />)
              }
            </div>
          </div>
          <div className="gh-file-panel">
            {selFile ? (<>
              <div className="gh-file-header">
                <button className="gh-file-back" onClick={()=>{setSelFile(null);setContent(null);}}><ArrowLeft size={14}/></button>
                <span className="gh-file-path">{selFile.path}</span>
                <div style={{flex:1}}/>
                {content?.html_url && <a href={content.html_url} target="_blank" rel="noopener noreferrer" className="gh-file-link"><ExternalLink size={12}/> GitHub</a>}
                {content?.decodedContent && <button className="gh-file-copy" onClick={()=>navigator.clipboard.writeText(content.decodedContent)}><Copy size={12}/> Copy</button>}
              </div>
              <div className="gh-file-content">
                {fLoading ? <div className="gh-center-msg"><Loader2 size={24} className="gh-spin"/></div>
                : content?.decodedContent ? (isMd
                  ? <div className="gh-markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content.decodedContent}</ReactMarkdown></div>
                  : <SyntaxHighlighter language={lang} style={oneDark} customStyle={{margin:0,borderRadius:0,background:"transparent",fontSize:12,lineHeight:1.6}} showLineNumbers wrapLongLines>{content.decodedContent}</SyntaxHighlighter>
                ) : <div className="gh-center-msg">No content</div>}
              </div>
            </>) : <div className="gh-center-msg" style={{flex:1}}><FolderOpen size={40} style={{opacity:0.2}}/><span>Select a file to preview</span></div>}
          </div>
        </div>
      )}
      {!tree && !loading && !error && <div className="gh-center-msg" style={{flex:1,paddingTop:80}}><FolderOpen size={48} style={{opacity:0.15}}/><span style={{fontSize:15,fontWeight:600}}>Explore any GitHub repository</span><span style={{fontSize:12,opacity:0.5}}>Paste a URL above to browse files</span></div>}
    </div>
  );
}
