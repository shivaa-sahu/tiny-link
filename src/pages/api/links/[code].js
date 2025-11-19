import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT code, target_url, clicks, last_clicked, created_at FROM links WHERE code = $1',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM links WHERE code = $1 RETURNING *',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      res.status(200).json({ message: 'Link deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
