import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      ok: true,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
}
