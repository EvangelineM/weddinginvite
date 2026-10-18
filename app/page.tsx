"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Language, translations } from "@/lib/translations";
import { InvitationIntro } from "@/components/InvitationIntro";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MusicToggle } from "@/components/MusicToggle";
import { FallingPetals } from "@/components/DecorativeElements";
import { WeddingHero } from "@/components/WeddingHero";
import { SaveTheDate } from "@/components/SaveTheDate";
import { Section3 } from "@/components/Section3";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";

function WeddingInvitationContent() {
    const [currentLang, setCurrentLang] = useState<Language>("EN");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isHeroEmerging, setIsHeroEmerging] = useState(false);

    const searchParams = useSearchParams();
    // flag=1 (or absent) → groom & bride; flag=0 → bride & groom
    const groomFirst = searchParams.get("flag") !== "0";

    const t = translations[currentLang];

    // Prevent background scrolling and hide scrollbars completely while the sealed envelope is visible
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis;

        if (!isUnlocked) {
            document.documentElement.classList.remove("is-unlocked");
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0);
            lenis?.stop();
        } else {
            document.documentElement.classList.add("is-unlocked");
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
            lenis?.start();
            lenis?.scrollTo(0, { immediate: true });
        }

        return () => {
            document.documentElement.classList.add("is-unlocked");
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
            lenis?.start();
        };
    }, [isUnlocked]);

    useEffect(() => {
        document.documentElement.lang = currentLang.toLowerCase();
    }, [currentLang]);

    const handleOpenComplete = () => {
        setIsUnlocked(true);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    return (
        <div
            className={`wedding-page-root relative min-h-screen text-[#3D251E] paper-grain selection:bg-[#E3BDB0] selection:text-[#9F4B31] overflow-x-hidden ${
                currentLang === "TA" ? "lang-ta" : "lang-en"
            }`}
        >
            {/* Initial Sealed Wedding Invitation Overlay: ONLY element visible on initial load */}
            {!isUnlocked && (
                <InvitationIntro
                    t={t}
                    onOpenComplete={handleOpenComplete}
                    onHeroRevealStart={() => setIsHeroEmerging(true)}
                />
            )}

            {/* Interactive UI visible after invitation is opened */}
            {isUnlocked && (
                <>
                    {/* Falling rose & blush petals atmospheric layer */}
                    <FallingPetals />

                    {/* Floating Language Switcher (EN | ES) */}
                    <LanguageToggle
                        currentLang={currentLang}
                        onLanguageChange={setCurrentLang}
                    />

                    {/* Floating Circular Music Toggle Button */}
                    <MusicToggle />
                </>
            )}

            {/* Main Wedding Invitation Card Flow: Fills entire screen */}
            <main
                className={`wedding-main-content relative z-10 w-full min-h-screen bg-[#FAF7F5] transition-opacity duration-700 ${
                    isHeroEmerging ? "hero-emerging" : ""
                } ${
                    isUnlocked || isHeroEmerging
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Page 1: Wedding Hero Cover */}
                <WeddingHero
                    t={t}
                    lang={currentLang}
                    isActive={isUnlocked || isHeroEmerging}
                    groomFirst={groomFirst}
                />

                {/* Page 2: Countdown */}
                <SaveTheDate t={t} lang={currentLang} />

                {/* Page 3: Formal wedding invitation details */}
                <Section3 t={t} lang={currentLang} groomFirst={groomFirst} />

                {/* Page 4: Welcome / Location */}
                <WeddingDetails t={t} lang={currentLang} />

                {/* Page 5: Stationery RSVP */}
                <RSVPForm t={t} lang={currentLang} />

                {/* Footer */}
                <footer className="w-full py-10 px-4 text-center border-t border-[#E3BDB0]/60 bg-[#F5EEE9]/90">
                    <p className="font-serif italic text-sm text-[#9F4B31]">
                        {t.footer.namesAndLocation}
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default function WeddingInvitationPage() {
    return (
        <Suspense fallback={null}>
            <WeddingInvitationContent />
        </Suspense>
    );
}
