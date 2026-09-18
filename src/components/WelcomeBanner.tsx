import React from 'react';
import { Sparkles, Clapperboard } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface WelcomeBannerProps {
  language: Language;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950/90 border border-amber-500/30 p-5 shadow-2xl backdrop-blur-md">
      {/* Decorative top gold line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="flex items-start gap-3.5">
        <div className="flex-shrink-0 mt-0.5 p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-pink-500/20 border border-amber-400/40 text-amber-300">
          <Clapperboard className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/15 border border-amber-500/40 text-amber-300">
              <Sparkles className="w-3 h-3" />
              VIP Cinema Hub
            </span>
            <span className="text-[11px] font-semibold text-pink-400">
              Direct Access
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient tracking-tight">
            {t.welcomeTitle}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            {t.welcomeMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
