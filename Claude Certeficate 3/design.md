<!-- Design System -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Lumina Academy - Course Library</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-container-highest": "#e4e2e4",
                        "on-surface-variant": "#454654",
                        "on-primary-fixed-variant": "#1d34ba",
                        "primary-fixed-dim": "#bbc3ff",
                        "primary": "#2036bd",
                        "surface-container-high": "#eae7ea",
                        "on-tertiary-container": "#dedbdc",
                        "inverse-surface": "#303032",
                        "secondary-fixed": "#e2e2e2",
                        "inverse-primary": "#bbc3ff",
                        "on-tertiary-fixed-variant": "#474647",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-primary-container": "#d7daff",
                        "on-tertiary-fixed": "#1b1b1c",
                        "surface-dim": "#dbd9dc",
                        "on-error-container": "#93000a",
                        "primary-fixed": "#dfe0ff",
                        "background": "#fbf9fb",
                        "on-primary": "#ffffff",
                        "surface-bright": "#fbf9fb",
                        "secondary-container": "#dfe0df",
                        "secondary-fixed-dim": "#c6c7c6",
                        "on-error": "#ffffff",
                        "on-surface": "#1b1b1d",
                        "tertiary-fixed-dim": "#c8c6c7",
                        "surface-container-lowest": "#ffffff",
                        "primary-container": "#3e52d5",
                        "error": "#ba1a1a",
                        "surface-container-low": "#f5f3f5",
                        "on-primary-fixed": "#000d60",
                        "on-tertiary": "#ffffff",
                        "tertiary-container": "#616061",
                        "on-secondary-container": "#616362",
                        "surface-container": "#efedef",
                        "tertiary": "#494849",
                        "outline-variant": "#c5c5d7",
                        "surface": "#fbf9fb",
                        "on-secondary": "#ffffff",
                        "on-background": "#1b1b1d",
                        "inverse-on-surface": "#f2f0f2",
                        "on-secondary-fixed-variant": "#454747",
                        "surface-tint": "#3b4fd2",
                        "secondary": "#5d5f5e",
                        "surface-variant": "#e4e2e4",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#e5e2e3",
                        "outline": "#757686"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "sm": "8px",
                        "xs": "4px",
                        "margin-desktop": "64px",
                        "lg": "24px",
                        "gutter": "24px",
                        "base": "8px",
                        "xl": "32px",
                        "md": "16px",
                        "xxl": "48px",
                        "margin-mobile": "16px"
                    },
                    fontFamily: {
                        "headline-lg": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "headline-xl": ["Inter"],
                        "label-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-sm": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    fontSize: {
                        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "600" }],
                        "body-sm": ["14px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "400" }],
                        "body-md": ["16px", { lineHeight: "26px", letterSpacing: "0", fontWeight: "400" }],
                        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "600" }],
                        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.04em", fontWeight: "700" }],
                        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
                        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
                        "body-lg": ["18px", { lineHeight: "30px", letterSpacing: "0", fontWeight: "400" }],
                        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
                        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        
        /* Subtle ambient shadow for premium feel */
        .ambient-shadow {
            box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
<!-- Shared Component: TopAppBar -->
<header class="top-0 sticky bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50">
<!-- Leading: Brand -->
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined icon-fill text-primary text-[28px]" data-icon="school">school</span>
<span class="font-headline-md text-headline-md font-bold tracking-tight text-primary">Lumina Academy</span>
</div>
<!-- Center: Global Search (Desktop only) -->
<div class="hidden md:flex flex-1 max-w-md mx-xl">
<div class="relative w-full group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
<input class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-outline/70" placeholder="Search courses, skills, or providers..." type="text"/>
</div>
</div>
<!-- Trailing: User Avatar & Desktop Nav Links -->
<div class="flex items-center gap-lg">
<nav class="hidden md:flex items-center gap-md">
<a class="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low px-3 py-2 rounded-lg transition-colors" href="#">Home</a>
<a class="font-label-md text-label-md text-primary font-semibold bg-primary/5 px-3 py-2 rounded-lg transition-colors" href="#">Library</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low px-3 py-2 rounded-lg transition-colors" href="#">Saved</a>
</nav>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="A professional headshot of a young adult looking forward with a neutral, calm expression, set against a bright, minimalist white background. High key lighting, sharp focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdHoEyj6N1MVFrIQV0YSASWhvC_vNEtZRvp3fcU_r5QFCzHAM-ITfuzaAIeKWKxt-BywbUlQnTwVYrgvXHT6T1N0HANR-NtAWKBF4Qtq9jDr0PDyz2ODPSM8sSdbeAq1Hwjw55dB1lP7VGR-UZOfrLnTeDZRnWX2iULR5MMF12aXL9ERffbGZna5Fpl4mfdE4eog7CxQiuqOCgCB_guic7wUmrcatWk6sYQdOZZf6be5MjXSa1jCOV4A"/>
</div>
</div>
</header>
<!-- Main Canvas -->
<main class="flex-1 w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
<!-- Page Header -->
<div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
<div class="flex flex-col gap-xs">
<h1 class="font-headline-xl text-headline-xl text-on-background">Course Library</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Master advanced topics with industry-recognized certifications. Curated for deep work and intellectual growth.</p>
</div>
<!-- Filters/Sort -->
<div class="flex items-center gap-sm">
<button class="flex items-center gap-xs px-4 py-2 bg-surface rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface font-label-md text-label-md">
<span class="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                </button>
<button class="flex items-center gap-xs px-4 py-2 bg-surface rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface font-label-md text-label-md">
<span class="material-symbols-outlined text-[18px]">sort</span>
                    Sort: Recent
                </button>
</div>
</div>
<!-- Course Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
<!-- Card 1 (In Progress) -->
<article class="bg-surface rounded-xl border border-outline-variant/30 p-lg ambient-shadow flex flex-col gap-md hover:-translate-y-1 transition-transform duration-300 group">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined icon-fill text-[24px]">psychology</span>
</div>
<span class="bg-secondary-container text-on-secondary-container rounded-full px-3 py-1 font-label-sm text-label-sm">Advanced</span>
</div>
<div class="flex flex-col gap-xs flex-1">
<p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Anthropic</p>
<h2 class="font-headline-sm text-headline-sm text-on-surface line-clamp-2">Advanced Prompt Engineering</h2>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[16px] text-outline">view_module</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">12 Modules</span>
<span class="text-outline-variant">•</span>
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">4h 30m</span>
</div>
</div>
<div class="flex flex-col gap-3 mt-auto pt-4 border-t border-outline-variant/20">
<div class="flex justify-between items-center font-label-sm text-label-sm">
<span class="text-on-surface-variant">Progress</span>
<span class="text-primary font-bold">65%</span>
</div>
<div class="w-full h-[6px] bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-primary-fixed to-primary w-[65%] rounded-full"></div>
</div>
<button class="w-full mt-2 bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:shadow-md hover:-translate-y-[1px] transition-all flex justify-center items-center gap-2">
                        Continue Learning
                        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</article>
<!-- Card 2 (Not Started) -->
<article class="bg-surface rounded-xl border border-outline-variant/30 p-lg ambient-shadow flex flex-col gap-md hover:-translate-y-1 transition-transform duration-300 group">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined icon-fill text-[24px]">gavel</span>
</div>
<span class="bg-surface-container-highest text-on-surface-variant rounded-full px-3 py-1 font-label-sm text-label-sm border border-outline-variant/30">Intermediate</span>
</div>
<div class="flex flex-col gap-xs flex-1">
<p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Anthropic</p>
<h2 class="font-headline-sm text-headline-sm text-on-surface line-clamp-2">Constitutional AI Principles</h2>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[16px] text-outline">view_module</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">8 Modules</span>
<span class="text-outline-variant">•</span>
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">2h 15m</span>
</div>
</div>
<div class="flex flex-col gap-3 mt-auto pt-4 border-t border-outline-variant/20">
<div class="flex justify-between items-center font-label-sm text-label-sm">
<span class="text-on-surface-variant">Not started</span>
</div>
<button class="w-full mt-2 bg-surface border border-outline-variant text-on-surface font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-container-low transition-all flex justify-center items-center gap-2">
                        Start Course
                    </button>
</div>
</article>
<!-- Card 3 (Completed) -->
<article class="bg-surface rounded-xl border border-outline-variant/30 p-lg ambient-shadow flex flex-col gap-md hover:-translate-y-1 transition-transform duration-300 group">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-[24px]">api</span>
</div>
<span class="bg-surface-container-highest text-on-surface-variant rounded-full px-3 py-1 font-label-sm text-label-sm border border-outline-variant/30">Expert</span>
</div>
<div class="flex flex-col gap-xs flex-1">
<p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Anthropic</p>
<h2 class="font-headline-sm text-headline-sm text-on-surface line-clamp-2">Claude API Integration Architecture</h2>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[16px] text-outline">view_module</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">15 Modules</span>
<span class="text-outline-variant">•</span>
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">6h 00m</span>
</div>
</div>
<div class="flex flex-col gap-3 mt-auto pt-4 border-t border-outline-variant/20">
<div class="flex items-center gap-2 font-label-sm text-label-sm text-primary">
<span class="material-symbols-outlined icon-fill text-[18px]">check_circle</span>
<span>Completed on Oct 24</span>
</div>
<button class="w-full mt-2 text-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-primary/5 transition-all flex justify-center items-center gap-2">
                        Review Material
                    </button>
</div>
</article>
</div>
</main>
</body></html>

<!-- Course Library (Desktop) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Claude Certified Associate – Foundations</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-highest": "#e4e2e4",
                        "on-surface-variant": "#454654",
                        "on-primary-fixed-variant": "#1d34ba",
                        "primary-fixed-dim": "#bbc3ff",
                        "primary": "#2036bd",
                        "surface-container-high": "#eae7ea",
                        "on-tertiary-container": "#dedbdc",
                        "inverse-surface": "#303032",
                        "secondary-fixed": "#e2e2e2",
                        "inverse-primary": "#bbc3ff",
                        "on-tertiary-fixed-variant": "#474647",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-primary-container": "#d7daff",
                        "on-tertiary-fixed": "#1b1b1c",
                        "surface-dim": "#dbd9dc",
                        "on-error-container": "#93000a",
                        "primary-fixed": "#dfe0ff",
                        "background": "#fbf9fb",
                        "on-primary": "#ffffff",
                        "surface-bright": "#fbf9fb",
                        "secondary-container": "#dfe0df",
                        "secondary-fixed-dim": "#c6c7c6",
                        "on-error": "#ffffff",
                        "on-surface": "#1b1b1d",
                        "tertiary-fixed-dim": "#c8c6c7",
                        "surface-container-lowest": "#ffffff",
                        "primary-container": "#3e52d5",
                        "error": "#ba1a1a",
                        "surface-container-low": "#f5f3f5",
                        "on-primary-fixed": "#000d60",
                        "on-tertiary": "#ffffff",
                        "tertiary-container": "#616061",
                        "on-secondary-container": "#616362",
                        "surface-container": "#efedef",
                        "tertiary": "#494849",
                        "outline-variant": "#c5c5d7",
                        "surface": "#fbf9fb",
                        "on-secondary": "#ffffff",
                        "on-background": "#1b1b1d",
                        "inverse-on-surface": "#f2f0f2",
                        "on-secondary-fixed-variant": "#454747",
                        "surface-tint": "#3b4fd2",
                        "secondary": "#5d5f5e",
                        "surface-variant": "#e4e2e4",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#e5e2e3",
                        "outline": "#757686"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "sm": "8px",
                        "xs": "4px",
                        "margin-desktop": "64px",
                        "lg": "24px",
                        "gutter": "24px",
                        "base": "8px",
                        "xl": "32px",
                        "md": "16px",
                        "xxl": "48px",
                        "margin-mobile": "16px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "headline-xl": ["Inter"],
                        "label-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-sm": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" }],
                        "body-sm": ["14px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }],
                        "body-md": ["16px", { "lineHeight": "26px", "letterSpacing": "0", "fontWeight": "400" }],
                        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.04em", "fontWeight": "700" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                        "body-lg": ["18px", { "lineHeight": "30px", "letterSpacing": "0", "fontWeight": "400" }],
                        "headline-sm": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .icon-filled {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .custom-shadow-soft {
            box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03);
        }
        .glass-panel {
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen font-body-md text-body-md antialiased flex flex-col">
<!-- TopAppBar Shared Component -->
<header class="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl docked full-width top-0 sticky border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim" data-icon="school">school</span>
<h1 class="font-headline-md text-headline-md font-bold tracking-tight text-primary dark:text-primary-fixed-dim">Lumina Academy</h1>
</div>
<nav class="hidden md:flex items-center gap-lg">
<a class="font-label-md text-label-md text-primary dark:text-primary-fixed-dim font-semibold hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-3 py-2 rounded-lg" href="#">Home</a>
<a class="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-3 py-2 rounded-lg" href="#">Library</a>
<a class="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-3 py-2 rounded-lg" href="#">Saved</a>
</nav>
<div class="flex items-center gap-md cursor-pointer hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors p-2 rounded-full">
<span class="material-symbols-outlined text-on-surface-variant dark:text-on-surface-variant" data-icon="account_circle">account_circle</span>
<span class="hidden md:block font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant">Profile</span>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-xxl flex flex-col gap-xl">
<!-- Hero Section -->
<section class="relative bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft overflow-hidden p-lg md:p-xl flex flex-col md:flex-row gap-xl items-center justify-between">
<div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 100% 0%, var(--tw-colors-primary-container) 0%, transparent 50%);"></div>
<div class="flex flex-col gap-md z-10 max-w-2xl">
<div class="inline-flex items-center gap-2 bg-primary-fixed/30 text-on-primary-fixed px-3 py-1 rounded-full w-fit">
<span class="material-symbols-outlined text-sm" data-icon="verified">verified</span>
<span class="font-label-sm text-label-sm">Professional Certification</span>
</div>
<h2 class="font-headline-xl text-headline-xl text-on-surface">Claude Certified Associate – Foundations</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant">
                    Master the core principles of interacting with Claude, understanding its capabilities, and integrating it safely and effectively into standard operational workflows.
                </p>
<div class="flex items-center gap-sm mt-sm">
<button class="bg-primary text-on-primary hover:bg-surface-tint transition-colors px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 custom-shadow-soft">
<span>Resume Course</span>
<span class="material-symbols-outlined" data-icon="play_arrow">play_arrow</span>
</button>
<button class="bg-transparent border border-outline-variant text-primary hover:bg-surface-container-low transition-colors px-6 py-3 rounded-lg font-label-md text-label-md">
                        Course Details
                    </button>
</div>
</div>
<div class="w-full md:w-64 bg-surface-container-low rounded-xl p-md border border-outline-variant/20 flex flex-col gap-sm z-10 custom-shadow-soft">
<div class="flex justify-between items-end">
<span class="font-label-md text-label-md text-on-surface-variant">Overall Progress</span>
<span class="font-headline-md text-headline-md text-primary font-bold">42%</span>
</div>
<div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style="width: 42%;"></div>
</div>
<div class="flex justify-between mt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">3 of 7 Modules</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Est. 4h remaining</span>
</div>
</div>
</section>
<!-- Main Action Cards -->
<section class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<a class="group bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-lg flex items-center justify-between hover:shadow-md hover:border-primary/30 transition-all duration-200" href="#">
<div class="flex items-center gap-lg">
<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-on-primary-fixed icon-filled" data-icon="menu_book">menu_book</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Course Material</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Access readings, videos, and exercises.</p>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-200" data-icon="arrow_forward">arrow_forward</span>
</a>
<a class="group bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-lg flex items-center justify-between hover:shadow-md hover:border-primary/30 transition-all duration-200" href="#">
<div class="flex items-center gap-lg">
<div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-on-tertiary-fixed icon-filled" data-icon="quiz">quiz</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Practice Quiz</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Test your knowledge before the exam.</p>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-200" data-icon="arrow_forward">arrow_forward</span>
</a>
</section>
<!-- Dashboard Multi-Column Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
<!-- Left Column: Modules & Activity -->
<div class="lg:col-span-8 flex flex-col gap-xl">
<!-- Completed Modules -->
<section>
<div class="flex justify-between items-center mb-md">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Completed Modules</h3>
<a class="font-label-sm text-label-sm text-primary hover:underline" href="#">View All</a>
</div>
<div class="bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft overflow-hidden">
<div class="flex items-center justify-between p-md border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-success-container dark:text-emerald-500 icon-filled" data-icon="check_circle">check_circle</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Module 1: Introduction to Claude</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Core concepts and capabilities.</span>
</div>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">45m</span>
</div>
<div class="flex items-center justify-between p-md border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-success-container dark:text-emerald-500 icon-filled" data-icon="check_circle">check_circle</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Module 2: Prompt Engineering Basics</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Structuring effective queries.</span>
</div>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">1h 15m</span>
</div>
<div class="flex items-center justify-between p-md hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-success-container dark:text-emerald-500 icon-filled" data-icon="check_circle">check_circle</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Module 3: Safety &amp; Ethics</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Constitutional AI overview.</span>
</div>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">50m</span>
</div>
</div>
</section>
<!-- Recent Activity -->
<section>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-md">Recent Activity</h3>
<div class="bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-lg">
<div class="relative border-l border-outline-variant/30 ml-3 flex flex-col gap-lg">
<div class="relative pl-6">
<div class="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Today, 10:30 AM</span>
<p class="font-body-sm text-body-sm text-on-surface">Completed practice exercise: <em>"Zero-shot vs Few-shot Prompting"</em></p>
</div>
<div class="relative pl-6">
<div class="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Yesterday</span>
<p class="font-body-sm text-body-sm text-on-surface">Finished reading <em>"Module 3: Safety &amp; Ethics"</em></p>
</div>
<div class="relative pl-6">
<div class="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Oct 24, 2023</span>
<p class="font-body-sm text-body-sm text-on-surface">Scored 90% on <em>"Module 2 Quiz"</em></p>
</div>
</div>
</div>
</section>
</div>
<!-- Right Column: Performance Stats -->
<div class="lg:col-span-4 flex flex-col gap-xl">
<section>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-md">Performance Stats</h3>
<div class="grid grid-cols-2 gap-sm">
<div class="col-span-2 bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-md flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="schedule">schedule</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant">Total Time Studied</span>
<span class="font-headline-md text-headline-md text-on-surface font-bold">12h 45m</span>
</div>
</div>
<div class="col-span-1 bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-md flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-primary mb-2" data-icon="analytics">analytics</span>
<div>
<span class="font-label-sm text-label-sm text-on-surface-variant block">Avg. Score</span>
<span class="font-headline-md text-headline-md text-on-surface font-bold">92%</span>
</div>
</div>
<div class="col-span-1 bg-surface rounded-xl border border-outline-variant/30 custom-shadow-soft p-md flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-error mb-2" data-icon="local_fire_department">local_fire_department</span>
<div>
<span class="font-label-sm text-label-sm text-on-surface-variant block">Current Streak</span>
<span class="font-headline-md text-headline-md text-on-surface font-bold">5 Days</span>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
<!-- BottomNavBar is suppressed on desktop as per rules, TopAppBar handles navigation -->
</body></html>

<!-- Course Home (Desktop) -->
<!DOCTYPE html>

<html class="h-full" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Module Reader - Lumina Academy</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-highest": "#e4e2e4",
                        "on-surface-variant": "#454654",
                        "on-primary-fixed-variant": "#1d34ba",
                        "primary-fixed-dim": "#bbc3ff",
                        "primary": "#2036bd",
                        "surface-container-high": "#eae7ea",
                        "on-tertiary-container": "#dedbdc",
                        "inverse-surface": "#303032",
                        "secondary-fixed": "#e2e2e2",
                        "inverse-primary": "#bbc3ff",
                        "on-tertiary-fixed-variant": "#474647",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-primary-container": "#d7daff",
                        "on-tertiary-fixed": "#1b1b1c",
                        "surface-dim": "#dbd9dc",
                        "on-error-container": "#93000a",
                        "primary-fixed": "#dfe0ff",
                        "background": "#fbf9fb",
                        "on-primary": "#ffffff",
                        "surface-bright": "#fbf9fb",
                        "secondary-container": "#dfe0df",
                        "secondary-fixed-dim": "#c6c7c6",
                        "on-error": "#ffffff",
                        "on-surface": "#1b1b1d",
                        "tertiary-fixed-dim": "#c8c6c7",
                        "surface-container-lowest": "#ffffff",
                        "primary-container": "#3e52d5",
                        "error": "#ba1a1a",
                        "surface-container-low": "#f5f3f5",
                        "on-primary-fixed": "#000d60",
                        "on-tertiary": "#ffffff",
                        "tertiary-container": "#616061",
                        "on-secondary-container": "#616362",
                        "surface-container": "#efedef",
                        "tertiary": "#494849",
                        "outline-variant": "#c5c5d7",
                        "surface": "#fbf9fb",
                        "on-secondary": "#ffffff",
                        "on-background": "#1b1b1d",
                        "inverse-on-surface": "#f2f0f2",
                        "on-secondary-fixed-variant": "#454747",
                        "surface-tint": "#3b4fd2",
                        "secondary": "#5d5f5e",
                        "surface-variant": "#e4e2e4",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#e5e2e3",
                        "outline": "#757686"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "sm": "8px",
                        "xs": "4px",
                        "margin-desktop": "64px",
                        "lg": "24px",
                        "gutter": "24px",
                        "base": "8px",
                        "xl": "32px",
                        "md": "16px",
                        "xxl": "48px",
                        "margin-mobile": "16px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "headline-xl": ["Inter"],
                        "label-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-sm": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" }],
                        "body-sm": ["14px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }],
                        "body-md": ["16px", { "lineHeight": "26px", "letterSpacing": "0", "fontWeight": "400" }],
                        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.04em", "fontWeight": "700" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                        "body-lg": ["18px", { "lineHeight": "30px", "letterSpacing": "0", "fontWeight": "400" }],
                        "headline-sm": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        /* Hide scrollbar for cleaner look but keep functionality */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md h-full flex flex-col antialiased">
<!-- TopAppBar -->
<header class="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl docked full-width top-0 sticky border-b border-outline-variant/30 shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-primary text-2xl" data-weight="fill" style="font-variation-settings: 'FILL' 1;">school</span>
<span class="font-headline-md text-headline-md font-bold tracking-tight text-primary">Lumina Academy</span>
</div>
<div class="hidden md:flex gap-lg items-center">
<nav class="flex gap-lg">
<a class="text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors px-3 py-2 rounded-md" href="#">Home</a>
<a class="text-primary font-semibold font-label-md text-label-md hover:bg-surface-container-low transition-colors px-3 py-2 rounded-md" href="#">Library</a>
<a class="text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors px-3 py-2 rounded-md" href="#">Saved</a>
</nav>
<div class="h-8 w-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30 flex items-center justify-center">
<span class="material-symbols-outlined text-on-surface-variant text-xl">person</span>
</div>
</div>
</header>
<!-- Main Layout -->
<main class="flex-1 flex overflow-hidden">
<!-- Left Sidebar: Module List -->
<aside class="w-[280px] bg-surface border-r border-outline-variant/30 flex flex-col hidden lg:flex flex-shrink-0">
<div class="p-lg border-b border-outline-variant/30">
<h2 class="font-headline-sm text-headline-sm text-on-surface mb-sm">Course Modules</h2>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" placeholder="Search modules..." type="text"/>
</div>
</div>
<div class="flex-1 overflow-y-auto no-scrollbar p-md">
<div class="space-y-sm">
<!-- Module Item Completed -->
<button class="w-full text-left p-sm rounded-lg hover:bg-surface-container-low transition-colors group flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-0.5 text-xl" data-weight="fill" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<div>
<div class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">1. Introduction to Algorithms</div>
<div class="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">15 mins • Completed</div>
</div>
</button>
<!-- Module Item Active -->
<button class="w-full text-left p-sm rounded-lg bg-primary-container/10 border border-primary/20 transition-colors group flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-0.5 text-xl">play_circle</span>
<div>
<div class="font-label-md text-label-md text-primary font-semibold">2. Data Structures in Depth</div>
<div class="font-body-sm text-body-sm text-primary/80 text-xs mt-1">45 mins • In Progress</div>
</div>
</button>
<!-- Module Item Locked -->
<button class="w-full text-left p-sm rounded-lg hover:bg-surface-container-low transition-colors group flex items-start gap-3 opacity-60 cursor-not-allowed">
<span class="material-symbols-outlined text-outline mt-0.5 text-xl">lock</span>
<div>
<div class="font-label-md text-label-md text-on-surface-variant">3. Advanced Graph Theory</div>
<div class="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">60 mins • Locked</div>
</div>
</button>
</div>
</div>
<!-- Overall Progress -->
<div class="p-lg border-t border-outline-variant/30 bg-surface-container-lowest">
<div class="flex justify-between items-center mb-sm">
<span class="font-label-md text-label-md text-on-surface">Course Progress</span>
<span class="font-label-md text-label-md text-primary">33%</span>
</div>
<div class="h-[6px] bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-primary-fixed-dim to-primary rounded-full w-1/3"></div>
</div>
</div>
</aside>
<!-- Center Content Area -->
<div class="flex-1 overflow-y-auto no-scrollbar bg-background relative flex flex-col items-center">
<div class="w-full max-w-4xl px-margin-mobile lg:px-xl py-xl pb-32">
<!-- Content Header -->
<div class="mb-xl">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-md">
<span class="material-symbols-outlined text-[16px]">menu_book</span>
                        Module 2
                    </div>
<h1 class="font-headline-xl text-headline-xl text-on-surface mb-md">Data Structures in Depth</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Understanding the core mechanisms of data storage, retrieval, and manipulation is essential for optimizing complex algorithms.</p>
</div>
<!-- Hero Image placeholder -->
<div class="w-full h-64 rounded-xl mb-xl overflow-hidden shadow-sm border border-outline-variant/20 relative">
<div class="bg-cover bg-center w-full h-full" data-alt="A clean, minimalist 3D rendering of abstract geometric shapes representing data structures, glowing with soft blue and deep indigo light in a stark white, high-key studio environment. The composition feels academic, pristine, and technologically advanced, echoing quiet authority." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgMsCsg-ee8t9mLJrQeh7ODW8cWswKLfz9K7oF75w50c2P-M9dCqsdK_Ub2_DR-S_-7OVOL1kkYOEL0cq-vnO2G8-i-K_QFul7B3DnJ8eg2QQOpMyds4N6ddYfjrLTm3_Ng2LiD1FZhBzlaLW5APKWuJNyzEkfDjqgLfdRdqf169nwD_76l5JuydOiAIgwdc5aTrq4XYGwJiy_3FcK4NHOYWdzP7YCMo0cagQ2ijiAQWLs1TOln4peSg')"></div>
</div>
<!-- Rich Text Content -->
<div class="prose prose-slate max-w-none mb-xl">
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-lg">The Role of Contiguous Memory</h2>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg">Arrays remain one of the most fundamental data structures, relying on contiguous memory blocks to provide O(1) access time. However, this rigid structure introduces penalties during insertion and deletion operations.</p>
<!-- Code Block -->
<div class="bg-inverse-surface rounded-xl p-lg my-lg border border-outline/20 font-mono text-sm shadow-md">
<div class="flex items-center justify-between mb-sm border-b border-outline/20 pb-sm">
<span class="text-inverse-on-surface opacity-70 font-label-sm text-label-sm">array_insertion.py</span>
<button class="text-inverse-on-surface hover:text-white transition-colors">
<span class="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
<pre class="text-inverse-on-surface overflow-x-auto"><code>def insert_element(arr, element, index):
    # If the array is full, we must allocate a new, larger block
    if len(arr) == capacity:
        arr = resize_array(arr)
        
    # Shift elements to the right to make space
    for i in range(len(arr) - 1, index - 1, -1):
        arr[i] = arr[i - 1]
        
    arr[index] = element
    return arr</code></pre>
</div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-md mt-xl">Dynamic Alternatives</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg">To circumvent the resizing penalties of static arrays, Linked Lists distribute nodes across non-contiguous memory, connected via pointers.</p>
</div>
<!-- Key Takeaway Box (Glassmorphism) -->
<div class="bg-primary/5 rounded-xl border border-primary/10 p-lg mb-xl relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
<div class="flex gap-md items-start">
<div class="p-2 bg-primary/10 rounded-lg text-primary">
<span class="material-symbols-outlined">lightbulb</span>
</div>
<div>
<h4 class="font-label-md text-label-md text-on-surface font-bold mb-xs">Key Takeaway</h4>
<p class="font-body-md text-body-md text-on-surface-variant">Choose Arrays when read operations dominate. Choose Linked Lists when write operations (specifically insertions/deletions at arbitrary positions) dominate.</p>
</div>
</div>
</div>
<!-- Check Your Knowledge (Expandable) -->
<div class="border border-outline-variant/30 rounded-xl bg-surface mb-xl overflow-hidden shadow-sm">
<button class="w-full px-lg py-md flex justify-between items-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors group" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.icon').classList.toggle('rotate-180')">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary text-xl">quiz</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Check Your Knowledge</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant icon transition-transform duration-200">expand_more</span>
</button>
<div class="hidden p-lg border-t border-outline-variant/30 bg-background">
<p class="font-body-md text-body-md text-on-surface-variant mb-md">What is the time complexity of accessing an element in a generic Array by index?</p>
<div class="space-y-sm">
<label class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer transition-colors">
<input class="text-primary focus:ring-primary/20" name="quiz1" type="radio"/>
<span class="font-body-md text-body-md text-on-surface">O(n)</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer transition-colors">
<input checked="" class="text-primary focus:ring-primary/20" name="quiz1" type="radio"/>
<span class="font-body-md text-body-md text-on-surface">O(1)</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer transition-colors">
<input class="text-primary focus:ring-primary/20" name="quiz1" type="radio"/>
<span class="font-body-md text-body-md text-on-surface">O(log n)</span>
</label>
</div>
<div class="mt-md flex justify-end">
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-transform hover:-translate-y-0.5 shadow-sm">Submit Answer</button>
</div>
</div>
</div>
</div>
<!-- Bottom Navigation Bar (Module Prev/Next) -->
<div class="absolute bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 px-margin-mobile lg:px-xl py-4 flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
<button class="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant font-label-md text-label-md">
<span class="material-symbols-outlined text-lg">arrow_back</span>
<span class="hidden sm:inline">Previous: Intro to Algorithms</span>
<span class="sm:hidden">Prev</span>
</button>
<div class="font-label-sm text-label-sm text-on-surface-variant hidden md:block">
                    Module 2 of 12
                </div>
<button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-transform hover:-translate-y-0.5 shadow-sm font-label-md text-label-md">
<span class="hidden sm:inline">Next: Advanced Graphs</span>
<span class="sm:hidden">Next</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
<!-- Right Sidebar: Table of Contents -->
<aside class="w-[240px] bg-surface-container-lowest border-l border-outline-variant/30 hidden xl:flex flex-col flex-shrink-0 p-lg overflow-y-auto no-scrollbar">
<h3 class="font-label-md text-label-md text-on-surface font-semibold mb-lg uppercase tracking-wider text-xs">On This Page</h3>
<nav class="space-y-4 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant">
<div class="relative pl-4 group">
<div class="absolute left-0 top-1.5 w-[8px] h-[8px] rounded-full bg-primary z-10 ring-4 ring-surface-container-lowest"></div>
<a class="font-label-md text-label-md text-primary font-medium hover:text-primary transition-colors block" href="#">Contiguous Memory</a>
</div>
<div class="relative pl-4 group">
<div class="absolute left-0 top-1.5 w-[8px] h-[8px] rounded-full bg-outline-variant z-10 group-hover:bg-primary/50 transition-colors"></div>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors block" href="#">Code Example</a>
</div>
<div class="relative pl-4 group">
<div class="absolute left-0 top-1.5 w-[8px] h-[8px] rounded-full bg-outline-variant z-10 group-hover:bg-primary/50 transition-colors"></div>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors block" href="#">Dynamic Alternatives</a>
</div>
<div class="relative pl-4 group">
<div class="absolute left-0 top-1.5 w-[8px] h-[8px] rounded-full bg-outline-variant z-10 group-hover:bg-primary/50 transition-colors"></div>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors block" href="#">Key Takeaway</a>
</div>
<div class="relative pl-4 group">
<div class="absolute left-0 top-1.5 w-[8px] h-[8px] rounded-full bg-outline-variant z-10 group-hover:bg-primary/50 transition-colors"></div>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors block" href="#">Knowledge Check</a>
</div>
</nav>
</aside>
</main>
</body></html>

<!-- Module Reader (Desktop) -->
<!DOCTYPE html>

<html class="h-full" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Lumina Academy - Quiz Player</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-container-highest": "#e4e2e4",
                      "on-surface-variant": "#454654",
                      "on-primary-fixed-variant": "#1d34ba",
                      "primary-fixed-dim": "#bbc3ff",
                      "primary": "#2036bd",
                      "surface-container-high": "#eae7ea",
                      "on-tertiary-container": "#dedbdc",
                      "inverse-surface": "#303032",
                      "secondary-fixed": "#e2e2e2",
                      "inverse-primary": "#bbc3ff",
                      "on-tertiary-fixed-variant": "#474647",
                      "on-secondary-fixed": "#1a1c1c",
                      "on-primary-container": "#d7daff",
                      "on-tertiary-fixed": "#1b1b1c",
                      "surface-dim": "#dbd9dc",
                      "on-error-container": "#93000a",
                      "primary-fixed": "#dfe0ff",
                      "background": "#fbf9fb",
                      "on-primary": "#ffffff",
                      "surface-bright": "#fbf9fb",
                      "secondary-container": "#dfe0df",
                      "secondary-fixed-dim": "#c6c7c6",
                      "on-error": "#ffffff",
                      "on-surface": "#1b1b1d",
                      "tertiary-fixed-dim": "#c8c6c7",
                      "surface-container-lowest": "#ffffff",
                      "primary-container": "#3e52d5",
                      "error": "#ba1a1a",
                      "surface-container-low": "#f5f3f5",
                      "on-primary-fixed": "#000d60",
                      "on-tertiary": "#ffffff",
                      "tertiary-container": "#616061",
                      "on-secondary-container": "#616362",
                      "surface-container": "#efedef",
                      "tertiary": "#494849",
                      "outline-variant": "#c5c5d7",
                      "surface": "#fbf9fb",
                      "on-secondary": "#ffffff",
                      "on-background": "#1b1b1d",
                      "inverse-on-surface": "#f2f0f2",
                      "on-secondary-fixed-variant": "#454747",
                      "surface-tint": "#3b4fd2",
                      "secondary": "#5d5f5e",
                      "surface-variant": "#e4e2e4",
                      "error-container": "#ffdad6",
                      "tertiary-fixed": "#e5e2e3",
                      "outline": "#757686"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "sm": "8px",
                      "xs": "4px",
                      "margin-desktop": "64px",
                      "lg": "24px",
                      "gutter": "24px",
                      "base": "8px",
                      "xl": "32px",
                      "md": "16px",
                      "xxl": "48px",
                      "margin-mobile": "16px"
              },
              "fontFamily": {
                      "headline-lg": [
                              "Inter"
                      ],
                      "body-sm": [
                              "Inter"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "headline-lg-mobile": [
                              "Inter"
                      ],
                      "headline-xl": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Inter"
                      ],
                      "label-md": [
                              "Inter"
                      ],
                      "body-lg": [
                              "Inter"
                      ],
                      "headline-sm": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "40px",
                                      "letterSpacing": "-0.03em",
                                      "fontWeight": "600"
                              }
                      ],
                      "body-sm": [
                              "14px",
                              {
                                      "lineHeight": "22px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "26px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "28px",
                              {
                                      "lineHeight": "36px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-xl": [
                              "40px",
                              {
                                      "lineHeight": "48px",
                                      "letterSpacing": "-0.04em",
                                      "fontWeight": "700"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.05em",
                                      "fontWeight": "600"
                              }
                      ],
                      "label-md": [
                              "14px",
                              {
                                      "lineHeight": "20px",
                                      "letterSpacing": "0.02em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "30px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-sm": [
                              "20px",
                              {
                                      "lineHeight": "28px",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
      </script>
<style>
        body {
            background-color: #FBFBFA;
        }
    </style>
</head>
<body class="h-full flex flex-col font-body-md text-on-surface antialiased bg-background">
<!-- TopAppBar -->
<header class="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl docked full-width top-0 sticky border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim" style="font-variation-settings: 'FILL' 1;">school</span>
<span class="font-headline-md text-headline-md font-bold tracking-tight text-primary dark:text-primary-fixed-dim">Lumina Academy</span>
</div>
<!-- Quiz Header Info -->
<div class="hidden md:flex flex-1 items-center justify-center gap-xl">
<div class="flex flex-col items-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Time Remaining</span>
<span class="font-headline-sm text-headline-sm font-semibold text-primary">45:12</span>
</div>
<div class="w-64">
<div class="flex justify-between items-center mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Progress</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">12 / 50</span>
</div>
<div class="h-[6px] w-full bg-[#F2F2F0] rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-primary-container to-primary rounded-full" style="width: 24%"></div>
</div>
</div>
<div class="flex flex-col items-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Score</span>
<span class="font-headline-sm text-headline-sm font-semibold text-primary">85%</span>
</div>
</div>
<div class="flex items-center gap-md">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/30">
<span class="material-symbols-outlined text-on-surface-variant text-sm">person</span>
</div>
</div>
</header>
<div class="flex flex-1 overflow-hidden max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-lg gap-gutter">
<!-- Side Navigation (Question Navigator) -->
<aside class="hidden md:flex w-[280px] flex-col gap-lg overflow-y-auto pr-sm custom-scrollbar">
<div class="bg-surface border border-outline-variant/30 rounded-xl p-lg shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_4px_12px_rgba(0,0,0,0.03)]">
<h3 class="font-headline-sm text-headline-sm font-semibold mb-md">Question Navigator</h3>
<div class="flex items-center gap-sm mb-lg">
<div class="flex items-center gap-xs">
<div class="w-3 h-3 rounded-full bg-primary"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Current</span>
</div>
<div class="flex items-center gap-xs">
<div class="w-3 h-3 rounded-full bg-surface-container-highest border border-outline-variant/30"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Unanswered</span>
</div>
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[14px] text-error" style="font-variation-settings: 'FILL' 1;">flag</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Flagged</span>
</div>
</div>
<div class="grid grid-cols-5 gap-sm">
<!-- Example grid of question numbers -->
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">1</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">2</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors relative">
                        3
                        <span class="material-symbols-outlined text-[12px] text-error absolute -top-1 -right-1" style="font-variation-settings: 'FILL' 1;">flag</span>
</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">4</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">5</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">6</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors relative">
                        7
                        <span class="material-symbols-outlined text-[12px] text-error absolute -top-1 -right-1" style="font-variation-settings: 'FILL' 1;">flag</span>
</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">8</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">9</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">10</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">11</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm">12</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors opacity-50">13</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors opacity-50">14</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors opacity-50">15</button>
</div>
</div>
<button class="w-full py-md px-lg bg-surface border border-outline-variant/30 rounded-xl font-label-md text-label-md font-semibold text-error hover:bg-error-container/20 transition-colors flex items-center justify-center gap-sm">
<span class="material-symbols-outlined text-[18px]">gavel</span>
                Submit Exam Early
            </button>
</aside>
<!-- Main Content Area (Question Card) -->
<main class="flex-1 flex flex-col overflow-y-auto pb-xl custom-scrollbar">
<!-- Mobile Header Info (Visible only on mobile) -->
<div class="md:hidden flex justify-between items-center bg-surface border border-outline-variant/30 rounded-xl p-md mb-lg shadow-sm">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Time</span>
<span class="font-headline-sm text-headline-sm-mobile font-semibold text-primary">45:12</span>
</div>
<div class="flex flex-col items-end">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Progress</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">12 / 50</span>
</div>
</div>
<div class="bg-surface border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_4px_12px_rgba(0,0,0,0.03)] mb-lg relative">
<div class="flex justify-between items-start mb-lg">
<div class="flex items-center gap-md">
<span class="inline-flex items-center justify-center bg-primary-container/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold">Question 12</span>
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Advanced Microeconomics</span>
</div>
<button class="flex items-center gap-xs text-on-surface-variant hover:text-error transition-colors group">
<span class="material-symbols-outlined text-[20px] group-hover:font-variation-settings-'FILL'-1">flag</span>
<span class="font-label-sm text-label-sm hidden md:inline">Flag for review</span>
</button>
</div>
<div class="font-headline-md text-headline-md font-semibold text-on-surface mb-xl leading-relaxed">
                    In a perfectly competitive market, if the government imposes a binding price ceiling, which of the following is the most likely immediate outcome regarding consumer and producer surplus?
                </div>
<!-- Multiple Choice Options -->
<div class="flex flex-col gap-md">
<!-- Option A (Selected, Incorrect state example) -->
<label class="flex items-start p-md rounded-lg border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors group">
<div class="flex items-center h-6 mt-1 mr-md">
<input class="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-opacity-10 focus:ring-2" name="q12" type="radio"/>
</div>
<div class="flex-1">
<span class="font-label-md text-label-md font-semibold text-on-surface-variant mr-sm">A.</span>
<span class="font-body-lg text-body-lg text-on-surface">Consumer surplus will definitively decrease, and producer surplus will definitively increase.</span>
</div>
</label>
<!-- Option B -->
<label class="flex items-start p-md rounded-lg border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors group">
<div class="flex items-center h-6 mt-1 mr-md">
<input class="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-opacity-10 focus:ring-2" name="q12" type="radio"/>
</div>
<div class="flex-1">
<span class="font-label-md text-label-md font-semibold text-on-surface-variant mr-sm">B.</span>
<span class="font-body-lg text-body-lg text-on-surface">Both consumer and producer surplus will definitively decrease, creating a deadweight loss.</span>
</div>
</label>
<!-- Option C (Selected, Correct state example - simulated active state) -->
<label class="flex items-start p-md rounded-lg border-2 border-primary bg-primary-fixed/20 cursor-pointer transition-colors relative overflow-hidden">
<div class="flex items-center h-6 mt-1 mr-md">
<input checked="" class="w-5 h-5 text-primary border-primary focus:ring-primary focus:ring-opacity-10 focus:ring-2" name="q12" type="radio"/>
</div>
<div class="flex-1">
<span class="font-label-md text-label-md font-bold text-primary mr-sm">C.</span>
<span class="font-body-lg text-body-lg text-on-surface font-medium">Producer surplus will definitively decrease, but the effect on consumer surplus is ambiguous depending on the elasticity of demand and supply.</span>
</div>
<span class="material-symbols-outlined text-primary absolute top-md right-md" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</label>
<!-- Option D -->
<label class="flex items-start p-md rounded-lg border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors group">
<div class="flex items-center h-6 mt-1 mr-md">
<input class="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-opacity-10 focus:ring-2" name="q12" type="radio"/>
</div>
<div class="flex-1">
<span class="font-label-md text-label-md font-semibold text-on-surface-variant mr-sm">D.</span>
<span class="font-body-lg text-body-lg text-on-surface">Producer surplus will definitively increase, but the effect on consumer surplus is ambiguous.</span>
</div>
</label>
</div>
</div>
<!-- Explanation Block (Revealed after answering) -->
<div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm">
<div class="flex items-center gap-sm mb-md">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
<h4 class="font-headline-sm text-headline-sm font-semibold text-on-surface">Explanation</h4>
</div>
<div class="font-body-md text-body-md text-on-surface-variant space-y-md">
<p>
                        A binding price ceiling is set below the equilibrium price. This naturally lowers the price producers receive, thus definitively decreasing <strong>Producer Surplus</strong>.
                    </p>
<p>
                        However, the effect on <strong>Consumer Surplus</strong> is ambiguous. While consumers who can still purchase the good pay a lower price (increasing their surplus), the quantity supplied falls, leading to a shortage. Some consumers who would have purchased the good at the equilibrium price can no longer do so, which decreases surplus. The net effect depends on the relative elasticities of the supply and demand curves.
                    </p>
</div>
</div>
<!-- Navigation Controls -->
<div class="flex justify-between items-center mt-xl pt-lg border-t border-outline-variant/30">
<button class="px-xl py-sm bg-surface border border-outline-variant rounded-lg font-label-md text-label-md font-medium text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-sm">
<span class="material-symbols-outlined text-[18px]">arrow_back</span>
                    Previous
                </button>
<button class="px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md font-medium hover:translate-y-[-2px] hover:shadow-md transition-all flex items-center gap-sm">
                    Next Question
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</main>
</div>
<!-- BottomNavBar (Mobile Only - simplified for exam context if needed, though often suppressed in strict exam modes. Keeping as requested per standard shared components if not purely transactional, but exam implies focused task. Suppressing per rules: "Linear/Transactional or Task-Focused... suppress the navigation to prioritize the content canvas.") -->
<!-- SUPPRESSED BottomNavBar as this is a focused Quiz/Exam task flow -->
<style>
        /* Custom Scrollbar for inner scrollable areas */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: var(--tw-colors-outline-variant);
            border-radius: 20px;
            opacity: 0.5;
        }
    </style>
</body></html>


you have full access to modify it accourding to you need this design is just for reference 