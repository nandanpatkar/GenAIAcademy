import React from "react";
import SqlLab from "../../../../components/SqlLab";
import { useTheme } from "../../../../contexts/ThemeContext";
import "../../../../styles/DsaSqlLab.css";

/**
 * DSA › Learn › SQL & Query Plans: the SQL & Query Plan Lab from the main
 * sidebar (real PostgreSQL in the tab, EXPLAIN ANALYZE made visual), worn in
 * the hub's palette — DsaSqlLab.css re-skins its obsidian/neon surface with
 * the --dsa-* tokens, so it follows the light/dark switch here.
 */
export default function SqlLabSection() {
  const { theme } = useTheme() || {};
  return (
    <div className="dsq-host">
      <SqlLab editorTheme={theme === "light" ? "vs" : "vs-dark"} />
    </div>
  );
}
