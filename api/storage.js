import Redis from 'ioredis';

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.KV_REDIS_URL);
  }
  return redis;
}

export default async function handler(req, res) {
  const client = getRedis();

  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key mancante' });
    const value = await client.get(key);
    if (value === null) {
      return res.status(404).json({ error: 'non trovato' });
    }
    return res.status(200).json({ key, value });
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ error: 'key mancante' });
    await client.set(key, value);
    return res.status(200).json({ key, value });
  }

  if (req.method === 'DELETE') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key mancante' });
    await client.del(key);
    return res.status(200).json({ key, deleted: true });
  }

  return res.status(405).json({ error: 'metodo non consentito' });
}
