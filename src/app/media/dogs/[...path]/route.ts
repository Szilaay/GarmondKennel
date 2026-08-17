import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

import { getCurrentAdmin } from "@/lib/auth";
import { getMediaByStorageKey } from "@/lib/dogs";
import { resolveStorageKey } from "@/lib/media-storage";

export const runtime = "nodejs";

function streamResponse(
  filePath: string,
  start: number,
  end: number,
  headers: Headers,
  status: number,
) {
  const stream = createReadStream(filePath, { start, end });
  return new Response(Readable.toWeb(stream) as ReadableStream, { status, headers });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const pathParts = (await params).path;
  if (pathParts.length !== 1 || !/^[0-9a-f-]{36}\.(jpg|png|webp|gif|mp4|webm|mov)$/.test(pathParts[0])) {
    return new Response("Not found", { status: 404 });
  }

  const storageKey = `dogs/${pathParts[0]}`;
  const media = await getMediaByStorageKey(storageKey);
  if (!media) return new Response("Not found", { status: 404 });

  if (media.dog_status === "archived" && !(await getCurrentAdmin())) {
    return new Response("Not found", { status: 404 });
  }

  let fileStats;
  let filePath: string;
  try {
    filePath = resolveStorageKey(storageKey);
    fileStats = await stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const size = fileStats.size;
  const headers = new Headers({
    "Accept-Ranges": "bytes",
    "Content-Type": media.mime_type,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": media.dog_status === "active" ? "public, max-age=31536000, immutable" : "private, no-store",
  });
  const range = request.headers.get("range");

  if (!range) {
    headers.set("Content-Length", String(size));
    return streamResponse(filePath, 0, Math.max(0, size - 1), headers, 200);
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const requestedStart = match[1] ? Number(match[1]) : null;
  const requestedEnd = match[2] ? Number(match[2]) : null;
  let start = requestedStart ?? Math.max(0, size - (requestedEnd ?? 0));
  let end = requestedStart === null ? size - 1 : (requestedEnd ?? size - 1);
  start = Math.max(0, start);
  end = Math.min(size - 1, end);

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return streamResponse(filePath, start, end, headers, 206);
}
