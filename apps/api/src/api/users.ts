import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { User } from '../types/db';
import { verifySession } from '../utils/verifySession';

const router = express.Router();

// List of user fields as per schema/interface (excluding id, created_at, updated_at for insert)
const userFields = [
  'name', 'lastName', 'age', 'profession', 'biography', 'facebook', 'twitter', 'instagram',
  'email', 'email_verified', 'image', 'phone', 'wallet_address', 'role', 'is_admin', 'is_active'
];

// Utility: pick only allowed fields from an object
function pickUserFields(obj: any) {
  const result: any = {};
  for (const key of userFields) {
    if (typeof obj[key] !== 'undefined') result[key] = obj[key];
  }
  return result;
}

// Utility: generate SQL placeholders and values for insert/update
function getInsertPlaceholders(fields: string[]) {
  return fields.map(() => '?').join(', ');
}
function getUpdateAssignments(fields: string[]) {
  return fields.map(f => `${f} = ?`).join(', ');
}

router.get('/', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  try {
    const [rows] = await pool.query<User[]>(
      `SELECT * FROM user`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  try {
    const [rows] = await pool.query<User[]>(
      `SELECT id, name, lastName, age, profession, biography, facebook, twitter, instagram, image, phone, role, createdAt FROM user WHERE id = ?`,
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

router.get('/getUserIdByCardId/:id', async (req, res) => {
  try {
    // Assuming a 'card' table exists with 'id' and 'userId' columns
    const row = await pool.query<User[]>(
      `SELECT u.id
       FROM user u
       JOIN card c ON u.id = c.userId
       WHERE c.id = ?`,
      [req.params.id] // req.params.id is the card ID
    );


    res.json(row[0]);
  } catch (error) {
    console.error('Error fetching user by card ID:', error);
    res.status(500).json({ error: 'Error fetching user by card ID' });
  }
});


router.post('/', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  const userData = pickUserFields(req.body);

  // Required fields check (customize as needed)
  if (!userData.name || !userData.lastName || !userData.age || !userData.email || typeof userData.email_verified === 'undefined') {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const fields = userFields;
    const placeholders = getInsertPlaceholders(fields);
    const values = fields.map(f => userData[f] ?? null);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO user (id, ${fields.join(', ')}, created_at, updated_at) VALUES (UUID(), ${placeholders}, NOW(), NOW())`,
      values
    );

    res.status(201).json({
      id: result.insertId,
      ...userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/:id', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  const userData = pickUserFields(req.body);
  const userId = req.params.id;

  try {
    const fields = Object.keys(userData);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    const assignments = getUpdateAssignments(fields);
    const values = fields.map(f => userData[f]);
    values.push(userId);

    await pool.query(
      `UPDATE user SET ${assignments}, updated_at = NOW() WHERE id = ?`,
      values
    );

    res.json({
      id: userId,
      ...userData
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM user WHERE id = ?', [
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

router.post('/set-role', async (req, res) => {
  const session = await verifySession(req, res);
  if (!session) return;

  const { role } = req.body;
  const allowedRoles = ['creator', 'customer'];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE user SET role = ? WHERE id = ?',
      [role, session.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
});


router.get('/top-users/:count', async (req, res) => {
  const session = await verifySession(req, res);
  console.log(session)
  if (!session) return;

  const count = parseInt(req.params.count, 10);

  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count parameter' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        u.*, 
        AVG(r.rating) AS rating
      FROM review r
      JOIN invoice i ON r.toAddress = i.invoiceNumber
      JOIN user u ON i.userId = u.id
      GROUP BY u.id
      ORDER BY rating DESC
      LIMIT ?
    `, [count]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching top rated users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
