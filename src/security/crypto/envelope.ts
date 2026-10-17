/**
 * Industry-standard envelope encryption.
 * Argon2id (key derivation) + XChaCha20-Poly1305 (AEAD).
 * All logic is visible in source — no custom primitives.
 */
import { argon2id } from "hash-wasm";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/hashes/utils";

export async function deriveMasterKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const hash = await argon2id({
    password,
    salt,
    parallelism: 4,
    iterations: 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: "binary",
  });
  return hash instanceof Uint8Array ? hash : new Uint8Array(hash as ArrayBuffer);
}

export function generateDataKey(): Uint8Array {
  return randomBytes(32);
}

export function wrapKey(dataKey: Uint8Array, wrappingKey: Uint8Array): Uint8Array {
  const nonce = randomBytes(24);
  const cipher = xchacha20poly1305(wrappingKey, nonce);
  const ciphertext = cipher.encrypt(dataKey);
  const out = new Uint8Array(24 + ciphertext.length);
  out.set(nonce, 0);
  out.set(ciphertext, 24);
  return out;
}

export function unwrapKey(wrapped: Uint8Array, wrappingKey: Uint8Array): Uint8Array {
  const nonce = wrapped.slice(0, 24);
  const ciphertext = wrapped.slice(24);
  const cipher = xchacha20poly1305(wrappingKey, nonce);
  return cipher.decrypt(ciphertext);
}

export function encryptBlob(plaintext: Uint8Array, dataKey: Uint8Array): Uint8Array {
  const nonce = randomBytes(24);
  const cipher = xchacha20poly1305(dataKey, nonce);
  const ciphertext = cipher.encrypt(plaintext);
  const out = new Uint8Array(24 + ciphertext.length);
  out.set(nonce, 0);
  out.set(ciphertext, 24);
  return out;
}

export function decryptBlob(ciphertextWithNonce: Uint8Array, dataKey: Uint8Array): Uint8Array {
  const nonce = ciphertextWithNonce.slice(0, 24);
  const ciphertext = ciphertextWithNonce.slice(24);
  const cipher = xchacha20poly1305(dataKey, nonce);
  return cipher.decrypt(ciphertext);
}

export async function encryptPackage(
  live: { manifest: unknown; blobs: Map<string, Uint8Array> },
  masterKey: Uint8Array
): Promise<{ manifest: Uint8Array; blobs: { hash: string; ciphertext: Uint8Array }[] }> {
  const packageKey = generateDataKey();
  const wrappedPackageKey = wrapKey(packageKey, masterKey);
  const encryptedBlobs: { hash: string; ciphertext: Uint8Array }[] = [];
  for (const [hash, data] of live.blobs) {
    encryptedBlobs.push({ hash, ciphertext: encryptBlob(data, packageKey) });
  }
  const manifestPayload = {
    version: 1,
    wrappedKey: Array.from(wrappedPackageKey),
    blobHashes: encryptedBlobs.map((b) => b.hash),
    createdAt: new Date().toISOString(),
    sourceManifest: live.manifest,
  };
  const manifestBytes = new TextEncoder().encode(JSON.stringify(manifestPayload));
  const encryptedManifest = encryptBlob(manifestBytes, packageKey);
  return { manifest: encryptedManifest, blobs: encryptedBlobs };
}
