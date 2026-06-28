/**
 * walkthroughSteps.js
 * ─────────────────────
 * Central data source for all walkthrough/tour step definitions.
 * Contains: main overview + per-section detailed walkthroughs.
 */

// ═══════════════════════════════════════════════════════════
//  MAIN OVERVIEW (shown on first login)
// ═══════════════════════════════════════════════════════════
export const MAIN_STEPS = [
  {
    id: 'welcome',
    title: ['Welcome to ', 'GenAI Academy'],
    subtitle: 'Your tactical command center for mastering AI engineering. This quick tour will show you every section so you always know where things are.',
    icon: 'Sparkles',
    color: '#00ff88',
    features: [],
    isWelcome: true
  },
  {
    id: 'learn',
    title: ['The ', 'Learn Section'],
    subtitle: 'Explore, visualize, and track your AI knowledge through immersive maps and graphs. This is where all your learning journeys begin.',
    icon: 'Orbit',
    color: '#a855f7',
    features: [
      { icon: 'LayoutDashboard', label: 'Home — Main Roadmap Dashboard' },
      { icon: 'Orbit', label: 'Knowledge Galaxy — 3D Star Explorer' },
      { icon: 'Share2', label: 'Knowledge Graph — Node Visualization' },
      { icon: 'Network', label: 'Study Map — Curriculum Blueprint' },
      { icon: 'CircleDashed', label: 'Progress — Completion Tracker' }
    ]
  },
  {
    id: 'tools',
    title: ['The ', 'Tools Section'],
    subtitle: 'Hands-on labs, simulators, and visualizers. Practice coding, animate algorithms, and build systems — all inside your browser.',
    icon: 'Terminal',
    color: '#f59e0b',
    features: [
      { icon: 'Terminal', label: 'Practice IDE — Python Sandbox' },
      { icon: 'Boxes', label: 'GenAI Simulator — AI Prototyping' },
      { icon: 'Layers', label: 'System Simulator — Architecture Lab' },
      { icon: 'Clapperboard', label: 'DSA Animator — Visual Data Structures' },
      { icon: 'Box', label: 'Algo Visualizer — Step-by-Step Code' },
      { icon: 'Boxes', label: 'K8s Games — Cluster Challenges' },
      { icon: 'GitCommit', label: 'Git Visualizer — Branch Explorer' }
    ]
  },
  {
    id: 'content',
    title: ['The ', 'Content Section'],
    subtitle: 'Curated blogs, resources, bookmarks, quick notes, and interview prep tools. Your comprehensive reference library.',
    icon: 'BookMarked',
    color: '#3b82f6',
    features: [
      { icon: 'BookMarked', label: 'Blog — Research Archive' },
      { icon: 'Bookmark', label: 'Links — Curated Bookmarks' },
      { icon: 'GitBranch', label: 'GitHub — Repo Manager' },
      { icon: 'CheckSquare', label: 'Quick Notes — Workspace Notes' },
      { icon: 'BookOpen', label: 'Resources — Learning Materials' },
      { icon: 'GraduationCap', label: 'AIML Companion — AI Study Partner' },
      { icon: 'Users', label: 'AI Interviewer — Mock Sessions' },
      { icon: 'Users', label: 'Community — Chat & Connect' }
    ]
  },
  {
    id: 'paths',
    title: ['Your ', 'Study Paths'],
    subtitle: 'Track progress across specialized AI learning tracks. Each path has nodes, modules, and subtopics — with full completion tracking visible in the sidebar.',
    icon: 'Zap',
    color: '#10b981',
    features: [
      { icon: 'Monitor', label: 'Data Science — Full Curriculum' },
      { icon: 'Sparkles', label: 'Gen AI — LLM & RAG Mastery' },
      { icon: 'Rocket', label: 'Agentic AI — Autonomous Systems' },
      { icon: 'CircleDashed', label: 'Progress Bars — Track Each Path' },
      { icon: 'Layers', label: 'Modules & Subtopics — Deep Drill' }
    ]
  },
  {
    id: 'ready',
    title: ["You're ", 'All Set!'],
    subtitle: "That's the overview! Click any sidebar item to dive in — each section has its own guided tour the first time you open it. You can always retake this tour from the ❓ button in the top-right.",
    icon: 'Rocket',
    color: '#00ff88',
    features: [],
    isFinal: true
  }
];


// ═══════════════════════════════════════════════════════════
//  SECTION-SPECIFIC WALKTHROUGHS
// ═══════════════════════════════════════════════════════════

export const SECTION_STEPS = {
  // ── LEARN ──────────────────────────────────────────────
  overview: {
    title: 'Home — Roadmap Dashboard',
    color: '#a855f7',
    steps: [
      {
        id: 'overview-1',
        title: ['The ', 'Roadmap Dashboard'],
        subtitle: 'This is your main workspace. You\'ll see your active learning path with all its nodes laid out as a visual roadmap.',
        icon: 'LayoutDashboard',
        features: [
          { icon: 'Map', label: 'Path tabs at top — switch between DSA, Gen AI, Agentic AI, etc.' },
          { icon: 'CircleDashed', label: 'Progress bar — shows completed vs total modules' },
          { icon: 'Zap', label: '"Jump to Current" — teleport to your last active node' }
        ]
      },
      {
        id: 'overview-2',
        title: ['Understanding ', 'Node Cards'],
        subtitle: 'Each card on the roadmap is a topic node. Nodes contain modules and subtopics. Click a card to expand it.',
        icon: 'Box',
        features: [
          { icon: 'Layers', label: 'Subnode count — how many modules inside' },
          { icon: 'CheckSquare', label: 'Status indicator — Ready, In Progress, or Complete' },
          { icon: 'ExternalLink', label: '"Explore" — opens the node detail panel' }
        ]
      },
      {
        id: 'overview-3',
        title: ['Inside a ', 'Node'],
        subtitle: 'When you click a node, three panels appear: the module list (left), module content (center), and resources (right).',
        icon: 'Columns3',
        features: [
          { icon: 'List', label: 'Module List — all modules with progress badges' },
          { icon: 'FileText', label: 'Module Content — overview, problems, and topic checklist' },
          { icon: 'Video', label: 'Resource Panel — Videos, Files, and Links tabs' },
          { icon: 'CheckCircle2', label: 'Mark module complete / in-progress / node done' }
        ]
      }
    ]
  },

  galaxy: {
    title: 'Knowledge Galaxy',
    color: '#8b5cf6',
    steps: [
      {
        id: 'galaxy-1',
        title: ['The ', 'Knowledge Galaxy'],
        subtitle: 'An immersive 3D star-field visualization of your entire knowledge space. Each star is a concept, and constellations are learning paths.',
        icon: 'Orbit',
        features: [
          { icon: 'Orbit', label: '3D star map — rotate, zoom, and explore' },
          { icon: 'Sparkles', label: 'Stars represent individual topics and modules' },
          { icon: 'Network', label: 'Connections show prerequisite relationships' }
        ]
      },
      {
        id: 'galaxy-2',
        title: ['Navigating the ', 'Galaxy'],
        subtitle: 'Click any star to see its details. Completed topics glow brightly. Use scroll to zoom and drag to rotate the view.',
        icon: 'Navigation',
        features: [
          { icon: 'MousePointer', label: 'Click a star — view topic details and navigate there' },
          { icon: 'ZoomIn', label: 'Scroll — zoom in and out of clusters' },
          { icon: 'Move', label: 'Drag — rotate the 3D view freely' },
          { icon: 'Focus', label: '"Focus" — jump to a specific topic in the galaxy' }
        ]
      }
    ]
  },

  knowledge_graph: {
    title: 'Knowledge Graph',
    color: '#06b6d4',
    steps: [
      {
        id: 'kg-1',
        title: ['The ', 'Knowledge Graph'],
        subtitle: 'A 2D force-directed graph showing how all your topics connect. Nodes are topics, edges show prerequisites and relationships.',
        icon: 'Share2',
        features: [
          { icon: 'Share2', label: 'Interactive graph — drag nodes, zoom, pan' },
          { icon: 'Palette', label: 'Color-coded by path — each path has its own hue' },
          { icon: 'ArrowRight', label: 'Directed edges — show learning order' }
        ]
      },
      {
        id: 'kg-2',
        title: ['Graph ', 'Interactions'],
        subtitle: 'Click any node to highlight its connections. Double-click to navigate directly to that topic in the roadmap view.',
        icon: 'MousePointer',
        features: [
          { icon: 'MousePointer', label: 'Click — highlight connected nodes' },
          { icon: 'ExternalLink', label: 'Double-click — navigate to the topic' },
          { icon: 'Filter', label: 'Filter by path — isolate a single learning track' },
          { icon: 'Search', label: 'Search — find any topic in the graph' }
        ]
      }
    ]
  },

  curriculum_map: {
    title: 'Study Map',
    color: '#ec4899',
    steps: [
      {
        id: 'cm-1',
        title: ['The ', 'Study Map'],
        subtitle: 'A hierarchical tree view of your entire curriculum. See every path, node, module, and subtopic in one organized view.',
        icon: 'Network',
        features: [
          { icon: 'Network', label: 'Tree structure — expand/collapse branches' },
          { icon: 'CheckSquare', label: 'Status icons — pending, in-progress, complete' },
          { icon: 'BarChart', label: 'Completion stats — percentage per branch' }
        ]
      },
      {
        id: 'cm-2',
        title: ['Using the ', 'Study Map'],
        subtitle: 'Expand any branch to drill into subtopics. Click a topic to navigate directly to it in the roadmap view.',
        icon: 'TreeDeciduous',
        features: [
          { icon: 'ChevronRight', label: 'Expand — click arrows to reveal children' },
          { icon: 'ExternalLink', label: 'Navigate — click any item to jump there' },
          { icon: 'Eye', label: 'Overview — see the entire curriculum at a glance' }
        ]
      }
    ]
  },

  progress: {
    title: 'Progress Tracker',
    color: '#10b981',
    steps: [
      {
        id: 'prog-1',
        title: ['The ', 'Progress Tracker'],
        subtitle: 'Your central dashboard for tracking completion across all learning paths. See stats, charts, and recent activity.',
        icon: 'CircleDashed',
        features: [
          { icon: 'PieChart', label: 'Completion ring — overall progress at a glance' },
          { icon: 'BarChart', label: 'Per-path breakdown — compare tracks side by side' },
          { icon: 'Clock', label: 'Recent activity — what you worked on last' },
          { icon: 'Target', label: 'Goals — set and track learning objectives' }
        ]
      }
    ]
  },

  // ── TOOLS ──────────────────────────────────────────────
  ide: {
    title: 'Practice IDE',
    color: '#f59e0b',
    steps: [
      {
        id: 'ide-1',
        title: ['The ', 'Practice IDE'],
        subtitle: 'A fully functional Python coding environment running entirely in your browser via Pyodide. Write, run, and debug code without leaving the app.',
        icon: 'Terminal',
        features: [
          { icon: 'Code', label: 'Code editor — syntax highlighting, line numbers' },
          { icon: 'Play', label: 'Run button — execute Python code instantly' },
          { icon: 'Terminal', label: 'Output console — see print results and errors' }
        ]
      },
      {
        id: 'ide-2',
        title: ['IDE ', 'Features'],
        subtitle: 'The IDE supports standard Python libraries, input/output, and has a clean editing experience with Monaco Editor.',
        icon: 'Code',
        features: [
          { icon: 'Package', label: 'Python packages — NumPy, Pandas available via Pyodide' },
          { icon: 'Save', label: 'Auto-save — your code persists between sessions' },
          { icon: 'Maximize', label: 'Full-screen — expand for distraction-free coding' }
        ]
      }
    ]
  },

  playground: {
    title: 'GenAI Simulator',
    color: '#8b5cf6',
    steps: [
      {
        id: 'pg-1',
        title: ['The ', 'GenAI Simulator'],
        subtitle: 'Design and prototype GenAI systems visually. Build RAG pipelines, prompt chains, and agent architectures with drag-and-drop components.',
        icon: 'Boxes',
        features: [
          { icon: 'Boxes', label: 'Component library — LLMs, retrievers, vector DBs, agents' },
          { icon: 'ArrowRight', label: 'Flow connections — wire components together' },
          { icon: 'Play', label: 'Simulate — see data flow through your pipeline' }
        ]
      },
      {
        id: 'pg-2',
        title: ['Building a ', 'System'],
        subtitle: 'Drag components onto the canvas, connect them, and configure parameters. The simulator shows you how data flows through each stage.',
        icon: 'Workflow',
        features: [
          { icon: 'Settings', label: 'Configure — set model params, chunk sizes, embeddings' },
          { icon: 'Eye', label: 'Preview — see intermediate outputs at each stage' },
          { icon: 'Download', label: 'Export — save your architecture as a diagram' }
        ]
      }
    ]
  },

  simulator: {
    title: 'System Simulator',
    color: '#ef4444',
    steps: [
      {
        id: 'sim-1',
        title: ['The ', 'System Simulator'],
        subtitle: 'Design distributed system architectures. Place components like load balancers, databases, caches, and message queues on an interactive canvas.',
        icon: 'Layers',
        features: [
          { icon: 'Server', label: 'Component palette — servers, databases, queues, CDNs' },
          { icon: 'ArrowRight', label: 'Connections — draw data flow between components' },
          { icon: 'Activity', label: 'Load simulation — see how traffic flows through' }
        ]
      },
      {
        id: 'sim-2',
        title: ['Architecture ', 'Design'],
        subtitle: 'Use the simulator to practice system design interviews or explore how real-world systems are built. Save and share your designs.',
        icon: 'PenTool',
        features: [
          { icon: 'FileText', label: 'Templates — start from pre-built architectures' },
          { icon: 'Zap', label: 'Stress test — simulate high load scenarios' },
          { icon: 'Share', label: 'Share — export or collaborate on designs' }
        ]
      }
    ]
  },

  dsa_animator: {
    title: 'DSA Animator',
    color: '#f97316',
    steps: [
      {
        id: 'dsa-1',
        title: ['The ', 'DSA Animator'],
        subtitle: 'Watch data structures and algorithms come to life. Visual step-by-step animations show exactly how arrays, trees, graphs, and sorting algorithms work.',
        icon: 'Clapperboard',
        features: [
          { icon: 'Play', label: 'Animate — watch algorithms execute step by step' },
          { icon: 'Pause', label: 'Step control — pause, step forward/back' },
          { icon: 'Sliders', label: 'Speed control — slow down or speed up animations' },
          { icon: 'Code', label: 'Code view — see the algorithm code alongside the animation' }
        ]
      }
    ]
  },

  algo_visualizer: {
    title: 'Algo Visualizer',
    color: '#06b6d4',
    steps: [
      {
        id: 'alg-1',
        title: ['The ', 'Algo Visualizer'],
        subtitle: 'Write code and watch it execute visually. The visualizer traces through your algorithm, showing variable states, array changes, and recursive calls.',
        icon: 'Box',
        features: [
          { icon: 'Code', label: 'Code editor — write your algorithm' },
          { icon: 'Eye', label: 'Execution trace — see each line execute' },
          { icon: 'BarChart', label: 'Variable inspector — watch values change in real-time' },
          { icon: 'GitBranch', label: 'Call stack — visualize recursive function calls' }
        ]
      }
    ]
  },

  k8s_games: {
    title: 'K8s Games',
    color: '#3b82f6',
    steps: [
      {
        id: 'k8s-1',
        title: ['The ', 'K8s Games'],
        subtitle: 'Learn Kubernetes through interactive challenges. Deploy pods, manage services, and debug cluster issues in a gamified environment.',
        icon: 'Boxes',
        features: [
          { icon: 'Gamepad2', label: 'Challenges — progressive difficulty levels' },
          { icon: 'Server', label: 'Cluster view — visual cluster topology' },
          { icon: 'Terminal', label: 'kubectl — practice real commands' },
          { icon: 'Trophy', label: 'Scoring — earn points for correct solutions' }
        ]
      }
    ]
  },

  git_visualizer: {
    title: 'Git Visualizer',
    color: '#10b981',
    steps: [
      {
        id: 'git-1',
        title: ['The ', 'Git Visualizer'],
        subtitle: 'See Git operations visually. Understand branching, merging, rebasing, and cherry-picking through interactive visual diagrams.',
        icon: 'GitCommit',
        features: [
          { icon: 'GitBranch', label: 'Branch graph — see all branches visually' },
          { icon: 'GitMerge', label: 'Merge visualization — understand merge strategies' },
          { icon: 'Terminal', label: 'Command input — run git commands and see results' },
          { icon: 'History', label: 'Commit history — visual commit log' }
        ]
      }
    ]
  },

  // ── CONTENT ────────────────────────────────────────────
  blog: {
    title: 'Blog',
    color: '#8b5cf6',
    steps: [
      {
        id: 'blog-1',
        title: ['The ', 'Blog'],
        subtitle: 'A curated archive of AI/ML research articles, tutorials, and deep-dives. Browse by year, filter by topic, or explore AI-generated summaries.',
        icon: 'BookMarked',
        features: [
          { icon: 'Calendar', label: 'Year filter — browse articles by year' },
          { icon: 'Sparkles', label: 'AI articles — AI-generated summaries and insights' },
          { icon: 'Search', label: 'Search — find articles by keyword' },
          { icon: 'ExternalLink', label: 'Read — open full articles in a rich reader' }
        ]
      }
    ]
  },

  links: {
    title: 'Links & Bookmarks',
    color: '#f59e0b',
    steps: [
      {
        id: 'links-1',
        title: ['The ', 'Links Manager'],
        subtitle: 'Save, organize, and access your favorite learning resources. Tag, search, and categorize your bookmarks all in one place.',
        icon: 'Bookmark',
        features: [
          { icon: 'Bookmark', label: 'Save links — add URLs with tags and descriptions' },
          { icon: 'FolderOpen', label: 'Categories — organize by topic or project' },
          { icon: 'Search', label: 'Search — instantly find saved resources' },
          { icon: 'ExternalLink', label: 'Quick open — launch any link in a new tab' }
        ]
      }
    ]
  },

  github: {
    title: 'GitHub Hub',
    color: '#6366f1',
    steps: [
      {
        id: 'gh-1',
        title: ['The ', 'GitHub Hub'],
        subtitle: 'Your integrated GitHub dashboard. Browse repositories, explore code, view commit history, and analyze repo structures without leaving the app.',
        icon: 'GitBranch',
        features: [
          { icon: 'FolderOpen', label: 'Repo browser — explore file trees interactively' },
          { icon: 'GitCommit', label: 'Commit history — visual commit timeline' },
          { icon: 'Code', label: 'Code viewer — read files with syntax highlighting' },
          { icon: 'BarChart', label: 'Analytics — repo stats and language breakdown' }
        ]
      }
    ]
  },

  tasks: {
    title: 'Quick Notes',
    color: '#10b981',
    steps: [
      {
        id: 'tasks-1',
        title: ['The ', 'Quick Notes'],
        subtitle: 'Your personal workspace for jotting down ideas, notes, and to-dos. Notes are saved to your account and sync across sessions.',
        icon: 'CheckSquare',
        features: [
          { icon: 'PenTool', label: 'Create notes — rich text with markdown support' },
          { icon: 'CheckSquare', label: 'Task lists — track your to-dos' },
          { icon: 'Clock', label: 'Timestamped — see when each note was created' },
          { icon: 'Trash', label: 'Manage — edit or delete notes anytime' }
        ]
      }
    ]
  },

  resources: {
    title: 'Resources',
    color: '#3b82f6',
    steps: [
      {
        id: 'res-1',
        title: ['The ', 'Resources'],
        subtitle: 'A comprehensive library of learning materials. Browse curated lists of courses, papers, tools, and reference docs for every topic.',
        icon: 'BookOpen',
        features: [
          { icon: 'BookOpen', label: 'Curated lists — handpicked by topic experts' },
          { icon: 'Video', label: 'Video courses — links to top video content' },
          { icon: 'FileText', label: 'Papers & docs — academic references' },
          { icon: 'ExternalLink', label: 'Quick access — open resources instantly' }
        ]
      }
    ]
  },

  aiml_companion: {
    title: 'AIML Companion',
    color: '#00ff88',
    steps: [
      {
        id: 'aiml-1',
        title: ['The ', 'AIML Companion'],
        subtitle: 'Your AI-powered study partner. Ask questions, get explanations, generate practice problems, and have conversations about any AI/ML topic.',
        icon: 'GraduationCap',
        features: [
          { icon: 'MessageSquare', label: 'Chat — natural conversation with AI' },
          { icon: 'Brain', label: 'Explain concepts — get detailed breakdowns' },
          { icon: 'Code', label: 'Code generation — get code examples and solutions' },
          { icon: 'HelpCircle', label: 'Quiz mode — test your understanding' }
        ]
      }
    ]
  },

  interviewer: {
    title: 'AI Interviewer',
    color: '#ef4444',
    steps: [
      {
        id: 'int-1',
        title: ['The ', 'AI Interviewer'],
        subtitle: 'Practice technical interviews with an AI-powered interviewer. Get asked questions on DSA, system design, and ML — just like a real interview.',
        icon: 'Users',
        features: [
          { icon: 'Mic', label: 'Live interview — real-time Q&A with AI' },
          { icon: 'Brain', label: 'Topics — DSA, system design, ML, behavioral' },
          { icon: 'MessageSquare', label: 'Follow-ups — the AI asks clarifying questions' },
          { icon: 'BarChart', label: 'Feedback — get scored and get improvement tips' }
        ]
      }
    ]
  },

  community: {
    title: 'Community',
    color: '#6366f1',
    steps: [
      {
        id: 'comm-1',
        title: ['The ', 'Community'],
        subtitle: 'Connect with fellow learners. Join groups, send direct messages, share code snippets, and collaborate on projects in real-time.',
        icon: 'Users',
        features: [
          { icon: 'Users', label: 'Groups — join topic-based study groups' },
          { icon: 'MessageSquare', label: 'Chat — real-time messaging with markdown support' },
          { icon: 'Code', label: 'Code sharing — syntax-highlighted code blocks' },
          { icon: 'Send', label: 'Direct messages — private 1-on-1 conversations' }
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════
//  COMPREHENSIVE SIDEBAR OVERVIEW
// ═══════════════════════════════════════════════════════════

export const SIDEBAR_OVERVIEW_STEPS = [
  {
    id: 'sidebar-home',
    target: '#sidebar-item-overview',
    title: ['Home ', 'Dashboard'],
    subtitle: 'Your main tactical roadmap. View active learning paths, track module progress, and navigate through your AI curriculum.',
    icon: 'LayoutDashboard',
    color: '#a855f7'
  },
  {
    id: 'sidebar-galaxy',
    target: '#sidebar-item-galaxy',
    title: ['Knowledge ', 'Galaxy'],
    subtitle: 'An immersive 3D visualization of your entire knowledge space. Every star is a topic, and every constellation is a learning path.',
    icon: 'Orbit',
    color: '#8b5cf6'
  },
  {
    id: 'sidebar-kg',
    target: '#sidebar-item-knowledge_graph',
    title: ['Knowledge ', 'Graph'],
    subtitle: 'A 2D relational map showing how topics connect. Perfect for understanding prerequisites and cross-topic dependencies.',
    icon: 'Share2',
    color: '#06b6d4'
  },
  {
    id: 'sidebar-map',
    target: '#sidebar-item-curriculum_map',
    title: ['Study ', 'Map'],
    subtitle: 'A structural tree view of the entire academy curriculum. Drill down into nodes, modules, and subtopics with ease.',
    icon: 'Network',
    color: '#ec4899'
  },
  {
    id: 'sidebar-progress',
    target: '#sidebar-item-progress',
    title: ['Progress ', 'Tracker'],
    subtitle: 'Your central hub for stats. Monitor completion rates across all paths and see your recent learning activity.',
    icon: 'CircleDashed',
    color: '#10b981'
  },
  {
    id: 'sidebar-ide',
    target: '#sidebar-item-ide',
    title: ['Practice ', 'IDE'],
    subtitle: 'A fully functional Python coding environment running in your browser. Practice coding without any local setup.',
    icon: 'Terminal',
    color: '#f59e0b'
  },
  {
    id: 'sidebar-pg',
    target: '#sidebar-item-playground',
    title: ['GenAI ', 'Simulator'],
    subtitle: 'Design and prototype GenAI systems. Build RAG pipelines and agent architectures visually with drag-and-drop components.',
    icon: 'Boxes',
    color: '#8b5cf6'
  },
  {
    id: 'sidebar-sim',
    target: '#sidebar-item-simulator',
    title: ['System ', 'Simulator'],
    subtitle: 'Design distributed systems. Place load balancers, databases, and caches to visualize complex architecture flows.',
    icon: 'Layers',
    color: '#ef4444'
  },
  {
    id: 'sidebar-dsa',
    target: '#sidebar-item-dsa_animator',
    title: ['DSA ', 'Animator'],
    subtitle: 'Watch algorithms come to life with step-by-step visualizations of data structures and sorting techniques.',
    icon: 'Clapperboard',
    color: '#f97316'
  },
  {
    id: 'sidebar-algo',
    target: '#sidebar-item-algo_visualizer',
    title: ['Algo ', 'Visualizer'],
    subtitle: 'Write code and trace its execution visually. See variable states and call stacks update in real-time.',
    icon: 'Box',
    color: '#06b6d4'
  },
  {
    id: 'sidebar-k8s',
    target: '#sidebar-item-k8s_games',
    title: ['K8s ', 'Games'],
    subtitle: 'Learn Kubernetes through interactive challenges. Deploy pods and manage clusters in a gamified environment.',
    icon: 'Boxes',
    color: '#3b82f6'
  },
  {
    id: 'sidebar-git',
    target: '#sidebar-item-git_visualizer',
    title: ['Git ', 'Visualizer'],
    subtitle: 'Understand complex Git operations like rebasing and branching through interactive visual diagrams.',
    icon: 'GitCommit',
    color: '#10b981'
  },
  {
    id: 'sidebar-blog',
    target: '#sidebar-item-blog',
    title: ['Research ', 'Archive'],
    subtitle: 'Access a curated collection of AI articles and research papers, with AI-powered summaries for quick learning.',
    icon: 'BookMarked',
    color: '#8b5cf6'
  },
  {
    id: 'sidebar-links',
    target: '#sidebar-item-links',
    title: ['Curated ', 'Links'],
    subtitle: 'Manage your bookmarks and external resources. Organize high-quality learning materials in one place.',
    icon: 'Bookmark',
    color: '#f59e0b'
  },
  {
    id: 'sidebar-github',
    target: '#sidebar-item-github',
    title: ['GitHub ', 'Explorer'],
    subtitle: 'Browse repositories and analyze code directly within the academy. Integrated dashboard for your Git projects.',
    icon: 'GitBranch',
    color: '#6366f1'
  },
  {
    id: 'sidebar-notes',
    target: '#sidebar-item-tasks',
    title: ['Quick ', 'Notes'],
    subtitle: 'Your personal workspace for ideas and to-dos. Notes are persisted to your account and synced across sessions.',
    icon: 'CheckSquare',
    color: '#10b981'
  },
  {
    id: 'sidebar-res',
    target: '#sidebar-item-resources',
    title: ['Learning ', 'Resources'],
    subtitle: 'A massive library of courses, papers, and tools handpicked for every stage of your AI journey.',
    icon: 'BookOpen',
    color: '#3b82f6'
  },
  {
    id: 'sidebar-aiml',
    target: '#sidebar-item-aiml_companion',
    title: ['AIML ', 'Companion'],
    subtitle: 'Your AI-powered study partner. Ask questions, get explanations, and generate practice problems in real-time.',
    icon: 'GraduationCap',
    color: '#00ff88'
  },
  {
    id: 'sidebar-int',
    target: '#sidebar-item-interviewer',
    title: ['AI ', 'Interviewer'],
    subtitle: 'Practice technical interviews with an AI that asks DSA and System Design questions tailored to your progress.',
    icon: 'Users',
    color: '#ef4444'
  },
  {
    id: 'sidebar-comm',
    target: '#sidebar-item-community',
    title: ['Academy ', 'Community'],
    subtitle: 'Connect with other AI engineers. Join groups, share code, and collaborate on projects with fellow learners.',
    icon: 'Users',
    color: '#6366f1'
  },
  {
    id: 'sidebar-admin',
    target: '#sidebar-item-admin_management',
    title: ['Admin ', 'Panel'],
    subtitle: 'Manage curriculum data, users, and global application settings. Access is restricted to authorized personnel.',
    icon: 'Shield',
    color: '#ef4444'
  },
  {
    id: 'sidebar-algo-studio',
    target: '#sidebar-item-algo_studio',
    title: ['Algo ', 'Studio'],
    subtitle: 'The engineering lab for creating interactive coding challenges and algorithm visualizations.',
    icon: 'Cpu',
    color: '#06b6d4'
  },
  {
    id: 'sidebar-hub',
    target: '#sidebar-item-hub',
    title: ['Intelligence ', 'Hub'],
    subtitle: 'Your primary tactical gateway for navigating all high-level learning paths and simulators.',
    icon: 'BoxSelect',
    color: '#00ff88'
  },
  {
    id: 'sidebar-paths',
    target: '.sidebar-path-pills',
    title: ['Study ', 'Paths'],
    subtitle: 'Track your progress across specialized AI tracks. Each path contains organized modules with full completion tracking.',
    icon: 'Zap',
    color: '#00ff88'
  },
  {
    id: 'sidebar-settings',
    target: '#sidebar-settings-btn',
    title: ['System ', 'Config'],
    subtitle: 'Access global system settings, theme toggles, and account management tools.',
    icon: 'Settings',
    color: '#ffffff'
  },
  {
    id: 'sidebar-admin-toggle',
    target: '#sidebar-admin-toggle',
    title: ['Admin ', 'View'],
    subtitle: 'Toggle between Student and Administrator views to manage curriculum and system intelligence.',
    icon: 'Shield',
    color: '#ef4444'
  },
  {
    id: 'sidebar-edit-mode',
    target: '#sidebar-edit-mode',
    title: ['Edit ', 'Mode'],
    subtitle: 'Enable visual editing to modify roadmap nodes and module content directly from the UI.',
    icon: 'PenTool',
    color: '#f59e0b'
  },
  {
    id: 'sidebar-theme-toggle',
    target: '#sidebar-theme-toggle',
    title: ['Theme ', 'Toggle'],
    subtitle: 'Switch between Obsidian (Dark) and Glass (Light) modes for your preferred visual experience.',
    icon: 'Sparkles',
    color: '#3b82f6'
  },
  {
    id: 'sidebar-reset-data',
    target: '#sidebar-reset-data',
    title: ['Reset ', 'Data'],
    subtitle: 'Clear local caches and reset your learning progress if you want to start a path from scratch.',
    icon: 'Trash',
    color: '#ef4444'
  },
  {
    id: 'sidebar-gemini-key',
    target: '#sidebar-gemini-key',
    title: ['Gemini ', 'API Key'],
    subtitle: 'Configure your own Google AI Studio key for unlimited access to agentic features and simulators.',
    icon: 'Brain',
    color: '#00ff88'
  }
];
