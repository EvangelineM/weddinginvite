"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { TranslationContent } from "@/lib/translations";

interface InvitationIntroProps {
    t: TranslationContent;
    onOpenComplete: () => void;
    onHeroRevealStart?: () => void;
}

const LOCAL_VIDEO_URL = "/videos/envelope_opening.mp4";
const CLOUDINARY_VIDEO_URL =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1790957357/White_envelope_opening_with_light_20260930025419.mp4";
const POSTER_IMAGE_URL = "/videos/envelope_poster.jpg";

export const InvitationIntro: React.FC<InvitationIntroProps> = ({
    t,
    onOpenComplete,
    onHeroRevealStart,
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const hasTriggeredHeroRevealRef = useRef(false);
    const hasCompletedRef = useRef(false);
    const hasStartedAudioFadeRef = useRef(false);
    const fadeIntervalRef = useRef<number | null>(null);

    // Smooth audio fade out helper
    const fadeOutAudio = useCallback(
        (video: HTMLVideoElement, durationMs: number = 1800) => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

            const initialVolume = video.volume;
            const startTime = performance.now();

            const updateVolume = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / durationMs, 1);
                // Smooth ease-out audio curve
                video.volume = Math.max(0, initialVolume * (1 - progress));

                if (progress < 1) {
                    requestAnimationFrame(updateVolume);
                } else {
                    video.volume = 0;
                }
            };

            requestAnimationFrame(updateVolume);
        },
        [],
    );

    // Trigger hero section emergence as the light bursts in the video (~8.0s - 8.4s)
    const triggerHeroReveal = useCallback(() => {
        if (!hasTriggeredHeroRevealRef.current) {
            hasTriggeredHeroRevealRef.current = true;
            onHeroRevealStart?.();
        }
    }, [onHeroRevealStart]);

    // Complete the transition and unveil the hero section with smooth fading
    const handleComplete = useCallback(() => {
        if (hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        triggerHeroReveal();
        setIsFadingOut(true);

        const video = videoRef.current;
        if (video && !hasStartedAudioFadeRef.current) {
            hasStartedAudioFadeRef.current = true;
            fadeOutAudio(video, 1400);
        }

        window.setTimeout(() => {
            setIsRevealed(true);
            onOpenComplete();
        }, 1100);
    }, [triggerHeroReveal, onOpenComplete, fadeOutAudio]);

    // Handle tap on the seal or anywhere on the envelope
    const handleEnvelopeTap = () => {
        if (isPlaying || hasCompletedRef.current) return;
        setIsPlaying(true);

        if ("vibrate" in navigator) {
            try {
                navigator.vibrate(40);
            } catch {
                /* Vibration is optional */
            }
        }

        const video = videoRef.current;
        if (!video) return;

        // Try unmuted audio first since user tapped; fallback to muted if browser blocks unmuted audio
        video.muted = false;
        video.volume = 1.0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.warn(
                    "Playback with audio prevented by browser, retrying muted:",
                    err,
                );
                video.muted = true;
                video.play().catch((playErr) => {
                    console.error("Muted playback error:", playErr);
                });
            });
        }
    };

    // Monitor playback time to trigger hero emergence and smooth audio/visual crossfade
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const duration = video.duration;
        const currentTime = video.currentTime;

        // Start fading audio ~2.2s before the end (or at 8.0s)
        if (Number.isFinite(duration) && duration > 0) {
            const timeLeft = duration - currentTime;
            if (timeLeft <= 2.2 && !hasStartedAudioFadeRef.current) {
                hasStartedAudioFadeRef.current = true;
                fadeOutAudio(video, 2000);
            }
            if (timeLeft <= 1.4 && !hasCompletedRef.current) {
                handleComplete();
            }
        } else if (currentTime >= 8.2 && !hasStartedAudioFadeRef.current) {
            hasStartedAudioFadeRef.current = true;
            fadeOutAudio(video, 2000);
            handleComplete();
        }
    };

    // When video finishes, smoothly finish the reveal without looping
    const handleVideoEnded = () => {
        handleComplete();
    };

    if (isRevealed) return null;

    return (
        <div
            id="invitation-sealed-overlay"
            onClick={handleEnvelopeTap}
            className={`fixed inset-0 z-50 flex h-screen h-svh h-dvh w-full cursor-pointer items-center justify-center overflow-hidden select-none transition-opacity duration-1100 ease-out ${
                isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Sealed Wedding Invitation - Click anywhere to open"
        >
            {/* Ambient background wash */}
            <div className="absolute inset-0 -z-10 overflow-hidden bg-[#241712]">
                <div className="absolute inset-0 opacity-40 scale-110 filter blur-3xl">
                    <Image
                        src={POSTER_IMAGE_URL}
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-[#1c110c]/70" />
            </div>

            {/* Main Envelope Stage: Clean, fills screen height */}
            <div
                className="invitation-envelope-stage relative cursor-pointer overflow-hidden transition-transform duration-300 active:scale-[0.995]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleEnvelopeTap();
                    }
                }}
                aria-label="Wedding Envelope - Click to open"
            >
                {/* Envelope Opening Video (does not loop) */}
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    preload="auto"
                    loop={false}
                    poster={POSTER_IMAGE_URL}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    className="h-full w-full object-cover pointer-events-none"
                >
                    <source src={LOCAL_VIDEO_URL} type="video/mp4" />
                    <source src={CLOUDINARY_VIDEO_URL} type="video/mp4" />
                </video>

                {/* Text prompt only visible before tap: Pure clean typography without lines, boxes, or circles */}
                {!isPlaying && (
                    <p className="absolute bottom-[7%] left-1/2 -translate-x-1/2 z-20 whitespace-nowrap font-serif text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#fff5e9]/90 drop-shadow-md pointer-events-none transition-opacity duration-300">
                        {t.envelope.clickToOpen}
                    </p>
                )}
            </div>

            {/* Radiant golden transition wash during hero handoff */}
            <div
                className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-1000 ease-in-out ${
                    isFadingOut
                        ? "opacity-100 bg-[#FAF7F5]/80 backdrop-blur-[3px]"
                        : "opacity-0"
                }`}
                aria-hidden="true"
            />
        </div>
    );
};
