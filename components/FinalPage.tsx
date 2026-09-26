'use client';

import React from 'react';
import Image from 'next/image';
import { TranslationContent } from '@/lib/translations';
import { GoldSparkle, LuxuryDivider, VintageCornerBorders } from './DecorativeElements';

interface FinalPageProps {
  t: TranslationContent;
}

export const FinalPage: React.FC<FinalPageProps> = ({ t }) => {
  return (
    <section
      id="final-page-section"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-20 bg-[#FAF7F5]"
    >
      {/* Decorative Rustic Sparkles */}
      <GoldSparkle top="14%" left="15%" size={14} delay="0.6s" />
      <GoldSparkle top="28%" right="18%" size={16} delay="1.9s" />
      <GoldSparkle bottom="16%" left="18%" size={12} delay="1.1s" />

      {/* Keepsake Stationery Card */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto py-14 px-6 sm:px-14 stationery-card rounded-3xl border border-[#E3BDB0]/60 flex flex-col items-center">
        <VintageCornerBorders />

        {/* Ornate Cameo Keepsake Frame with Silhouette & Floral Garland */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 mb-6 select-none hover:scale-105 transition-transform duration-700">
          <Image
            src="/images/cameo-frame.jpg"
            alt="Irene & Franklin Antique Cameo Keepsake"
            fill
            sizes="(max-width: 640px) 208px, 256px"
            className="object-contain"
          />
        </div>

        {/* Irene & Franklin */}
        <h2 className="font-serif italic text-4xl sm:text-5xl text-[#9F4B31] font-normal tracking-wide">
          {t.final.names}
        </h2>

        {/* Luxury Rustic Divider */}
        <LuxuryDivider className="my-3.5 w-48" />

        {/* NOVEMBER 16, 2026 */}
        <p className="font-serif text-base sm:text-lg tracking-[0.28em] text-[#BD8167] uppercase font-medium">
          {t.final.date}
        </p>

        {/* Keepsake Sentiment */}
        <p className="font-serif italic text-sm sm:text-base text-[#6B473C] mt-4 max-w-sm">
          {t.final.keepsakeNote}
        </p>

      </div>
    </section>
  );
};
