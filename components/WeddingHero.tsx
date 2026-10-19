"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Language, TranslationContent } from "@/lib/translations";

/** Native dimensions of the supplied portrait hero video. */
const HERO_W = 720;
const HERO_H = 1280;

/** Playback time (in seconds) of the 6s hero video when the copy fades up. */
const TEXT_REVEAL_AT_SECONDS = 3;

const HERO_VIDEO_WEBM =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792347205/Animate_wedding_invitation_image__20260926040209.webm";
const HERO_VIDEO_MP4 =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792426016/wedding_dance_1.mp4";

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
                    src="/images/hero/cross.webp"
                    alt=""
                    width={768}
                    height={1024}
                    unoptimized
                    className="h-full w-auto object-contain"
                    // priority
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
                    src="/images/common/leaf_divider.webp"
                    alt=""
                    width={2088}
                    height={213}
                    unoptimized
                    className="h-auto w-[36cqi] max-w-none object-contain"
                    // priority
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
                    src="/images/common/leaf_divider.webp"
                    alt=""
                    width={2088}
                    height={213}
                    unoptimized
                    className="h-auto w-[30cqi] max-w-none object-contain"
                    // priority
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
        if (window.scrollY > 60) return;

        window.setTimeout(() => {
            if (hasNudgedRef.current || window.scrollY > 60) return;
            hasNudgedRef.current = true;

            const peek = Math.min(Math.round(window.innerHeight * 0.14), 110);
            const DURATION = 2000; // total ms, down and back

            // 0 -> peek -> 0 as one smooth wave (zero velocity at start, middle and end)
            const wave = (p: number) => (1 - Math.cos(2 * Math.PI * p)) / 2;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lenis = (window as any).__lenis;
            const setY = (y: number) => {
                if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
                else window.scrollTo(0, y);
            };

            let cancelled = false;
            const cancel = () => {
                cancelled = true;
                cleanup();
            };
            const events = ["wheel", "touchstart", "keydown"] as const;
            const cleanup = () =>
                events.forEach((e) => window.removeEventListener(e, cancel));
            events.forEach((e) =>
                window.addEventListener(e, cancel, { passive: true }),
            );

            const startTime = performance.now();
            const frame = (now: number) => {
                if (cancelled) return;
                const p = Math.min((now - startTime) / DURATION, 1);

                setY(peek * wave(p));

                if (p < 1) {
                    requestAnimationFrame(frame);
                } else {
                    setY(0);
                    cleanup();
                }
            };
            requestAnimationFrame(frame);
        }, 500);
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
