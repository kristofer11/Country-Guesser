import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Use the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Scores endpoints
app.get('/api/scores', async (req, res) => {
  const result = await pool.query('SELECT * FROM scores ORDER BY streak DESC');
  res.json(result.rows);
});

app.post('/api/scores', async (req, res) => {
  const { name, streak } = req.body;
  const result = await pool.query(
    'INSERT INTO scores (name, streak) VALUES ($1, $2) RETURNING *',
    [name, streak]
  );
  res.json(result.rows[0]);
});

// Comments endpoints
app.get('/api/comments', async (req, res) => {
  const result = await pool.query('SELECT * FROM comments ORDER BY timestamp DESC');
  res.json(result.rows);
});

app.post('/api/comments', async (req, res) => {
  const { author, content, timestamp } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (author, content, timestamp) VALUES ($1, $2, $3) RETURNING *',
    [author, content, timestamp]
  );
  res.json(result.rows[0]);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 