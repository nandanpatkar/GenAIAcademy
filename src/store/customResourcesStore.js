// ─── "My Folders" custom resource library ──────────────────────────────────
// Signed-in users sync their custom resource folders/assets to Supabase (one
// row per user, whole blob) so the library follows their account across
// devices. Guests keep a local-only copy, migrated to their account once on
// first sign-in. Mirrors src/store/favoriteBlogsStore.js.

import { supabase } from "../config/supabaseClient";

const STORAGE_KEY = "genai_custom_resources";
const EMPTY = { folders: [], assets: [] };

export function getLocalCustomResources() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return { ...EMPTY };
    return {
      folders: Array.isArray(saved.folders) ? saved.folders : [],
      assets: Array.isArray(saved.assets) ? saved.assets : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveLocalCustomResources(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalCustomResources() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Load the authenticated user's custom resources. RLS enforces this server-side. */
export async function loadUserCustomResources(userId) {
  const { data, error } = await supabase
    .from("user_custom_resources")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.data) return { ...EMPTY };
  return {
    folders: Array.isArray(data.data.folders) ? data.data.folders : [],
    assets: Array.isArray(data.data.assets) ? data.data.assets : [],
  };
}

export async function saveUserCustomResources(userId, data) {
  const { error } = await supabase
    .from("user_custom_resources")
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}

/** One-time import of folders/assets created before account sync was available. */
export async function migrateLocalCustomResourcesToUser(userId) {
  const local = getLocalCustomResources();
  if (!local.folders.length && !local.assets.length) return;

  const remote = await loadUserCustomResources(userId);
  const existingFolderIds = new Set(remote.folders.map((f) => f.id));
  const existingAssetIds = new Set(remote.assets.map((a) => a.id));

  const merged = {
    folders: [...remote.folders, ...local.folders.filter((f) => !existingFolderIds.has(f.id))],
    assets: [...remote.assets, ...local.assets.filter((a) => !existingAssetIds.has(a.id))],
  };

  await saveUserCustomResources(userId, merged);
  clearLocalCustomResources();
}
