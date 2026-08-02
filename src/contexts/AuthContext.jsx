import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

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
};

const personalAiStorageKey = (name, userId) => `genai_${userId}_${name}`;

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
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminsList, setAdminsList] = useState(['nandanpatkar14114@gmail.com']);
  const [lockedUsers, setLockedUsers] = useState([]);
  const [allowAimlForAll, setAllowAimlForAll] = useState(false);
  // { overrides: { [itemId]: 'all' | 'admin' }, layout: [{ id, label, custom?, itemIds }] } | null
  const [sidebarConfig, setSidebarConfig] = useState(null);
  // AI credentials are personal settings. They are intentionally scoped to
  // the signed-in user and never fall back to the Admin Panel's global row.
  const [geminiKey, setGeminiKey] = useState("");
  const [aiProvider, setAiProvider] = useState("gemini");
  const [azureEndpoint, setAzureEndpoint] = useState("");
  const [azureKey, setAzureKey] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(() => localStorage.getItem('genai_isAdminView') !== 'false'); // Default to true if not set


  const updateGeminiKey = (key) => {
    setGeminiKey(key);
    if (user?.id) localStorage.setItem(personalAiStorageKey('gemini_key', user.id), key);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.geminiKey, key);
  };

  const updateAiProvider = (provider) => {
    setAiProvider(provider);
    if (user?.id) localStorage.setItem(personalAiStorageKey('ai_provider', user.id), provider);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.aiProvider, provider);
  };

  const updateAzureEndpoint = (endpoint) => {
    setAzureEndpoint(endpoint);
    if (user?.id) localStorage.setItem(personalAiStorageKey('azure_endpoint', user.id), endpoint);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureEndpoint, endpoint);
  };

  const updateAzureKey = (key) => {
    setAzureKey(key);
    if (user?.id) localStorage.setItem(personalAiStorageKey('azure_key', user.id), key);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureKey, key);
  };

  // Same sentinel-row-upsert pattern AdminManagement's updateGlobalConfig uses —
  // always rewrites the whole paths_data blob, so every field it knows about
  // must be included or a concurrent save from the other admin surface would
  // wipe it out.
  const persistSidebarConfig = async (nextConfig) => {
    setSidebarConfig(nextConfig);
    try {
      await supabase.from('user_curriculum').upsert({
        id: '00000000-0000-0000-0000-000000000000',
        paths_data: {
          admins: adminsList, locked: lockedUsers, allowAimlForAll,
          geminiKey, aiProvider, azureEndpoint, azureKey,
          sidebarConfig: nextConfig,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Could not update sidebar config:", error);
    }
  };

  // Load only this user's personal AI settings. Clearing the generic cookie
  // on logout prevents one browser user from being reused by another.
  useEffect(() => {
    if (!user?.id) {
      setGeminiKey("");
      setAiProvider("gemini");
      setAzureEndpoint("");
      setAzureKey("");
      Object.values(AI_SETTINGS_COOKIES).forEach((name) => setAiSettingsCookie(name, ""));
      return;
    }

    const personalGeminiKey = localStorage.getItem(personalAiStorageKey('gemini_key', user.id)) || "";
    const personalProvider = localStorage.getItem(personalAiStorageKey('ai_provider', user.id)) || "gemini";
    const personalAzureEndpoint = localStorage.getItem(personalAiStorageKey('azure_endpoint', user.id)) || "";
    const personalAzureKey = localStorage.getItem(personalAiStorageKey('azure_key', user.id)) || "";

    setGeminiKey(personalGeminiKey);
    setAiProvider(personalProvider);
    setAzureEndpoint(personalAzureEndpoint);
    setAzureKey(personalAzureKey);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.geminiKey, personalGeminiKey);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.aiProvider, personalProvider);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureEndpoint, personalAzureEndpoint);
    setAiSettingsCookie(AI_SETTINGS_COOKIES.azureKey, personalAzureKey);
  }, [user?.id]);

  useEffect(() => {
    const fetchGlobalConfig = async () => {
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
    };

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
    isLocked,
    adminSignInMock,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAdminView,
    setIsAdminView,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
