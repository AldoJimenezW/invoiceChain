import express from 'express';
import cors from 'cors';
import { initDb } from './db/schema';
import usersRoutes from './api/users';
import transactionsRoutes from './api/transactions';
import invoicesRoutes from './api/invoices';
import cardsRoutes from './api/cards';
import reviewsRoutes from './api/reviews';
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from './lib/auth';

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.DB_HOST || 'localhost';
const PORT_WEB = process.env.PORT_WEB || 3000;

// Define allowed origins as an array
const allowedOrigins = [
  `http://${HOST}:${PORT_WEB}`,
  'http://localhost:3000',
  // Add more origins as needed
];

// Use a function to check the origin
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/reviews', reviewsRoutes);

app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
  res.json({
    message: 'InvoiceChain API is running',
    endpoints: {
      health: '/health',
    },
  });
});

app.get("/test", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const startServer = async () => {
  try {
    // Comentar para NO crear la base de datos - RD
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
