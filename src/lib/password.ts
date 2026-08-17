import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const keyLength = 64;
const cost = 32_768;
const blockSize = 8;
const parallelization = 1;

function derivePasswordKey(password: string, salt: Buffer, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      length,
      {
        N: cost,
        r: blockSize,
        p: parallelization,
        maxmem: 64 * 1024 * 1024,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(18);
  const derivedKey = await derivePasswordKey(password, salt, keyLength);

  return [
    "scrypt",
    cost,
    blockSize,
    parallelization,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, encodedCost, encodedBlockSize, encodedParallelization, saltValue, hashValue] =
    encodedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    Number(encodedCost) !== cost ||
    Number(encodedBlockSize) !== blockSize ||
    Number(encodedParallelization) !== parallelization ||
    !saltValue ||
    !hashValue
  ) {
    return false;
  }

  const expectedHash = Buffer.from(hashValue, "base64url");
  const derivedKey = await derivePasswordKey(
    password,
    Buffer.from(saltValue, "base64url"),
    expectedHash.length,
  );

  return expectedHash.length === derivedKey.length && timingSafeEqual(expectedHash, derivedKey);
}
