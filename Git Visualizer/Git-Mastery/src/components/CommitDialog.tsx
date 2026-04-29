"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useLanguage } from "~/contexts/LanguageContext";
import { GitCommit, Smile } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { getEmojiSuggestions, formatCommitWithEmoji, type EmojiSuggestion } from "~/lib/EmojiSuggestions";

export function CommitDialog() {
    const { t } = useLanguage();
    const { isCommitDialogOpen, handleCommit, closeCommitDialog, progressManager } = useGameContext();
    const [message, setMessage] = useState("");
    const [showEmojiSuggestions, setShowEmojiSuggestions] = useState(false);
    const [emojiSuggestions, setEmojiSuggestions] = useState<EmojiSuggestion[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Check if emoji commits are purchased
    const hasEmojiCommits = progressManager.getPurchasedItems().includes("emoji-commits");

    // Focus textarea when dialog opens
    useEffect(() => {
        if (isCommitDialogOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isCommitDialogOpen]);

    // Reset message when dialog closes
    useEffect(() => {
        if (!isCommitDialogOpen) {
            setMessage("");
            setShowEmojiSuggestions(false);
            setEmojiSuggestions([]);
        }
    }, [isCommitDialogOpen]);

    // Update emoji suggestions when message changes
    useEffect(() => {
        if (hasEmojiCommits && message.trim()) {
            const suggestions = getEmojiSuggestions(message);
            setEmojiSuggestions(suggestions);
        } else {
            setEmojiSuggestions([]);
        }
    }, [message, hasEmojiCommits]);

    // Handle adding emoji to message
    const addEmojiToMessage = (emoji: string) => {
        const formattedMessage = formatCommitWithEmoji(emoji, message);
        setMessage(formattedMessage);
        setShowEmojiSuggestions(false);

        // Focus back to textarea
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };

    // Handle commit action
    const performCommit = () => {
        if (message.trim()) {
            handleCommit(message.trim());
            setMessage("");
            closeCommitDialog();
        }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Enter or Cmd+Enter to commit
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            performCommit();
        }

        // Escape to cancel (handled by DialogContent)
    };

    // Check if device is likely mobile
    const isMobileDevice = () => {
        if (typeof window !== "undefined") {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                window.innerWidth <= 768
            );
        }
        return false;
    };

    return (
        <Dialog open={isCommitDialogOpen} onOpenChange={closeCommitDialog}>
            <DialogContent
                className="max-w-md border-white/10 bg-[#0a0a0c] text-zinc-100"
                onKeyDown={handleKeyDown}
                // Remove the built-in X button by overriding its CSS
                style={
                    {
                        "--close-button-display": "none",
                    } as React.CSSProperties
                }>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-white">
                        <GitCommit className="mr-2 h-5 w-5 text-[#00ff88]" />
                        {t("commit.title") || "Commit Message"}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="min-h-[150px] bg-zinc-900/10 font-mono text-zinc-200 focus-visible:ring-[#00ff88]"
                        placeholder={t("commit.placeholder") || "Enter a commit message describing your changes..."}
                        autoFocus={!isMobileDevice()}
                    />

                    {/* Emoji suggestions */}
                    {hasEmojiCommits && emojiSuggestions.length > 0 && (
                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-zinc-300">Suggested emojis:</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowEmojiSuggestions(!showEmojiSuggestions)}
                                    className="text-[#00ff88] hover:text-zinc-300">
                                    <Smile className="mr-1 h-4 w-4" />
                                    {showEmojiSuggestions ? "Hide" : "Show"}
                                </Button>
                            </div>

                            {(showEmojiSuggestions || emojiSuggestions.length <= 3) && (
                                <div className="grid grid-cols-2 gap-2">
                                    {emojiSuggestions.slice(0, 6).map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addEmojiToMessage(suggestion.emoji)}
                                            className="h-auto justify-start border border-emerald-800/30 bg-zinc-900/10 p-2 text-left hover:bg-white/10">
                                            <span className="mr-2 text-lg">{suggestion.emoji}</span>
                                            <span className="text-xs text-zinc-300">{suggestion.description}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-2 text-xs text-[#00ff88]">
                        {t("commit.tip") ||
                            "First line should be a short summary. Leave a blank line then add details if needed."}
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                    <div className="hidden text-xs text-[#00ff88] md:block">
                        {t("editor.escToCancel") || "Press ESC to cancel, CTRL+Enter to commit"}
                    </div>
                    <div className="flex w-full gap-2 sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={closeCommitDialog}
                            className="flex-1 border-emerald-700 text-[#00ff88] hover:bg-zinc-900/30 sm:flex-auto">
                            {t("editor.cancel") || "Cancel"}
                        </Button>
                        <Button
                            onClick={performCommit}
                            disabled={!message.trim()}
                            className="flex-1 bg-[#00cc66] text-white hover:bg-emerald-700 sm:flex-auto">
                            {t("commit.button") || "Commit Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
