import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, title, artist, capo, chords, lyrics, action, id } = req.body;

  
  // if (action !== 'auth' && password !== process.env.ADMIN_PASSWORD) {
  //   return res.status(403).json({ error: 'Unauthorized' });
  // }

  
  if (action === 'auth') {
    if (password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
  }


  if (action === 'create') {
    try {
      await pool.query(
        'INSERT INTO songs (title, artist, capo, chords, lyrics) VALUES ($1, $2, $3, $4, $5)',
        [title, artist, capo, chords, lyrics]
      );
      return res.status(200).json({ message: 'Song added successfully!' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }
  
  if (action === 'read') {
    try {
      let result;
      if (id) {
        result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
      } else if (title) {
        result = await pool.query('SELECT * FROM songs WHERE title ILIKE $1 LIMIT 1', [`%${title}%`]);
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Song not found' });
      }

      return res.status(200).json({ song: result.rows[0] });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (action === 'update') {
    try {
      await pool.query(
        'UPDATE songs SET title = $1, artist = $2, capo = $3, chords = $4, lyrics = $5 WHERE id = $6',
        [title, artist, capo, chords, lyrics, id]
      );
      return res.status(200).json({ message: 'Song updated successfully!' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }



  return res.status(400).json({ error: 'Invalid action' });
}
