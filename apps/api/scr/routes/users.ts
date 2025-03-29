import express from 'express';
import { pool } from '../db/schema';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, wallet_address, is_admin, is_active, created_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, wallet_address, is_admin, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.post('/', async (req, res) => {
  const { username, email, walletAddress, isAdmin } = req.body;

  if (!username || !email || !walletAddress) {
    return res.status(400).json({ error: 'Username, email and wallet address are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, wallet_address, is_admin) VALUES (?, ?, ?, ?)',
      [username, email, walletAddress, isAdmin || false]
    );

    res.status(201).json({
      id: (result as any).insertId,
      username,
      email,
      walletAddress,
      isAdmin: isAdmin || false,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/:id', async (req, res) => {
  const { username, email, walletAddress, isAdmin, isActive } = req.body;
  const userId = req.params.id;

  try {
    await pool.query(
      'UPDATE users SET username = ?, email = ?, wallet_address = ?, is_admin = ?, is_active = ? WHERE id = ?',
      [username, email, walletAddress, isAdmin, isActive, userId]
    );

    res.json({ id: userId, username, email, walletAddress, isAdmin, isActive });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
