// Data access for the local AlgoWars mirror. Everything here is served from the
// extracted JSON under src/data/algowar — nothing hits the network.
//
// The campaign is 474 levels and Dream mode is 268 problems, so those are loaded
// lazily through Vite's glob imports rather than bundled into the entry chunk.
import campaign from "../../data/algowar/career/campaign.json";
import careerIndex from "../../data/algowar/career/index.json";
import profile from "../../data/algowar/site/profile.json";
import streak from "../../data/algowar/site/streak.json";
import leaderboardRaw from "../../data/algowar/site/leaderboard.json";
import daily from "../../data/algowar/site/daily.json";
import dreamCompanies from "../../data/algowar/site/dream-companies.json";
import entitlement from "../../data/algowar/site/career-entitlement.json";
import homePage from "../../data/algowar/pages/home.json";

const worldModules = import.meta.glob("../../data/algowar/career/worlds/*.json");
const levelModules = import.meta.glob("../../data/algowar/career/levels/*.json");
const dreamListModules = import.meta.glob("../../data/algowar/site/dream/*.json");
const dreamProblemModules = import.meta.glob("../../data/algowar/site/dream-problems/*.json");

function pick(modules, suffix) {
  const key = Object.keys(modules).find((k) => k.endsWith(suffix));
  return key ? modules[key]().then((m) => m.default ?? m) : Promise.resolve(null);
}

export const worlds = campaign.worlds ?? [];
export const worldIndex = careerIndex.worlds ?? [];
export const leaderboard = Array.isArray(leaderboardRaw)
  ? leaderboardRaw
  : leaderboardRaw.users ?? leaderboardRaw.leaderboard ?? [];
export const companies = dreamCompanies.companies ?? [];
export { profile, streak, daily, entitlement, homePage };

export const loadWorld = (slug) => pick(worldModules, `/${slug}.json`);
export const loadLevel = (levelNumber) => pick(levelModules, `/${levelNumber}.json`);
export const loadCompany = (slug) => pick(dreamListModules, `/${slug}.json`);
export const loadDreamProblem = (id) => pick(dreamProblemModules, `/${id}.json`);

// Rank ladder and its XP thresholds, as the live arena computes them.
export const RANK_TIERS = [
  { name: "Ashigaru", minXp: 0, maxXp: 99 },
  { name: "Shinobi", minXp: 100, maxXp: 249 },
  { name: "Rōnin", minXp: 250, maxXp: 499 },
  { name: "Hatamoto", minXp: 500, maxXp: 999 },
  { name: "Shōgun", minXp: 1000, maxXp: null },
];

export function tierProgress(xp) {
  const tier = [...RANK_TIERS].reverse().find((t) => xp >= t.minXp) ?? RANK_TIERS[0];
  if (tier.maxXp === null) return { tier, percentage: 100, next: null };
  const span = tier.maxXp - tier.minXp + 1;
  return { tier, percentage: Math.round(((xp - tier.minXp) / span) * 100), next: tier.maxXp + 1 };
}

// Game modes exactly as the arena lists them, including the three not yet live.
export const MODES = [
  { title: "Blitz", description: "1 problem, 15 minutes", icon: "bolt", live: true },
  { title: "Classical", description: "1 problem, 20 minutes", icon: "schedule", live: true },
  { title: "Against Time", description: "Solo, 8 minutes", icon: "timer", live: true },
  { title: "Private Duel", description: "Challenge a friend", icon: "swords", live: true },
  { title: "Daily Challenge", description: "New problem every day", icon: "calendar", live: true },
  { title: "Dream", description: "Questions your dream companies ask", icon: "rocket", live: true },
  { title: "Code Quest", description: "5 MCQs, 5 minutes", icon: "quiz", live: false },
  { title: "Puzzle", description: "Brain teasers & logic", icon: "puzzle", live: false },
  { title: "Group Play", description: "Collaborative coding", icon: "groups", live: false },
];

// Per-world theme gradients, lifted from the career bundle.
export const WORLD_GRADIENTS = {
  "neon-dojo": "#ef4444,#fb923c", "ember-forge": "#f97316,#facc15",
  "sorting-forge": "#f97316,#facc15", "array-valley": "#22c55e,#34d399",
  "search-mountain": "#0ea5e9,#60a5fa", "string-realm": "#d946ef,#f472b6",
  "linked-harbor": "#06b6d4,#60a5fa", "recursion-forest": "#84cc16,#4ade80",
  "bit-lab": "#8b5cf6,#a855f7", "stack-fortress": "#78716c,#a1a1aa",
  "window-desert": "#f59e0b,#facc15", "heap-citadel": "#6366f1,#60a5fa",
  "greedy-kingdom": "#eab308,#fb923c", "tree-lands": "#10b981,#4ade80",
  "bst-temple": "#14b8a6,#22d3ee", "graph-universe": "#3b82f6,#a78bfa",
  "dp-dimension": "#a855f7,#e879f9", "trie-nexus": "#f43f5e,#ef4444",
  "string-trials": "#ec4899,#fb7185",
};

export const gradientFor = (theme) => WORLD_GRADIENTS[theme] ?? "#ff3344,#fb923c";

// Theme -> Material symbol name, straight from the career bundle.
export const WORLD_ICONS = {
  "neon-dojo": "sports_martial_arts", "ember-forge": "sort", "sorting-forge": "sort",
  "array-valley": "data_array", "search-mountain": "travel_explore", "string-realm": "text_format",
  "linked-harbor": "share", "recursion-forest": "account_tree", "bit-lab": "memory",
  "stack-fortress": "layers", "window-desert": "view_carousel", "heap-citadel": "account_balance",
  "greedy-kingdom": "monetization_on", "tree-lands": "park", "bst-temple": "temple_buddhist",
  "graph-universe": "hub", "dp-dimension": "dashboard_customize", "trie-nexus": "route",
  "string-trials": "spellcheck",
};

export const themeIcon = (theme) => WORLD_ICONS[theme] ?? "explore";
