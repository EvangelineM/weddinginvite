"use client";

import React from "react";
import { Language } from "@/lib/translations";

interface LanguageToggleProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
    currentLang,
    onLanguageChange,
}) => {
    return (
        <div
            className="fixed top-4 right-4 z-40 flex items-center bg-[#FFFDFB]/95 backdrop-blur-md border border-[#E3BDB0] rounded-lg p-0.5 shadow-sm transition-all duration-300"
            role="region"
            aria-label="Language selector"
        >
            <button
                type="button"
                id="lang-btn-en"
                onClick={() => onLanguageChange("EN")}
                className={`px-2 py-1 text-xs font-sans tracking-wider rounded-md min-h-[28px] transition-colors duration-200 cursor-pointer ${
                    currentLang === "EN"
                        ? "bg-[#9F4B31] text-[#FFFDFB] font-medium shadow-xs"
                        : "text-[#9F4B31] hover:text-[#BD8167] hover:bg-[#FAF7F5]"
                }`}
                aria-pressed={currentLang === "EN"}
            >
                English
            </button>
            <button
                type="button"
                id="lang-btn-ta"
                onClick={() => onLanguageChange("TA")}
                className={`px-2 py-1 text-xs font-sans tracking-wider rounded-md min-h-[28px] transition-colors duration-200 cursor-pointer ${
                    currentLang === "TA"
                        ? "bg-[#9F4B31] text-[#FFFDFB] font-medium shadow-xs"
                        : "text-[#9F4B31] hover:text-[#BD8167] hover:bg-[#FAF7F5]"
                }`}
                aria-pressed={currentLang === "TA"}
            >
                Tamil
            </button>
        </div>
    );
};
