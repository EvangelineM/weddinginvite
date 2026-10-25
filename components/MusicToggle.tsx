"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicToggleProps {
    isUnlocked?: boolean;
    autoStart?: boolean;
}

export const MusicToggle: React.FC<MusicToggleProps> = ({
    isUnlocked = true,
    autoStart = false,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const wasPlayingRef = useRef(false);
    const hasStartedRef = useRef(false);

    // Start music playback immediately with zero latency
    const startMusic = useCallback(async () => {
        if (!audioRef.current || hasStartedRef.current) return;
        hasStartedRef.current = true;
        try {
            audioRef.current.volume = 0.2;
            await audioRef.current.play();
            setIsPlaying(true);
        } catch (err) {
            console.warn("Autoplay deferred until user gesture:", err);
            setIsPlaying(true);
            const resumeOnGesture = () => {
                if (audioRef.current) {
                    audioRef.current.play().catch(() => {});
                }
                window.removeEventListener("click", resumeOnGesture);
                window.removeEventListener("touchstart", resumeOnGesture);
                window.removeEventListener("scroll", resumeOnGesture);
            };
            window.addEventListener("click", resumeOnGesture, { once: true });
            window.addEventListener("touchstart", resumeOnGesture, {
                once: true,
            });
            window.addEventListener("scroll", resumeOnGesture, { once: true });
        }
    }, []);

    // Start audio as soon as autoStart (envelope opened) or isUnlocked becomes true
    useEffect(() => {
        if ((autoStart || isUnlocked) && !hasStartedRef.current) {
            startMusic();
        }
    }, [autoStart, isUnlocked, startMusic]);

    const toggleMusic = async () => {
        if (!isPlaying) {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.2;
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (e) {
                    console.error("Resume error:", e);
                }
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
        }
    };

    // Pause audio when browser tab is hidden, resume when visible if it was playing
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                wasPlayingRef.current = isPlaying;
                if (isPlaying && audioRef.current) {
                    audioRef.current.pause();
                }
            } else {
                if (wasPlayingRef.current && audioRef.current) {
                    audioRef.current.play().catch(() => {});
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, [isPlaying]);

    return (
        <>
            <audio
                ref={audioRef}
                src="/music/compressed_audio.mp3"
                loop
                preload="auto"
            />
            <button
                type="button"
                id="wedding-music-toggle"
                onClick={toggleMusic}
                className={`fixed bottom-5 right-5 z-40 w-9 h-9 rounded-full border border-[#E3BDB0]/60 flex items-center justify-center transition-all duration-500 shadow-md cursor-pointer ${
                    !isUnlocked
                        ? "opacity-0 pointer-events-none scale-90"
                        : "opacity-100 scale-100"
                } ${
                    isPlaying
                        ? "bg-[#9F4B31] text-[#FFFDFB] audio-playing shadow-lg"
                        : "bg-[#9F4B31]/95 hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] hover:scale-105"
                }`}
                aria-label={
                    isPlaying
                        ? "Pause wedding music"
                        : "Play wedding background music"
                }
                title={isPlaying ? "Pause music" : "Play wedding music"}
            >
                {isPlaying ? (
                    <Volume2 className="w-4 h-4 text-[#FFFDFB] animate-pulse" />
                ) : (
                    <VolumeX className="w-4 h-4 text-[#FFFDFB]/90" />
                )}
            </button>
        </>
    );
};
