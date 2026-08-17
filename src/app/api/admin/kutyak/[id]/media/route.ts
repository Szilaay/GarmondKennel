import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { fileTypeFromBuffer } from "file-type";

import { getCurrentAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { getDogById, parseDogId, type DogMediaType } from "@/lib/dogs";
import { ensureDogUploadDirectory, resolveStorageKey } from "@/lib/media-storage";
import { ensureDatabaseSchema } from "@/lib/schema";

export const runtime = "nodejs";

const maximumFileSize = 100 * 1024 * 1024;
const allowedTypes: Record<
  string,
  { extension: "jpg" | "png" | "webp" | "gif" | "mp4" | "webm" | "mov"; mediaType: DogMediaType }
> = {
  "image/jpeg": { extension: "jpg", mediaType: "image" },
  "image/png": { extension: "png", mediaType: "image" },
  "image/webp": { extension: "webp", mediaType: "image" },
  "image/gif": { extension: "gif", mediaType: "image" },
  "video/mp4": { extension: "mp4", mediaType: "video" },
  "video/webm": { extension: "webm", mediaType: "video" },
  "video/quicktime": { extension: "mov", mediaType: "video" },
};

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

function requestIsSameOrigin(request: Request) {
  if (request.headers.get("x-garmond-admin") !== "media-upload") return false;

  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function safeOriginalName(name: string) {
  return name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 255) || "media";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requestIsSameOrigin(request)) return errorResponse("Érvénytelen feltöltési kérés.", 403);

  const admin = await getCurrentAdmin();
  if (!admin) return errorResponse("Nincs admin jogosultság.", 401);

  const dogId = parseDogId((await params).id);
  if (!dogId) return errorResponse("Érvénytelen kutyaazonosító.", 400);

  const dog = await getDogById(dogId);
  if (!dog) return errorResponse("A kutya nem található.", 404);

  const mediaCount = await query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM dog_media WHERE dog_id = $1",
    [dogId],
  );
  if (Number(mediaCount.rows[0]?.count ?? 0) >= 100) {
    return errorResponse("Egy kutyához legfeljebb 100 médiafájl tölthető fel.", 409);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("A feltöltési adat nem olvasható.", 400);
  }

  const uploadedFile = formData.get("file");
  if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
    return errorResponse("Nincs feltöltendő fájl.", 400);
  }
  if (uploadedFile.size > maximumFileSize) {
    return errorResponse("A fájl nagyobb 100 MB-nál.", 413);
  }

  const bytes = Buffer.from(await uploadedFile.arrayBuffer());
  const detectedType = await fileTypeFromBuffer(bytes);
  const detectedMime = detectedType?.mime;
  const acceptedType = detectedMime ? allowedTypes[detectedMime] : null;
  if (!acceptedType || !detectedMime) {
    return errorResponse("A fájl valódi típusa nem támogatott.", 415);
  }

  const storageKey = `dogs/${randomUUID()}.${acceptedType.extension}`;
  await ensureDogUploadDirectory();
  const filePath = resolveStorageKey(storageKey);

  try {
    await writeFile(filePath, bytes, { flag: "wx", mode: 0o640 });
    await ensureDatabaseSchema();
    const result = await query<{ id: string }>(
      `INSERT INTO dog_media (
         dog_id, storage_key, original_name, mime_type, media_type, size_bytes, created_by
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id::text`,
      [
        dogId,
        storageKey,
        safeOriginalName(uploadedFile.name),
        detectedMime,
        acceptedType.mediaType,
        uploadedFile.size,
        admin.id,
      ],
    );

    revalidatePath(`/admin/kutyak/${dogId}`);
    revalidatePath("/admin/kutyak");
    return Response.json({
      id: result.rows[0]?.id,
      mediaType: acceptedType.mediaType,
      url: `/media/dogs/${path.basename(storageKey)}`,
    });
  } catch (error) {
    await unlink(filePath).catch(() => undefined);
    console.error("Dog media upload failed", error instanceof Error ? error.message : "unknown");
    return errorResponse("A média mentése nem sikerült.", 500);
  }
}
