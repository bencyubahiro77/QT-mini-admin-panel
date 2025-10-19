import app from './app';
import { env, disconnectDatabase } from './config';
import { initializeProtobuf } from './services/protobuf.service';
import { loadOrGenerateKeyPair } from './utils/rsaKeys';

async function startServer() {
  try {
    loadOrGenerateKeyPair();
    await initializeProtobuf();

    const server = app.listen(env.PORT, () => {
      console.log(`Server: http://localhost:${env.PORT}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        try {
          await disconnectDatabase();
          console.log('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('cFailed to start server:', error);
    process.exit(1);
  }
}

startServer();
