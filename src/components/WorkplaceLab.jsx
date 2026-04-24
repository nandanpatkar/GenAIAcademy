import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Clock, X, Plus, Search, Code, Bookmark, ExternalLink,
  Trash2, Save, Edit2, Eye, ChevronRight, Calendar,
  GitBranch, ZoomIn, ZoomOut, RotateCcw, Download,
  Trash, AlignCenter, Minus, Copy, ChevronDown, ChevronUp,
  Settings, Bold, Italic, Underline, AlignLeft, AlignRight,
  Link as LinkIcon, Link2, Share2, Globe, Image, Paperclip, MessageSquare, List,
  MoreHorizontal, Palette, Type, SlidersHorizontal, StickyNote,
  Maximize, Undo2, Redo2, Sun, Moon, Video, Layers, Library,
  BookOpen, Book
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/WorkplaceLab.css';

// ── Markdown Components ──────────────────────────────────────
const MarkdownComponents = {
  h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
  p:  ({ children }) => <div className="md-p">{children}</div>,
  a:  ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">
      {children} <ExternalLink size={10} style={{ display:'inline', marginLeft:2 }} />
    </a>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="md-img" referrerPolicy="no-referrer" loading="lazy"
      onError={e => { e.target.style.display='none'; }} />
  ),
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <div className="md-code-block">
        <SyntaxHighlighter style={atomDark} language={match?match[1]:'javascript'} PreTag="pre"
          customStyle={{ background:'transparent', padding:'16px', margin:0 }} {...props}>
          {String(children).replace(/\n$/,'')}
        </SyntaxHighlighter>
      </div>
    ) : <code className="md-inline-code" {...props}>{children}</code>;
  },
  table: ({ children }) => <div className="md-table-wrapper"><table className="md-table">{children}</table></div>,
  thead: ({ children }) => <thead className="md-thead">{children}</thead>,
  tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
  tr:   ({ children }) => <tr className="md-tr">{children}</tr>,
  th:   ({ children }) => <th className="md-th">{children}</th>,
  td:   ({ children }) => <td className="md-td">{children}</td>,
  ul:   ({ children }) => <ul className="md-ul">{children}</ul>,
  ol:   ({ children }) => <ol className="md-ol">{children}</ol>,
  li:   ({ children }) => <li className="md-li">{children}</li>,
};

// ============================================================
// MIND MAP ENGINE
// ============================================================
function uid() { return Math.random().toString(36).slice(2, 9); }
function isDark() { return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false; }

// Node background themes
const NODE_THEMES = [
  { bg:'#ffffff', border:'#d1d5db', text:'#111827', name:'White' },
  { bg:'#fef3c7', border:'#fcd34d', text:'#92400e', name:'Amber' },
  { bg:'#dcfce7', border:'#86efac', text:'#166534', name:'Green' },
  { bg:'#dbeafe', border:'#93c5fd', text:'#1e40af', name:'Blue'  },
  { bg:'#ede9fe', border:'#c4b5fd', text:'#5b21b6', name:'Purple'},
  { bg:'#fce7f3', border:'#f9a8d4', text:'#9d174d', name:'Pink'  },
  { bg:'#ffedd5', border:'#fdba74', text:'#9a3412', name:'Orange'},
  { bg:'#f1f5f9', border:'#94a3b8', text:'#334155', name:'Slate' },
];
const NODE_THEMES_DARK = [
  { bg:'#2d2d35', border:'#4b4b5a', text:'#e5e7eb', name:'Default' },
  { bg:'#3d3000', border:'#7c5800', text:'#fcd34d', name:'Amber'   },
  { bg:'#0d2e0d', border:'#166534', text:'#86efac', name:'Green'   },
  { bg:'#0c1d3d', border:'#1e40af', text:'#93c5fd', name:'Blue'    },
  { bg:'#1e1040', border:'#5b21b6', text:'#c4b5fd', name:'Purple'  },
  { bg:'#2d0d1e', border:'#9d174d', text:'#f9a8d4', name:'Pink'    },
  { bg:'#2d1200', border:'#9a3412', text:'#fdba74', name:'Orange'  },
  { bg:'#1e2433', border:'#334155', text:'#94a3b8', name:'Slate'   },
];

const FONT_FAMILIES = [
  { label: 'Sans', value: 'system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'ui-monospace, monospace' },
];

const FONT_SIZES = [
  { label: 'S', value: 11 },
  { label: 'M', value: 13 },
  { label: 'L', value: 16 },
  { label: 'XL', value: 20 },
];

function makeNode(label, parentId=null, themeIdx=0) {
  return {
    id:uid(),
    label,
    parentId,
    themeIdx,
    fontSize:13,
    fontFamily: FONT_FAMILIES[0].value,
    bold:false,
    italic:false,
    underline:false,
    align:'center',
    borderRadius:10,
    note:'',
    url:'',
    collapsed:false,
    attachments:[],
    x:0, y:0 // Explicitly initialize
  };
}

// ── Auto-layout: balanced L/R radial ─────────────────────────
function nodeW(node) {
  if (node.type === 'sticky') return 160;
  const fs = node.fontSize || (node.parentId ? 13 : 15);
  const label = node.label || '';
  const boldFactor = node.bold ? 1.25 : 1.0;
  const italicFactor = node.italic ? 1.05 : 1.0;
  // Estimate text width
  const textWidth = label.length * fs * 0.58 * boldFactor * italicFactor;
  const minW = node.parentId ? 110 : 180;
  return Math.max(minW, Math.min(350, textWidth + 48));
}

function nodeH(node) {
  if (node.type === 'sticky') return 160;
  const fs = node.fontSize || (node.parentId ? 13 : 15);
  return Math.max(node.parentId ? 36 : 52, fs * 2.8);
}

function autoLayout(nodes) {
  const roots = nodes.filter(n => !n.parentId);
  if (!roots.length) return nodes;

  const map = {};
  nodes.forEach(n => { map[n.id] = { ...n }; });

  // 1. Group nodes by root
  function getSubtreeIds(pid) {
    const ids = [pid];
    nodes.filter(n => n.parentId === pid).forEach(k => {
      ids.push(...getSubtreeIds(k.id));
    });
    return ids;
  }

  // 2. Layout each root's tree independently at relative (0,0)
  function place(pid, depth, dir = 0) {
    const kids = nodes.filter(n => n.parentId === pid);
    if (!kids.length) return;

    const par = map[pid];
    const parW = nodeW(par);
    const vsBase = 50;  // Spaced out more
    const hsBase = 180; // Spaced out more

    if (depth === 1) {
      const half = Math.ceil(kids.length / 2);
      const left = kids.slice(0, half), right = kids.slice(half);
      const pg = (list, d) => {
        const totalH = list.reduce((sum, k) => sum + nodeH(k) + vsBase, 0) - vsBase;
        let curY = par.y - totalH / 2;
        list.forEach((k) => {
          const kw = nodeW(k);
          const kh = nodeH(k);
          map[k.id].x = par.x + d * (parW / 2 + hsBase + kw / 2);
          map[k.id].y = curY + kh / 2;
          curY += kh + vsBase;
          place(k.id, depth + 1, d);
        });
      };
      pg(left, -1); pg(right, 1);
    } else {
      const totalH = kids.reduce((sum, k) => sum + nodeH(k) + vsBase, 0) - vsBase;
      let curY = par.y - totalH / 2;
      kids.forEach((k) => {
        const kw = nodeW(k);
        const kh = nodeH(k);
        map[k.id].x = par.x + dir * (parW / 2 + hsBase + kw / 2);
        map[k.id].y = curY + kh / 2;
        curY += kh + vsBase;
        place(k.id, depth + 1, dir);
      });
    }
  }

  // 3. Arrange roots vertically
  let currentRootY = 0;
  const rootGaps = 200;

  roots.forEach((root) => {
    map[root.id].x = 0;
    map[root.id].y = currentRootY;
    place(root.id, 1);
    
    // Find the height of this entire subtree to offset the next root
    const subtreeIds = getSubtreeIds(root.id);
    const subtreeNodes = subtreeIds.map(id => map[id]);
    const minY = Math.min(...subtreeNodes.map(n => n.y - nodeH(n)/2));
    const maxY = Math.max(...subtreeNodes.map(n => n.y + nodeH(n)/2));
    const subtreeHeight = maxY - minY;
    
    currentRootY += subtreeHeight + rootGaps;
  });

  return nodes.map(n => map[n.id]||n);
}

function getDesc(nodes, id) {
  const kids = nodes.filter(n => n.parentId===id).map(n=>n.id);
  return kids.flatMap(k => [k, ...getDesc(nodes,k)]);
}

// ── Reference Link Component ─────────────────────────────────
function ReferenceLink({ from, to, darkMode, onClick }) {
  if (!from || !to) return null;
  // A distinct green line for references with an arrowhead
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  
  // Create a lofted cubic bezier to avoid direct overlaps with tree branches
  const loft = Math.max(60, Math.min(200, dist * 0.4));
  // Control points pull away vertically to create an arc
  const c1x = from.x + dx * 0.25;
  const c1y = from.y - loft;
  const c2x = to.x - dx * 0.25;
  const c2y = to.y - loft;

  const d = `M${from.x},${from.y} C${c1x},${c1y} ${c2x},${c2y} ${to.x},${to.y}`;
  
  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <path d={d} fill="none" stroke="#10b981" strokeWidth={3} strokeDasharray="6,4" strokeLinecap="round" markerEnd="url(#mup-arrow)">
        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Invisible thicker path for easier clicking */}
      <path d={d} fill="none" stroke="transparent" strokeWidth={15} />
    </g>
  );
}

function makeStarterMap() {
  const root = { id:'root', label:'Hit Space or double-click', parentId:null, themeIdx:0, fontSize:14, bold:false, italic:false, underline:false, align:'center', borderRadius:26, note:'', collapsed:false, x:0, y:0 };
  const raw = [root, makeNode('node 1','root',0), makeNode('node 2','root',0), makeNode('node 3','root',0), makeNode('node 4','root',0)];
  raw.push(makeNode('child node', raw[4].id, 0));
  return autoLayout(raw);
}

// ── Edge ─────────────────────────────────────────────────────
function Edge({ from, to, darkMode }) {
  if (!from||!to) return null;
  const cx = (from.x+to.x)/2;
  const d = `M${from.x},${from.y} C${cx},${from.y} ${cx},${to.y} ${to.x},${to.y}`;
  return <path d={d} fill="none" stroke={darkMode?'#5a5a70':'#b0b8c8'} strokeWidth={1.5} strokeLinecap="round" />;
}

// ── Shortcuts panel ───────────────────────────────────────────
function ShortcutsPanel({ onClose, darkMode }) {
  const TIPS = [
    { label:'Add child',   key:'Tab'   },
    { label:'Add sibling', key:'Enter' },
    { label:'Pan canvas',  key:'Drag'  },
    { label:'Zoom',        key:'Scroll'},
    { label:'Edit text',   key:'Space' },
  ];
  const [done, setDone] = useState(Array(TIPS.length).fill(false));
  const completed = done.filter(Boolean).length;
  const bg   = darkMode?'#1e1e28':'#ffffff';
  const txt  = darkMode?'#e5e7eb':'#111827';
  const sub  = darkMode?'#9ca3af':'#6b7280';
  const rowB = darkMode?'#2a2a38':'#f9fafb';
  const rowG = darkMode?'#1a2e1a':'#f0fdf4';
  const rowGB= darkMode?'#2d4d2d':'#bbf7d0';
  const kbB  = darkMode?'#38384a':'#f3f4f6';
  const kbT  = darkMode?'#d1d5db':'#374151';
  return (
    <div style={{ position:'absolute', bottom:16, right:16, zIndex:900, width:310, background:bg, borderRadius:16,
      boxShadow:darkMode?'0 8px 40px rgba(0,0,0,0.5)':'0 8px 40px rgba(0,0,0,0.13)',
      padding:'22px 20px 18px', border:`1px solid ${darkMode?'rgba(255,255,255,0.07)':'#e5e7eb'}`,
      fontFamily:'system-ui,-apple-system,sans-serif' }}>
      <div style={{ fontSize:17, fontWeight:700, color:txt, marginBottom:4 }}>Welcome. Try the basics.</div>
      <div style={{ fontSize:12, color:sub, marginBottom:14 }}>{completed} of {TIPS.length} shortcuts completed</div>
      {TIPS.map((s,i) => (
        <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'9px 13px', borderRadius:10, marginBottom:6, cursor:'pointer',
            background:done[i]?rowG:rowB, border:`1px solid ${done[i]?rowGB:(darkMode?'#3a3a4a':'#e5e7eb')}`, transition:'all .15s' }}>
          <span style={{ fontSize:13, color:txt, fontWeight:500 }}>{s.label}</span>
          <div style={{ display:'flex', gap:6 }}>
            {s.key==='Zoom'&&<span style={{ fontSize:12, padding:'3px 8px', borderRadius:6, background:kbB, color:kbT, border:`1px solid ${darkMode?'#4a4a5a':'#e5e7eb'}`, fontFamily:'monospace' }}>⌘</span>}
            <span style={{ fontSize:12, padding:'3px 10px', borderRadius:6, background:kbB, color:kbT, border:`1px solid ${darkMode?'#4a4a5a':'#e5e7eb'}`, fontWeight:500 }}>{s.key}</span>
          </div>
        </div>
      ))}
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
        <button onClick={onClose} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:10, padding:'9px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}
          onMouseEnter={e=>e.currentTarget.style.background='#4f46e5'}
          onMouseLeave={e=>e.currentTarget.style.background='#6366f1'}>Done</button>
      </div>
    </div>
  );
}

// ── Node Formatting Toolbar (shown above canvas when node selected) ──
// ── Canvas Controls (Floating UI) ──
function CanvasControls({ onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, canUndo, canRedo, zoom, darkMode }) {
  const bg = darkMode ? '#1e1e28' : '#ffffff';
  const border = darkMode ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const color = darkMode ? '#e5e7eb' : '#374151';
  const shadow = darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)';

  const CtrlBtn = ({ icon, onClick, disabled, title }) => (
    <button onClick={onClick} disabled={disabled} title={title}
      style={{
        background:'transparent', border:'none', cursor:disabled?'not-allowed':'pointer',
        color: disabled ? (darkMode?'rgba(255,255,255,0.1)':'#d1d5db') : color,
        width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8,
        transition:'all .15s'
      }}
      onMouseEnter={e=>{if(!disabled) e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.05)':'#f3f4f6'}}
      onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
      {icon}
    </button>
  );

  return (
    <div style={{ position:'absolute', bottom:16, right:330, display:'flex', gap:8, zIndex:900 }}>
       <div style={{ display:'flex', background:bg, border:`1px solid ${border}`, borderRadius:12, padding:4, boxShadow:shadow, alignItems:'center' }}>
         <CtrlBtn icon={<Minus size={15}/>} onClick={onZoomOut} title="Zoom Out"/>
         <div style={{ fontSize:11, fontWeight:800, width:44, textAlign:'center', color, fontFamily:'monospace' }}>{Math.round(zoom*100)}%</div>
         <CtrlBtn icon={<Plus size={15}/>} onClick={onZoomIn} title="Zoom In"/>
         <div style={{ width:1, height:16, background:border, margin:'0 4px' }}/>
         <CtrlBtn icon={<Maximize size={15}/>} onClick={onZoomFit} title="Zoom to Fit"/>
       </div>
       <div style={{ display:'flex', background:bg, border:`1px solid ${border}`, borderRadius:12, padding:4, boxShadow:shadow }}>
         <CtrlBtn icon={<Undo2 size={15}/>} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)"/>
         <CtrlBtn icon={<Redo2 size={15}/>} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)"/>
       </div>
    </div>
  );
}

// ── Attachment Picker UI ──
// ── Attachment Picker UI ──
function AttachmentPicker({ notes, history, pathsData, onAttach, onClose, darkMode }) {
  const [activeTab, setActiveTab] = useState('notes');
  const bg = darkMode ? '#1a1a24' : '#ffffff';
  const txt = darkMode ? '#e5e7eb' : '#111827';
  const sub = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const accent = '#6366f1';

  // Aggregate Resources & Roadmap topics
  const aggregated = useMemo(() => {
    const res = {
      videos: [],
      links: [],
      files: [],
      knowledge: []
    };
    const rm = {
      paths: [],
      nodes: [],
      subtopics: []
    };

    Object.entries(pathsData || {}).forEach(([pathKey, path]) => {
      if (pathKey === 'workspace' || pathKey === 'saved_algos' || !path.nodes) return;
      
      rm.paths.push({ type: 'roadmap', id: pathKey, title: path.title || pathKey, pathId: pathKey, level: 'path' });

      path.nodes.forEach(node => {
        rm.nodes.push({ type: 'roadmap', id: node.id, title: node.title, pathId: pathKey, level: 'node' });
        
        (node.modules || []).forEach(mod => {
          if (mod.videos) mod.videos.forEach(v => res.videos.push({ type: 'resource', id: node.id, title: v.title || v.id, subType: 'video', pathId: pathKey, moduleId: mod.id }));
          if (mod.links) mod.links.forEach(l => res.links.push({ type: 'resource', id: node.id, title: l.title || l.url, subType: 'link', pathId: pathKey, moduleId: mod.id }));
          if (mod.files) mod.files.forEach(f => res.files.push({ type: 'resource', id: node.id, title: f.name || f.title, subType: 'file', pathId: pathKey, moduleId: mod.id }));
          if (mod.knowledge) mod.knowledge.forEach(k => res.knowledge.push({ type: 'resource', id: node.id, title: k.title, subType: 'knowledge', pathId: pathKey, moduleId: mod.id }));
          
          (mod.subtopics || []).forEach(st => {
            const stitle = typeof st === 'object' ? st.title : st;
            rm.subtopics.push({ type: 'roadmap', id: node.id, title: stitle, pathId: pathKey, moduleId: mod.id, level: 'subtopic' });
          });
        });
      });
    });

    return { resources: res, roadmap: rm };
  }, [pathsData]);

  const GroupHeader = ({ title, icon }) => (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 4px 6px', fontSize:10, fontWeight:800, color:accent, letterSpacing:'0.05em', borderBottom:`1px solid ${darkMode?'rgba(99,102,241,0.2)':'#eef2ff'}`, marginBottom:4, marginTop:8 }}>
      {icon} {title.toUpperCase()}
    </div>
  );

  const ItemRow = ({ item, onClick, icon, subTitle }) => (
    <div onClick={onClick} 
      style={{ padding:'7px 10px', borderRadius:8, cursor:'pointer', fontSize:12, color:txt, background:darkMode?'rgba(255,255,255,0.03)':'#f9fafb', display:'flex', alignItems:'center', gap:8, transition:'all .2s' }}
      onMouseEnter={e=>{
        e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.08)':'#f3f4f6';
        e.currentTarget.style.transform='translateX(4px)';
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.03)':'#f9fafb';
        e.currentTarget.style.transform='translateX(0)';
      }}>
      <span style={{ fontSize:14 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</div>
        {subTitle && <div style={{ fontSize:9, color:sub, marginTop:1 }}>{subTitle}</div>}
      </div>
    </div>
  );

  const renderList = () => {
    if (activeTab === 'notes') {
      return (notes && notes.length > 0) ? (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {notes.map(n => <ItemRow key={n.id} item={n} onClick={()=>onAttach({type:'note', id:n.id, title:n.title})} icon="📝" />)}
        </div>
      ) : <div style={{ fontSize:11, color:sub, textAlign:'center', padding:20 }}>No notes found</div>;
    }
    
    if (activeTab === 'resources') {
      const hasAny = Object.values(aggregated.resources).some(arr => arr.length > 0);
      if (!hasAny) return <div style={{ fontSize:11, color:sub, textAlign:'center', padding:20 }}>No resources available</div>;
      
      return (
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {aggregated.resources.videos.length > 0 && (
            <>
              <GroupHeader title="Videos" icon={<Video size={12}/>} />
              {aggregated.resources.videos.map((r, i) => <ItemRow key={i} item={r} onClick={()=>onAttach(r)} icon="📺" />)}
            </>
          )}
          {aggregated.resources.links.length > 0 && (
            <>
              <GroupHeader title="Links" icon={<Link2 size={12}/>} />
              {aggregated.resources.links.map((r, i) => <ItemRow key={i} item={r} onClick={()=>onAttach(r)} icon="🔗" />)}
            </>
          )}
          {aggregated.resources.files.length > 0 && (
            <>
              <GroupHeader title="Files" icon={<FileText size={12}/>} />
              {aggregated.resources.files.map((r, i) => <ItemRow key={i} item={r} onClick={()=>onAttach(r)} icon="📄" />)}
            </>
          )}
          {aggregated.resources.knowledge.length > 0 && (
            <>
              <GroupHeader title="Knowledge" icon={<Library size={12}/>} />
              {aggregated.resources.knowledge.map((r, i) => <ItemRow key={i} item={r} onClick={()=>onAttach(r)} icon="💡" />)}
            </>
          )}
        </div>
      );
    }

    if (activeTab === 'roadmap') {
      const hasAny = Object.values(aggregated.roadmap).some(arr => arr.length > 0);
      if (!hasAny) return <div style={{ fontSize:11, color:sub, textAlign:'center', padding:20 }}>Roadmap data missing</div>;

      return (
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {aggregated.roadmap.paths.length > 0 && (
            <>
              <GroupHeader title="Roadmaps" icon={<Layers size={12}/>} />
              {aggregated.roadmap.paths.map((rm, i) => <ItemRow key={i} item={rm} onClick={()=>onAttach(rm)} icon="🗺️" />)}
            </>
          )}
          {aggregated.roadmap.nodes.length > 0 && (
            <>
              <GroupHeader title="Nodes (Topics)" icon={<BookOpen size={12}/>} />
              {aggregated.roadmap.nodes.map((rm, i) => <ItemRow key={i} item={rm} onClick={()=>onAttach(rm)} icon="🎯" subTitle={rm.pathId} />)}
            </>
          )}
          {aggregated.roadmap.subtopics.length > 0 && (
            <>
              <GroupHeader title="Subtopics" icon={<ChevronRight size={12}/>} />
              {aggregated.roadmap.subtopics.map((rm, i) => <ItemRow key={i} item={rm} onClick={()=>onAttach(rm)} icon="📍" subTitle={rm.pathId} />)}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position:'absolute', bottom:'115%', left:'50%', transform:'translateX(-50%)', zIndex:1100, background:bg, border:`1px solid ${border}`, borderRadius:20, padding:16, boxShadow:'0 25px 60px rgba(0,0,0,0.6)', width:360 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <span style={{ fontSize:10, fontWeight:900, color:sub, letterSpacing:'0.1em' }}>ATTACH RESOURCE</span>
        <button onClick={onClose} style={{ background:'transparent', border:'none', color:sub, cursor:'pointer' }}><X size={14}/></button>
      </div>
      <div style={{ display:'flex', background:darkMode?'rgba(255,255,255,0.05)':'#f3f4f6', borderRadius:10, padding:4, marginBottom:12 }}>
        {['notes', 'resources', 'roadmap'].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} 
            style={{ 
              flex:1, border:'none', borderRadius:7, padding:'8px 0', 
              background:activeTab===tab?accent:'transparent', 
              color:activeTab===tab?'#fff':sub, 
              fontSize:10, fontWeight:800, cursor:'pointer', transition:'all .2s' 
            }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ maxHeight:320, overflowY:'auto', paddingRight:4 }}>
        {renderList()}
      </div>
    </div>
  );
}

// ── Node Formatting Toolbar (Floating above node) ──
function NodeFormatBar({ node, onUpdate, onDelete, onStartLink, onAddSticky, isLinking, darkMode, position, notes, history, pathsData }) {
  if (!node) return null;
  const dark = darkMode;
  const bg   = dark ? 'rgba(24, 24, 31, 0.95)' : 'rgba(26, 26, 26, 0.95)';
  const txt  = '#ffffff';
  const sep  = 'rgba(255,255,255,0.15)';

  const themes = dark ? NODE_THEMES_DARK : NODE_THEMES;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker,  setShowSizePicker]  = useState(false);
  const [showFontPicker,  setShowFontPicker]  = useState(false);
  const [showUrlInput,    setShowUrlInput]    = useState(false);
  const [showAttach,      setShowAttach]      = useState(false);
  const [urlInput,        setUrlInput]        = useState(node.url || '');
  
  const cpRef = useRef(null);
  const spRef = useRef(null);
  const fpRef = useRef(null);
  const urlRef = useRef(null);
  const atRef = useRef(null);

  useEffect(() => {
    const h = e => {
      if (!cpRef.current?.contains(e.target)) setShowColorPicker(false);
      if (!spRef.current?.contains(e.target)) setShowSizePicker(false);
      if (!fpRef.current?.contains(e.target)) setShowFontPicker(false);
      if (!urlRef.current?.contains(e.target)) setShowUrlInput(false);
      if (!atRef.current?.contains(e.target)) setShowAttach(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setUrlInput(node.url || ''); }, [node.id, node.url]);

  const curTheme = themes[node.themeIdx ?? 0] || themes[0];
  const curSize  = FONT_SIZES.find(s => s.value === (node.fontSize||13)) || FONT_SIZES[1];
  const curFont  = FONT_FAMILIES.find(f => f.value === (node.fontFamily||FONT_FAMILIES[0].value)) || FONT_FAMILIES[0];

  const Btn = ({ icon, title, active, onClick, style={}, danger, pulse }) => (
    <button onClick={onClick} title={title}
      style={{
        background: active ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
        border:'none', cursor:'pointer', color: active?'#818cf8': (danger ? '#f87171' : 'rgba(255,255,255,0.85)'),
        display:'flex', alignItems:'center', justifyContent:'center',
        width:32, height:32, borderRadius:8,
        transition:'all .15s ease', 
        animation: pulse ? 'mup-pulse 1.5s infinite' : 'none',
        ...style,
      }}
      onMouseEnter={e=>{
        if(!active) e.currentTarget.style.background='rgba(255,255,255,0.1)';
      }}
      onMouseLeave={e=>{
        if(!active) e.currentTarget.style.background='transparent';
      }}>
      {icon}
    </button>
  );

  const Divider = () => <div style={{ width:1, height:18, background:sep, margin:'0 4px', flexShrink:0, opacity:0.5 }}/>;

  return (
    <motion.div
      initial={{ opacity:0, y:10, scale:0.95 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, scale:0.95 }}
      style={{
        position:'absolute',
        top: position.y - 56,
        left: position.x,
        transform: 'translateX(-50%)',
        display:'flex', alignItems:'center', gap:2,
        padding:'0 8px', height:44,
        background:bg,
        backdropFilter:'blur(12px)',
        borderRadius:12,
        border:`1px solid ${dark?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.2)'}`,
        boxShadow:'0 10px 30px -5px rgba(0,0,0,0.5), 0 4px 12px -2px rgba(0,0,0,0.3)',
        zIndex:1000,
        pointerEvents:'auto',
        overflow:'visible',
      }}>
      {/* Group 1: Theme */}
      <div ref={cpRef} style={{ position:'relative' }}>
        <Btn icon={<Palette size={16}/>} title="Node Color" onClick={()=>setShowColorPicker(!showColorPicker)} active={showColorPicker}/>
        {showColorPicker && (
          <div style={{ position:'absolute', bottom:'115%', left:0, zIndex:1001, background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:14, boxShadow:'0 15px 40px rgba(0,0,0,0.6)', minWidth:210 }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:1, marginBottom:10, fontWeight:800, textTransform:'uppercase' }}>Presets</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {themes.map((t,idx)=>(
                <div key={idx} onClick={()=>{onUpdate({...node,themeIdx:idx});setShowColorPicker(false);}}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer', padding:'6px 2px', borderRadius:10,
                    background:node.themeIdx===idx?'rgba(99,102,241,0.15)':'transparent', transition:'all .2s' }}>
                  <div style={{ width:30, height:30, borderRadius:9, background:t.bg, border:`2px solid ${node.themeIdx===idx?'#6366f1':t.border}`, boxShadow:node.themeIdx===idx?'0 0 0 2px rgba(99,102,241,0.3)':'none' }}/>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', fontWeight:600 }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Divider/>

      {/* Group 2: Typography */}
      <div style={{ display:'flex', alignItems:'center', gap:0 }}>
        <div ref={fpRef} style={{ position:'relative' }}>
          <button onClick={()=>setShowFontPicker(!showFontPicker)}
            style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:3, padding:'0 8px', height:32, borderRadius:8, transition:'all .2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <span style={{ fontFamily:curFont.value, fontSize:15 }}>{curFont.label}</span>
            <ChevronDown size={11} opacity={0.5}/>
          </button>
          {showFontPicker && (
            <div style={{ position:'absolute', bottom:'115%', left:0, zIndex:1001, background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, overflow:'hidden', minWidth:130, boxShadow:'0 15px 40px rgba(0,0,0,0.6)' }}>
              {FONT_FAMILIES.map(f => (
                <div key={f.value} onClick={()=>{onUpdate({...node,fontFamily:f.value});setShowFontPicker(false);}}
                  style={{ padding:'10px 16px', cursor:'pointer', fontSize:13, color: node.fontFamily===f.value?'#818cf8':'rgba(255,255,255,0.8)',
                    fontWeight: node.fontFamily===f.value?700:500, fontFamily:f.value, background:node.fontFamily===f.value?'rgba(99,102,241,0.1)':'transparent', transition:'all .15s' }}>
                  {f.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={spRef} style={{ position:'relative' }}>
          <button onClick={()=>{setShowSizePicker(p=>!p);setShowColorPicker(false);}}
            style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:3, padding:'0 8px', height:32, borderRadius:8, transition:'all .2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            {curSize.label} <ChevronDown size={11} opacity={0.5}/>
          </button>
          {showSizePicker && (
            <div style={{ position:'absolute', bottom:'115%', left:0, zIndex:1001, background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, overflow:'hidden', minWidth:130, boxShadow:'0 15px 40px rgba(0,0,0,0.6)' }}>
              {FONT_SIZES.map(s => (
                <div key={s.value} onClick={()=>{onUpdate({...node,fontSize:s.value});setShowSizePicker(false);}}
                  style={{ padding:'10px 16px', cursor:'pointer', fontSize:13, color: node.fontSize===s.value?'#818cf8':'rgba(255,255,255,0.8)',
                    fontWeight: node.fontSize===s.value?700:500, background:node.fontSize===s.value?'rgba(99,102,241,0.1)':'transparent', transition:'all .15s' }}
                  onMouseEnter={e=>{if(node.fontSize!==s.value) e.currentTarget.style.background='rgba(255,255,255,0.06)'}}
                  onMouseLeave={e=>{if(node.fontSize!==s.value) e.currentTarget.style.background='transparent'}}>
                  {s.label} <span style={{ float:'right', fontSize:10, opacity:0.4 }}>{s.value}px</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Divider/>

      {/* Group 3: Shape */}
      <button onClick={()=>{
        let nextR = 10;
        if(node.borderRadius === 10) nextR = 26;
        else if(node.borderRadius === 26) nextR = 0;
        onUpdate({...node, borderRadius: nextR});
      }}
        style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', gap:3, padding:'0 8px', height:32, borderRadius:8, transition:'all .2s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <div style={{ width:16, height:16, border:'1.5px solid currentColor', borderRadius:node.borderRadius===26?8: (node.borderRadius===10?4:0) }}/>
        <ChevronDown size={11} opacity={0.5}/>
      </button>

      <Divider/>

      {/* Group 4: Formatting */}
      <div style={{ display:'flex', gap:1 }}>
        <Btn icon={<Bold size={15}/>} title="Bold" active={node.bold} onClick={()=>onUpdate({...node,bold:!node.bold})}/>
        <Btn icon={<Italic size={15}/>} title="Italic" active={node.italic} onClick={()=>onUpdate({...node,italic:!node.italic})}/>
        <Btn icon={<Underline size={15}/>} title="Underline" active={node.underline} onClick={()=>onUpdate({...node,underline:!node.underline})}/>
      </div>

      <Divider/>
      
      {/* Group 5: Alignment */}
      <div style={{ display:'flex', gap:1 }}>
        <Btn icon={<AlignLeft size={15}/>} title="Align Left" active={node.align==='left'} onClick={()=>onUpdate({...node,align:'left'})}/>
        <Btn icon={<AlignCenter size={15}/>} title="Align Center" active={node.align==='center'} onClick={()=>onUpdate({...node,align:'center'})}/>
        <Btn icon={<AlignRight size={15}/>} title="Align Right" active={node.align==='right'} onClick={()=>onUpdate({...node,align:'right'})}/>
      </div>

      <Divider/>

      {/* Group 6: Actions (Reference Link & External URL) */}
      <div style={{ display:'flex', gap:1 }}>
        <Btn icon={<Link2 size={15}/>} title="Reference Link (Node-to-Node)" active={isLinking} onClick={onStartLink} pulse={isLinking} style={{ color: isLinking ? '#10b981' : 'rgba(255,255,255,0.85)' }} />
        
        <div ref={urlRef} style={{ position:'relative' }}>
          <Btn icon={<LinkIcon size={15}/>} title="Embed Link (URL/HTML)" active={!!node.url} onClick={()=>setShowUrlInput(!showUrlInput)} />
          {showUrlInput && (
            <div style={{ position:'absolute', bottom:'115%', left:'50%', transform:'translateX(-50%)', zIndex:1001, background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:12, minWidth:220, boxShadow:'0 15px 40px rgba(0,0,0,0.6)' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', fontWeight:700, marginBottom:8, letterSpacing:0.5 }}>EMBED EXTERNAL RESOURCE</div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="https://..."
                  style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'#fff', fontSize:12, outline:'none' }}
                  onKeyDown={e=>{ if(e.key==='Enter') { onUpdate({...node, url:urlInput}); setShowUrlInput(false); } }}/>
                <button onClick={()=>{ onUpdate({...node, url:urlInput}); setShowUrlInput(false); }}
                  style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:6, padding:'0 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>SET</button>
              </div>
            </div>
          )}
        </div>

        <Btn icon={<StickyNote size={15}/>} title="Add Sticky Note" onClick={onAddSticky} />
        
        <div ref={atRef} style={{ position:'relative' }}>
          <Btn icon={<Paperclip size={15}/>} title="Attach Resources" onClick={()=>setShowAttach(!showAttach)} active={showAttach}/>
          {showAttach && (
            <AttachmentPicker 
              notes={notes} history={history} pathsData={pathsData}
              darkMode={darkMode} onClose={()=>setShowAttach(false)}
              onAttach={(att) => {
                const existing = node.attachments || [];
                if (!existing.find(a => a.id === att.id)) {
                  onUpdate({...node, attachments: [...existing, att]});
                }
                setShowAttach(false);
              }}
            />
          )}
        </div>

        <Btn icon={<Trash2 size={16}/>} title="Delete" onClick={onDelete} danger/>
      </div>
    </motion.div>
  );
}

// ── MapNode ───────────────────────────────────────────────────
function MapNode({ 
  node, selected, editing, isLinking, editText, onDown, onDbl, 
  onEditChange, onEditCommit, allNodes, darkMode, onAddChild, onAddSibling, onJumpToResource
}) {
  const isRoot = !node.parentId;
  const w = nodeW(node);
  const h = nodeH(node);
  const r = node.borderRadius ?? (isRoot ? 26 : 10);

  const rootFill = darkMode ? '#3a3a48' : '#1a1a1a';
  const themes   = darkMode ? NODE_THEMES_DARK : NODE_THEMES;
  const theme    = themes[node.themeIdx ?? 0] || themes[0];
  const kidCount = allNodes.filter(n => n.parentId===node.id).length;
  const ACCENT   = '#6366f1';

  const isSticky = node.type === 'sticky';
  const labelStyle = {
    fontWeight: node.bold ? 700 : (isRoot ? 600 : 500),
    fontStyle:  node.italic ? 'italic' : 'normal',
    fontSize:   node.fontSize || (isRoot ? 14 : 13),
    fontFamily: isSticky ? (darkMode ? 'cursive' : '"Kalam", "Architects Daughter", cursive') : (node.fontFamily || 'Inter, system-ui, sans-serif'),
    textDecoration: node.underline ? 'underline' : 'none',
  };

  const attachments = node.attachments || [];

  return (
    <g transform={`translate(${node.x},${node.y})`}
      onMouseDown={e=>{e.stopPropagation();onDown(node.id,e);}}
      onDoubleClick={e=>{e.stopPropagation();onDbl(node.id);}}
      style={{ cursor:'pointer' }}>

      {/* Selected border */}
      {selected && (
        <rect x={-w/2-3} y={-h/2-3} width={w+6} height={h+6} rx={r+3}
          fill="none" stroke={ACCENT} strokeWidth={2} />
      )}

      {/* Node body */}
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={r}
        fill={isSticky ? (darkMode ? '#3d3000' : '#fef3c7') : (isRoot ? rootFill : theme.bg)}
        stroke={selected ? ACCENT : (isSticky ? (darkMode ? '#7c5800' : '#fcd34d') : (isRoot ? 'none' : theme.border))}
        strokeWidth={selected ? 2 : (isSticky ? 1 : 1.2)} 
        style={{ 
          filter: isSticky ? (darkMode ? 'drop-shadow(2px 6px 12px rgba(0,0,0,0.3))' : 'drop-shadow(2px 6px 12px rgba(0,0,0,0.1))') : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      
      {/* Paper texture overlay for stickies */}
      {isSticky && (
        <rect x={-w/2} y={-h/2} width={w} height={h} rx={r}
          fill="url(#paper-texture)" opacity={0.15} style={{ pointerEvents:'none' }} />
      )}
        
      {isSticky && (
        <path d={`M${w/2-15},${-h/2} L${w/2},${-h/2+15} L${w/2},${-h/2} Z`} 
          fill={darkMode ? '#4d3d00' : '#fde68a'} opacity={0.8} />
      )}

      {/* Label / edit */}
      {editing ? (
        <foreignObject x={-w/2+6} y={-h/2+4} width={w-12} height={h-8}>
          <input autoFocus value={editText}
            onChange={e=>onEditChange(e.target.value)}
            onBlur={onEditCommit}
            onKeyDown={e=>{
              if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();onEditCommit();}
              if(e.key==='Escape') onEditCommit();
            }}
            style={{
              width:'100%', height:'100%', background:'transparent',
              border:'none', outline:'none', textAlign: node.align || 'center', padding:'0 6px',
              color: isRoot ? '#fff' : theme.text,
              ...labelStyle,
            }}/>
        </foreignObject>
      ) : (
        <foreignObject x={-w/2+10} y={-h/2+10} width={w-20} height={h-20} style={{ pointerEvents:'none' }}>
          <div style={{
            width:'100%', height:'100%', display:'flex', 
            alignItems: isSticky ? 'flex-start' : 'center', 
            justifyContent: node.align === 'left' ? 'flex-start' : (node.align === 'right' ? 'flex-end' : 'center'),
            color: isRoot ? '#fff' : (isSticky ? (darkMode ? '#fcd34d' : '#92400e') : theme.text),
            textAlign: node.align || 'center',
            overflow: 'hidden',
            wordBreak: 'break-word',
            ...labelStyle,
          }}>
            {node.label}
          </div>
        </foreignObject>
      )}

      {/* Attachment Badges */}
      {attachments.length > 0 && !editing && (
        <g transform={`translate(${-w/2 + 10}, ${h/2 - 12})`}>
          {attachments.map((att, idx) => (
            <g key={idx} transform={`translate(${idx * 18}, 0)`} 
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onJumpToResource(att); }}
              style={{ cursor: 'pointer' }}>
              <circle r={8} fill={darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'} />
              {att.type === 'note' ? (
                <FileText size={10} x={-5} y={-5} color={darkMode ? '#818cf8' : '#4f46e5'} />
              ) : att.type === 'resource' ? (
                att.subType === 'video' ? <Video size={10} x={-5} y={-5} color="#ef4444" /> :
                att.subType === 'file' ? <FileText size={10} x={-5} y={-5} color="#3b82f6" /> :
                att.subType === 'link' ? <Link2 size={10} x={-5} y={-5} color="#10b981" /> :
                <Library size={10} x={-5} y={-5} color="#8b5cf6" />
              ) : (
                <Layers size={10} x={-5} y={-5} color={darkMode ? '#f59e0b' : '#d97706'} />
              )}
            </g>
          ))}
        </g>
      )}

      {/* External Link Indicator */}
      {node.url && (
        <g transform={`translate(${w/2 - 12}, ${-h/2 + 12})`}
          onClick={e => { e.stopPropagation(); window.open(node.url, '_blank'); }}
          style={{ cursor: 'pointer' }}>
          <circle r={8} fill="#6366f1" />
          <LinkIcon size={10} color="#fff" x={-5} y={-5} />
        </g>
      )}

      {/* Collapse badge */}
      {node.collapsed && kidCount>0 && (
        <>
          <circle cx={w/2+2} cy={0} r={9} fill={darkMode?'#4a4a60':'#e5e7eb'} stroke={darkMode?'#6a6a80':'#d1d5db'} strokeWidth={1}/>
          <text x={w/2+2} y={1} textAnchor="middle" dominantBaseline="middle" fill={darkMode?'#d1d5db':'#374151'} fontSize={9} fontWeight={700} style={{ pointerEvents:'none' }}>{kidCount}</text>
        </>
      )}

      {/* ── Selected quick buttons ── */}
      {selected && !editing && (
        <>
          {/* LEFT + = add sibling */}
          {node.parentId && (
            <g transform={`translate(${-w/2-22},0)`}
              onMouseDown={e=>e.stopPropagation()}
              onClick={e=>{e.stopPropagation();onAddSibling(node.id);}}>
              <circle cx={0} cy={0} r={16} fill={ACCENT}
                style={{ cursor:'pointer', filter:'drop-shadow(0 2px 6px rgba(99,102,241,0.4))' }}/>
              <line x1={-7} y1={0} x2={7} y2={0} stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
              <line x1={0} y1={-7} x2={0} y2={7} stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
            </g>
          )}

          {/* RIGHT + = add child */}
          <g transform={`translate(${w/2+22},0)`}
            onMouseDown={e=>e.stopPropagation()}
            onClick={e=>{e.stopPropagation();onAddChild(node.id);}}>
            <circle cx={0} cy={0} r={16} fill={ACCENT}
              style={{ cursor:'pointer', filter:'drop-shadow(0 2px 6px rgba(99,102,241,0.4))' }}/>
            <line x1={-7} y1={0} x2={7} y2={0} stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
            <line x1={0} y1={-7} x2={0} y2={7} stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
          </g>

          {/* BOTTOM-RIGHT small circle */}
          <circle cx={w/2} cy={h/2} r={7}
            fill={darkMode?'#1e1e28':'#ffffff'}
            stroke={ACCENT} strokeWidth={1.5}
            style={{ cursor:'pointer' }}/>
        </>
      )}

      {/* Linking indicator pulse */}
      {(selected || isLinking) && (
        <rect x={-w/2-4} y={-h/2-4} width={w+8} height={h+8} rx={r+4}
          fill="none" stroke="#10b981" strokeWidth={2} opacity={0.6}
          style={{ pointerEvents:'none', animation: 'node-linking-pulse 1.5s infinite' }} />
      )}
    </g>
  );
}

// ── Context Menu ──────────────────────────────────────────────
function CtxMenu({ x, y, node, onClose, actions, allNodes, darkMode }) {
  const ref = useRef(null);
  const bg  = darkMode?'#1e1e28':'#ffffff';
  const sep = darkMode?'rgba(255,255,255,0.07)':'#f3f4f6';

  useEffect(()=>{
    const h=e=>{ if(!ref.current?.contains(e.target)) onClose(); };
    setTimeout(()=>window.addEventListener('mousedown',h),0);
    return ()=>window.removeEventListener('mousedown',h);
  },[onClose]);

  if (!node) {
    return (
      <div ref={ref} style={{ position:'fixed', top:y, left:x, zIndex:9999,
        background:bg, border:`1px solid ${darkMode?'rgba(255,255,255,0.1)':'#e5e7eb'}`,
        borderRadius:12, minWidth:210, overflow:'hidden',
        boxShadow:darkMode?'0 12px 40px rgba(0,0,0,0.6)':'0 8px 30px rgba(0,0,0,0.12)',
        padding:'6px 0' }}>
        <CM icon={<Plus size={13}/>}   label="New Main Topic" onClick={()=>{actions.addMainNode();onClose();}} dark={darkMode}/>
        <CM icon={<StickyNote size={13}/>} label="Add Sticky Note" onClick={()=>{actions.addSticky(null);onClose();}} dark={darkMode}/>
      </div>
    );
  }

  const hasKids = allNodes.some(n=>n.parentId===node.id);

  return (
    <div ref={ref} style={{ position:'fixed', top:y, left:x, zIndex:9999,
      background:bg, border:`1px solid ${darkMode?'rgba(255,255,255,0.1)':'#e5e7eb'}`,
      borderRadius:10, minWidth:196, overflow:'hidden',
      boxShadow:darkMode?'0 12px 40px rgba(0,0,0,0.6)':'0 8px 30px rgba(0,0,0,0.12)',
      fontFamily:'system-ui,-apple-system,sans-serif' }}>
      <CM icon={<Plus size={13}/>}   label="Add child"   hint="Tab"   onClick={()=>{actions.addChild(node.id);onClose();}} dark={darkMode}/>
      <CM icon={<Plus size={13}/>}   label="Add sibling" hint="Enter" onClick={()=>{actions.addSibling(node.id);onClose();}} dark={darkMode} disabled={!node.parentId}/>
      <CM icon={<Edit2 size={13}/>}  label="Rename"      hint="Space" onClick={()=>{actions.edit(node.id);onClose();}} dark={darkMode}/>
      <CM icon={<Copy size={13}/>}   label="Duplicate"              onClick={()=>{actions.duplicate(node.id);onClose();}} dark={darkMode}/>
      <CM icon={<Link2 size={13}/>}   label="Reference Link"         onClick={()=>{actions.startLink(node.id);onClose();}} dark={darkMode}/>
      {hasKids && <CM
        icon={node.collapsed?<ChevronDown size={13}/>:<ChevronUp size={13}/>}
        label={node.collapsed?'Expand':'Collapse'}
        onClick={()=>{actions.collapse(node.id);onClose();}} dark={darkMode}/>}
      {node.id!=='root' && (
        <>
          <div style={{ borderTop:`1px solid ${sep}`, margin:'4px 0' }}/>
          <CM icon={<Trash size={13}/>} label="Delete" hint="Del" onClick={()=>{actions.del(node.id);onClose();}} dark={darkMode} danger/>
        </>
      )}
    </div>
  );
}

function CM({ icon, label, hint, onClick, dark, danger, disabled }) {
  const [h,sH]=useState(false);
  if(disabled) return null;
  return (
    <div onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', cursor:'pointer',
        background:h?(dark?'rgba(255,255,255,0.05)':'#f9fafb'):'transparent',
        color:danger?(h?'#dc2626':'#ef4444'):(dark?(h?'#fff':'rgba(255,255,255,0.75)'):(h?'#111827':'#374151')),
        fontSize:13, fontWeight:500, transition:'all .1s' }}>
      <span style={{ opacity:0.6 }}>{icon}</span>
      <span style={{ flex:1 }}>{label}</span>
      {hint&&<span style={{ fontSize:11, opacity:0.3, fontFamily:'monospace' }}>{hint}</span>}
    </div>
  );
}

// ── Toolbar helpers ───────────────────────────────────────────
function TBar({ children, darkMode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, padding:'0 12px', height:44,
      borderBottom:`1px solid ${darkMode?'rgba(255,255,255,0.07)':'#e5e7eb'}`,
      background:darkMode?'#18181f':'#ffffff', flexShrink:0 }}>
      {children}
    </div>
  );
}

function TBtn({ icon, label, title, onClick, disabled, accent, danger, darkMode }) {
  const [h,sH]=useState(false);
  const base=darkMode?'rgba(255,255,255,0.65)':'#374151';
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{ display:'flex', alignItems:'center', gap:5, padding:label?'4px 10px':'4px 7px', height:30,
        background:h&&!disabled?(accent?'rgba(99,102,241,0.08)':danger?'rgba(220,38,38,0.06)':(darkMode?'rgba(255,255,255,0.05)':'#f3f4f6')):'transparent',
        border:`1px solid ${h&&!disabled?(accent?'rgba(99,102,241,0.3)':danger?'rgba(220,38,38,0.2)':(darkMode?'rgba(255,255,255,0.12)':'#e5e7eb')):'transparent'}`,
        borderRadius:7, cursor:disabled?'not-allowed':'pointer',
        color:disabled?(darkMode?'rgba(255,255,255,0.18)':'#d1d5db'):accent?'#6366f1':danger?'#ef4444':base,
        fontSize:12, fontWeight:500, fontFamily:'system-ui,-apple-system,sans-serif', transition:'all .1s', flexShrink:0 }}>
      {icon}{label&&<span>{label}</span>}
    </button>
  );
}

function TSep({ darkMode }) { return <div style={{ width:1, height:18, background:darkMode?'rgba(255,255,255,0.08)':'#e5e7eb', margin:'0 4px' }}/>; }

// ── Minimap ──────────────────────────────────────────────────
function Minimap({ nodes, zoom, pan, containerRect, darkMode }) {
  if (!containerRect || !nodes.length) return null;
  const padding = 10;
  const rects = nodes.map(n => ({ x: n.x, y: n.y, w: nodeW(n), h: nodeH(n) }));
  const minX = Math.min(...rects.map(r => r.x - r.w/2));
  const maxX = Math.max(...rects.map(r => r.x + r.w/2));
  const minY = Math.min(...rects.map(r => r.y - r.h/2));
  const maxY = Math.max(...rects.map(r => r.y + r.h/2));
  
  const contentW = maxX - minX;
  const contentH = maxY - minY;
  const mmW = 180;
  const mmH = (contentH / contentW) * mmW || 120;
  const scale = (mmW - padding * 2) / contentW;
  
  // Viewport rect
  const vwX = (-pan.x / zoom - minX) * scale + padding;
  const vwY = (-pan.y / zoom - minY) * scale + padding;
  const vwW = (containerRect.width / zoom) * scale;
  const vwH = (containerRect.height / zoom) * scale;

  const bg = darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const nodeFill = darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';

  return (
    <div style={{ position:'absolute', bottom:16, left:16, width:mmW, height:mmH, background:bg, border:`1px solid ${darkMode?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}`, borderRadius:12, overflow:'hidden', pointerEvents:'none', zIndex:950, backdropFilter:'blur(8px)' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${mmW} ${mmH}`}>
        {nodes.map(n => (
          <rect key={n.id} 
            x={(n.x - nodeW(n)/2 - minX) * scale + padding} 
            y={(n.y - nodeH(n)/2 - minY) * scale + padding} 
            width={nodeW(n) * scale} height={nodeH(n) * scale} 
            fill={nodeFill} rx={2} />
        ))}
        <rect x={vwX} y={vwY} width={vwW} height={vwH} fill="none" stroke="#6366f1" strokeWidth={1.5} rx={2} />
      </svg>
    </div>
  );
}

// ── Mind Map Canvas ───────────────────────────────────────────
function MindMapCanvas({ mapData, onUpdate, notes, history, pathsData, onJumpToResource }) {
  const [mapTheme, setMapTheme] = useState(isDark() ? 'dark' : 'light');
  const darkMode = mapTheme === 'dark';
  
  const [nodes,   setNodes]   = useState(()=>mapData?.nodes||makeStarterMap());
  const [links,   setLinks]   = useState(()=>mapData?.links||[]);
  const [zoom,    setZoom]    = useState(mapData?.zoom||1);
  const [pan,     setPan]     = useState(mapData?.pan||{x:0,y:0});
  const [selId,   setSelId]   = useState('root');
  const [editId,  setEditId]  = useState(null);
  const [editTxt, setEditTxt] = useState('');
  const [ctx,     setCtx]     = useState(null);
  const [drag,    setDrag]    = useState(null);
  const [panS,    setPanS]    = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [linkingId, setLinkingId] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const saveToHistory = useCallback(() => {
    setHistoryStack(prev => [...prev.slice(-19), { nodes, links, zoom, pan }]);
    setRedoStack([]);
  }, [nodes, links, zoom, pan]);

  const onUndo = useCallback(() => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setRedoStack(r => [...r, { nodes, links, zoom, pan }]);
    setHistoryStack(h => h.slice(0, -1));
    setNodes(prev.nodes);
    setLinks(prev.links);
    setZoom(prev.zoom);
    setPan(prev.pan);
  }, [historyStack, nodes, links, zoom, pan]);

  const onRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(h => [...h, { nodes, links, zoom, pan }]);
    setRedoStack(r => r.slice(0, -1));
    setNodes(next.nodes);
    setLinks(next.links);
    setZoom(next.zoom);
    setPan(next.pan);
  }, [redoStack, nodes, links, zoom, pan]);

  const onZoomFit = useCallback(() => {
    if (!nodes.length) return;
    const padding = 60;
    const rects = nodes.map(n => {
      const w = nodeW(n);
      const h = nodeH(n);
      return { x1: n.x - w/2, y1: n.y - h/2, x2: n.x + w/2, y2: n.y + h/2 };
    });
    const minX = Math.min(...rects.map(r => r.x1));
    const maxX = Math.max(...rects.map(r => r.x2));
    const minY = Math.min(...rects.map(r => r.y1));
    const maxY = Math.max(...rects.map(r => r.y2));
    
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    
    const containerW = svgRef.current.clientWidth - padding * 2;
    const containerH = svgRef.current.clientHeight - padding * 2;
    
    const newZoom = Math.min(3, Math.max(0.2, Math.min(containerW / contentW, containerH / contentH)));
    setZoom(newZoom);
    setPan({
      x: svgRef.current.clientWidth / 2 - (minX + contentW / 2) * newZoom,
      y: svgRef.current.clientHeight / 2 - (minY + contentH / 2) * newZoom
    });
  }, [nodes]);

  useEffect(()=>{ onUpdate?.({nodes,links,zoom,pan}); },[nodes,links,zoom,pan]);
  // No longer needed: selection and state are handled by remounting via 'key' prop in parent
  // and local state preservation during same-map updates.


  const visible = useCallback(()=>{
    const hidden=new Set();
    nodes.forEach(n=>{ if(n.collapsed) getDesc(nodes,n.id).forEach(id=>hidden.add(id)); });
    return nodes.filter(n=>!hidden.has(n.id));
  },[nodes]);

  const toSvg = useCallback((cx,cy)=>{
    const r=svgRef.current?.getBoundingClientRect();
    if(!r) return{x:0,y:0};
    return{x:(cx-r.left-pan.x)/zoom, y:(cy-r.top-pan.y)/zoom};
  },[zoom,pan]);

  const hitNode = useCallback((cx,cy)=>{
    const p=toSvg(cx,cy);
    return [...visible()].reverse().find(n=>{
      const w=!n.parentId?220:nodeW(n); const h=!n.parentId?52:nodeH(n);
      return Math.abs(p.x-n.x)<w/2 && Math.abs(p.y-n.y)<h/2;
    });
  },[visible,toSvg]);

  const onNodeDown=useCallback((id,e)=>{
    if (linkingId) {
      if (linkingId !== id) {
        setLinks(prev => {
          const exists = prev.find(l => (l.from === linkingId && l.to === id) || (l.from === id && l.to === linkingId));
          if (exists) return prev;
          return [...prev, { id: uid(), from: linkingId, to: id }];
        });
      }
      setLinkingId(null);
      return;
    }
    setSelId(id); setCtx(null);
    const node=nodes.find(n=>n.id===id);
    const p=toSvg(e.clientX,e.clientY);
    setDrag({id,ox:p.x-node.x,oy:p.y-node.y});
    saveToHistory(); // Save before move
  },[nodes,toSvg,linkingId,saveToHistory]);

  const onSvgDown=useCallback((e)=>{
    setCtx(null);
    const isCanvas=e.target===svgRef.current||e.target.tagName==='rect';
    if(isCanvas){setSelId(null);setEditId(null);setPanS({sx:e.clientX,sy:e.clientY,sp:{...pan}});}
  },[pan]);

  const onMouseMove=useCallback((e)=>{
    if(drag){const p=toSvg(e.clientX,e.clientY);setNodes(prev=>prev.map(n=>n.id===drag.id?{...n,x:p.x-drag.ox,y:p.y-drag.oy}:n));}
    else if(panS){setPan({x:panS.sp.x+e.clientX-panS.sx,y:panS.sp.y+e.clientY-panS.sy});}
  },[drag,panS,toSvg]);

  const onMouseUp=useCallback(()=>{setDrag(null);setPanS(null);},[]);

  const onWheel=useCallback((e)=>{
    e.preventDefault();
    setZoom(z=>Math.min(3,Math.max(0.15,z*(e.deltaY>0?0.9:1.1))));
  },[]);

  const onCtxMenu=useCallback((e)=>{
    e.preventDefault();
    const hit=hitNode(e.clientX,e.clientY);
    if(hit){
      setSelId(hit.id);
      setCtx({x:e.clientX,y:e.clientY,node:hit});
    } else {
      setSelId(null);
      setCtx({x:e.clientX,y:e.clientY,node:null});
    }
  },[hitNode]);

  const onNodeDbl=useCallback((id)=>{
    const n=nodes.find(x=>x.id===id);
    setEditId(id); setEditTxt(n?.label||'');
  },[nodes]);

  const commitEdit=useCallback(()=>{
    if(!editId) return;
    saveToHistory();
    setNodes(prev=>prev.map(n=>n.id===editId?{...n,label:editTxt.trim()||n.label}:n));
    setEditId(null);
  },[editId,editTxt,saveToHistory]);

  const addMainNode = useCallback(() => {
    saveToHistory();
    const nn = { 
      id: uid(), 
      label: 'Main Topic', 
      parentId: null, 
      themeIdx: 0, 
      fontSize: 14, 
      bold: true, 
      italic: false, 
      underline: false, 
      align: 'center', 
      borderRadius: 26, 
      note: '', 
      collapsed: false, 
      attachments: [],
      x: 0, 
      y: 0 
    };
    const updated = autoLayout([...nodes, nn]);
    setNodes(updated);
    setSelId(nn.id);
    setTimeout(() => { setEditId(nn.id); setEditTxt(''); }, 60);
  }, [nodes, saveToHistory]);

  const addSticky = useCallback((parentId = selId) => {
    if (!parentId) return;
    saveToHistory();
    const nn = {
      ...makeNode('Sticky Note', parentId, 1),
      type: 'sticky',
      fontSize: 14,
      fontFamily: 'cursive',
      attachments: []
    };
    const updated = autoLayout([...nodes, nn]);
    setNodes(updated);
    setSelId(nn.id);
    setTimeout(() => { setEditId(nn.id); setEditTxt(''); }, 60);
  }, [selId, nodes, saveToHistory]);

  const addChild=useCallback((parentId=selId)=>{
    if(!parentId) return;
    saveToHistory();
    const parent=nodes.find(n=>n.id===parentId);
    const nn=makeNode('node',parentId,parent?.themeIdx||0);
    nn.fontSize=parent?.fontSize||13;
    const updated=autoLayout([...nodes,nn]);
    setNodes(updated); setSelId(nn.id);
    setTimeout(()=>{setEditId(nn.id);setEditTxt('');},60);
  },[selId,nodes,saveToHistory]);

  const addSibling=useCallback((id=selId)=>{
    if(!id) return;
    const node=nodes.find(n=>n.id===id);
    if(!node?.parentId) return;
    saveToHistory();
    const parent=nodes.find(n=>n.id===node.parentId);
    const nn=makeNode('node',node.parentId,parent?.themeIdx||0);
    nn.fontSize=node?.fontSize||13;
    const updated=autoLayout([...nodes,nn]);
    setNodes(updated); setSelId(nn.id);
    setTimeout(()=>{setEditId(nn.id);setEditTxt('');},60);
  },[selId,nodes,saveToHistory]);

  const delNode=useCallback((id=selId)=>{
    if(!id||id==='root') return;
    saveToHistory();
    const rm=new Set([id,...getDesc(nodes,id)]);
    setNodes(prev=>autoLayout(prev.filter(n=>!rm.has(n.id))));
    setLinks(prev=>prev.filter(l=>!rm.has(l.from)&&!rm.has(l.to)));
    setSelId(null);
  },[selId,nodes,saveToHistory]);

  const collapse=useCallback((id)=>setNodes(prev=>prev.map(n=>n.id===id?{...n,collapsed:!n.collapsed}:n)),[]);
  const duplicate=useCallback((id)=>{
    const n=nodes.find(x=>x.id===id); if(!n?.parentId) return;
    const copy={...n,id:uid()};
    setNodes(prev=>autoLayout([...prev,copy])); setSelId(copy.id);
  },[nodes]);

  const updateNode=useCallback((updated)=>{
    saveToHistory();
    setNodes(prev=>autoLayout(prev.map(n=>n.id===updated.id?updated:n)));
  },[saveToHistory]);

  const reLayout=useCallback(()=>setNodes(prev=>autoLayout(prev)),[]);
  const resetView=useCallback(()=>{setZoom(1);setPan({x:0,y:0});},[]);

  const exportSVG=useCallback(()=>{
    const el=svgRef.current; if(!el) return;
    const blob=new Blob([el.outerHTML],{type:'image/svg+xml'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mindmap.svg'; a.click();
  },[]);

  useEffect(()=>{
    const h=e=>{
      if(editId) return;
      const tag=document.activeElement?.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA') return;
      if(e.key==='Tab'){e.preventDefault();addChild(selId);}
      if(e.key==='Enter'){e.preventDefault();addSibling(selId);}
      if(e.key===' '){e.preventDefault();if(selId)onNodeDbl(selId);else resetView();}
      if((e.key==='Delete'||e.key==='Backspace')&&selId)delNode(selId);
      if(e.key==='F2'&&selId)onNodeDbl(selId);
      if((e.metaKey||e.ctrlKey)&&e.key==='z'){e.preventDefault();onUndo();}
      if((e.metaKey||e.ctrlKey)&&e.key==='y'){e.preventDefault();onRedo();}
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  },[editId,selId,addChild,addSibling,onNodeDbl,delNode,resetView,onUndo,onRedo]);

  const vis=visible();
  const selNode=nodes.find(n=>n.id===selId);
  const canvasBg=darkMode?'#0f0f15':'#f8f9fc';
  const dotColor=darkMode?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.08)';
  const ctxActions={
    addChild, addSibling, edit:onNodeDbl, duplicate, collapse, del:delNode, 
    addMainNode, addSticky, startLink: (id) => setLinkingId(id)
  };

  const containerRect = svgRef.current?.getBoundingClientRect();

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>

      {/* ── Top Bar (Navigation & General Tools) ── */}
      <TBar darkMode={darkMode}>
        <TBtn icon={<Plus size={14}/>} label="New Main Node" onClick={addMainNode} accent darkMode={darkMode}/>
        <TSep darkMode={darkMode}/>
        <TBtn icon={<AlignCenter size={14}/>} label="Auto Layout" onClick={reLayout} darkMode={darkMode}/>
        <TBtn icon={<RotateCcw size={14}/>}   label="Reset View"  onClick={resetView} darkMode={darkMode}/>
        <TSep darkMode={darkMode}/>
        <TBtn icon={<Minus size={14}/>}       onClick={()=>setZoom(z=>Math.max(0.15,z/1.2))} darkMode={darkMode}/>
        <div style={{ fontSize:11, fontWeight:700, color:darkMode?'rgba(255,255,255,0.3)':'#6b7280', minWidth:44, textAlign:'center', fontFamily:'monospace', letterSpacing:'0.5px' }}>
          {Math.round(zoom*100)}%
        </div>
        <TBtn icon={<ZoomIn size={14}/>}      onClick={()=>setZoom(z=>Math.min(3,z*1.2))} darkMode={darkMode}/>
        <div style={{flex:1}}/>
        <TBtn icon={darkMode ? <Sun size={14}/> : <Moon size={14}/>} label={darkMode ? "Light Mode" : "Dark Mode"} onClick={() => setMapTheme(darkMode ? 'light' : 'dark')} darkMode={darkMode}/>
        <TSep darkMode={darkMode}/>
        <TBtn icon={<Download size={14}/>} label="Export SVG" onClick={exportSVG} darkMode={darkMode}/>
        <TSep darkMode={darkMode}/>
        <TBtn icon={<Settings size={14}/>} label="Help" onClick={()=>setShowTip(t=>!t)} darkMode={darkMode}/>
      </TBar>

      {/* ── Canvas ── */}
      <div style={{ flex:1, overflow:'hidden', position:'relative', background:canvasBg }}>
        {/* Floating Node Toolbar */}
        <AnimatePresence>
          {selNode && (
            <NodeFormatBar
              key="format-bar"
              node={selNode}
              onUpdate={updateNode}
              onDelete={()=>delNode(selId)}
              onStartLink={() => setLinkingId(prev => prev === selId ? null : selId)}
              onAddSticky={() => addSticky(selId)}
              isLinking={linkingId === selId}
              darkMode={darkMode}
              notes={notes}
              history={history}
              pathsData={pathsData}
              position={{
                x: pan.x + selNode.x * zoom,
                y: pan.y + selNode.y * zoom - (nodeH(selNode)/2) * zoom
              }}
            />
          )}
        </AnimatePresence>
        {/* Canvas Controls */}
        <CanvasControls 
          zoom={zoom} 
          onZoomIn={()=>setZoom(z=>Math.min(3,z*1.2))}
          onZoomOut={()=>setZoom(z=>Math.max(0.15,z/1.2))}
          onZoomFit={onZoomFit}
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={historyStack.length > 0}
          canRedo={redoStack.length > 0}
          darkMode={darkMode}
        />

        <svg ref={svgRef} width="100%" height="100%"
          onMouseDown={onSvgDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onWheel={onWheel} onContextMenu={onCtxMenu}
          style={{ display:'block', cursor:panS?'grabbing':'default', userSelect:'none' }}>

          <defs>
            <pattern id="mup-dots" width={22} height={22} patternUnits="userSpaceOnUse"
              x={pan.x%(22*zoom)} y={pan.y%(22*zoom)} patternTransform={`scale(${zoom})`}>
              <circle cx={11} cy={11} r={1} fill={dotColor}/>
            </pattern>
            <pattern id="paper-texture" width="200" height="200" patternUnits="userSpaceOnUse">
              <filter id="n" x="0" y="0">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0.1"/>
              </filter>
              <rect width="200" height="200" filter="url(#n)" opacity="0.08"/>
            </pattern>
            <marker id="mup-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#mup-dots)"
            onMouseDown={e=>{if(e.target===e.currentTarget)onSvgDown(e);}}/>

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* Tree edges */}
            {vis.filter(n=>n.parentId).map(n=>{
              const p=vis.find(x=>x.id===n.parentId);
              return <Edge key={`e${n.id}`} from={p} to={n} darkMode={darkMode}/>;
            })}

            {/* Reference links (Green) */}
            {links.map(l => {
              const fromNode = nodes.find(n => n.id === l.from);
              const toNode = nodes.find(n => n.id === l.to);
              if (!fromNode || !toNode) return null;
              // Only show if both are not hidden by collapse
              if (!vis.find(n => n.id === l.from) || !vis.find(n => n.id === l.to)) return null;
              return (
                <ReferenceLink
                  key={l.id}
                  from={fromNode}
                  to={toNode}
                  darkMode={darkMode}
                  onClick={() => setLinks(prev => prev.filter(x => x.id !== l.id))}
                />
              );
            })}
            {vis.map(n=>(
              <MapNode key={n.id} node={n}
                selected={n.id===selId} editing={n.id===editId}
                isLinking={n.id===linkingId}
                editText={editTxt}
                onDown={onNodeDown} onDbl={onNodeDbl}
                onEditChange={setEditTxt} onEditCommit={commitEdit}
                allNodes={nodes} darkMode={darkMode}
                onAddChild={addChild} onAddSibling={addSibling}
                onJumpToResource={onJumpToResource}
              />
            ))}
          </g>
        </svg>

        <Minimap nodes={nodes} zoom={zoom} pan={pan} containerRect={containerRect} darkMode={darkMode} />

        {showTip && <ShortcutsPanel onClose={()=>setShowTip(false)} darkMode={darkMode}/>}

        {ctx && (
          <CtxMenu x={ctx.x} y={ctx.y} node={ctx.node}
            onClose={()=>setCtx(null)} actions={ctxActions}
            allNodes={nodes} darkMode={darkMode}/>
        )}
      </div>
    </div>
  );
}

// ── Map Tab Manager ───────────────────────────────────────────
function MindMapTab({ notes, history, pathsData, maps: initialMaps=[], onUpdateMaps, onJumpToNode, onSelectNote, setActiveTab, onClose }) {
  const darkMode=isDark();
  const [maps,   setMaps]  = useState(initialMaps.length > 0 ? initialMaps : [{id:'map1',name:'New Map',nodes:makeStarterMap(),zoom:1,pan:{x:0,y:0}}]);
  const [active, setActive]= useState(maps[0]?.id || 'map1');
  const [renId,  setRenId] = useState(null);
  const [renTxt, setRenTxt]= useState('');

  const lastMapsRef = useRef(initialMaps);

  // Auto-sync local state to parent persistence with stability check
  useEffect(() => {
    const mapsString = JSON.stringify(maps);
    const lastString = JSON.stringify(lastMapsRef.current);
    
    if (onUpdateMaps && mapsString !== lastString) {
      lastMapsRef.current = maps;
      onUpdateMaps(maps);
    }
  }, [maps, onUpdateMaps]);

  const activeMap=maps.find(m=>m.id===active);

  const newMap=()=>{
    const id='map_'+uid();
    setMaps(p=>[...p,{id,name:`New Map ${p.length+1}`,nodes:[{id:'root',label:'Hit Space or double-click',parentId:null,themeIdx:0,fontSize:14,bold:false,italic:false,note:'',collapsed:false,x:0,y:0}],zoom:1,pan:{x:0,y:0}}]);
    setActive(id);
  };

  const delMap=(id)=>{
    if(maps.length<=1) return;
    const next=maps.find(m=>m.id!==id);
    setMaps(p=>p.filter(m=>m.id!==id));
    if(active===id) setActive(next?.id);
  };

  const renameMap=(id)=>{
    setMaps(p=>p.map(m=>m.id===id?{...m,name:renTxt.trim()||m.name}:m));
    setRenId(null);
  };

  const updateMap=useCallback((data)=>{
    setMaps(p=>p.map(m=>m.id===active?{...m,...data}:m));
  },[active]);

  const tabBg=darkMode?'#18181f':'#f9fafb';
  const tabT =darkMode?'rgba(255,255,255,0.45)':'#6b7280';
  const tabAT=darkMode?'#e5e7eb':'#111827';
  const tabB =darkMode?'rgba(255,255,255,0.07)':'#e5e7eb';
  const ACC  ='#6366f1';

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', height:36, borderBottom:`1px solid ${tabB}`, background:tabBg, overflowX:'auto', flexShrink:0 }}>
        {maps.map(m=>(
          <div key={m.id} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            {renId===m.id ? (
              <input autoFocus value={renTxt} onChange={e=>setRenTxt(e.target.value)}
                onBlur={()=>renameMap(m.id)}
                onKeyDown={e=>{if(e.key==='Enter')renameMap(m.id);if(e.key==='Escape')setRenId(null);}}
                style={{ background:'transparent', border:'none', borderBottom:`2px solid ${ACC}`, padding:'2px 8px', color:tabAT, fontSize:12, fontFamily:'system-ui', outline:'none', width:110, height:24, margin:'0 2px' }}/>
            ) : (
              <button onClick={()=>setActive(m.id)}
                onDoubleClick={()=>{setRenId(m.id);setRenTxt(m.name);}}
                style={{ padding:'0 14px', height:36, border:'none', cursor:'pointer',
                  borderBottom:`2px solid ${m.id===active?ACC:'transparent'}`,
                  background:'transparent', color:m.id===active?tabAT:tabT,
                  fontSize:12, fontWeight:m.id===active?600:500,
                  fontFamily:'system-ui,-apple-system,sans-serif',
                  display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap', transition:'all .15s' }}>
                {m.name}
                {maps.length>1&&m.id===active&&(
                  <span onClick={e=>{e.stopPropagation();delMap(m.id);}}
                    style={{ opacity:0.3, display:'flex', alignItems:'center', padding:'1px 2px' }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='0.8'}
                    onMouseLeave={e=>e.currentTarget.style.opacity='0.3'}>
                    <X size={11}/>
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
        <button onClick={newMap}
          style={{ padding:'0 10px', height:36, border:'none', cursor:'pointer', background:'transparent', color:tabT,
            fontSize:12, fontFamily:'system-ui', display:'flex', alignItems:'center', gap:4, borderBottom:'2px solid transparent', transition:'color .15s' }}
          onMouseEnter={e=>e.currentTarget.style.color=tabAT}
          onMouseLeave={e=>e.currentTarget.style.color=tabT}>
          <Plus size={12}/> New map
        </button>
        <div style={{flex:1}}/>
        <span style={{ fontSize:10, color:tabT, fontFamily:'system-ui', paddingRight:12, flexShrink:0 }}>Double-click tab to rename</span>
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        {activeMap && (
          <MindMapCanvas 
            key={activeMap.id} 
            mapData={activeMap} 
            onUpdate={updateMap}
            notes={notes}
            history={history}
            pathsData={pathsData}
            onJumpToResource={(att) => {
               if (att.type === 'note' && notes) {
                 const note = notes.find(n => n.id === att.id);
                 if (note) {
                   onSelectNote(note);
                   setActiveTab('notes');
                 }
               } else if (att.type === 'roadmap' || att.type === 'resource') {
                 // Jump to the node/module in the main roadmap view
                 onJumpToNode(att.id, att.pathId);
                 if (onClose) onClose(); // Close the workplace lab to see the roadmap
               }
            }}
            onNodeClick={(nodeId) => {
              if (linkingNote) onAttach(activeMap.id, nodeId);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN WorkplaceLab
// ============================================================
export default function WorkplaceLab({
  history=[], notes=[], maps=[], pathsData={}, onSaveNote, onUpdateNote, onDeleteNote, onUpdateMaps, onJumpToNode, onClose
}) {
  const [activeTab, setActiveTab]=useState('notes');
  const [hoveredTab, setHoveredTab]=useState(null);
  const [searchQuery, setSearchQuery]=useState('');
  const [isCreating, setIsCreating]=useState(false);
  const [newNote, setNewNote]=useState({title:'',content:'',type:'note'});
  const [selectedNote, setSelectedNote]=useState(null);
  const [hubMode, setHubMode]=useState('preview');
  const [linkingNote, setLinkingNote]=useState(null); // For "Attach to Mind Map"


  const filtered=notes.filter(n=>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const snippets=filtered.filter(n=>n.type==='snippet');
  const noteItems=filtered.filter(n=>n.type==='note');

  const handleAttachToNode = (mapId, nodeId) => {
    const map = maps.find(m => m.id === mapId);
    if (!map || !linkingNote) return;

    const newMaps = maps.map(m => {
      if (m.id === mapId) {
        const newNodes = m.nodes.map(node => {
          if (node.id === nodeId) {
            const atts = node.data?.attachments || [];
            if (atts.some(a => a.id === linkingNote.id)) return node;
            return {
              ...node,
              data: {
                ...node.data,
                attachments: [...atts, { id: linkingNote.id, title: linkingNote.title, type: 'note' }]
              }
            };
          }
          return node;
        });
        return { ...m, nodes: newNodes };
      }
      return m;
    });

    onUpdateMaps(newMaps);
    setLinkingNote(null);
  };

  const handleCreate=()=>{
    if(!newNote.title.trim()) return;
    onSaveNote({...newNote,id:Date.now().toString(),timestamp:new Date().toISOString()});
    setNewNote({title:'',content:'',type:'note'}); setIsCreating(false);
  };

  const handleUpdate=(u)=>{onUpdateNote(u);setSelectedNote(u);};

  const fmt=(iso)=>{
    if(!iso) return '';
    return new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  };

  const TABS = [
    { id: 'notes',   label: 'Knowledge Base', icon: <FileText size={14}/> },
    { id: 'history', label: 'History',        icon: <Clock size={14}/> },
    { id: 'mindmap', label: 'Mind Map',       icon: <GitBranch size={14}/> },
  ];

  return (
    <div className="workplace-overlay">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="workplace-container"
      >
        <header className="workplace-header" style={{ 
          height: 80, 
          background: 'rgba(15, 15, 15, 0.4)', 
          backdropFilter: 'blur(30px) saturate(200%)',
          borderBottom: `1px solid rgba(255, 255, 255, 0.08)`, 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 32px', 
          gap: 20, 
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflow: 'hidden'
        }}>
          {/* Dynamic Background Glow */}
          <motion.div
            animate={{
              background: activeTab === 'mindmap' 
                ? 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15), transparent 50%)'
                : activeTab === 'history'
                ? 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15), transparent 50%)'
                : 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15), transparent 50%)'
            }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <motion.div 
              key={activeTab}
              initial={{ scale: 0.8, rotate: -15, filter: 'blur(10px)' }}
              animate={{ scale: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: activeTab === 'mindmap' 
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                  : activeTab === 'history'
                  ? 'linear-gradient(135deg, #10b981, #3b82f6)'
                  : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: activeTab === 'mindmap'
                  ? '0 12px 32px rgba(99, 102, 241, 0.4)'
                  : activeTab === 'history'
                  ? '0 12px 32px rgba(16, 185, 129, 0.4)'
                  : '0 12px 32px rgba(245, 158, 11, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
              {activeTab === 'mindmap' ? <GitBranch size={26} color="#fff"/> : activeTab === 'history' ? <Clock size={26} color="#fff"/> : <FileText size={26} color="#fff"/>}
            </motion.div>
            <div>
              <motion.h1 
                layout
                style={{ 
                  fontSize: 24, 
                  fontWeight: 900, 
                  color: '#fff', 
                  letterSpacing: '-0.8px', 
                  lineHeight: 1, 
                  margin: 0,
                  fontFamily: 'Syne, sans-serif'
                }}>
                {activeTab === 'mindmap' ? 'Mind Map Studio' : activeTab === 'history' ? 'Temporal Archive' : 'Intelligence Vault'}
              </motion.h1>
              <motion.p 
                layout
                style={{ margin: '4px 0 0 0', fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {activeTab === 'mindmap' ? 'Visualizing Ideas' : activeTab === 'history' ? 'Tracing Evolution' : 'Managing Knowledge'}
              </motion.p>
            </div>
          </div>
          
          <div style={{ flex: 1 }}/>
          
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '6px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            gap: '4px',
            backdropFilter: 'blur(10px)'
          }}
          onMouseLeave={() => setHoveredTab(null)}
          >
            {/* Ghost Hover Indicator */}
            <AnimatePresence>
              {hoveredTab && (
                <motion.div
                  layoutId="hoverIndicator"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '14px',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {TABS.map(tab => {
              const active = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  style={{
                    position: 'relative',
                    padding: '10px 24px',
                    borderRadius: '14px',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 600,
                    color: active ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 1,
                    transition: 'color 0.3s ease',
                    letterSpacing: '-0.2px'
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabPill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: tab.id === 'mindmap' 
                          ? 'linear-gradient(135deg, #6366f1, #818cf8)' 
                          : tab.id === 'history'
                          ? 'linear-gradient(135deg, #10b981, #34d399)'
                          : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        borderRadius: '14px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                        zIndex: -1
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 30,
                        mass: 0.8
                      }}
                    />
                  )}
                  <motion.span 
                    animate={{ 
                      scale: active ? 1.2 : 1,
                      rotate: active ? 8 : 0,
                      color: active ? '#fff' : 'rgba(255, 255, 255, 0.4)'
                    }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {React.cloneElement(tab.icon, { size: 18 })}
                  </motion.span>
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }}/>
          
          <motion.button 
            className="close-btn" 
            onClick={onClose}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18}/>
          </motion.button>
        </header>

        <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)', scale: 0.99 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)', scale: 0.99 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {activeTab === 'mindmap' ? (
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <MindMapTab 
                    notes={notes} 
                    history={history}
                    maps={maps}
                    pathsData={pathsData}
                    onUpdateMaps={onUpdateMaps}
                    onJumpToNode={onJumpToNode}
                    onSelectNote={setSelectedNote}
                    setActiveTab={setActiveTab}
                    onClose={onClose}
                  />
                </div>
              ) : (
                <div className="workplace-layout">
                  <div className="workplace-main">
                    {activeTab === 'notes' && (
                      <div className="content-section">
                        <div className="content-controls">
                          <div className="search-wrapper">
                            <Search size={18}/>
                            <input type="text" placeholder="Search your intelligence base..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
                          </div>
                          <motion.button className="add-btn" onClick={() => setIsCreating(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Plus size={18}/><span>New Entry</span>
                          </motion.button>
                        </div>
                        <div className="notes-scroll">
                          <AnimatePresence>
                            {isCreating && (
                              <motion.div className="note-editor" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <div className="editor-head">
                                  <input placeholder="Entry Title..." value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })}/>
                                  <div className="type-toggle">
                                    <motion.button className={newNote.type === 'note' ? 'active' : ''} onClick={() => setNewNote({ ...newNote, type: 'note' })} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Note</motion.button>
                                    <motion.button className={newNote.type === 'snippet' ? 'active' : ''} onClick={() => setNewNote({ ...newNote, type: 'snippet' })} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Snippet</motion.button>
                                  </div>
                                </div>
                                <textarea className="editor-textarea" placeholder={newNote.type === 'note' ? 'Write in markdown...' : '// Code...'} value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })}/>
                                <div className="editor-foot">
                                  <motion.button className="cancel-btn" onClick={() => setIsCreating(false)}>Cancel</motion.button>
                                  <motion.button className="save-btn" onClick={handleCreate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Save size={14}/><span>Save Entry</span>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="repo-section">
                            <div className="repo-head"><Code size={18}/><span>Snippets</span></div>
                            <div className="notes-grid single-col">
                              {snippets.map(note => (<NoteCard key={note.id} note={note} onDelete={() => onDeleteNote(note.id)} onLink={() => setLinkingNote(note)} onClick={() => { setSelectedNote(note); setHubMode('preview'); }} fmt={fmt}/>))}
                              {snippets.length === 0 && <div className="empty-repo">No code snippets saved.</div>}
                            </div>
                          </div>
                          <div className="repo-section">
                            <div className="repo-head"><FileText size={18}/><span>Quick Notes</span></div>
                            <div className="notes-grid single-col">
                              {noteItems.map(note => (<NoteCard key={note.id} note={note} onDelete={() => onDeleteNote(note.id)} onLink={() => setLinkingNote(note)} onClick={() => { setSelectedNote(note); setHubMode('preview'); }} fmt={fmt}/>))}
                              {noteItems.length === 0 && <div className="empty-repo">No theory notes saved.</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'history' && (
                      <div className="history-quick-access">
                        <div className="section-head"><Bookmark size={14}/><span>Recently Studied Nodes</span></div>
                        <div className="history-grid">
                          {history.length > 0 ? history.map((item, i) => (
                            <motion.div key={item.id + i} className="history-card" whileHover={{ scale: 1.02, y: -2 }} onClick={() => onJumpToNode(item.id, item.pathId)}>
                              <div className="card-top"><span className="path-tag" style={{ color: item.pathColor }}>{item.pathTitle || 'PATH'}</span><ExternalLink size={12}/></div>
                              <h3>{item.title}</h3>
                              <div className="card-foot"><span>OPEN_NODE</span></div>
                            </motion.div>
                          )) : <div className="empty-history">No recent activity yet.</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      <AnimatePresence>
        {selectedNote && (
          <FullScreenHub note={selectedNote} mode={hubMode} setMode={setHubMode}
            onUpdate={handleUpdate} onLink={() => setLinkingNote(selectedNote)} onClose={() => setSelectedNote(null)} fmt={fmt}/>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {linkingNote && (
          <NodePickerModal 
            maps={maps} 
            note={linkingNote} 
            onSelect={handleAttachToNode} 
            onClose={() => setLinkingNote(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );

}

// ── Node Picker Modal for Linking ──
function NodePickerModal({ maps, note, onSelect, onClose, darkMode }) {
  const [selMapId, setSelMapId] = useState(maps[0]?.id || '');
  const selectedMap = maps.find(m => m.id === selMapId);
  const nodes = selectedMap?.nodes || [];

  const bg = darkMode ? '#1a1a24' : '#ffffff';
  const txt = darkMode ? '#e5e7eb' : '#111827';
  const sub = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const accent = '#6366f1';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(4px)' }} />
      <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}}
        style={{ position:'relative', width:420, background:bg, borderRadius:24, border:`1px solid ${border}`, overflow:'hidden', display:'flex', flexDirection:'column', maxHeight:'80vh', boxShadow:'0 25px 80px rgba(0,0,0,0.6)' }}>
        
        <header style={{ padding:'24px 28px', borderBottom:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:darkMode?'rgba(255,255,255,0.02)':'#fcfcfc' }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:txt, letterSpacing:'-0.02em' }}>Link to Mind Map</h3>
            <p style={{ margin:0, fontSize:12, color:sub, fontWeight:500, marginTop:2 }}>Attach <span style={{color:accent}}>"{note.title}"</span> to a specific node</p>
          </div>
          <motion.button whileHover={{rotate:90, scale:1.1}} onClick={onClose} style={{ background:'none', border:'none', color:sub, cursor:'pointer', padding:4 }}><X size={22}/></motion.button>
        </header>

        <div style={{ padding:28, display:'flex', flexDirection:'column', gap:20, overflowY:'auto' }}>
          <div>
            <label style={{ fontSize:10, fontWeight:800, color:accent, display:'block', marginBottom:10, letterSpacing:'0.08em' }}>CHOOSE_MAP</label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {maps.map(m => (
                <button key={m.id} onClick={()=>setSelMapId(m.id)}
                  style={{ padding:'12px 16px', borderRadius:12, border:`1px solid ${selMapId===m.id?accent:border}`, background:selMapId===m.id?(darkMode?'rgba(99,102,241,0.15)':'#f5f7ff'):'transparent', color:selMapId===m.id?accent:txt, textAlign:'left', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.2s' }}>
                  <GitBranch size={16} />
                  <span>{m.title || 'Untitled Map'}</span>
                  {selMapId===m.id && <div style={{flex:1, textAlign:'right'}}><div style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:accent}}/></div>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
            <label style={{ fontSize:10, fontWeight:800, color:accent, display:'block', marginBottom:10, letterSpacing:'0.08em' }}>TARGET_NODE</label>
            <div style={{ flex:1, overflowY:'auto', borderRadius:16, border:`1px solid ${border}`, background:darkMode?'rgba(0,0,0,0.2)':'#f9fafb', maxHeight:300 }}>
              {nodes.length > 0 ? (
                nodes.map(n => (
                  <button key={n.id} onClick={() => onSelect(selMapId, n.id)}
                    style={{ width:'100%', textAlign:'left', padding:'14px 18px', border:'none', borderBottom:`1px solid ${border}`, background:'transparent', color:txt, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.04)':'#f1f5f9' }
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:n.id==='root'?'#f59e0b':accent, opacity:0.6 }} />
                    <span style={{ fontWeight:500 }}>{n.title}</span>
                  </button>
                ))
              ) : (
                <div style={{ padding:40, textAlign:'center', color:sub, fontSize:13, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  <Library size={32} opacity={0.2} />
                  <span>No nodes found in this map.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer style={{ padding:'20px 28px', textAlign:'right', borderTop:`1px solid ${border}`, background:darkMode?'rgba(0,0,0,0.1)':'#fcfcfc', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, color:sub }}>Select a node to complete link</span>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, border:`1px solid ${border}`, background:'transparent', color:txt, fontWeight:600, fontSize:13, cursor:'pointer' }}>Cancel</button>
        </footer>
      </motion.div>
    </div>
  );
}


function NoteCard({ note, onDelete, onLink, onClick, fmt }) {
  return (
    <motion.div layout className={`note-card ${note.type==='snippet'?'snippet-style':''}`}
      initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} onClick={onClick}>
      <div className="note-card-head">
        <div className="note-meta">
          {note.type==='snippet'?<Code size={12}/>:<FileText size={12}/>}
          <span>{note.type==='snippet'?'SNIPPET':'NOTE'}</span>
          <span style={{opacity:0.4}}>·</span><Calendar size={10}/><span>{fmt(note.timestamp)}</span>
        </div>
        <div style={{display:'flex', gap:4}}>
          <motion.button className="delete-note-btn" onClick={e=>{e.stopPropagation(); onLink();}} whileHover={{scale:1.2, color:'#6366f1'}} whileTap={{scale:0.9}} title="Link to Mind Map">
            <Link2 size={12}/>
          </motion.button>
          <motion.button className="delete-note-btn" onClick={e=>{e.stopPropagation();onDelete();}} whileHover={{scale:1.2, color:'#ef4444'}} whileTap={{scale:0.9}}>
            <Trash2 size={12}/>
          </motion.button>
        </div>
      </div>
      <h3>{note.title}</h3>
      <div className="note-content mini-preview">
        <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>{note.content?.slice(0,200)||''}</ReactMarkdown>
      </div>
      <div className="card-footer-action"><ChevronRight size={12}/><span>OPEN_FULL</span></div>
    </motion.div>
  );
}

function FullScreenHub({ note, mode, setMode, onUpdate, onLink, onClose, fmt }) {
  const [ec,setEc]=useState(note.content);
  const [et,setEt]=useState(note.title);
  useEffect(()=>{setEc(note.content);setEt(note.title);},[note]);
  const save=()=>{onUpdate({...note,title:et,content:ec,timestamp:new Date().toISOString()});setMode('preview');};
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:3000,background:'rgba(0,0,0,0.9)',display:'flex',flexDirection:'column',padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <div className="hub-controls">
          <button className={`hub-toggle-btn ${mode==='preview'?'active':''}`} onClick={()=>setMode('preview')}><Eye size={14}/><span>Preview</span></button>
          <button className={`hub-toggle-btn ${mode==='edit'?'active':''}`} onClick={()=>setMode('edit')}><Edit2 size={14}/><span>Edit</span></button>
        </div>
        {mode==='edit'&&<motion.button className="save-btn" onClick={save} whileHover={{scale:1.05}}><Save size={14}/><span>SAVE</span></motion.button>}
        <div style={{flex:1}}/>
        <motion.button className="hub-toggle-btn" onClick={onLink} whileHover={{scale:1.05}} style={{background:'rgba(99,102,241,0.1)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)'}}>
          <Link2 size={14}/><span>LINK_TO_MAP</span>
        </motion.button>
        <motion.button className="close-btn" onClick={onClose} whileHover={{scale:1.1,rotate:90}}><X size={20}/></motion.button>
      </div>
      <div style={{flex:1,overflow:'auto',maxWidth:900,margin:'0 auto',width:'100%'}}>
        {mode==='edit'?(
          <>
            <input value={et} onChange={e=>setEt(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 16px',color:'#fff',fontSize:22,fontWeight:800,marginBottom:16,outline:'none'}}/>
            <textarea value={ec} onChange={e=>setEc(e.target.value)} style={{width:'100%',minHeight:400,background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20,color:'#eee',fontFamily:'JetBrains Mono,monospace',fontSize:14,lineHeight:1.7,outline:'none',resize:'vertical'}}/>
          </>
        ):(
          <div>
            <h1 style={{fontSize:32,fontWeight:800,color:'#fff',marginBottom:8}}>{note.title}</h1>
            <div style={{fontSize:10,color:'#555',fontWeight:700,letterSpacing:1,marginBottom:32}}>{fmt(note.timestamp)}</div>
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}