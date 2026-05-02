# 🌌 GenAI Academy: Project Instructions

This document provides foundational guidance for the GenAI Academy project. All contributors (including AI agents) must adhere to these standards.

## 🚀 Project Overview
GenAI Academy is a tactical command center for AI engineers, featuring immersive UX, deep-tech simulators, and AI-driven study suites.

## 🛠️ Tactical Stack
- **Frontend:** React 18 / Vite
- **Visuals:** ReactFlow / Canvas API / D3 / Framer Motion
- **State:** Supabase Real-time / React Context API
- **Auth:** Supabase Auth
- **AI Integration:** Google Gemini 1.5 (via `aiService.js`)
- **Execution:** Pyodide (`react-py`) for in-browser Python
- **Styling:** Custom "Obsidian/Neon" Design System (Vanilla CSS)

## 🏗️ Architectural Patterns

### State-Driven Navigation
The application is primarily a Single Page Application (SPA) where navigation is managed through state toggles in `src/App.jsx` rather than traditional routing. Most "pages" are components toggled via the `Sidebar`.

### AI Service Layer (`src/services/aiService.js`)
- **JSON Safety:** All AI responses expected to be JSON are processed through `extractJSON` and `parseSafety` to handle markdown wrappers and truncation.
- **Dynamic Keys:** Supports both environment-provided keys (`VITE_GEMINI_API_KEY`) and user-provided dynamic keys managed via `AuthContext`.

### Database & Auth (`src/config/supabaseClient.js`)
- Uses Supabase for all persistent storage and user authentication.
- Auth state is provided via `src/contexts/AuthContext.jsx`.

## 🎨 Design System: Obsidian/Neon
Strictly adhere to the following palette:
- **Primary:** Pitch Black `#000000`
- **Accent 1:** Emerald Pulse `#00ff88`
- **Accent 2:** Cobalt Flow `#0088ff`
- **Surface:** Glassmorphic Slate `#1a1a1a`
- **Text:** High-contrast whites and accented glows.

## 📜 Coding Standards
- **Components:** Prefer functional components with hooks.
- **Icons:** Use `lucide-react` for system icons.
- **Animations:** Use `framer-motion` for transitions and interactive feedback.
- **Styling:** Add styles to `src/styles/global.css` or component-specific CSS files. Avoid inline styles for complex layouts.
- **Error Handling:** Use the `ErrorBoundary` component for high-risk render zones.

## ⚙️ Operational Commands
- `npm run dev`: Ignite the development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build.

## 🔑 Environment Variables
Required in `.env.local`:
- `VITE_GEMINI_API_KEY`: Google AI Studio key.
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key.
