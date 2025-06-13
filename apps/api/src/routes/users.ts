import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { User } from '../types/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<User[]>(
      'SELECT id, name, last_name, email, wallet_address, is_admin, is_active, created_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<User[]>(
      'SELECT id, name, last_name, email, wallet_address, is_admin, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.post('/', async (req, res) => {
  const { name, lastName, age, profession, email, phone, password, walletAddress, isAdmin } = req.body;

  if (!name || !lastName || !age || !email || !password) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, last_name, age, profession, email, phone, password_hash, wallet_address, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, lastName, age, profession, email, phone, password, walletAddress, isAdmin || false]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      lastName,
      age,
      profession,
      email,
      phone,
      walletAddress,
      isAdmin: isAdmin || false,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, lastName, email, walletAddress, isAdmin, isActive } = req.body;
  const userId = req.params.id;

  try {
    await pool.query(
      'UPDATE users SET name = ?, last_name = ?, email = ?, wallet_address = ?, is_admin = ?, is_active = ? WHERE id = ?',
      [name, lastName, email, walletAddress, isAdmin, isActive, userId]
    );

    res.json({ 
      id: userId, 
      name, 
      lastName, 
      email, 
      walletAddress, 
      isAdmin, 
      isActive 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
