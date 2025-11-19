import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await pool.query(
      'SELECT target_url FROM links WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP WHERE code = $1',
      [code]
    );

    res.status(200).json({ target_url: result.rows[0].target_url });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
}
