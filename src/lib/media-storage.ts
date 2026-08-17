import "server-only";

import path from "node:path";
import { mkdir } from "node:fs/promises";

export function getUploadDirectory() {
  const configuredDirectory = process.env.UPLOAD_DIRECTORY;
  if (configuredDirectory) {
    return path.resolve(/* turbopackIgnore: true */ configuredDirectory);
  }

  return path.join(process.cwd(), "uploads");
}

export function resolveStorageKey(storageKey: string) {
  if (!/^dogs\/[0-9a-f-]{36}\.(jpg|png|webp|gif|mp4|webm|mov)$/.test(storageKey)) {
    throw new Error("Invalid media storage key");
  }

  const root = getUploadDirectory();
  const target = path.resolve(root, storageKey);

  if (!target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Media path escapes upload directory");
  }

  return target;
}

export async function ensureDogUploadDirectory() {
  const directory = path.join(getUploadDirectory(), "dogs");
  await mkdir(directory, { recursive: true, mode: 0o750 });
  return directory;
}
