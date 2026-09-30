import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, Code2, Library, RotateCcw } from "lucide-react";
import WanderingEyesLoader from "../../../../components/WanderingEyesLoader";
import { problems } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { ARTICLE_TOPICS, isRenderableImage, normalizeTitle, parseArticle, parseArticleIndex } from "../lib/articles";
import { categoryOf } from "../lib/problems";
import { Badge, DifficultyPill, EmptyState, Panel, PrepPage, SearchInput } from "../ui";

const BASE = "/dsa/articles/";
const problemByTitle = new Map(problems.map((problem) => [normalizeTitle(problem.title), problem]));

let indexPromise = null;
const loadIndex = () => {
  indexPromise ||= fetch(`${BASE}README.md`).then((res) => {
    if (!res.ok) throw new Error(`Article index unavailable (HTTP ${res.status})`);
    return res.text();
  }).then(parseArticleIndex).catch((error) => { indexPromise = null; throw error; });
  return indexPromise;
};

const markdownComponents = {
  img: ({ src, alt }) => (isRenderableImage(src) ? <img src={src} alt={alt || ""} loading="lazy" /> : null),
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
};

function relatedProblems(article) {
  const exact = problemByTitle.get(normalizeTitle(article.title));
  const topic = ARTICLE_TOPICS.find((entry) => entry.id === article.topic);
  const sameCategory = topic?.category ? problems.filter((problem) => categoryOf(problem) === topic.category && problem !== exact).slice(0, exact ? 3 : 4) : [];
  return { exact, suggestions: sameCategory };
}

function Reader({ article, list, readMap, setReadMap, onBack, onOpenArticle, openProblem }) {
  const [state, setState] = useState({ loading: true, error: "", parsed: null });
  const read = Boolean(readMap[article.file]);
  const index = list.findIndex((entry) => entry.file === article.file);
  const previous = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
  const related = useMemo(() => relatedProblems(article), [article]);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: "", parsed: null });
    fetch(`${BASE}${encodeURIComponent(article.file)}`)
      .then((res) => { if (!res.ok) throw new Error(`Could not load this article (HTTP ${res.status})`); return res.text(); })
      .then((text) => { if (!cancelled) setState({ loading: false, error: "", parsed: parseArticle(text) }); })
      .catch((error) => { if (!cancelled) setState({ loading: false, error: error.message, parsed: null }); });
    document.querySelector(".dsa-dashboard-body")?.scrollTo?.({ top: 0 });
    return () => { cancelled = true; };
  }, [article.file]);

  const toggleRead = () => setReadMap((prev) => {
    const copy = { ...prev };
    if (copy[article.file]) delete copy[article.file]; else copy[article.file] = new Date().toISOString();
    return copy;
  });

  return (
    <PrepPage
      className="dsp-reader-page"
      eyebrow={`Articles · ${article.topicLabel}`}
      title={state.parsed?.title || article.title}
      description={state.parsed?.description}
      actions={<button type="button" className="dsp-btn is-quiet" onClick={onBack}><ArrowLeft size={15} /> All articles</button>}
    >
      <div className="dsp-grid split">
        <article className="dsp-box dsp-reader">
          <div className="dsp-row dsp-reader-meta">
            {state.parsed && <span className="dsp-muted"><Clock3 size={13} /> {state.parsed.minutes} min read</span>}
            {article.keywords.slice(0, 4).map((word) => <Badge key={word}>{word}</Badge>)}
          </div>
          {state.loading && <WanderingEyesLoader block label="Loading article…" size={22} />}
          {state.error && <EmptyState icon={BookOpen} title="This article didn't load" body={state.error} />}
          {state.parsed && (
            <div className="dsp-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{state.parsed.body}</ReactMarkdown>
            </div>
          )}
          <footer className="dsp-reader-foot">
            <button type="button" className={`dsp-btn${read ? " is-active" : " is-primary"}`} onClick={toggleRead} aria-pressed={read}>
              {read ? <><CheckCircle2 size={15} /> Read — undo</> : <><Circle size={15} /> Mark as read</>}
            </button>
            <div className="dsp-row">
              {previous && <button type="button" className="dsp-btn is-quiet" onClick={() => onOpenArticle(previous)}><ArrowLeft size={14} /> {previous.title}</button>}
              {next && <button type="button" className="dsp-btn is-quiet" onClick={() => onOpenArticle(next)}>{next.title} <ArrowRight size={14} /></button>}
            </div>
          </footer>
        </article>

        <aside className="dsp-stack">
          <Panel title="Practice it" subtitle="Reading is not solving — try it in the workspace.">
            {related.exact || related.suggestions.length ? (
              <ul className="dsp-list">
                {[related.exact, ...related.suggestions].filter(Boolean).map((problem) => (
                  <li key={problem.slug}>
                    <button type="button" className="dsp-list-row" onClick={() => openProblem(problem.slug)}>
                      <span className="dsp-list-icon"><Code2 size={15} /></span>
                      <div><b>{problem.title}</b><small>{problem === related.exact ? "Same problem" : categoryOf(problem)}</small></div>
                      <DifficultyPill difficulty={problem.difficulty} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <EmptyState compact icon={Code2} title="No linked problems" body="This is a concepts article — there is no matching workspace problem." />}
          </Panel>
        </aside>
      </div>
    </PrepPage>
  );
}

export default function Articles({ openProblem, params, navigate }) {
  const [index, setIndex] = useState({ loading: true, error: "", items: [] });
  const [readMap, setReadMap] = useStore(KEYS.articlesRead, {});
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [openFile, setOpenFile] = useState(params?.file || "");

  const reload = () => {
    setIndex((prev) => ({ ...prev, loading: true, error: "" }));
    loadIndex().then((items) => setIndex({ loading: false, error: "", items })).catch((error) => setIndex({ loading: false, error: error.message, items: [] }));
  };
  useEffect(reload, []);

  const topics = useMemo(() => {
    const counts = new Map();
    index.items.forEach((item) => counts.set(item.topic, (counts.get(item.topic) || 0) + 1));
    return [...ARTICLE_TOPICS, { id: "general", label: "General" }].filter((entry) => counts.has(entry.id)).map((entry) => ({ ...entry, count: counts.get(entry.id) }));
  }, [index.items]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return index.items.filter((item) => (topic === "all" || item.topic === topic)
      && (readFilter === "all" || (readFilter === "read") === Boolean(readMap[item.file]))
      && (!needle || `${item.title} ${item.keywords.join(" ")}`.toLowerCase().includes(needle)));
  }, [index.items, query, readFilter, readMap, topic]);

  const readCount = index.items.filter((item) => readMap[item.file]).length;
  const lastRead = Object.entries(readMap).sort((a, b) => b[1].localeCompare(a[1]))[0];
  const openArticle = index.items.find((item) => item.file === openFile);

  if (openArticle) {
    return <Reader article={openArticle} list={visible.length ? visible : index.items} readMap={readMap} setReadMap={setReadMap} onBack={() => setOpenFile("")} onOpenArticle={(item) => setOpenFile(item.file)} openProblem={openProblem} />;
  }

  return (
    <PrepPage
      eyebrow="Learn"
      title="Articles"
      description="Concept write-ups and worked problems from the DSA article library. Mark an article read when you have actually worked through it — it is your own record, nothing is inferred from scrolling."
      actions={<button type="button" className="dsp-btn" onClick={() => navigate("tracks")}>Go to Prep Hub</button>}
    >
      <div className="dsp-grid cols-3">
        <div className="dsp-stat"><span className="dsp-stat-label"><Library size={14} /> Library</span><b className="dsp-stat-value">{index.items.length}</b><small>articles and problem breakdowns</small></div>
        <div className="dsp-stat"><span className="dsp-stat-label"><CheckCircle2 size={14} /> Read</span><b className="dsp-stat-value">{readCount}/{index.items.length || 0}</b><small>marked by you</small></div>
        <div className="dsp-stat">
          <span className="dsp-stat-label"><RotateCcw size={14} /> Last read</span>
          {lastRead && index.items.find((item) => item.file === lastRead[0])
            ? <button type="button" className="dsp-stat-link" onClick={() => setOpenFile(lastRead[0])}>{index.items.find((item) => item.file === lastRead[0]).title}</button>
            : <b className="dsp-stat-value dsp-muted">—</b>}
          <small>{lastRead ? new Date(lastRead[1]).toLocaleDateString() : "Nothing yet"}</small>
        </div>
      </div>

      <div className="dsp-toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search articles and keywords" />
        <div className="dsp-chips">
          {["all", "unread", "read"].map((value) => <button type="button" key={value} className={`dsp-chip${readFilter === value ? " is-active" : ""}`} aria-pressed={readFilter === value} onClick={() => setReadFilter(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}
        </div>
      </div>
      <div className="dsp-chips" aria-label="Topics">
        <button type="button" className={`dsp-chip${topic === "all" ? " is-active" : ""}`} aria-pressed={topic === "all"} onClick={() => setTopic("all")}>All topics</button>
        {topics.map((entry) => <button type="button" key={entry.id} className={`dsp-chip${topic === entry.id ? " is-active" : ""}`} aria-pressed={topic === entry.id} onClick={() => setTopic(entry.id)}>{entry.label} <span className="dsp-count">{entry.count}</span></button>)}
      </div>

      <Panel>
        {index.loading && <WanderingEyesLoader block label="Loading the library…" size={22} />}
        {index.error && <EmptyState icon={BookOpen} title="The article index didn't load" body={index.error} action={<button type="button" className="dsp-btn" onClick={reload}>Try again</button>} />}
        {!index.loading && !index.error && !visible.length && <EmptyState icon={BookOpen} title="No articles match" body="Try another keyword or topic." />}
        {!index.loading && visible.length > 0 && (
          <ul className="dsp-list dsp-article-list">
            {visible.map((item) => (
              <li key={item.file}>
                <button type="button" className="dsp-list-row" onClick={() => setOpenFile(item.file)}>
                  <span className={`dsp-list-icon${readMap[item.file] ? " is-done" : ""}`}>{readMap[item.file] ? <CheckCircle2 size={15} /> : <BookOpen size={15} />}</span>
                  <div><b>{item.title}</b><small>{item.topicLabel}{item.keywords.length ? ` · ${item.keywords.slice(0, 3).join(", ")}` : ""}</small></div>
                  {problemByTitle.has(normalizeTitle(item.title)) && <Badge tone="info">Has practice</Badge>}
                  <ArrowRight size={14} className="dsp-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PrepPage>
  );
}
