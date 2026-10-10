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

const SHARP_TYPE: React.CSSProperties = {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "geometricPrecision",
};

interface WeddingHeroProps {
    t: TranslationContent;
    lang: Language;
    isActive: boolean;
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

        if (video.duration - video.currentTime <= 6.5) {
            onRevealStart();
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
            <source
                src="https://res.cloudinary.com/jcjsrbvw/video/upload/v1790413402/Animate_wedding_invitation_image__20260926040209.mp4"
                type="video/mp4"
            />
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
    isRevealed,
}: {
    t: TranslationContent;
    lang: Language;
    isRevealed: boolean;
}) {
    return (
        <div
            className="hero-invitation-overlay absolute inset-0 z-2 pointer-events-none select-none"
            data-revealed={isRevealed}
            style={SHARP_TYPE}
        >
            <div className="absolute left-[26%] right-[6%] top-[8.2%] flex h-[7.8%] justify-center">
                <Image
                    src="/images/cross.png"
                    alt=""
                    width={768}
                    height={1024}
                    unoptimized
                    className="h-full w-auto object-contain"
                />
            </div>

            <p
                className="absolute left-[27%] right-[7%] top-[17.2%] text-center font-serif italic leading-[1.12]"
                style={{
                    fontSize: "clamp(0.85rem, 3.9cqi, 1.25rem)",
                    color: TEXT_PRIMARY,
                    fontWeight: 650,
                    fontStyle: "italic",
                }}
            >
                {t.hero.verseLine1}
                {t.hero.verseLine2 && (
                    <>
                        <br />
                        {t.hero.verseLine2}
                    </>
                )}
                {
                    <span
                        className="mt-[clamp(0.27rem,0.7cqi,0.45rem)] block not-italic"
                        style={{ fontSize: "0.67em" }}
                    >
                        — Song of Solomon{" "}
                        <span
                            style={{
                                fontFamily: "var(--font-libre-bodoni)",
                                fontWeight: 400,
                                fontStyle: "normal",
                                fontSize: "0.9em",
                            }}
                        >
                            3:4
                        </span>{" "}
                        (NIV)
                    </span>

                    // <span
                    //     className="mt-[clamp(0.27rem,0.7cqi,0.45rem)] block font-libre-bodoni font-normal  not-italic"
                    //     style={{ fontSize: "0.66em" }}
                    //     >
                    //     {t.hero.verseRef}
                    // </span>
                }
            </p>

            <div className="absolute left-[27%] right-[8.5%] top-[23.3%] flex justify-center">
                <Image
                    src="/images/datedivider.png"
                    alt=""
                    width={1920}
                    height={1080}
                    unoptimized
                    className="h-auto w-[49%] max-w-none object-contain"
                />
            </div>

            {/* Mobile View */}
            <p
                className="absolute left-[23%] right-[5%] top-[28.9%] whitespace-nowrap text-center font-cara leading-none md:hidden"
                style={{
                    fontSize: "clamp(3.08rem, 10.2cqi, 4.8rem)",
                    color: TEXT_MUTED,
                    letterSpacing: "0.027em",
                }}
            >
                {t.hero.groom} <span className="font-cara">&amp;</span>{" "}
                {t.hero.bride}
            </p>

            {/* Desktop View */}
            <div
                className="absolute left-[23%] right-[5%] top-[30%] hidden md:flex flex-col text-center font-cara leading-[0.55]"
                style={{
                    fontSize: "clamp(3rem, 8cqi, 4rem)",
                    color: TEXT_MUTED,
                    letterSpacing: "0.027em",
                }}
            >
                <div className="text-left ml-[12%]">{t.hero.groom}</div>
                <div className="text-center text-[0.7em] my-2">
                    <span className="font-cara">&amp;</span>
                </div>
                <div className="text-right mr-[25%]">{t.hero.bride}</div>
            </div>

            <div
                className="absolute left-[20%] right-[0%] top-[35.7%] md:top-[41%] flex items-center justify-center gap-[clamp(0.4rem,1.7cqi,1rem)] whitespace-nowrap"
                style={{
                    fontSize: "clamp(0.75rem, 2.65cqi, 1.55rem)",
                    color: TEXT_PRIMARY,
                    letterSpacing: "0.12em",
                }}
            >
                <span className="font-libre-bodoni font-normal opacity-80">
                    16
                </span>
                <span className="font-serif font-normal opacity-100">|</span>
                <span className="font-serif font-semibold">{t.hero.month}</span>
                <span className="font-serif font-normal opacity-100">|</span>
                <span className="font-libre-bodoni font-normal opacity-80">
                    2026
                </span>
            </div>

            <div className="absolute left-[27%] right-[12%] top-[37.2%] md:top-[42.5%] flex justify-center">
                <Image
                    src="/images/datedivider.png"
                    alt=""
                    width={1920}
                    height={1080}
                    unoptimized
                    className="h-auto w-[35%] max-w-none object-contain"
                />
            </div>
        </div>
    );
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({
    t,
    lang,
    isActive,
}) => {
    const [isVideoEnded, setIsVideoEnded] = React.useState(false);

    return (
        <HeroFitStage>
            <HeroBackground
                isActive={isActive}
                onRevealStart={() => setIsVideoEnded(true)}
                onEnded={() => setIsVideoEnded(true)}
            />
            <HeroInvitationText t={t} lang={lang} isRevealed={isVideoEnded} />
        </HeroFitStage>
    );
};
