import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/schema';
import usersRoutes from './routes/users';
import transactionsRoutes from './routes/transactions';
import invoicesRoutes from './routes/invoices';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/invoices', invoicesRoutes);

app.get('/', (req, res) => {
  res.send('InvoiceChain API is running');
});

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
