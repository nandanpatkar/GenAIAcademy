/**
 * curriculumCache.js — one shared read of the `user_curriculum` row.
 *
 * Three independent consumers used to fetch this row on every page load:
 *   - AuthContext  (the sentinel config row)
 *   - ThemeContext (this user's row, to read `appearance` off paths_data)
 *   - App.jsx      (this user's row, for the curriculum itself)
 *
 * The last two fetched the *same* row and transferred the entire paths_data JSONB
 * blob twice. This module collapses them into a single in-flight promise, so the
 * row crosses the wire once per session regardless of how many consumers want it.
 *
 * The cache is deliberately keyed by user id: signing in as someone else must not
 * hand the new user the previous user's promise. `resetCurriculumCache()` is called
 * on sign-out for the same reason.
 */

import { supabase } from '../config/supabaseClient';

let cache = { userId: null, promise: null };

/**
 * Read this user's curriculum row, reusing an in-flight or completed request.
 *
 * Resolves to `{ paths_data, appearance, missing, error }` and never throws.
 *
 * `error` and `missing` are deliberately distinct, and callers MUST honour that:
 * `missing` means the database answered and this user genuinely has no row yet
 * (seed them with defaults), whereas `error` means we don't know. Treating an
 * error as "new user" would seed defaults into local state, which the debounced
 * sync in App.jsx would then write over the user's real curriculum.
 */
export function loadCurriculumRow(userId) {
  if (!userId) return Promise.resolve({ paths_data: null, appearance: null, missing: false, error: null });
  if (cache.userId === userId && cache.promise) return cache.promise;

  const promise = (async () => {
    // `appearance` lives in its own column (see the 20260809_perf_indexes_and_split
    // migration) so theme reads don't have to pull the whole curriculum. Older
    // deployments that haven't run the migration still have it inside paths_data;
    // the fallback below keeps both shapes working.
    let result = await supabase
      .from('user_curriculum')
      .select('paths_data, appearance')
      .eq('id', userId)
      .maybeSingle();

    // 42703 = undefined_column: the migration hasn't been applied yet. Any other
    // failure is a real error and must not be retried as a legacy read.
    if (result.error?.code === '42703') {
      result = await supabase
        .from('user_curriculum')
        .select('paths_data')
        .eq('id', userId)
        .maybeSingle();
    }

    if (result.error) {
      console.error('Could not load curriculum row:', result.error);
      // Don't cache a failure — let the next caller retry.
      if (cache.userId === userId) cache = { userId: null, promise: null };
      return { paths_data: null, appearance: null, missing: false, error: result.error };
    }

    const row = result.data;
    return {
      paths_data: row?.paths_data ?? null,
      // Prefer the dedicated column; fall back to the legacy in-blob location.
      appearance: row?.appearance ?? row?.paths_data?.appearance ?? null,
      missing: !row,
      error: null,
    };
  })();

  cache = { userId, promise };
  return promise;
}

/** Drop the cached row. Call on sign-out so the next user starts clean. */
export function resetCurriculumCache() {
  cache = { userId: null, promise: null };
}

/**
 * Replace the cached paths_data after a local write, so a consumer that reads
 * later in the same session sees the current value rather than the loaded one.
 */
export function primeCurriculumCache(userId, patch) {
  if (!userId || cache.userId !== userId || !cache.promise) return;
  cache.promise = cache.promise.then((row) => ({ ...row, ...patch }));
}
