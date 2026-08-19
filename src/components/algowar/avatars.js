// Avatar art from the live site, re-encoded to WebP at 256px (the PNG originals were
// 1024×1536 and totalled ~14 MB for images that render at 64px).
import bugHunter from "../../assets/algowar/avatars/bug_hunter.webp";
import dataTitan from "../../assets/algowar/avatars/data_titan.webp";
import quantomHacker from "../../assets/algowar/avatars/quantom_hacker.webp";
import runtineRouge from "../../assets/algowar/avatars/runtine_rouge.webp";
import stackSamurai from "../../assets/algowar/avatars/stack_samurai.webp";
import syntaxSage from "../../assets/algowar/avatars/syntax_sage.webp";

const AVATARS = {
  "bug_hunter.png": bugHunter,
  "data_titan.png": dataTitan,
  "quantom_hacker.png": quantomHacker,
  "runtine_rouge.png": runtineRouge,
  "stack_samurai.png": stackSamurai,
  "syntax_sage.png": syntaxSage,
};

const ORDER = Object.values(AVATARS);

export function avatarFor(name) {
  return AVATARS[name] ?? bugHunter;
}

// Leaderboard rows without art get a stable pick so the table is not all placeholders.
export function avatarForUser(username, name) {
  if (name && AVATARS[name]) return AVATARS[name];
  let hash = 0;
  for (let i = 0; i < (username ?? "").length; i += 1) hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  return ORDER[hash % ORDER.length];
}
