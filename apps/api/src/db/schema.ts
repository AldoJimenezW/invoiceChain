import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { CountResult } from '../types/db';

// Carga el archivo .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

console.log('DB Connection Info:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

export const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'blockchain_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        wallet_address VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tx_hash VARCHAR(255) NOT NULL,
        from_address VARCHAR(255) NOT NULL,
        to_address VARCHAR(255) NOT NULL,
        amount DECIMAL(18, 8) NOT NULL,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        amount DECIMAL(18, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        due_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        contract_address VARCHAR(255),
        tx_hash VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function seedDb() {
  const connection = await pool.getConnection();
  try {
    // Verificar si ya hay datos
    const [rows] = await connection.query<CountResult[]>('SELECT COUNT(*) as count FROM users');
    const userCount = rows[0].count;

    if (userCount === 0) {
      // Seed users
      await connection.query(`
        INSERT INTO users (username, email, wallet_address, is_admin) 
        VALUES 
          ('admin', 'admin@example.com', '0x1234567890123456789012345678901234567890', TRUE),
          ('user1', 'user1@example.com', '0x2345678901234567890123456789012345678901', FALSE),
          ('user2', 'user2@example.com', '0x3456789012345678901234567890123456789012', FALSE)
      `);

      // Seed transactions
      await connection.query(`
        INSERT INTO transactions (tx_hash, from_address, to_address, amount, status) 
        VALUES 
          ('0xabc123', '0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901', 1.5, 'COMPLETED'),
          ('0xdef456', '0x2345678901234567890123456789012345678901', '0x3456789012345678901234567890123456789012', 2.25, 'COMPLETED'),
          ('0xghi789', '0x3456789012345678901234567890123456789012', '0x1234567890123456789012345678901234567890', 3.75, 'PENDING')
      `);

      // Seed invoices
      await connection.query(`
        INSERT INTO invoices (invoice_number, user_id, client_name, amount, status, due_date) 
        VALUES 
          ('INV-2025-001', 1, 'Client A', 1500.00, 'PAID', '2025-04-15'),
          ('INV-2025-002', 2, 'Client B', 2200.50, 'PENDING', '2025-04-30'),
          ('INV-2025-003', 3, 'Client C', 3750.75, 'OVERDUE', '2025-03-15')
      `);

      console.log('Database seeded successfully');
    } else {
      console.log('Database already has data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    connection.release();
  }
}
