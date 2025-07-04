import express from 'express';
import { pool } from '../db/schema';
import { ResultSetHeader } from 'mysql2';
import { Craft } from '../types/db';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<Craft[]>(
      `
      SELECT *
      FROM craft
      WHERE craft.userId = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Crafts not found' });
    }

    // Return all matching crafts
    res.json(rows);
  } catch (error) {
    console.error('Error fetching crafts:', error);
    res.status(500).json({ error: 'Error fetching crafts' });
  }
});


export default router;
