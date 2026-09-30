import {
  BookOpenCheck,
  CalendarCheck2,
  CalendarClock,
  Flame,
  FolderOpen,
  GraduationCap,
  House,
  LayoutDashboard,
  MessagesSquare,
  Terminal,
  Trophy,
} from "lucide-react";

/**
 * The DSA hub rail. Groups mirror the reference product's sidebar families
 * (Prep Hub, Practice, Planner, My Spaces, Community, Unlock, Dev Tools) so the
 * mental model carries over; `id`s are the hub's section keys.
 *
 * `saved` is not a section of its own — it opens Problems on the Saved tab.
 */
export const RAIL = [
  { id: "home", label: "Home", icon: House },
  { id: "today", label: "Today", icon: CalendarCheck2 },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    group: "learn", label: "Learn", icon: GraduationCap,
    items: [
      { id: "tracks", label: "Prep Hub" },
      // The four Visual Learning tracks, one section each (visual/VisualHub).
      { id: "visual", label: "DSA Visual" },
      { id: "lld", label: "Low-Level Design" },
      { id: "os", label: "Operating Systems" },
      { id: "networks", label: "Computer Networks" },
      { id: "sqllab", label: "SQL & Query Plans" },
      { id: "articles", label: "Articles" },
      { id: "aifs", label: "AI from Scratch" },
    ],
  },
  {
    group: "practice", label: "Practice", icon: BookOpenCheck,
    items: [
      { id: "problems", label: "DSA Problems" },
      { id: "sheet", label: "Zero to Hero 450" },
      { id: "sql", label: "SQL" },
      { id: "aptitude", label: "Aptitude" },
      { id: "companies", label: "Companies" },
      { id: "saved", label: "Saved questions" },
    ],
  },
  { id: "potd", label: "Problem of the Day", icon: Flame },
  {
    group: "planner", label: "Planner", icon: CalendarClock,
    items: [
      { id: "planner", label: "Study plan" },
      { id: "review", label: "Review queue" },
    ],
  },
  {
    group: "spaces", label: "My Spaces", icon: FolderOpen,
    items: [
      { id: "notes", label: "Notes" },
      { id: "lists", label: "Lists" },
      { id: "codespace", label: "CodeSpace" },
      { id: "buganizer", label: "Buganizer" },
    ],
  },
  {
    group: "community", label: "Community", icon: MessagesSquare,
    items: [
      { id: "community", label: "Feed" },
      { id: "experiences", label: "Interview experiences" },
      { id: "my-posts", label: "My posts" },
    ],
  },
  {
    group: "unlock", label: "Unlock", icon: Trophy,
    items: [
      { id: "leaderboard", label: "Leaderboard" },
      { id: "achievements", label: "Achievements" },
    ],
  },
  {
    group: "devtools", label: "Dev Tools", icon: Terminal,
    items: [{ id: "ide", label: "IDE" }],
  },
];

const EXTRA_LABELS = { profile: "Profile & data" };

export const SECTION_LABELS = RAIL.reduce((labels, entry) => {
  if (entry.items) entry.items.forEach((item) => { labels[item.id] = item.label; });
  else labels[entry.id] = entry.label;
  return labels;
}, { ...EXTRA_LABELS });

export const GROUP_OF = RAIL.reduce((map, entry) => {
  if (entry.items) entry.items.forEach((item) => { map[item.id] = entry.group; });
  return map;
}, {});

/** Sections rendered by the legacy question table inside DsaHubPage itself. */
export const QUESTION_SECTIONS = new Set(["problems"]);
