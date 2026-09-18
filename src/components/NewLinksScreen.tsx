import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Trash2,
  Edit3,
  Plus,
  Calendar,
  Link as LinkIcon,
  Search,
  Sparkles,
  AlertCircle,
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { VideoLink, Language } from '../types';
import { translations } from '../data/translations';
import { openExternalUrl, triggerHaptic, triggerHapticSuccess } from '../utils/telegram';

interface NewLinksScreenProps {
  language: Language;
  links: VideoLink[];
  onBack: () => void;
  onAddLink: (link: Omit<VideoLink, 'id'>) => void;
  onUpdateLink: (link: VideoLink) => void;
  onDeleteLink: (id: string) => void;
  isAdminAuthenticated: boolean;
  onRequestAdminLogin: () => void;
}

export const NewLinksScreen: React.FC<NewLinksScreenProps> = ({
  language,
  links,
  onBack,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  isAdminAuthenticated,
  onRequestAdminLogin,
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<VideoLink | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Link Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDate, setNewDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [newIsNew, setNewIsNew] = useState(true);

  const filteredLinks = links.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q)
    );
  });

  const handleOpenLink = (url: string) => {
    openExternalUrl(url);
  };

  const handleConfirmDelete = (id: string) => {
    if (!isAdminAuthenticated) {
      onRequestAdminLogin();
      return;
    }
    triggerHaptic('heavy');
    onDeleteLink(id);
    setDeletingId(null);
  };

  const handleTriggerAddLink = () => {
    if (!isAdminAuthenticated) {
      triggerHaptic('medium');
      onRequestAdminLogin();
      return;
    }
    triggerHaptic('light');
    setShowAddModal(true);
  };

  const handleSubmitNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminAuthenticated) {
      onRequestAdminLogin();
      return;
    }
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddLink({
      title: newTitle.trim(),
      url: formattedUrl,
      date: newDate.trim() || new Date().toISOString().split('T')[0],
      isNew: newIsNew,
    });

    triggerHapticSuccess();
    setNewTitle('');
    setNewUrl('');
    setNewIsNew(true);
    setShowAddModal(false);
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
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* Top Bar with Back Button & Add Link / Admin Action */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          id="btn-back-home"
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
        >
          <BackIcon className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdminAuthenticated ? (
            <button
              id="btn-add-new-link"
              onClick={handleTriggerAddLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/60 shadow-lg cursor-pointer hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{t.addNewLink}</span>
            </button>
          ) : (
            <button
              id="btn-admin-login-required"
              onClick={() => {
                triggerHaptic('light');
                onRequestAdminLogin();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-400/40 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.adminLoginBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen Title Banner */}
      <div className="rounded-2xl bg-neutral-900/80 border border-amber-500/30 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="links">🔗</span>
              <h2 className="text-lg sm:text-xl font-black text-gold-gradient">
                {t.newLinksTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">
              {t.newLinksSubtitle}
            </p>
          </div>
          <div className="flex-shrink-0 px-3 py-1 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-black">
            {links.length} {t.totalLinks}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-amber-400 absolute top-3 rtl:right-3 ltr:left-3 pointer-events-none" />
          <input
            id="search-links-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-neutral-950/80 border border-amber-500/25 rounded-xl py-2.5 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-2.5 rtl:left-3 ltr:right-3 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Protected Note if not logged in */}
      {!isAdminAuthenticated && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 text-xs text-amber-200/90">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{t.adminRequiredToModify}</span>
          </div>
          <button
            onClick={onRequestAdminLogin}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-amber-400/40 text-amber-300 font-bold hover:bg-neutral-800 text-[11px]"
          >
            {t.adminLoginBtn}
          </button>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 space-y-3">
            <LinkIcon className="w-10 h-10 mx-auto text-amber-500/40" />
            <p className="text-sm font-medium">{t.noLinksYet}</p>
            {isAdminAuthenticated && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs font-bold border border-amber-300/40"
              >
                {t.addNewLink}
              </button>
            )}
          </div>
        ) : (
          filteredLinks.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-neutral-900/90 border border-amber-500/30 hover:border-amber-400/60 p-4 transition-all duration-200 shadow-lg hover:shadow-pink-500/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Link Info: 📅 Date & 🔗 Title */}
                <div className="min-w-0 space-y-1.5 flex-1">
                  {/* 📅 Date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-neutral-950 border border-amber-400/40 text-amber-300">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{item.date}</span>
                    </span>

                    {item.isNew && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        NEW
                      </span>
                    )}
                  </div>

                  {/* 🔗 Title / Name */}
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5 flex-shrink-0">🔗</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-amber-100 group-hover:text-amber-300 leading-snug break-words">
                      {item.title}
                    </h3>
                  </div>

                  {/* URL */}
                  <p className="text-[11px] text-neutral-400 font-mono truncate rtl:text-right ltr:text-left" dir="ltr">
                    {item.url}
                  </p>
                </div>

                {/* Actions: Open Link button + Delete button */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800 flex-shrink-0">
                  {/* Open Link Button */}
                  <button
                    id={`btn-open-link-${item.id}`}
                    onClick={() => handleOpenLink(item.url)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/40 shadow cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span>{t.openLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  </button>

                  {/* Edit Button (تعديل) - Protected for Admin */}
                  {isAdminAuthenticated && (
                    <button
                      id={`btn-edit-link-${item.id}`}
                      onClick={() => {
                        triggerHaptic('light');
                        setEditingLink({ ...item });
                      }}
                      title={t.editLink}
                      className="p-2 rounded-xl bg-neutral-950 text-amber-400 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-400/60 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Button (حذف) - Protected for Admin */}
                  {isAdminAuthenticated ? (
                    <button
                      id={`btn-delete-link-${item.id}`}
                      onClick={() => {
                        triggerHaptic('light');
                        setDeletingId(item.id);
                      }}
                      title={t.deleteLink}
                      className="p-2 rounded-xl bg-neutral-950 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-400/60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        onRequestAdminLogin();
                      }}
                      title={t.onlyAdminCanDelete}
                      className="p-2 rounded-xl bg-neutral-950/60 text-neutral-500 hover:text-amber-400 border border-neutral-800 hover:border-amber-500/30 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Confirm Delete Dialog */}
              {deletingId === item.id && (
                <div className="mt-3 pt-3 border-t border-rose-500/30 flex items-center justify-between gap-2 flex-wrap bg-rose-950/30 -mx-4 -mb-4 p-3 rounded-b-2xl">
                  <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{t.confirmDelete}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(item.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
                    >
                      {t.deleteLink}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Add New Link (Only for Admin) */}
      {showAddModal && isAdminAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-950 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-gold-gradient">
                  {t.addNewLink}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLink} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🔗 {t.titlePlaceholder}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🌐 URL (الرابط)
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 font-mono text-left focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  📅 {t.datePlaceholder}
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={newIsNew}
                    onChange={(e) => setNewIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-neutral-900 border-neutral-700"
                  />
                  <span>{t.markAsNew}</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/50 shadow-md hover:brightness-110"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-neutral-950 border border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-amber-200">
                  {t.editModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🎬 {t.titlePlaceholder}
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
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  🌐 URL (الرابط)
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink((prev) =>
                      prev ? { ...prev, url: e.target.value } : null
                    )
                  }
                  placeholder={t.urlPlaceholder}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 font-mono text-left focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  📅 {t.datePlaceholder}
                </label>
                <input
                  type="date"
                  value={editingLink.date}
                  onChange={(e) =>
                    setEditingLink((prev) =>
                      prev ? { ...prev, date: e.target.value } : null
                    )
                  }
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
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

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-pink-cinema text-amber-100 text-xs sm:text-sm font-bold border border-amber-300/50 shadow-md hover:brightness-110"
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
