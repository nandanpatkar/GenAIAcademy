import React, { useEffect, useState } from "react";
import { ArrowUpRight, Clapperboard, Maximize2, Minimize2 } from "lucide-react";
import VisualLessonFrame from "../../../components/visual/VisualLessonFrame";
import { markWatched } from "../../../components/visual/visualProgress";
import { getLesson } from "../../../data/chaiVisualCourseData";

/**
 * The problem workspace's Visualize tab: the Visual Learning lesson that
 * animates this problem, in the problem panel beside the editor. The panel
 * is narrow for canvas animations, so it can expand over the workspace
 * (Escape returns). Links inside the lesson move the frame, not the page.
 * Loaded lazily so the workspace only pays for the course data on use.
 */
export default function WorkspaceVisual({ lessonPath, dark, onOpenInHub }) {
  const [path, setPath] = useState(lessonPath);
  const [expanded, setExpanded] = useState(false);
  const lesson = getLesson(path);

  useEffect(() => { setPath(lessonPath); }, [lessonPath]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (!lesson) return null;
  return (
    <div className={`dsa-ws-visual${expanded ? " is-expanded" : ""}`}>
      {expanded && <button type="button" className="dsa-ws-visual-scrim" onClick={() => setExpanded(false)} aria-label="Close the expanded lesson" />}
      <div className="dsa-ws-visual-shell">
        <header className="dsa-ws-visual-bar">
          <span className="dsa-ws-visual-icon"><Clapperboard size={14} /></span>
          <div className="dsa-ws-visual-title">
            <small>{lesson.group.title}{path !== lessonPath ? " · related lesson" : ""}</small>
            <b>{lesson.title}</b>
          </div>
          {path !== lessonPath && <button type="button" className="dsa-ws-nav-btn" onClick={() => setPath(lessonPath)}>Back to this problem's lesson</button>}
          <button type="button" className="dsa-ws-icon-btn" onClick={() => onOpenInHub(path)} aria-label="Open in Visual Learning" title="Open in DSA › Visual Learning"><ArrowUpRight size={15} /></button>
          <button type="button" className="dsa-ws-icon-btn" onClick={() => setExpanded((value) => !value)} aria-pressed={expanded} aria-label={expanded ? "Shrink the lesson" : "Expand the lesson"} title={expanded ? "Shrink (Esc)" : "Expand over the workspace"}>{expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
        </header>
        <VisualLessonFrame
          path={path}
          title={`${lesson.title} — Visual Learning`}
          dark={dark}
          onNavigate={setPath}
          onLoaded={markWatched}
          className="dsa-ws-visual-frame"
        />
      </div>
    </div>
  );
}
