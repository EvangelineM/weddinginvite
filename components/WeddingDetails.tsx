'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { TranslationContent } from '@/lib/translations';
import { GoldSparkle, LuxuryDivider, VintageCornerBorders } from './DecorativeElements';

interface WeddingDetailsProps {
  t: TranslationContent;
}

export const WeddingDetails: React.FC<WeddingDetailsProps> = ({ t }) => {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Ch%C3%A2teau+de+la+Couronne+Nouvelle-Aquitaine+France';

  return (
    <section
      id="details-section"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-20 bg-[#FAF8F5]"
    >
      {/* Decorative Rustic Sparkles */}
      <GoldSparkle top="8%" left="15%" size={14} delay="0.7s" />
      <GoldSparkle top="22%" right="16%" size={16} delay="2.1s" />
      <GoldSparkle bottom="14%" left="18%" size={12} delay="1.2s" />

      {/* Central Stationery Page Container filling width */}
      <div className="relative z-10 w-full max-w-2xl mx-auto py-12 px-6 sm:px-14 stationery-card rounded-3xl border border-[#E3BDB0]/60 flex flex-col items-center">
        
        {/* Subtle decorative inner corner borders */}
        <VintageCornerBorders />

        {/* Château Vignette Illustration */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-4 select-none hover:scale-105 transition-transform duration-500">
          <Image
            src="/images/chateau-vignette.jpg"
            alt="Château de la Couronne illustration"
            fill
            sizes="(max-width: 640px) 176px, 224px"
            className="object-contain"
          />
        </div>

        {/* Heading: Join Us To Celebrate Our Wedding */}
        <div className="mb-4">
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#9F4B31] leading-tight font-normal">
            {t.welcome.titleLine1}
          </h2>
          <h3 className="font-serif italic text-3xl sm:text-5xl text-[#BD8167] leading-tight font-normal">
            {t.welcome.titleLine2}
          </h3>
        </div>

        {/* Luxury Rustic Divider */}
        <LuxuryDivider className="my-2.5 w-44" />

        {/* Excited Description */}
        <p className="font-serif text-[#3D251E]/90 text-base sm:text-lg leading-relaxed max-w-md mt-2 mb-6">
          {t.welcome.description}
        </p>

        {/* Time & Location Section */}
        <div className="flex flex-col items-center space-y-2 mb-8">
          <h4 className="font-serif italic text-2xl sm:text-3xl text-[#BD8167] font-normal">
            {t.welcome.timeLocationTitle}
          </h4>

          <p className="font-serif text-[#3D251E] text-base sm:text-lg leading-snug max-w-sm">
            {t.welcome.venueLine}
          </p>

          <p className="font-serif italic text-2xl sm:text-3xl text-[#9F4B31] font-medium pt-1">
            {t.welcome.time}
          </p>
        </div>

        {/* Google Maps Button matching exact prompt specification */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="google-maps-btn"
          className="group inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 min-h-[44px] rounded-lg bg-[#9F4B31] hover:bg-[#BD8167] active:bg-[#D28B77] border border-[#9F4B31]/30 text-[#FFFDFB] transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Open location in Google Maps (opens in new tab)"
        >
          <MapPin className="w-4 h-4 text-[#FFFDFB] group-hover:scale-110 transition-transform" />
          <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.22em] font-medium text-[#FFFDFB]">
            {t.welcome.googleMapsButton}
          </span>
        </a>

      </div>
    </section>
  );
};
