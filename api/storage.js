import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key mancante' });
    const value = await kv.get(key);
    if (value === null || value === undefined) {
      return res.status(404).json({ error: 'non trovato' });
    }
    return res.status(200).json({ key, value });
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ error: 'key mancante' });
    await kv.set(key, value);
    return res.status(200).json({ key, value });
  }

  if (req.method === 'DELETE') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key mancante' });
    await kv.del(key);
    return res.status(200).json({ key, deleted: true });
  }

  return res.status(405).json({ error: 'metodo non consentito' });
}
