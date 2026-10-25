"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";

/**
 * Ordered list of every scrollable section id.
 * The last entry is the final section — auto-scroll will NOT proceed past it.
 */
const SECTION_IDS = [
    "hero-section",
    "save-the-date-section",
    "section-3",
    "venue-section",
    "rsvp-section",
];

/** Sections that contain a <video> element we should wait for. */
const VIDEO_SECTIONS = new Set(["hero-section", "venue-section"]);

/** How long (ms) to dwell on a non-video section before scrolling to the next. */
const DWELL_MS = 2000;

/** Delay (ms) after a video ends before scrolling to the next section. */
const POST_VIDEO_DELAY_MS = 1000;

/** Lenis scroll duration in seconds for each section transition. */
const SCROLL_DURATION = 3.5;

/** Smooth ease-in-out cubic. */
const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface AutoScrollToggleProps {
    isUnlocked: boolean;
}

export const AutoScrollToggle: React.FC<AutoScrollToggleProps> = ({
    isUnlocked,
}) => {
    const [enabled, setEnabled] = useState(true);
    const currentIndexRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const videoListenerRef = useRef<(() => void) | null>(null);
    const isScrollingRef = useRef(false);
    const enabledRef = useRef(true);

    // Keep ref in sync with state so callbacks always see current value
    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    /** Cancel any pending timers or video listeners. */
    const cancelPending = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (videoListenerRef.current) {
            videoListenerRef.current();
            videoListenerRef.current = null;
        }
    }, []);

    /** Scroll to the section at `index` smoothly via Lenis (or fallback). */
    const scrollToIndex = useCallback((index: number) => {
        const id = SECTION_IDS[index];
        if (!id) return;

        const el = document.getElementById(id);
        if (!el) return;

        isScrollingRef.current = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis;
        if (lenis) {
            lenis.scrollTo(el, {
                duration: SCROLL_DURATION,
                easing: easeInOutCubic,
                onComplete: () => {
                    isScrollingRef.current = false;
                },
            });
            // Safety fallback in case onComplete doesn't fire
            setTimeout(() => {
                isScrollingRef.current = false;
            }, SCROLL_DURATION * 1000 + 500);
        } else {
            el.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1200);
        }
    }, []);

    /** Figure out which section is currently most visible and return its index. */
    const detectCurrentSection = useCallback((): number => {
        let bestIndex = 0;
        let bestRatio = 0;

        for (let i = 0; i < SECTION_IDS.length; i++) {
            const el = document.getElementById(SECTION_IDS[i]);
            if (!el) continue;

            const rect = el.getBoundingClientRect();
            const visibleH =
                Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const ratio = visibleH / window.innerHeight;

            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestIndex = i;
            }
        }

        return bestIndex;
    }, []);

    /** Schedule the next auto-scroll from the current section. */
    const scheduleNext = useCallback(() => {
        if (!enabledRef.current) return;

        cancelPending();

        const idx = detectCurrentSection();
        currentIndexRef.current = idx;

        // Already at last section — nothing to do
        if (idx >= SECTION_IDS.length - 1) return;

        const sectionId = SECTION_IDS[idx];
        const sectionEl = document.getElementById(sectionId);

        // Section has a video — wait for it to end
        if (VIDEO_SECTIONS.has(sectionId) && sectionEl) {
            const video = sectionEl.querySelector("video");

            if (video && !video.ended) {
                const onEnded = () => {
                    video.removeEventListener("ended", onEnded);
                    videoListenerRef.current = null;

                    if (!enabledRef.current) return;

                    timerRef.current = setTimeout(() => {
                        if (!enabledRef.current) return;
                        currentIndexRef.current = idx + 1;
                        scrollToIndex(idx + 1);

                        // After scroll completes, schedule the next one
                        setTimeout(() => {
                            scheduleNext();
                        }, SCROLL_DURATION * 1000 + 600);
                    }, POST_VIDEO_DELAY_MS);
                };

                video.addEventListener("ended", onEnded);
                videoListenerRef.current = () =>
                    video.removeEventListener("ended", onEnded);
                return;
            }

            // Video already ended or not found — treat as non-video
        }

        // Non-video section — dwell, then scroll
        timerRef.current = setTimeout(() => {
            if (!enabledRef.current) return;
            currentIndexRef.current = idx + 1;
            scrollToIndex(idx + 1);

            // After scroll completes, schedule the next one
            setTimeout(() => {
                scheduleNext();
            }, SCROLL_DURATION * 1000 + 600);
        }, DWELL_MS);
    }, [cancelPending, detectCurrentSection, scrollToIndex]);

    /** Kick off (or restart) auto-scroll when enabled or page unlocks. */
    useEffect(() => {
        if (!isUnlocked) return;

        if (enabled) {
            // Small delay to let the page settle after unlock
            const kickoff = setTimeout(() => {
                scheduleNext();
            }, 800);
            return () => {
                clearTimeout(kickoff);
                cancelPending();
            };
        } else {
            cancelPending();
        }
    }, [enabled, isUnlocked, scheduleNext, cancelPending]);

    /** If the user manually scrolls, re-detect section and reschedule. */
    useEffect(() => {
        if (!isUnlocked || !enabled) return;

        let scrollTimeout: ReturnType<typeof setTimeout>;

        const onUserScroll = () => {
            // Ignore scroll events triggered by our own auto-scroll
            if (isScrollingRef.current) return;

            cancelPending();

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (enabledRef.current) {
                    scheduleNext();
                }
            }, 1500);
        };

        window.addEventListener("wheel", onUserScroll, { passive: true });
        window.addEventListener("touchmove", onUserScroll, { passive: true });

        return () => {
            window.removeEventListener("wheel", onUserScroll);
            window.removeEventListener("touchmove", onUserScroll);
            clearTimeout(scrollTimeout);
        };
    }, [isUnlocked, enabled, cancelPending, scheduleNext]);

    return (
        <button
            type="button"
            id="auto-scroll-toggle"
            onClick={() => setEnabled((prev) => !prev)}
            className={`fixed bottom-5 left-5 z-40 w-9 h-9 rounded-full border border-[#E3BDB0]/60 flex items-center justify-center transition-all duration-500 shadow-md cursor-pointer ${
                !isUnlocked
                    ? "opacity-0 pointer-events-none scale-90"
                    : "opacity-100 scale-100"
            } ${
                enabled
                    ? "bg-[#9F4B31] text-[#FFFDFB] shadow-lg"
                    : "bg-[#9F4B31]/95 hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] hover:scale-105"
            }`}
            aria-label={
                enabled ? "Disable auto-scroll" : "Enable auto-scroll"
            }
            title={enabled ? "Auto-scroll ON — tap to pause" : "Auto-scroll OFF — tap to resume"}
        >
            {enabled ? (
                <Pause className="w-4 h-4 text-[#FFFDFB]" />
            ) : (
                <Play className="w-4 h-4 text-[#FFFDFB]/90" />
            )}
        </button>
    );
};
