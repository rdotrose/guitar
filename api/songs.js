import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const sort = req.query.sort || 'title';
  const direction = req.query.direction === 'desc' ? 'DESC' : 'ASC';

  let orderBy = 'title ASC, artist, times_played DESC, last_played DESC'; // default

  if (sort === 'title') {
    orderBy = `title ${direction}, artist, times_played DESC, last_played DESC`;
  } else if (sort === 'artist') {
    orderBy = `artist ${direction}, title, times_played DESC, last_played DESC`;
  } else if (sort === 'times_played') {
    orderBy = `times_played ${direction}, title, artist, last_played DESC`;
  } else if (sort === 'last_played') {
    orderBy = `last_played ${direction}, title, artist, times_played DESC`;
  }

  try {
    const result = await pool.query(`SELECT * FROM songs ORDER BY ${orderBy}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
