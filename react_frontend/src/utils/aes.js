// src/utils/aes.js
export default async function encryptText(plainText, base64Key) {
  const enc = new TextEncoder();
  const keyData = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

  const key = await window.crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['encrypt']);

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainText));

  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  };
}
