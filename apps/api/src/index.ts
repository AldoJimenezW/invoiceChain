import express from 'express';
import cors from 'cors';
import { initDb } from './db/schema';
import usersRoutes from './routes/users';
import transactionsRoutes from './routes/transactions';
import invoicesRoutes from './routes/invoices';
import cardsRoutes from './routes/cards';
import reviewsRoutes from './routes/reviews';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.json({
    message: 'InvoiceChain API is running',
    endpoints: {
      health: '/health',
    },
  });
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access the API at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
