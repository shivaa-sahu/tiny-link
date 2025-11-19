import pool from '../../../lib/db';

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT code, target_url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC'
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'POST') {
    const { targetUrl, code } = req.body;

    if (!targetUrl || !isValidUrl(targetUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let finalCode = code;
    if (finalCode) {
      if (!isValidCode(finalCode)) {
        return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
      }
    } else {
      finalCode = generateCode();
    }

    try {
      const result = await pool.query(
        'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *',
        [finalCode, targetUrl]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Code already exists' });
      }
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
