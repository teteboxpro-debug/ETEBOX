import { VideoLink, AppConfig, RegisteredUser, DailyActivityRecord } from '../types';

export const DEFAULT_APP_CONFIG: AppConfig = {
  freeVideosUrl: 'https://rentry.co/Teteboxvip',
  vipStoreUrl: 'https://rentry.co/VIP2026',
  storageUrl: 'https://rentry.co/Cloud_ETEBOX',
  botUrl: 'https://telebotcreator.com/bots/66275456',
  telegramSupportAccount: '@EteboxSupport',
  tiktokUrl: 'https://www.tiktok.com/@eteboxvip',
  instagramUrl: 'https://www.instagram.com/eteboxvip',
  whatsappUrl: 'https://wa.me/message/ETEBOXVIP',
};

export const INITIAL_VIDEO_LINKS: VideoLink[] = [
  {
    id: 'link-welcome-2026',
    title: 'WELCOME 2026',
    url: 'https://rentry.co/WELCOME_2026',
    date: '2026-09-17',
    category: 'Official',
    isNew: true,
  },
];

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr-1',
    username: '@AlexVIP_2026',
    firstName: 'Alex V.',
    registeredAt: '2026-09-15 14:20',
    lastActiveAt: '2026-09-17 11:45',
    loginCount: 9,
  },
  {
    id: 'usr-2',
    username: '@Sarah_Cinema',
    firstName: 'Sarah',
    registeredAt: '2026-09-16 09:15',
    lastActiveAt: '2026-09-17 10:30',
    loginCount: 5,
  },
  {
    id: 'usr-3',
    username: '@TariqMedia',
    firstName: 'طارق',
    registeredAt: '2026-09-17 08:05',
    lastActiveAt: '2026-09-17 12:10',
    loginCount: 3,
  },
  {
    id: 'usr-4',
    username: '@Dmitry_Films',
    firstName: 'Dmitry',
    registeredAt: '2026-09-17 08:45',
    lastActiveAt: '2026-09-17 12:00',
    loginCount: 2,
  },
  {
    id: 'usr-5',
    username: '@EteboxVIP_Fan',
    firstName: 'VIP Member',
    registeredAt: '2026-09-14 18:30',
    lastActiveAt: '2026-09-16 22:15',
    loginCount: 14,
  },
];

export const INITIAL_DAILY_ACTIVITY: DailyActivityRecord[] = [
  {
    date: '2026-09-11',
    activeUsernames: ['@AlexVIP_2026', '@EteboxVIP_Fan'],
    newUsersCount: 1,
    totalVisits: 18,
  },
  {
    date: '2026-09-12',
    activeUsernames: ['@EteboxVIP_Fan'],
    newUsersCount: 0,
    totalVisits: 22,
  },
  {
    date: '2026-09-13',
    activeUsernames: ['@AlexVIP_2026', '@EteboxVIP_Fan'],
    newUsersCount: 1,
    totalVisits: 29,
  },
  {
    date: '2026-09-14',
    activeUsernames: ['@EteboxVIP_Fan', '@AlexVIP_2026'],
    newUsersCount: 2,
    totalVisits: 35,
  },
  {
    date: '2026-09-15',
    activeUsernames: ['@AlexVIP_2026', '@EteboxVIP_Fan'],
    newUsersCount: 1,
    totalVisits: 42,
  },
  {
    date: '2026-09-16',
    activeUsernames: ['@AlexVIP_2026', '@Sarah_Cinema', '@EteboxVIP_Fan'],
    newUsersCount: 2,
    totalVisits: 48,
  },
  {
    date: '2026-09-17',
    activeUsernames: ['@AlexVIP_2026', '@Sarah_Cinema', '@TariqMedia', '@Dmitry_Films'],
    newUsersCount: 2,
    totalVisits: 56,
  },
];


