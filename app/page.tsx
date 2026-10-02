'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { InvitationIntro } from '@/components/InvitationIntro';
import { LanguageToggle } from '@/components/LanguageToggle';
import { MusicToggle } from '@/components/MusicToggle';
import { FallingPetals } from '@/components/DecorativeElements';
import { WeddingHero } from '@/components/WeddingHero';
import { SaveTheDate } from '@/components/SaveTheDate';
import { Section3 } from '@/components/Section3';
import { WeddingDetails } from '@/components/WeddingDetails';
import { RSVPForm } from '@/components/RSVPForm';
import { FinalPage } from '@/components/FinalPage';

export default function WeddingInvitationPage() {
  const [currentLang, setCurrentLang] = useState<Language>('EN');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isHeroEmerging, setIsHeroEmerging] = useState(false);

  const t = translations[currentLang];

  // Prevent background scrolling while the sealed envelope is visible
  useEffect(() => {
    if (!isUnlocked) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isUnlocked]);

  const handleOpenComplete = () => {
    setIsUnlocked(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F5] text-[#3D251E] paper-grain selection:bg-[#E3BDB0] selection:text-[#9F4B31] overflow-x-hidden">
      
      {/* Initial Sealed Wedding Invitation Overlay: ONLY element visible on initial load */}
      {!isUnlocked && (
        <InvitationIntro
          t={t}
          onOpenComplete={handleOpenComplete}
          onHeroRevealStart={() => setIsHeroEmerging(true)}
        />
      )}

      {/* Interactive UI visible after invitation is opened */}
      {isUnlocked && (
        <>
          {/* Falling rose & blush petals atmospheric layer */}
          <FallingPetals />

          {/* Floating Language Switcher (EN | ES) */}
          <LanguageToggle
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
          />

          {/* Floating Circular Music Toggle Button */}
          <MusicToggle />
        </>
      )}

      {/* Main Wedding Invitation Card Flow: Fills entire screen */}
      <main
        className={`relative z-10 w-full min-h-screen bg-[#FAF7F5] transition-opacity duration-700 ${
          isHeroEmerging ? 'hero-emerging' : ''
        } ${
          isUnlocked || isHeroEmerging ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Page 1: Wedding Hero Cover */}
        <WeddingHero t={t} lang={currentLang} isActive={isUnlocked || isHeroEmerging} />

        {/* Page 2: Save the Date scratch reveal */}
        <SaveTheDate />

        {/* Page 3: Formal wedding invitation details */}
        <Section3 />

        {/* Page 4: Welcome / Location */}
        <WeddingDetails t={t} />

        {/* Page 5: Stationery RSVP */}
        <RSVPForm t={t} />

        {/* Page 7: Final Keepsake Back Cover */}
        <FinalPage t={t} />

        {/* Footer Admin Link */}
        <footer className="w-full py-10 px-4 text-center border-t border-[#E3BDB0]/60 bg-[#F5EEE9]/90">
          <p className="font-serif italic text-sm text-[#9F4B31]">
            Irene & Franklin • Château de la Couronne
          </p>
          <div className="mt-2.5">
            <a
              href="/admin/rsvps"
              className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8F6E64] hover:text-[#9F4B31] transition-colors"
            >
              Guestlist Portal
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
