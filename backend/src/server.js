import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware (Great for DevOps monitoring logs!)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Health check endpoint (Essential for Docker container & DevOps health checks!)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: 'Amazon RDS (PostgreSQL)',
    timestamp: new Date().toISOString(),
    service: 'Netflix-Backend-API',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Netflix Clone DevOps REST API (Powered by Amazon RDS PostgreSQL)',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      movies: '/api/movies',
    },
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const startServer = async () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Netflix DevOps Backend Server running on port ${PORT}`);
    console.log(`📡 Healthcheck URL: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  try {
    await prisma.$connect();
    console.log('[Database] Connected successfully to Amazon RDS PostgreSQL via Prisma Client!');
  } catch (error) {
    console.error('[Database Error] Could not connect to Amazon RDS PostgreSQL:', error.message);
  }
};

startServer();
