import type { VercelRequest, VercelResponse } from '@vercel/node';

let inMemoryConfig: any = {
  freeVideosUrl: 'https://rentry.co/Teteboxvip',
  vipStoreUrl: 'https://rentry.co/VIP2026',
  storageUrl: 'https://rentry.co/Cloud_ETEBOX',
  botUrl: 'https://telebotcreator.com/bots/66275456',
  telegramSupportAccount: '@EteboxSupport',
  tiktokUrl: 'https://www.tiktok.com/@eteboxvip',
  instagramUrl: 'https://www.instagram.com/eteboxvip',
  whatsappUrl: 'https://wa.me/message/ETEBOXVIP',
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inMemoryConfig);
  }

  if (req.method === 'POST') {
    inMemoryConfig = { ...inMemoryConfig, ...(req.body || {}) };
    return res.status(200).json({ success: true, config: inMemoryConfig });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
