import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw, Lock, LogOut, ShieldCheck, Headphones, Instagram, MessageCircle, Video, Share2 } from 'lucide-react';
import { AppConfig, Language } from '../types';
import { translations } from '../data/translations';
import { DEFAULT_APP_CONFIG } from '../data/defaultData';
import { triggerHapticSuccess, triggerHaptic } from '../utils/telegram';

interface AdminConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
  language: Language;
  isAdminAuthenticated: boolean;
  onRequestAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenDashboard?: () => void;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  language,
  isAdminAuthenticated,
  onRequestAdminLogin,
  onAdminLogout,
  onOpenDashboard,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [formData, setFormData] = useState<AppConfig>({ ...config });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...config });
    }
  }, [isOpen, config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticSuccess();
    onSaveConfig(formData);
    onClose();
  };

  const handleReset = () => {
    triggerHaptic('medium');
    setFormData({ ...DEFAULT_APP_CONFIG });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neutral-950 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-gold-gradient">
              {t.adminSettings}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAdminAuthenticated ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-amber-200">
                {t.adminRequiredToModify}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {t.adminLoginDesc}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestAdminLogin();
                }}
                className="px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40"
              >
                {t.adminLoginBtn}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  {t.adminLoggedInBadge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onClose();
                      onOpenDashboard();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                  >
                    <span>{t.openDashboardBtn}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onAdminLogout();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.adminLogoutBtn}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.editUrls}
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              {/* FREE VIDEOS URL */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🎬 1. {t.freeVideos} URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.freeVideosUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, freeVideosUrl: e.target.value })
                  }
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              {/* VIP STORE URL */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  💎 2. {t.vipStore} URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.vipStoreUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, vipStoreUrl: e.target.value })
                  }
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              {/* STORAGE URL */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  ☁️ 3. {t.storage} URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.storageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, storageUrl: e.target.value })
                  }
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              {/* Telegram Bot URL */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🤖 Telegram Bot / TelebotCreator
                </label>
                <input
                  type="url"
                  required
                  value={formData.botUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, botUrl: e.target.value })
                  }
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              {/* Telegram Support Team Account */}
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <label className="block text-xs font-bold text-amber-300">
                    {t.telegramSupportAccountLabel}
                  </label>
                </div>
                <input
                  type="text"
                  required
                  placeholder="@username or https://t.me/username"
                  value={formData.telegramSupportAccount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telegramSupportAccount: e.target.value,
                    })
                  }
                  className="w-full bg-neutral-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
                <p className="text-[11px] text-neutral-400">
                  {t.telegramSupportAccountDesc}
                </p>
              </div>

              {/* Social Media & Contact Section Fields */}
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <div>
                    <label className="block text-xs font-bold text-amber-200">
                      {t.socialMediaConfigTitle}
                    </label>
                    <p className="text-[10px] text-neutral-400">
                      {t.socialMediaConfigDesc}
                    </p>
                  </div>
                </div>

                {/* TikTok */}
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TikTok URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.tiktokUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, tiktokUrl: e.target.value })
                    }
                    placeholder="https://www.tiktok.com/@username"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-cyan-400"
                    dir="ltr"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.instagramUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    placeholder="https://www.instagram.com/username"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-pink-500"
                    dir="ltr"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Link</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsappUrl: e.target.value })
                    }
                    placeholder="https://wa.me/1234567890"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2 border-t border-neutral-800 flex-wrap">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-amber-400 hover:text-amber-300 text-xs font-medium border border-amber-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetDefaults}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-700"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/40 shadow hover:brightness-110"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>{t.save}</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
