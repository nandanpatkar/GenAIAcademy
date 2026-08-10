import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twcsujjshudwgpihkwyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3N1ampzaHVkd2dwaWhrd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NjQ4MTcsImV4cCI6MjA5MDM0MDgxN30.mG65e8fpfquKR8r_GjK_IxSDKPnW6ij80nT_Fknyq80';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// supabase-js persists the session under `sb-<project-ref>-auth-token`.
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
export const AUTH_STORAGE_KEY = `sb-${projectRef}-auth-token`;

/**
 * Read the session supabase-js already persisted, synchronously.
 *
 * `supabase.auth.getSession()` returns a promise and, once the access token has
 * expired (i.e. on any visit more than an hour after the last), performs a token
 * refresh round-trip before resolving. Blocking the first render on that is what
 * made every page load wait on the network. This lets the shell paint from the
 * stored session immediately; `onAuthStateChange` corrects it a moment later if
 * the token turns out to be invalid.
 *
 * The result is a UI hint ONLY — it is unverified client-side data and must never
 * be used for an authorisation decision. Every real access check stays in RLS.
 */
export function readPersistedSession() {
  try {
    let raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    // Newer supabase-js versions may store the payload base64-encoded.
    if (raw.startsWith('base64-')) raw = atob(raw.slice(7));
    const parsed = JSON.parse(raw);
    // Some versions wrap the session as { currentSession }.
    const session = parsed?.currentSession || parsed;
    return session?.user ? session : null;
  } catch {
    return null;
  }
}
