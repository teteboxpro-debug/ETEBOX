import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { MainButtons } from './components/MainButtons';
import { NewLinksScreen } from './components/NewLinksScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { AdminConfigModal } from './components/AdminConfigModal';
import { UserLoginModal } from './components/UserLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SocialMediaSection } from './components/SocialMediaSection';
import { Footer } from './components/Footer';
import {
  Language,
  VideoLink,
  AppConfig,
  TelegramUser,
  AdminCredentials,
  RegisteredUser,
  DailyActivityRecord,
  DashboardStats,
} from './types';
import {
  INITIAL_VIDEO_LINKS,
  DEFAULT_APP_CONFIG,
  INITIAL_REGISTERED_USERS,
  INITIAL_DAILY_ACTIVITY,
} from './data/defaultData';
import { initTelegramApp, getTelegramWebAppUser, triggerHaptic } from './utils/telegram';
import {
  fetchServerLinks,
  createServerLink,
  updateServerLink,
  deleteServerLink,
  fetchServerConfig,
  saveServerConfig,
  logUserToServer,
  fetchServerUsers,
} from './utils/api';
import studioBg from './assets/images/eterbox_vip_bg_1789755242238.jpg';

const STORAGE_KEY_LINKS = 'etebox_vip_video_links_v2';
const STORAGE_KEY_CONFIG = 'etebox_vip_app_config_v1';
const STORAGE_KEY_LANG = 'etebox_vip_lang_v1';
const STORAGE_KEY_USER = 'etebox_vip_user_v1';
const STORAGE_KEY_ADMIN_AUTH = 'etebox_vip_admin_auth_v1';
const STORAGE_KEY_ADMIN_CREDS = 'etebox_vip_admin_creds_v1';
const STORAGE_KEY_REGISTERED_USERS = 'etebox_vip_registered_users_v2';
const STORAGE_KEY_DAILY_ACTIVITY = 'etebox_vip_daily_activity_v2';

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'vip2026',
};

export default function App() {
  // Language state: 'ar' | 'en' | 'ru' (Defaults to 'en' as requested, user can change anytime)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'ar' || saved === 'en' || saved === 'ru') return saved;
    return 'en';
  });

  // Current view: 'home' | 'new_links' | 'admin_dashboard'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'new_links' | 'admin_dashboard'>('home');

  // Video Links state
  const [links, setLinks] = useState<VideoLink[]>(() => {
    try {
      localStorage.removeItem('etebox_vip_video_links_v1');
      const saved = localStorage.getItem(STORAGE_KEY_LINKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading links from storage:', e);
    }
    try {
      localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(INITIAL_VIDEO_LINKS));
    } catch (e) {
      console.warn('Error persisting initial links to storage:', e);
    }
    return INITIAL_VIDEO_LINKS;
  });

  // App URLs configuration
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate any previous stale telebotcreator default links to the new official URLs
        const isOldDefault =
          parsed.freeVideosUrl?.includes('telebotcreator.com/bots/66275456?start=free_videos') ||
          parsed.vipStoreUrl?.includes('telebotcreator.com/bots/66275456?start=vip_store') ||
          parsed.storageUrl?.includes('telebotcreator.com/bots/66275456?start=storage');

        const merged: AppConfig = {
          ...DEFAULT_APP_CONFIG,
          ...parsed,
          freeVideosUrl:
            !parsed.freeVideosUrl || parsed.freeVideosUrl.includes('telebotcreator.com/bots/66275456?start=free_videos')
              ? DEFAULT_APP_CONFIG.freeVideosUrl
              : parsed.freeVideosUrl,
          vipStoreUrl:
            !parsed.vipStoreUrl || parsed.vipStoreUrl.includes('telebotcreator.com/bots/66275456?start=vip_store')
              ? DEFAULT_APP_CONFIG.vipStoreUrl
              : parsed.vipStoreUrl,
          storageUrl:
            !parsed.storageUrl || parsed.storageUrl.includes('telebotcreator.com/bots/66275456?start=storage')
              ? DEFAULT_APP_CONFIG.storageUrl
              : parsed.storageUrl,
        };

        if (isOldDefault) {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(merged));
        }
        return merged;
      }
    } catch (e) {
      console.warn('Error loading config from storage:', e);
    }
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_APP_CONFIG));
    } catch {
      // ignore
    }
    return DEFAULT_APP_CONFIG;
  });

  // Telegram User Auth State
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved user:', e);
    }
    return null;
  });

  // Registered Telegram Users Database
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading registered users:', e);
    }
    return INITIAL_REGISTERED_USERS;
  });

  // Daily Activity Records
  const [dailyActivity, setDailyActivity] = useState<DailyActivityRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY_ACTIVITY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading daily activity:', e);
    }
    return INITIAL_DAILY_ACTIVITY;
  });

  // Admin Auth State (Requires username & password)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Admin Credentials (default admin / vip2026)
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_CREDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading admin creds:', e);
    }
    return DEFAULT_ADMIN_CREDS;
  });

  // Modals state
  const [showUserLoginModal, setShowUserLoginModal] = useState<boolean>(false);
  const [userLoginReason, setUserLoginReason] = useState<'free_channel' | 'new_links' | 'general' | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Initialize Telegram Mini App SDK & Auto-detect Telegram username
  useEffect(() => {
    initTelegramApp();
    const tgUser = getTelegramWebAppUser();
    if (tgUser?.username && !currentUser) {
      // Auto register or hint
      const newUser: TelegramUser = {
        username: tgUser.username,
        firstName: tgUser.firstName,
        id: tgUser.id,
        isAuthed: true,
      };
      setCurrentUser(newUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    }

    // Synchronize links and config from server database
    fetchServerLinks().then((serverLinks) => {
      if (serverLinks && Array.isArray(serverLinks) && serverLinks.length > 0) {
        setLinks(serverLinks);
      }
    });

    fetchServerConfig().then((serverConfig) => {
      if (serverConfig) {
        setConfig(serverConfig);
      }
    });

    fetchServerUsers().then((serverData) => {
      if (serverData?.registeredUsers && serverData.registeredUsers.length > 0) {
        setRegisteredUsers(serverData.registeredUsers);
      }
      if (serverData?.dailyActivity && serverData.dailyActivity.length > 0) {
        setDailyActivity(serverData.dailyActivity);
      }
    });
  }, []);

  // Update HTML dir and lang on language change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Persist links
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
  }, [links]);

  // Persist config
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  // Persist admin auth
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  // Persist admin credentials
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_CREDS, JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  // Persist registered users
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Persist daily activity
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DAILY_ACTIVITY, JSON.stringify(dailyActivity));
  }, [dailyActivity]);

  // Record daily app open / visit
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDailyActivity((prev) => {
      const existingIdx = prev.findIndex((d) => d.date === today);
      const user = currentUser?.username;
      if (existingIdx >= 0) {
        const copy = [...prev];
        const current = copy[existingIdx];
        const updatedActive = user && !current.activeUsernames.includes(user)
          ? [...current.activeUsernames, user]
          : current.activeUsernames;
        copy[existingIdx] = {
          ...current,
          totalVisits: current.totalVisits + 1,
          activeUsernames: updatedActive,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            date: today,
            activeUsernames: user ? [user] : [],
            newUsersCount: 0,
            totalVisits: 1,
          },
        ];
      }
    });
  }, []);

  // Compute live auto-updating dashboard statistics
  const stats: DashboardStats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = dailyActivity.find((d) => d.date === today);

    const activeUsernamesCount = todayRecord ? todayRecord.activeUsernames.length : 0;
    const visitsCount = todayRecord ? todayRecord.totalVisits : 0;
    // Users Today: users who opened or logged into the app today
    const usersToday = Math.max(activeUsernamesCount, visitsCount > 0 ? activeUsernamesCount || 1 : 0);

    // New Users Today: users whose registeredAt timestamp starts with today
    const newUsersToday = registeredUsers.filter((u) => u.registeredAt.startsWith(today)).length;

    return {
      totalUsers: registeredUsers.length,
      usersToday,
      newUsersToday,
      totalRegisteredTelegramAccounts: registeredUsers.length,
    };
  }, [registeredUsers, dailyActivity]);

  // Telegram WebApp Native BackButton integration
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    if (currentScreen === 'new_links' || currentScreen === 'admin_dashboard') {
      tg.BackButton.show?.();
      const handleBack = () => {
        setCurrentScreen('home');
      };
      tg.BackButton.onClick?.(handleBack);
      return () => {
        tg.BackButton?.offClick?.(handleBack);
      };
    } else {
      tg.BackButton.hide?.();
    }
  }, [currentScreen]);

  // If on admin_dashboard without admin auth, return to home
  useEffect(() => {
    if (currentScreen === 'admin_dashboard' && !isAdminAuthenticated) {
      setCurrentScreen('home');
    }
  }, [currentScreen, isAdminAuthenticated]);

  // Link Handlers
  const handleAddLink = async (newLinkData: Omit<VideoLink, 'id'>) => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
      return;
    }
    const newEntry: VideoLink = {
      ...newLinkData,
      id: `link-${Date.now()}`,
    };
    // Optimistic UI update
    setLinks((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error persisting added link to localStorage:', e);
      }
      return updated;
    });

    // Permanent Server Persistence
    const serverLinks = await createServerLink(newLinkData);
    if (serverLinks) {
      setLinks(serverLinks);
    }
  };

  const handleUpdateLink = async (updatedLink: VideoLink) => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
      return;
    }
    setLinks((prev) => {
      const updated = prev.map((item) => (item.id === updatedLink.id ? updatedLink : item));
      try {
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error persisting updated link to localStorage:', e);
      }
      return updated;
    });

    const serverLinks = await updateServerLink(updatedLink);
    if (serverLinks) {
      setLinks(serverLinks);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
      return;
    }
    setLinks((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error persisting deleted link to localStorage:', e);
      }
      return updated;
    });

    const serverLinks = await deleteServerLink(id);
    if (serverLinks) {
      setLinks(serverLinks);
    }
  };

  const handleSaveConfig = async (newConfig: AppConfig) => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
      return;
    }
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Error persisting config to localStorage:', e);
    }
    const saved = await saveServerConfig(newConfig);
    if (saved) {
      setConfig(saved);
    }
  };

  // User Auth Handlers with automatic database updates
  const handleUserLogin = (username: string, firstName?: string) => {
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;
    const user: TelegramUser = {
      username: cleanUsername,
      firstName,
      isAuthed: true,
    };
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    logUserToServer(cleanUsername, firstName);

    const today = new Date().toISOString().split('T')[0];
    const nowFormatted = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Update or add user in registeredUsers
    let isNewRegistration = false;
    setRegisteredUsers((prev) => {
      const existingIdx = prev.findIndex(
        (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          firstName: firstName || copy[existingIdx].firstName,
          lastActiveAt: nowFormatted,
          loginCount: copy[existingIdx].loginCount + 1,
        };
        return copy;
      } else {
        isNewRegistration = true;
        const newUser: RegisteredUser = {
          id: `usr-${Date.now()}`,
          username: cleanUsername,
          firstName: firstName || '',
          registeredAt: nowFormatted,
          lastActiveAt: nowFormatted,
          loginCount: 1,
        };
        return [newUser, ...prev];
      }
    });

    // Update daily activity log
    setDailyActivity((prev) => {
      const existingIdx = prev.findIndex((d) => d.date === today);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const current = copy[existingIdx];
        const hasUser = current.activeUsernames.includes(cleanUsername);
        copy[existingIdx] = {
          ...current,
          totalVisits: current.totalVisits + 1,
          activeUsernames: hasUser ? current.activeUsernames : [...current.activeUsernames, cleanUsername],
          newUsersCount: isNewRegistration ? current.newUsersCount + 1 : current.newUsersCount,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            date: today,
            activeUsernames: [cleanUsername],
            newUsersCount: isNewRegistration ? 1 : 0,
            totalVisits: 1,
          },
        ];
      }
    });
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  // Delete Registered Telegram User (Admin Only)
  const handleDeleteUser = (userId: string) => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
      return;
    }

    const userToDelete = registeredUsers.find((u) => u.id === userId);
    if (
      userToDelete &&
      currentUser?.username.toLowerCase() === userToDelete.username.toLowerCase()
    ) {
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEY_USER);
    }

    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Trigger registration flow when clicking Free Channel or New Links
  const handleRequestRegistration = (reason: 'free_channel' | 'new_links', onCompleteAction: () => void) => {
    setUserLoginReason(reason);
    setPendingAction(() => onCompleteAction);
    setShowUserLoginModal(true);
  };

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    if (currentScreen === 'admin_dashboard') {
      setCurrentScreen('home');
    }
  };

  const handleOpenAdminDashboard = () => {
    if (!isAdminAuthenticated) {
      setShowAdminLoginModal(true);
    } else {
      setCurrentScreen('admin_dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070709] text-neutral-100 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Background: Cinema Video Production Studio */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={studioBg}
          alt="ETER BOX VIP Cinema Studio Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 brightness-95 contrast-110 scale-100 transition-all duration-700 ease-out"
        />
        {/* Cinematic dark vignette overlays for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-[#070709]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_70%)]" />
        <div className="absolute inset-0 cinema-film-pattern opacity-30" />
      </div>

      {/* Top Header with Telegram User Login & Admin Auth */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenUserLogin={() => {
          setUserLoginReason('general');
          setPendingAction(null);
          setShowUserLoginModal(true);
        }}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onOpenSettings={() => {
          if (!isAdminAuthenticated) {
            setShowAdminLoginModal(true);
          } else {
            setShowConfigModal(true);
          }
        }}
        onOpenAdminDashboard={handleOpenAdminDashboard}
        currentScreen={currentScreen}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 py-5 flex flex-col justify-start gap-5 animate-cinematic-main">
        {currentScreen === 'home' ? (
          <>
            {/* Short Welcome Message in Gold */}
            <WelcomeBanner language={language} />

            {/* The 4 Main Pink Buttons with Gold Typography */}
            <MainButtons
              language={language}
              config={config}
              newLinksCount={links.length}
              currentUser={currentUser}
              onOpenNewLinks={() => setCurrentScreen('new_links')}
              onRequestRegistration={handleRequestRegistration}
            />

            {/* Dedicated Social Media & Contact Section */}
            <SocialMediaSection
              language={language}
              config={config}
            />
          </>
        ) : currentScreen === 'new_links' ? (
          /* Internal NEW LINKS Screen */
          <NewLinksScreen
            language={language}
            links={links}
            onBack={() => setCurrentScreen('home')}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
            isAdminAuthenticated={isAdminAuthenticated}
            onRequestAdminLogin={() => setShowAdminLoginModal(true)}
          />
        ) : (
          /* Private Admin Dashboard Screen */
          <AdminDashboardScreen
            language={language}
            registeredUsers={registeredUsers}
            dailyActivity={dailyActivity}
            stats={stats}
            config={config}
            links={links}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
            onSaveConfig={handleSaveConfig}
            onBack={() => setCurrentScreen('home')}
            onDeleteUser={handleDeleteUser}
            onOpenSettings={() => setShowConfigModal(true)}
            onAdminLogout={handleAdminLogout}
          />
        )}

        {/* Official Footer with requested bottom text */}
        <Footer
          language={language}
          supportAccount={config.telegramSupportAccount}
        />
      </main>

      {/* 1. Telegram User Registration / Login Modal */}
      <UserLoginModal
        isOpen={showUserLoginModal}
        onClose={() => {
          setShowUserLoginModal(false);
          setUserLoginReason(null);
          setPendingAction(null);
        }}
        currentUser={currentUser}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
        language={language}
        botUrl={config.botUrl}
        registrationPromptReason={userLoginReason}
        onPendingSuccessAction={pendingAction}
      />

      {/* 2. Admin Login Modal (Username & Password) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        isAdminAuthenticated={isAdminAuthenticated}
        adminCredentials={adminCredentials}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
        onUpdateCredentials={setAdminCredentials}
        language={language}
      />

      {/* 3. Admin Main Button URLs Config Modal */}
      <AdminConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        language={language}
        isAdminAuthenticated={isAdminAuthenticated}
        onRequestAdminLogin={() => setShowAdminLoginModal(true)}
        onAdminLogout={handleAdminLogout}
        onOpenDashboard={handleOpenAdminDashboard}
      />
    </div>
  );
}
