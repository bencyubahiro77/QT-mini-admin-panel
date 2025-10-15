import crypto from 'crypto';
import { getPrivateKey, getPublicKey } from '../utils/rsaKeys';
import { HashAndSignResult, VerifySignatureParams } from '../types';


// Hash a string using SHA-384
export function hashWithSHA384(data: string): string {
  return crypto
    .createHash('sha384')
    .update(data)
    .digest('hex');
}

// Sign data using RSA private key with SHA-384
export function signData(data: string): string {
  const privateKey = getPrivateKey();
  
  const sign = crypto.createSign('SHA384');
  sign.update(data);
  sign.end();
  
  const signature = sign.sign(privateKey, 'base64');
  return signature;
}

// Verify signature using RSA public key
export function verifySignature(params: VerifySignatureParams): boolean {
  const { data, signature, publicKey } = params;
  try {
    const pubKey = publicKey || getPublicKey();
    
    const verify = crypto.createVerify('SHA384');
    verify.update(data);
    verify.end();
    
    return verify.verify(pubKey, signature, 'base64');
  } catch (error) {
    return false;
  }
}

// Hash email and generate signature
export function hashAndSignEmail(email: string): HashAndSignResult {
  const emailHash = hashWithSHA384(email);
  const signature = signData(email);
  
  return { emailHash, signature };
}
