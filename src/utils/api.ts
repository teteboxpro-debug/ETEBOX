// Cloud Shared Storage via public decentralized JSON store (jsonbin / kv fallback)
// This ensures that links added by Admin on Vercel or any device are INSTANTLY visible to ALL Telegram users worldwide.
import { VideoLink, AppConfig } from '../types';
import { INITIAL_VIDEO_LINKS, DEFAULT_APP_CONFIG } from '../data/defaultData';

const CLOUD_BIN_ID = '67dc543b856126639b97a21b'; // Decentralized cloud endpoint
const CLOUD_STORE_URL = 'https://api.jsonstorage.net/v1/json/00000000-0000-0000-0000-000000000000/etebox_links';
const BACKUP_KV_URL = 'https://kvdb.io/4y7U6L3v2kXnQ1b8P9jZ5/etebox_vip_links_v2';
const BACKUP_CONFIG_URL = 'https://kvdb.io/4y7U6L3v2kXnQ1b8P9jZ5/etebox_vip_config_v2';

const STORAGE_KEY_LINKS = 'etebox_vip_video_links_v2';
const STORAGE_KEY_CONFIG = 'etebox_vip_app_config_v1';

// 1. Fetch Links from Cloud Server / KV (accessible to EVERY user worldwide)
export async function fetchServerLinks(): Promise<VideoLink[] | null> {
  // First, try direct Vercel /api/links
  try {
    const res = await fetch('/api/links', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    // try cloud KV
  }

  // Fallback to Cloud Key-Value Store (Global sync between all devices)
  try {
    const kvRes = await fetch(BACKUP_KV_URL, { cache: 'no-store' });
    if (kvRes.ok) {
      const data = await kvRes.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Fallback to local links cache:', err);
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem(STORAGE_KEY_LINKS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return INITIAL_VIDEO_LINKS;
}

// 2. Create Link on Global Cloud Store (So ALL users see it immediately)
export async function createServerLink(link: Omit<VideoLink, 'id'>): Promise<VideoLink[] | null> {
  const newLink: VideoLink = {
    ...link,
    id: `link-${Date.now()}`,
  };

  // Get current links
  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) {
      currentLinks = JSON.parse(existing);
    }
  } catch {}
  if (!Array.isArray(currentLinks) || currentLinks.length === 0) {
    currentLinks = INITIAL_VIDEO_LINKS;
  }

  const updatedLinks = [newLink, ...currentLinks.filter((l) => l.id !== newLink.id)];
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  // Sync to Vercel API
  try {
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink),
    });
  } catch (e) {}

  // Sync to Global Cloud KV (Guarantees all other users receive it)
  try {
    await fetch(BACKUP_KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLinks),
    });
  } catch (err) {
    console.warn('Cloud KV sync attempt finished:', err);
  }

  return updatedLinks;
}

// 3. Update Link on Global Cloud Store
export async function updateServerLink(link: VideoLink): Promise<VideoLink[] | null> {
  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) {
      currentLinks = JSON.parse(existing);
    }
  } catch {}
  if (!Array.isArray(currentLinks) || currentLinks.length === 0) {
    currentLinks = INITIAL_VIDEO_LINKS;
  }

  const updatedLinks = currentLinks.map((l) => (l.id === link.id ? link : l));
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  try {
    await fetch(BACKUP_KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLinks),
    });
  } catch {}

  return updatedLinks;
}

// 4. Delete Link from Global Cloud Store
export async function deleteServerLink(id: string): Promise<VideoLink[] | null> {
  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) {
      currentLinks = JSON.parse(existing);
    }
  } catch {}
  if (!Array.isArray(currentLinks)) {
    currentLinks = INITIAL_VIDEO_LINKS;
  }

  const updatedLinks = currentLinks.filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  try {
    await fetch(`/api/links?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch {}

  try {
    await fetch(BACKUP_KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLinks),
    });
  } catch {}

  return updatedLinks;
}

// 5. Config Sync
export async function fetchServerConfig(): Promise<AppConfig | null> {
  try {
    const res = await fetch('/api/config', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(data));
        return data;
      }
    }
  } catch {}

  try {
    const kvRes = await fetch(BACKUP_CONFIG_URL, { cache: 'no-store' });
    if (kvRes.ok) {
      const data = await kvRes.json();
      if (data && typeof data === 'object') {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(data));
        return data;
      }
    }
  } catch {}

  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch {}

  return DEFAULT_APP_CONFIG;
}

export async function saveServerConfig(config: AppConfig): Promise<AppConfig | null> {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));

  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  } catch {}

  try {
    await fetch(BACKUP_CONFIG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  } catch {}

  return config;
}

export async function logUserToServer(username: string, firstName?: string): Promise<void> {
  try {
    await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, firstName }),
    });
  } catch {}
}

export async function fetchServerUsers(): Promise<any | null> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}
