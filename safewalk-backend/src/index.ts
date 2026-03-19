import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppDataSource } from './config/database';

// Routes
import activityRoutes from './routes/activity';
import authRoutes from './routes/auth';
import emergencyRoutes from './routes/emergency';
import escortRoutes from './routes/escorts';
import incidentRoutes from './routes/incidents';
import routeRoutes from './routes/routes';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8082', 'http://127.0.0.1:8082', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8081', 'http://127.0.0.1:8081', 'exp://localhost:8082', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Allow all origins for local development
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'SafeWalk Backend is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', incidentRoutes);
app.use('/api', routeRoutes);
app.use('/api', escortRoutes);
app.use('/api', emergencyRoutes);
app.use('/api', activityRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await AppDataSource.initialize();
    console.log('✓ Database connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🛡️  SafeWalk Backend running on http://0.0.0.0:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 API Base: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
