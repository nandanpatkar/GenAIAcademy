import React, { useMemo } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getActiveNavId, runNavClick } from "../../config/sidebarNav";
import { resolveEffectiveLayout, resolveItemVisibility, SIDEBAR_ITEM_REGISTRY } from "../../config/sidebarRegistry";
import MobileSheet from "./MobileSheet";
import "../../styles/mobile-navigation-sheet.css";

const PRIMARY_NAV_IDS = new Set(["overview", "curriculum_map", "progress", "quiz"]);
// These remain desktop destinations. Their canvas/IDE-style interfaces need a
// desktop pointer and working area, so mobile navigation intentionally omits
// them instead of presenting a compromised entry point.
const MOBILE_HIDDEN_IDS = new Set([
  "playground",
  "genai_playground2",
  "simulator",
  "algo_visualizer",
  "learnbug",
  "tasks",
  "projects",
  "dsa_animator",
  "k8s_games",
  "flow_design",
  "nosignups",
  "labs",
  "algowar",
]);

/**
 * The phone-only replacement for the desktop sidebar. It deliberately derives
 * its groups and behaviour from the sidebar registry, rather than copying
 * navigation data, so new desktop destinations appear here automatically.
 */
export default function MobileNavigationSheet({ open, onClose, navigationProps }) {
  const { isAdmin, allowAimlForAll, sidebarConfig } = useAuth();
  const activeNavId = getActiveNavId(navigationProps);

  const groups = useMemo(() => resolveEffectiveLayout(sidebarConfig?.layout)
    .map((group) => ({
      ...group,
      items: group.itemIds
        .filter((id) => !PRIMARY_NAV_IDS.has(id) && !MOBILE_HIDDEN_IDS.has(id))
        .map((id) => ({ id, ...SIDEBAR_ITEM_REGISTRY[id] }))
        .filter((item) => {
          if (!item.icon) return false;
          const visibility = resolveItemVisibility(item.id, {
            overrides: sidebarConfig?.overrides,
            allowAimlForAll,
          });
          return visibility !== "admin" || isAdmin;
        }),
    }))
    .filter((group) => group.items.length), [allowAimlForAll, isAdmin, sidebarConfig]);

  const navigate = (id) => {
    runNavClick(id, navigationProps, {
      isItemVisible: (itemId) => {
        const visibility = resolveItemVisibility(itemId, {
          overrides: sidebarConfig?.overrides,
          allowAimlForAll,
        });
        return visibility === "admin" ? isAdmin : true;
      },
    });
  };

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="More"
      subtitle="Tools, learning spaces, and account"
    >
      <nav id="mobile-navigation-sheet" className="mobile-navigation-sheet" aria-label="All navigation">
        {groups.map((group) => (
          <section className="mobile-navigation-group" key={group.id} aria-labelledby={`mobile-nav-group-${group.id}`}>
            <h2 id={`mobile-nav-group-${group.id}`}>{group.label}</h2>
            <div className="mobile-navigation-list">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeNavId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-navigation-item${active ? " active" : ""}`}
                    onClick={() => navigate(item.id)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="mobile-navigation-item__icon" aria-hidden="true"><Icon size={19} /></span>
                    <span className="mobile-navigation-item__copy">
                      <strong>{item.label}</strong>
                      {item.description && <small>{item.description}</small>}
                    </span>
                    <ChevronRight className="mobile-navigation-item__chevron" size={18} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mobile-navigation-account" aria-label="Account">
          <button type="button" onClick={navigationProps.onSignOut}>
            <LogOut size={18} aria-hidden="true" />
            Sign out
          </button>
        </section>
      </nav>
    </MobileSheet>
  );
}
