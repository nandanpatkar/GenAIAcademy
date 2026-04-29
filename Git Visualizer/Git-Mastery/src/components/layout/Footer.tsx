import { Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "~/contexts/LanguageContext";
import { ProTipDisplay } from "../ProTipDisplay";

interface FooterProps {
    className?: string;
}

export function Footer({ className = "" }: FooterProps) {
    const { language } = useLanguage();

    return (
        <footer className={`mt-auto bg-[#0a0a0c] ${className}`}>
            {/* Pro Tips Bar - only shows if purchased */}
            <ProTipDisplay />

            {/* Regular Footer Content removed */}
        </footer>
    );
}
