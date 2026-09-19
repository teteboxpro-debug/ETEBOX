import { VideoLink, AppConfig, RegisteredUser, DailyActivityRecord } from '../types';
import { INITIAL_VIDEO_LINKS, DEFAULT_APP_CONFIG, INITIAL_REGISTERED_USERS, INITIAL_DAILY_ACTIVITY } from '../data/defaultData';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY_LINKS = 'etebox_vip_video_links_v2';
const STORAGE_KEY_CONFIG = 'etebox_vip_app_config_v1';

// -------------------------------------------------------------
// 1. VIDEO LINKS - Permanent Cloud Firestore Storage
// -------------------------------------------------------------

export function subscribeToLiveLinks(onLinksUpdate: (links: VideoLink[]) => void): () => void {
  try {
    const linksCol = collection(db, 'links');
    const unsubscribe = onSnapshot(
      linksCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: VideoLink[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            if (data && data.url && data.title) {
              fetched.push({
                id: docSnap.id,
                title: data.title,
                url: data.url,
                date: data.date || new Date().toISOString().split('T')[0],
                category: data.category || 'Official',
                isNew: Boolean(data.isNew),
              });
            }
          });
          if (fetched.length > 0) {
            fetched.sort((a, b) => b.id.localeCompare(a.id));
            localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(fetched));
            onLinksUpdate(fetched);
          }
        }
      },
      (err) => {
        console.warn('Live Firestore snapshot subscription fallback:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup Firestore onSnapshot:', err);
    return () => {};
  }
}

export async function fetchServerLinks(): Promise<VideoLink[] | null> {
  try {
    const linksCol = collection(db, 'links');
    const snapshot = await getDocs(linksCol);
    if (!snapshot.empty) {
      const fetched: VideoLink[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        if (data && data.url && data.title) {
          fetched.push({
            id: docSnap.id,
            title: data.title,
            url: data.url,
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Official',
            isNew: Boolean(data.isNew),
          });
        }
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => b.id.localeCompare(a.id));
        localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(fetched));
        return fetched;
      }
    }
  } catch (err) {
    console.warn('Could not fetch links from Firestore directly:', err);
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem(STORAGE_KEY_LINKS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return INITIAL_VIDEO_LINKS;
}

export async function createServerLink(link: Omit<VideoLink, 'id'>): Promise<VideoLink[] | null> {
  const linkId = `link-${Date.now()}`;
  const newLink: VideoLink = {
    ...link,
    id: linkId,
  };

  try {
    const docRef = doc(db, 'links', linkId);
    await setDoc(docRef, {
      title: newLink.title,
      url: newLink.url,
      date: newLink.date,
      category: newLink.category || 'Official',
      isNew: Boolean(newLink.isNew),
      createdAt: new Date().toISOString(),
    });
    console.log('Link permanently saved to Firestore:', linkId);
  } catch (err) {
    console.error('Failed to save link to Firestore:', err);
  }

  // Update local storage
  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) currentLinks = JSON.parse(existing);
  } catch {}
  if (!Array.isArray(currentLinks) || currentLinks.length === 0) {
    currentLinks = INITIAL_VIDEO_LINKS;
  }

  const updatedLinks = [newLink, ...currentLinks.filter((l) => l.id !== linkId)];
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  return updatedLinks;
}

export async function updateServerLink(link: VideoLink): Promise<VideoLink[] | null> {
  try {
    const docRef = doc(db, 'links', link.id);
    await setDoc(
      docRef,
      {
        title: link.title,
        url: link.url,
        date: link.date,
        category: link.category || 'Official',
        isNew: Boolean(link.isNew),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to update link in Firestore:', err);
  }

  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) currentLinks = JSON.parse(existing);
  } catch {}

  const updatedLinks = currentLinks.map((l) => (l.id === link.id ? link : l));
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  return updatedLinks;
}

export async function deleteServerLink(id: string): Promise<VideoLink[] | null> {
  try {
    const docRef = doc(db, 'links', id);
    await deleteDoc(docRef);
    console.log('Link permanently deleted from Firestore:', id);
  } catch (err) {
    console.error('Failed to delete link from Firestore:', err);
  }

  let currentLinks: VideoLink[] = [];
  try {
    const existing = localStorage.getItem(STORAGE_KEY_LINKS);
    if (existing) currentLinks = JSON.parse(existing);
  } catch {}

  const updatedLinks = currentLinks.filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(updatedLinks));

  return updatedLinks;
}

// -------------------------------------------------------------
// 2. APP CONFIG - Firestore Centralized Storage
// -------------------------------------------------------------

export async function fetchServerConfig(): Promise<AppConfig | null> {
  try {
    const configDoc = doc(db, 'config', 'global');
    const snapshot = await getDoc(configDoc);
    if (snapshot.exists()) {
      const data = snapshot.data() as AppConfig;
      if (data && typeof data === 'object') {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch config from Firestore:', err);
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch {}

  return DEFAULT_APP_CONFIG;
}

export async function saveServerConfig(config: AppConfig): Promise<AppConfig | null> {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));

  try {
    const configDoc = doc(db, 'config', 'global');
    await setDoc(configDoc, config, { merge: true });
    console.log('App config permanently saved to Firestore');
  } catch (err) {
    console.error('Failed to save config to Firestore:', err);
  }

  return config;
}

// -------------------------------------------------------------
// 3. TELEGRAM USERS & LIVE VISITS - Centralized User Counting
// -------------------------------------------------------------

export async function logUserToServer(username: string, firstName?: string): Promise<void> {
  if (!username) return;
  const cleanUsername = username.startsWith('@') ? username : `@${username}`;
  const userId = cleanUsername.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

  try {
    const userDoc = doc(db, 'users', userId);
    const snap = await getDoc(userDoc);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (snap.exists()) {
      const existing = snap.data();
      await setDoc(
        userDoc,
        {
          lastActiveAt: now,
          loginCount: (existing.loginCount || 1) + 1,
          firstName: firstName || existing.firstName || '',
        },
        { merge: true }
      );
    } else {
      await setDoc(userDoc, {
        id: userId,
        username: cleanUsername,
        firstName: firstName || '',
        registeredAt: now,
        lastActiveAt: now,
        loginCount: 1,
      });
    }

    // Record daily active user
    const today = new Date().toISOString().split('T')[0];
    const activityDoc = doc(db, 'daily_activity', today);
    const actSnap = await getDoc(activityDoc);

    if (actSnap.exists()) {
      const actData = actSnap.data();
      const usernames: string[] = Array.isArray(actData.activeUsernames) ? actData.activeUsernames : [];
      if (!usernames.includes(cleanUsername)) {
        usernames.push(cleanUsername);
        await setDoc(activityDoc, {
          date: today,
          activeCount: usernames.length,
          activeUsernames: usernames,
        });
      }
    } else {
      await setDoc(activityDoc, {
        date: today,
        activeCount: 1,
        activeUsernames: [cleanUsername],
      });
    }
  } catch (err) {
    console.error('Failed to log user to Firestore:', err);
  }
}

export async function fetchServerUsers(): Promise<{ registeredUsers: RegisteredUser[]; dailyActivity: DailyActivityRecord[] } | null> {
  try {
    const usersCol = collection(db, 'users');
    const userSnaps = await getDocs(usersCol);
    const users: RegisteredUser[] = [];

    userSnaps.forEach((d) => {
      const data = d.data();
      users.push({
        id: d.id,
        username: data.username || `@user_${d.id}`,
        firstName: data.firstName || '',
        registeredAt: data.registeredAt || '2026-09-18',
        lastActiveAt: data.lastActiveAt || '2026-09-18',
        loginCount: data.loginCount || 1,
      });
    });

    const actCol = collection(db, 'daily_activity');
    const actSnaps = await getDocs(actCol);
    const dailyActivity: DailyActivityRecord[] = [];

    actSnaps.forEach((d) => {
      const data = d.data();
      dailyActivity.push({
        date: data.date || d.id,
        activeCount: data.activeCount || (Array.isArray(data.activeUsernames) ? data.activeUsernames.length : 1),
        activeUsernames: Array.isArray(data.activeUsernames) ? data.activeUsernames : [],
      });
    });

    if (users.length > 0 || dailyActivity.length > 0) {
      return {
        registeredUsers: users.length > 0 ? users : INITIAL_REGISTERED_USERS,
        dailyActivity: dailyActivity.length > 0 ? dailyActivity : INITIAL_DAILY_ACTIVITY,
      };
    }
  } catch (err) {
    console.warn('Could not fetch server users from Firestore:', err);
  }

  return null;
}
