// ─── Favourite blog store ──────────────────────────────────────────────────
// Signed-in readers save to Supabase, so their reading list follows their
// account across deployed clients. A small local list remains only for guests
// and is migrated to the account on their first signed-in visit.

import { supabase } from "../config/supabaseClient";

const STORAGE_KEY = "genai-favourite-blogs";

export function getFavoriteKey(blog) {
  return String(blog?.id || blog?.slug || "");
}

export function toSavedBlog(blog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    description: blog.description || blog.excerpt || "",
    content: blog.content || "",
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    archive_year: blog.archive_year,
    created_at: blog.created_at,
    month: blog.month,
    hero: blog.hero,
    cover_image: blog.cover_image,
    imageCount: blog.imageCount,
    source: blog.source,
    savedAt: new Date().toISOString(),
  };
}

export function getFavoriteBlogs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function isFavoriteBlog(blog, favorites = getFavoriteBlogs()) {
  const key = getFavoriteKey(blog);
  return Boolean(key && favorites.some((favorite) => getFavoriteKey(favorite) === key));
}

export function toggleFavoriteBlog(blog) {
  const key = getFavoriteKey(blog);
  if (!key) return getFavoriteBlogs();

  const favorites = getFavoriteBlogs();
  const existing = favorites.findIndex((favorite) => getFavoriteKey(favorite) === key);
  const updated = existing === -1
    ? [toSavedBlog(blog), ...favorites]
    : favorites.filter((favorite) => getFavoriteKey(favorite) !== key);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearLocalFavoriteBlogs() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Load the authenticated user's favorites. RLS enforces this server-side. */
export async function loadUserFavoriteBlogs(userId) {
  const { data, error } = await supabase
    .from("blog_favorites")
    .select("article, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({ ...row.article, savedAt: row.created_at }));
}

export async function saveUserFavoriteBlog(userId, blog) {
  const articleKey = getFavoriteKey(blog);
  if (!articleKey) return;
  const { error } = await supabase.from("blog_favorites").upsert({
    user_id: userId,
    article_key: articleKey,
    article: toSavedBlog(blog),
  }, { onConflict: "user_id,article_key" });
  if (error) throw error;
}

export async function removeUserFavoriteBlog(userId, blog) {
  const articleKey = getFavoriteKey(blog);
  if (!articleKey) return;
  const { error } = await supabase
    .from("blog_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("article_key", articleKey);
  if (error) throw error;
}

/** One-time import of bookmarks created before account sync was available. */
export async function migrateLocalFavoritesToUser(userId) {
  const localFavorites = getFavoriteBlogs();
  if (!localFavorites.length) return;
  const rows = localFavorites
    .map((blog) => ({
      user_id: userId,
      article_key: getFavoriteKey(blog),
      article: toSavedBlog(blog),
    }))
    .filter((row) => row.article_key);
  if (!rows.length) return;

  const { error } = await supabase
    .from("blog_favorites")
    .upsert(rows, { onConflict: "user_id,article_key", ignoreDuplicates: true });
  if (error) throw error;
  clearLocalFavoriteBlogs();
}
