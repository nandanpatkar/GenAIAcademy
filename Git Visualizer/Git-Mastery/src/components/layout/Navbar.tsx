import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {
    GitBranch,
    Terminal,
    BookCopy,
    Home,
    Code,
    Languages,
    Menu,
    X,
    Github,
    Star,
    Download,
    HelpCircle,
    Settings,
    Check,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { ClientOnly } from "~/components/ClientOnly";
import { BadgeDisplay } from "~/components/BadgeDisplay";
import { DebugModal } from "~/components/DebugModal";
import { env } from "~/env";

interface NavbarProps {
    showLevelInfo?: boolean;
}

export function Navbar({ showLevelInfo = false }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const {
        currentStage,
        currentLevel,
        progressManager,
        debugGiveMoney,
        debugUnlockAllLevels,
        debugLockAllLevels,
        debugCompleteCurrentLevel,
    } = useGameContext();
    const { language, setLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [repoStars, setRepoStars] = useState<number | null>(null);
    const [debugModalOpen, setDebugModalOpen] = useState(false);
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

    // Determine which page we're on
    const normalizedPathname = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const isHomePage = normalizedPathname === "/";
    const isPlaygroundPage = normalizedPathname === "/playground";
    const isInstallationPage = normalizedPathname === "/installation";
    const isFaqPage = normalizedPathname === "/faq";
    const useCompactResponsiveLayout = showLevelInfo || isPlaygroundPage || isInstallationPage || isFaqPage;
    const desktopNavClass = useCompactResponsiveLayout ? "xl:flex xl:flex-nowrap" : "lg:flex lg:flex-nowrap";
    const mobileNavClass = useCompactResponsiveLayout ? "xl:hidden" : "lg:hidden";
    const badgeDesktopClass = useCompactResponsiveLayout ? "xl:block" : "lg:block";
    const pageLabelClass = useCompactResponsiveLayout ? "xl:block" : "lg:block";

    // Language options
    const languages = [
        { code: "en", name: "English", nativeName: "English" },
        { code: "de", name: "German", nativeName: "Deutsch" },
        { code: "fa", name: "Persian", nativeName: "فارسی" },
        { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    ];

    const handleLanguageSelect = (langCode: "en" | "de" | "fa" | "hi") => {
        setLanguage(langCode);
        setLanguageDialogOpen(false);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Navigate to learning - use localStorage for current level
    const navigateToLearning = () => {
        const progress = progressManager.getProgress();
        const stageId = progress.currentStage;
        const levelId = progress.currentLevel;

        // Navigate to the current level from localStorage
        router.push(`/${stageId.toLowerCase()}?stage=${stageId}&level=${levelId}`);
    };

    // Debug functions
    const handleDebugNavigateToLevel = (stage: string, level: number) => {
        // Convert stage names to lowercase for URL routing
        const stageMap: { [key: string]: string } = {
            Intro: "intro",
            Files: "files",
            Branches: "branches",
            Workflow: "workflow",
            TeamWork: "teamwork",
            Merge: "merge",
            Reset: "reset",
            Stash: "stash",
            Advanced: "advanced",
            Archaeology: "archaeology",
            Mastery: "mastery",
        };

        const urlStage = stageMap[stage] || stage.toLowerCase();
        router.push(`/${urlStage}?stage=${stage}&level=${level}`);
    };

    const handleDebugGiveMoney = (amount: number) => {
        debugGiveMoney(amount);
    };

    const handleDebugUnlockAllLevels = () => {
        debugUnlockAllLevels();
    };

    const handleDebugLockAllLevels = () => {
        debugLockAllLevels();
    };

    const handleDebugResetProgress = () => {
        progressManager.resetProgress();
        console.log("Debug: Reset all progress");
    };

    const handleDebugCompleteCurrentLevel = () => {
        debugCompleteCurrentLevel();
    };

    // Fetch GitHub star count for repository chip
    useEffect(() => {
        const controller = new AbortController();

        const fetchStars = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/MikaStiebitz/Git-Mastery", {
                    signal: controller.signal,
                    headers: {
                        Accept: "application/vnd.github+json",
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data: { stargazers_count?: number } = await response.json();

                if (typeof data.stargazers_count === "number") {
                    setRepoStars(data.stargazers_count);
                }
            } catch {
                // Keep chip usable even if API call fails/rate-limits.
            }
        };

        void fetchStars();

        return () => {
            controller.abort();
        };
    }, []);

    const formattedRepoStars =
        repoStars === null
            ? "--"
            : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(repoStars);

    return (
        <header className="border-b border-white/10 bg-[#0a0a0c]">
            <nav className="container mx-auto flex min-h-16 items-center px-4">
                <div className="flex w-full items-center justify-between gap-2">
                    {/* Logo and brand */}
                    <Link href="/" className="flex shrink-0 items-center space-x-2">
                        <GitBranch className="h-6 w-6 text-[#00ff88]" />
                        <span className="text-xl font-bold text-white">GitMastery</span>
                    </Link>

                    {/* Current level info - responsive display */}
                    {showLevelInfo && (
                        <ClientOnly>
                            <div className="ml-4 hidden text-zinc-300 2xl:block">
                                Level {currentLevel} - {currentStage}
                            </div>
                            <div className="ml-4 hidden text-zinc-300 xl:block 2xl:hidden">
                                L{currentLevel} - {currentStage}
                            </div>
                        </ClientOnly>
                    )}

                    {/* Show playground text on relevant pages */}
                    {isPlaygroundPage && (
                        <span className={`ml-4 hidden text-zinc-300 ${pageLabelClass}`}>{t("nav.playground")}</span>
                    )}

                    {/* Show installation text on relevant pages */}
                    {isInstallationPage && (
                        <span className={`ml-4 hidden text-zinc-300 ${pageLabelClass}`}>{t("nav.installation")}</span>
                    )}

                    {/* Show FAQ text on relevant pages */}
                    {isFaqPage && (
                        <span className={`ml-4 hidden text-zinc-300 ${pageLabelClass}`}>{t("nav.faq")}</span>
                    )}

                    {/* Badge display - only show on larger screens to avoid overcrowding */}
                    <div className={`ml-4 hidden ${badgeDesktopClass}`}>
                        <BadgeDisplay />
                    </div>

                    {/* Desktop navigation */}
                    <div className={`ml-auto hidden items-center gap-3 ${desktopNavClass}`}>
                        {/* GitHub chip removed */}


                        {!isHomePage && (
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                    <Home className="mr-2 h-4 w-4" />
                                    {t("nav.home")}
                                </Button>
                            </Link>
                        )}

                        {/* FAQ link */}
                        {!isFaqPage && (
                            <Link href="/faq">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    {t("nav.faq")}
                                </Button>
                            </Link>
                        )}

                        {!isInstallationPage && (
                            <Link href="/installation">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                    <Download className="mr-2 h-4 w-4" />
                                    {t("nav.installation")}
                                </Button>
                            </Link>
                        )}

                        {!isPlaygroundPage && (
                            <Link href="/playground">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                    <BookCopy className="mr-2 h-4 w-4" />
                                    {t("nav.playground")}
                                </Button>
                            </Link>
                        )}

                        <Button
                            onClick={navigateToLearning}
                            className="shrink-0 bg-[#00cc66] text-white hover:bg-emerald-700">
                            <Code className="mr-2 h-4 w-4" />
                            {t("nav.startLearning")}
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className={`ml-auto flex items-center space-x-2 ${mobileNavClass}`}>
                        {/* Compact GitHub chip removed */}
                        <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="text-zinc-300">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile navigation menu */}
            {mobileMenuOpen && (
                <div className={`border-t border-white/10 bg-[#0a0a0c] ${mobileNavClass}`}>
                    <div className="flex flex-col space-y-2 p-4">
                        {/* Current level info for mobile */}
                        {showLevelInfo && (
                            <ClientOnly>
                                <div className="mb-2 text-zinc-300">
                                    Level {currentLevel} - {currentStage}
                                </div>
                            </ClientOnly>
                        )}

                        {/* Badge display for mobile */}
                        <div className={`mb-4 flex justify-center ${mobileNavClass}`}>
                            <BadgeDisplay className="justify-center" />
                        </div>

                        {/* GitHub chip for mobile menu removed */}


                        {/* Navigation links */}
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                                variant="ghost"
                                className="flex w-full items-center justify-start text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                <Home className="mr-2 h-4 w-4" />
                                {t("nav.home")}
                            </Button>
                        </Link>

                        {/* FAQ link for mobile */}
                        <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                                variant="ghost"
                                className="flex w-full items-center justify-start text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                {t("nav.faq")}
                            </Button>
                        </Link>

                        <Link href="/installation" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                                variant="ghost"
                                className="flex w-full items-center justify-start text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                <Download className="mr-2 h-4 w-4" />
                                {t("nav.installation")}
                            </Button>
                        </Link>

                        <Link href="/level" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                                variant="ghost"
                                className="flex w-full items-center justify-start text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                <Terminal className="mr-2 h-4 w-4" />
                                {t("nav.terminal")}
                            </Button>
                        </Link>

                        <Link href="/playground" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                                variant="ghost"
                                className="flex w-full items-center justify-start text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100">
                                <BookCopy className="mr-2 h-4 w-4" />
                                {t("nav.playground")}
                            </Button>
                        </Link>

                        {isHomePage && (
                            <Button
                                onClick={() => {
                                    navigateToLearning();
                                    setMobileMenuOpen(false);
                                }}
                                className="mt-2 w-full bg-[#00cc66] text-white hover:bg-emerald-700">
                                <Code className="mr-2 h-4 w-4" />
                                {t("nav.startLearning")}
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Debug Modal - only show in debug mode */}
            {env.NEXT_PUBLIC_DEBUG_MODE && (
                <>
                    {/* Debug Button - fixed position */}
                    <Button
                        onClick={() => setDebugModalOpen(true)}
                        className="fixed right-4 bottom-4 z-50 border border-[#00ff88] bg-[#00cc66] text-white shadow-lg hover:bg-emerald-700"
                        size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* Debug Modal */}
                    <DebugModal
                        isOpen={debugModalOpen}
                        onClose={() => setDebugModalOpen(false)}
                        onNavigateToLevel={handleDebugNavigateToLevel}
                        onGiveMoney={handleDebugGiveMoney}
                        onUnlockAllLevels={handleDebugUnlockAllLevels}
                        onLockAllLevels={handleDebugLockAllLevels}
                        onResetProgress={handleDebugResetProgress}
                        onCompleteCurrentLevel={handleDebugCompleteCurrentLevel}
                        currentStage={currentStage}
                        currentLevel={currentLevel}
                        availableStages={[
                            "Intro",
                            "Files",
                            "Branches",
                            "Workflow",
                            "TeamWork",
                            "Merge",
                            "Reset",
                            "Stash",
                            "Advanced",
                            "Archaeology",
                            "Mastery",
                        ]}
                        availableLevels={{
                            Intro: [1, 2, 3, 4, 5],
                            Files: [1, 2, 3, 4, 5],
                            Branches: [1, 2, 3, 4, 5],
                            Workflow: [1, 2, 3, 4, 5],
                            TeamWork: [1, 2, 3, 4, 5],
                            Merge: [1, 2, 3, 4, 5],
                            Reset: [1, 2, 3, 4, 5],
                            Stash: [1, 2, 3, 4, 5],
                            Advanced: [1, 2, 3, 4, 5],
                            Archaeology: [1, 2, 3, 4, 5],
                            Mastery: [1, 2, 3, 4, 5],
                        }}
                    />
                </>
            )}


        </header>
    );
}
