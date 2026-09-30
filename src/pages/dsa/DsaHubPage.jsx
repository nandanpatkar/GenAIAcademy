import React, { Suspense, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  UserCircle2,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import DsaProblemWorkspace from "./DsaProblemWorkspace";
import PracticeSet from "./practice/PracticeSet";
import DsaHome from "./home/DsaHome";
import DsaGlobalDashboard from "./DsaGlobalDashboard";
import WanderingEyesLoader from "../../components/WanderingEyesLoader";
import { RAIL, SECTION_LABELS, GROUP_OF } from "./prep/sections";
import { SECTION_COMPONENTS } from "./prep/sectionComponents";
import { EmptyState } from "./prep/ui";
import { useLearnerState } from "./prep/learner";
import { useHabitSummary } from "./prep/habit";
import NotificationBell from "./prep/Notifications";
import CommandPalette from "./prep/CommandPalette";
import { usePlanDone, usePlanner } from "./prep/planner/plannerStore";
import { isTaskDone, isWork } from "./prep/lib/planner";
import "../../styles/DsaHub.css";
import "../../styles/DsaPrep.css";

const RAIL_HIDDEN_KEY = "dsa_rail_hidden";

export default function DsaHubPage({ onClose, initialSection = "home" }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth() || {};
  // Prefer a real display name; fall back to the email local-part, then a generic label.
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name
    || (user?.email ? user.email.split("@")[0] : "") || "Your profile";
  const displayEmail = user?.email || "";
  const [section, setSection] = useState(initialSection);
  // Optional payload for the section being opened (a note id, a track id…).
  const [sectionParams, setSectionParams] = useState(null);
  // Only groups the reader explicitly toggled; the rest open when they hold
  // the current section.
  const [railOverrides, setRailOverrides] = useState({});
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [workspaceTab, setWorkspaceTab] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  // Shared with every prep section, so a tick or bookmark made anywhere shows here.
  const learner = useLearnerState();
  const { bookmarks: bookmarkSet } = learner;
  // Also registers the accepted-submission follow-ups (coins, review, POTD).
  const habit = useHabitSummary();
  const { state: planState, revision: planRevision } = usePlanner();
  const planDone = usePlanDone();
  const planLeftToday = planRevision
    ? planRevision.tasks.filter((task) => isWork(task) && task.day === habit.today && !isTaskDone(task, planState.taskState, planDone)).length
    : 0;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Hide the rail on wide screens (below 1120px it is already an overlay
  // behind the menu button). Remembered across visits.
  const [railHidden, setRailHidden] = useState(() => {
    try { return window.localStorage.getItem(RAIL_HIDDEN_KEY) === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(RAIL_HIDDEN_KEY, railHidden ? "1" : "0"); } catch { /* storage unavailable */ }
  }, [railHidden]);

  // ⌘\ / Ctrl+\ shows or hides the rail.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "\\") {
        event.preventDefault();
        setRailHidden((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  // ⌘K / Ctrl+K opens the command palette anywhere in the hub shell (the
  // problem workspace keeps the shortcut for its editor).
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && !workspaceSlug) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [section, workspaceSlug]);


  const navigateTo = (nextSection, params = null) => {
    if (nextSection === "saved") {
      setActiveTab("saved");
      nextSection = "problems";
    } else if (nextSection === "problems") {
      setActiveTab("all");
    }
    setSection(nextSection);
    setSectionParams(params);
    setSidebarOpen(false);
  };

  // `options.tab` opens the workspace on a given panel tab (solution, peers…).
  const openProblem = (slug, options = null) => { setWorkspaceTab(options?.tab || ""); setWorkspaceSlug(slug); };

  if (workspaceSlug) {
    return <DsaProblemWorkspace initialSlug={workspaceSlug} initialTab={workspaceTab} onBack={() => setWorkspaceSlug("")} onClose={onClose} onNavigate={(nextSection, params) => { setWorkspaceSlug(""); navigateTo(nextSection, params); }} />;
  }


  const SectionComponent = SECTION_COMPONENTS[section];
  const sectionLabel = SECTION_LABELS[section] || "Dashboard";
  // The flat question table serves Problems, and the sheet until it has its own view.
  const isQuestionView = !SectionComponent && (section === "problems" || section === "sheet");
  const sectionContext = { navigate: navigateTo, openProblem, params: sectionParams, displayName, displayEmail, isAdmin: Boolean(isAdmin) };
  const isGroupOpen = (entry) => railOverrides[entry.group] ?? GROUP_OF[section] === entry.group;
  const railItemActive = (id) => id === section && !(id === "problems" && activeTab === "saved") || (id === "saved" && section === "problems" && activeTab === "saved");

  return (
    <div className={`dsa-shell${railHidden ? " is-rail-hidden" : ""}`}>
      <a className="dsa-skip-link" href="#dsa-question-table">Skip to questions</a>
      {sidebarOpen && <button type="button" className="dsa-dashboard-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close open panel" />}

      <aside className={`dsa-dashboard-rail${sidebarOpen ? " is-open" : ""}`} aria-label="DSA dashboard navigation">
        {/* No fire mark here: the app sidebar beside the hub already shows it. */}
        <div className="dsa-rail-brand">
          <strong>DSA</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={17} /></button>
        </div>

        <nav className="dsa-rail-nav" aria-label="DSA sections">
          {RAIL.map((entry) => {
            if (!entry.items) {
              const Icon = entry.icon;
              return (
                <button type="button" key={entry.id} className={`dsa-rail-item${section === entry.id ? " is-current" : ""}`} aria-current={section === entry.id ? "page" : undefined} onClick={() => navigateTo(entry.id)}>
                  <Icon size={17} /><span>{entry.label}</span>
                  {entry.id === "potd" && !habit.potdSolved && <i className="dsa-rail-dot" aria-label="Not solved yet today" />}
                </button>
              );
            }
            const Icon = entry.icon;
            const open = isGroupOpen(entry);
            const holdsCurrent = GROUP_OF[section] === entry.group;
            return (
              <div key={entry.group} className={`dsa-rail-group${holdsCurrent ? " is-active" : ""}${open ? " is-open" : ""}`}>
                <button type="button" className="dsa-rail-item" aria-expanded={open} onClick={() => setRailOverrides((prev) => ({ ...prev, [entry.group]: !open }))}>
                  <Icon size={17} /><span>{entry.label}</span><ChevronDown size={15} />
                </button>
                <div className="dsa-rail-subnav">
                  {entry.items.map((item) => (
                    <button type="button" key={item.id} className={railItemActive(item.id) ? "is-active" : ""} aria-current={railItemActive(item.id) ? "page" : undefined} onClick={() => navigateTo(item.id)}>
                      <span>{item.label}</span>
                      {item.id === "saved" && bookmarkSet.size > 0 && <i className="dsa-rail-badge">{bookmarkSet.size}</i>}
                      {item.id === "planner" && planLeftToday > 0 && <i className="dsa-rail-badge" aria-label={`${planLeftToday} planned today`}>{planLeftToday}</i>}
                      {item.id === "review" && habit.due.length > 0 && <i className="dsa-rail-badge is-alert" aria-label={`${habit.due.length} due`}>{habit.due.length}</i>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="dsa-rail-footer">
          <button type="button" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button type="button" onClick={() => navigateTo("profile")} aria-label="Open profile and data settings"><UserCircle2 size={22} /><span><b>{displayName}</b><small>{displayEmail || "Profile & data"}</small></span><ChevronRight size={14} /></button>
        </div>
      </aside>

      <section className="dsa-dashboard-stage">
        <header className="dsa-dashboard-topbar">
          <div className="dsa-topbar-left">
            <button type="button" className="dsa-mobile-panel-button" onClick={() => setSidebarOpen(true)} aria-label="Open DSA navigation"><Menu size={18} /></button>
            <button
              type="button"
              className="dsa-rail-toggle"
              onClick={() => setRailHidden((value) => !value)}
              aria-pressed={railHidden}
              aria-label={railHidden ? "Show the DSA sidebar" : "Hide the DSA sidebar"}
              title={`${railHidden ? "Show" : "Hide"} sidebar (⌘\\)`}
            >
              {railHidden ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
            {section === "home" ? <b>Home</b> : <><span>Home</span><ChevronRight size={13} /><b>{sectionLabel}</b></>}
          </div>
          <div className="dsa-topbar-actions">
            <label className="dsa-global-search">
              <span className="sr-only">Search questions</span>
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" />
              <kbd role="button" tabIndex={0} title="Search everything" onClick={() => setPaletteOpen(true)} onKeyDown={(event) => { if (event.key === "Enter") setPaletteOpen(true); }}>⌘ K</kbd>
            </label>
            <NotificationBell navigate={navigateTo} />
            <button type="button" className="dsa-live-dashboard" onClick={() => navigateTo("dashboard")}><LayoutDashboard size={15} /> Live Dashboard</button>
            <button type="button" className="dsa-icon-button" onClick={onClose} aria-label="Close DSA dashboard"><X size={18} /></button>
          </div>
        </header>

        <div className="dsa-dashboard-body is-wide">
          {section === "home" && <DsaHome navigate={navigateTo} openProblem={openProblem} displayName={displayName} />}
          {section === "dashboard" && <DsaGlobalDashboard onNavigate={navigateTo} onOpenProblem={openProblem} userName={displayName} />}
          {SectionComponent && (
            <Suspense fallback={<div className="dsp-suspense"><WanderingEyesLoader block label={`Loading ${sectionLabel}…`} size={24} /></div>}>
              <SectionComponent key={section} section={section} {...sectionContext} />
            </Suspense>
          )}
          {!SectionComponent && !isQuestionView && section !== "dashboard" && section !== "home" && (
            <EmptyState icon={LockKeyhole} title="That section doesn't exist" body="It may have moved. Pick another from the sidebar, or start from Today." action={<button type="button" className="dsp-btn" onClick={() => navigateTo("today")}>Go to Today</button>} />
          )}
          {isQuestionView && (
            <PracticeSet
              query={query}
              onQueryChange={setQuery}
              savedOnly={activeTab === "saved"}
              onSavedOnlyChange={(value) => setActiveTab(value ? "saved" : "all")}
              openProblem={openProblem}
            />
          )}
        </div>
      </section>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} navigate={navigateTo} openProblem={openProblem} />
    </div>
  );
}
