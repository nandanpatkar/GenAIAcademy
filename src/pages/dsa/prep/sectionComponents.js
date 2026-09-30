import { lazy } from "react";

// Lazily loaded so the hub's first paint only pays for the section in view —
// the SQL engine, Monaco-backed spaces and the planner never load unless opened.
const PrepHub = lazy(() => import("./learn/PrepHub"));
const Articles = lazy(() => import("./learn/Articles"));
// Its 540-lesson index is large, so it only loads when this section opens.
const AiFromScratchHub = lazy(() => import("./aifs/AiFromScratchHub"));
// Frames lessons from the /chai-visual/ mirror; loads only when opened. One
// component serves every track — it reads its track from the section id.
const VisualHub = lazy(() => import("./visual/VisualHub"));
// Boots PostgreSQL (WASM) in the tab, so it too loads only when opened.
const SqlLabSection = lazy(() => import("./learn/SqlLabSection"));
const TodayView = lazy(() => import("./TodayView"));
const Potd = lazy(() => import("./habit/Potd"));
const ReviewQueue = lazy(() => import("./habit/ReviewQueue"));
const Leaderboard = lazy(() => import("./habit/Leaderboard"));
const Achievements = lazy(() => import("./habit/Achievements"));
const Planner = lazy(() => import("./planner/Planner"));
const Notes = lazy(() => import("./spaces/Notes"));
const Lists = lazy(() => import("./spaces/Lists"));
const CodeSpace = lazy(() => import("./spaces/CodeSpace"));
const Buganizer = lazy(() => import("./spaces/Buganizer"));
const Playground = lazy(() => import("./spaces/Playground"));
const SqlPractice = lazy(() => import("./sql/SqlPractice"));
const Aptitude = lazy(() => import("./aptitude/Aptitude"));
const Community = lazy(() => import("./community/Community"));
const Companies = lazy(() => import("./community/Companies"));
const Profile = lazy(() => import("./account/Profile"));

export const SECTION_COMPONENTS = {
  tracks: PrepHub,
  sheet: PrepHub,
  articles: Articles,
  aifs: AiFromScratchHub,
  visual: VisualHub,
  lld: VisualHub,
  os: VisualHub,
  networks: VisualHub,
  sqllab: SqlLabSection,
  today: TodayView,
  potd: Potd,
  review: ReviewQueue,
  leaderboard: Leaderboard,
  achievements: Achievements,
  planner: Planner,
  notes: Notes,
  lists: Lists,
  codespace: CodeSpace,
  buganizer: Buganizer,
  ide: Playground,
  sql: SqlPractice,
  aptitude: Aptitude,
  community: Community,
  experiences: Community,
  "my-posts": Community,
  companies: Companies,
  profile: Profile,
};
