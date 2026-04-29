"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "~/translations";

type Language = "de" | "en" | "fa" | "hi";

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to English with auto-detection on first load
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        setLanguageState("en");
        localStorage.setItem("gitgud-language", "en");
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState("en");
        localStorage.setItem("gitgud-language", "en");
    };

    // Translation function
    const t = (key: string): string => {
        const langTranslations = translations[language];
        if (!langTranslations || !langTranslations[key as keyof typeof langTranslations]) {
            // If translation not found, try to find it in English as fallback
            if (language !== "en" && translations.en[key as keyof typeof translations.en]) {
                return translations.en[key as keyof typeof translations.en];
            }
            // Return the key itself if no translation found
            return key;
        }
        return langTranslations[key as keyof typeof langTranslations];
    };

    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
