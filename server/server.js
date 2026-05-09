import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nexus_league',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL Database');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed. Please ensure MySQL is running and the database exists.');
    console.error(err);
  });

// --- API ROUTES ---

// GET: All tournaments
app.get('/api/tournaments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tournaments ORDER BY createdAt DESC');
    // Parse the JSON string back to an object for the frontend
    const tournaments = rows.map(row => ({
      ...row,
      data: JSON.parse(row.data)
    }));
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// POST: Save or Update tournament
app.post('/api/tournaments', async (req, res) => {
  const tournament = req.body;
  if (!tournament || !tournament.id) {
    return res.status(400).json({ error: 'Invalid tournament data' });
  }

  try {
    // We store the full JSON object in a single column for simplicity
    // while keeping metadata exposed in columns for easy searching
    const query = `
      INSERT INTO tournaments (id, code, name, gameType, status, data) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      code = VALUES(code),
      name = VALUES(name),
      gameType = VALUES(gameType),
      status = VALUES(status),
      data = VALUES(data),
      updatedAt = CURRENT_TIMESTAMP
    `;
    
    await pool.query(query, [
      tournament.id,
      tournament.code,
      tournament.name,
      tournament.gameType,
      tournament.status,
      JSON.stringify(tournament)
    ]);

    res.json({ success: true, message: 'Tournament saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save tournament' });
  }
});

// DELETE: Remove tournament
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tournaments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Nexus Backend running on http://localhost:${PORT}`);
});
