import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Info, ListPlus, PenSquare, ShieldQuestion } from "lucide-react";
import { problemBySlug } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { OUTCOMES, displayAuthor } from "../lib/community";
import { aggregateCompanies, companyKey } from "../lib/companies";
import { addItem, makeList } from "../lib/lists";
import { uid, updateStore } from "../lib/store";
import { Badge, DifficultyPill, EmptyState, Panel, PrepPage, SearchInput, Stat } from "../ui";

const outcomeLabel = (id) => OUTCOMES.find((entry) => entry.id === id)?.label || id;

function CompanyPage({ company, onBack, openProblem, navigate }) {
  const [lists] = useStore(KEYS.lists, []);
  const listName = `${company.name} prep`;
  const existing = lists.find((list) => list.purpose === "company" && list.name.toLowerCase() === listName.toLowerCase());
  const max = company.topics[0]?.[1] || 1;

  const createList = () => {
    let list = existing || makeList({ id: uid("list"), name: listName, purpose: "company", description: `Problems linked in ${company.reports} shared ${company.name} interview report${company.reports === 1 ? "" : "s"}.` });
    company.problems.forEach(([slug]) => { if (problemBySlug.has(slug)) list = addItem(list, slug); });
    updateStore(KEYS.lists, [], (all) => (existing ? all.map((entry) => (entry.id === list.id ? list : entry)) : [list, ...all]));
    navigate("lists");
  };

  return (
    <PrepPage
      eyebrow="Company preparation"
      title={company.name}
      description={`Built from ${company.reports} interview report${company.reports === 1 ? "" : "s"} shared in Community. Counts show how many reports mention something — not the chance it will be asked.`}
      actions={<button type="button" className="dsp-btn is-quiet" onClick={onBack}><ArrowLeft size={15} /> All companies</button>}
    >
      <div className="dsp-notice is-warning"><ShieldQuestion size={16} /><span><b>Reported by candidates, unverified.</b> Sample size {company.reports} — confidence {company.confidence}. Interviews vary by team, level and year.</span></div>
      <div className="dsp-grid cols-4">
        <Stat icon={Building2} label="Reports" value={company.reports} hint={company.latest ? `Latest ${company.latest}` : "No dates given"} />
        <Stat label="Avg difficulty" value={company.avgDifficulty ? `${company.avgDifficulty.toFixed(1)}/5` : "—"} hint="Self-reported" />
        <Stat label="Roles" value={company.roles.length} hint={company.roles.slice(0, 2).map(([role]) => role).join(", ")} />
        <Stat label="Outcomes" value={Object.entries(company.outcomes).map(([id, count]) => `${count} ${outcomeLabel(id).toLowerCase()}`).join(" · ")} />
      </div>

      <div className="dsp-grid cols-2">
        <Panel title="Topics mentioned" subtitle={`Number of reports (out of ${company.reports}) that mention each topic.`}>
          {company.topics.length ? (
            <ul className="dsp-bars">
              {company.topics.slice(0, 12).map(([topic, count]) => (
                <li key={topic}><span>{topic}</span><i style={{ width: `${(count / max) * 100}%` }} /><b>{count}/{company.reports}</b></li>
              ))}
            </ul>
          ) : <EmptyState compact icon={Info} title="No topics listed" />}
        </Panel>
        <Panel title="Round structure" subtitle="How often each kind of round appeared across reports.">
          <ul className="dsp-bars">{company.rounds.map(([type, count]) => <li key={type}><span>{type}</span><i style={{ width: `${(count / (company.rounds[0]?.[1] || 1)) * 100}%` }} /><b>{count}</b></li>)}</ul>
        </Panel>
      </div>

      <Panel title="Practice problems linked by candidates" subtitle="Open problems from this hub that authors said were similar to what they faced." actions={company.problems.length > 0 && <button type="button" className="dsp-btn is-small" onClick={createList}><ListPlus size={13} /> {existing ? "Update" : "Create"} “{listName}” list</button>}>
        {company.problems.length ? (
          <ul className="dsp-list">
            {company.problems.map(([slug, count]) => {
              const problem = problemBySlug.get(slug);
              return problem && (
                <li key={slug}>
                  <button type="button" className="dsp-list-row" onClick={() => openProblem(slug)}>
                    <div><b>{problem.title}</b><small>Linked in {count} of {company.reports} report{company.reports === 1 ? "" : "s"}</small></div>
                    <DifficultyPill difficulty={problem.difficulty} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <EmptyState compact icon={Info} title="No linked problems yet" body="Authors can link similar practice problems to each round." />}
      </Panel>

      <Panel title="Experiences">
        <ul className="dsp-list">
          {company.posts.map((post) => (
            <li key={post.id}>
              <button type="button" className="dsp-list-row" onClick={() => navigate("experiences", { postId: post.id })}>
                <div><b>{post.title}</b><small>{post.experience.role} · {post.experience.month || "date not given"} · {displayAuthor(post)}</small></div>
                <Badge tone={post.experience.outcome === "offer" ? "success" : "neutral"}>{outcomeLabel(post.experience.outcome)}</Badge>
                <ArrowRight size={14} className="dsp-muted" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </PrepPage>
  );
}

export default function Companies({ params, openProblem, navigate }) {
  const [posts] = useStore(KEYS.posts, []);
  const [lists] = useStore(KEYS.lists, []);
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState(params?.company ? companyKey(params.company) : "");
  const companies = useMemo(() => aggregateCompanies(posts), [posts]);
  const tracked = lists.filter((list) => list.purpose === "company" && !companies.some((company) => `${company.name} prep`.toLowerCase() === list.name.toLowerCase()));
  const open = companies.find((company) => company.key === openKey);

  if (open) return <CompanyPage company={open} onBack={() => setOpenKey("")} openProblem={openProblem} navigate={navigate} />;

  const visible = companies.filter((company) => !query.trim() || `${company.name} ${company.topics.map(([topic]) => topic).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <PrepPage
      eyebrow="Practice"
      title="Companies"
      description="Company pages are assembled from interview experiences shared in Community: which rounds, which topics, which similar problems — each with its sample size. No employer data, no copied collections."
      actions={<button type="button" className="dsp-btn is-primary" onClick={() => navigate("experiences")}><PenSquare size={14} /> Share an experience</button>}
    >
      <SearchInput value={query} onChange={setQuery} placeholder="Search companies or topics" />
      {visible.length ? (
        <div className="dsp-grid cols-3">
          {visible.map((company) => (
            <button type="button" key={company.key} className="dsp-tile dsp-company-tile" onClick={() => setOpenKey(company.key)}>
              <header><span className="dsp-track-icon"><Building2 size={17} /></span><Badge tone={company.reports >= 3 ? "info" : "neutral"}>{company.reports} report{company.reports === 1 ? "" : "s"}</Badge></header>
              <h3>{company.name}</h3>
              <p>{company.topics.slice(0, 4).map(([topic]) => topic).join(" · ") || "No topics listed"}</p>
              <small className="dsp-muted">{company.latest ? `Latest ${company.latest}` : "Dates not given"} · confidence {company.confidence}</small>
            </button>
          ))}
        </div>
      ) : (
        <Panel><EmptyState icon={Building2} title={companies.length ? "No company matches" : "No company data yet"} body={companies.length ? "Try another search." : "Company pages appear as soon as someone shares a structured interview experience. Import a study group's export in Community to get started."} action={!companies.length && <button type="button" className="dsp-btn" onClick={() => navigate("experiences")}>Go to interview experiences</button>} /></Panel>
      )}
      {tracked.length > 0 && (
        <Panel title="Target lists" subtitle="Company lists you're keeping in My Spaces › Lists.">
          <div className="dsp-chips">{tracked.map((list) => <button type="button" key={list.id} className="dsp-chip" onClick={() => navigate("lists")}>{list.name} · {list.items.length}</button>)}</div>
        </Panel>
      )}
    </PrepPage>
  );
}
