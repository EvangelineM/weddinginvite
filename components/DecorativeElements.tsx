'use client';

import React, { useMemo } from 'react';

export const FallingPetals: React.FC = () => {
  // Generate subtle rustic petals for romantic atmosphere
  const petals = useMemo(() => {
    const rusticColors = ['#E3BDB0', '#D28B77', '#BD8167', '#9F4B31'];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + 4) % 94}%`,
      delay: `${(i * 1.8) % 12}s`,
      duration: `${14 + (i % 6) * 2.5}s`,
      size: 9 + (i % 4) * 3,
      opacity: 0.32 + (i % 3) * 0.14,
      color: rusticColors[i % rusticColors.length],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p) => (
        <div
          key={p.id}
          className="falling-petal"
          style={{
            left: p.left,
            top: '-20px',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 20 26"
            style={{ opacity: p.opacity }}
          >
            <path
              d="M10 0 C18 5, 20 16, 10 26 C0 16, 2 5, 10 0 Z"
              fill={p.color}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const GoldSparkle: React.FC<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: number;
  delay?: string;
}> = ({ top, left, right, bottom, size = 14, delay = '0s' }) => {
  return (
    <div
      className="absolute pointer-events-none animate-sparkle z-20"
      style={{
        top,
        left,
        right,
        bottom,
        animationDelay: delay,
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#BD8167"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" opacity="0.75" />
        <circle cx="12" cy="12" r="1.5" fill="#E3BDB0" />
      </svg>
    </div>
  );
};

export const LuxuryDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-4 ${className}`} aria-hidden="true">
      <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#BD8167]/50" />
      <div className="mx-2 flex items-center space-x-1.5">
        <span className="w-1 h-1 rounded-full bg-[#D28B77]" />
        <span className="w-1.5 h-1.5 rotate-45 border border-[#9F4B31]/80 bg-[#FAF7F5]" />
        <span className="w-1 h-1 rounded-full bg-[#D28B77]" />
      </div>
      <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#BD8167]/50" />
    </div>
  );
};

export const VintageCornerBorders: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5" aria-hidden="true">
      <div className="w-full h-full border border-[#E3BDB0]/60 rounded-2xl relative">
        {/* Top Left Corner Flourish */}
        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-[#BD8167]/75 rounded-tl-sm" />
        {/* Top Right Corner Flourish */}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-[#BD8167]/75 rounded-tr-sm" />
        {/* Bottom Left Corner Flourish */}
        <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-[#BD8167]/75 rounded-bl-sm" />
        {/* Bottom Right Corner Flourish */}
        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-[#BD8167]/75 rounded-br-sm" />
      </div>
    </div>
  );
};
