import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Shield, Cpu, Sparkles, Search, ChevronLeft, ChevronRight, ChevronDown,
  Settings2, Sun, Moon, Palette, RotateCcw, LogOut, Eye, Edit3, ExternalLink,
  Plus, Pencil, Trash2, GripVertical, HelpCircle, Compass, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AppearanceSettings from "./AppearanceSettings";
import {
  resolveEffectiveLayout, resolveItemVisibility, SIDEBAR_ITEM_REGISTRY,
} from "../config/sidebarRegistry";
import { getActiveNavId, runNavClick, buildPathList } from "../config/sidebarNav";

const ADMIN_GROUP_ITEMS = [
  { icon: Shield, label: "Admin Panel", id: "admin_management" },
  { icon: Cpu, label: "Algo Studio", id: "algo_studio" },
  { icon: Sparkles, label: "AI Pathfinder", id: "onboarding_chat", description: "Build a learning path around your goals" },
];

const groupVariants = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } } };
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * SidebarModern — the redesigned navigation rail: a "neural console" treatment
 * with a drifting aurora backdrop, a liquid morphing active indicator, magnetic
 * hover tilt, rotating icon rings, and animated progress rings for study paths.
 *
 * Accepts the exact same prop contract as the legacy Sidebar (App.jsx passes
 * them identically), and delegates all click / active-state / path logic to the
 * shared helpers in config/sidebarNav.js so behaviour never diverges. Only the
 * presentation is new.
 */
export default function SidebarModern(props) {
  const {
    activePath, setActivePath, paths,
    isEditMode, setIsEditMode, onAddPath, onEditPath,
    isMobileMenuOpen, setIsMobileMenuOpen,
    setActiveNode, setActiveModule, setActiveTopic,
    onSignOut, onHubNav, onReset,
    isCollapsed, setIsCollapsed,
    onSectionWalkthrough,
  } = props;

  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [ripple, setRipple] = useState(null);
  // User-level preference: hide the Study Paths panel entirely (persisted locally).
  const [pathsHidden, setPathsHidden] = useState(() => localStorage.getItem("genai_sb_pathsHidden") === "1");
  const navRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const {
    isAdmin, isAdminView, setIsAdminView, allowAimlForAll,
    sidebarConfig, persistSidebarConfig,
    geminiKey, updateGeminiKey, aiProvider, updateAiProvider,
    azureEndpoint, updateAzureEndpoint, azureKey, updateAzureKey,
  } = useAuth();

  const [localKey, setLocalKey] = useState(geminiKey || "");
  const [localProvider, setLocalProvider] = useState(aiProvider || "gemini");
  const [localAzureEndpoint, setLocalAzureEndpoint] = useState(azureEndpoint || "");
  const [localAzureKey, setLocalAzureKey] = useState(azureKey || "");

  useEffect(() => {
    setLocalKey(geminiKey || "");
    setLocalProvider(aiProvider || "gemini");
    setLocalAzureEndpoint(azureEndpoint || "");
    setLocalAzureKey(azureKey || "");
  }, [geminiKey, aiProvider, azureEndpoint, azureKey]);

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
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({ id: `${id}-${Date.now()}`, itemId: id, x: event.clientX - rect.left, y: event.clientY - rect.top });
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

  const toggleGroup = (id) => setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const togglePathsHidden = () => {
    setPathsHidden((prev) => {
      const next = !prev;
      localStorage.setItem("genai_sb_pathsHidden", next ? "1" : "0");
      return next;
    });
  };

  // Cursor-following spotlight glow across the nav rail.
  const handleNavPointer = (event) => {
    const el = navRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sb-mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--sb-my", `${event.clientY - rect.top}px`);
  };

  // Lightweight per-item magnetic tilt — reads/writes CSS custom properties
  // directly on the DOM node so it never triggers a React re-render.
  const handleItemTilt = (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${py * -7}deg`);
    el.style.setProperty("--tilt-y", `${px * 7}deg`);
    el.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
  };
  const resetItemTilt = (event) => {
    const el = event.currentTarget;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  const openSearch = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  return (
    <>
      <aside className={`sidebar sb-modern${isCollapsed ? " sb-collapsed sidebar-collapsed" : ""}${isMobileMenuOpen ? " sidebar-mobile-open" : ""}`}>
        <div className="sb-aurora" aria-hidden="true">
          <span className="sb-aurora-blob sb-aurora-1" />
          <span className="sb-aurora-blob sb-aurora-2" />
          <span className="sb-aurora-blob sb-aurora-3" />
          <span className="sb-aurora-grid" />
          <span className="sb-aurora-scan" />
        </div>

        {/* Header */}
        <div className="sb-header">
          <button className="sb-brand" onClick={(e) => handleNavClick(e, "overview")} title="Home">
            <span className="sb-logo-ring">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="sb-quantum">
                <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-30 50 50)" className="sb-orbit" />
                <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(30 50 50)" className="sb-orbit" />
                <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(90 50 50)" className="sb-orbit" />
                <circle r="2.6" className="sb-orbit-node sb-orbit-node-1" />
                <circle r="2.6" className="sb-orbit-node sb-orbit-node-2" />
                <path d="M50 35L63 42.5V57.5L50 65L37 57.5V42.5L50 35Z" className="sb-nucleus" />
                <circle cx="50" cy="50" r="4" className="sb-core" />
              </svg>
            </span>
            {!isCollapsed && (
              <span className="sb-wordmark">
                <span className="sb-wordmark-1">GenAI</span>
                <span className="sb-wordmark-2">
                  Academy
                  <span className="sb-pulse-bars" aria-hidden="true">
                    <i /><i /><i /><i />
                  </span>
                </span>
              </span>
            )}
          </button>
          <button
            className="sb-collapse"
            onClick={() => setIsCollapsed((c) => !c)}
            title={isCollapsed ? "Expand" : "Collapse"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Search */}
        <button className="sb-search" onClick={openSearch} title="Search (⌘K)">
          <span className="sb-search-ring" aria-hidden="true" />
          <Search size={15} className="sb-search-icon" />
          {!isCollapsed && (
            <>
              <span className="sb-search-label">Search everything</span>
              <kbd className="sb-kbd">⌘K</kbd>
            </>
          )}
        </button>

        {/* Nav */}
        <div className="sb-nav" ref={navRef} onMouseMove={handleNavPointer}>
          {sidebarGroups.map((group) => {
            const isAdminGroup = group.id === "admin";
            const groupDraggable = sidebarEditable && !isAdminGroup;
            const groupCollapsed = !!collapsedGroups[group.id];
            return (
              <div
                key={group.id}
                className={`sb-group${groupDraggable && draggedItem ? " sb-group-drop" : ""}`}
                onDragOver={groupDraggable ? handleDragOverTarget : undefined}
                onDrop={groupDraggable ? (event) => handleGroupDrop(event, group.id) : undefined}
              >
                {!isCollapsed && (
                  <div className="sb-group-head">
                    <button className="sb-group-toggle" onClick={() => toggleGroup(group.id)} aria-expanded={!groupCollapsed}>
                      <ChevronDown size={11} className={`sb-group-chevron${groupCollapsed ? " is-collapsed" : ""}`} />
                      <span>{group.label}</span>
                      <span className="sb-group-rule" />
                    </button>
                    {groupDraggable && group.custom && (
                      <span className="sb-group-actions">
                        <button type="button" title="Rename section" onClick={() => handleRenameSection(group.id, group.label)}><Pencil size={11} /></button>
                        <button type="button" title="Delete section" onClick={() => handleDeleteSection(group.id, group.label, group.items.map((i) => i.id))}><Trash2 size={11} /></button>
                      </span>
                    )}
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {(!groupCollapsed || isCollapsed) && (
                    <motion.div
                      className="sb-group-items"
                      key={isCollapsed ? "collapsed" : "expanded"}
                      variants={groupVariants}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      {group.items.map((item) => {
                        const active = activeNavId === item.id;
                        const itemDraggable = groupDraggable;
                        const isAdminOnly = sidebarEditable && resolveItemVisibility(item.id, { overrides: sidebarConfig?.overrides, allowAimlForAll }) === "admin";
                        return (
                          <motion.button
                            key={item.id}
                            variants={itemVariants}
                            id={`sidebar-item-${item.id}`}
                            className={`sb-item${active ? " is-active" : ""}${itemDraggable ? " is-editable" : ""}${draggedItem?.id === item.id ? " is-dragging" : ""}`}
                            onClick={(e) => handleNavClick(e, item.id)}
                            onMouseMove={!isCollapsed ? handleItemTilt : undefined}
                            onMouseLeave={!isCollapsed ? resetItemTilt : undefined}
                            data-label={item.label}
                            title={isCollapsed ? item.label : (item.description || item.label)}
                            draggable={itemDraggable}
                            onDragStart={itemDraggable ? (event) => handleItemDragStart(event, item.id, group.id) : undefined}
                            onDragEnd={itemDraggable ? () => setDraggedItem(null) : undefined}
                            onDragOver={itemDraggable ? handleDragOverTarget : undefined}
                            onDrop={itemDraggable ? (event) => handleItemDrop(event, group.id, item.id) : undefined}
                          >
                            {active && (
                              <motion.span
                                layoutId="sb-active-pill"
                                className="sb-active-pill"
                                transition={{ type: "spring", stiffness: 480, damping: 38 }}
                              >
                                <span className="sb-active-shine" />
                              </motion.span>
                            )}
                            <span className="sb-item-glow" aria-hidden="true" />
                            {itemDraggable && <span className="sb-grip"><GripVertical size={13} /></span>}
                            <span className={`sb-icon-ring${active ? " is-active" : ""}`}>
                              <span className="sb-item-icon"><item.icon size={16} /></span>
                            </span>
                            {!isCollapsed && <span className="sb-item-label">{item.label}</span>}
                            {!isCollapsed && isAdminOnly && (
                              <span className="sb-admin-badge" title="Admin only — change in Admin Panel › Sidebar"><Shield size={11} /></span>
                            )}
                            {!isCollapsed && !isAdminOnly && onSectionWalkthrough && item.id !== "blog" && (
                              <span
                                className="sb-info"
                                role="button"
                                title={`Guide: ${item.label}`}
                                onClick={(e) => { e.stopPropagation(); onSectionWalkthrough(item.id); }}
                              >
                                <HelpCircle size={12} />
                              </span>
                            )}
                            <AnimatePresence>
                              {ripple?.itemId === item.id && (
                                <motion.span
                                  key={ripple.id}
                                  className="sb-ripple"
                                  style={{ left: ripple.x, top: ripple.y }}
                                  initial={{ scale: 0, opacity: 0.5 }}
                                  animate={{ scale: 5, opacity: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.55, ease: "easeOut" }}
                                  onAnimationComplete={() => setRipple((r) => (r?.id === ripple.id ? null : r))}
                                />
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                      {groupDraggable && group.items.length === 0 && (
                        <div className="sb-empty">Drop items here</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {sidebarEditable && (
            <button type="button" className="sb-add-section" onClick={handleAddSection}>
              <Plus size={13} /> Add section
            </button>
          )}
        </div>

        {/* Study paths */}
        {pathList.length > 0 && (
          <div className={`sb-paths${pathsHidden && !isCollapsed ? " is-hidden" : ""}`}>
            {!isCollapsed && (
              <button
                className="sb-paths-label"
                onClick={togglePathsHidden}
                title={pathsHidden ? "Show study paths" : "Hide study paths"}
                aria-expanded={!pathsHidden}
              >
                <Compass size={12} /> <span>Study Paths</span>
                {pathsHidden && <span className="sb-paths-count">{pathList.length}</span>}
                <ChevronDown size={12} className={`sb-paths-caret${pathsHidden ? " is-hidden" : ""}`} />
              </button>
            )}
            <AnimatePresence initial={false}>
            {(!pathsHidden || isCollapsed) && (
            <motion.div
              key="paths-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
            <div className={`sb-paths-list${isCollapsed ? " is-collapsed" : ""}`}>
              {pathList.map((p) => {
                const active = activePath === p.key;
                const selectPath = () => {
                  setActivePath(p.key);
                  if (setActiveNode) setActiveNode(null);
                  if (setActiveModule) setActiveModule(null);
                  if (setActiveTopic) setActiveTopic(null);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                };
                if (isCollapsed) {
                  return (
                    <button
                      key={p.key}
                      className={`sb-path-dot${active ? " is-active" : ""}`}
                      onClick={selectPath}
                      data-label={`${p.label} · ${p.progressPercent}%`}
                      style={{ "--path-color": p.color }}
                    >
                      {p.label.charAt(0)}
                    </button>
                  );
                }
                return (
                  <div key={p.key} id={`sidebar-path-${p.key}`} className={`sb-path${active ? " is-active" : ""}`} style={{ "--path-color": p.color }}>
                    <button className="sb-path-btn" onClick={selectPath}>
                      <span className="sb-path-ring-wrap">
                        <svg viewBox="0 0 36 36" className="sb-path-ring">
                          <circle cx="18" cy="18" r="15" className="sb-path-ring-track" />
                          <motion.circle
                            cx="18" cy="18" r="15"
                            className="sb-path-ring-fill"
                            style={{ stroke: p.color, rotate: -90, transformOrigin: "50% 50%" }}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: p.progressPercent / 100 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          />
                        </svg>
                        <span className="sb-path-ring-pct">{p.progressPercent}</span>
                      </span>
                      <span className="sb-path-info">
                        <span className="sb-path-name">{p.label}</span>
                        <span className="sb-path-badge">{p.badge}</span>
                      </span>
                    </button>
                    {isEditMode && active && onEditPath && (
                      <button className="sb-path-edit" title="Path settings" onClick={() => onEditPath(paths[p.key])}><Pencil size={11} /></button>
                    )}
                  </div>
                );
              })}
              {!isCollapsed && isEditMode && onAddPath && (
                <button className="sb-path-add" onClick={onAddPath}><Plus size={13} /> New path</button>
              )}
            </div>
            </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="sb-footer">
          <button className={`sb-settings-btn${showSettings ? " is-open" : ""}`} onClick={() => setShowSettings((s) => !s)} title="Settings">
            <span className="sb-settings-orb">
              <span className="sb-reactor-ring sb-reactor-ring-1" />
              <span className="sb-reactor-ring sb-reactor-ring-2" />
              <Settings2 size={16} />
            </span>
            {!isCollapsed && <span className="sb-settings-label">Settings & account</span>}
            {!isCollapsed && <ChevronDown size={13} className={`sb-settings-caret${showSettings ? " is-open" : ""}`} />}
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="sb-menu"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sb-menu-head">
                  <span>Workspace</span>
                  <button className="sb-menu-close" onClick={() => setShowSettings(false)}><X size={13} /></button>
                </div>

                {isAdmin && (
                  <div className="sb-menu-row sb-menu-toggle-row">
                    <span className="sb-menu-row-main"><Shield size={14} color={isAdminView ? "var(--neon)" : "var(--text3)"} /> Admin view</span>
                    <span
                      className={`sb-switch${isAdminView ? " is-on" : ""}`}
                      onClick={() => {
                        const next = !isAdminView;
                        setIsAdminView(next);
                        localStorage.setItem("genai_isAdminView", next.toString());
                      }}
                    >
                      <span className="sb-switch-knob" />
                    </span>
                  </div>
                )}

                <button className={`sb-menu-row${isEditMode ? " is-active" : ""}`} onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
                  <span>{isEditMode ? "Edit mode on" : "View mode"}</span>
                </button>

                <button className="sb-menu-row" onClick={toggleTheme}>
                  {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                  <span>{theme === "dark" ? "Dark theme" : "Light theme"}</span>
                </button>

                <button className="sb-menu-row" onClick={() => { setShowAppearance(true); setShowSettings(false); }}>
                  <Palette size={14} /> <span>Appearance</span>
                </button>

                <button className={`sb-menu-row${resetConfirm ? " is-danger" : ""}`} onClick={handleResetClick}>
                  <RotateCcw size={14} className={resetConfirm ? "sb-spin" : ""} />
                  <span>{resetConfirm ? "Confirm reset" : "Reset data"}</span>
                </button>

                <div className="sb-menu-divider" />
                <div className="sb-menu-kicker">Personal AI credentials</div>
                <p className="sb-menu-note">Required for Atlas. Stored only for your signed-in account.</p>

                <div className="sb-cred">
                  <select value={localProvider} onChange={(e) => setLocalProvider(e.target.value)} className="sb-cred-field">
                    <option value="gemini">Google Gemini</option>
                    <option value="azure-openai">Azure OpenAI</option>
                  </select>
                  {localProvider === "gemini" && (
                    <input type="password" placeholder="Paste Gemini key…" value={localKey} onChange={(e) => setLocalKey(e.target.value)} className="sb-cred-field mono" />
                  )}
                  {localProvider === "azure-openai" && (
                    <>
                      <input type="text" placeholder="Azure OpenAI endpoint" value={localAzureEndpoint} onChange={(e) => setLocalAzureEndpoint(e.target.value)} className="sb-cred-field mono" />
                      <input type="password" placeholder="Azure OpenAI key" value={localAzureKey} onChange={(e) => setLocalAzureKey(e.target.value)} className="sb-cred-field mono" />
                    </>
                  )}
                  <button
                    className="sb-cred-save"
                    onClick={() => {
                      updateGeminiKey(localKey);
                      updateAiProvider(localProvider);
                      updateAzureEndpoint(localAzureEndpoint);
                      updateAzureKey(localAzureKey);
                    }}
                  >
                    Save config
                  </button>
                  <div className="sb-cred-foot">
                    <span>Keys stored locally.</span>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Get key <ExternalLink size={10} /></a>
                  </div>
                </div>

                <div className="sb-menu-divider" />
                <button className="sb-menu-row sb-menu-logout" onClick={onSignOut}>
                  <LogOut size={14} /> <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {showAppearance && <AppearanceSettings onClose={() => setShowAppearance(false)} />}
    </>
  );
}

const styles = `
  @property --sb-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }

  .sb-modern.sidebar {
    width: 278px;
    min-width: 278px;
    height: 100%;
    max-height: 100%;
    padding: 0;
    position: relative;
    isolation: isolate;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(28px) saturate(150%);
    -webkit-backdrop-filter: blur(28px) saturate(150%);
    border-right: 1px solid var(--border);
    box-shadow: inset -1px 0 var(--white-4), 24px 0 60px rgba(0,0,0,.18);
    overflow: visible;
    gap: 0;
  }
  .sb-modern.sb-collapsed { width: 78px; min-width: 78px; }
  .sb-modern > * { position: relative; z-index: 1; }
  .sb-modern button { outline: none; }
  .sb-modern button:focus-visible { outline: 2px solid color-mix(in srgb, var(--neon) 70%, transparent); outline-offset: 2px; border-radius: 8px; }

  /* ── Aurora backdrop ─────────────────────────────────── */
  .sb-aurora { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; border-radius: inherit; }
  .sb-aurora-blob {
    position: absolute; width: 60%; padding-top: 60%; border-radius: 50%;
    filter: blur(46px); opacity: .5; mix-blend-mode: screen;
  }
  .sb-aurora-1 { top: -14%; left: -18%; background: radial-gradient(circle, color-mix(in srgb, var(--neon) 65%, transparent), transparent 70%); animation: sb-drift-1 16s ease-in-out infinite; }
  .sb-aurora-2 { bottom: 6%; right: -22%; background: radial-gradient(circle, color-mix(in srgb, #7c5cff 55%, transparent), transparent 70%); animation: sb-drift-2 20s ease-in-out infinite; }
  .sb-aurora-3 { top: 38%; left: 20%; width: 46%; padding-top: 46%; background: radial-gradient(circle, color-mix(in srgb, #ff5cad 40%, transparent), transparent 72%); opacity: .32; animation: sb-drift-3 24s ease-in-out infinite; }
  @keyframes sb-drift-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8%, 12%) scale(1.15); } }
  @keyframes sb-drift-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-10%, -8%) scale(1.1); } }
  @keyframes sb-drift-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-6%, 10%) scale(1.2); } }

  .sb-aurora-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(color-mix(in srgb, var(--text) 5%, transparent) 1px, transparent 1px),
      linear-gradient(90deg, color-mix(in srgb, var(--text) 5%, transparent) 1px, transparent 1px);
    background-size: 26px 26px;
    mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.55) 40%, transparent 78%);
    opacity: .55;
  }
  .sb-aurora-scan {
    position: absolute; left: 0; right: 0; height: 90px;
    background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--neon) 7%, transparent), transparent);
    animation: sb-scan 7s ease-in-out infinite;
  }
  @keyframes sb-scan { 0% { top: -20%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } }

  /* ── Header ──────────────────────────────────────────── */
  .sb-modern .sb-header {
    display: flex; align-items: center; gap: 10px;
    height: 68px; padding: 0 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .sb-modern .sb-brand {
    display: flex; align-items: center; gap: 12px;
    background: none; border: 0; padding: 4px; margin: 0;
    cursor: pointer; flex: 1; min-width: 0; color: var(--text);
  }
  .sb-modern .sb-logo-ring {
    position: relative; width: 38px; height: 38px; flex-shrink: 0;
    display: grid; place-items: center; border-radius: 12px;
    background: linear-gradient(150deg, color-mix(in srgb, var(--neon) 24%, transparent), color-mix(in srgb, #7c5cff 18%, transparent));
    border: 1px solid color-mix(in srgb, var(--neon) 34%, transparent);
    box-shadow: 0 6px 18px color-mix(in srgb, var(--neon) 20%, transparent), inset 0 1px var(--white-15);
  }
  .sb-modern .sb-quantum { width: 24px; height: 24px; }
  .sb-modern .sb-orbit { stroke: var(--neon); stroke-width: 2; opacity: .6; fill: none;
    transform-box: fill-box; transform-origin: center; animation: sb-spin 12s linear infinite; }
  .sb-modern .sb-orbit:nth-child(2) { animation-duration: 8s; animation-direction: reverse; stroke: #7c5cff; }
  .sb-modern .sb-orbit:nth-child(3) { animation-duration: 16s; }
  .sb-modern .sb-orbit-node { fill: var(--neon); transform-box: fill-box; transform-origin: center; offset-path: path("M5,50 A45,18 -30 1,1 95,50 A45,18 -30 1,1 5,50"); animation: sb-orbit-travel 6s linear infinite; filter: drop-shadow(0 0 3px var(--neon)); }
  .sb-modern .sb-orbit-node-2 { fill: #7c5cff; animation-duration: 9s; animation-direction: reverse; filter: drop-shadow(0 0 3px #7c5cff); }
  @keyframes sb-orbit-travel { to { offset-distance: 100%; } }
  .sb-modern .sb-nucleus { fill: color-mix(in srgb, var(--neon) 22%, transparent); stroke: var(--neon); stroke-width: 2; }
  .sb-modern .sb-core { fill: var(--neon); animation: sb-breathe 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes sb-spin { to { transform: rotate(360deg); } }
  @keyframes sb-breathe { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 2px var(--neon)); } 50% { transform: scale(1.35); filter: drop-shadow(0 0 7px var(--neon)); } }

  .sb-modern .sb-wordmark { display: flex; flex-direction: column; line-height: 1.05; min-width: 0; text-align: left; gap: 3px; }
  .sb-modern .sb-wordmark-1 {
    font-size: 15px; font-weight: 800; letter-spacing: -.2px;
    background: linear-gradient(90deg, var(--text) 0%, color-mix(in srgb, var(--neon) 75%, var(--text)) 50%, var(--text) 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    animation: sb-shimmer-text 5s ease-in-out infinite;
  }
  @keyframes sb-shimmer-text { 0%,100% { background-position: 0% 0; } 50% { background-position: 100% 0; } }
  .sb-modern .sb-wordmark-2 { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: var(--text3); }
  .sb-modern .sb-pulse-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 8px; }
  .sb-modern .sb-pulse-bars i { display: block; width: 2px; border-radius: 1px; background: var(--neon); opacity: .7; animation: sb-eq 1.1s ease-in-out infinite; }
  .sb-modern .sb-pulse-bars i:nth-child(1) { height: 40%; animation-delay: 0s; }
  .sb-modern .sb-pulse-bars i:nth-child(2) { height: 90%; animation-delay: .15s; }
  .sb-modern .sb-pulse-bars i:nth-child(3) { height: 60%; animation-delay: .3s; }
  .sb-modern .sb-pulse-bars i:nth-child(4) { height: 75%; animation-delay: .45s; }
  @keyframes sb-eq { 0%,100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } }

  .sb-modern .sb-collapse {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    width: 28px; height: 28px; border-radius: 9px;
    background: var(--white-4); border: 1px solid var(--border);
    color: var(--text3); display: grid; place-items: center; cursor: pointer;
    transition: all .2s cubic-bezier(.175,.885,.32,1.275); z-index: 1001;
  }
  .sb-modern .sb-collapse:hover { background: var(--white-8); color: var(--neon); border-color: color-mix(in srgb, var(--neon) 45%, transparent); box-shadow: 0 0 14px var(--neon-dim); transform: translateY(-50%) scale(1.08); }
  .sb-modern.sb-collapsed .sb-header { justify-content: center; padding: 0; }
  .sb-modern.sb-collapsed .sb-brand { justify-content: center; flex: none; }
  .sb-modern.sb-collapsed .sb-collapse { right: -14px; background: var(--neon); color: #04120b; border-color: transparent; box-shadow: 0 4px 14px var(--neon-dim); }

  /* ── Search ──────────────────────────────────────────── */
  .sb-modern .sb-search {
    position: relative; display: flex; align-items: center; gap: 10px;
    margin: 12px 14px 6px; padding: 0 12px; height: 42px;
    border-radius: 12px; cursor: pointer; overflow: hidden; isolation: isolate;
    background: var(--white-3); border: 1px solid var(--border);
    color: var(--text3); font-size: 12.5px; font-weight: 600;
    transition: color .18s ease, border-color .18s ease;
    width: calc(100% - 28px); box-sizing: border-box;
  }
  .sb-modern .sb-search-ring {
    position: absolute; inset: -60%; z-index: 0;
    background: conic-gradient(from var(--sb-angle), transparent 0 72%, var(--neon) 86%, #7c5cff 92%, transparent 100%);
    animation: sb-angle-spin 5s linear infinite;
    opacity: 0; transition: opacity .25s ease;
  }
  .sb-modern .sb-search::after {
    content: ""; position: absolute; inset: 1px; z-index: 0; border-radius: 11px;
    background: var(--bg2);
  }
  .sb-modern .sb-search:hover, .sb-modern .sb-search:focus-visible { color: var(--text2); }
  .sb-modern .sb-search:hover .sb-search-ring { opacity: .65; }
  @keyframes sb-angle-spin { to { --sb-angle: 360deg; } }
  .sb-modern .sb-search-icon, .sb-modern .sb-search-label, .sb-modern .sb-kbd { position: relative; z-index: 1; }
  .sb-modern .sb-search-label { flex: 1; text-align: left; }
  .sb-modern .sb-kbd {
    font-family: var(--mono, monospace); font-size: 10px; color: var(--text3);
    border: 1px solid var(--border); border-radius: 6px; padding: 2px 6px; background: var(--white-3);
  }
  .sb-modern.sb-collapsed .sb-search { justify-content: center; padding: 0; margin: 12px auto 6px; width: 46px; height: 46px; }

  /* ── Nav ─────────────────────────────────────────────── */
  .sb-modern .sb-nav {
    flex: 1; min-height: 0; overflow-y: auto; overflow-x: visible;
    padding: 6px 12px 12px; position: relative;
    scrollbar-width: thin; scrollbar-color: var(--white-10) transparent;
  }
  .sb-modern .sb-nav::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0; transition: opacity .3s ease;
    background: radial-gradient(200px circle at var(--sb-mx, 50%) var(--sb-my, 0), color-mix(in srgb, var(--neon) 9%, transparent), transparent 70%);
  }
  .sb-modern .sb-nav:hover::before { opacity: 1; }
  .sb-modern .sb-nav::-webkit-scrollbar { width: 8px; }
  .sb-modern .sb-nav::-webkit-scrollbar-thumb { background: var(--white-8); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
  .sb-modern .sb-nav:hover::-webkit-scrollbar-thumb { background: var(--white-15); background-clip: padding-box; }

  .sb-modern .sb-group { margin-bottom: 6px; position: relative; z-index: 1; }
  .sb-modern .sb-group-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 8px 4px; }
  .sb-modern .sb-group-toggle {
    display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;
    background: none; border: 0; padding: 0; cursor: pointer;
    color: var(--text3); font-size: 10px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase;
    transition: color .15s;
  }
  .sb-modern .sb-group-toggle:hover { color: var(--text2); }
  .sb-modern .sb-group-toggle:hover .sb-group-rule { background: linear-gradient(90deg, color-mix(in srgb, var(--neon) 50%, transparent), transparent); }
  .sb-modern .sb-group-rule { flex: 1; height: 1px; background: var(--border); margin-left: 4px; transition: background .2s; }
  .sb-modern .sb-group-chevron { transition: transform .2s ease; opacity: .7; flex-shrink: 0; }
  .sb-modern .sb-group-chevron.is-collapsed { transform: rotate(-90deg); }
  .sb-modern .sb-group-actions { display: flex; gap: 2px; }
  .sb-modern .sb-group-actions button { width: 21px; height: 21px; display: grid; place-items: center; background: none; border: 0; border-radius: 5px; color: var(--text3); cursor: pointer; transition: all .15s; }
  .sb-modern .sb-group-actions button:hover { color: var(--text); background: var(--white-8); }
  .sb-modern .sb-group-items { display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
  .sb-modern .sb-group-drop { outline: 1px dashed color-mix(in srgb, var(--neon) 40%, transparent); outline-offset: 2px; border-radius: 12px; }

  .sb-modern .sb-item {
    position: relative; display: flex; align-items: center; gap: 11px;
    width: 100%; min-height: 42px; padding: 5px 10px; margin: 0;
    border: 0; border-radius: 12px; background: none; cursor: pointer;
    color: var(--text2); font-size: 13px; font-weight: 600; text-align: left;
    overflow: hidden; isolation: isolate;
    transform: perspective(600px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
    transition: color .16s ease, transform .18s cubic-bezier(.16,1,.3,1);
  }
  .sb-modern .sb-item:hover { color: var(--text); }
  .sb-modern .sb-item-glow {
    position: absolute; inset: 0; z-index: 0; opacity: 0; border-radius: 12px;
    background: radial-gradient(90px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--neon) 16%, transparent), transparent 70%);
    transition: opacity .2s ease;
  }
  .sb-modern .sb-item:hover .sb-item-glow { opacity: 1; }
  .sb-modern .sb-item.is-active { color: var(--text); }
  .sb-modern .sb-active-pill {
    position: absolute; inset: 0; z-index: 0; border-radius: 12px; overflow: hidden;
    background: linear-gradient(100deg, color-mix(in srgb, var(--neon) 17%, transparent), color-mix(in srgb, #7c5cff 12%, transparent));
    border: 1px solid color-mix(in srgb, var(--neon) 30%, transparent);
    box-shadow: 0 8px 22px color-mix(in srgb, var(--neon) 16%, transparent), inset 0 1px var(--white-10);
  }
  .sb-modern .sb-active-pill::before {
    content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; border-radius: 0 3px 3px 0; background: var(--neon);
    box-shadow: 0 0 12px var(--neon);
  }
  .sb-modern .sb-active-shine {
    position: absolute; top: 0; bottom: 0; width: 44%;
    background: linear-gradient(100deg, transparent, color-mix(in srgb, #fff 55%, var(--neon)) 50%, transparent);
    opacity: .35; mix-blend-mode: overlay;
    animation: sb-shine-sweep 3.2s ease-in-out infinite;
  }
  @keyframes sb-shine-sweep { 0% { left: -60%; } 55%,100% { left: 130%; } }
  .sb-modern .sb-item > *:not(.sb-active-pill):not(.sb-item-glow) { position: relative; z-index: 1; }

  .sb-modern .sb-icon-ring {
    position: relative; width: 32px; height: 32px; flex-shrink: 0;
    display: grid; place-items: center; border-radius: 10px;
  }
  .sb-modern .sb-icon-ring::before {
    content: ""; position: absolute; inset: -3px; border-radius: 12px; z-index: 0;
    background: conic-gradient(from 0deg, transparent 60%, color-mix(in srgb, var(--neon) 90%, transparent) 78%, transparent 96%);
    opacity: 0; animation: sb-spin 3.2s linear infinite;
    transition: opacity .2s ease;
  }
  .sb-modern .sb-icon-ring.is-active::before { opacity: 1; }
  .sb-modern .sb-item:hover .sb-icon-ring::before { opacity: .55; }
  .sb-modern .sb-item-icon {
    position: relative; z-index: 1; width: 30px; height: 30px;
    display: grid; place-items: center; border-radius: 9px;
    background: var(--bg2); color: var(--text3);
    transition: background .16s ease, color .16s ease, transform .18s cubic-bezier(.16,1,.3,1);
  }
  .sb-modern .sb-item:hover .sb-item-icon { color: var(--text); transform: scale(1.08); }
  .sb-modern .sb-item.is-active .sb-item-icon { background: color-mix(in srgb, var(--neon) 20%, var(--bg2)); color: var(--neon); }
  .sb-modern .sb-item-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sb-modern .sb-grip { display: flex; color: var(--text3); opacity: .45; cursor: grab; margin-left: -4px; }
  .sb-modern .sb-item.is-editable { cursor: grab; }
  .sb-modern .sb-item.is-editable:hover .sb-grip { opacity: .9; }
  .sb-modern .sb-item.is-dragging { opacity: .4; }
  .sb-modern .sb-admin-badge { display: flex; color: #f3ba65; opacity: .85; }
  .sb-modern .sb-info {
    display: grid; place-items: center; width: 22px; height: 22px; border-radius: 6px;
    color: var(--text3); opacity: 0; transition: all .16s ease;
  }
  .sb-modern .sb-item:hover .sb-info { opacity: .7; }
  .sb-modern .sb-info:hover { opacity: 1; background: var(--white-8); color: var(--text); }
  .sb-modern .sb-ripple {
    position: absolute; z-index: 2; width: 10px; height: 10px; margin: -5px 0 0 -5px;
    border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--neon) 70%, transparent), transparent 70%);
    pointer-events: none;
  }
  .sb-modern .sb-empty { margin: 2px 4px; padding: 13px 10px; text-align: center; font-size: 11px; color: var(--text3); border: 1px dashed var(--border2); border-radius: 10px; }
  .sb-modern .sb-add-section {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; margin-top: 8px; padding: 10px; border-radius: 10px;
    background: none; border: 1px dashed var(--border2); color: var(--text3);
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s;
  }
  .sb-modern .sb-add-section:hover { color: var(--text); border-color: color-mix(in srgb, var(--neon) 40%, transparent); background: var(--white-3); }

  /* Collapsed nav */
  .sb-modern.sb-collapsed .sb-nav { padding: 6px 8px; }
  .sb-modern.sb-collapsed .sb-group-items { align-items: center; }
  .sb-modern.sb-collapsed .sb-item { justify-content: center; padding: 5px 0; width: 100%; }
  .sb-modern.sb-collapsed .sb-icon-ring { width: 42px; height: 42px; }
  .sb-modern.sb-collapsed .sb-item-icon { width: 40px; height: 40px; }
  .sb-modern.sb-collapsed .sb-active-pill::before { display: none; }
  .sb-modern.sb-collapsed .sb-item[data-label]:hover::after {
    content: attr(data-label); position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: var(--bg5); border: 1px solid var(--border2); color: var(--text);
    padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; white-space: nowrap; z-index: 2000;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }

  /* ── Study paths ─────────────────────────────────────── */
  .sb-modern .sb-paths {
    flex-shrink: 0; padding: 10px 14px 12px;
    border-top: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 30%, transparent);
    max-height: 40%; overflow-y: auto;
  }
  .sb-modern .sb-paths-label {
    display: flex; align-items: center; gap: 6px; width: 100%;
    padding: 2px 4px 8px; margin: 0; background: none; border: 0; cursor: pointer;
    color: var(--text3); font-size: 10px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase;
    transition: color .15s;
  }
  .sb-modern .sb-paths-label:hover { color: var(--text2); }
  .sb-modern .sb-paths-label > span:first-of-type { flex: 1; text-align: left; }
  .sb-modern .sb-paths-count {
    flex: none !important; display: inline-grid; place-items: center; min-width: 17px; height: 17px;
    padding: 0 4px; border-radius: 6px; font-size: 9px;
    background: color-mix(in srgb, var(--neon) 14%, transparent); color: var(--neon);
    border: 1px solid color-mix(in srgb, var(--neon) 26%, transparent);
  }
  .sb-modern .sb-paths-caret { flex-shrink: 0; transition: transform .25s ease; opacity: .8; }
  .sb-modern .sb-paths-caret.is-hidden { transform: rotate(-90deg); }
  .sb-modern .sb-paths.is-hidden { padding-bottom: 6px; }
  .sb-modern .sb-paths.is-hidden .sb-paths-label { padding-bottom: 2px; }
  .sb-modern .sb-paths-list { display: flex; flex-direction: column; gap: 4px; }
  .sb-modern .sb-paths-list.is-collapsed { align-items: center; gap: 8px; }

  .sb-modern .sb-path { position: relative; border-radius: 13px; border: 1px solid transparent; transition: all .16s ease; }
  .sb-modern .sb-path:hover { background: var(--white-3); border-color: var(--border); }
  .sb-modern .sb-path.is-active { background: color-mix(in srgb, var(--path-color) 10%, transparent); border-color: color-mix(in srgb, var(--path-color) 32%, transparent); }
  .sb-modern .sb-path-btn { display: flex; align-items: center; gap: 11px; width: 100%; padding: 8px 10px; background: none; border: 0; cursor: pointer; }
  .sb-modern .sb-path-ring-wrap { position: relative; width: 34px; height: 34px; flex-shrink: 0; display: grid; place-items: center; }
  .sb-modern .sb-path-ring { width: 34px; height: 34px; transform: rotate(0deg); }
  .sb-modern .sb-path-ring-track { fill: none; stroke: var(--white-8); stroke-width: 2.4; }
  .sb-modern .sb-path-ring-fill { fill: none; stroke-width: 2.4; stroke-linecap: round; filter: drop-shadow(0 0 3px color-mix(in srgb, var(--path-color) 70%, transparent)); }
  .sb-modern .sb-path-ring-pct { position: absolute; font-size: 9px; font-weight: 800; color: var(--path-color); font-family: var(--mono, monospace); }
  .sb-modern .sb-path-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; text-align: left; }
  .sb-modern .sb-path-name { font-size: 12.5px; font-weight: 650; color: var(--text2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sb-modern .sb-path.is-active .sb-path-name { color: var(--text); }
  .sb-modern .sb-path-badge { font-size: 10px; color: var(--text3); }
  .sb-modern .sb-path-edit { position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; background: var(--bg5); border: 1px solid var(--border); color: var(--text2); cursor: pointer; }
  .sb-modern .sb-path-add { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 4px; padding: 9px; border-radius: 10px; background: none; border: 1px dashed var(--border2); color: var(--text3); font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; }
  .sb-modern .sb-path-add:hover { color: var(--text); border-color: var(--border2); background: var(--white-3); }
  .sb-modern .sb-path-dot {
    position: relative; width: 40px; height: 40px; border-radius: 12px;
    display: grid; place-items: center; font-size: 13px; font-weight: 800;
    background: var(--white-3); border: 1px solid var(--border); color: var(--text2); cursor: pointer; transition: all .16s ease;
  }
  .sb-modern .sb-path-dot:hover { background: var(--white-8); color: var(--text); }
  .sb-modern .sb-path-dot.is-active { background: color-mix(in srgb, var(--path-color) 16%, transparent); border-color: color-mix(in srgb, var(--path-color) 40%, transparent); color: var(--path-color); box-shadow: 0 0 14px color-mix(in srgb, var(--path-color) 30%, transparent); }
  .sb-modern .sb-path-dot[data-label]:hover::after {
    content: attr(data-label); position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: var(--bg5); border: 1px solid var(--border2); color: var(--text); padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; white-space: nowrap; z-index: 2000;
  }

  /* ── Footer / settings ───────────────────────────────── */
  .sb-modern .sb-footer { flex-shrink: 0; position: relative; padding: 10px 12px; border-top: 1px solid var(--border); }
  .sb-modern .sb-settings-btn {
    display: flex; align-items: center; gap: 11px; width: 100%; padding: 8px 10px;
    border-radius: 13px; background: var(--white-3); border: 1px solid var(--border);
    color: var(--text2); font-size: 12.5px; font-weight: 650; cursor: pointer; transition: all .16s ease;
  }
  .sb-modern .sb-settings-btn:hover, .sb-modern .sb-settings-btn.is-open { background: var(--white-5); border-color: var(--border2); color: var(--text); }
  .sb-modern .sb-settings-orb { position: relative; width: 32px; height: 32px; flex-shrink: 0; display: grid; place-items: center; border-radius: 10px; background: var(--white-5); color: var(--text2); transition: all .16s; }
  .sb-modern .sb-settings-btn:hover .sb-settings-orb, .sb-modern .sb-settings-btn.is-open .sb-settings-orb { background: color-mix(in srgb, var(--neon) 18%, transparent); color: var(--neon); }
  .sb-modern .sb-reactor-ring { position: absolute; inset: 0; border-radius: 10px; border: 1px solid var(--neon); opacity: 0; animation: sb-ping 2.6s ease-out infinite; }
  .sb-modern .sb-reactor-ring-2 { animation-delay: 1.3s; }
  @keyframes sb-ping { 0% { transform: scale(.85); opacity: .55; } 100% { transform: scale(1.6); opacity: 0; } }
  .sb-modern .sb-settings-label { flex: 1; text-align: left; }
  .sb-modern .sb-settings-caret { transition: transform .2s ease; }
  .sb-modern .sb-settings-caret.is-open { transform: rotate(180deg); }
  .sb-modern.sb-collapsed .sb-settings-btn { justify-content: center; padding: 8px 0; }

  .sb-modern .sb-menu {
    position: absolute; left: 12px; right: 12px; bottom: calc(100% + 6px);
    z-index: 3000; padding: 8px; border-radius: 16px;
    background: color-mix(in srgb, var(--bg2) 92%, transparent);
    backdrop-filter: blur(30px) saturate(160%); -webkit-backdrop-filter: blur(30px) saturate(160%);
    border: 1px solid var(--border2); box-shadow: 0 24px 60px rgba(0,0,0,.5);
  }
  .sb-modern.sb-collapsed .sb-menu { left: 12px; width: 262px; right: auto; }
  .sb-modern .sb-menu-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 8px; color: var(--text3); font-size: 10px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
  .sb-modern .sb-menu-close { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; background: none; border: 0; color: var(--text3); cursor: pointer; }
  .sb-modern .sb-menu-close:hover { background: var(--white-8); color: var(--text); }
  .sb-modern .sb-menu-row {
    display: flex; align-items: center; gap: 11px; width: 100%; padding: 9px 10px;
    border-radius: 9px; background: none; border: 0; color: var(--text2);
    font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: left; transition: all .14s;
  }
  .sb-modern .sb-menu-row:hover { background: var(--white-5); color: var(--text); }
  .sb-modern .sb-menu-row.is-active { color: var(--neon); }
  .sb-modern .sb-menu-row.is-danger { color: #ff6b6b; }
  .sb-modern .sb-menu-logout:hover { color: #ff6b6b; }
  .sb-modern .sb-menu-toggle-row { justify-content: space-between; cursor: default; }
  .sb-modern .sb-menu-toggle-row:hover { background: none; color: var(--text2); }
  .sb-modern .sb-menu-row-main { display: flex; align-items: center; gap: 11px; }
  .sb-modern .sb-switch { width: 34px; height: 19px; border-radius: 20px; background: var(--white-10); position: relative; cursor: pointer; transition: background .2s; flex-shrink: 0; }
  .sb-modern .sb-switch.is-on { background: var(--neon); }
  .sb-modern .sb-switch-knob { position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; border-radius: 50%; background: #fff; transition: transform .2s; }
  .sb-modern .sb-switch.is-on .sb-switch-knob { transform: translateX(15px); background: #04120b; }
  .sb-modern .sb-menu-divider { height: 1px; background: var(--border); margin: 7px 6px; }
  .sb-modern .sb-menu-kicker { padding: 4px 10px 2px; color: var(--text3); font-size: 9px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
  .sb-modern .sb-menu-note { margin: 0; padding: 0 10px 8px; color: var(--text3); font-size: 10px; line-height: 1.45; }
  .sb-modern .sb-cred { display: flex; flex-direction: column; gap: 6px; padding: 0 8px 6px; }
  .sb-modern .sb-cred-field { width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 8px; background: var(--white-3); border: 1px solid var(--border); color: var(--text); font-size: 11px; outline: none; transition: border-color .16s; }
  .sb-modern .sb-cred-field:focus { border-color: color-mix(in srgb, var(--neon) 50%, transparent); }
  .sb-modern .sb-cred-field.mono { font-family: var(--mono, monospace); }
  .sb-modern .sb-cred-save { width: 100%; padding: 9px 0; border-radius: 8px; background: var(--neon); border: 0; color: #04120b; font-size: 10px; font-weight: 900; letter-spacing: .5px; text-transform: uppercase; cursor: pointer; transition: filter .16s; }
  .sb-modern .sb-cred-save:hover { filter: brightness(1.08); box-shadow: 0 0 14px var(--neon-dim); }
  .sb-modern .sb-cred-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 2px; }
  .sb-modern .sb-cred-foot span { font-size: 9px; color: var(--text3); }
  .sb-modern .sb-cred-foot a { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; color: var(--neon); text-decoration: none; }
  .sb-modern .sb-spin { animation: sb-spin 3s linear infinite; }

  @media (max-width: 768px) {
    .sb-modern.sidebar { width: 280px; min-width: 280px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sb-modern .sb-aurora-blob, .sb-modern .sb-aurora-scan, .sb-modern .sb-orbit, .sb-modern .sb-orbit-node,
    .sb-modern .sb-core, .sb-modern .sb-wordmark-1, .sb-modern .sb-pulse-bars i, .sb-modern .sb-search-ring,
    .sb-modern .sb-active-shine, .sb-modern .sb-icon-ring::before, .sb-modern .sb-reactor-ring {
      animation: none !important;
    }
  }
`;

if (typeof document !== "undefined") {
  const existing = document.getElementById("sb-modern-styles");
  if (existing) existing.remove();
  const styleSheet = document.createElement("style");
  styleSheet.id = "sb-modern-styles";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
