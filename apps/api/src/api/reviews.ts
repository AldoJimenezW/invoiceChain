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


import { RowDataPacket } from 'mysql2';

router.get('/to/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Correct typing for returned rows
    const [invoiceRows] = await pool.query<RowDataPacket[]>(
      'SELECT invoiceNumber FROM invoice WHERE userId = ?',
      [userId]
    );

    if (invoiceRows.length === 0) {
      return res.status(404).json({ error: 'No invoices found for this user ID' });
    }

    // Extract invoice numbers
    const invoiceNumbers = invoiceRows.map((row: any) => row.invoiceNumber);
    console.log(invoiceNumbers)
    // Build placeholders for IN clause
    const placeholders = invoiceNumbers.map(() => '?').join(',');

    // Query reviews that match any of the invoice numbers
    const [reviewRows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM review WHERE toAddress IN (${placeholders})`,
      invoiceNumbers
    );

    res.json(reviewRows);
  } catch (error) {
    console.error(`Error fetching reviews for user ID ${userId}:`, error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});


export default router;
