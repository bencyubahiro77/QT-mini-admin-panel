import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, env, prisma } from './config';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';
import userRoutes from './routes/user.routes';

const app: Application = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging (only in development)
if (env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Admin Panel API',
    version: '1.0.0',
    description: 'REST API with Protobuf serialization and RSA cryptographic signatures',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      users: '/api/users',
    }
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Admin Panel API Docs',
}));

// Health check endpoint with database status
app.get('/health', async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    database: 'unknown',
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.database = 'connected';
  } catch (error) {
    healthCheck.database = 'disconnected';
    healthCheck.status = 'unhealthy';
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// API Routes
app.use('/api/users', userRoutes);

// 404 Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
