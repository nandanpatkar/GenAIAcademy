import React, { useMemo } from "react";
import { ArrowRight, Clock3, Layers, PlayCircle } from "lucide-react";
import CollectionView from "../../practice/CollectionView";
import { practiceById, sheetItems } from "../../practice/practiceData";
import { useLearnerState } from "../learner";

const leaves = (nodes) => nodes.flatMap((node) => (node.children ? leaves(node.children) : [node]));

const toEntry = (item) => {
  const problem = item.kind === "practice" && item.id ? practiceById.get(item.id) : null;
  return problem ? { problem, video: item.video || "" } : { item };
};

/** Steps → sections → entries. A step whose children are items gets one implicit section. */
const toGroups = (sheet) => (sheet.steps || []).map((step, index) => {
  const direct = (step.children || []).filter((child) => !child.children);
  const nested = (step.children || []).filter((child) => child.children);
  const sections = [
    ...(direct.length ? [{ key: `${index}-direct`, title: step.title, entries: direct.map(toEntry) }] : []),
    ...nested.map((section, sectionIndex) => ({ key: `${index}-${sectionIndex}`, title: section.title, entries: leaves(section.children).map(toEntry) })),
  ];
  const problems = sections.reduce((sum, section) => sum + section.entries.filter((entry) => entry.problem || entry.item?.kind === "practice").length, 0);
  return {
    key: `${index}-${step.title}`,
    index: index + 1,
    title: step.title,
    subtitle: sections.length > 1 ? `${sections.length} sections · ${problems} problems` : `${problems} problems`,
    sections,
  };
});

/** One DSA sheet (A2Z, SDE, 180, 75, 150, Blind 75), step by step. */
export default function SheetView({ sheet, navigate, openProblem }) {
  const learner = useLearnerState();
  const groups = useMemo(() => toGroups(sheet), [sheet]);
  const items = useMemo(() => sheetItems(sheet), [sheet]);
  const linked = items.filter((item) => item.id && practiceById.has(item.id));
  const next = linked.find((item) => !learner.completed.has(item.id));
  const started = linked.some((item) => learner.completed.has(item.id));
  const minutes = items.reduce((sum, item) => sum + (item.minutes || 0), 0);
  const videos = items.filter((item) => item.video).length;
  // Open the step holding the next unsolved problem, so "continue" is one glance away.
  const nextGroup = next ? groups.find((group) => group.sections.some((section) => section.entries.some((entry) => entry.problem?.id === next.id))) : groups[0];

  return (
    <CollectionView
      key={sheet.id}
      crumbs={[{ label: "Prep Hub", onClick: () => navigate("tracks") }, { label: sheet.group }]}
      title={sheet.title}
      description={sheet.description}
      features={[
        { icon: Layers, label: `${groups.length} steps · ${items.length} problems` },
        ...(minutes ? [{ icon: Clock3, label: `~${Math.round(minutes / 60)} hours` }] : []),
        ...(videos ? [{ icon: PlayCircle, label: `${videos} videos` }] : []),
      ]}
      actions={next && <button type="button" className="dpx-btn is-primary" onClick={() => openProblem(next.id)}>{started ? "Continue" : "Start"} <ArrowRight size={15} /></button>}
      groups={groups}
      initialOpen={nextGroup ? [nextGroup.key] : []}
      openProblem={openProblem}
      onWatchLesson={(path) => navigate("visual", { path })}
    />
  );
}
