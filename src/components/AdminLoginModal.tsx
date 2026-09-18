import React, { useState } from 'react';
import { ShieldCheck, Lock, User, X, AlertCircle, LogOut, CheckCircle2, KeyRound } from 'lucide-react';
import { Language, AdminCredentials } from '../types';
import { translations } from '../data/translations';
import { triggerHaptic, triggerHapticSuccess } from '../utils/telegram';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminAuthenticated: boolean;
  adminCredentials: AdminCredentials;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onUpdateCredentials: (newCreds: AdminCredentials) => void;
  language: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  isAdminAuthenticated,
  adminCredentials,
  onLoginSuccess,
  onLogout,
  onUpdateCredentials,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      username.trim() === adminCredentials.username &&
      password.trim() === adminCredentials.passwordHash
    ) {
      triggerHapticSuccess();
      onLoginSuccess();
      setUsername('');
      setPassword('');
      onClose();
    } else {
      triggerHaptic('heavy');
      setErrorMessage(t.invalidCredentials);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    triggerHapticSuccess();
    onUpdateCredentials({
      ...adminCredentials,
      passwordHash: newPassword.trim(),
    });
    setShowPasswordChange(false);
    setNewPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-neutral-950 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gold-gradient">
              {t.adminLoginTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAdminAuthenticated ? (
          /* Admin is already authenticated */
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-emerald-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {t.adminLoggedInBadge}
                  </span>
                  <p className="text-xs text-neutral-300 mt-1">
                    {t.connectedAs}: <strong className="text-amber-300">{adminCredentials.username}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Option to change password */}
            {showPasswordChange ? (
              <form onSubmit={handleUpdatePassword} className="space-y-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <label className="block text-xs font-bold text-amber-300">
                  {t.adminPassword} (الجديدة)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full bg-neutral-950 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>تغيير كلمة مرور المشرف</span>
              </button>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-700"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onLogout();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs sm:text-sm font-bold border border-rose-500/40"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.adminLogoutBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Admin Login Form */
          <div className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed">
              {t.adminLoginDesc}
            </p>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  👤 {t.adminUsername}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.adminUsername}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🔒 {t.adminPassword}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/50 shadow-md hover:brightness-110"
                >
                  {t.adminLoginBtn}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
