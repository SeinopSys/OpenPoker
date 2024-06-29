import {
  decode as base64ToArrayBuffer,
  encode as arrayBufferToBase64,
} from 'base64-arraybuffer';

export { base64ToArrayBuffer, arrayBufferToBase64 };

export const arrayBufferToHex = (arrayBuffer: ArrayBuffer | Buffer): string =>
  Buffer.from(arrayBuffer).reduce((result, item) => {
    const itemStr = item.toString(16);
    return result + (itemStr.length < 2 ? '0' + itemStr : itemStr);
  }, '');

/**
 * Constant-time string comparison check
 */
export const passwordVerify = (value1: string, value2: string): boolean => {
  const maxLength = Math.max(value1.length, value2.length);
  let valid = true;
  for (let i = 0; i < maxLength; i++) {
    valid = value1[i] === value2[i];
  }
  return valid;
};
