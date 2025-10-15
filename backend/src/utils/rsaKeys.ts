import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { KeyPair } from '../types';


const KEYS_DIR = path.join(__dirname, '../../keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private-key.pem');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public-key.pem');


// Generate a new RSA-4096 key pair
export function generateKeyPair(): KeyPair {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { privateKey, publicKey };
}


export function saveKeyPair(keyPair: KeyPair): void {
  // Create keys directory if it doesn't exist
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true });
  }

  fs.writeFileSync(PRIVATE_KEY_PATH, keyPair.privateKey);
  fs.writeFileSync(PUBLIC_KEY_PATH, keyPair.publicKey);
}

// Load existing key pair from environment, disk, or generate new one
export function loadOrGenerateKeyPair(): KeyPair {
  // Try to load from environment variables
  if (process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
    return {
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      publicKey: process.env.PUBLIC_KEY.replace(/\\n/g, '\n'),
    };
  }

  // Try to load existing keys from file system 
  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    try {
      const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
      const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
      
      if (privateKey && publicKey) {
        return { privateKey, publicKey };
      }
    } catch (error) {
      console.error('Failed to read keys from file system:', error);
    }
  }

  // Generate new key pair if loading failed or keys don't exist
  const keyPair = generateKeyPair();
  saveKeyPair(keyPair);
  return keyPair;
}

// Get the current public key
export function getPublicKey(): string {
  const keyPair = loadOrGenerateKeyPair();
  return keyPair.publicKey;
}

// Get the current private key
export function getPrivateKey(): string {
  const keyPair = loadOrGenerateKeyPair();
  return keyPair.privateKey;
}
