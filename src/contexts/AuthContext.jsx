import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminsList, setAdminsList] = useState(['nandanpatkar14114@gmail.com']);
  const [lockedUsers, setLockedUsers] = useState([]);
  const [allowAimlForAll, setAllowAimlForAll] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('genai_gemini_key') || "");
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('genai_ai_provider') || "gemini");
  const [azureEndpoint, setAzureEndpoint] = useState(() => localStorage.getItem('genai_azure_endpoint') || "");
  const [azureKey, setAzureKey] = useState(() => localStorage.getItem('genai_azure_key') || "");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(() => localStorage.getItem('genai_isAdminView') !== 'false'); // Default to true if not set


  const updateGeminiKey = (key) => {
    setGeminiKey(key);
    localStorage.setItem('genai_gemini_key', key);
  };

  const updateAiProvider = (provider) => {
    setAiProvider(provider);
    localStorage.setItem('genai_ai_provider', provider);
  };

  const updateAzureEndpoint = (endpoint) => {
    setAzureEndpoint(endpoint);
    localStorage.setItem('genai_azure_endpoint', endpoint);
  };

  const updateAzureKey = (key) => {
    setAzureKey(key);
    localStorage.setItem('genai_azure_key', key);
  };

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
          // Only use global key if local key is empty
          const localKey = localStorage.getItem('genai_gemini_key');
          if (data.paths_data.geminiKey && !localKey) {
            setGeminiKey(data.paths_data.geminiKey);
          }
          const localProvider = localStorage.getItem('genai_ai_provider');
          if (data.paths_data.aiProvider && !localProvider) setAiProvider(data.paths_data.aiProvider);
          const localAzureEndpoint = localStorage.getItem('genai_azure_endpoint');
          if (data.paths_data.azureEndpoint && !localAzureEndpoint) setAzureEndpoint(data.paths_data.azureEndpoint);
          const localAzureKey = localStorage.getItem('genai_azure_key');
          if (data.paths_data.azureKey && !localAzureKey) setAzureKey(data.paths_data.azureKey);
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
