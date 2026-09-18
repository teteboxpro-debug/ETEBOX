import React from 'react';
import { Instagram, MessageCircle, Video, ExternalLink, Share2 } from 'lucide-react';
import { AppConfig, Language } from '../types';
import { translations } from '../data/translations';
import { openExternalUrl, triggerHaptic } from '../utils/telegram';

interface SocialMediaSectionProps {
  language: Language;
  config: AppConfig;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  language,
  config,
}) => {
  const t = translations[language];

  const handleOpenSocial = (url: string) => {
    triggerHaptic('medium');
    openExternalUrl(url);
  };

  return (
    <section
      id="social-media-section"
      aria-labelledby="social-media-title"
      className="w-full rounded-2xl bg-neutral-900/80 border border-amber-500/25 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4 transition-all"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/20 to-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3
              id="social-media-title"
              className="text-sm sm:text-base font-black text-gold-gradient tracking-wide"
            >
              {t.socialMediaTitle}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {t.socialMediaDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Buttons Grid: TikTok, Instagram, WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* 1. TikTok Button */}
        <button
          id="btn-social-tiktok"
          type="button"
          onClick={() => handleOpenSocial(config.tiktokUrl || 'https://www.tiktok.com')}
          className="group relative flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 hover:border-cyan-400/60 hover:bg-neutral-900 transition-all duration-200 cursor-pointer shadow-md hover:shadow-cyan-500/10 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 group-hover:border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:text-cyan-200 transition-colors flex-shrink-0 shadow-inner">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-start min-w-0">
              <span className="block text-xs font-black text-neutral-100 group-hover:text-cyan-300 transition-colors truncate">
                {t.tiktok}
              </span>
              <span className="block text-[10px] text-neutral-400 truncate">
                {t.tiktokDesc}
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-300 transition-colors flex-shrink-0 ms-2" />
        </button>

        {/* 2. Instagram Button */}
        <button
          id="btn-social-instagram"
          type="button"
          onClick={() => handleOpenSocial(config.instagramUrl || 'https://www.instagram.com')}
          className="group relative flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 hover:border-pink-500/60 hover:bg-neutral-900 transition-all duration-200 cursor-pointer shadow-md hover:shadow-pink-500/10 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 group-hover:border-pink-500/50 flex items-center justify-center text-pink-400 group-hover:text-pink-300 transition-colors flex-shrink-0 shadow-inner">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="text-start min-w-0">
              <span className="block text-xs font-black text-neutral-100 group-hover:text-pink-300 transition-colors truncate">
                {t.instagram}
              </span>
              <span className="block text-[10px] text-neutral-400 truncate">
                {t.instagramDesc}
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-pink-300 transition-colors flex-shrink-0 ms-2" />
        </button>

        {/* 3. WhatsApp Button */}
        <button
          id="btn-social-whatsapp"
          type="button"
          onClick={() => handleOpenSocial(config.whatsappUrl || 'https://wa.me')}
          className="group relative flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-900 transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-500/10 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 group-hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors flex-shrink-0 shadow-inner">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-start min-w-0">
              <span className="block text-xs font-black text-neutral-100 group-hover:text-emerald-300 transition-colors truncate">
                {t.whatsapp}
              </span>
              <span className="block text-[10px] text-neutral-400 truncate">
                {t.whatsappDesc}
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-300 transition-colors flex-shrink-0 ms-2" />
        </button>
      </div>
    </section>
  );
};
