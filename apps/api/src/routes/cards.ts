import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Card } from '../types/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Card[]>('SELECT * FROM cards');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

router.post('/', async (req, res) => {
  const { userId, title, description } = req.body;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO cards (user_id, title, description) VALUES (?, ?, ?)',
      [userId, title, description]
    );

    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      description
    });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Error creating card' });
  }
});

export default router;
