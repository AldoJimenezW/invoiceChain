import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Transaction } from '../types/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Transaction[]>('SELECT * FROM transactions');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<Transaction[]>('SELECT * FROM transactions WHERE id = ?', [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
});

router.post('/', async (req, res) => {
  const { txHash, fromAddress, toAddress, amount, status } = req.body;

  if (!txHash || !fromAddress || !toAddress || amount === undefined || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO transactions (tx_hash, from_address, to_address, amount, status) VALUES (?, ?, ?, ?, ?)',
      [txHash, fromAddress, toAddress, amount, status]
    );

    res.status(201).json({
      id: result.insertId,
      txHash,
      fromAddress,
      toAddress,
      amount,
      status,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

router.put('/:id', async (req, res) => {
  const { txHash, fromAddress, toAddress, amount, status } = req.body;
  const transactionId = req.params.id;

  try {
    await pool.query(
      'UPDATE transactions SET tx_hash = ?, from_address = ?, to_address = ?, amount = ?, status = ? WHERE id = ?',
      [txHash, fromAddress, toAddress, amount, status, transactionId]
    );

    res.json({
      id: transactionId,
      txHash,
      fromAddress,
      toAddress,
      amount,
      status,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

export default router;
