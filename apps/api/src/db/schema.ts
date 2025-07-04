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
      CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        emailVerified BOOLEAN NOT NULL, 
        image TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        name VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        age INT,
        profession VARCHAR(255),
        phone VARCHAR(20),
        walletAddress VARCHAR(255) DEFAULT NULL,
        isAdmin BOOLEAN DEFAULT FALSE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transaction (
        id INT AUTO_INCREMENT PRIMARY KEY,
        txHash VARCHAR(255) NOT NULL,
        fromAddress VARCHAR(255) NOT NULL,
        toAddress VARCHAR(255) NOT NULL,
        amount DECIMAL(18, 8) NOT NULL,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoice (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoiceNumber VARCHAR(50) NOT NULL UNIQUE,
        userId VARCHAR(36) NOT NULL,
        clientName VARCHAR(255) NOT NULL,
        amount DECIMAL(18, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        dueDate DATE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        contractAddress VARCHAR(255),
        txHash VARCHAR(255) UNIQUE,
        FOREIGN KEY (userId) REFERENCES user(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS card (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS craft (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        image VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS review (
        id INT AUTO_INCREMENT PRIMARY KEY,
        txHash VARCHAR(255) NOT NULL,
        fromAddress VARCHAR(255) NOT NULL,
        toAddress VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment VARCHAR(1023) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (txHash) REFERENCES invoice(txHash) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS verification (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS session (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        expiresAt DATETIME NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId VARCHAR(36) NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS account (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId VARCHAR(36) NOT NULL,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt DATETIME,
        refreshTokenExpiresAt DATETIME,
        scope TEXT,
        password TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
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
    const [rows] = await connection.query<CountResult[]>('SELECT COUNT(*) as count FROM user');
    const userCount = rows[0].count;

    if (userCount === 0) {
      // Seed users
      await connection.query(`
        INSERT INTO user (name, lastName, age, profession, email, phone, passwordHash, walletAddress, isAdmin) 
        VALUES 
          ('Admin', 'User', 30, 'Administrator', 'admin@example.com', '+1234567890', '$2a$10$encrypted_password_hash1', '0x1234567890123456789012345678901234567890', TRUE),
          ('John', 'Doe', 25, 'Developer', 'user1@example.com', '+1234567891', '$2a$10$encrypted_password_hash2', '0x2345678901234567890123456789012345678901', FALSE),
          ('Jane', 'Smith', 28, 'Designer', 'user2@example.com', '+1234567892', '$2a$10$encrypted_password_hash3', '0x3456789012345678901234567890123456789012', FALSE)
      `);

      // Seed transactions
      await connection.query(`
        INSERT INTO transaction (txHash, fromAddress, toAddress, amount, status) 
        VALUES 
          ('0xabc123', '0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901', 1.5, 'COMPLETED'),
          ('0xdef456', '0x2345678901234567890123456789012345678901', '0x3456789012345678901234567890123456789012', 2.25, 'COMPLETED'),
          ('0xghi789', '0x3456789012345678901234567890123456789012', '0x1234567890123456789012345678901234567890', 3.75, 'PENDING')
      `);

      // Seed invoices
      await connection.query(`
        INSERT INTO invoice (invoiceNumber, userId, clientName, amount, status, dueDate, contractAddress, txHash) 
        VALUES 
          ('INV-2025-001', 1, 'Client A', 1500.00, 'PAID', '2025-04-15', '0x9876543210987654321098765432109876543210', '0xabc123'),
          ('INV-2025-002', 2, 'Client B', 2200.50, 'PENDING', '2025-04-30', NULL, NULL),
          ('INV-2025-003', 3, 'Client C', 3750.75, 'OVERDUE', '2025-03-15', NULL, NULL)
      `);

      // Seed cards
      await connection.query(`
        INSERT INTO card (userId, title, description) 
        VALUES 
          (1, 'Business Card', 'Professional business card design'),
          (2, 'Holiday Card', 'Seasonal greetings card'),
          (3, 'Thank You Card', 'Gratitude expression card')
      `);

      // Seed crafts
      await connection.query(`
        INSERT INTO craft (userId, title, description, image) 
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
