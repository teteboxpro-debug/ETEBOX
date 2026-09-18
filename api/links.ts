import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory cache fallback for serverless execution
let inMemoryLinks: any[] = [
  {
    id: 'link-welcome-2026',
    title: 'WELCOME 2026',
    url: 'https://rentry.co/WELCOME_2026',
    date: '2026-09-17',
    category: 'Official',
    isNew: true,
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inMemoryLinks);
  }

  if (req.method === 'POST') {
    const { title, url, date, category, isNew } = req.body || {};
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const newLink = {
      id: `link-${Date.now()}`,
      title: String(title).trim(),
      url: String(url).trim(),
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'Official',
      isNew: Boolean(isNew),
    };

    inMemoryLinks = [newLink, ...inMemoryLinks];
    return res.status(201).json({ success: true, links: inMemoryLinks });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Link ID required' });
    }
    inMemoryLinks = inMemoryLinks.filter((l) => l.id !== id);
    return res.status(200).json({ success: true, links: inMemoryLinks });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
