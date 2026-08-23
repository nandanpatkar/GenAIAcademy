import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Shield, Search, ChevronLeft, ChevronRight, ChevronDown,
  Sun, Moon, Palette, RotateCcw, LogOut, Eye, Edit3, ExternalLink,
  Plus, Pencil, Trash2, GripVertical, HelpCircle, X, PackageOpen,
  UserCircle2, Cpu, Sparkles, Compass,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AppearanceSettings from "./AppearanceSettings";
import DsaBrandMark from "../pages/dsa/DsaBrandMark";
import jakartaFont from "../assets/fonts/PlusJakartaSans-Variable.woff2";
import {
  resolveEffectiveLayout, resolveItemVisibility, SIDEBAR_ITEM_REGISTRY,
} from "../config/sidebarRegistry";
import { getActiveNavId, runNavClick, buildPathList } from "../config/sidebarNav";
import { AI_PROVIDER_LIST, getProviderMeta } from "../config/aiProviders";
import ProviderIcon from "./ProviderIcon";

const ADMIN_GROUP_ITEMS = [
  { icon: Shield, label: "Admin Panel", id: "admin_management" },
  { icon: Cpu, label: "Algo Studio", id: "algo_studio" },
  { icon: Sparkles, label: "AI Pathfinder", id: "onboarding_chat", description: "Build a learning path around your goals" },
];

/**
 * SidebarStudio — the third navigation rail, ported from the DSA workspace rail
 * (see pages/dsa/DsaHubPage.jsx + styles/DsaHub.css): a flat zinc console with
 * the animated fire brand mark, small-caps rows, accordion sections that frame
 * themselves when they hold the current view, and a footer that pairs the theme
 * switch with an account card.
 *
 * The palette, radii and type scale are lifted verbatim from DsaHub.css so the
 * rail reads as the same product surface — but the tokens are re-declared under
 * `--sbs-*` here, because DsaHub.css is only loaded when the DSA hub mounts.
 *
 * Prop contract is identical to Sidebar / SidebarModern (App.jsx spreads the
 * same object into all three), and every click, active-state and path decision
 * is delegated to config/sidebarNav.js so behaviour can never diverge between
 * the variants. Only the presentation is new.
 */
function SidebarStudio(props) {
  const {
    activePath, setActivePath, paths,
    isEditMode, setIsEditMode, onAddPath, onEditPath,
    isMobileMenuOpen, setIsMobileMenuOpen,
    setActiveNode, setActiveModule, setActiveTopic,
    onSignOut, onReset,
    isCollapsed, setIsCollapsed,
    onSectionWalkthrough,
  } = props;

  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [appearanceInitialTab, setAppearanceInitialTab] = useState("presets");
  const [showSettings, setShowSettings] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  // Only holds groups the reader has explicitly toggled. Anything absent falls
  // back to "open when it contains the current view", matching the DSA rail.
  const [groupOverrides, setGroupOverrides] = useState({});
  const [pathsHidden, setPathsHidden] = useState(() => localStorage.getItem("genai_sb_pathsHidden") === "1");
  const footerRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const {
    user, isAdmin, isAdminView, setIsAdminView, allowAimlForAll,
    sidebarConfig, persistSidebarConfig,
    aiProvider, updateAiProvider, providerConfigs, updateProviderConfig,
  } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name
    || (user?.email ? user.email.split("@")[0] : "") || "Your profile";
  const displayEmail = user?.email || "Signed in locally";

  const [localProvider, setLocalProvider] = useState(aiProvider || "gemini");
  const [localFields, setLocalFields] = useState({});

  useEffect(() => { setLocalProvider(aiProvider || "gemini"); }, [aiProvider]);
  useEffect(() => { setLocalFields({ ...(providerConfigs[localProvider] || {}) }); }, [localProvider, providerConfigs]);

  // Close the account popover on an outside click — it is anchored to the
  // footer and overlays the content area, so it must not linger.
  useEffect(() => {
    if (!showSettings) return undefined;
    const onPointerDown = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) setShowSettings(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [showSettings]);

  const providerMeta = getProviderMeta(localProvider);
  const setField = (name, value) => setLocalFields((prev) => ({ ...prev, [name]: value }));
  const saveProviderConfig = () => {
    updateProviderConfig(localProvider, localFields);
    updateAiProvider(localProvider);
  };

  const effectiveLayout = useMemo(() => resolveEffectiveLayout(sidebarConfig?.layout), [sidebarConfig?.layout]);
  const sidebarEditable = isAdmin && isEditMode && !isCollapsed;

  const isItemVisible = (itemId) => {
    const visibility = resolveItemVisibility(itemId, { overrides: sidebarConfig?.overrides, allowAimlForAll });
    return visibility === "admin" ? isAdmin : true;
  };

  const sidebarGroups = effectiveLayout
    .map((group) => ({
      id: group.id,
      label: group.label,
      custom: !!group.custom,
      items: group.itemIds
        .map((itemId) => {
          const def = SIDEBAR_ITEM_REGISTRY[itemId];
          if (!def || !isItemVisible(itemId)) return null;
          return { id: itemId, ...def };
        })
        .filter(Boolean),
    }))
    .filter((group) => group.items.length > 0 || (sidebarEditable && group.custom))
    .concat(isAdmin && isAdminView ? [{ id: "admin", label: "Admin", items: ADMIN_GROUP_ITEMS }] : []);

  const activeNavId = getActiveNavId(props);
  const pathList = buildPathList(paths);

  const handleNavClick = (event, id) => {
    runNavClick(id, props, { isBlogExpanded, setIsBlogExpanded, isItemVisible });
  };

  // ── layout editing (admin) ─────────────────────────────
  const commitLayout = (nextLayout) => {
    if (persistSidebarConfig) persistSidebarConfig({ ...(sidebarConfig || {}), layout: nextLayout });
  };
  const readDraggedPayload = (event) => {
    try { return JSON.parse(event.dataTransfer.getData("text/plain")); } catch { return null; }
  };
  const handleItemDragStart = (event, itemId, groupId) => {
    if (!sidebarEditable) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify({ id: itemId, groupId }));
    setDraggedItem({ id: itemId, groupId });
  };
  const handleDragOverTarget = (event) => {
    if (!sidebarEditable) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const moveDraggedItem = (dragged, targetGroupId, targetItemId) => {
    if (!dragged) return;
    const layout = effectiveLayout.map((group) => ({ ...group, itemIds: [...group.itemIds] }));
    const fromGroup = layout.find((group) => group.id === dragged.groupId);
    if (fromGroup) fromGroup.itemIds = fromGroup.itemIds.filter((id) => id !== dragged.id);
    const toGroup = layout.find((group) => group.id === targetGroupId);
    if (!toGroup) { setDraggedItem(null); return; }
    const targetIndex = targetItemId ? toGroup.itemIds.indexOf(targetItemId) : -1;
    toGroup.itemIds.splice(targetIndex === -1 ? toGroup.itemIds.length : targetIndex, 0, dragged.id);
    commitLayout(layout);
    setDraggedItem(null);
  };
  const handleItemDrop = (event, groupId, itemId) => {
    if (!sidebarEditable) return;
    event.preventDefault();
    event.stopPropagation();
    moveDraggedItem(readDraggedPayload(event), groupId, itemId);
  };
  const handleGroupDrop = (event, groupId) => {
    if (!sidebarEditable) return;
    event.preventDefault();
    moveDraggedItem(readDraggedPayload(event), groupId, null);
  };
  const handleAddSection = () => {
    const name = window.prompt("Name this section:");
    if (!name || !name.trim()) return;
    const layout = effectiveLayout.map((group) => ({ ...group, itemIds: [...group.itemIds] }));
    layout.push({ id: `custom-${Date.now()}`, label: name.trim(), custom: true, itemIds: [] });
    commitLayout(layout);
  };
  const handleRenameSection = (groupId, currentLabel) => {
    const name = window.prompt("Rename section:", currentLabel);
    if (!name || !name.trim()) return;
    const layout = effectiveLayout.map((group) => ({ ...group, itemIds: [...group.itemIds], ...(group.id === groupId ? { label: name.trim() } : {}) }));
    commitLayout(layout);
  };
  const handleDeleteSection = (groupId, currentLabel, itemIds) => {
    if (!window.confirm(`Delete "${currentLabel}"?${itemIds.length ? " Its items will move to More tools." : ""}`)) return;
    const layout = effectiveLayout.map((group) => ({ ...group, itemIds: [...group.itemIds] })).filter((group) => group.id !== groupId);
    if (itemIds.length) {
      const fallback = layout.find((group) => group.id === "more_tools") || layout[0];
      if (fallback) fallback.itemIds.push(...itemIds);
    }
    commitLayout(layout);
  };

  const handleResetClick = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    } else {
      if (onReset) onReset();
      setResetConfirm(false);
    }
  };

  const togglePathsHidden = () => {
    setPathsHidden((prev) => {
      const next = !prev;
      localStorage.setItem("genai_sb_pathsHidden", next ? "1" : "0");
      return next;
    });
  };

  const openSearch = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  // ── row rendering ──────────────────────────────────────
  const renderItem = (item, groupId, { nested }) => {
    const active = activeNavId === item.id;
    const itemDraggable = sidebarEditable && groupId !== "admin";
    const isAdminOnly = sidebarEditable
      && resolveItemVisibility(item.id, { overrides: sidebarConfig?.overrides, allowAimlForAll }) === "admin";
    return (
      <button
        key={item.id}
        type="button"
        id={`sidebar-item-${item.id}`}
        className={`sbs-item${nested ? " sbs-item-nested" : ""}${active ? " is-current" : ""}${itemDraggable ? " is-editable" : ""}${draggedItem?.id === item.id ? " is-dragging" : ""}`}
        onClick={(event) => handleNavClick(event, item.id)}
        data-label={item.label}
        title={isCollapsed ? item.label : (item.description || item.label)}
        draggable={itemDraggable}
        onDragStart={itemDraggable ? (event) => handleItemDragStart(event, item.id, groupId) : undefined}
        onDragEnd={itemDraggable ? () => setDraggedItem(null) : undefined}
        onDragOver={itemDraggable ? handleDragOverTarget : undefined}
        onDrop={itemDraggable ? (event) => handleItemDrop(event, groupId, item.id) : undefined}
      >
        {itemDraggable && <span className="sbs-grip"><GripVertical size={12} /></span>}
        <item.icon size={nested ? 15 : 17} />
        {!isCollapsed && <span>{item.label}</span>}
        {!isCollapsed && isAdminOnly && (
          <i className="sbs-admin-badge" title="Admin only — change in Admin Panel › Sidebar"><Shield size={10} /></i>
        )}
        {!isCollapsed && !isAdminOnly && onSectionWalkthrough && item.id !== "blog" && (
          <i
            className="sbs-info"
            role="button"
            title={`Guide: ${item.label}`}
            onClick={(event) => { event.stopPropagation(); onSectionWalkthrough(item.id); }}
          >
            <HelpCircle size={12} />
          </i>
        )}
      </button>
    );
  };

  return (
    <>
      <aside
        id="app-sidebar"
        className={`sidebar sb-studio${isCollapsed ? " sb-collapsed sidebar-collapsed" : ""}${isMobileMenuOpen ? " sidebar-mobile-open" : ""}`}
      >
        {/* Brand */}
        <div className="sbs-brand">
          <button type="button" className="sbs-brand-btn" onClick={(event) => handleNavClick(event, "overview")} title="Home">
            <DsaBrandMark />
            {!isCollapsed && <strong>GenAI<em>Academy</em></strong>}
          </button>
          <button
            type="button"
            className="sbs-collapse"
            onClick={() => setIsCollapsed((c) => !c)}
            title={isCollapsed ? "Expand" : "Collapse"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Search */}
        <button type="button" className="sbs-search" onClick={openSearch} title="Search (⌘K)">
          <Search size={15} />
          {!isCollapsed && <><span>Search everything</span><kbd>⌘ K</kbd></>}
        </button>

        {/* Nav */}
        <nav className="sbs-nav" aria-label="Primary navigation">
          {sidebarGroups.map((group) => {
            const groupDraggable = sidebarEditable && group.id !== "admin";
            const holdsActive = group.items.some((item) => item.id === activeNavId);
            // A single-entry section is just a row — framing it as an accordion
            // for one child is the noise the DSA rail deliberately avoids.
            const isFlat = group.items.length === 1 && !groupDraggable;
            const open = groupOverrides[group.id] ?? holdsActive;

            if (isCollapsed) {
              return (
                <div className="sbs-group is-rail" key={group.id}>
                  {group.items.map((item) => renderItem(item, group.id, { nested: false }))}
                </div>
              );
            }

            if (isFlat) {
              return (
                <div
                  className="sbs-group"
                  key={group.id}
                  onDragOver={groupDraggable ? handleDragOverTarget : undefined}
                  onDrop={groupDraggable ? (event) => handleGroupDrop(event, group.id) : undefined}
                >
                  {group.items.map((item) => renderItem(item, group.id, { nested: false }))}
                </div>
              );
            }

            return (
              <div
                key={group.id}
                className={`sbs-group sbs-accordion${open ? " is-open" : ""}${holdsActive ? " is-active" : ""}${groupDraggable && draggedItem ? " is-drop-target" : ""}`}
                onDragOver={groupDraggable ? handleDragOverTarget : undefined}
                onDrop={groupDraggable ? (event) => handleGroupDrop(event, group.id) : undefined}
              >
                <div className="sbs-group-head">
                  <button
                    type="button"
                    className="sbs-item sbs-group-toggle"
                    onClick={() => setGroupOverrides((prev) => ({ ...prev, [group.id]: !open }))}
                    aria-expanded={open}
                  >
                    <span className="sbs-group-dot" aria-hidden="true" />
                    <span>{group.label}</span>
                    <ChevronDown size={14} className={`sbs-chevron${open ? " is-open" : ""}`} />
                  </button>
                  {groupDraggable && group.custom && (
                    <span className="sbs-group-actions">
                      <button type="button" title="Rename section" onClick={() => handleRenameSection(group.id, group.label)}><Pencil size={11} /></button>
                      <button type="button" title="Delete section" onClick={() => handleDeleteSection(group.id, group.label, group.items.map((item) => item.id))}><Trash2 size={11} /></button>
                    </span>
                  )}
                </div>
                {open && (
                  <div className="sbs-subnav">
                    {group.items.map((item) => renderItem(item, group.id, { nested: true }))}
                    {groupDraggable && group.items.length === 0 && <div className="sbs-empty">Drop items here</div>}
                  </div>
                )}
              </div>
            );
          })}

          {sidebarEditable && (
            <button type="button" className="sbs-add-section" onClick={handleAddSection}>
              <Plus size={13} /> Add section
            </button>
          )}
        </nav>

        {/* Study paths */}
        {pathList.length > 0 && (
          <div className={`sbs-paths${isCollapsed ? " is-rail" : ""}`}>
            {!isCollapsed && (
              <button
                type="button"
                className="sbs-paths-head"
                onClick={togglePathsHidden}
                title={pathsHidden ? "Show study paths" : "Hide study paths"}
                aria-expanded={!pathsHidden}
              >
                <Compass size={12} />
                <span>Study paths</span>
                {pathsHidden && <b>{pathList.length}</b>}
                <ChevronDown size={12} className={`sbs-chevron${pathsHidden ? "" : " is-open"}`} />
              </button>
            )}
            {(!pathsHidden || isCollapsed) && (
              <div className="sbs-paths-list">
                {pathList.map((path) => {
                  const active = activePath === path.key;
                  const selectPath = () => {
                    setActivePath(path.key);
                    if (setActiveNode) setActiveNode(null);
                    if (setActiveModule) setActiveModule(null);
                    if (setActiveTopic) setActiveTopic(null);
                    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  };
                  if (isCollapsed) {
                    return (
                      <button
                        key={path.key}
                        type="button"
                        className={`sbs-path-dot${active ? " is-current" : ""}`}
                        onClick={selectPath}
                        title={`${path.label} · ${path.progressPercent}%`}
                        style={{ "--path-color": path.color }}
                      >
                        {path.label.charAt(0)}
                      </button>
                    );
                  }
                  return (
                    <div
                      key={path.key}
                      id={`sidebar-path-${path.key}`}
                      className={`sbs-path${active ? " is-current" : ""}`}
                      style={{ "--path-color": path.color }}
                    >
                      <button type="button" className="sbs-path-btn" onClick={selectPath}>
                        <span className="sbs-path-top">
                          <span className="sbs-path-name">{path.label}</span>
                          <span className="sbs-path-pct">{path.progressPercent}%</span>
                        </span>
                        <span className="sbs-path-track"><i style={{ width: `${path.progressPercent}%` }} /></span>
                        <span className="sbs-path-badge">{path.badge}</span>
                      </button>
                      {isEditMode && active && onEditPath && (
                        <button type="button" className="sbs-path-edit" title="Path settings" onClick={() => onEditPath(paths[path.key])}><Pencil size={11} /></button>
                      )}
                    </div>
                  );
                })}
                {!isCollapsed && isEditMode && onAddPath && (
                  <button type="button" className="sbs-path-add" onClick={onAddPath}><Plus size={12} /> New path</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="sbs-footer" ref={footerRef}>
          <button type="button" className="sbs-theme" onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <button
            type="button"
            className={`sbs-account${showSettings ? " is-open" : ""}`}
            onClick={() => setShowSettings((value) => !value)}
            title="Settings & account"
          >
            <UserCircle2 size={22} />
            {!isCollapsed && <span><b>{displayName}</b><small>{displayEmail}</small></span>}
            {!isCollapsed && <ChevronRight size={14} />}
          </button>

          {showSettings && (
            <div className="sbs-menu">
              <div className="sbs-menu-head">
                <span>Workspace</span>
                <button type="button" onClick={() => setShowSettings(false)} aria-label="Close menu"><X size={13} /></button>
              </div>

              {isAdmin && (
                <div className="sbs-menu-row is-static">
                  <Shield size={14} />
                  <span>Admin view</span>
                  <span
                    className={`sbs-switch${isAdminView ? " is-on" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const next = !isAdminView;
                      setIsAdminView(next);
                      localStorage.setItem("genai_isAdminView", next.toString());
                    }}
                  >
                    <i />
                  </span>
                </div>
              )}

              <button type="button" className={`sbs-menu-row${isEditMode ? " is-current" : ""}`} onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
                <span>{isEditMode ? "Edit mode on" : "View mode"}</span>
              </button>

              <button type="button" className="sbs-menu-row" onClick={() => { setAppearanceInitialTab("presets"); setShowAppearance(true); setShowSettings(false); }}>
                <Palette size={14} /><span>Appearance</span>
              </button>

              <button type="button" className="sbs-menu-row" onClick={() => { setAppearanceInitialTab("apibeam"); setShowAppearance(true); setShowSettings(false); }}>
                <PackageOpen size={14} /><span>Extension setup</span>
              </button>

              <button type="button" className={`sbs-menu-row${resetConfirm ? " is-danger" : ""}`} onClick={handleResetClick}>
                <RotateCcw size={14} /><span>{resetConfirm ? "Confirm reset" : "Reset data"}</span>
              </button>

              <div className="sbs-menu-divider" />
              <div className="sbs-menu-kicker">Personal AI credentials</div>
              <p className="sbs-menu-note">Used by Atlas and every built-in AI tool. Keys never leave this browser.</p>

              <div className="sbs-cred">
                <div className="sbs-cred-provider">
                  <ProviderIcon providerId={localProvider} size={16} />
                  <select value={localProvider} onChange={(event) => setLocalProvider(event.target.value)} className="sbs-cred-field">
                    {AI_PROVIDER_LIST.map((provider) => (
                      <option key={provider.id} value={provider.id}>{provider.label}</option>
                    ))}
                  </select>
                </div>
                {providerMeta.fields.map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={localFields[field.name] || ""}
                    onChange={(event) => setField(field.name, event.target.value)}
                    className="sbs-cred-field is-mono"
                  />
                ))}
                <button type="button" className="sbs-cred-save" onClick={saveProviderConfig}>Save config</button>
                {providerMeta.docsUrl && (
                  <a className="sbs-cred-link" href={providerMeta.docsUrl} target="_blank" rel="noopener noreferrer">
                    Get key <ExternalLink size={10} />
                  </a>
                )}
              </div>

              <div className="sbs-menu-divider" />
              <button type="button" className="sbs-menu-row is-logout" onClick={onSignOut}>
                <LogOut size={14} /><span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {showAppearance && <AppearanceSettings initialTab={appearanceInitialTab} onClose={() => setShowAppearance(false)} />}
    </>
  );
}

const styles = `
  @font-face {
    font-family: "Plus Jakarta Sans SBS";
    src: url("${jakartaFont}") format("woff2");
    font-style: normal;
    font-weight: 200 800;
    font-display: swap;
  }

  /* Tokens lifted from styles/DsaHub.css so this rail is the same surface as the
     DSA workspace, without depending on that stylesheet being loaded. */
  .sb-studio.sidebar {
    --sbs-rail: #131213;
    --sbs-surface: #141414;
    --sbs-surface-2: #181818;
    --sbs-inset: #0e0e0f;
    --sbs-hover: #222225;
    --sbs-border: #27272a;
    --sbs-border-soft: #232326;
    --sbs-border-strong: #3f3f46;
    --sbs-text: #fcfcfc;
    --sbs-copy: #d4d4d8;
    --sbs-muted: #a1a1aa;
    --sbs-dim: #71717a;
    --sbs-purple: #ac84eb;
    --sbs-accent-ink: #d3b9f7;
    --sbs-danger: #f87171;

    width: 236px;
    min-width: 236px;
    height: 100%;
    max-height: 100%;
    padding: 0;
    gap: 0;
    display: flex;
    flex-direction: column;
    overflow: visible;
    color: var(--sbs-text);
    color-scheme: dark;
    font-family: "Plus Jakarta Sans SBS", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    /* !important: .panel-glass in global.css claims .sidebar with !important and
       would repaint this rail with the glass surface it was never designed for. */
    background: var(--sbs-rail) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-right: 1px solid var(--sbs-border) !important;
    /* The topology pass in global.css hangs a 70px black shadow off every
       .sidebar; it smears grey across a light canvas and the DSA rail has none. */
    box-shadow: none;
  }
  .sb-studio.sb-collapsed { width: 76px; min-width: 76px; }
  .sb-studio *, .sb-studio *::before, .sb-studio *::after { box-sizing: border-box; }
  .sb-studio button, .sb-studio input, .sb-studio select { font: inherit; }
  .sb-studio button { -webkit-tap-highlight-color: transparent; outline: none; }
  .sb-studio button:focus-visible, .sb-studio input:focus-visible, .sb-studio select:focus-visible {
    outline: 2px solid var(--sbs-purple);
    outline-offset: 2px;
  }

  /* ── Brand ───────────────────────────────────────────── */
  .sb-studio .sbs-brand {
    height: 72px; flex: 0 0 72px;
    display: flex; align-items: center; gap: 8px;
    padding: 0 12px 0 14px;
  }
  .sb-studio .sbs-brand-btn {
    min-width: 0; flex: 1;
    display: flex; align-items: center; gap: 10px;
    padding: 0; border: 0; background: transparent; color: var(--sbs-text);
    cursor: pointer; text-align: left;
  }
  .sb-studio .dsa-brand-mark { display: inline-flex; flex: 0 0 auto; width: 34px; height: 34px; }
  .sb-studio .dsa-brand-mark img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .sb-studio .dsa-brand-mark .dsa-brand-mark-light { display: none; }
  .sb-studio .sbs-brand-btn strong {
    min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: 15.5px; font-weight: 700; letter-spacing: -0.4px; line-height: 1.1;
  }
  .sb-studio .sbs-brand-btn strong em { font-style: normal; color: var(--sbs-purple); }
  .sb-studio .sbs-collapse {
    width: 30px; height: 30px; flex: 0 0 auto;
    display: grid; place-items: center;
    border: 1px solid var(--sbs-border); border-radius: 8px;
    background: var(--sbs-surface); color: var(--sbs-muted); cursor: pointer;
    transition: color .15s ease, background .15s ease, border-color .15s ease;
  }
  .sb-studio .sbs-collapse:hover { color: var(--sbs-text); background: var(--sbs-hover); border-color: var(--sbs-border-strong); }
  .sb-studio.sb-collapsed .sbs-brand { padding: 0 10px; justify-content: center; }
  .sb-studio.sb-collapsed .sbs-brand-btn { flex: 0 0 auto; }
  .sb-studio.sb-collapsed .sbs-collapse { position: absolute; top: 54px; right: -13px; z-index: 3; border-radius: 50%; width: 26px; height: 26px; }

  /* ── Search ──────────────────────────────────────────── */
  .sb-studio .sbs-search {
    height: 38px; flex: 0 0 38px;
    margin: 12px 10px 4px;
    display: flex; align-items: center; gap: 9px;
    padding: 0 9px 0 12px;
    border: 1px solid var(--sbs-border); border-radius: 10px;
    background: var(--sbs-surface-2); color: var(--sbs-dim);
    font-size: 11px; cursor: pointer;
    transition: border-color .15s ease, color .15s ease;
  }
  .sb-studio .sbs-search:hover { border-color: var(--sbs-border-strong); color: var(--sbs-copy); }
  .sb-studio .sbs-search span { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
  .sb-studio .sbs-search kbd {
    padding: 3px 6px; border: 1px solid var(--sbs-border); border-radius: 6px;
    background: var(--sbs-inset); color: var(--sbs-dim); font-size: 9px; font-family: inherit;
  }
  .sb-studio.sb-collapsed .sbs-search { margin: 12px auto 4px; width: 40px; justify-content: center; padding: 0; }

  /* ── Nav ─────────────────────────────────────────────── */
  .sb-studio .sbs-nav {
    flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;
    padding: 8px 10px 12px;
    scrollbar-width: thin; scrollbar-color: var(--sbs-border-strong) transparent;
  }
  .sb-studio .sbs-nav::-webkit-scrollbar { width: 6px; }
  .sb-studio .sbs-nav::-webkit-scrollbar-thumb { background: var(--sbs-border-strong); border-radius: 3px; }
  .sb-studio .sbs-group { display: grid; gap: 1px; }
  .sb-studio.sb-collapsed .sbs-nav { padding: 8px 8px 12px; }
  .sb-studio.sb-collapsed .sbs-item { justify-content: center; padding: 0; }
  .sb-studio.sb-collapsed .sbs-item.is-current::before { height: 22px; }
  .sb-studio.sb-collapsed .sbs-group + .sbs-group { margin-top: 10px; }

  .sb-studio .sbs-item {
    position: relative;
    width: 100%; min-height: 40px;
    display: flex; align-items: center; gap: 10px;
    padding: 0 11px;
    border: 1px solid transparent; border-radius: 9px;
    background: transparent; color: var(--sbs-muted);
    font-size: 11.5px; font-weight: 550; text-align: left; cursor: pointer;
    transition: color .14s ease, background .14s ease;
  }
  .sb-studio .sbs-item > svg { flex: 0 0 auto; }
  .sb-studio .sbs-item > span { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sb-studio .sbs-item:hover { color: var(--sbs-text); background: var(--sbs-hover); }
  .sb-studio .sbs-item.is-current { color: var(--sbs-text); background: var(--sbs-hover); }
  .sb-studio .sbs-item.is-dragging { opacity: .45; }
  .sb-studio .sbs-item.is-editable { cursor: grab; }
  .sb-studio .sbs-grip { display: inline-flex; margin-left: -4px; color: var(--sbs-dim); }
  .sb-studio .sbs-admin-badge, .sb-studio .sbs-info {
    display: inline-flex; flex: 0 0 auto; color: var(--sbs-dim); opacity: 0;
    transition: opacity .14s ease, color .14s ease;
  }
  .sb-studio .sbs-admin-badge { opacity: 1; color: var(--sbs-purple); }
  .sb-studio .sbs-item:hover .sbs-info { opacity: 1; }
  .sb-studio .sbs-info:hover { color: var(--sbs-purple); }

  /* Active rows carry the accent as a left seam, matching the DSA question rows. */
  .sb-studio .sbs-item.is-current::before {
    content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 2px; height: 18px; border-radius: 0 2px 2px 0; background: var(--sbs-purple);
  }
  .sb-studio .sbs-item.is-current > svg:first-of-type { color: var(--sbs-purple); }

  /* ── Accordion sections ──────────────────────────────── */
  .sb-studio .sbs-accordion { margin: 2px 0; }
  /* The open section reads as a raised block rather than a framed one — the
     rail carries no structural rules. */
  .sb-studio .sbs-accordion.is-active {
    margin: 4px 0 8px;
    border-radius: 10px; overflow: hidden;
    background: rgba(255, 255, 255, 0.028);
  }
  .sb-studio .sbs-accordion.is-drop-target { border: 1px dashed var(--sbs-purple); border-radius: 10px; }
  .sb-studio .sbs-group-head { position: relative; display: flex; align-items: center; }
  .sb-studio .sbs-group-toggle { text-transform: none; letter-spacing: .1px; }
  .sb-studio .sbs-accordion.is-active > .sbs-group-head > .sbs-group-toggle {
    border-radius: 0; background: var(--sbs-border); color: var(--sbs-text);
  }
  .sb-studio .sbs-item > span.sbs-group-dot {
    width: 6px; height: 6px; flex: 0 0 6px; margin: 0 5px;
    border-radius: 50%; background: var(--sbs-border-strong);
  }
  .sb-studio .sbs-accordion.is-active .sbs-item > span.sbs-group-dot { background: var(--sbs-purple); }
  .sb-studio .sbs-chevron { flex: 0 0 auto; color: var(--sbs-dim); transition: transform .18s ease; }
  .sb-studio .sbs-chevron.is-open { transform: rotate(180deg); }
  .sb-studio .sbs-group-actions { position: absolute; right: 34px; display: flex; gap: 2px; }
  .sb-studio .sbs-group-actions button {
    width: 22px; height: 22px; display: grid; place-items: center;
    border: 0; border-radius: 6px; background: transparent; color: var(--sbs-dim); cursor: pointer;
  }
  .sb-studio .sbs-group-actions button:hover { background: var(--sbs-hover); color: var(--sbs-text); }
  .sb-studio .sbs-subnav { display: grid; gap: 1px; padding: 6px 7px 7px; }
  .sb-studio .sbs-accordion:not(.is-active) .sbs-subnav { padding: 4px 0 6px 12px; }
  .sb-studio .sbs-item-nested { min-height: 34px; padding: 0 10px; border-radius: 7px; font-size: 11px; font-weight: 500; }
  .sb-studio .sbs-item-nested:hover, .sb-studio .sbs-item-nested.is-current { background: rgba(255, 255, 255, 0.05); color: var(--sbs-text); }
  .sb-studio .sbs-empty {
    padding: 10px; border: 1px dashed var(--sbs-border-strong); border-radius: 8px;
    color: var(--sbs-dim); font-size: 10px; text-align: center;
  }
  .sb-studio .sbs-add-section {
    width: 100%; min-height: 34px; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    border: 1px dashed var(--sbs-border-strong); border-radius: 8px;
    background: transparent; color: var(--sbs-muted); font-size: 10.5px; cursor: pointer;
  }
  .sb-studio .sbs-add-section:hover { color: var(--sbs-purple); border-color: var(--sbs-purple); }

  /* ── Study paths ─────────────────────────────────────── */
  .sb-studio .sbs-paths { flex: 0 0 auto; padding: 10px 10px 8px; }
  .sb-studio .sbs-paths-head {
    width: 100%; min-height: 28px;
    display: flex; align-items: center; gap: 7px;
    padding: 0 4px; border: 0; background: transparent;
    color: var(--sbs-dim); font-size: 9.5px; font-weight: 650;
    letter-spacing: .8px; text-transform: uppercase; cursor: pointer;
  }
  .sb-studio .sbs-paths-head span { min-width: 0; flex: 1; text-align: left; }
  .sb-studio .sbs-paths-head b { padding: 1px 6px; border-radius: 20px; background: var(--sbs-surface-2); color: var(--sbs-muted); font-size: 9px; }
  .sb-studio .sbs-paths-list { display: grid; gap: 4px; margin-top: 4px; }
  .sb-studio .sbs-path { position: relative; }
  .sb-studio .sbs-path-btn {
    width: 100%; display: grid; gap: 5px;
    padding: 8px 10px;
    border: 1px solid var(--sbs-border-soft); border-radius: 9px;
    background: var(--sbs-surface); color: var(--sbs-muted);
    text-align: left; cursor: pointer;
    transition: border-color .15s ease, background .15s ease;
  }
  .sb-studio .sbs-path-btn:hover { border-color: var(--sbs-border-strong); }
  .sb-studio .sbs-path.is-current .sbs-path-btn {
    border-color: color-mix(in srgb, var(--path-color, var(--sbs-purple)) 55%, transparent);
    background: color-mix(in srgb, var(--path-color, var(--sbs-purple)) 10%, var(--sbs-surface));
  }
  .sb-studio .sbs-path-top { display: flex; align-items: center; gap: 8px; }
  .sb-studio .sbs-path-name { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--sbs-copy); font-size: 11px; font-weight: 600; }
  .sb-studio .sbs-path.is-current .sbs-path-name { color: var(--sbs-text); }
  .sb-studio .sbs-path-pct { color: var(--path-color, var(--sbs-purple)); font-size: 9.5px; font-weight: 700; }
  .sb-studio .sbs-path-track { display: block; height: 3px; border-radius: 3px; background: var(--sbs-inset); overflow: hidden; }
  .sb-studio .sbs-path-track i { display: block; height: 100%; border-radius: 3px; background: var(--path-color, var(--sbs-purple)); transition: width .5s ease; }
  .sb-studio .sbs-path-badge { display: block; color: var(--sbs-dim); font-size: 9px; }
  .sb-studio .sbs-path-edit {
    position: absolute; top: 6px; right: 6px;
    width: 22px; height: 22px; display: grid; place-items: center;
    border: 1px solid var(--sbs-border); border-radius: 6px;
    background: var(--sbs-surface-2); color: var(--sbs-muted); cursor: pointer;
  }
  .sb-studio .sbs-path-add {
    min-height: 30px; display: flex; align-items: center; justify-content: center; gap: 6px;
    border: 1px dashed var(--sbs-border-strong); border-radius: 8px;
    background: transparent; color: var(--sbs-muted); font-size: 10px; cursor: pointer;
  }
  .sb-studio .sbs-paths.is-rail { padding: 8px; }
  .sb-studio .sbs-paths.is-rail .sbs-paths-list { justify-items: center; }
  .sb-studio .sbs-path-dot {
    width: 34px; height: 34px; display: grid; place-items: center;
    border: 1px solid var(--sbs-border); border-radius: 9px;
    background: var(--sbs-surface); color: var(--sbs-muted);
    font-size: 12px; font-weight: 700; cursor: pointer;
  }
  .sb-studio .sbs-path-dot.is-current {
    border-color: var(--path-color, var(--sbs-purple));
    color: var(--path-color, var(--sbs-purple));
    background: color-mix(in srgb, var(--path-color, var(--sbs-purple)) 14%, var(--sbs-surface));
  }

  /* ── Footer ──────────────────────────────────────────── */
  .sb-studio .sbs-footer {
    position: relative; flex: 0 0 auto;
    display: grid; gap: 4px;
    padding: 7px 8px 10px;
  }
  .sb-studio .sbs-theme, .sb-studio .sbs-account {
    min-height: 36px; display: flex; align-items: center; gap: 9px;
    padding: 0 9px; border: 1px solid transparent; border-radius: 8px;
    background: transparent; color: var(--sbs-muted);
    font-size: 10.5px; text-align: left; cursor: pointer;
    transition: color .14s ease, background .14s ease, border-color .14s ease;
  }
  .sb-studio .sbs-theme:hover { color: var(--sbs-text); background: var(--sbs-hover); }
  .sb-studio .sbs-account { min-height: 44px; border-color: var(--sbs-border); color: var(--sbs-copy); background: var(--sbs-surface); }
  .sb-studio .sbs-account:hover, .sb-studio .sbs-account.is-open { border-color: var(--sbs-border-strong); background: var(--sbs-surface-2); }
  .sb-studio .sbs-account > span { min-width: 0; flex: 1; }
  .sb-studio .sbs-account b, .sb-studio .sbs-account small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sb-studio .sbs-account b { font-size: 10.5px; font-weight: 650; color: var(--sbs-text); }
  .sb-studio .sbs-account small { margin-top: 2px; color: var(--sbs-dim); font-size: 9px; }
  .sb-studio.sb-collapsed .sbs-theme, .sb-studio.sb-collapsed .sbs-account { justify-content: center; padding: 0; }

  /* ── Account menu ────────────────────────────────────── */
  .sb-studio .sbs-menu {
    position: absolute; left: 8px; right: 8px; bottom: calc(100% - 2px);
    z-index: 60;
    max-height: min(70vh, 520px); overflow-y: auto;
    display: grid; gap: 2px;
    padding: 8px;
    border: 1px solid var(--sbs-border); border-radius: 12px;
    background: var(--sbs-surface);
    box-shadow: 0 24px 48px rgba(0, 0, 0, .55);
    scrollbar-width: thin; scrollbar-color: var(--sbs-border-strong) transparent;
  }
  .sb-studio.sb-collapsed .sbs-menu { right: auto; width: 244px; }
  .sb-studio .sbs-menu-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 2px 6px 6px;
    color: var(--sbs-dim); font-size: 9px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .sb-studio .sbs-menu-head button { width: 22px; height: 22px; display: grid; place-items: center; border: 0; border-radius: 6px; background: transparent; color: var(--sbs-dim); cursor: pointer; }
  .sb-studio .sbs-menu-head button:hover { background: var(--sbs-hover); color: var(--sbs-text); }
  .sb-studio .sbs-menu-row {
    width: 100%; min-height: 34px; display: flex; align-items: center; gap: 9px;
    padding: 0 8px; border: 0; border-radius: 7px;
    background: transparent; color: var(--sbs-copy);
    font-size: 11px; text-align: left; cursor: pointer;
  }
  .sb-studio .sbs-menu-row > span { min-width: 0; flex: 1; }
  .sb-studio .sbs-menu-row:hover:not(.is-static) { background: var(--sbs-hover); color: var(--sbs-text); }
  .sb-studio .sbs-menu-row.is-static { cursor: default; }
  .sb-studio .sbs-menu-row.is-current { color: var(--sbs-accent-ink); }
  .sb-studio .sbs-menu-row.is-danger, .sb-studio .sbs-menu-row.is-logout:hover { color: var(--sbs-danger); }
  .sb-studio .sbs-switch {
    width: 32px; height: 18px; flex: 0 0 auto; padding: 2px;
    border-radius: 20px; background: var(--sbs-border-strong); cursor: pointer;
    transition: background .18s ease;
  }
  .sb-studio .sbs-switch.is-on { background: var(--sbs-purple); }
  .sb-studio .sbs-switch i { display: block; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .18s ease; }
  .sb-studio .sbs-switch.is-on i { transform: translateX(14px); }
  .sb-studio .sbs-menu-divider { height: 1px; margin: 6px 4px; background: var(--sbs-border); }
  .sb-studio .sbs-menu-kicker { padding: 0 6px; color: var(--sbs-muted); font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .sb-studio .sbs-menu-note { margin: 4px 6px 6px; color: var(--sbs-dim); font-size: 9.5px; line-height: 1.5; }
  .sb-studio .sbs-cred { display: grid; gap: 6px; padding: 0 4px 2px; }
  .sb-studio .sbs-cred-provider { display: flex; align-items: center; gap: 7px; }
  .sb-studio .sbs-cred-field {
    width: 100%; min-width: 0; min-height: 32px;
    padding: 0 9px; border: 1px solid var(--sbs-border); border-radius: 7px;
    background: var(--sbs-inset); color: var(--sbs-text); font-size: 10.5px;
  }
  .sb-studio .sbs-cred-field.is-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .sb-studio .sbs-cred-save {
    min-height: 32px; border: 0; border-radius: 7px;
    background: var(--sbs-purple); color: #16111f;
    font-size: 10.5px; font-weight: 700; cursor: pointer;
  }
  .sb-studio .sbs-cred-save:hover { filter: brightness(1.06); }
  .sb-studio .sbs-cred-link { display: inline-flex; align-items: center; gap: 4px; color: var(--sbs-accent-ink); font-size: 9.5px; text-decoration: none; }
  .sb-studio .sbs-cred-link:hover { text-decoration: underline; }

  /* ── Light theme ─────────────────────────────────────── */
  body.light-theme .sb-studio.sidebar {
    --sbs-rail: #fafafa;
    --sbs-surface: #ffffff;
    --sbs-surface-2: #f7f7f8;
    --sbs-inset: #f4f4f5;
    --sbs-hover: #f0f0f2;
    --sbs-border: #e4e4e7;
    --sbs-border-soft: #eeeef0;
    --sbs-border-strong: #d4d4d8;
    --sbs-text: #09090b;
    --sbs-copy: #3f3f46;
    --sbs-muted: #52525b;
    --sbs-dim: #71717a;
    --sbs-purple: #7a3ddb;
    --sbs-accent-ink: #6d31c6;
    --sbs-danger: #c02626;
    color-scheme: light;
  }
  body.light-theme .sb-studio .dsa-brand-mark .dsa-brand-mark-dark { display: none; }
  body.light-theme .sb-studio .dsa-brand-mark .dsa-brand-mark-light { display: block; }
  body.light-theme .sb-studio .sbs-accordion.is-active { background: rgba(9, 9, 11, 0.045); }
  body.light-theme .sb-studio .sbs-item-nested:hover,
  body.light-theme .sb-studio .sbs-item-nested.is-current { background: rgba(0, 0, 0, 0.045); }
  body.light-theme .sb-studio .sbs-menu { box-shadow: 0 18px 44px rgba(9, 9, 11, .16), 0 2px 6px rgba(9, 9, 11, .08); }
  body.light-theme .sb-studio .sbs-cred-save { color: #ffffff; }
  body.light-theme .sb-studio .sbs-switch i { box-shadow: 0 1px 3px rgba(9, 9, 11, .32); }

  /* ── Canvas ──────────────────────────────────────────── */
  /* Two things paint lines behind this rail. The content area ships the
     "topology" canvas — a blue-black gradient plus a dotted blueprint grid and
     vignette, drawn by .app-primary-content and its ::before / ::after late in
     global.css — and Appearance › Background pattern adds a fixed grid/dot/noise
     overlay on body::before. The DSA surface this rail is drawn from has a flat
     canvas, so both are suppressed while this rail is the active variant; the
     legacy and modern rails keep them.
     Matched with :has() rather than a body class, because ThemeContext rewrites
     document.body.className wholesale every time appearance is applied. On mobile
     no rail is mounted at all, so nothing here applies — and nothing shows. */
  body:has(#app-sidebar.sb-studio) .app-primary-content { background: #0f0f0f; }
  body.light-theme:has(#app-sidebar.sb-studio) .app-primary-content { background: #ffffff; }
  body:has(#app-sidebar.sb-studio) .app-primary-content::before,
  body:has(#app-sidebar.sb-studio) .app-primary-content::after,
  body.bg-grid:has(#app-sidebar.sb-studio)::before,
  body.bg-dots:has(#app-sidebar.sb-studio)::before,
  body.bg-noise:has(#app-sidebar.sb-studio)::before {
    display: none !important;
  }

  /* ── Mobile drawer ───────────────────────────────────── */
  @media (max-width: 768px) {
    /* Injected after the global drawer rules, so the rail has to keep itself
       out of the flex row until the mobile menu explicitly opens. */
    .sb-studio.sidebar {
      position: fixed;
      top: var(--mobile-header-height, 56px);
      left: -280px;
      bottom: 0;
      width: 280px;
      min-width: 280px;
      height: calc(100dvh - var(--mobile-header-height, 56px));
      max-height: none;
      z-index: 2100;
      visibility: hidden;
      opacity: 0;
      transition: left 260ms ease, opacity 180ms ease, visibility 0s linear 260ms;
    }
    .sb-studio.sidebar.sidebar-mobile-open {
      left: 0;
      visibility: visible;
      opacity: 1;
      transition: left 260ms ease, opacity 180ms ease;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sb-studio .sbs-chevron, .sb-studio .sbs-path-track i, .sb-studio .sbs-switch i { transition: none !important; }
  }
`;

if (typeof document !== "undefined") {
  const existing = document.getElementById("sb-studio-styles");
  if (existing) existing.remove();
  const styleSheet = document.createElement("style");
  styleSheet.id = "sb-studio-styles";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

/**
 * Memoized for the same reason as SidebarModern: this sits outside the content
 * Suspense boundary and stays mounted for the whole session, while App.jsx
 * re-renders its parent on essentially every state change. Only works because
 * App.jsx passes referentially stable props — keep any new prop stable too.
 */
export default React.memo(SidebarStudio);
