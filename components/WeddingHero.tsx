'use client';

import React from 'react';
import Image from 'next/image';
import { Language, TranslationContent } from '@/lib/translations';

/** Native artboard size of the hero illustration (portrait). */
const HERO_W = 682;
const HERO_H = 1024;

/** Reference typography colors sampled from the artwork. */
const TEXT_PRIMARY = '#3B2422';
const TEXT_MUTED = '#5A3628';

const SHARP_TYPE: React.CSSProperties = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'geometricPrecision',
};

interface WeddingHeroProps {
  t: TranslationContent;
  lang: Language;
}

/**
 * Fits the full 682×1024 artboard inside the viewport (contain) so the couple,
 * chapel, and copy stay visible on wide desktops.
 */
function HeroFitStage({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="hero-section"
      className="hero-stage-section relative flex w-full items-start justify-center overflow-hidden bg-[#FAF7F5]"
    >
      <div
        className="hero-artboard relative"
        style={{
          height: 'auto',
          aspectRatio: `${HERO_W} / ${HERO_H}`,
          containerType: 'inline-size',
        }}
      >
        {children}
      </div>
    </section>
  );
}

/** Shared scene — same file for EN and ES. Unoptimized to avoid soft JPEG recompression. */
function HeroBackground() {
  return (
    <Image
      src="/images/hero-reference.jpg"
      alt=""
      fill
      priority
      unoptimized
      sizes="100vw"
      className="object-contain object-top"
    />
  );
}

/**
 * Invitation copy aligned to the reference layout (682×1024).
 * Uses live HTML + ornament PNGs — not hero-text-overlay.png (that asset
 * includes a misaligned duplicate church illustration and causes overlap).
 */
function HeroInvitationText({ t, lang }: { t: TranslationContent; lang: Language }) {
  /** Text block sits over the sky on the right, matching the reference column. */
  const textColumn = { left: '46%', right: '2%' };
  const monthLabel = lang === 'EN' ? 'NOVEMBER' : 'NOVIEMBRE';

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none select-none" style={SHARP_TYPE}>
      <div className="absolute text-center" style={{ top: '6.8%', ...textColumn }}>
        <p
          className="font-serif italic leading-[1.45]"
          style={{
            fontSize: 'clamp(0.55rem, 1.85cqi, 0.92rem)',
            color: TEXT_PRIMARY,
            letterSpacing: '0.02em',
          }}
        >
          {t.hero.blessingLine1}
          <br />
          {t.hero.blessingLine2}
        </p>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '12.2%', ...textColumn }}
      >
        <Image
          src="/images/ornament-cross.png"
          alt=""
          width={280}
          height={40}
          unoptimized
          className="h-auto w-[clamp(140px,38cqi,280px)]"
        />
      </div>

      <div
        className="absolute flex justify-center"
        style={{ top: '14.8%', left: '38%', right: '0%' }}
      >
        <Image
          src="/images/title-irene.png"
          alt={t.hero.bride}
          width={340}
          height={80}
          unoptimized
          className="h-auto w-[clamp(160px,48cqi,340px)]"
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '22.0%', ...textColumn }}
      >
        <Image
          src="/images/ornament-bride-sprig.png"
          alt=""
          width={120}
          height={24}
          unoptimized
          className="h-auto w-[clamp(48px,12cqi,96px)]"
        />
      </div>

      <p
        className="absolute text-center font-serif italic"
        style={{
          top: '23.8%',
          ...textColumn,
          fontSize: 'clamp(0.48rem, 1.5cqi, 0.78rem)',
          color: TEXT_MUTED,
          letterSpacing: '0.04em',
        }}
      >
        {t.hero.brideParentsLabel}
      </p>

      <p
        className="absolute text-center font-serif font-medium"
        style={{
          top: '25.6%',
          left: '42%',
          right: '0%',
          fontSize: 'clamp(0.45rem, 1.45cqi, 0.75rem)',
          color: TEXT_PRIMARY,
          letterSpacing: '0.03em',
        }}
      >
        {t.hero.brideParents}
      </p>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '28.6%', ...textColumn }}
      >
        <Image
          src="/images/ornament-ampersand.png"
          alt=""
          width={200}
          height={48}
          unoptimized
          className="h-auto w-[clamp(100px,28cqi,200px)]"
        />
      </div>

      <div
        className="absolute flex justify-center"
        style={{ top: '32.8%', left: '36%', right: '0%' }}
      >
        <Image
          src="/images/title-franklin.png"
          alt={t.hero.groom}
          width={380}
          height={80}
          unoptimized
          className="h-auto w-[clamp(170px,52cqi,380px)]"
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '41.2%', ...textColumn }}
      >
        <Image
          src="/images/ornament-groom-sprig.png"
          alt=""
          width={120}
          height={24}
          unoptimized
          className="h-auto w-[clamp(48px,12cqi,96px)]"
        />
      </div>

      <p
        className="absolute text-center font-serif italic"
        style={{
          top: '42.8%',
          ...textColumn,
          fontSize: 'clamp(0.48rem, 1.5cqi, 0.78rem)',
          color: TEXT_MUTED,
          letterSpacing: '0.04em',
        }}
      >
        {t.hero.groomParentsLabel}
      </p>

      <p
        className="absolute text-center font-serif font-medium"
        style={{
          top: '44.5%',
          left: '42%',
          right: '0%',
          fontSize: 'clamp(0.45rem, 1.45cqi, 0.75rem)',
          color: TEXT_PRIMARY,
          letterSpacing: '0.03em',
        }}
      >
        {t.hero.groomParents}
      </p>

      <div className="absolute text-center" style={{ top: '47.0%', left: '43%', right: '1%' }}>
        <p
          className="font-serif italic leading-[1.55]"
          style={{
            fontSize: 'clamp(0.5rem, 1.7cqi, 0.88rem)',
            color: TEXT_PRIMARY,
            letterSpacing: '0.01em',
          }}
        >
          {t.hero.invitationLine1}
          <br />
          {t.hero.invitationLine2}
        </p>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '51.6%', ...textColumn }}
      >
        <Image
          src="/images/ornament-divider.png"
          alt=""
          width={80}
          height={20}
          unoptimized
          className="h-auto w-[clamp(36px,9cqi,72px)]"
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '53.8%', ...textColumn }}
      >
        <div className="flex items-center" style={{ gap: 'clamp(4px, 1.2cqi, 10px)' }}>
          <span
            className="font-serif font-bold"
            style={{
              fontSize: 'clamp(0.85rem, 2.8cqi, 1.6rem)',
              color: TEXT_PRIMARY,
              letterSpacing: '0.05em',
            }}
          >
            16
          </span>
          <span
            className="font-serif font-light opacity-60"
            style={{ fontSize: 'clamp(0.7rem, 2cqi, 1.3rem)', color: TEXT_PRIMARY }}
          >
            |
          </span>
          <span
            className="font-serif font-semibold tracking-widest"
            style={{
              fontSize: 'clamp(0.52rem, 1.6cqi, 0.9rem)',
              color: TEXT_PRIMARY,
              letterSpacing: '0.18em',
            }}
          >
            {monthLabel}
          </span>
          <span
            className="font-serif font-light opacity-60"
            style={{ fontSize: 'clamp(0.7rem, 2cqi, 1.3rem)', color: TEXT_PRIMARY }}
          >
            |
          </span>
          <span
            className="font-serif font-bold"
            style={{
              fontSize: 'clamp(0.85rem, 2.8cqi, 1.6rem)',
              color: TEXT_PRIMARY,
              letterSpacing: '0.05em',
            }}
          >
            2026
          </span>
        </div>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ top: '57.5%', ...textColumn }}
      >
        <Image
          src="/images/ornament-bottom-garland.png"
          alt=""
          width={140}
          height={32}
          unoptimized
          className="h-auto w-[clamp(56px,14cqi,120px)]"
        />
      </div>
    </div>
  );
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({ t, lang }) => {
  return (
    <HeroFitStage>
      {lang === 'EN' ? <HeroBackground /> : <HeroInvitationText t={t} lang={lang} />}
    </HeroFitStage>
  );
};
