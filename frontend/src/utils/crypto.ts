async function pemToKey(pem: string): Promise<CryptoKey> {
  // Remove PEM header/footer and whitespace
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pem
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');

  // Convert base64 to binary
  const binaryDer = atob(pemContents);
  const binaryDerArray = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    binaryDerArray[i] = binaryDer.charCodeAt(i);
  }

  // Import the key
  return await crypto.subtle.importKey(
    'spki',
    binaryDerArray.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-384',
    },
    true,
    ['verify']
  );
}

/**
 * Hash data using SHA-384
 */
async function sha384Hash(data: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  return await crypto.subtle.digest('SHA-384', dataBuffer);
}

/**
 * Convert hex string to ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

/**
 * Verify RSA signature
 */
export async function verifySignature(
  email: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> {
  try {
    // Import public key
    const publicKey = await pemToKey(publicKeyPem);

    // Convert signature from base64 to ArrayBuffer
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));

    // Encode email data
    const encoder = new TextEncoder();
    const emailData = encoder.encode(email);

    // Verify signature
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureBytes,
      emailData
    );

    return isValid;
  } catch {
    return false;
  }
}

/**
 * Verify email hash (SHA-384)
 */
export async function verifyEmailHash(email: string, hash: string): Promise<boolean> {
  try {
    const computedHash = await sha384Hash(email);
    const computedHashHex = Array.from(new Uint8Array(computedHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return computedHashHex === hash.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Verify both email hash and signature
 */
export async function verifyUserIntegrity(
  email: string,
  emailHash: string,
  signature: string,
  publicKey: string
): Promise<{ hashValid: boolean; signatureValid: boolean; valid: boolean }> {
  const [hashValid, signatureValid] = await Promise.all([
    verifyEmailHash(email, emailHash),
    verifySignature(email, signature, publicKey),
  ]);

  return {
    hashValid,
    signatureValid,
    valid: hashValid && signatureValid,
  };
}
