// Local campaign progress. The live site keeps this server-side behind the career API;
// this mirror persists it in localStorage so levels genuinely lock, unlock and clear.
const KEY = "algowars.progress.v1";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; }
}

function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

export function getProgress() {
  const s = read();
  return { levels: s.levels ?? {}, code: s.code ?? {}, xp: s.xp ?? 0, coins: s.coins ?? 0, unlockAll: s.unlockAll ?? false };
}

/** Pro-style "skip ahead": every chapter and level becomes reachable in any order. */
export function setUnlockAll(value) {
  const s = getProgress();
  s.unlockAll = Boolean(value);
  write(s);
  return s;
}

export function resetAllProgress() {
  write({ levels: {}, code: getProgress().code, xp: 0, coins: 0, unlockAll: false });
}

export function levelStatus(levelNumber) {
  return getProgress().levels[levelNumber] ?? null;
}

export function completeLevel(levelNumber, { xp = 0, coins = 0, perfect = false } = {}) {
  const s = getProgress();
  if (!s.levels[levelNumber]) {
    s.xp += xp;
    s.coins += coins;
  }
  s.levels[levelNumber] = perfect ? "perfect" : "completed";
  write(s);
  return s;
}

export function resetLevel(levelNumber) {
  const s = getProgress();
  delete s.levels[levelNumber];
  write(s);
  return s;
}

export function saveCode(levelNumber, language, code) {
  const s = getProgress();
  s.code[`${levelNumber}:${language}`] = code;
  write(s);
}

export function loadCode(levelNumber, language) {
  return getProgress().code[`${levelNumber}:${language}`] ?? "";
}

// Mirrors the live rule: a node is current if it is the first uncompleted level in the
// world, locked if an earlier level is still outstanding, otherwise completed/perfect.
export function nodeState(node, world, progress) {
  if (!node.level) {
    if (progress.unlockAll) return "open";
    if (node.nodeType === "intro") return "open";
    const after = node.afterLevelNumber ?? 0;
    const cleared = Object.keys(progress.levels).map(Number);
    return after <= 0 || cleared.some((n) => n >= after) ? "open" : "locked";
  }
  const status = progress.levels[node.level.levelNumber];
  if (status) return status;
  const firstOpen = world.nodes.find((n) => n.level && !progress.levels[n.level.levelNumber]);
  if (firstOpen?.level?.levelNumber === node.level.levelNumber) return "current";
  if (node.level.levelNumber < (firstOpen?.level?.levelNumber ?? Infinity)) return "completed";
  return progress.unlockAll ? "open" : "locked";
}

export function worldProgress(world, progress) {
  const levels = world.nodes?.filter((n) => n.level) ?? [];
  if (!levels.length) return 0;
  const done = levels.filter((n) => progress.levels[n.level.levelNumber]).length;
  return Math.round((done / levels.length) * 100);
}
