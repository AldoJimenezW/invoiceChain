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
        name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        profession VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255) DEFAULT NULL,
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
        tx_hash VARCHAR(255) UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS crafts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tx_hash VARCHAR(255) NOT NULL,
        from_address VARCHAR(255) NOT NULL,
        to_address VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        COMMENT VARCHAR(1023) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tx_hash) REFERENCES invoices(tx_hash) ON DELETE CASCADE
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
        INSERT INTO users (name, last_name, age, profession, email, phone, password_hash, wallet_address, is_admin) 
        VALUES 
          ('Admin', 'User', 30, 'Administrator', 'admin@example.com', '+1234567890', '$2a$10$encrypted_password_hash1', '0x1234567890123456789012345678901234567890', TRUE),
          ('John', 'Doe', 25, 'Developer', 'user1@example.com', '+1234567891', '$2a$10$encrypted_password_hash2', '0x2345678901234567890123456789012345678901', FALSE),
          ('Jane', 'Smith', 28, 'Designer', 'user2@example.com', '+1234567892', '$2a$10$encrypted_password_hash3', '0x3456789012345678901234567890123456789012', FALSE)
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
        INSERT INTO invoices (invoice_number, user_id, client_name, amount, status, due_date, contract_address, tx_hash) 
        VALUES 
          ('INV-2025-001', 1, 'Client A', 1500.00, 'PAID', '2025-04-15', '0x9876543210987654321098765432109876543210', '0xabc123'),
          ('INV-2025-002', 2, 'Client B', 2200.50, 'PENDING', '2025-04-30', NULL, NULL),
          ('INV-2025-003', 3, 'Client C', 3750.75, 'OVERDUE', '2025-03-15', NULL, NULL)
      `);

      // Seed cards
      await connection.query(`
        INSERT INTO cards (user_id, title, description) 
        VALUES 
          (1, 'Business Card', 'Professional business card design'),
          (2, 'Holiday Card', 'Seasonal greetings card'),
          (3, 'Thank You Card', 'Gratitude expression card')
      `);

      // Seed crafts
      await connection.query(`
        INSERT INTO crafts (user_id, title, description, image) 
        VALUES 
          (1, 'Handmade Pottery', 'Beautiful ceramic vase', 'pottery1.jpg'),
          (2, 'Knitted Scarf', 'Warm winter accessory', 'scarf1.jpg'),
          (3, 'Wooden Sculpture', 'Hand-carved wooden art piece', 'sculpture1.jpg')
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
