import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Data Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'persistent_data.json');

// Initial defaults
const DEFAULT_CONFIG = {
  freeVideosUrl: 'https://rentry.co/Teteboxvip',
  vipStoreUrl: 'https://rentry.co/VIP2026',
  storageUrl: 'https://rentry.co/Cloud_ETEBOX',
  botUrl: 'https://telebotcreator.com/bots/66275456',
  telegramSupportAccount: '@EteboxSupport',
  tiktokUrl: 'https://www.tiktok.com/@eteboxvip',
  instagramUrl: 'https://www.instagram.com/eteboxvip',
  whatsappUrl: 'https://wa.me/message/ETEBOXVIP',
};

const DEFAULT_LINKS = [
  {
    id: 'link-welcome-2026',
    title: 'WELCOME 2026',
    url: 'https://rentry.co/WELCOME_2026',
    date: '2026-09-17',
    category: 'Official',
    isNew: true,
  },
];

interface PersistentData {
  links: any[];
  config: any;
  registeredUsers?: any[];
  dailyActivity?: any[];
}

// Helper to load data
function loadServerData(): PersistentData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_LINKS,
        config: parsed.config || DEFAULT_CONFIG,
        registeredUsers: parsed.registeredUsers || [],
        dailyActivity: parsed.dailyActivity || [],
      };
    }
  } catch (err) {
    console.error('Error loading persistent data:', err);
  }

  const initial: PersistentData = {
    links: DEFAULT_LINKS,
    config: DEFAULT_CONFIG,
    registeredUsers: [],
    dailyActivity: [],
  };
  saveServerData(initial);
  return initial;
}

// Helper to save data
function saveServerData(data: PersistentData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing persistent data:', err);
  }
}

// --------------------------------------------------------------------------
// API ROUTES (Always placed before Vite / Static middleware)
// --------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all video links
app.get('/api/links', (req, res) => {
  const data = loadServerData();
  res.json(data.links);
});

// POST a new video link
app.post('/api/links', (req, res) => {
  try {
    const { title, url, date, category, isNew } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const data = loadServerData();
    const newEntry = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'Official',
      isNew: Boolean(isNew),
    };

    // Prepend so newest appears first
    data.links = [newEntry, ...data.links];
    saveServerData(data);

    res.status(201).json({ message: 'Link created', link: newEntry, links: data.links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add link' });
  }
});

// PUT update an existing link
app.put('/api/links/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, date, category, isNew } = req.body;
    const data = loadServerData();

    const index = data.links.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Link not found' });
    }

    data.links[index] = {
      ...data.links[index],
      title: title !== undefined ? title.trim() : data.links[index].title,
      url: url !== undefined ? url.trim() : data.links[index].url,
      date: date || data.links[index].date,
      category: category || data.links[index].category,
      isNew: isNew !== undefined ? Boolean(isNew) : data.links[index].isNew,
    };

    saveServerData(data);
    res.json({ message: 'Link updated', link: data.links[index], links: data.links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update link' });
  }
});

// DELETE a link
app.delete('/api/links/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = loadServerData();

    data.links = data.links.filter((l) => l.id !== id);
    saveServerData(data);

    res.json({ message: 'Link deleted', links: data.links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// GET app config
app.get('/api/config', (req, res) => {
  const data = loadServerData();
  res.json(data.config);
});

// POST / save app config
app.post('/api/config', (req, res) => {
  try {
    const data = loadServerData();
    data.config = {
      ...data.config,
      ...req.body,
    };
    saveServerData(data);
    res.json({ message: 'Config saved', config: data.config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

// GET / POST registered users and activity
app.get('/api/users', (req, res) => {
  const data = loadServerData();
  res.json({
    registeredUsers: data.registeredUsers || [],
    dailyActivity: data.dailyActivity || [],
  });
});

app.post('/api/users/login', (req, res) => {
  try {
    const { username, firstName } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const cleanUsername = username.startsWith('@') ? username : `@${username}`;
    const data = loadServerData();
    const today = new Date().toISOString().split('T')[0];
    const nowFormatted = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const users = data.registeredUsers || [];
    const existingIdx = users.findIndex(
      (u: any) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    let isNewRegistration = false;
    if (existingIdx >= 0) {
      users[existingIdx] = {
        ...users[existingIdx],
        firstName: firstName || users[existingIdx].firstName,
        lastActiveAt: nowFormatted,
        loginCount: (users[existingIdx].loginCount || 1) + 1,
      };
    } else {
      isNewRegistration = true;
      users.unshift({
        id: `usr-${Date.now()}`,
        username: cleanUsername,
        firstName: firstName || '',
        registeredAt: nowFormatted,
        lastActiveAt: nowFormatted,
        loginCount: 1,
      });
    }

    // Daily activity
    const daily = data.dailyActivity || [];
    const dayIdx = daily.findIndex((d: any) => d.date === today);
    if (dayIdx >= 0) {
      const active = daily[dayIdx].activeUsernames || [];
      if (!active.includes(cleanUsername)) active.push(cleanUsername);
      daily[dayIdx] = {
        ...daily[dayIdx],
        totalVisits: (daily[dayIdx].totalVisits || 0) + 1,
        activeUsernames: active,
        newUsersCount: isNewRegistration
          ? (daily[dayIdx].newUsersCount || 0) + 1
          : daily[dayIdx].newUsersCount || 0,
      };
    } else {
      daily.unshift({
        date: today,
        totalVisits: 1,
        activeUsernames: [cleanUsername],
        newUsersCount: isNewRegistration ? 1 : 0,
      });
    }

    data.registeredUsers = users;
    data.dailyActivity = daily;
    saveServerData(data);

    res.json({ message: 'User logged', user: users[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record user' });
  }
});

// --------------------------------------------------------------------------
// VITE / STATIC CLIENT SERVING
// --------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
