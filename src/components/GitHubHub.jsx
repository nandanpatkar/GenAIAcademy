import { useState, useEffect, useRef, useCallback } from "react";
import { NinjaEye } from "./NinjaEye";
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
      <div className="gh-hub-backdrop" aria-hidden="true">
        <svg className="gh-github-watermark" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        <div className="gh-backdrop-kicker">OPEN SOURCE / REPOSITORY NETWORK</div>
        <div className="gh-contribution-wall">
          {Array.from({ length: 84 }, (_, index) => <i key={index} style={{ "--cell-index": index }} />)}
        </div>
        <svg className="gh-branch-map" viewBox="0 0 1000 720" preserveAspectRatio="none">
          <path d="M-20 520 C150 500 120 250 300 290 S430 580 600 445 S790 155 1020 215" />
          <path d="M245 720 C315 570 265 445 395 385 S610 420 715 300 S805 90 990 55" />
          <path d="M510 720 C520 610 690 590 750 510 S820 380 1030 390" />
          <circle cx="300" cy="290" r="5" />
          <circle cx="600" cy="445" r="5" />
          <circle cx="715" cy="300" r="5" />
          <circle cx="750" cy="510" r="5" />
        </svg>
        <div className="gh-backdrop-branch gh-backdrop-branch-a"><span /></div>
        <div className="gh-backdrop-branch gh-backdrop-branch-b"><span /></div>
      </div>

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
              <NinjaEye size={30} labelled={false} />
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
