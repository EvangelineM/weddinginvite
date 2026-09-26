'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { TranslationContent } from '@/lib/translations';

interface InvitationIntroProps {
  t: TranslationContent;
  onOpenComplete: () => void;
  onHeroRevealStart?: () => void;
}

// Envelope image native dimensions: 1024 x 577 => ratio ~1.775
const ENV_RATIO = 1024 / 577;

export const InvitationIntro: React.FC<InvitationIntroProps> = ({
  t,
  onOpenComplete,
  onHeroRevealStart,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const containerRef    = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLDivElement>(null);
  const leftFoldRef     = useRef<HTMLDivElement>(null);
  const rightFoldRef    = useRef<HTMLDivElement>(null);
  const bottomFoldRef   = useRef<HTMLDivElement>(null);
  const sealGlowRef     = useRef<HTMLDivElement>(null);
  const sealTravelRef   = useRef<HTMLDivElement>(null);
  const envGlowRef      = useRef<HTMLDivElement>(null);
  const lightBurstRef   = useRef<HTMLDivElement>(null);
  const interiorGlowRef = useRef<HTMLDivElement>(null);
  const sealButtonRef   = useRef<HTMLButtonElement>(null);
  const insideCardRef   = useRef<HTMLDivElement>(null);
  const flapShadowRef   = useRef<HTMLDivElement>(null);
  const promptRef       = useRef<HTMLDivElement>(null);

  /* Idle breathing pulse */
  useEffect(() => {
    if (isOpening || isOpened) return;
    const seal = sealButtonRef.current;
    if (!seal) return;
    const pulse = gsap.to(seal, {
      scale: 1.04, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    return () => { pulse.kill(); };
  }, [isOpening, isOpened]);

  const handleSealClick = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(40); } catch { /* safe */ }
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.to(containerRef.current, {
        opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: () => { setIsOpened(true); onOpenComplete(); },
      });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => { setIsOpened(true); onOpenComplete(); },
    });

    /* Phase 1: a small, feathered highlight travels around the raised seal edge. */
    tl
      .to(sealButtonRef.current, { scale: 0.91, duration: 0.16, ease: 'power2.out' })
      .to(sealTravelRef.current, { opacity: 0.95, duration: 0.35, ease: 'sine.out' }, 0.05)
      .to(sealTravelRef.current, { rotation: 360, duration: 2.55, ease: 'sine.inOut' }, 0.18)
      .to(sealGlowRef.current,   { opacity: 0.96, scale: 1.08, duration: 0.90, ease: 'sine.inOut' }, 1.68)
      .to(sealTravelRef.current, { opacity: 0, duration: 0.38, ease: 'sine.inOut' }, 2.36)
      .to(sealButtonRef.current, { scale: 1.04, duration: 0.40, ease: 'sine.inOut' }, 0.55)
      .to(promptRef.current,     { opacity: 0, y: 8, duration: 0.28, ease: 'power2.in' }, 0.25)

    /* Phase 2: only after the rim completes, carry light to the envelope edges. */
      .to(envGlowRef.current,      { opacity: 0.94, duration: 1.80, ease: 'sine.inOut' }, 2.62)
      .to(sealGlowRef.current,     { opacity: 0, duration: 0.55, ease: 'sine.inOut' }, 2.98)

    /* Phase 3: stop every glow, then open only the top flap. */
      .to(envGlowRef.current,      { opacity: 0, duration: 0.58, ease: 'sine.inOut' }, 4.02)
      .to(sealButtonRef.current,   { yPercent: -90, opacity: 0, duration: 0.62, ease: 'power2.in' }, 4.26)
      .to(envelopeFlapRef.current, { rotateX: -165, duration: 1.70, ease: 'power2.inOut' }, 4.38)
      .to(flapShadowRef.current,   { opacity: 0.42, y: 20, duration: 0.44, ease: 'power2.out' }, 4.38)
      .to(flapShadowRef.current,   { opacity: 0, duration: 0.58, ease: 'power2.in' }, 4.86)

    /* Phase 4: bring the real hero forward behind the still-visible envelope. */
      .call(() => onHeroRevealStart?.(), [], 6.12)
      .to(containerRef.current,    { opacity: 0, duration: 1.10, ease: 'power2.inOut' }, 6.30);
  };

  if (isOpened) return null;

  return (
    <div
      ref={containerRef}
      id="invitation-sealed-overlay"
      className="fixed inset-0 z-50 w-full h-[100svh] overflow-hidden select-none flex items-center justify-center"
      style={{ perspective: '1800px', backgroundColor: '#B5715A' }}
      aria-label="Sealed Wedding Invitation"
    >
      {/*
        ENVELOPE STAGE
        width  = min(100vw,  100vh * ENV_RATIO)
        height = min(100vh,  100vw / ENV_RATIO)
        The full 1024x577 envelope always fits with no crop or overflow.
        The terracotta outer background blends seamlessly.
      */}
      <div
        className="invitation-envelope-stage relative overflow-hidden"
        style={{
          width: '100vw',
          height: '100svh',
        }}
      >
        <div
          className="envelope-artboard relative"
          style={{
            width: 'auto',
            height: '100%',
            aspectRatio: `${ENV_RATIO}`,
          }}
        >

        {/* Inside card revealed after opening */}
        <div
          ref={insideCardRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-[#FAF7F5] pointer-events-none opacity-0"
          style={{ transform: 'scale(0.95)' }}
        >
          <div className="absolute inset-0 paper-grain opacity-60 pointer-events-none" />
          
          <span className="text-[#BD8167] text-xs tracking-widest block mb-1">†</span>

          <p className="font-serif text-[11px] sm:text-xs text-[#BD8167] font-medium mb-2 leading-tight text-center">
            {t.hero.blessingLine1}<br />{t.hero.blessingLine2}
          </p>

          <h1 className="font-serif italic text-4xl sm:text-6xl text-[#9F4B31] leading-none my-0.5">
            {t.hero.bride}
          </h1>
          <div className="text-center my-0.5">
            <span className="font-serif italic text-[11px] sm:text-xs text-[#D28B77] block leading-tight">
              {t.hero.brideParentsLabel}
            </span>
            <span className="font-serif text-xs sm:text-sm text-[#3D251E] font-medium block leading-tight">
              {t.hero.brideParents}
            </span>
          </div>

          <span className="font-serif italic text-2xl sm:text-3xl text-[#BD8167] my-0.5 font-light">
            {t.hero.ampersand}
          </span>

          <h2 className="font-serif italic text-4xl sm:text-6xl text-[#9F4B31] leading-none my-0.5">
            {t.hero.groom}
          </h2>
          <div className="text-center my-0.5">
            <span className="font-serif italic text-[11px] sm:text-xs text-[#D28B77] block leading-tight">
              {t.hero.groomParentsLabel}
            </span>
            <span className="font-serif text-xs sm:text-sm text-[#3D251E] font-medium block leading-tight">
              {t.hero.groomParents}
            </span>
          </div>

          <div className="font-serif italic text-[11px] sm:text-xs text-[#6B473C] my-1.5 leading-relaxed text-center">
            <p>{t.hero.invitationLine1}<br />{t.hero.invitationLine2}</p>
          </div>

          <div className="w-24 h-[1px] bg-[#BD8167]/50 my-2" />

          <p className="font-serif text-xs sm:text-sm tracking-[0.25em] text-[#9F4B31] uppercase font-medium">
            {t.hero.date}
          </p>
        </div>

        {/* Flap drop shadow */}
        <div
          ref={flapShadowRef}
          className="absolute inset-x-0 z-[16] pointer-events-none opacity-0"
          style={{
            top: '36%', height: '8rem',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(90,55,35,0.55) 0%, transparent 72%)',
          }}
        />

        {/* BASE envelope image */}
        <div className="absolute inset-0 z-[20] pointer-events-none">
          <Image
            src="/images/envelope-rustic.jpg"
            alt="Rustic Wedding Envelope"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-contain"
          />
        </div>

        {/* FULL-ENVELOPE AMBIENT GLOW on click
            Multi-point radial covering the entire embossed surface:
            flowers, lace, seal. Zero visible hard edges. */}
        <div
          ref={envGlowRef}
          className="absolute inset-0 z-[23] pointer-events-none opacity-0"
          style={{
            background: [
              'radial-gradient(ellipse 24% 34% at 14% 20%, rgba(255,238,161,0.74) 0%, rgba(241,188,92,0.34) 38%, transparent 78%)',
              'radial-gradient(ellipse 24% 34% at 86% 20%, rgba(255,238,161,0.74) 0%, rgba(241,188,92,0.34) 38%, transparent 78%)',
              'radial-gradient(ellipse 20% 44% at 8% 64%, rgba(255,230,145,0.62) 0%, rgba(241,188,92,0.26) 42%, transparent 80%)',
              'radial-gradient(ellipse 20% 44% at 92% 64%, rgba(255,230,145,0.62) 0%, rgba(241,188,92,0.26) 42%, transparent 80%)',
              'radial-gradient(ellipse 38% 20% at 50% 7%, rgba(255,238,161,0.52) 0%, rgba(241,188,92,0.20) 44%, transparent 80%)',
            ].join(', '),
            filter: 'blur(11px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* LEFT FOLD */}
        <div
          ref={leftFoldRef}
          className="absolute inset-0 z-[21] pointer-events-none overflow-hidden"
          style={{ transformOrigin: '0% 50%', clipPath: 'polygon(0% 0%, 15% 0%, 50% 56.5%, 0% 89%)' }}
        >
          <Image src="/images/envelope-rustic.jpg" alt="" fill priority sizes="100vw" className="object-contain" />
        </div>

        {/* RIGHT FOLD */}
        <div
          ref={rightFoldRef}
          className="absolute inset-0 z-[21] pointer-events-none overflow-hidden"
          style={{ transformOrigin: '100% 50%', clipPath: 'polygon(85% 0%, 100% 0%, 100% 89%, 50% 56.5%)' }}
        >
          <Image src="/images/envelope-rustic.jpg" alt="" fill priority sizes="100vw" className="object-contain" />
        </div>

        {/* BOTTOM POCKET */}
        <div
          ref={bottomFoldRef}
          className="absolute inset-0 z-[22] pointer-events-none overflow-hidden"
          style={{ transformOrigin: '50% 100%', clipPath: 'polygon(0% 88.5%, 50% 56%, 100% 88.5%, 100% 100%, 0% 100%)' }}
        >
          <Image src="/images/envelope-rustic.jpg" alt="" fill priority sizes="100vw" className="object-contain" />
        </div>

        {/* TOP FLAP */}
        <div
          ref={envelopeFlapRef}
          className="absolute inset-0 z-[25] pointer-events-none overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 0%',
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 57%)',
          }}
        >
          <Image src="/images/envelope-rustic.jpg" alt="Envelope Flap" fill priority sizes="100vw" className="object-contain" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.12] pointer-events-none" />
        </div>

        {/* SEAL LOCAL GLOW */}
        <div
          ref={sealGlowRef}
          className="absolute z-[28] pointer-events-none opacity-0"
          style={{
            left: '50%', top: '57%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(100px, 14%, 170px)',
            height: 'clamp(100px, 14%, 170px)',
            background:
              'radial-gradient(ellipse, transparent 0%, transparent 38%, rgba(255,245,177,0.34) 46%, rgba(240,200,100,0.92) 58%, rgba(210,155,75,0.44) 74%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />

        {/* A soft highlight point, rotated around the seal without drawing a ring. */}
        <div
          ref={sealTravelRef}
          className="absolute z-[29] pointer-events-none opacity-0"
          style={{
            left: '50%',
            top: '57%',
            width: '7%',
            height: '14%',
            transform: 'translate(-50%, -50%) translateY(-clamp(48px, 8vw, 115px))',
            transformOrigin: '50% clamp(48px, 8vw, 115px)',
            background: 'radial-gradient(ellipse, rgba(255,244,173,0.92) 0%, rgba(240,200,100,0.48) 38%, transparent 78%)',
            filter: 'blur(10px)',
          }}
        />

        {/* INTERACTIVE WAX SEAL centred on the gold I&F seal in the artwork */}
        <div
          className="absolute z-[30] flex flex-col items-center"
          style={{ left: '50%', top: '57%', transform: 'translate(-50%, -50%)' }}
        >
          <button
            ref={sealButtonRef}
            type="button"
            id="open-invitation-seal-btn"
            onClick={handleSealClick}
            disabled={isOpening}
            className="relative rounded-full cursor-pointer outline-none focus:ring-4 focus:ring-[#D28B77]/50 group"
            style={{ width: 'clamp(72px, 14%, 150px)', aspectRatio: '1' }}
            aria-label="Irene and Franklin Gold Wax Seal - Click to open wedding invitation"
            title="Click the seal to open"
          >
          </button>

          <div
            ref={promptRef}
            className="mt-3 text-center pointer-events-none"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFFDFB]/95 backdrop-blur-sm border border-[#E3BDB0] font-sans text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#9F4B31] font-medium shadow-sm">
              {t.envelope.clickToOpen}
            </span>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
};