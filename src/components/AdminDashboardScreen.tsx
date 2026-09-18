import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Send,
  Trash2,
  Search,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Settings,
  Calendar,
  Clock,
  Activity,
  AlertTriangle,
  TrendingUp,
  Instagram,
  MessageCircle,
  Video,
  Save,
  Share2,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Film,
  Diamond,
  Cloud,
  Bot,
  Headphones,
  Link2,
  Plus,
  Edit3,
  Sparkles,
  X,
  Download,
  Copy,
  Code,
  FileCode,
  FileDown,
} from 'lucide-react';
import { Language, RegisteredUser, DailyActivityRecord, DashboardStats, AppConfig, VideoLink } from '../types';
import { translations } from '../data/translations';
import { DEFAULT_APP_CONFIG } from '../data/defaultData';
import { triggerHaptic, triggerHapticSuccess, openExternalUrl } from '../utils/telegram';
import { generateTpyScript, downloadFile } from '../data/botScript';

interface AdminDashboardScreenProps {
  language: Language;
  registeredUsers: RegisteredUser[];
  dailyActivity: DailyActivityRecord[];
  stats: DashboardStats;
  config: AppConfig;
  links: VideoLink[];
  onAddLink: (link: Omit<VideoLink, 'id'>) => void;
  onUpdateLink: (link: VideoLink) => void;
  onDeleteLink: (id: string) => void;
  onSaveConfig: (newConfig: AppConfig) => void;
  onBack: () => void;
  onDeleteUser: (userId: string) => void;
  onOpenSettings: () => void;
  onAdminLogout: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  language,
  registeredUsers,
  dailyActivity,
  stats,
  config,
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onSaveConfig,
  onBack,
  onDeleteUser,
  onOpenSettings,
  onAdminLogout,
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<RegisteredUser | null>(null);
  const [deleteSuccessNotice, setDeleteSuccessNotice] = useState<string | null>(null);
  const [socialSaveNotice, setSocialSaveNotice] = useState<boolean>(false);
  const [mainSaveNotice, setMainSaveNotice] = useState<boolean>(false);

  // Video Links (NEW LINKS) Management state
  const [videoLinksSearch, setVideoLinksSearch] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDate, setNewLinkDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newLinkIsNew, setNewLinkIsNew] = useState(true);
  const [editingLink, setEditingLink] = useState<VideoLink | null>(null);
  const [linkNotice, setLinkNotice] = useState<string | null>(null);
  const [linkToDeleteId, setLinkToDeleteId] = useState<string | null>(null);

  // Main 3 Buttons & Core Services editable state
  const [mainLinks, setMainLinks] = useState({
    freeVideosUrl: config.freeVideosUrl || '',
    vipStoreUrl: config.vipStoreUrl || '',
    storageUrl: config.storageUrl || '',
    botUrl: config.botUrl || '',
    telegramSupportAccount: config.telegramSupportAccount || '',
  });

  // Social Media editable state
  const [socialLinks, setSocialLinks] = useState({
    tiktokUrl: config.tiktokUrl || '',
    instagramUrl: config.instagramUrl || '',
    whatsappUrl: config.whatsappUrl || '',
  });

  // TPY & Bot Script state
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Synchronize state when config prop updates
  React.useEffect(() => {
    setMainLinks({
      freeVideosUrl: config.freeVideosUrl || '',
      vipStoreUrl: config.vipStoreUrl || '',
      storageUrl: config.storageUrl || '',
      botUrl: config.botUrl || '',
      telegramSupportAccount: config.telegramSupportAccount || '',
    });
    setSocialLinks({
      tiktokUrl: config.tiktokUrl || '',
      instagramUrl: config.instagramUrl || '',
      whatsappUrl: config.whatsappUrl || '',
    });
  }, [config]);

  const handleSaveMainLinks = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticSuccess();
    onSaveConfig({
      ...config,
      freeVideosUrl: mainLinks.freeVideosUrl.trim(),
      vipStoreUrl: mainLinks.vipStoreUrl.trim(),
      storageUrl: mainLinks.storageUrl.trim(),
      botUrl: mainLinks.botUrl.trim(),
      telegramSupportAccount: mainLinks.telegramSupportAccount.trim(),
    });
    setMainSaveNotice(true);
    setTimeout(() => {
      setMainSaveNotice(false);
    }, 4000);
  };

  const handleResetMainLinksDefaults = () => {
    triggerHaptic('medium');
    const resetConfig = {
      freeVideosUrl: DEFAULT_APP_CONFIG.freeVideosUrl,
      vipStoreUrl: DEFAULT_APP_CONFIG.vipStoreUrl,
      storageUrl: DEFAULT_APP_CONFIG.storageUrl,
      botUrl: DEFAULT_APP_CONFIG.botUrl,
      telegramSupportAccount: DEFAULT_APP_CONFIG.telegramSupportAccount || '',
    };
    setMainLinks(resetConfig);
    onSaveConfig({
      ...config,
      ...resetConfig,
    });
    setMainSaveNotice(true);
    setTimeout(() => {
      setMainSaveNotice(false);
    }, 4000);
  };

  const handleSaveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticSuccess();
    onSaveConfig({
      ...config,
      tiktokUrl: socialLinks.tiktokUrl.trim(),
      instagramUrl: socialLinks.instagramUrl.trim(),
      whatsappUrl: socialLinks.whatsappUrl.trim(),
    });
    setSocialSaveNotice(true);
    setTimeout(() => {
      setSocialSaveNotice(false);
    }, 3500);
  };

  // Video Links Management Handlers
  const filteredVideoLinks = useMemo(() => {
    const q = videoLinksSearch.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q)
    );
  }, [links, videoLinksSearch]);

  const handleCreateVideoLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddLink({
      title: newLinkTitle.trim(),
      url: formattedUrl,
      date: newLinkDate.trim() || new Date().toISOString().split('T')[0],
      isNew: newLinkIsNew,
    });

    triggerHapticSuccess();
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLinkForm(false);
    setLinkNotice(t.linkAddedSuccess);
    setTimeout(() => {
      setLinkNotice(null);
    }, 4000);
  };

  const handleSaveEditedLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.title.trim() || !editingLink.url.trim()) return;

    let formattedUrl = editingLink.url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onUpdateLink({
      ...editingLink,
      title: editingLink.title.trim(),
      url: formattedUrl,
    });

    triggerHapticSuccess();
    setEditingLink(null);
    setLinkNotice(t.linkUpdatedSuccess);
    setTimeout(() => {
      setLinkNotice(null);
    }, 4000);
  };

  const handleConfirmDeleteLink = (id: string) => {
    triggerHaptic('heavy');
    onDeleteLink(id);
    setLinkToDeleteId(null);
    setLinkNotice(t.linkDeletedSuccess);
    setTimeout(() => {
      setLinkNotice(null);
    }, 4000);
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registeredUsers;
    return registeredUsers.filter((u) => {
      const matchUser = u.username.toLowerCase().includes(q);
      const matchName = u.firstName ? u.firstName.toLowerCase().includes(q) : false;
      return matchUser || matchName;
    });
  }, [registeredUsers, searchQuery]);

  // Max visits for bar chart scaling
  const maxVisits = useMemo(() => {
    return Math.max(...dailyActivity.map((d) => d.totalVisits), 1);
  }, [dailyActivity]);

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    triggerHapticSuccess();
    const deletedUsername = userToDelete.username;
    onDeleteUser(userToDelete.id);
    setUserToDelete(null);
    setDeleteSuccessNotice(`${t.userDeletedSuccess} (${deletedUsername})`);
    setTimeout(() => {
      setDeleteSuccessNotice(null);
    }, 4000);
  };

  const getActiveScriptContent = () => {
    return generateTpyScript({
      freeVideosUrl: mainLinks.freeVideosUrl,
      vipStoreUrl: mainLinks.vipStoreUrl,
      storageUrl: mainLinks.storageUrl,
      supportUrl: mainLinks.telegramSupportAccount
        ? `https://t.me/${mainLinks.telegramSupportAccount.replace('@', '')}`
        : 'https://t.me/EteboxSupport',
      newestLinkUrl: links[0]?.url || 'https://rentry.co/WELCOME_2026',
    });
  };

  const handleDownloadTpy = () => {
    triggerHaptic('medium');
    const content = getActiveScriptContent();
    downloadFile('telebot_bot.tpy', content);
    triggerHapticSuccess();
    setDownloadNotice(t.tpyDownloadedSuccess);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleDownloadPy = () => {
    triggerHaptic('medium');
    const content = getActiveScriptContent();
    downloadFile('bot.py', content);
    triggerHapticSuccess();
    setDownloadNotice(t.tpyDownloadedSuccess);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleCopyScript = () => {
    triggerHaptic('light');
    const content = getActiveScriptContent();
    navigator.clipboard.writeText(content).then(() => {
      triggerHapticSuccess();
      setCopyNotice(t.tpyCopiedSuccess);
      setTimeout(() => setCopyNotice(null), 4000);
    }).catch(() => {
      // Fallback
      setCopyNotice(t.tpyCopiedSuccess);
      setTimeout(() => setCopyNotice(null), 4000);
    });
  };

  return (
    <div className="w-full space-y-6 animate-cinematic-main pb-10">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            id="admin-dashboard-back-btn"
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:bg-neutral-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.backToHome}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.adminDashboard}</span>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="admin-dashboard-settings-btn"
            onClick={() => {
              triggerHaptic('light');
              onOpenSettings();
            }}
            title={t.adminSettings}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:bg-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.adminSettings}</span>
          </button>

          <button
            id="admin-dashboard-logout-btn"
            onClick={() => {
              triggerHaptic('medium');
              onAdminLogout();
              onBack();
            }}
            title={t.adminLogoutBtn}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 hover:bg-rose-900/80 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden sm:inline">{t.adminLogoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Title & Introduction */}
      <div className="space-y-1 text-center sm:text-start px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.adminLoggedInBadge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gold-gradient tracking-wide">
          {t.adminDashboard}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          {t.adminDashboardDesc}
        </p>
      </div>

      {/* SUCCESS NOTICE */}
      {deleteSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{deleteSuccessNotice}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessNotice(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 TOP DASHBOARD STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Users */}
        <div
          id="stat-total-users"
          className="relative overflow-hidden p-4 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-lg group hover:border-amber-400/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-neutral-400">
              {t.statTotalUsers}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-100 font-mono tracking-tight">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400/80">
            <TrendingUp className="w-3 h-3" />
            <span>{t.userStatusActive}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full pointer-events-none" />
        </div>

        {/* 2. Users Today */}
        <div
          id="stat-users-today"
          className="relative overflow-hidden p-4 rounded-2xl bg-neutral-900/90 border border-pink-500/30 shadow-lg group hover:border-pink-400/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-neutral-400">
              {t.statUsersToday}
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-pink-100 font-mono tracking-tight">
            {stats.usersToday.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-pink-400/80">
            <Activity className="w-3 h-3" />
            <span>{t.dailyVisits}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-pink-500/5 rounded-full pointer-events-none" />
        </div>

        {/* 3. New Users Today */}
        <div
          id="stat-new-users-today"
          className="relative overflow-hidden p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 shadow-lg group hover:border-emerald-400/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-neutral-400">
              {t.statNewUsersToday}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-100 font-mono tracking-tight">
            +{stats.newUsersToday.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400/80">
            <span>{t.newUsersLabel}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full pointer-events-none" />
        </div>

        {/* 4. Total Registered Telegram Accounts */}
        <div
          id="stat-total-telegram-accounts"
          className="relative overflow-hidden p-4 rounded-2xl bg-neutral-900/90 border border-sky-500/30 shadow-lg group hover:border-sky-400/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-neutral-400 truncate">
              {t.statTotalTelegramAccounts}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Send className="w-4 h-4 -rotate-45" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-100 font-mono tracking-tight">
            {stats.totalRegisteredTelegramAccounts.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-sky-400/80">
            <span>Telegram DB</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-sky-500/5 rounded-full pointer-events-none" />
        </div>
      </div>

      {/* DAILY USER ACTIVITY STATISTICS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-200">
                {t.dailyActivityTitle}
              </h3>
              <p className="text-[11px] text-neutral-400">{t.dailyActivityDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-pink-600 to-rose-500" />
              <span>{t.dailyVisits}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span>{t.activeUsersLabel}</span>
            </div>
          </div>
        </div>

        {/* Activity Chart Bars */}
        <div className="pt-2 grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dailyActivity.map((day) => {
            const heightPercent = Math.max(15, Math.round((day.totalVisits / maxVisits) * 100));
            const formattedDay = day.date.slice(5); // MM-DD
            return (
              <div
                key={day.date}
                className="flex flex-col items-center justify-end p-2 rounded-xl bg-neutral-950/70 border border-amber-500/15 group hover:border-amber-400/40 transition-all"
              >
                <div className="text-[10px] text-amber-300/80 font-mono mb-1 font-bold">
                  {day.totalVisits}
                </div>
                <div className="w-full bg-neutral-900 rounded-lg h-24 sm:h-28 flex items-end justify-center p-1 overflow-hidden">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-md bg-gradient-to-t from-pink-600 via-rose-500 to-amber-400 transition-all duration-500 group-hover:brightness-125 flex items-start justify-center pt-1"
                  >
                    {day.newUsersCount > 0 && (
                      <span className="text-[9px] font-black text-neutral-950 bg-amber-200/90 px-1 rounded-full scale-90">
                        +{day.newUsersCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-1.5 font-medium">
                  {formattedDay}
                </div>
                <div className="text-[9px] text-neutral-500 flex items-center gap-0.5">
                  <UserCheck className="w-2.5 h-2.5 text-amber-400" />
                  <span>{day.activeUsernames.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN SERVICES & BUTTONS LINKS MANAGEMENT (Free Channel, VIP Store, Storage) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Link2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-gold-gradient">
                {t.mainLinksConfigTitle}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {t.mainLinksConfigDesc}
              </p>
            </div>
          </div>

          {mainSaveNotice && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-bold shadow-lg animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.mainLinksSavedSuccess}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveMainLinks} className="space-y-4 pt-1">
          {/* 1. FREE CHANNEL / VIDEOS */}
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
                <span className="text-base">🎬</span>
                <span>1. Free Channel / Videos (القناة المجانية) URL</span>
              </label>
              {mainLinks.freeVideosUrl && (
                <button
                  type="button"
                  onClick={() => openExternalUrl(mainLinks.freeVideosUrl)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{t.testLinkBtn}</span>
                </button>
              )}
            </div>
            <input
              type="url"
              required
              value={mainLinks.freeVideosUrl}
              onChange={(e) =>
                setMainLinks((prev) => ({ ...prev, freeVideosUrl: e.target.value }))
              }
              placeholder="https://rentry.co/Teteboxvip"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              dir="ltr"
            />
          </div>

          {/* 2. VIP STORE VIDEOS */}
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
                <span className="text-base">💎</span>
                <span>2. VIP Store Videos (متجر VIP) URL</span>
              </label>
              {mainLinks.vipStoreUrl && (
                <button
                  type="button"
                  onClick={() => openExternalUrl(mainLinks.vipStoreUrl)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{t.testLinkBtn}</span>
                </button>
              )}
            </div>
            <input
              type="url"
              required
              value={mainLinks.vipStoreUrl}
              onChange={(e) =>
                setMainLinks((prev) => ({ ...prev, vipStoreUrl: e.target.value }))
              }
              placeholder="https://rentry.co/VIP2026"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              dir="ltr"
            />
          </div>

          {/* 3. STORAGE */}
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
                <span className="text-base">☁️</span>
                <span>3. Storage (التخزين السحابي) URL</span>
              </label>
              {mainLinks.storageUrl && (
                <button
                  type="button"
                  onClick={() => openExternalUrl(mainLinks.storageUrl)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{t.testLinkBtn}</span>
                </button>
              )}
            </div>
            <input
              type="url"
              required
              value={mainLinks.storageUrl}
              onChange={(e) =>
                setMainLinks((prev) => ({ ...prev, storageUrl: e.target.value }))
              }
              placeholder="https://rentry.co/Cloud_ETEBOX"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              dir="ltr"
            />
          </div>

          {/* 4. Telegram Bot & Support Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Telegram Bot */}
            <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Bot className="w-4 h-4 text-sky-400" />
                <span>Telegram Bot URL</span>
              </label>
              <input
                type="url"
                required
                value={mainLinks.botUrl}
                onChange={(e) =>
                  setMainLinks((prev) => ({ ...prev, botUrl: e.target.value }))
                }
                placeholder="https://telebotcreator.com/bots/66275456"
                className="w-full bg-neutral-900 border border-neutral-700 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
                dir="ltr"
              />
            </div>

            {/* Telegram Support Account */}
            <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>{t.telegramSupportAccountLabel}</span>
              </label>
              <input
                type="text"
                required
                value={mainLinks.telegramSupportAccount}
                onChange={(e) =>
                  setMainLinks((prev) => ({ ...prev, telegramSupportAccount: e.target.value }))
                }
                placeholder="@EteboxSupport"
                className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-3 pt-2 flex-wrap border-t border-neutral-800">
            <button
              id="admin-dashboard-reset-main-links-btn"
              type="button"
              onClick={handleResetMainLinksDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-400 hover:text-amber-200 border border-amber-500/30 text-xs font-bold cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDefaults}</span>
            </button>

            <button
              id="admin-dashboard-save-main-links-btn"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-extrabold border border-amber-300/50 shadow-lg cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{t.saveMainLinksBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* VIDEO LINKS (NEW LINKS) CRUD MANAGEMENT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-2xl space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-gold-gradient">
                  {t.manageVideoLinksTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                  {links.length} {t.allLinksCount}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {t.manageVideoLinksDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-dashboard-toggle-add-link-btn"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setShowAddLinkForm((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/50 shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            >
              {showAddLinkForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddLinkForm ? t.cancel : t.addNewLink}</span>
            </button>
          </div>
        </div>

        {/* Success / Info Notice */}
        {linkNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 text-xs font-bold shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{linkNotice}</span>
          </div>
        )}

        {/* INLINE ADD NEW LINK FORM */}
        {showAddLinkForm && (
          <form
            onSubmit={handleCreateVideoLink}
            className="p-4 rounded-xl bg-neutral-950/90 border border-amber-400/40 space-y-3.5 animate-fade-in shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{t.addNewLink}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddLinkForm(false)}
                className="text-neutral-400 hover:text-neutral-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300">
                  {t.titlePlaceholder}
                </label>
                <input
                  type="text"
                  required
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="e.g. VIP Pack: LUTs & 8K Assets"
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300">
                  {t.urlPlaceholder}
                </label>
                <input
                  type="url"
                  required
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://rentry.co/..."
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono focus:outline-none transition-colors"
                  dir="ltr"
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300">
                  {t.datePlaceholder}
                </label>
                <input
                  type="date"
                  required
                  value={newLinkDate}
                  onChange={(e) => setNewLinkDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none transition-colors"
                />
              </div>

              {/* Mark as NEW */}
              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={newLinkIsNew}
                    onChange={(e) => setNewLinkIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-neutral-900 border-neutral-700"
                  />
                  <span>{t.markAsNew}</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowAddLinkForm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-bold hover:bg-neutral-800"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 shadow cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                {t.save}
              </button>
            </div>
          </form>
        )}

        {/* Links Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-500" />
          <input
            type="text"
            value={videoLinksSearch}
            onChange={(e) => setVideoLinksSearch(e.target.value)}
            placeholder={t.searchUsersPlaceholder.replace('...', '') + ' (الروابط أو العناوين)...'}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl ps-9 pe-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 transition-colors focus:outline-none"
          />
        </div>

        {/* Existing Links List */}
        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {filteredVideoLinks.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-neutral-950/50 border border-neutral-800/80 text-neutral-500 text-xs">
              {t.noUsersFound}
            </div>
          ) : (
            filteredVideoLinks.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-amber-400 text-sm">🔗</span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-100 group-hover:text-amber-300 transition-colors break-words">
                      {item.title}
                    </h4>
                    {item.isNew && (
                      <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-black border border-pink-500/40">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-600" />
                      {item.date}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-mono truncate" dir="ltr">
                    {item.url}
                  </p>
                </div>

                {/* Actions: Test Link, Edit, Delete */}
                <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  {/* Test Link */}
                  <button
                    type="button"
                    onClick={() => openExternalUrl(item.url)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                    title={t.testLinkBtn}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-[11px]">{t.testLinkBtn}</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setEditingLink({ ...item });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs font-semibold cursor-pointer transition-colors"
                    title={t.editLink}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span className="text-[11px]">{t.editLink}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      setLinkToDeleteId(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title={t.deleteLink}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TELEGRAM BOT SCRIPT & TPY FILE DOWNLOAD SECTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <FileCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-gold-gradient">
                  {t.tpyScriptTitle}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  .TPY / .PY
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {t.tpyScriptDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
              Telebot Creator & pyTelegramBotAPI
            </span>
          </div>
        </div>

        {/* Notices */}
        {downloadNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 text-xs font-bold shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {copyNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/90 border border-amber-400/60 text-amber-200 text-xs font-bold shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{copyNotice}</span>
          </div>
        )}

        {/* Explanation & Live Sync Note */}
        <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
          <Bot className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-neutral-300">
            هذا الملف يحتوي على سكربت ربط البوت المحدث تلقائياً بجميع الروابط المعتمدة في لوحة التحكم (زر تشغيل Web App بملء الشاشة، ورابط <b>WELCOME 2026</b>، ومتجر VIP، والقناة المجانية، وسحابة التخزين).
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* 1. Download .tpy */}
          <button
            type="button"
            onClick={handleDownloadTpy}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 shadow-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          >
            <FileDown className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>{t.downloadTpyBtn}</span>
          </button>

          {/* 2. Download .py */}
          <button
            type="button"
            onClick={handleDownloadPy}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-amber-500/40 text-amber-200 text-xs font-bold shadow-lg cursor-pointer hover:border-amber-400 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{t.downloadPyBtn}</span>
          </button>

          {/* 3. Copy Code */}
          <button
            type="button"
            onClick={handleCopyScript}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-400/60 text-neutral-200 text-xs font-bold shadow-lg cursor-pointer active:scale-95 transition-all"
          >
            <Copy className="w-4 h-4 text-neutral-300 flex-shrink-0" />
            <span>{t.copyTpyBtn}</span>
          </button>

          {/* 4. Preview Code */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowScriptModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-400/60 text-neutral-300 text-xs font-bold shadow-lg cursor-pointer active:scale-95 transition-all"
          >
            <Code className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <span>{t.viewScriptBtn}</span>
          </button>
        </div>
      </div>

      {/* SOCIAL MEDIA & CONTACT LINKS MANAGEMENT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-200">
                {t.socialMediaConfigTitle}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {t.socialMediaConfigDesc}
              </p>
            </div>
          </div>

          {socialSaveNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.socialLinksSavedSuccess}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveSocialLinks} className="space-y-3.5 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* TikTok URL Input */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>TikTok URL</span>
              </label>
              <input
                type="url"
                required
                value={socialLinks.tiktokUrl}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, tiktokUrl: e.target.value }))
                }
                placeholder="https://www.tiktok.com/@username"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              />
            </div>

            {/* Instagram URL Input */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram URL</span>
              </label>
              <input
                type="url"
                required
                value={socialLinks.instagramUrl}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, instagramUrl: e.target.value }))
                }
                placeholder="https://www.instagram.com/username"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              />
            </div>

            {/* WhatsApp Link Input */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Link</span>
              </label>
              <input
                type="text"
                required
                value={socialLinks.whatsappUrl}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, whatsappUrl: e.target.value }))
                }
                placeholder="https://wa.me/1234567890"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 font-mono transition-colors focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="admin-dashboard-save-social-links-btn"
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5 text-neutral-950" />
              <span>{t.saveSocialLinksBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* REGISTERED TELEGRAM USERS SECTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Send className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-amber-200">
                  {t.registeredUsersTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-mono font-bold">
                  {filteredUsers.length}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {t.registeredUsersDesc}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchUsersPlaceholder}
              className="w-full bg-neutral-950 border border-amber-500/30 rounded-xl ps-9 pe-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Users List / Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-neutral-950/60 border border-dashed border-neutral-800 text-neutral-400 text-xs sm:text-sm">
            <Send className="w-8 h-8 text-neutral-600 mx-auto mb-2 opacity-50" />
            <p>{t.noUsersFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-amber-500/20">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950 border-b border-amber-500/20 text-neutral-400 text-[11px]">
                  <th className="py-2.5 px-3 text-start font-bold">
                    {t.userTableHeaderUser}
                  </th>
                  <th className="py-2.5 px-3 text-start font-bold hidden sm:table-cell">
                    {t.userTableHeaderRegistered}
                  </th>
                  <th className="py-2.5 px-3 text-start font-bold hidden md:table-cell">
                    {t.userTableHeaderLastActive}
                  </th>
                  <th className="py-2.5 px-3 text-center font-bold">
                    {t.userTableHeaderLogins}
                  </th>
                  <th className="py-2.5 px-3 text-center font-bold">
                    {t.userTableHeaderActions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 bg-neutral-900/50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-neutral-850/60 transition-colors group"
                  >
                    {/* User info */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                          <Send className="w-3.5 h-3.5 -rotate-45" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-sky-200 text-xs truncate">
                            {user.username}
                          </div>
                          {user.firstName && (
                            <div className="text-[10px] text-neutral-400 truncate">
                              {user.firstName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-2.5 px-3 text-neutral-300 font-mono text-[11px] hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{user.registeredAt}</span>
                      </div>
                    </td>

                    {/* Last Active Date */}
                    <td className="py-2.5 px-3 text-neutral-300 font-mono text-[11px] hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Clock className="w-3 h-3 text-amber-500/70" />
                        <span>{user.lastActiveAt}</span>
                      </div>
                    </td>

                    {/* Logins Count */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-950 border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
                        {user.loginCount}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        id={`delete-user-${user.id}`}
                        onClick={() => {
                          triggerHaptic('medium');
                          setUserToDelete(user);
                        }}
                        title={t.deleteUserBtn}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden xs:inline">{t.deleteUserBtn}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT VIDEO LINK MODAL */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-neutral-950 border border-amber-400/50 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-neutral-100">
                  {t.editModalTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="text-neutral-400 hover:text-neutral-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedLink} className="space-y-3.5">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">
                  {t.titlePlaceholder}
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.title}
                  onChange={(e) =>
                    setEditingLink((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">
                  {t.urlPlaceholder}
                </label>
                <input
                  type="url"
                  required
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink((prev) =>
                      prev ? { ...prev, url: e.target.value } : null
                    )
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 font-mono focus:outline-none transition-colors"
                  dir="ltr"
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">
                  {t.datePlaceholder}
                </label>
                <input
                  type="date"
                  required
                  value={editingLink.date}
                  onChange={(e) =>
                    setEditingLink((prev) =>
                      prev ? { ...prev, date: e.target.value } : null
                    )
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none transition-colors"
                />
              </div>

              {/* Toggle NEW Badge */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={editingLink.isNew ?? false}
                    onChange={(e) =>
                      setEditingLink((prev) =>
                        prev ? { ...prev, isNew: e.target.checked } : null
                      )
                    }
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-neutral-900 border-neutral-700"
                  />
                  <span>{t.markAsNew}</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE VIDEO LINK MODAL */}
      {linkToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-950 border border-rose-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-100">
                  {t.deleteLink}
                </h4>
                <p className="text-xs text-neutral-400">
                  {t.confirmDelete}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setLinkToDeleteId(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-neutral-100 text-xs font-semibold cursor-pointer border border-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteLink(linkToDeleteId)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-950 border border-rose-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-100">
                  {t.deleteUserBtn}
                </h4>
                <p className="text-xs font-mono text-rose-300 font-semibold">
                  {userToDelete.username}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {t.confirmDeleteUser}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-neutral-100 text-xs font-semibold cursor-pointer border border-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteUserBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCRIPT PREVIEW MODAL */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-neutral-950 border border-amber-500/50 flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gold-gradient">
                    telebot_bot.tpy
                  </h4>
                  <p className="text-[10px] text-neutral-400">
                    Telebot Creator & pyTelegramBotAPI Script
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-y-auto flex-1 bg-black/50 font-mono text-xs text-amber-200/90 leading-relaxed select-text" dir="ltr">
              <pre className="whitespace-pre-wrap break-all">
                {getActiveScriptContent()}
              </pre>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-800 flex items-center justify-between gap-2 flex-wrap bg-neutral-900/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer border border-neutral-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyTpyBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTpy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>.TPY</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold cursor-pointer border border-amber-500/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.PY</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                {t.closeScriptBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
