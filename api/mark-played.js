import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing song ID' });
  }

  try {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await pool.query(
      `UPDATE songs SET times_played = times_played + 1, last_played = $1 WHERE id = $2`,
      [timestamp, id]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
