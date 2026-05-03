import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/githubhub.css";
import { X, GitBranch, TrendingUp, FolderTree, User, FileText, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabaseClient";
import TrendingFeed from "./github/TrendingFeed";
import CodeFlowViewer from "./github/CodeFlowViewer";
import ContributionTracker from "./github/ContributionTracker";
import RepoManager from "./github/RepoManager";
import ReadmeViewer from "./github/ReadmeViewer";

const TABS = [
  { id: "repos", icon: GitBranch, label: "My Repos" },
  { id: "trending", icon: TrendingUp, label: "Trending" },
  { id: "explorer", icon: FolderTree, label: "CodeFlow" },
  { id: "profile", icon: User, label: "Profile" },
  { id: "readme", icon: FileText, label: "README" },
];

export default function GitHubHub({ onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [repos, setRepos] = useState([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [readmeUrl, setReadmeUrl] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const isInitialSync = useRef(true);

  // Load from Supabase
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setRepos([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("user_links").select("*").eq("id", user.id).single();
        if (data) {
          setRepos(data.github_repos || []);
          setGithubUsername(data.github_username || "");
        } else if (error?.code === "PGRST116") {
          // New user: Start clean
          setRepos([]);
          await supabase.from("user_links").insert({ id: user.id, github_repos: [] });
        }
      } catch (err) {
        console.error("Failed to load github data:", err);
        setRepos([]);
      }
      setIsLoading(false);
      isInitialSync.current = false;
    };
    load();
  }, [user]);

  // Save to Supabase (debounced)
  useEffect(() => {
    if (isInitialSync.current || !user) return;
    const timer = setTimeout(async () => {
      try {
        await supabase.from("user_links").upsert({
          id: user.id,
          github_repos: repos,
          github_username: githubUsername || null,
          updated_at: new Date().toISOString(),
        });
      } catch (e) { console.error("Save failed", e); }
    }, 1000);
    return () => clearTimeout(timer);
  }, [repos, githubUsername, user]);

  const handleSaveRepo = useCallback((newRepo) => {
    setRepos(prev => {
      if (prev.some(r => r.url === newRepo.url)) return prev;
      return [newRepo, ...prev];
    });
  }, []);

  const handleSetUsername = useCallback((u) => { setGithubUsername(u); }, []);

  const handleExploreRepo = useCallback((url) => { setExplorerUrl(url); setActiveTab("explorer"); }, []);
  const handleViewReadme = useCallback((url) => { setReadmeUrl(url); setActiveTab("readme"); }, []);

  return (
    <motion.div 
      className="gh-hub"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Premium Header */}
      <motion.header 
        className="gh-hub-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="gh-hub-logo-container">
          <motion.div 
            className="gh-hub-icon-glow"
            animate={{ 
              boxShadow: ["0 0 10px #00ff8833", "0 0 20px #00ff8855", "0 0 10px #00ff8833"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GitBranch size={18} color="#00ff88" />
          </motion.div>
          
          <div className="gh-hub-title-stack">
            <motion.h1 
              className="gh-hub-main-title"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              GitHub <span className="accent-glow">Hub</span>
            </motion.h1>
            <motion.div 
              className="gh-hub-stats-row"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="gh-stat-count">{repos.length}</span>
              <span className="gh-stat-label">REPOSITORIES</span>
              <span className="gh-stat-divider">/</span>
              <span className="gh-stat-label">EXPLORE & ANALYZE</span>
            </motion.div>
          </div>
        </div>

        <div className="gh-header-actions">
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose} 
            className="gh-close-btn-premium"
          >
            <X size={20} />
          </motion.button>
        </div>
      </motion.header>

      {/* Tab Bar */}
      <div className="gh-tab-bar">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            className={`gh-tab ${activeTab === tab.id ? "active" : ""}`} 
            onClick={() => setActiveTab(tab.id)}
            style={{ position: "relative" }}
          >
            <tab.icon size={15} />
            <span className="gh-tab-label">{tab.label}</span>
            {tab.id === "repos" && repos.length > 0 && <span className="gh-tab-count">{repos.length}</span>}
            
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="gh-active-indicator"
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#00ff88",
                  boxShadow: "0 0 10px #00ff88",
                  zIndex: 1
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="gh-hub-content">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gh-center-msg" 
              style={{ flex: 1 }}
            >
              <Loader2 size={28} className="gh-spin" />
              <span>Loading GitHub Hub…</span>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {activeTab === "repos" && <RepoManager repos={repos} onUpdateRepos={setRepos} onSelectRepo={handleViewReadme} onExploreRepo={handleExploreRepo} />}
              {activeTab === "trending" && <TrendingFeed onSaveRepo={handleSaveRepo} />}
              {activeTab === "explorer" && <CodeFlowViewer key={explorerUrl} initialUrl={explorerUrl} onClose={() => setActiveTab("repos")} />}
              {activeTab === "profile" && <ContributionTracker githubUsername={githubUsername} onSetUsername={handleSetUsername} />}
              {activeTab === "readme" && <ReadmeViewer initialUrl={readmeUrl} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

