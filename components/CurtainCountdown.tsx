'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TranslationContent } from '@/lib/translations';
import { GoldSparkle, LuxuryDivider } from './DecorativeElements';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface CurtainCountdownProps {
  t: TranslationContent;
}

export const CurtainCountdown: React.FC<CurtainCountdownProps> = ({ t }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);

  // Dynamic countdown calculations
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // Calculate live countdown to 16 November 2026, 19:00:00 local time
  useEffect(() => {
    const targetDate = new Date('2026-11-16T19:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger for theatrical curtain reveal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const leftCurtain = leftCurtainRef.current;
    const rightCurtain = rightCurtainRef.current;
    const centerContent = centerContentRef.current;

    if (!container || !leftCurtain || !rightCurtain || !centerContent) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(leftCurtain, { xPercent: -85 });
      gsap.set(rightCurtain, { xPercent: 85 });
      gsap.set(centerContent, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: 1.2,
      },
    });

    // Curtains start closed at center and smoothly glide apart as user scrolls
    tl.fromTo(
      leftCurtain,
      { xPercent: 0 },
      { xPercent: -85, ease: 'power2.inOut' },
      0
    )
      .fromTo(
        rightCurtain,
        { xPercent: 0 },
        { xPercent: 85, ease: 'power2.inOut' },
        0
      )
      .fromTo(
        centerContent,
        { opacity: 0.2, scale: 0.95 },
        { opacity: 1, scale: 1, ease: 'power1.out' },
        0
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Format single digits with leading zero
  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <section
      ref={containerRef}
      id="countdown-section"
      className="relative w-full min-h-[130svh] flex flex-col items-center justify-center overflow-hidden px-4 py-20 bg-[#F7F5F0]"
    >
      {/* Decorative Rustic Sparkles */}
      <GoldSparkle top="15%" left="15%" size={14} delay="0.9s" />
      <GoldSparkle top="25%" right="18%" size={16} delay="1.5s" />
      <GoldSparkle bottom="18%" right="15%" size={12} delay="2.3s" />

      {/* The Central Content revealed behind the curtains */}
      <div
        ref={centerContentRef}
        className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4"
      >
        {/* Section Heading: Countdown */}
        <h2 className="font-serif italic text-4xl sm:text-6xl text-[#9F4B31] font-normal tracking-wide">
          {t.countdown.title}
        </h2>

        {/* Subtitle: Until 16 November 2026 */}
        <p className="font-serif italic text-base sm:text-xl text-[#6B473C] mt-2 mb-6">
          {t.countdown.subtitlePrefix} <span className="text-[#BD8167] font-medium">{t.countdown.targetDate}</span>
        </p>

        <LuxuryDivider className="my-2 w-44" />

        {/* Live Countdown Display */}
        {timeLeft.isPast ? (
          <div className="my-8 px-8 py-5 bg-[#FFFDFB] border border-[#E3BDB0] rounded-2xl shadow-xs">
            <p className="font-serif italic text-3xl sm:text-4xl text-[#9F4B31]">
              {t.countdown.dayIsHere}
            </p>
          </div>
        ) : (
          <div className="w-full my-8 flex items-center justify-center space-x-3 sm:space-x-8">
            
            {/* Days */}
            <div className="flex flex-col items-center min-w-[70px] sm:min-w-[95px]">
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#9F4B31] tracking-tight">
                {timeLeft.days}
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F6E64] font-medium mt-1">
                {t.countdown.days}
              </span>
            </div>

            <span className="font-serif text-3xl sm:text-4xl text-[#D28B77] -mt-6 font-light">·</span>

            {/* Hours */}
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[85px]">
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#9F4B31] tracking-tight">
                {pad(timeLeft.hours)}
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F6E64] font-medium mt-1">
                {t.countdown.hours}
              </span>
            </div>

            <span className="font-serif text-3xl sm:text-4xl text-[#D28B77] -mt-6 font-light">·</span>

            {/* Minutes */}
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[85px]">
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#9F4B31] tracking-tight">
                {pad(timeLeft.minutes)}
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F6E64] font-medium mt-1">
                {t.countdown.minutes}
              </span>
            </div>

            <span className="font-serif text-3xl sm:text-4xl text-[#D28B77] -mt-6 font-light">·</span>

            {/* Seconds */}
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[85px]">
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#9F4B31] tracking-tight">
                {pad(timeLeft.seconds)}
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F6E64] font-medium mt-1">
                {t.countdown.seconds}
              </span>
            </div>

          </div>
        )}

        {/* Vintage Hand Fan Illustration at the bottom of countdown section */}
        <div className="relative w-64 h-40 sm:w-80 sm:h-52 mt-6 select-none opacity-95 hover:scale-105 transition-transform duration-500">
          <Image
            src="/images/hand-fan.jpg"
            alt="Antique French Rococo Hand Fan"
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-contain"
          />
        </div>
      </div>

      {/* FULL-SCREEN LEFT THEATRICAL CURTAIN */}
      <div
        ref={leftCurtainRef}
        className="absolute top-0 bottom-0 left-0 w-[52vw] z-20 pointer-events-none overflow-hidden"
        style={{
          boxShadow: '12px 0 40px rgba(159, 75, 49, 0.20)',
        }}
      >
        <div className="relative w-full h-full bg-[#E3BDB0]">
          <Image
            src="/images/curtains.jpg"
            alt="Theatre curtain left"
            fill
            sizes="52vw"
            className="object-cover object-left"
          />
          {/* Subtle warm rustic lighting overlay harmonizing curtain tones */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 70% 40%, rgba(227, 189, 176, 0.18) 0%, rgba(189, 129, 103, 0.12) 50%, rgba(159, 75, 49, 0.12) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
          {/* Subtle warm clay ribbon trim */}
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-r from-[#BC8167] via-[#D18B76] to-[#BC8167] opacity-80" />
        </div>
      </div>

      {/* FULL-SCREEN RIGHT THEATRICAL CURTAIN */}
      <div
        ref={rightCurtainRef}
        className="absolute top-0 bottom-0 right-0 w-[52vw] z-20 pointer-events-none overflow-hidden"
        style={{
          boxShadow: '-12px 0 40px rgba(159, 75, 49, 0.20)',
        }}
      >
        <div className="relative w-full h-full bg-[#E3BDB0]">
          <Image
            src="/images/curtains.jpg"
            alt="Theatre curtain right"
            fill
            sizes="52vw"
            className="object-cover object-right"
          />
          {/* Subtle warm rustic lighting overlay harmonizing curtain tones */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 40%, rgba(227, 189, 176, 0.18) 0%, rgba(189, 129, 103, 0.12) 50%, rgba(159, 75, 49, 0.12) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
          {/* Subtle warm clay ribbon trim */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-l from-[#BD8167] via-[#D28B77] to-[#BD8167] opacity-80" />
        </div>
      </div>

    </section>
  );
};
