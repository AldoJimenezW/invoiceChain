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
        biography VARCHAR(255),
        facebook VARCHAR(255),
        twitter VARCHAR(255),
        instagram VARCHAR(255),
        phone VARCHAR(20),
        walletAddress VARCHAR(255) DEFAULT NULL,
        role VARCHAR(50),
        isAdmin BOOLEAN DEFAULT FALSE,
        location VARCHAR(255) -- Added location column
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
        invoiceNumber VARCHAR(50) NOT NULL,
        fromAddress VARCHAR(255) NOT NULL,
        toAddress VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment VARCHAR(1023) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoiceNumber) REFERENCES invoice(invoiceNumber) ON DELETE CASCADE
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
      // Define sample user UUIDs
      const adminUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      const user1Id = 'b2c3d4e5-f678-9012-3456-7890abcdef12';
      const user2Id = 'c3d4e5f6-7890-1234-5678-90abcdef1234';

      // Define sample wallet addresses (matching seeded users)
      const adminWallet = '0x1234567890123456789012345678901234567890';
      const user1Wallet = '0x2345678901234567890123456789012345678901';
      const user2Wallet = '0x3456789012345678901234567890123456789012';

      // Seed users
      await connection.query(`
        INSERT INTO user (id, name, lastName, age, profession, email, emailVerified, image, createdAt, updatedAt, biography, facebook, twitter, instagram, phone, walletAddress, role, isAdmin, location) -- Added location
        VALUES
          ('${adminUserId}', 'Admin', 'User', 30, 'Administrator', 'admin@example.com', TRUE, NULL, NOW(), NOW(), 'System administrator', NULL, NULL, NULL, '+1234567890', '${adminWallet}', 'admin', TRUE, 'New York, USA'), -- Added location value
          ('${user1Id}', 'John', 'Doe', 25, 'Developer', 'user1@example.com', TRUE, NULL, NOW(), NOW(), 'Passionate developer', NULL, NULL, NULL, '+1234567891', '${user1Wallet}', 'user', FALSE, 'London, UK'), -- Added location value
          ('${user2Id}', 'Jane', 'Smith', 28, 'Designer', 'user2@example.com', TRUE, NULL, NOW(), NOW(), NULL, NULL, NULL, NULL, '+1234567892', '${user2Wallet}', 'user', FALSE, 'Paris, France') -- Added location value
      `);

      // Seed transactions
      await connection.query(`
        INSERT INTO transaction (txHash, fromAddress, toAddress, amount, status)
        VALUES
          ('0xabc123', '${user1Wallet}', '${adminWallet}', 1.5, 'COMPLETED'),
          ('0xdef456', '${user2Wallet}', '${user1Wallet}', 2.25, 'COMPLETED'),
          ('0xghi789', '${adminWallet}', '${user2Wallet}', 3.75, 'PENDING')
      `);

      // Seed invoices
      await connection.query(`
        INSERT INTO invoice (invoiceNumber, userId, clientName, amount, status, dueDate, contractAddress, txHash)
        VALUES
          ('INV-2025-001', '${user1Id}', 'Client A', 1500.00, 'PAID', '2025-04-15', '0x9876543210987654321098765432109876543210', '0xabc123'),
          ('INV-2025-002', '${user2Id}', 'Client B', 2200.50, 'PENDING', '2025-04-30', NULL, NULL),
          ('INV-2025-003', '${adminUserId}', 'Client C', 3750.75, 'OVERDUE', '2025-03-15', NULL, NULL)
      `);

      // Seed cards
      await connection.query(`
        INSERT INTO card (userId, title, description)
        VALUES
          ('${adminUserId}', 'Business Card', 'Professional business card design'),
          ('${user1Id}', 'Holiday Card', 'Seasonal greetings card'),
          ('${user2Id}', 'Thank You Card', 'Gratitude expression card')
      `);

      // Seed crafts
      await connection.query(`
        INSERT INTO craft (userId, title, description, image)
        VALUES
          ('${adminUserId}', 'Handmade Pottery', 'Beautiful ceramic vase', 'pottery1.jpg'),
          ('${user1Id}', 'Knitted Scarf', 'Warm winter accessory', 'scarf1.jpg'),
          ('${user2Id}', 'Wooden Sculpture', 'Hand-carved wooden art piece', 'sculpture1.jpg')
      `);

      // Seed reviews
      await connection.query(`
        INSERT INTO review (invoiceNumber, fromAddress, toAddress, rating, comment)
        VALUES
          ('INV-2025-001', '${adminWallet}', '${user1Wallet}', 5, 'Excellent service and prompt payment!'),
          ('INV-2025-001', '${user2Wallet}', '${user1Wallet}', 4, 'Smooth transaction, good communication.'),
          ('INV-2025-002', '${adminWallet}', '${user2Wallet}', 3, 'Invoice is pending, hoping for timely payment.'),
          ('INV-2025-002', '${user1Wallet}', '${user2Wallet}', 4, 'Client B is usually reliable.'),
          ('INV-2025-003', '${user1Wallet}', '${adminWallet}', 2, 'Payment is overdue, needs follow-up.'),
          ('INV-2025-003', '${user2Wallet}', '${adminWallet}', 1, 'Significant delay in payment.'),
          ('INV-2025-001', '${user1Wallet}', '${adminWallet}', 5, 'Received payment quickly.'),
          ('INV-2025-002', '${user2Wallet}', '${user1Wallet}', 3, 'Waiting for payment on this one.'),
          ('INV-2025-003', '${adminWallet}', '${user2Wallet}', 2, 'Still no payment received.'),
          ('INV-2025-001', '${user2Wallet}', '${user1Wallet}', 5, 'Highly recommend this service!')
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
