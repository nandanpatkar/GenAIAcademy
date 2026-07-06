import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import MobileSheet from "../../../components/mobile/MobileSheet";
import { CATEGORIES, COLORS } from "../data/nodes.js";

/**
 * MobileNodePicker
 * ----------------
 * Mobile replacement for the desktop drag-and-drop sidebar in
 * SystemDesignPlayground. Drag-and-drop from a narrow sidebar onto a
 * ReactFlow canvas doesn't work on touch, so instead: tap the picker
 * button to open this sheet, tap a category to expand it, tap a node to
 * place it on the canvas (SystemDesignPlayground positions the new node
 * for you — usually center-of-viewport with a small cascade offset).
 *
 * `IC` is passed in from SystemDesignPlayground rather than duplicated
 * here, since the icon registry (ICON_MAP) lives there.
 */
export default function MobileNodePicker({ open, onClose, onPick, IC }) {
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      nodes: cat.nodes.filter(
        (n) =>
          !q ||
          n.label.toLowerCase().includes(q) ||
          (n.sub || "").toLowerCase().includes(q)
      ),
    })).filter((cat) => !q || cat.nodes.length > 0);
  }, [search]);

  const handlePick = (item) => {
    onPick(item);
    onClose();
  };

  return (
    <MobileSheet open={open} onClose={onClose} title="Add a component">
      <div className="mnp-search">
        <Search size={13} color="var(--pg-text3)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search components..."
          className="mnp-search-input"
        />
      </div>

      <div className="mnp-cats">
        {filtered.map((cat) => {
          const isOpen = search.trim() ? true : openCat === cat.id;
          return (
            <div key={cat.id} className="mnp-cat">
              <button
                type="button"
                className="mnp-cat-header"
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
              >
                <span className="mnp-cat-header-left">
                  <IC name={cat.icon} size={13} />
                  {cat.label}
                </span>
                <span className="mnp-cat-count">{cat.nodes.length}</span>
              </button>

              {isOpen && (
                <div className="mnp-cat-items">
                  {cat.nodes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="mnp-item"
                      style={{
                        "--item-border": COLORS[item.color]?.border,
                        "--item-bg": COLORS[item.color]?.dim,
                        "--item-accent": COLORS[item.color]?.bg,
                      }}
                      onClick={() => handlePick(item)}
                    >
                      <span className="mnp-item-icon">
                        <IC name={item.icon} size={13} color={COLORS[item.color]?.bg} />
                      </span>
                      <span className="mnp-item-body">
                        <span className="mnp-item-label">{item.label}</span>
                        <span className="mnp-item-sub">{item.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MobileSheet>
  );
}
