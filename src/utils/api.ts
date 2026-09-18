import { VideoLink, AppConfig, RegisteredUser, DailyActivityRecord } from '../types';

const STORAGE_KEY_LINKS = 'etebox_vip_video_links_v2';
const STORAGE_KEY_CONFIG = 'etebox_vip_app_config_v1';

export async function fetchServerLinks(): Promise<VideoLink[] | null> {
  try {
    const res = await fetch('/api/links');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        try {
          localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data));
        } catch {
          // ignore
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch links from server, using local cache:', err);
  }
  return null;
}

export async function createServerLink(link: Omit<VideoLink, 'id'>): Promise<VideoLink[] | null> {
  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.links)) {
        try {
          localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data.links));
        } catch {
          // ignore
        }
        return data.links;
      }
    }
  } catch (err) {
    console.error('Failed to create link on server:', err);
  }
  return null;
}

export async function updateServerLink(link: VideoLink): Promise<VideoLink[] | null> {
  try {
    const res = await fetch(`/api/links/${encodeURIComponent(link.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.links)) {
        try {
          localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data.links));
        } catch {
          // ignore
        }
        return data.links;
      }
    }
  } catch (err) {
    console.error('Failed to update link on server:', err);
  }
  return null;
}

export async function deleteServerLink(id: string): Promise<VideoLink[] | null> {
  try {
    const res = await fetch(`/api/links/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.links)) {
        try {
          localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data.links));
        } catch {
          // ignore
        }
        return data.links;
      }
    }
  } catch (err) {
    console.error('Failed to delete link on server:', err);
  }
  return null;
}

export async function fetchServerConfig(): Promise<AppConfig | null> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        try {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(data));
        } catch {
          // ignore
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch config from server, using local cache:', err);
  }
  return null;
}

export async function saveServerConfig(config: AppConfig): Promise<AppConfig | null> {
  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.config) {
        try {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(data.config));
        } catch {
          // ignore
        }
        return data.config;
      }
    }
  } catch (err) {
    console.error('Failed to save config on server:', err);
  }
  return null;
}

export async function logUserToServer(username: string, firstName?: string): Promise<void> {
  try {
    await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, firstName }),
    });
  } catch {
    // silent
  }
}

export async function fetchServerUsers(): Promise<{ registeredUsers: RegisteredUser[]; dailyActivity: DailyActivityRecord[] } | null> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // silent
  }
  return null;
}
