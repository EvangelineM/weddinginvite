'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { TranslationContent } from '@/lib/translations';

interface InvitationIntroProps {
  t: TranslationContent;
  onOpenComplete: () => void;
  onHeroRevealStart?: () => void;
}

const LOCAL_VIDEO_URL = '/videos/envelope_opening.mp4';
const CLOUDINARY_VIDEO_URL =
  'https://res.cloudinary.com/jcjsrbvw/video/upload/v1790957357/White_envelope_opening_with_light_20260930025419.mp4';
const POSTER_IMAGE_URL = '/videos/envelope_poster.jpg';

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

  // Trigger hero section emergence as the light bursts in the video (~8.8s - 9.2s)
  const triggerHeroReveal = useCallback(() => {
    if (!hasTriggeredHeroRevealRef.current) {
      hasTriggeredHeroRevealRef.current = true;
      onHeroRevealStart?.();
    }
  }, [onHeroRevealStart]);

  // Complete the transition and unveil the hero section
  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    triggerHeroReveal();
    setIsFadingOut(true);

    window.setTimeout(() => {
      setIsRevealed(true);
      onOpenComplete();
    }, 850);
  }, [triggerHeroReveal, onOpenComplete]);

  // Handle tap on the seal or anywhere on the envelope
  const handleEnvelopeTap = () => {
    if (isPlaying || hasCompletedRef.current) return;
    setIsPlaying(true);

    if ('vibrate' in navigator) {
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
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback with audio prevented by browser, retrying muted:', err);
        video.muted = true;
        video.play().catch((playErr) => {
          console.error('Muted playback error:', playErr);
        });
      });
    }
  };

  // Monitor playback time to trigger hero emergence at the golden light climax
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= 8.8) {
      triggerHeroReveal();
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
      className={`fixed inset-0 z-50 flex h-svh w-full cursor-pointer items-center justify-center overflow-hidden select-none transition-opacity duration-850 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
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

      {/* Main Envelope Stage: Clean, no visible circles or artificial border lines */}
      <div
        className="invitation-envelope-stage relative cursor-pointer overflow-hidden transition-transform duration-300 active:scale-[0.995]"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
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
          className="h-full w-full object-contain pointer-events-none"
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
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-700 ease-in-out ${
          isFadingOut ? 'opacity-100 bg-[#FAF7F5]/70 backdrop-blur-[2px]' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  );
};
