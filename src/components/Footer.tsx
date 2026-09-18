import React from 'react';
import { Language } from '../types';
import { openExternalUrl, triggerHaptic } from '../utils/telegram';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
  supportAccount: string;
}

export const Footer: React.FC<FooterProps> = ({ language, supportAccount }) => {
  const t = translations[language];

  const getTargetSupportUrl = () => {
    const raw = (supportAccount || '').trim();
    if (!raw) return 'https://t.me/';
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    const cleanUsername = raw.replace(/^@/, '');
    return `https://t.me/${cleanUsername}`;
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic('light');
    const url = getTargetSupportUrl();
    openExternalUrl(url);
  };

  return (
    <footer className="w-full mt-8 pt-6 pb-8 border-t border-amber-500/20 text-center text-xs">
      <a
        id="telegram-support-team-link"
        href={getTargetSupportUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleSupportClick}
        className="inline-flex items-center justify-center text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer py-1.5 px-4 rounded-xl hover:bg-neutral-900/80 border border-transparent hover:border-amber-500/30"
      >
        {t.telegramSupportTeam || '[Telegram Support Team]'}
      </a>
    </footer>
  );
};
