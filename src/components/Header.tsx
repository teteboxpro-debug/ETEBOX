import React from 'react';
import { Film, User, ShieldCheck, Lock, Settings, Send } from 'lucide-react';
import { Language, TelegramUser } from '../types';
import { translations } from '../data/translations';
import { triggerHaptic } from '../utils/telegram';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: TelegramUser | null;
  onOpenUserLogin: () => void;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onOpenSettings: () => void;
  onOpenAdminDashboard: () => void;
  currentScreen: 'home' | 'new_links' | 'admin_dashboard';
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onOpenUserLogin,
  isAdminAuthenticated,
  onOpenAdminLogin,
  onOpenSettings,
  onOpenAdminDashboard,
  currentScreen,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/90 border-b border-amber-500/20 px-3 sm:px-4 py-2.5 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 animate-cinematic-header">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-600 to-amber-500 p-[1.5px] shadow-lg shadow-pink-500/20">
            <div className="w-full h-full rounded-[10px] bg-neutral-950 flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-950" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black tracking-wide text-gold-gradient truncate">
              {t.appName}
            </h1>
            <p className="text-[10px] text-amber-300/70 truncate hidden xs:block">
              {t.officialBadge}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* 1. Telegram User Login Button / Active User Badge */}
          {currentUser?.isAuthed ? (
            <button
              id="header-user-profile-btn"
              onClick={() => {
                triggerHaptic('light');
                onOpenUserLogin();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900/80 border border-sky-400/40 text-sky-200 text-xs font-bold transition-colors cursor-pointer max-w-[110px] sm:max-w-[140px] truncate"
              title={currentUser.username}
            >
              <Send className="w-3 h-3 text-sky-400 -rotate-45 flex-shrink-0" />
              <span className="truncate font-mono">{currentUser.username}</span>
            </button>
          ) : (
            <button
              id="header-user-login-btn"
              onClick={() => {
                triggerHaptic('light');
                onOpenUserLogin();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 shadow-sm cursor-pointer hover:brightness-110"
            >
              <Send className="w-3 h-3 text-amber-200 -rotate-45" />
              <span className="hidden sm:inline">{t.userLogin}</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* 2. Admin Status / Login & Dashboard Button */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1">
              <button
                id="header-admin-dashboard-btn"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenAdminDashboard();
                }}
                title={t.adminDashboard}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  currentScreen === 'admin_dashboard'
                    ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/30'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.openDashboardBtn}</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                id="header-admin-settings-gear-btn"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenSettings();
                }}
                title={t.adminSettings}
                className="p-1.5 rounded-lg bg-neutral-900/90 text-amber-400 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="header-admin-login-btn"
              onClick={() => {
                triggerHaptic('light');
                onOpenAdminLogin();
              }}
              title={t.adminLoginTitle}
              className="p-1.5 rounded-lg bg-neutral-900/90 text-neutral-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-400/40 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 3. Language Selector */}
          <div className="flex items-center bg-neutral-900/90 rounded-lg p-0.5 border border-amber-500/25">
            <button
              id="lang-ar"
              onClick={() => {
                triggerHaptic('light');
                onLanguageChange('ar');
              }}
              className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                language === 'ar'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-300'
              }`}
            >
              عربي
            </button>
            <button
              id="lang-en"
              onClick={() => {
                triggerHaptic('light');
                onLanguageChange('en');
              }}
              className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-300'
              }`}
            >
              EN
            </button>
            <button
              id="lang-ru"
              onClick={() => {
                triggerHaptic('light');
                onLanguageChange('ru');
              }}
              className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                language === 'ru'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-300'
              }`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
