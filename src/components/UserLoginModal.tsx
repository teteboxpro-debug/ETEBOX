import React, { useState, useEffect } from 'react';
import { Send, User, X, Check, ExternalLink, Bot, LogOut, AlertCircle, Sparkles } from 'lucide-react';
import { Language, TelegramUser } from '../types';
import { translations } from '../data/translations';
import { getTelegramWebAppUser, triggerHaptic, triggerHapticSuccess, openExternalUrl } from '../utils/telegram';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TelegramUser | null;
  onLogin: (username: string, firstName?: string) => void;
  onLogout: () => void;
  language: Language;
  botUrl: string;
  registrationPromptReason?: 'free_channel' | 'new_links' | 'general' | null;
  onPendingSuccessAction?: (() => void) | null;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  language,
  botUrl,
  registrationPromptReason = null,
  onPendingSuccessAction = null,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [inputUsername, setInputUsername] = useState('');
  const [detectedUser, setDetectedUser] = useState<{ username?: string; firstName?: string } | null>(null);

  useEffect(() => {
    const tgUser = getTelegramWebAppUser();
    if (tgUser && tgUser.username) {
      setDetectedUser(tgUser);
      if (!currentUser) {
        setInputUsername(tgUser.username);
      }
    }
  }, [currentUser]);

  const handleCompleteLogin = (usernameVal: string, firstNameVal?: string) => {
    let cleanName = usernameVal.trim();
    if (!cleanName) return;
    if (!cleanName.startsWith('@')) {
      cleanName = `@${cleanName}`;
    }

    triggerHapticSuccess();
    onLogin(cleanName, firstNameVal);
    onClose();

    if (onPendingSuccessAction) {
      setTimeout(() => {
        onPendingSuccessAction();
      }, 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCompleteLogin(inputUsername, detectedUser?.firstName);
  };

  const handleUseDetected = () => {
    if (detectedUser?.username) {
      handleCompleteLogin(detectedUser.username, detectedUser.firstName);
    }
  };

  const isTriggeredByButton = registrationPromptReason === 'free_channel' || registrationPromptReason === 'new_links';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-neutral-950 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Send className="w-4 h-4 -rotate-45" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gold-gradient">
              {isTriggeredByButton
                ? t.registrationRequiredPromptTitle
                : t.userLogin}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser?.isAuthed ? (
          /* User is already connected */
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-amber-300 font-bold text-lg">
                    {currentUser.username.slice(1, 2).toUpperCase() || 'U'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-neutral-400">{t.connectedAs}:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {t.userConnected}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-amber-200 mt-0.5 font-mono">
                    {currentUser.username}
                  </h4>
                  {currentUser.firstName && (
                    <p className="text-xs text-neutral-400">{currentUser.firstName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700"
              >
                {t.close}
              </button>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onLogout();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-500/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>
        ) : (
          /* User Login / Registration Form */
          <div className="space-y-4">
            {/* Prominent Banner when triggered by clicking Free Channel or New Links */}
            {isTriggeredByButton && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    {registrationPromptReason === 'free_channel'
                      ? (language === 'ar' ? 'مطلوب للتفعيل: زر القناة المجانية (Free Channel)' : 'Required for: Free Channel Button')
                      : (language === 'ar' ? 'مطلوب للتفعيل: زر الروابط الجديدة (New Links)' : 'Required for: New Links Button')}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {t.registrationRequiredPromptDesc}
                </p>
              </div>
            )}

            {!isTriggeredByButton && (
              <p className="text-xs text-neutral-300 leading-relaxed">
                {t.loginToContinue}
              </p>
            )}

            {/* If auto-detected inside Telegram Mini App */}
            {detectedUser?.username && (
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-sky-300 font-medium">
                    {t.autoDetectedTg}:
                  </div>
                  <div className="font-mono font-bold text-amber-300 text-sm truncate">
                    {detectedUser.username}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUseDetected}
                  className="px-3 py-1.5 rounded-lg btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 shadow-sm flex-shrink-0"
                >
                  {isTriggeredByButton ? t.activateButtonsBtn : t.userLogin}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  ✈️ {t.telegramUsername}
                </label>
                <div className="relative">
                  <span className="absolute top-2.5 rtl:right-3 ltr:left-3 text-neutral-500 font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={inputUsername.replace(/^@/, '')}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl py-2.5 rtl:pr-8 rtl:pl-3 ltr:pl-8 ltr:pr-3 text-sm text-neutral-100 font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    dir="ltr"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {t.enterTelegramUsername}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/50 shadow-md hover:brightness-110 flex items-center gap-1.5"
                >
                  {isTriggeredByButton ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.activateButtonsBtn}</span>
                    </>
                  ) : (
                    <span>{t.userLogin}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
