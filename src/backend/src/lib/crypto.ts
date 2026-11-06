/**
 * AES-256-GCM encryption for Google access/refresh tokens stored in `token_google`.
 * Source: Algo-001 / Algo-009 (`enkripsiAES256GCM`, `dekripsiAES256GCM` with KUNCI_TOKEN).
 *
 * Wire format: base64( IV[12] || ciphertext || tag[16] )
 */

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export class KunciTokenError extends Error {}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(kunciTokenB64: string): Promise<CryptoKey> {
  const raw = fromBase64(kunciTokenB64);
  if (raw.length !== 32) {
    throw new KunciTokenError("KUNCI_TOKEN must decode to exactly 32 bytes (AES-256)");
  }
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

/** Encrypts a plaintext token. Returns base64(IV || ciphertext || tag). */
export async function enkripsiAES256GCM(
  plaintext: string,
  kunciTokenB64: string,
): Promise<string> {
  const key = await importKey(kunciTokenB64);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: TAG_LENGTH * 8 },
      key,
      new TextEncoder().encode(plaintext),
    ),
  );
  const combined = new Uint8Array(iv.length + cipher.length);
  combined.set(iv, 0);
  combined.set(cipher, iv.length);
  return toBase64(combined);
}

/** Decrypts a value produced by {@link enkripsiAES256GCM}. */
export async function dekripsiAES256GCM(
  payloadB64: string,
  kunciTokenB64: string,
): Promise<string> {
  const combined = fromBase64(payloadB64);
  if (combined.length <= IV_LENGTH + TAG_LENGTH) {
    throw new KunciTokenError("Encrypted token payload is too short");
  }
  const key = await importKey(kunciTokenB64);
  const iv = combined.subarray(0, IV_LENGTH);
  const cipher = combined.subarray(IV_LENGTH);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: TAG_LENGTH * 8 },
    key,
    cipher,
  );
  return new TextDecoder().decode(plain);
}
