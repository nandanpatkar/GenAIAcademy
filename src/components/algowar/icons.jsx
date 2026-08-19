// The site names its icons with Material Symbol keys; this maps them onto the lucide
// set the app already ships so no new icon dependency is introduced.
import {
  Award, Bolt, BookOpen, Boxes, Braces, Building2, CalendarDays, Check, CheckCircle2,
  ChevronLeft, ChevronRight, Clock3, Code2, Coins, Compass, Crown, Flag, Flame, Gift,
  Gem, Hash, Handshake, Home, Layers, ListChecks, Lock, LockOpen, Medal, Cpu,
  Mountain, Network, Play, Puzzle, Rocket, Route, Search, Share2, Skull, Sparkles, Split,
  Swords, Target, Timer, TreePine, Trophy, Type, Users, UsersRound, Zap,
} from "lucide-react";

const MAP = {
  bolt: Bolt, schedule: Clock3, timer: Timer, swords: Swords, calendar: CalendarDays,
  calendar_today: CalendarDays, rocket: Rocket, rocket_launch: Rocket, quiz: ListChecks,
  puzzle: Puzzle, extension: Puzzle, groups: UsersRound, group: Users, handshake: Handshake,
  route: Route, code: Code2, flag: Flag, redeem: Gift, emoji_events: Trophy, skull: Skull,
  lock: Lock, lock_open: LockOpen, check: Check, star: Sparkles, military_tech: Medal,
  workspace_premium: Award, social_leaderboard: Trophy, local_fire_department: Flame,
  trending_up: Zap, flash_on: Zap, queue: Users, monetization_on: Coins, inventory_2: Boxes,
  signal_cellular_alt: Target, account_tree: Network, data_array: Braces, hub: Network,
  memory: Cpu, layers: Layers, park: TreePine, temple_buddhist: Home, sort: Split,
  travel_explore: Compass, text_format: Type, share: Share2, spellcheck: Hash,
  view_carousel: Layers, account_balance: Building2, dashboard_customize: Boxes,
  sports_martial_arts: Swords, explore: Compass, search: Search, article: BookOpen,
  gem: Gem, mountain: Mountain, crown: Crown, verified: CheckCircle2,
  chevron_left: ChevronLeft, chevron_right: ChevronRight, play: Play, psychology: Sparkles,
};

export function Icon({ name, size = 20, className, fill }) {
  const Cmp = MAP[name] ?? Compass;
  return <Cmp size={size} className={className} aria-hidden="true" fill={fill ? "currentColor" : "none"} />;
}

export default Icon;
