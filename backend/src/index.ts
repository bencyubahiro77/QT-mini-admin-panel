import app from './app';
import { env, disconnectDatabase } from './config';
import { initializeProtobuf } from './services/protobuf.service';
import { loadOrGenerateKeyPair } from './utils/rsaKeys';
import { logger } from './utils/logger';

async function startServer() {
  try {
    loadOrGenerateKeyPair();
    await initializeProtobuf();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectDatabase();
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
