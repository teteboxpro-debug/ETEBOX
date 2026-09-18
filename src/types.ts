export type Language = 'ar' | 'en' | 'ru';

export interface VideoLink {
  id: string;
  title: string;
  url: string;
  date: string;
  category?: string;
  isNew?: boolean;
}

export interface AppConfig {
  freeVideosUrl: string;
  vipStoreUrl: string;
  storageUrl: string;
  botUrl: string;
  telegramSupportAccount: string;
  tiktokUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
}

export interface TelegramUser {
  username: string;
  firstName?: string;
  id?: string | number;
  isAuthed: boolean;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // or plain for client-side demo
}

export interface RegisteredUser {
  id: string;
  username: string;
  firstName?: string;
  registeredAt: string;
  lastActiveAt: string;
  loginCount: number;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  activeUsernames: string[];
  newUsersCount: number;
  totalVisits: number;
}

export interface DashboardStats {
  totalUsers: number;
  usersToday: number;
  newUsersToday: number;
  totalRegisteredTelegramAccounts: number;
}

