"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { TranslationContent, Language } from "@/lib/translations";

const BACKGROUND = "/images/savedate/savedate_bg.webp";
const FRAME = "/images/savedate/frame.webp";
const DIVIDER = "/images/common/leaf_divider.webp";

const WEDDING_DATE = new Date("2026-11-16T10:00:00+05:30");

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(): TimeLeft {
    const now = new Date();
    const diff = Math.max(0, WEDDING_DATE.getTime() - now.getTime());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

interface SaveTheDateProps {
    t: TranslationContent;
    lang?: Language;
}

export function SaveTheDate({ t, lang = "EN" }: SaveTheDateProps) {
    const isTamil = lang === "TA" || t.countdown.days === "நாட்கள்";
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
    const sectionRef = useRef<HTMLElement>(null);
    const hasFiredRef = useRef(false);

    const tick = useCallback(() => {
        setTimeLeft(getTimeLeft());
    }, []);

    useEffect(() => {
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [tick]);

    // Scroll-triggered celebratory theme confetti
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const triggerThemeConfetti = () => {
            // Theme shades: Warm Antique Gold, Tuscan Terracotta, Peach & Champagne
            const colors = [
                "#D4AF37", // Warm Gold
                "#AF8D60", // Antique Gold
                "#E5C378", // Champagne Gold
                "#C59B27", // Rich Gold
                "#9F4B31", // Tuscan Terracotta
                "#713B1C", // Deep Rust
                "#A45B35", // Warm Sienna
                "#E3BDB0", // Peach Blossom
                "#D28B77", // Blush Rose
                "#FFF9F2", // Pearl Ivory
            ];

            try {
                // Left & Right celebratory bursts
                confetti({
                    particleCount: 45,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0.15, y: 0.65 },
                    colors,
                    ticks: 240,
                    gravity: 0.85,
                    scalar: 0.95,
                    zIndex: 9999,
                });

                confetti({
                    particleCount: 45,
                    angle: 120,
                    spread: 60,
                    origin: { x: 0.85, y: 0.65 },
                    colors,
                    ticks: 240,
                    gravity: 0.85,
                    scalar: 0.95,
                    zIndex: 9999,
                });

                // Gentle cascading center shower
                setTimeout(() => {
                    confetti({
                        particleCount: 30,
                        spread: 80,
                        origin: { x: 0.5, y: 0.45 },
                        colors,
                        ticks: 220,
                        gravity: 0.75,
                        scalar: 0.85,
                        zIndex: 9999,
                    });
                }, 250);
            } catch {
                /* Safe fallback */
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Fire once and never again — even if the user scrolls away & back
                    if (entry.isIntersecting && !hasFiredRef.current) {
                        hasFiredRef.current = true;
                        triggerThemeConfetti();
                    }
                });
            },
            // Fire when at least 50% of the section is in view
            { threshold: 0.5 },
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

    const countdownStr = `${timeLeft.days}:${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;

    return (
        <section
            ref={sectionRef}
            id="save-the-date-section"
            className="countdown-section"
        >
            <div className="countdown-artboard">
                {/* Full-bleed terrace background */}
                <Image
                    src={BACKGROUND}
                    alt="Tuscan Sunset Terrace in Bloom"
                    fill
                    // priority
                    sizes="(max-width: 620px) 100vw, 620px"
                    className="countdown-bg-img"
                    unoptimized
                />

                {/* The Save the Date Card positioned exactly over open sky */}
                <div
                    className={`countdown-card ${isTamil ? "countdown-card-ta" : ""}`}
                >
                    {/* Double-line warm gold frame */}
                    <Image
                        src={FRAME}
                        alt=""
                        fill
                        className="countdown-frame-img"
                        unoptimized
                        // priority
                    />

                    {/* Inner content */}
                    <div className="countdown-inner">
                        {/* Antique gold heart */}
                        <span className="countdown-heart" aria-hidden="true">
                            ♥
                        </span>

                        {/* Title: COUNTDOWN */}
                        <h2 className="countdown-title">
                            {t.countdown.title.toUpperCase()}
                        </h2>

                        {/* Golden leaf divider with flanking lines */}
                        <div
                            className="countdown-divider-wrap"
                            aria-hidden="true"
                        >
                            <Image
                                src={DIVIDER}
                                alt=""
                                width={2088}
                                height={213}
                                className="countdown-divider-img"
                                unoptimized
                                // priority
                            />
                        </div>

                        {/* Date: NOVEMBER 16, 2026 */}
                        <p className="countdown-date">{t.countdown.date}</p>

                        {/* Weekday: MONDAY */}
                        <p className="countdown-weekday">
                            {t.countdown.weekday}
                        </p>

                        {/* Live countdown timer: 157:23:41:44 */}
                        <p
                            className="countdown-numbers"
                            aria-live="polite"
                            suppressHydrationWarning
                        >
                            {countdownStr}
                        </p>

                        {/* Time labels: DAYS  HOURS  MINUTES  SECONDS */}
                        <div className="countdown-labels">
                            <span className="countdown-label-item">
                                {t.countdown.days}
                            </span>
                            <span className="countdown-label-item">
                                {t.countdown.hours}
                            </span>
                            <span className="countdown-label-item">
                                {t.countdown.minutes}
                            </span>
                            <span className="countdown-label-item">
                                {t.countdown.seconds}
                            </span>
                        </div>

                        {/* Closing script message */}
                        <p className="countdown-closing">
                            {t.countdown.closing}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
