"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
    GitBranch,
    GitCommit,
    GitMerge,
    Rocket,
    CheckCircle2,
    LockIcon,
    Code,
    BookOpen,
    Sparkles,
    ChevronRight,
    Activity,
    Award,
    Star,
    BookMarked,
    ArrowRight,
    Github,
    Settings,
    ShoppingCart,
    Gamepad2,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { useLanguage } from "~/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { DifficultySelector } from "~/components/DifficultySelector";
import { Shop } from "~/components/Shop";
import { Minigames } from "~/components/Minigames";
import { getAvailableStagesForDifficulty } from "~/config/difficulties";
import type { DifficultyLevel } from "~/types";

// Animation helper component
const AnimatedElement = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className} ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

export default function Home() {
    const { levelManager, progressManager, currentDifficulty, setCurrentDifficulty } = useGameContext();
    const { t } = useLanguage();
    const router = useRouter();
    const [progress, setProgress] = useState(progressManager.getProgress());
    const [showDifficultySelector, setShowDifficultySelector] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showMinigames, setShowMinigames] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle mounting to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update progress when it changes
    useEffect(() => {
        if (!isMounted) return;

        const updateProgress = () => {
            setProgress(progressManager.getProgress());
        };

        // Initial update
        updateProgress();

        // Update on storage events (in case another tab changes the progress)
        window.addEventListener("storage", updateProgress);

        return () => {
            window.removeEventListener("storage", updateProgress);
        };
    }, [progressManager, isMounted]);

    // Check for first visit and show difficulty selector
    useEffect(() => {
        if (!isMounted) return;

        const hasVisitedBefore = localStorage.getItem("gitgud-has-visited");
        const hasSelectedDifficulty = localStorage.getItem("gitgud-difficulty");

        // Show difficulty selector if it's the first visit OR no difficulty has been selected
        if (!hasVisitedBefore || !hasSelectedDifficulty) {
            setIsFirstVisit(true);
            setShowDifficultySelector(true);
            localStorage.setItem("gitgud-has-visited", "true");
        }
    }, [isMounted]);

    // Get all stages with translated content - filtered by difficulty
    const allStages = levelManager.getAllStages(t);
    const availableStageIds = getAvailableStagesForDifficulty(currentDifficulty);
    const stages = Object.fromEntries(
        Object.entries(allStages).filter(([stageId]) => availableStageIds.includes(stageId)),
    );

    // Navigation function to use correct URL structure for [level] dynamic route
    const navigateToLevel = (stageId: string, levelId: number) => {
        // Navigate using the correct URL structure for [level] dynamic route with proper parameters
        // Don't set localStorage here - let the [level] page handle it via URL parameters
        router.push(`/${stageId.toLowerCase()}?stage=${stageId}&level=${levelId}`);
    };

    // Get stage icon component with animation
    const getStageIcon = (stageId: string) => {
        switch (stageId) {
            case "Intro":
                return (
                    <Rocket className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            case "Files":
                return (
                    <GitCommit className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            case "Branches":
                return (
                    <GitBranch className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            case "Merge":
                return (
                    <GitMerge className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            case "Rebase":
                return (
                    <Activity className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            case "Remote":
                return (
                    <Github className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
            default:
                return (
                    <GitCommit className="h-5 w-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                );
        }
    };

    // Check if a stage is unlocked
    const isStageUnlocked = (stageId: string) => {
        if (stageId === "Intro") return true;

        const stageOrder = Object.keys(stages);
        const stageIndex = stageOrder.indexOf(stageId);

        if (stageIndex <= 0) return true;

        const previousStage = stageOrder[stageIndex - 1];
        if (!previousStage) return true;

        // Stage is unlocked if at least one level of the previous stage is completed
        return (progress.completedLevels[previousStage]?.length ?? 0) > 0;
    };

    // Check if a level is unlocked
    const isLevelUnlocked = (stageId: string, levelId: number) => {
        if (!isStageUnlocked(stageId)) return false;

        if (levelId === 1) return true;

        // Level is unlocked if the previous level is completed
        return progressManager.isLevelCompleted(stageId, levelId - 1);
    };

    // Check if a level is completed
    const isLevelCompleted = (stageId: string, levelId: number) => {
        return progressManager.isLevelCompleted(stageId, levelId);
    };

    // Check if current difficulty is completed
    const isDifficultyCompleted = () => {
        const availableStageIds = getAvailableStagesForDifficulty(currentDifficulty);
        return availableStageIds.every(stageId => {
            const stageData = stages[stageId];
            if (!stageData) return false;
            const totalLevels = Object.keys(stageData.levels).length;
            const completedLevels = progress.completedLevels[stageId]?.length ?? 0;
            return completedLevels === totalLevels;
        });
    };

    // Get next difficulty level
    const getNextDifficulty = (): DifficultyLevel | null => {
        const difficultyOrder: DifficultyLevel[] = ["beginner", "advanced", "pro"];
        const currentIndex = difficultyOrder.indexOf(currentDifficulty);
        if (currentIndex >= 0 && currentIndex < difficultyOrder.length - 1) {
            return difficultyOrder[currentIndex + 1]!;
        }
        return null;
    };

    // Calculate progress percentage
    const calculateProgress = (stageId: string) => {
        const stageLevels = Object.keys(stages[stageId]?.levels ?? {}).length;
        const completedLevels = progress.completedLevels[stageId]?.length ?? 0;

        return stageLevels > 0 ? (completedLevels / stageLevels) * 100 : 0;
    };

    //Changes learning path heading based on difficulty (and language)
    function learningPathHeading(): string {
        const headingKey = `home.learningPath.${currentDifficulty}`;
        const translatedHeading = t(headingKey);
        return translatedHeading === headingKey ? t("home.learningPath.default") : translatedHeading;
    }

    return (
        <PageLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0a0a0c] to-[#111114] text-zinc-100">
                {/* Hero Section with animation */}
                <section className="container relative mx-auto overflow-hidden px-4 py-12 text-center sm:py-20">
                    {/* Background decoration */}
                    <div className="absolute left-0 top-0 -z-10 h-64 w-64 rotate-45 rounded-full bg-[#00cc66]/10 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rotate-45 rounded-full bg-indigo-600/10 blur-3xl"></div>

                    <AnimatedElement>
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900/30 p-4">
                                <GitBranch className="h-10 w-10 text-[#00ff88]" />
                            </div>
                        </div>
                    </AnimatedElement>

                    <AnimatedElement delay={200}>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-6xl">
                            {t("home.title")}
                            <span className="relative ml-2 bg-gradient-to-r from-emerald-400 to-pink-600 bg-clip-text text-transparent">
                                {t("home.title2")}
                                <span className="absolute -right-6 -top-6">
                                    <Sparkles className="animate-pulse h-6 w-6 text-[#00ff88]" />
                                </span>
                            </span>
                        </h1>
                    </AnimatedElement>

                    <AnimatedElement delay={400}>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-200 sm:mt-6 sm:text-lg">
                            {t("home.subtitle")}
                        </p>
                    </AnimatedElement>

                    <AnimatedElement delay={600}>
                        <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-10 sm:gap-4">
                            {/* First row - Main action buttons */}
                            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                                <Link href="/intro" className="group w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 sm:w-auto">
                                        <span className="relative z-10 flex items-center">
                                            <Code className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                                            {t("home.startLearning")}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute bottom-0 left-0 h-1 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                                    </Button>
                                </Link>

                                <Link href="/playground" className="group w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full border-emerald-700 text-zinc-300 transition-all duration-300 hover:border-emerald-600 hover:bg-zinc-900/50 hover:text-zinc-200 sm:w-auto">
                                        <BookOpen className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                                        {t("home.cheatSheet")}
                                    </Button>
                                </Link>
                            </div>

                            {/* Second row - Gamification buttons */}
                            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-3">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowDifficultySelector(true)}
                                    className="w-full border-emerald-700 text-zinc-300 transition-all duration-300 hover:border-emerald-600 hover:bg-zinc-900/50 hover:text-zinc-200 sm:w-auto">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Difficulty
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowShop(true)}
                                    className="w-full border-yellow-700 text-yellow-300 transition-all duration-300 hover:border-yellow-600 hover:bg-yellow-900/50 hover:text-yellow-200 sm:w-auto">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Shop
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowMinigames(true)}
                                    className="w-full border-green-700 text-green-300 transition-all duration-300 hover:border-green-600 hover:bg-green-900/50 hover:text-green-200 sm:w-auto">
                                    <Gamepad2 className="mr-2 h-4 w-4" />
                                    Mini Games
                                </Button>
                            </div>
                        </div>
                    </AnimatedElement>
                </section>

                {/* Difficulty Completion Celebration */}
                {isMounted && isDifficultyCompleted() && getNextDifficulty() && (
                    <AnimatedElement>
                        <section className="container mx-auto px-4 py-6">
                            <div className="mx-auto max-w-2xl rounded-lg border border-green-700/50 bg-gradient-to-r from-green-900/30 to-emerald-900/20 p-6 text-center">
                                <div className="mb-4 flex justify-center">
                                    <Award className="h-12 w-12 text-yellow-400" />
                                </div>
                                <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                                    🎉 Difficulty Mastered!
                                </h2>
                                <p className="mb-6 text-green-200">
                                    Congratulations! You've completed all levels in {currentDifficulty} difficulty.
                                    Ready for the next challenge?
                                </p>
                                <Button
                                    onClick={() => {
                                        const nextDiff = getNextDifficulty();
                                        if (nextDiff) {
                                            setCurrentDifficulty(nextDiff);
                                        }
                                    }}
                                    size="lg"
                                    className="group bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800">
                                    <ChevronRight className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    Advance to {getNextDifficulty()} Difficulty
                                </Button>
                            </div>
                        </section>
                    </AnimatedElement>
                )}

                {/* Animated Stats Section */}
                <AnimatedElement>
                    <section className="container mx-auto px-4 py-6">
                        <ClientOnly>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                                <div className="rounded-lg border border-emerald-800/30 bg-white/10 p-3 text-center sm:p-4">
                                    <h3 className="text-xs text-[#00ff88] sm:text-sm">{t("progress.points")}</h3>
                                    <p className="text-xl font-bold text-white sm:text-2xl">{progress.score}</p>
                                </div>
                                <div className="rounded-lg border border-emerald-800/30 bg-white/10 p-3 text-center sm:p-4">
                                    <h3 className="text-xs text-[#00ff88] sm:text-sm">{t("home.completed")}</h3>
                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        {Object.values(progress.completedLevels).flat().length}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-emerald-800/30 bg-white/10 p-3 text-center sm:p-4">
                                    <h3 className="text-xs text-[#00ff88] sm:text-sm">{t("level.level")}</h3>
                                    <p className="text-xl font-bold text-white sm:text-2xl">{progress.currentLevel}</p>
                                </div>
                                <div className="rounded-lg border border-emerald-800/30 bg-white/10 p-3 text-center sm:p-4">
                                    <h3 className="text-xs text-[#00ff88] sm:text-sm">{t("level.branch")}</h3>
                                    <p className="text-xl font-bold text-white sm:text-2xl">{progress.currentStage}</p>
                                </div>
                            </div>
                        </ClientOnly>
                    </section>
                </AnimatedElement>

                {/* Progress Path - Enhanced with animations */}
                <section className="container mx-auto px-4 py-8 sm:py-16">
                    <AnimatedElement>
                        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:mb-12 sm:text-3xl">
                            <span className="relative">
                                {learningPathHeading()}
                                <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#00ff88] to-emerald-300"></span>
                            </span>
                        </h2>
                    </AnimatedElement>

                    <ClientOnly>
                        <div className="relative">
                            {/* Central Line - Enhanced with animation */}
                            <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 bg-gradient-to-b from-emerald-900/50 to-[#00cc66]/50 lg:block">
                                <div className="animate-pulse absolute h-full w-full bg-gradient-to-b from-[#00ff88]/20 to-emerald-800/20"></div>
                            </div>

                            <div className="space-y-10 sm:space-y-16 lg:space-y-24">
                                {Object.entries(stages).map(([stageId, stageData], index) => {
                                    const isUnlocked = isStageUnlocked(stageId);
                                    const totalLevels = Object.keys(stageData.levels).length;
                                    const completedLevels = progress.completedLevels[stageId]?.length ?? 0;
                                    const progressPercent = calculateProgress(stageId);

                                    return (
                                        <AnimatedElement key={stageId} delay={index * 150}>
                                            <div className="relative">
                                                {/* Stage Node - Enhanced with glow and animation */}
                                                <div
                                                    className={`group hidden h-12 w-12 transform items-center justify-center rounded-full lg:absolute lg:left-1/2 lg:top-0 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 ${
                                                        isUnlocked
                                                            ? "bg-gradient-to-br from-[#00ff88] to-emerald-700"
                                                            : "bg-gray-700"
                                                    } ${stageId === progress.currentStage ? "ring-4 ring-emerald-400/50" : ""}`}>
                                                    {isUnlocked && (
                                                        <span className="animate-ping absolute -inset-2 hidden rounded-full bg-emerald-400/20 lg:inline-block"></span>
                                                    )}
                                                    {getStageIcon(stageId)}
                                                </div>

                                                <div
                                                    className={`group relative rounded-lg border p-6 transition-all duration-300 hover:shadow-lg ${
                                                        isUnlocked
                                                            ? "border-emerald-700/30 bg-white/10 hover:border-emerald-600/50 hover:bg-zinc-900/30"
                                                            : "border-gray-800/20 bg-gray-900/10"
                                                    } ${index % 2 === 0 ? "lg:ml-auto lg:mr-12" : "lg:ml-12 lg:mr-auto"} w-full lg:w-5/12`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {/* Show stage icon inline on mobile */}
                                                            <div className="relative mr-3 lg:hidden">
                                                                <div
                                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                                        isUnlocked
                                                                            ? "bg-gradient-to-br from-[#00ff88] to-emerald-700"
                                                                            : "bg-gray-700"
                                                                    }`}>
                                                                    {getStageIcon(stageId)}
                                                                </div>
                                                                {isUnlocked && (
                                                                    <span className="animate-ping absolute -inset-1 rounded-full bg-emerald-400/20"></span>
                                                                )}
                                                            </div>
                                                            <h3
                                                                className={`text-lg font-bold sm:text-xl ${
                                                                    isUnlocked ? "text-white" : "text-gray-500"
                                                                }`}>
                                                                {stageData.name}
                                                            </h3>
                                                        </div>
                                                        <div
                                                            className={`flex items-center text-xs sm:text-sm ${
                                                                isUnlocked ? "text-[#00ff88]" : "text-gray-500"
                                                            }`}>
                                                            <div className="flex items-center">
                                                                {completedLevels}/{totalLevels}
                                                                <Award className="ml-1 h-4 w-4" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stage progress bar */}
                                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#00ff88] to-emerald-300 transition-all duration-700"
                                                            style={{ width: `${progressPercent}%` }}></div>
                                                    </div>

                                                    <p
                                                        className={`mt-3 text-sm sm:text-base ${
                                                            isUnlocked ? "text-zinc-200" : "text-gray-500"
                                                        }`}>
                                                        {stageData.description}
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {Object.entries(stageData.levels).map(([levelId]) => {
                                                            const level = parseInt(levelId);
                                                            const levelUnlocked = isLevelUnlocked(stageId, level);
                                                            const levelCompleted = isLevelCompleted(stageId, level);

                                                            return (
                                                                <div
                                                                    key={levelId}
                                                                    className={
                                                                        levelUnlocked
                                                                            ? "transition-transform hover:scale-105"
                                                                            : "pointer-events-none"
                                                                    }
                                                                    onClick={() =>
                                                                        levelUnlocked && navigateToLevel(stageId, level)
                                                                    }>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className={`group flex cursor-pointer items-center ${
                                                                            levelUnlocked
                                                                                ? levelCompleted
                                                                                    ? "border-green-700 bg-green-900/20 text-green-300 hover:bg-green-900/40"
                                                                                    : "border-emerald-700 bg-zinc-900/10 text-zinc-300 hover:border-emerald-600 hover:bg-zinc-900/30 hover:text-zinc-100"
                                                                                : "border-gray-800 bg-gray-900/20 text-gray-500"
                                                                        }`}>
                                                                        {levelCompleted ? (
                                                                            <CheckCircle2 className="mr-1 h-3 w-3 text-green-400 transition-transform duration-300 group-hover:scale-110" />
                                                                        ) : !levelUnlocked ? (
                                                                            <LockIcon className="mr-1 h-3 w-3" />
                                                                        ) : (
                                                                            <Star className="mr-1 h-3 w-3 text-[#00ff88] transition-transform duration-300 group-hover:rotate-45" />
                                                                        )}
                                                                        Level {levelId}
                                                                    </Button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Arrow to next stage */}
                                                    {isUnlocked && index < Object.keys(stages).length - 1 && (
                                                        <div className="absolute bottom-4 right-4 hidden text-[#00cc66] lg:block">
                                                            <ChevronRight className="animate-bounce h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </AnimatedElement>
                                    );
                                })}
                            </div>
                        </div>
                    </ClientOnly>
                </section>

                {/* Enhanced Learning Statistics & Gamification Section */}
                <section className="container mx-auto px-4 py-8 sm:py-16">
                    <AnimatedElement>
                        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:mb-12 sm:text-3xl">
                            <span className="relative">
                                {t("home.gameFeatures")}
                                <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#00ff88] to-emerald-300"></span>
                            </span>
                        </h2>
                    </AnimatedElement>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatedElement delay={200}>
                            <Card className="group relative overflow-hidden border-green-800/30 bg-gradient-to-br from-green-900/20 to-emerald-900/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <CardContent className="relative p-8 text-center">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                        <Activity className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-white">{t("home.feature1.title")}</h3>
                                    <p className="leading-relaxed text-zinc-200">{t("home.feature1.description")}</p>
                                    <div className="mt-6 flex justify-center">
                                        <div className="flex space-x-1">
                                            <div className="h-1 w-8 rounded-full bg-green-400"></div>
                                            <div className="h-1 w-4 rounded-full bg-green-400/50"></div>
                                            <div className="h-1 w-2 rounded-full bg-green-400/25"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedElement>

                        <AnimatedElement delay={400}>
                            <Card className="group relative overflow-hidden border-emerald-800/30 bg-gradient-to-br from-white/10 to-indigo-900/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <CardContent className="relative p-8 text-center">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00ff88] to-indigo-600 shadow-lg">
                                        <Gamepad2 className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-white">{t("home.feature2.title")}</h3>
                                    <p className="leading-relaxed text-zinc-200">{t("home.feature2.description")}</p>
                                    <div className="mt-6 flex justify-center">
                                        <div className="flex space-x-1">
                                            <div className="h-1 w-8 rounded-full bg-emerald-400"></div>
                                            <div className="h-1 w-4 rounded-full bg-emerald-400/50"></div>
                                            <div className="h-1 w-2 rounded-full bg-emerald-400/25"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedElement>

                        <AnimatedElement delay={600}>
                            <Card className="group relative overflow-hidden border-yellow-800/30 bg-gradient-to-br from-yellow-900/20 to-amber-900/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <CardContent className="relative p-8 text-center">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                                        <ShoppingCart className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-white">{t("home.feature3.title")}</h3>
                                    <p className="leading-relaxed text-zinc-200">{t("home.feature3.description")}</p>
                                    <div className="mt-6 flex justify-center">
                                        <div className="flex space-x-1">
                                            <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
                                            <div className="h-1 w-4 rounded-full bg-yellow-400/50"></div>
                                            <div className="h-1 w-2 rounded-full bg-yellow-400/25"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedElement>
                    </div>
                </section>

                {/* Call to action at the bottom */}
                <AnimatedElement>
                    <section className="container mx-auto px-4 py-12 text-center">
                        <div className="mx-auto max-w-3xl rounded-lg border border-emerald-700/30 bg-white/10 p-8">
                            <BookMarked className="mx-auto mb-4 h-12 w-12 text-[#00ff88]" />
                            <h2 className="mb-4 text-2xl font-bold text-white">{t("home.startLearning")}</h2>
                            <p className="mb-6 text-zinc-200">{t("home.subtitle")}</p>
                            <Link href="/intro">
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800">
                                    <span className="relative z-10 flex items-center">
                                        <Code className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                                        {t("home.startLearning")}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                    <span className="absolute bottom-0 left-0 h-1 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                                </Button>
                            </Link>
                        </div>
                    </section>
                </AnimatedElement>
            </div>

            {/* New Gamification Dialogs */}
            <DifficultySelector
                isOpen={showDifficultySelector}
                onClose={() => {
                    setShowDifficultySelector(false);
                    setIsFirstVisit(false);
                }}
                isInitialSelection={isFirstVisit}
            />

            <Shop isOpen={showShop} onClose={() => setShowShop(false)} />

            <Minigames isOpen={showMinigames} onClose={() => setShowMinigames(false)} />
        </PageLayout>
    );
}
