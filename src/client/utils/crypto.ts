import {
  decode as base64ToArrayBuffer,
  encode as arrayBufferToBase64,
} from 'base64-arraybuffer';

export { base64ToArrayBuffer, arrayBufferToBase64 };

/**
 * @see https://dev.to/apertureless/end-to-end-encryption-in-the-browser-part-1-20ap
 */
export const getKeyFromPassword = async (
  password: string,
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  return await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );
};

/**
 * @see https://dev.to/apertureless/end-to-end-encryption-in-the-browser-part-1-20ap
 */
export const getAESKeyFromPBKDF = (
  key: CryptoKey,
  salt: BufferSource,
): Promise<CryptoKey> =>
  window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

/**
 * @see https://dev.to/apertureless/end-to-end-encryption-in-the-browser-part-1-20ap
 */
export const encrypt = async (
  data: string,
  aesKey: CryptoKey,
  salt: Uint8Array,
): Promise<ArrayBuffer> => {
  const encodedData = new TextEncoder().encode(data);
  // Encrypt with AES key
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: salt },
    aesKey,
    encodedData,
  );

  return encryptedData;
};

export const decrypt = async (
  data: string | ArrayBuffer,
  key: CryptoKey,
  iv: string | ArrayBuffer,
): Promise<string> => {
  const ivBytes = typeof iv === 'string' ? base64ToArrayBuffer(iv) : iv;
  const dataBytes = typeof data === 'string' ? base64ToArrayBuffer(data) : data;

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    dataBytes,
  );
  return new TextDecoder().decode(decryptedData);
};
