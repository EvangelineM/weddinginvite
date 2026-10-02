'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoPlayed = useRef(false);

  // Gentle fallback Web Audio synthesizer playing romantic harp notes
  const startSynthMelody = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!synthCtxRef.current) {
        synthCtxRef.current = new AudioCtx();
      }

      if (synthCtxRef.current.state === 'suspended') {
        synthCtxRef.current.resume();
      }

      const ctx = synthCtxRef.current;
      const notes = [
        293.66, 369.99, 440.0, 587.33, 440.0, 369.99, // D major
        220.0, 277.18, 329.63, 440.0, 329.63, 277.18, // A major
        246.94, 293.66, 369.99, 493.88, 369.99, 293.66, // B minor
        196.0, 246.94, 293.66, 392.0, 293.66, 246.94, // G major
      ];
      let step = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        const freq = notes[step % notes.length];
        step++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine wave with subtle overtone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Harp-like decay envelope
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
      }, 420);
    } catch (e) {
      console.warn('Web Audio synthesis not available:', e);
    }
  };

  const stopSynthMelody = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthCtxRef.current && synthCtxRef.current.state !== 'closed') {
      synthCtxRef.current.suspend().catch(() => {});
    }
  };

  // Start music — called from a real user gesture context
  const startMusic = async () => {
    let playedAudio = false;
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.7;
        await audioRef.current.play();
        playedAudio = true;
      } catch {
        playedAudio = false;
      }
    }
    if (!playedAudio) {
      startSynthMelody();
    }
    setIsPlaying(true);
  };

  const toggleMusic = async () => {
    if (!isPlaying) {
      await startMusic();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynthMelody();
      setIsPlaying(false);
    }
  };

  // Auto-start music on the FIRST user interaction (click/tap/scroll).
  // This runs inside the browser's trusted user-gesture, so play() won't be blocked.
  useEffect(() => {
    const onFirstInteraction = () => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;

      // Remove all listeners immediately
      document.removeEventListener('click', onFirstInteraction, true);
      document.removeEventListener('touchstart', onFirstInteraction, true);
      document.removeEventListener('scroll', onFirstInteraction, true);
      document.removeEventListener('keydown', onFirstInteraction, true);

      startMusic();
    };

    // Attach listeners in capture phase so we catch any interaction
    document.addEventListener('click', onFirstInteraction, true);
    document.addEventListener('touchstart', onFirstInteraction, true);
    document.addEventListener('scroll', onFirstInteraction, true);
    document.addEventListener('keydown', onFirstInteraction, true);

    return () => {
      document.removeEventListener('click', onFirstInteraction, true);
      document.removeEventListener('touchstart', onFirstInteraction, true);
      document.removeEventListener('scroll', onFirstInteraction, true);
      document.removeEventListener('keydown', onFirstInteraction, true);
      stopSynthMelody();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/wedding.mp3"
        loop
        preload="auto"
      />
      <button
        type="button"
        id="wedding-music-toggle"
        onClick={toggleMusic}
        className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full border border-[#E3BDB0]/60 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
          isPlaying
            ? 'bg-[#9F4B31] text-[#FFFDFB] audio-playing scale-105 shadow-lg'
            : 'bg-[#9F4B31]/95 hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] hover:scale-105'
        }`}
        aria-label={isPlaying ? 'Pause wedding music' : 'Play wedding background music'}
        title={isPlaying ? 'Pause music' : 'Play wedding music'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-[#FFFDFB] animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-[#FFFDFB]/90" />
        )}
      </button>
    </>
  );
};
