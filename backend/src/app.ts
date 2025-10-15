import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import userRoutes from './routes/user.routes';


const app: Application = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Admin Panel API',
    version: '1.0.0',
    description: 'REST API with Protobuf serialization and RSA cryptographic signatures',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
    }
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Admin Panel API Docs',
}));

// Health check endpoint 
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

export default app;
