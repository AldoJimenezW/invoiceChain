import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Review } from '../types/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Review[]>('SELECT * FROM reviews');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

router.post('/', async (req, res) => {
  const { txHash, fromAddress, toAddress, rating, comment } = req.body;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO reviews (tx_hash, from_address, to_address, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [txHash, fromAddress, toAddress, rating, comment]
    );

    res.status(201).json({
      id: result.insertId,
      txHash,
      fromAddress,
      toAddress,
      rating,
      comment
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
});

export default router;
