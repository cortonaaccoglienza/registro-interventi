import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'metodo non consentito' });
  }
  const prefix = req.query.prefix || '';
  const keys = await kv.keys(prefix + '*');
  return res.status(200).json({ keys });
}
