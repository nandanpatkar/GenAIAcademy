import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { supabase, readPersistedSession } from '../config/supabaseClient';
import { AI_PROVIDERS } from '../config/aiProviders';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// The Workspace Notes editor (public/editor, a self-hosted AFFiNE build) talks
// to api/copilot.js over same-origin fetch/EventSource requests that we don't
// control — there's no way to attach custom headers to them. Cookies, unlike
// headers, ride along automatically on same-origin requests, so mirroring the
// user's own AI provider settings into cookies is how api/copilot.js learns
// to use the visitor's own key instead of the shared admin/env-var fallback.
const AI_SETTINGS_COOKIES = {
  geminiKey: 'genai_gemini_key',
  aiProvider: 'genai_ai_provider',
  azureEndpoint: 'genai_azure_endpoint',
  azureKey: 'genai_azure_key',
  apiBeamEndpoint: 'genai_apibeam_endpoint',
  apiBeamModel: 'genai_apibeam_model',
};

const personalAiStorageKey = (name, userId) => `genai_${userId}_${name}`;

// One localStorage blob holds every provider's credentials, keyed by provider id:
//   { gemini: { key }, "azure-openai": { endpoint, key, model }, glm: {...}, ... }
const providerConfigsStorageKey = (userId) => `genai_${userId}_provider_configs`;

const readProviderConfigs = (userId) => {
  try {
    const raw = localStorage.getItem(providerConfigsStorageKey(userId));
    if (raw) return JSON.parse(raw) || {};
  } catch {
    /* fall through to legacy migration */
  }
  // Migrate legacy per-field keys (gemini_key / azure_endpoint / azure_key).
  const legacy = {};
  const geminiKey = localStorage.getItem(personalAiStorageKey('gemini_key', userId));
  const azureEndpoint = localStorage.getItem(personalAiStorageKey('azure_endpoint', userId));
  const azureKey = localStorage.getItem(personalAiStorageKey('azure_key', userId));
  if (geminiKey) legacy.gemini = { key: geminiKey };
  if (azureEndpoint || azureKey) legacy['azure-openai'] = { endpoint: azureEndpoint || '', key: azureKey || '' };
  return legacy;
};

function setAiSettingsCookie(name, value) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  if (!value) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    return;
  }
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export const AuthProvider = ({ children }) => {
  // Hydrate optimistically from the session supabase-js already persisted, so the
  // shell can paint without waiting on getSession()'s network round-trip. This is
  // a rendering hint only — authorisation is enforced by RLS, and the real session
  // replaces this as soon as getSession()/onAuthStateChange resolves below.
  const [session, setSession] = useState(readPersistedSession);
  const [user, setUser] = useState(() => readPersistedSession()?.user ?? null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminsList, setAdminsList] = useState(['nandanpatkar14114@gmail.com']);
  const [lockedUsers, setLockedUsers] = useState([]);
  const [allowAimlForAll, setAllowAimlForAll] = useState(false);
  // { overrides: { [itemId]: 'all' | 'admin' }, layout: [{ id, label, custom?, itemIds }] } | null
  const [sidebarConfig, setSidebarConfig] = useState(null);
  // AI credentials are personal settings. They are intentionally scoped to
  // the signed-in user and never fall back to the Admin Panel's global row.
  const [aiProvider, setAiProvider] = useState("gemini");
  // Generic credential map for every provider in the registry.
  const [providerConfigs, setProviderConfigs] = useState({});
  const [isLocked, setIsLocked] = useState(false);

  // Backward-compatible derived values for the two original providers, so
  // existing consumers (App sync effect, older settings panels) keep working.
  const geminiKey = providerConfigs.gemini?.key || "";
  const azureEndpoint = providerConfigs["azure-openai"]?.endpoint || "";
  const azureKey = providerConfigs["azure-openai"]?.key || "";
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(() => localStorage.getItem('genai_isAdminView') !== 'false'); // Default to true if not set


  // Mirror the providers supported by the same-origin Workspace Notes copilot
  // into cookies. The embedded editor cannot attach headers to its EventSource
  // calls, so this is how its server-side handler uses the visitor's selected
  // provider rather than a shared fallback.
  const syncLegacyCookies = (configs, provider) => {
    setAiSettingsCookie(AI_SETTINGS_COOKIES.aiProvider, provider);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.geminiKey, configs.gemini?.key || "");
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureEndpoint, configs["azure-openai"]?.endpoint || "");
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureKey, configs["azure-openai"]?.key || "");
    setAiSettingsCookie(AI_SETTINGS_COOKIES.apiBeamEndpoint, configs.apibeam?.endpoint || "");
    setAiSettingsCookie(AI_SETTINGS_COOKIES.apiBeamModel, configs.apibeam?.model || "");
  };

  // Generic: merge a patch into one provider's config and persist everything.
  const updateProviderConfig = (providerId, patch) => {
    setProviderConfigs((prev) => {
      const next = { ...prev, [providerId]: { ...(prev[providerId] || {}), ...(patch || {}) } };
      if (user?.id) {
        localStorage.setItem(providerConfigsStorageKey(user.id), JSON.stringify(next));
      }
      syncLegacyCookies(next, aiProvider);
      return next;
    });
  };

  const updateAiProvider = (provider) => {
    setAiProvider(provider);
    if (user?.id) localStorage.setItem(personalAiStorageKey('ai_provider', user.id), provider);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.aiProvider, provider);
  };

  // Backward-compatible helpers for the two original providers.
  const updateGeminiKey = (key) => updateProviderConfig("gemini", { key });
  const updateAzureEndpoint = (endpoint) => updateProviderConfig("azure-openai", { endpoint });
  const updateAzureKey = (key) => updateProviderConfig("azure-openai", { key });

  // Same sentinel-row-upsert pattern AdminManagement's updateGlobalConfig uses —
  // always rewrites the whole paths_data blob, so every field it knows about
  // must be included or a concurrent save from the other admin surface would
  // wipe it out.
  //
  // Credentials are deliberately NOT written here. `fetchGlobalConfig` has
  // never read them back (every user configures their own in Settings), and
  // the row is readable by every signed-in user, so writing one admin's
  // personal API key into it would publish it to the whole workspace.
  //
  // Returns { ok, error } rather than swallowing failures: writing this row
  // needs the admin RLS policy from
  // supabase/migrations/20260815_global_config_rls.sql, and before that
  // migration ran the rejection was invisible — the toggle looked saved and
  // reverted on the next refresh.
  const persistSidebarConfig = async (nextConfig) => {
    const previous = sidebarConfig;
    setSidebarConfig(nextConfig);
    const { error } = await supabase.from('user_curriculum').upsert({
      id: '00000000-0000-0000-0000-000000000000',
      paths_data: {
        admins: adminsList, locked: lockedUsers, allowAimlForAll,
        sidebarConfig: nextConfig,
        updated_at: new Date().toISOString(),
      },
    });
    if (error) {
      console.error("Could not update sidebar config:", error.message);
      setSidebarConfig(previous);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  };

  // Load only this user's personal AI settings. Clearing the generic cookie
  // on logout prevents one browser user from being reused by another.
  useEffect(() => {
    if (!user?.id) {
      setAiProvider("gemini");
      setProviderConfigs({});
      Object.values(AI_SETTINGS_COOKIES).forEach((name) => setAiSettingsCookie(name, ""));
      return;
    }

    const personalProvider = localStorage.getItem(personalAiStorageKey('ai_provider', user.id)) || "gemini";
    const personalConfigs = readProviderConfigs(user.id);

    setAiProvider(personalProvider);
    setProviderConfigs(personalConfigs);
    // Persist any freshly-migrated configs back under the new storage key.
    localStorage.setItem(providerConfigsStorageKey(user.id), JSON.stringify(personalConfigs));
    syncLegacyCookies(personalConfigs, personalProvider);
  }, [user?.id]);

  const fetchGlobalConfig = useCallback(async () => {
      try {
        const { data, error } = await supabase
          .from('user_curriculum')
          .select('paths_data')
          .eq('id', '00000000-0000-0000-0000-000000000000')
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found' for single()
          console.warn("Supabase error fetching global config:", error.message);
        }
        
        if (data && data.paths_data) {
          if (data.paths_data.admins) setAdminsList(data.paths_data.admins);
          if (data.paths_data.locked) setLockedUsers(data.paths_data.locked);
          if (data.paths_data.allowAimlForAll !== undefined) setAllowAimlForAll(data.paths_data.allowAimlForAll);
          if (data.paths_data.sidebarConfig !== undefined) setSidebarConfig(data.paths_data.sidebarConfig);
          // AI keys in the Admin Panel are deliberately not loaded here.
          // Every user must configure their own credentials in Settings.
        }
      } catch (e) {
        console.warn("Global config not found, using defaults");
      }
  }, []);

  // Re-read on every identity change. The row is only readable to a signed-in
  // user, so the fetch that runs before a session resolves comes back empty —
  // without this, a fresh sign-in (which arrives through onAuthStateChange,
  // not getSession) would leave every admin setting on its built-in default.
  useEffect(() => { fetchGlobalConfig(); }, [user?.id, fetchGlobalConfig]);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        const savedAdmin = localStorage.getItem('genai_isAdmin') === 'true';
        if (currentUser && adminsList.includes(currentUser.email)) {
           setIsAdmin(true);
           localStorage.setItem('genai_isAdmin', 'true');
        } else {
           setIsAdmin(savedAdmin);
        }

        if (currentUser && lockedUsers.includes(currentUser.id)) {
          setIsLocked(true);
        }

        setLoading(false);
        fetchGlobalConfig();
      })
      .catch((error) => {
        console.error("Auth initialization error:", error);
        setLoading(false);
      });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (!currentUser) {
        setIsAdmin(false);
        setIsLocked(false);
        localStorage.removeItem('genai_isAdmin');
      } else {
        if (adminsList.includes(currentUser.email)) {
          setIsAdmin(true);
          localStorage.setItem('genai_isAdmin', 'true');
        }
        if (lockedUsers.includes(currentUser.id)) {
          setIsLocked(true);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth helper functions
  const signUp = (email, password) => {
    return supabase.auth.signUp({ email, password });
  };

  const signIn = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = () => {
    setIsAdmin(false);
    localStorage.removeItem('genai_isAdmin');
    return supabase.auth.signOut();
  };

  const adminSignInMock = () => {
    setIsAdmin(true);
    localStorage.setItem('genai_isAdmin', 'true');
    setUser({ email: 'nandanpatkar14114@gmail.com', id: '00000000-0000-0000-0000-000000000000' }); // Use valid UUID
  };

  const value = {
    session,
    user,
    // True until getSession() resolves. `user` is already populated optimistically
    // from the persisted session, so most consumers can ignore this; it exists for
    // the ones that must not act on an unconfirmed identity.
    loading,
    isAdmin,
    adminsList,
    setAdminsList,
    lockedUsers,
    setLockedUsers,
    allowAimlForAll,
    setAllowAimlForAll,
    sidebarConfig,
    setSidebarConfig,
    persistSidebarConfig,
    geminiKey,
    updateGeminiKey,
    aiProvider,
    updateAiProvider,
    azureEndpoint,
    updateAzureEndpoint,
    azureKey,
    updateAzureKey,
    // Generic multi-provider credential store (GLM, Kimi, Grok, Groq, …).
    providerConfigs,
    updateProviderConfig,
    isLocked,
    adminSignInMock,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAdminView,
    setIsAdminView,
  };

  // Children render immediately. Previously this was `{!loading && children}`,
  // which meant the entire application — landing page included — waited on a
  // Supabase round-trip before painting a single pixel. Consumers that genuinely
  // need a confirmed session read `loading` from context and branch themselves.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
