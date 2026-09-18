import React from 'react';
import { Film, Diamond, Cloud, Link2, ExternalLink, ArrowRight, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { Language, AppConfig, TelegramUser } from '../types';
import { translations } from '../data/translations';
import { openExternalUrl, triggerHaptic } from '../utils/telegram';

interface MainButtonsProps {
  language: Language;
  config: AppConfig;
  newLinksCount: number;
  currentUser: TelegramUser | null;
  onOpenNewLinks: () => void;
  onRequestRegistration: (reason: 'free_channel' | 'new_links', onCompleteAction: () => void) => void;
}

export const MainButtons: React.FC<MainButtonsProps> = ({
  language,
  config,
  newLinksCount,
  currentUser,
  onOpenNewLinks,
  onRequestRegistration,
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const isUserRegistered = Boolean(currentUser?.isAuthed);

  const handleOpenFreeVideos = () => {
    if (!isUserRegistered) {
      triggerHaptic('medium');
      onRequestRegistration('free_channel', () => {
        openExternalUrl(config.freeVideosUrl);
      });
      return;
    }
    openExternalUrl(config.freeVideosUrl);
  };

  const handleOpenVipStore = () => {
    openExternalUrl(config.vipStoreUrl);
  };

  const handleOpenStorage = () => {
    openExternalUrl(config.storageUrl);
  };

  const handleOpenNewLinks = () => {
    triggerHaptic('medium');
    if (!isUserRegistered) {
      onRequestRegistration('new_links', () => {
        onOpenNewLinks();
      });
      return;
    }
    onOpenNewLinks();
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. FREE CHANNEL / VIDEOS (Requires Telegram registration prompt first) */}
      <button
        id="btn-free-videos"
        onClick={handleOpenFreeVideos}
        className="w-full group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left rtl:text-right btn-pink-cinema flex items-center justify-between gap-4 border border-amber-400/40 hover:border-amber-300 transition-all duration-200 cursor-pointer"
      >
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-950/40 backdrop-blur-sm border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="film">🎬</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-100 tracking-wide drop-shadow-sm group-hover:text-amber-200">
                {t.freeVideos}
              </h3>
              {/* Registration Status Badge */}
              {isUserRegistered ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-400 text-emerald-300">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'مفعل' : 'Active'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400/60 text-amber-300">
                  <Lock className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'يتطلب التسجيل' : 'Requires Reg'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-pink-100/90 font-medium truncate mt-0.5">
              {t.freeVideosDesc}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-950/30 border border-amber-300/30 flex items-center justify-center text-amber-200 group-hover:bg-neutral-950/50 group-hover:scale-110 transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </button>

      {/* 2. VIP STORE VIDEOS */}
      <button
        id="btn-vip-store"
        onClick={handleOpenVipStore}
        className="w-full group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left rtl:text-right btn-pink-cinema flex items-center justify-between gap-4 border border-amber-400/40 hover:border-amber-300 transition-all duration-200 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-950/40 backdrop-blur-sm border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="diamond">💎</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-100 tracking-wide drop-shadow-sm group-hover:text-amber-200">
                {t.vipStore}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950 shadow-sm">
                VIP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-pink-100/90 font-medium truncate mt-0.5">
              {t.vipStoreDesc}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-950/30 border border-amber-300/30 flex items-center justify-center text-amber-200 group-hover:bg-neutral-950/50 group-hover:scale-110 transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </button>

      {/* 3. STORAGE */}
      <button
        id="btn-storage"
        onClick={handleOpenStorage}
        className="w-full group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left rtl:text-right btn-pink-cinema flex items-center justify-between gap-4 border border-amber-400/40 hover:border-amber-300 transition-all duration-200 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-950/40 backdrop-blur-sm border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="cloud">☁️</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-100 tracking-wide drop-shadow-sm group-hover:text-amber-200">
                {t.storage}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-950/40 border border-amber-300/40 text-amber-300">
                CLOUD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-pink-100/90 font-medium truncate mt-0.5">
              {t.storageDesc}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-950/30 border border-amber-300/30 flex items-center justify-center text-amber-200 group-hover:bg-neutral-950/50 group-hover:scale-110 transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </button>

      {/* 4. NEW LINKS (Requires Telegram registration prompt first) */}
      <button
        id="btn-new-links"
        onClick={handleOpenNewLinks}
        className="w-full group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left rtl:text-right btn-pink-cinema flex items-center justify-between gap-4 border-2 border-amber-400 hover:border-amber-300 transition-all duration-200 cursor-pointer shadow-xl shadow-pink-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-950/40 backdrop-blur-sm border border-amber-300 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="links">🔗</span>
            {newLinksCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] flex items-center justify-center border-2 border-neutral-900 shadow-md">
                {newLinksCount}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-amber-100 tracking-wide drop-shadow-sm group-hover:text-amber-200">
                {t.newLinks}
              </h3>
              {/* Registration Status Badge */}
              {isUserRegistered ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-400 text-emerald-300">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'مفعل' : 'Active'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400/60 text-amber-300">
                  <Lock className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'يتطلب التسجيل' : 'Requires Reg'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-pink-100/90 font-medium truncate mt-0.5">
              {t.newLinksDesc}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-950/30 border border-amber-300 flex items-center justify-center text-amber-300 group-hover:bg-neutral-950/50 group-hover:scale-110 transition-all">
          <ArrowIcon className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};
