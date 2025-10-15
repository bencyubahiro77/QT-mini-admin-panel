/**
 * RSA Key Pair Generator for Production
 * 
 * Run this script to generate RSA-4096 key pairs for production deployment
 * The keys will be printed to console - save them securely!
 * 
 * Usage: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating RSA-4096 Key Pair for Production...\n');

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

console.log('✅ Keys generated successfully!\n');
console.log('═══════════════════════════════════════════════════════════');
console.log('PRIVATE_KEY (Keep this SECRET!):');
console.log('═══════════════════════════════════════════════════════════');
console.log(privateKey);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('PUBLIC_KEY:');
console.log('═══════════════════════════════════════════════════════════');
console.log(publicKey);

console.log('\n📋 Instructions:');
console.log('1. Copy both keys and store them securely (password manager)');
console.log('2. Set them as environment variables in your hosting platform:');
console.log('   - PRIVATE_KEY="<paste-private-key-here>"');
console.log('   - PUBLIC_KEY="<paste-public-key-here>"');
console.log('3. Never commit these keys to git!');
console.log('4. Use the same keys across all production instances\n');

console.log('⚠️  WARNING: If you regenerate keys, all existing signatures will be invalid!\n');
