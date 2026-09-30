import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Editor tabs for one problem: several independent drafts ("Tab-1", "Tab-2")
 * so an alternative approach can be tried without losing the first.
 *
 * Stored per problem under `dsa_workspace_tabs_<slug>`. The active tab's code
 * is also mirrored to the older single-draft key `dsa_workspace_code_<slug>`,
 * which is how drafts were saved before tabs existed; a problem with no tab
 * record yet starts from that draft, so nothing written earlier is lost.
 */
const tabsKey = (slug) => `dsa_workspace_tabs_${slug}`;
const legacyKey = (slug) => `dsa_workspace_code_${slug}`;
const SAVE_DELAY_MS = 350;

const readTabs = (slug, starterCode) => {
  try {
    const stored = JSON.parse(localStorage.getItem(tabsKey(slug)) || "null");
    if (Array.isArray(stored?.tabs) && stored.tabs.length) {
      const activeId = stored.tabs.some((tab) => tab.id === stored.activeId) ? stored.activeId : stored.tabs[0].id;
      return { tabs: stored.tabs, activeId };
    }
  } catch {
    // A corrupt record falls through to a fresh first tab.
  }
  let code = starterCode || "";
  try { code = localStorage.getItem(legacyKey(slug)) || code; } catch { /* storage unavailable */ }
  return { tabs: [{ id: "tab-1", name: "Tab-1", code }], activeId: "tab-1" };
};

const nextTabNumber = (tabs) => tabs.reduce((max, tab) => Math.max(max, Number(tab.id.split("-").pop()) || 0), 0) + 1;

/**
 * `ready` is false while the problem payload is loading: tabs are only read
 * once the starter code is known, and nothing is written for a slug until its
 * own tabs have been read (so switching problems never saves one problem's
 * code under another's key).
 */
export function useCodeTabs(slug, starterCode, ready) {
  const [state, setState] = useState({ slug: "", tabs: [], activeId: "" });
  const [savedAt, setSavedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!slug || !ready) return;
    setState({ slug, ...readTabs(slug, starterCode) });
    setSavedAt(null);
    setSaving(false);
    // starterCode arrives with `ready`; re-reading on its own would clobber edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, ready]);

  const persist = useCallback((snapshot) => {
    if (!snapshot.slug) return;
    try {
      localStorage.setItem(tabsKey(snapshot.slug), JSON.stringify({ tabs: snapshot.tabs, activeId: snapshot.activeId }));
      const active = snapshot.tabs.find((tab) => tab.id === snapshot.activeId);
      if (active) localStorage.setItem(legacyKey(snapshot.slug), active.code);
      setSavedAt(new Date());
    } catch {
      // Quota or privacy mode: the draft stays in memory for this session.
    }
    setSaving(false);
  }, []);

  useEffect(() => {
    if (state.slug !== slug || !state.tabs.length) return undefined;
    setSaving(true);
    const timer = window.setTimeout(() => persist(state), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [persist, slug, state]);

  const loaded = state.slug === slug && state.tabs.length > 0;
  const activeTab = loaded ? state.tabs.find((tab) => tab.id === state.activeId) || state.tabs[0] : null;

  const setCode = useCallback((code) => {
    setState((prev) => ({ ...prev, tabs: prev.tabs.map((tab) => (tab.id === prev.activeId ? { ...tab, code } : tab)) }));
  }, []);

  const selectTab = useCallback((id) => setState((prev) => ({ ...prev, activeId: id })), []);

  const addTab = useCallback((code) => {
    setState((prev) => {
      const number = nextTabNumber(prev.tabs);
      const tab = { id: `tab-${number}`, name: `Tab-${number}`, code: code ?? starterCode ?? "" };
      return { ...prev, tabs: [...prev.tabs, tab], activeId: tab.id };
    });
  }, [starterCode]);

  const closeTab = useCallback((id) => {
    setState((prev) => {
      if (prev.tabs.length <= 1) return prev;
      const index = prev.tabs.findIndex((tab) => tab.id === id);
      const tabs = prev.tabs.filter((tab) => tab.id !== id);
      const activeId = prev.activeId === id ? tabs[Math.max(0, index - 1)].id : prev.activeId;
      return { ...prev, tabs, activeId };
    });
  }, []);

  const saveNow = useCallback(() => persist(stateRef.current), [persist]);

  return {
    loaded,
    tabs: loaded ? state.tabs : [],
    activeId: activeTab?.id || "",
    code: activeTab?.code ?? "",
    setCode,
    selectTab,
    addTab,
    closeTab,
    saveNow,
    saving,
    savedAt,
  };
}
