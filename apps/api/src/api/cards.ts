import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Card } from '../types/db';
import { verifySession } from '../utils/verifySession';

const router = express.Router();

router.get('/:amount', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  // Extract and parse the amount parameter
  const amount = parseInt(req.params.amount, 10);

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount specified. Must be a positive integer.' });
  }

  try {
    const [rows] = await pool.query<Card[]>('SELECT * FROM card LIMIT ?', [amount]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

router.get('/with-image/:amount', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  // Extract and parse the amount parameter
  const amount = parseInt(req.params.amount, 10);

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount specified. Must be a positive integer.' });
  }

  try {
    // Fetch cards associated with users who have an image
    const [rows] = await pool.query<Card[]>(
      'SELECT c.*, u.image FROM card c JOIN user u ON c.userId = u.id LIMIT ?',
      [amount]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

router.post('/', async (req, res) => {
  const { userId, title, description } = req.body;
  console.log(userId, title, description)
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO card (userId, title, description) VALUES (?, ?, ?)',
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
