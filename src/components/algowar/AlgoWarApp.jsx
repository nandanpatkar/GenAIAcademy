import React, { useState } from "react";
import { X } from "lucide-react";
import Icon from "./icons";
import logo from "../../assets/algowar/logo.webp";
import HomeView from "./views/HomeView";
import ArenaView from "./views/ArenaView";
import CareerView from "./views/CareerView";
import DailyView from "./views/DailyView";
import DreamView from "./views/DreamView";
import LeaderboardView from "./views/LeaderboardView";
import ProfileView from "./views/ProfileView";
import { profile } from "./data";
import { avatarFor } from "./avatars";
import "../../styles/algowar.css";

// Section list mirrors the live site's own navigation.
const SECTIONS = [
  { id: "home", label: "Home", icon: "flag" },
  { id: "arena", label: "Arena", icon: "swords" },
  { id: "career", label: "Career", icon: "route" },
  { id: "daily", label: "Daily", icon: "local_fire_department" },
  { id: "dream", label: "Dream", icon: "rocket" },
  { id: "leaderboard", label: "Leaderboard", icon: "social_leaderboard" },
  { id: "profile", label: "Profile", icon: "workspace_premium" },
];

export default function AlgoWarApp({ onClose }) {
  const [section, setSection] = useState("home");

  return (
    <div className="aw" data-section={section}>
      {/* AmbientBackground from the live site: dot grid, film noise and two drifting
          blur orbs (indigo top-left, red bottom-right). */}
      <div className="aw-ambient" aria-hidden="true">
        <div className="aw-dot-grid" />
        <div className="aw-noise" />
        <div className="aw-orb aw-orb-a" />
        <div className="aw-orb aw-orb-b" />
      </div>

      <header className="aw-topbar">
        <button type="button" className="aw-brand" onClick={() => setSection("home")}>
          <img className="aw-brand-logo" src={logo} alt="" width="36" height="36" />
          <span className="aw-brand-text">
            <strong>ALGOWARS</strong>
            <small>アルゴウォーズ</small>
          </span>
        </button>

        <nav className="aw-nav" aria-label="AlgoWars sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={section === s.id ? "is-active" : ""}
              onClick={() => setSection(s.id)}
              aria-current={section === s.id ? "page" : undefined}
            >
              <Icon name={s.icon} size={16} />
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="aw-topbar-end">
          <span className="aw-user-chip">
            <img src={avatarFor(profile.avatar)} alt="" width="22" height="22" />
            {profile.username}
          </span>
          {onClose && (
            <button type="button" className="aw-icon-btn" onClick={onClose} aria-label="Close AlgoWars">
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="aw-main">
        {section === "home" && <HomeView onEnter={setSection} />}
        {section === "arena" && <ArenaView onNavigate={setSection} />}
        {section === "career" && <CareerView />}
        {section === "daily" && <DailyView />}
        {section === "dream" && <DreamView />}
        {section === "leaderboard" && <LeaderboardView />}
        {section === "profile" && <ProfileView />}
      </main>

      <footer className="aw-footer">
        <span>Code is the weapon. Arena is the battlefield.</span>
        <span className="aw-footer-note">Local mirror of the AlgoWars arena — no network calls.</span>
      </footer>
    </div>
  );
}
