import app from './app';
import { initializeProtobuf } from './services/protobuf.service';
import { loadOrGenerateKeyPair } from './utils/rsaKeys';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize RSA key pair
    loadOrGenerateKeyPair();

    // Initialize Protobuf schemas
    await initializeProtobuf();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    process.exit(1);
  }
}

startServer();
