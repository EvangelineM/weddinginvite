'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TranslationContent } from '@/lib/translations';
import { GoldSparkle, LuxuryDivider, VintageCornerBorders } from './DecorativeElements';

interface RSVPFormProps {
  t: TranslationContent;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ t }) => {
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!fullName.trim()) {
      setErrorMessage(t.rsvp.validationName);
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage(t.rsvp.validationEmail);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim() || undefined,
          attendance,
          dietary_requirements: dietary.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || t.rsvp.errorMessage);
      }

      // Celebratory luxury confetti effect
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#E3BDB0', '#D28B77', '#BD8167', '#9F4B31', '#FFFDFB'],
        });
      } catch {
        // Safe fallback
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage(t.rsvp.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFullName('');
    setEmail('');
    setDietary('');
    setMessage('');
    setAttendance('attending');
    setErrorMessage(null);
  };

  return (
    <section
      id="rsvp-section"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-4 py-20 bg-[#FAF7F5]"
    >
      {/* Decorative Rustic Sparkles */}
      <GoldSparkle top="10%" left="15%" size={14} delay="0.4s" />
      <GoldSparkle top="26%" right="14%" size={16} delay="1.6s" />
      <GoldSparkle bottom="12%" right="18%" size={12} delay="2.2s" />

      {/* Luxury Stationery RSVP Card */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto py-12 px-6 sm:px-14 stationery-card rounded-3xl border border-[#E3BDB0]/60 flex flex-col">
        <VintageCornerBorders />

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif italic text-4xl sm:text-6xl text-[#9F4B31] font-normal tracking-wide">
            {t.rsvp.title}
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#BD8167] mt-2">
            {t.rsvp.deadline}
          </p>

          <LuxuryDivider className="my-3.5 w-44" />
        </div>

        {/* Success Confirmation State */}
        {isSuccess ? (
          <div className="py-10 text-center flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E3BDB0]/35 flex items-center justify-center text-[#9F4B31] mb-4">
              <CheckCircle2 className="w-10 h-10 text-[#9F4B31]" />
            </div>

            <h3 className="font-serif italic text-3xl sm:text-4xl text-[#9F4B31] font-normal mb-2">
              {t.rsvp.successHeading}
            </h3>

            <p className="font-serif text-[#3D251E]/90 text-lg sm:text-xl mb-6">
              {t.rsvp.successMessage}
            </p>

            <div className="flex items-center justify-center text-[#BD8167] mb-6">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-sans uppercase tracking-[0.25em] text-[#9F4B31] hover:text-[#BD8167] underline underline-offset-4 transition-colors"
            >
              {t.rsvp.sendAnother}
            </button>
          </div>
        ) : (
          /* RSVP Input Form */
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-[#9C3B3E]/10 border border-[#9C3B3E]/30 text-[#9C3B3E] text-xs font-sans text-center">
                {errorMessage}
              </div>
            )}

            {/* Attendance Radio Buttons */}
            <div>
              <label className="block font-sans text-xs sm:text-sm uppercase tracking-wider text-[#3D251E] font-medium mb-2.5">
                {t.rsvp.attendingQuestion} <span className="text-[#9F4B31]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option Yes */}
                <label
                  className={`flex items-center space-x-3 p-3.5 rounded-lg border cursor-pointer min-h-[44px] transition-all ${
                    attendance === 'attending'
                      ? 'border-[#9F4B31] bg-[#E3BDB0]/25 shadow-xs'
                      : 'border-[#E3BDB0] hover:bg-[#FAF7F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="attending"
                    checked={attendance === 'attending'}
                    onChange={() => setAttendance('attending')}
                    className="accent-[#9F4B31] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-sans text-sm sm:text-base text-[#3D251E]">
                    {t.rsvp.yesOption}
                  </span>
                </label>

                {/* Option No */}
                <label
                  className={`flex items-center space-x-3 p-3.5 rounded-lg border cursor-pointer min-h-[44px] transition-all ${
                    attendance === 'declined'
                      ? 'border-[#9F4B31] bg-[#E3BDB0]/25 shadow-xs'
                      : 'border-[#E3BDB0] hover:bg-[#FAF7F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="declined"
                    checked={attendance === 'declined'}
                    onChange={() => setAttendance('declined')}
                    className="accent-[#9F4B31] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-sans text-sm sm:text-base text-[#3D251E]">
                    {t.rsvp.noOption}
                  </span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="rsvp-fullname"
                className="block font-sans text-xs sm:text-sm uppercase tracking-wider text-[#3D251E] font-medium mb-1.5"
              >
                {t.rsvp.nameLabel} <span className="text-[#9F4B31]">*</span>
              </label>
              <input
                id="rsvp-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.rsvp.namePlaceholder}
                className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-[#FFFDFB] border border-[#E3BDB0] text-[#3D251E] font-sans placeholder:text-[#8F6E64]/70 focus:outline-none focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="rsvp-email"
                className="block font-sans text-xs sm:text-sm uppercase tracking-wider text-[#3D251E] font-medium mb-1.5"
              >
                {t.rsvp.emailLabel}
              </label>
              <input
                id="rsvp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.rsvp.emailPlaceholder}
                className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-[#FFFDFB] border border-[#E3BDB0] text-[#3D251E] font-sans placeholder:text-[#8F6E64]/70 focus:outline-none focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Allergies / Dietary */}
            <div>
              <label
                htmlFor="rsvp-dietary"
                className="block font-sans text-xs sm:text-sm uppercase tracking-wider text-[#3D251E] font-medium mb-1.5"
              >
                {t.rsvp.dietaryLabel}
              </label>
              <input
                id="rsvp-dietary"
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder={t.rsvp.dietaryPlaceholder}
                className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-[#FFFDFB] border border-[#E3BDB0] text-[#3D251E] font-sans placeholder:text-[#8F6E64]/70 focus:outline-none focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="rsvp-message"
                className="block font-sans text-xs sm:text-sm uppercase tracking-wider text-[#3D251E] font-medium mb-1.5"
              >
                {t.rsvp.messageLabel}
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.rsvp.messagePlaceholder}
                className="w-full px-4 py-3 rounded-lg bg-[#FFFDFB] border border-[#E3BDB0] text-[#3D251E] font-sans placeholder:text-[#8F6E64]/70 focus:outline-none focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25 transition-all text-sm sm:text-base resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="send-rsvp-btn"
                disabled={isLoading}
                className="w-full min-h-[48px] py-4 px-8 rounded-lg bg-[#9F4B31] hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] font-sans text-xs sm:text-sm uppercase tracking-[0.25em] font-medium shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                <Send className="w-4 h-4 rotate-45 text-[#FFFDFB]" />
                <span>
                  {isLoading ? t.rsvp.submittingButton : t.rsvp.submitButton}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
