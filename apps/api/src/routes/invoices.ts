import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Invoice } from '../types/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Invoice[]>(`
      SELECT i.*, u.name, u.last_name, u.email, u.wallet_address
      FROM invoices i
      JOIN users u ON i.user_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<Invoice[]>(
      `
      SELECT i.*, u.name, u.last_name, u.email, u.wallet_address
      FROM invoices i
      JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

router.post('/', async (req, res) => {
  const { invoiceNumber, userId, clientName, amount, status, dueDate, contractAddress, txHash } =
    req.body;

  if (!invoiceNumber || !userId || !clientName || amount === undefined || !status || !dueDate) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO invoices 
       (invoice_number, user_id, client_name, amount, status, due_date, contract_address, tx_hash) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoiceNumber, userId, clientName, amount, status, dueDate, contractAddress, txHash]
    );

    res.status(201).json({
      id: result.insertId,
      invoiceNumber,
      userId,
      clientName,
      amount,
      status,
      dueDate,
      contractAddress,
      txHash,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Error creating invoice' });
  }
});

router.put('/:id', async (req, res) => {
  const { invoiceNumber, userId, clientName, amount, status, dueDate, contractAddress, txHash } =
    req.body;
  const invoiceId = req.params.id;

  try {
    await pool.query(
      `UPDATE invoices 
       SET invoice_number = ?, user_id = ?, client_name = ?, amount = ?, 
           status = ?, due_date = ?, contract_address = ?, tx_hash = ? 
       WHERE id = ?`,
      [
        invoiceNumber,
        userId,
        clientName,
        amount,
        status,
        dueDate,
        contractAddress,
        txHash,
        invoiceId,
      ]
    );

    res.json({
      id: invoiceId,
      invoiceNumber,
      userId,
      clientName,
      amount,
      status,
      dueDate,
      contractAddress,
      txHash,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Error updating invoice' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM invoices WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Error deleting invoice' });
  }
});

export default router;
