import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft, BookOpen, Brain, Check, ChevronDown, ChevronRight, Code2, Eye, Flame,
  Filter, Home, LayoutGrid, Play, Search, Sparkles, Target, Terminal, TrendingUp, X, Zap
} from "lucide-react";
import { useSimplePyodide } from "../components/PythonIDE";
import AITutorPanel from "../components/AITutorPanel";
import "../styles/LeetCode.css";

const solutionFiles = import.meta.glob("../data/leetcode/**/*.py", {
  query: "?raw",
  import: "default",
  eager: true,
});
const readmeFiles = import.meta.glob("../data/leetcode/README.md", { query: "?raw", import: "default", eager: true });

const readmeText = Object.values(readmeFiles)[0] || "";
const readmeProblems = Object.fromEntries(
  [...readmeText.matchAll(/\|\s*(\d+)\s*\|\s*\[([^\]]+)\][^|]*\|[^|]*\|\s*([^|\n]+)\s*\|/g)]
    .map(([, number, title, difficulty]) => [Number(number), { title, difficulty: difficulty.trim() }])
);

const knownTitles = {
  1: "Two Sum", 3: "Longest Substring Without Repeating Characters",
  4: "Median of Two Sorted Arrays", 5: "Longest Palindromic Substring",
  6: "Zigzag Conversion", 8: "String to Integer (atoi)",
  10: "Regular Expression Matching", 11: "Container With Most Water",
  14: "Longest Common Prefix", 15: "3Sum", 16: "3Sum Closest",
  17: "Letter Combinations of a Phone Number", 18: "4Sum",
  19: "Remove Nth Node From End of List", 22: "Generate Parentheses",
  23: "Merge k Sorted Lists", 24: "Swap Nodes in Pairs", 25: "Reverse Nodes in k-Group",
  26: "Remove Duplicates from Sorted Array", 30: "Substring with Concatenation of All Words",
  31: "Next Permutation", 32: "Longest Valid Parentheses", 33: "Search in Rotated Sorted Array",
  34: "Find First and Last Position of Element in Sorted Array", 36: "Valid Sudoku",
  38: "Count and Say", 39: "Combination Sum", 40: "Combination Sum II",
  41: "First Missing Positive", 42: "Trapping Rain Water", 44: "Wildcard Matching",
  45: "Jump Game II", 46: "Permutations", 48: "Rotate Image", 53: "Maximum Subarray",
  54: "Spiral Matrix", 56: "Merge Intervals", 57: "Insert Interval", 60: "Permutation Sequence",
  61: "Rotate List", 62: "Unique Paths", 63: "Unique Paths II", 64: "Minimum Path Sum",
  65: "Valid Number", 66: "Plus One", 67: "Add Binary", 70: "Climbing Stairs",
  71: "Simplify Path", 72: "Edit Distance", 73: "Set Matrix Zeroes", 74: "Search a 2D Matrix",
  75: "Sort Colors", 78: "Subsets", 79: "Word Search", 80: "Remove Duplicates from Sorted Array II",
  81: "Search in Rotated Sorted Array II", 82: "Remove Duplicates from Sorted List II",
  83: "Remove Duplicates from Sorted List", 85: "Maximal Rectangle", 86: "Partition List",
  87: "Scramble String", 90: "Subsets II", 91: "Decode Ways", 92: "Reverse Linked List II",
  93: "Restore IP Addresses", 94: "Binary Tree Inorder Traversal", 95: "Unique Binary Search Trees II",
  97: "Interleaving String", 98: "Validate Binary Search Tree", 99: "Recover Binary Search Tree",
  100: "Same Tree", 101: "Symmetric Tree", 102: "Binary Tree Level Order Traversal",
  103: "Binary Tree Zigzag Level Order Traversal", 104: "Maximum Depth of Binary Tree",
  105: "Construct Binary Tree from Preorder and Inorder Traversal", 106: "Construct Binary Tree from Inorder and Postorder Traversal",
  107: "Binary Tree Level Order Traversal II", 108: "Convert Sorted Array to Binary Search Tree",
  111: "Minimum Depth of Binary Tree", 112: "Path Sum", 113: "Path Sum II",
  118: "Pascal's Triangle", 119: "Pascal's Triangle II", 120: "Triangle",
  121: "Best Time to Buy and Sell Stock", 122: "Best Time to Buy and Sell Stock II",
  123: "Best Time to Buy and Sell Stock III", 124: "Binary Tree Maximum Path Sum",
  125: "Valid Palindrome", 127: "Word Ladder", 128: "Longest Consecutive Sequence",
  129: "Sum Root to Leaf Numbers", 130: "Surrounded Regions", 131: "Palindrome Partitioning",
  132: "Palindrome Partitioning II", 134: "Gas Station", 139: "Word Break",
  140: "Word Break II", 141: "Linked List Cycle", 142: "Linked List Cycle II",
  143: "Reorder List", 144: "Binary Tree Preorder Traversal", 145: "Binary Tree Postorder Traversal",
  146: "LRU Cache", 147: "Insertion Sort List", 148: "Sort List", 150: "Evaluate Reverse Polish Notation",
  152: "Maximum Product Subarray", 153: "Find Minimum in Rotated Sorted Array", 155: "Min Stack",
  160: "Intersection of Two Linked Lists", 162: "Find Peak Element", 169: "Majority Element",
  189: "Rotate Array", 190: "Reverse Bits", 191: "Number of 1 Bits", 198: "House Robber",
  199: "Binary Tree Right Side View", 200: "Number of Islands", 206: "Reverse Linked List",
  207: "Course Schedule", 208: "Implement Trie (Prefix Tree)", 210: "Course Schedule II",
};

function problemTitle(number, fileName) {
  if (readmeProblems[number]?.title) return readmeProblems[number].title;
  if (knownTitles[number]) return knownTitles[number];
  if (fileName.toLowerCase() === "twosum.py") return "Two Sum";
  return `Problem ${number}`;
}

function problemDifficulty(number) {
  return readmeProblems[number]?.difficulty || (number % 3 === 0 ? "Hard" : number % 2 ? "Medium" : "Easy");
}

function createBoilerplate(source) {
  const method = source.match(/^\s*def\s+([A-Za-z_]\w*)\s*\(([^\n]*)\):/m);
  if (!method) return "class Solution:\n    def solve(self):\n        pass\n";
  return `class Solution:\n    def ${method[1]}(${method[2].trim()}):\n        pass\n`;
}

function cleanSolution(source) {
  let code = source.replace(/^\s*(?:'''[\s\S]*?'''|"""[\s\S]*?""")\s*/, "");
  code = code.replace(/(^\s*def\s+[^\n]+:\s*\n)(\s*)(?:'''[\s\S]*?'''|"""[\s\S]*?""")\s*/gm, "$1");
  return code.trimStart();
}

function parseProblem(path, source) {
  const fileName = path.split("/").pop();
  const numberMatch = fileName.match(/^(\d+)/);
  const number = numberMatch ? Number(numberMatch[1]) : 1;
  const folder = path.split("/").slice(-2, -1)[0] || "LeetCode";
  const statement = source.match(/'''([\s\S]*?)'''|"""([\s\S]*?)"""/);
  const description = (statement?.[1] || statement?.[2] || "Solve this problem using the provided Python function.")
    .replace(/^\s*\n/, "").replace(/\n\s*$/, "").replace(/\t/g, "  ").trim();
  const markdownDescription = description.split("\n").map(line => {
    const trimmed = line.trim();
    if (/^Example\s+\d+:/i.test(trimmed)) return `### ${trimmed}`;
    if (/^(Constraints|Follow up):/i.test(trimmed)) return `### ${trimmed}`;
    if (/^(Input|Output|Explanation):/i.test(trimmed)) return `**${trimmed.split(":")[0]}:**${trimmed.slice(trimmed.indexOf(":" ) + 1)}`;
    return line;
  }).join("\n");
  return { id: path, number, folder, title: problemTitle(number, fileName), difficulty: problemDifficulty(number), description: markdownDescription, solution: cleanSolution(source), boilerplate: createBoilerplate(source) };
}

const parsedProblems = Object.entries(solutionFiles)
  .map(([path, source]) => parseProblem(path, source))
  .sort((a, b) => a.number - b.number || a.title.localeCompare(b.title));

const fallbackProblem = {
  id: "builtin:two-sum",
  number: 1,
  folder: "Starter problems",
  title: "Two Sum",
  difficulty: "Easy",
  description: "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
  solution: "class Solution:\n    def twoSum(self, nums, target):\n        return []\n",
  boilerplate: "class Solution:\n    def twoSum(self, nums, target):\n        pass\n",
};
const problems = parsedProblems.length ? parsedProblems : [fallbackProblem];

export default function LeetCodePage({ onClose, onSubmitLeetCode, savedSubmissions = {} }) {
  const initial = problems.find(p => p.title === "Two Sum") || problems[0];
  const [view, setView] = useState("home");
  const [showProblemList, setShowProblemList] = useState(false);
  const [selectedId, setSelectedId] = useState(initial?.id);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [code, setCode] = useState(initial?.boilerplate || "");
  const [showSolution, setShowSolution] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("leetcode_streak") || 4));
  const [workspaceSplit, setWorkspaceSplit] = useState(50);
  const [outputHeight, setOutputHeight] = useState(155);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const workspaceRef = useRef(null);
  const dragRef = useRef(null);
  const [completed, setCompleted] = useState(() => { try { return JSON.parse(localStorage.getItem("leetcode_completed") || "[]"); } catch { return []; } });
  const { runPython, stdout, stderr, isRunning } = useSimplePyodide();
  const selected = problems.find(p => p.id === selectedId) || initial || fallbackProblem;

  const filtered = useMemo(() => problems.filter(p =>
    (!query || `${p.number} ${p.title}`.toLowerCase().includes(query.toLowerCase())) &&
    (difficulty === "all" || difficulty === (p.number % 3 === 0 ? "hard" : p.number % 2 ? "medium" : "easy"))
  ), [query, difficulty]);

  const selectProblem = (problem) => {
    setSelectedId(problem.id); setCode(problem.boilerplate); setShowSolution(false); setView("problem"); setShowProblemList(false);
  };
  const markComplete = () => {
    const next = completed.includes(selected.id) ? completed.filter(id => id !== selected.id) : [...completed, selected.id];
    setCompleted(next); localStorage.setItem("leetcode_completed", JSON.stringify(next));
    if (!completed.includes(selected.id)) { const nextStreak = streak + 1; setStreak(nextStreak); localStorage.setItem("leetcode_streak", String(nextStreak)); }
    onSubmitLeetCode?.({ problemId: selected.id, problemNumber: selected.number, title: selected.title, code, status: "submitted" });
  };

  const problemOfDay = problems[(new Date().getDate() * 7) % Math.max(problems.length, 1)] || initial || fallbackProblem;
  const difficultyClass = (difficulty) => difficulty.toLowerCase();

  useEffect(() => {
    const move = (event) => {
      if (!dragRef.current) return;
      if (dragRef.current.type === "split" && workspaceRef.current) {
        const bounds = workspaceRef.current.getBoundingClientRect();
        setWorkspaceSplit(Math.min(70, Math.max(30, ((event.clientX - bounds.left) / bounds.width) * 100)));
      }
      if (dragRef.current.type === "output") {
        const pane = dragRef.current.pane;
        const bounds = pane?.getBoundingClientRect();
        if (bounds) setOutputHeight(Math.min(bounds.height - 120, Math.max(110, bounds.bottom - event.clientY)));
      }
    };
    const stop = () => { dragRef.current = null; document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
  }, []);

  const startDrag = (type, event) => {
    event.preventDefault();
    dragRef.current = { type, pane: event.currentTarget.closest(".leetcode-editor-pane") };
    document.body.style.cursor = type === "split" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const renderProblemList = () => (
    <aside className="leetcode-list-pane">
      <div className="leetcode-list-heading"><div><small>QUESTION BANK</small><h2>Problems</h2></div><span className="leetcode-count">{filtered.length}</span></div>
      <div className="leetcode-search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name..." /></div>
      <div className="leetcode-filters"><Filter size={12} /><select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="all">All difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
      <div className="leetcode-problem-list">{filtered.map(problem => <button key={problem.id} className={`leetcode-problem-row ${problem.id === selected.id ? "active" : ""}`} onClick={() => selectProblem(problem)}><span className={`leetcode-status ${completed.includes(problem.id) ? "done" : ""}`}>{completed.includes(problem.id) ? <Check size={11} /> : problem.number}</span><span className="leetcode-problem-name"><b>{problem.title}</b><small>{problem.folder.replace("q", " questions")}</small></span><span className={`leetcode-difficulty ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span></button>)}</div>
    </aside>
  );

  return (
    <div className="leetcode-shell">
      <header className="leetcode-topbar">
        <div className="leetcode-brand"><div className="leetcode-mark">LC</div><div><b>LeetCode</b><span>practice workspace</span></div></div>
        <div className="leetcode-nav-actions"><button onClick={() => setView("home")} className={view === "home" ? "active" : ""}><Home size={14} /> Home</button><button onClick={() => { setView("problem"); setShowProblemList(true); }} className={view === "problem" ? "active" : ""}><LayoutGrid size={14} /> Problem list</button><span className="leetcode-top-stat"><Flame size={15} /> {streak} day streak</span><button className="leetcode-ai-button" onClick={() => setShowTutor(true)}><Sparkles size={14} /> AI Coach</button><button className="leetcode-close" onClick={onClose}><X size={17} /></button></div>
      </header>
      {view === "home" ? (
        <main className="leetcode-home">
          <div className="leetcode-home-inner">
            <div className="leetcode-home-hero"><div><div className="leetcode-eyebrow"><Target size={13} /> ALGORITHM TRAINING CENTER</div><h1>Build your streak.<br /><span>Sharpen your thinking.</span></h1><p>Practice deliberately, learn the patterns, and turn every accepted solution into lasting intuition.</p><button className="leetcode-primary-action" onClick={() => selectProblem(problemOfDay)}><Play size={15} fill="currentColor" /> Start problem of the day</button></div><div className="leetcode-hero-orbit"><div className="leetcode-orbit-ring ring-a" /><div className="leetcode-orbit-ring ring-b" /><div className="leetcode-orbit-core"><Code2 size={28} /></div></div></div>
            <div className="leetcode-stat-grid"><div className="leetcode-stat-card accent"><span className="stat-icon"><Flame size={17} /></span><div><b>{streak}</b><small>Day streak</small></div><TrendingUp size={16} /></div><div className="leetcode-stat-card"><span className="stat-icon"><Check size={17} /></span><div><b>{completed.length}</b><small>Problems solved</small></div><span className="stat-muted">/ {problems.length}</span></div><div className="leetcode-stat-card"><span className="stat-icon"><Brain size={17} /></span><div><b>∞</b><small>Ways to improve</small></div><span className="stat-muted">Keep going</span></div></div>
            <section className="leetcode-streak-card"><div className="leetcode-streak-heading"><div><span className="leetcode-card-kicker"><Flame size={12} /> DAILY ACTIVITY</span><h2>{new Date().getFullYear()} contributions</h2></div><span className="leetcode-streak-caption">{streak} day streak</span></div><div className="leetcode-heatmap"><div className="leetcode-streak-weekdays">{["Mon", "", "Wed", "", "Fri", "", ""].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="leetcode-calendar"><div className="leetcode-month-labels">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => <span key={month}>{month}</span>)}</div><div className="leetcode-streak-grid">{Array.from({ length: 371 }, (_, index) => { const day = index % 7; const week = Math.floor(index / 7); const intensity = ((week * 3 + day * 5 + completed.length) % 9); const active = index >= 371 - Math.min(streak * 2, 371) || (intensity === 0 && week % 3 === 0); const today = index === 370; return <span key={index} className={`leetcode-streak-box level-${active ? Math.max(1, intensity % 4 + 1) : 0} ${today ? "today" : ""}`} title={`${active ? "Completed" : "No activity"} · week ${week + 1}`} />; })}</div></div></div><div className="leetcode-streak-footer"><span>Learn how we count activity</span><div className="leetcode-streak-legend"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></div></div></section>
            <section className="leetcode-dashboard-grid"><div className="leetcode-pod-card"><div className="leetcode-card-kicker"><span>PROBLEM OF THE DAY</span><span className={`leetcode-tag ${difficultyClass(problemOfDay.difficulty)}`}>{problemOfDay.difficulty}</span></div><h2>{problemOfDay.number}. {problemOfDay.title}</h2><p>{problemOfDay.description.split("\n").find(Boolean) || "A carefully selected challenge for today's practice."}</p><div className="leetcode-card-footer"><span><Code2 size={13} /> Python 3 · {problemOfDay.folder.replace("q", " questions")}</span><button onClick={() => selectProblem(problemOfDay)}>Solve now <ChevronRight size={14} /></button></div></div><div className="leetcode-ai-card"><div className="leetcode-ai-card-icon"><Sparkles size={20} /></div><div><span className="leetcode-card-kicker">YOUR AI COACH</span><h2>Stuck on a pattern?</h2><p>Ask for a hint, talk through your approach, or get a code review without spoiling the answer.</p><button onClick={() => setShowTutor(true)}>Open AI coach <ChevronRight size={14} /></button></div></div></section>
            <section className="leetcode-library-section"><div className="leetcode-section-heading"><div><span className="leetcode-card-kicker">THE COLLECTION</span><h2>Explore problems</h2></div><button onClick={() => { setView("problem"); setShowProblemList(true); }}>View all {problems.length} <ChevronRight size={14} /></button></div><div className="leetcode-collection-grid">{["Arrays & Hashing", "Two Pointers", "Binary Trees", "Dynamic Programming"].map((topic, index) => <button key={topic} onClick={() => { setQuery(index === 0 ? "array" : ""); setView("problem"); setShowProblemList(true); }}><span>{[<LayoutGrid />, <Target />, <Code2 />, <TrendingUp />][index]}</span><b>{topic}</b><small>{Math.round(problems.length / 4) + index * 3} problems <ChevronRight size={12} /></small></button>)}</div></section>
          </div>
        </main>
      ) : (
        <div className="leetcode-workspace-view">
          {showProblemList && renderProblemList()}
          <section className="leetcode-main">
            <div className="leetcode-workspace-header"><div className="leetcode-header-left"><button className="leetcode-back-button" onClick={() => setView("home")}><ArrowLeft size={15} /></button><button className="leetcode-problem-list-button" onClick={() => setShowProblemList(v => !v)}><LayoutGrid size={15} /> Problem List</button><div className="leetcode-header-divider" /><div><div className="leetcode-breadcrumb">LEETCODE / {selected.folder.toUpperCase()} / #{selected.number}</div><h1>{selected.number}. {selected.title}</h1></div></div><div className="leetcode-header-right"><button className={`leetcode-complete-btn ${completed.includes(selected.id) ? "completed" : ""}`} onClick={markComplete}><Check size={14} /> {completed.includes(selected.id) ? "Solved" : "Submit"}</button></div></div>
            <div ref={workspaceRef} className="leetcode-workspace" style={{ gridTemplateColumns: `${workspaceSplit}% 6px calc(${100 - workspaceSplit}% - 6px)` }}><article className="leetcode-description"><div className="leetcode-tabs"><button className={!showSolution ? "active" : ""} onClick={() => setShowSolution(false)}><BookOpen size={14} /> Description</button><button className={showSolution ? "active" : ""} onClick={() => setShowSolution(true)}><Eye size={14} /> {showSolution ? "Solution" : "View solution"}</button></div><div className="leetcode-description-scroll">{showSolution ? <div className="leetcode-solution-view"><div className="leetcode-solution-toolbar"><span><Code2 size={14} /> Python solution · read only</span><button onClick={() => { setCode(selected.solution); setShowTutor(false); }}><Code2 size={13} /> Import into sandbox</button></div><div className="leetcode-solution-editor"><Editor height="100%" language="python" theme="vs-dark" value={selected.solution} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 16 }, lineNumbersMinChars: 3, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, domReadOnly: true }} /></div></div> : <><div className="leetcode-tags"><span className={`leetcode-tag ${difficultyClass(selected.difficulty)}`}>{selected.difficulty}</span><span className="leetcode-tag muted">Python 3</span><span className="leetcode-tag muted">Topics</span></div><div className="leetcode-copy"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.description}</ReactMarkdown></div></>}</div></article><div className="leetcode-horizontal-splitter" onPointerDown={(event) => startDrag("split", event)} title="Drag to resize panels"><span /></div><section className="leetcode-editor-pane"><div className="leetcode-pane-title"><span><Code2 size={14} /> Code</span><span className="leetcode-language">Python3 <ChevronDown size={12} /></span></div><div className="leetcode-editor"><Editor height="100%" language="python" theme="vs-dark" value={code} onChange={setCode} options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 }, lineNumbersMinChars: 3, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4 }} /></div><div className="leetcode-runbar"><span><Zap size={13} /> Boilerplate loaded · edit the function to begin</span><button onClick={() => runPython(code)} disabled={isRunning}>{isRunning ? <Terminal size={14} className="leetcode-spin" /> : <Play size={14} fill="currentColor" />} {isRunning ? "Running..." : "Run"}</button></div><div className="leetcode-output-splitter" onPointerDown={(event) => startDrag("output", event)} title="Drag to resize output"><span /></div><div className={`leetcode-output ${outputExpanded ? "expanded" : ""}`} style={{ height: outputExpanded ? "55%" : outputHeight }}><div className="leetcode-output-heading"><span><Terminal size={14} /> Test Result</span><button onClick={() => setOutputExpanded(v => !v)}>{outputExpanded ? "Collapse" : "Expand"}</button><span>{stderr ? "Error" : stdout ? "Executed" : "You must run your code first"}</span></div><pre>{stderr || stdout || "Your test cases and output will appear here."}</pre></div></section></div>
          </section>
        </div>
      )}
      {showTutor && <AITutorPanel isOpen={showTutor} onClose={() => setShowTutor(false)} activeTopic={`${selected.number}. ${selected.title}`} activeModule="LeetCode problem" activeCode={code} onInsertCode={(insertedCode) => { setCode(insertedCode); setShowTutor(false); }} />}
    </div>
  );
}
