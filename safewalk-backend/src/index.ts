import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/database';

// Routes
import authRoutes from './routes/auth';
import incidentRoutes from './routes/incidents';
import routeRoutes from './routes/routes';
import escortRoutes from './routes/escorts';
import emergencyRoutes from './routes/emergency';
import activityRoutes from './routes/activity';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors()); // Allow all origins for local development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    app.listen(PORT, () => {
      console.log(`\n🛡️  SafeWalk Backend running on http://localhost:${PORT}`);
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
