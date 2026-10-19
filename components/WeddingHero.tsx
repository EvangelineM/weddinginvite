"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Language, TranslationContent } from "@/lib/translations";

/** Native dimensions of the supplied portrait hero video. */
const HERO_W = 720;
const HERO_H = 1280;

/** Reference typography colors sampled from the artwork. */
const TEXT_PRIMARY = "#3B2422";
const TEXT_MUTED = "#5A3628";

/** Playback time (in seconds) of the 6s hero video when the copy fades up. */
const TEXT_REVEAL_AT_SECONDS = 3;

const HERO_VIDEO_WEBM =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792347205/Animate_wedding_invitation_image__20260926040209.webm";
const HERO_VIDEO_MP4 =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792354724/wedding_dance.mp4";

const SHARP_TYPE: React.CSSProperties = {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "geometricPrecision",
};

interface WeddingHeroProps {
    t: TranslationContent;
    lang: Language;
    isActive: boolean;
    groomFirst?: boolean;
}

/**
 * Keeps the supplied 720×1280 invitation video proportional at every viewport.
 */
function HeroFitStage({ children }: { children: React.ReactNode }) {
    return (
        <section
            id="hero-section"
            className="hero-stage-section relative flex w-full items-center justify-center overflow-hidden bg-paper-ivory min-h-screen min-h-svh"
        >
            <div
                className="hero-artboard relative"
                style={{
                    aspectRatio: `${HERO_W} / ${HERO_H}`,
                    containerType: "inline-size",
                }}
            >
                {children}
            </div>
        </section>
    );
}

/** Animated hero scene. Muted inline playback allows background autoplay across browsers. */
function HeroBackground({
    isActive,
    onRevealStart,
    onEnded,
}: {
    isActive: boolean;
    onRevealStart: () => void;
    onEnded: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!isActive || !video || !Number.isFinite(video.duration)) return;

        if (video.currentTime >= TEXT_REVEAL_AT_SECONDS) {
            onRevealStart();
        }

        if (video.duration > 0 && video.currentTime >= video.duration - 0.2) {
            onEnded();
        }
    };

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const hero = video.closest("#hero-section");
        if (!hero) return;

        const playFromStart = () => {
            if (!isActive) return;
            video.currentTime = 0;
            video.muted = true;
            void video.play().catch(() => {
                // Muted playback can still be delayed until the browser permits it.
            });
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                    playFromStart();
                } else {
                    video.pause();
                }
            },
            { threshold: [0, 0.25] },
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, [isActive]);

    return (
        <video
            ref={videoRef}
            aria-hidden="true"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={onEnded}
            className="absolute inset-0 h-full w-full object-cover object-top"
        >
            <source src={HERO_VIDEO_WEBM} type="video/webm" />
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
    );
}

/**
 * Invitation copy aligned to the supplied video. The video remains visible
 * behind the copy so its animation and the site's live language switcher work
 * together.
 */
function HeroInvitationText({
    t,
    lang,
    isRevealed,
    groomFirst = true,
}: {
    t: TranslationContent;
    lang: Language;
    isRevealed: boolean;
    groomFirst?: boolean;
}) {
    const isTamil = lang === "TA" || t.countdown.days === "நாட்கள்";
    const firstName = groomFirst ? t.hero.groom : t.hero.bride;
    const secondName = groomFirst ? t.hero.bride : t.hero.groom;
    const day = t.hero.day || t.section3.day || "16";
    const month = t.hero.month || t.section3.month;
    const year = t.hero.year || t.section3.year || "2026";
    const weekday = t.hero.weekday || t.section3.weekday;

    return (
        <div
            className={`hero-invitation-overlay absolute inset-0 z-2 pointer-events-none select-none transition-opacity duration-1000 ${
                isTamil ? "hero-ta" : ""
            }`}
            data-revealed={isRevealed}
            style={{
                ...SHARP_TYPE,
                opacity: isRevealed ? 1 : 0,
            }}
        >
            {/* Top Cross */}
            <div className="hero-cross-wrap absolute left-[59.5%] -translate-x-1/2 top-[8.2%] flex h-[8.2%] justify-center pointer-events-none select-none">
                <Image
                    src="/images/cross.png"
                    alt=""
                    width={768}
                    height={1024}
                    unoptimized
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* 1. Scripture Verse — frontend specs same as Section 3 */}
            <div className="hero-verse-wrap">
                <p className="hero-verse-quote">
                    {t.hero.verseLine1}
                    {t.hero.verseLine2 && (
                        <>
                            <br />
                            {t.hero.verseLine2}
                        </>
                    )}
                </p>
                <p className="hero-verse-ref">{t.hero.verseRef}</p>
            </div>

            {/* Top Divider */}
            <div className="hero-divider-top absolute left-[59.5%] -translate-x-1/2 top-[25.7%] flex justify-center pointer-events-none select-none">
                <Image
                    src="/images/leaf_divider.png"
                    alt=""
                    width={2088}
                    height={213}
                    unoptimized
                    className="h-auto w-[36cqi] max-w-none object-contain"
                />
            </div>

            {/* 2. Couple Names in a single line: Franklin & Irene */}
            <h2 className="hero-names-single">
                <span>{firstName}</span>
                <span className="hero-names-amp">&amp;</span>
                <span>{secondName}</span>
            </h2>

            {/* 3. Date in a single line matching reference: NOVEMBER 16, 2026 */}
            <p className="hero-date-single">{t.hero.date}</p>

            {/* Bottom Divider */}
            <div className="hero-divider-bottom absolute left-[59.5%] -translate-x-1/2 top-[37.6%] flex justify-center pointer-events-none select-none">
                <Image
                    src="/images/leaf_divider.png"
                    alt=""
                    width={2088}
                    height={213}
                    unoptimized
                    className="h-auto w-[30cqi] max-w-none object-contain"
                />
            </div>
        </div>
    );
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({
    t,
    lang,
    isActive,
    groomFirst = true,
}) => {
    const [isVideoEnded, setIsVideoEnded] = React.useState(false);
    const hasNudgedRef = React.useRef(false);

    const handleVideoEnded = React.useCallback(() => {
        setIsVideoEnded(true);

        if (hasNudgedRef.current) return;
        if (typeof window === "undefined") return;

        // Only nudge if the user is still at the top and hasn't already scrolled down
        if (window.scrollY > 60) return;

        hasNudgedRef.current = true;

        // Peek down slightly into the next section to show the user they can scroll
        const peekDistance = Math.min(Math.round(window.innerHeight * 0.28), 240);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis;

        if (lenis) {
            lenis.scrollTo(peekDistance, {
                duration: 0.95,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                onComplete: () => {
                    window.setTimeout(() => {
                        // Return to hero section if user hasn't started manually scrolling away
                        if (Math.abs(window.scrollY - peekDistance) < 60) {
                            lenis.scrollTo(0, {
                                duration: 0.95,
                                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                            });
                        }
                    }, 650);
                },
            });
        } else {
            window.scrollTo({ top: peekDistance, behavior: "smooth" });
            window.setTimeout(() => {
                if (Math.abs(window.scrollY - peekDistance) < 60) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }, 1300);
        }
    }, []);

    return (
        <HeroFitStage>
            <HeroBackground
                isActive={isActive}
                onRevealStart={() => setIsVideoEnded(true)}
                onEnded={handleVideoEnded}
            />
            <HeroInvitationText
                t={t}
                lang={lang}
                isRevealed={isVideoEnded}
                groomFirst={groomFirst}
            />
        </HeroFitStage>
    );
};
