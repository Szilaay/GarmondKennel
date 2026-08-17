"use server";

import { unlink } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseDogId, sanitizeDogDescription, type DogSex, type DogStatus } from "@/lib/dogs";
import { resolveStorageKey } from "@/lib/media-storage";
import { ensureDatabaseSchema } from "@/lib/schema";

export type DogFormState = {
  error: string | null;
  success?: boolean;
};

type DogInput = {
  name: string;
  sex: DogSex;
  isYoung: boolean;
  isBlack: boolean;
  isLongHaired: boolean;
  descriptionHtml: string;
};

function readDogInput(formData: FormData): DogInput | { error: string } {
  const rawName = formData.get("name");
  const rawSex = formData.get("sex");
  const rawDescription = formData.get("descriptionHtml");
  const name = typeof rawName === "string" ? rawName.trim().replace(/\s+/g, " ") : "";
  const description = typeof rawDescription === "string" ? rawDescription : "";

  if (name.length < 2 || name.length > 100) {
    return { error: "A név 2–100 karakter hosszú lehet." };
  }

  if (rawSex !== "male" && rawSex !== "female") {
    return { error: "Válassza ki, hogy kan vagy szuka." };
  }

  if (description.length > 100_000) {
    return { error: "A leírás túl hosszú." };
  }

  return {
    name,
    sex: rawSex,
    isYoung: formData.get("isYoung") === "on",
    isBlack: formData.get("isBlack") === "on",
    isLongHaired: formData.get("isLongHaired") === "on",
    descriptionHtml: sanitizeDogDescription(description),
  };
}

export async function createDogAction(
  _: DogFormState,
  formData: FormData,
): Promise<DogFormState> {
  const admin = await requireAdmin();
  const input = readDogInput(formData);
  if ("error" in input) return { error: input.error };

  await ensureDatabaseSchema();
  const result = await query<{ id: string }>(
    `INSERT INTO dogs (
       name, sex, is_young, is_black, is_long_haired, description_html, created_by, updated_by
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
     RETURNING id::text`,
    [
      input.name,
      input.sex,
      input.isYoung,
      input.isBlack,
      input.isLongHaired,
      input.descriptionHtml,
      admin.id,
    ],
  );

  const dogId = result.rows[0]?.id;
  if (!dogId) return { error: "A kutya mentése nem sikerült." };

  revalidatePath("/admin");
  revalidatePath("/admin/kutyak");
  redirect(`/admin/kutyak/${dogId}?letrehozva=1`);
}

export async function updateDogAction(
  _: DogFormState,
  formData: FormData,
): Promise<DogFormState> {
  const admin = await requireAdmin();
  const dogId = parseDogId(formData.get("id"));
  if (!dogId) return { error: "Érvénytelen kutyaazonosító." };

  const input = readDogInput(formData);
  if ("error" in input) return { error: input.error };

  await ensureDatabaseSchema();
  const result = await query<{ id: string }>(
    `UPDATE dogs
        SET name = $1,
            sex = $2,
            is_young = $3,
            is_black = $4,
            is_long_haired = $5,
            description_html = $6,
            updated_by = $7,
            updated_at = NOW()
      WHERE id = $8
      RETURNING id::text`,
    [
      input.name,
      input.sex,
      input.isYoung,
      input.isBlack,
      input.isLongHaired,
      input.descriptionHtml,
      admin.id,
      dogId,
    ],
  );

  if (!result.rows[0]) return { error: "A kutya nem található." };

  revalidatePath("/admin");
  revalidatePath("/admin/kutyak");
  revalidatePath(`/admin/kutyak/${dogId}`);
  return { error: null, success: true };
}

export async function setDogArchiveStateAction(formData: FormData) {
  const admin = await requireAdmin();
  const dogId = parseDogId(formData.get("id"));
  const statusValue = formData.get("status");
  const status: DogStatus | null =
    statusValue === "active" || statusValue === "archived" ? statusValue : null;

  if (!dogId || !status) throw new Error("Invalid archive request");

  await ensureDatabaseSchema();
  await query(
    `UPDATE dogs
        SET status = $1,
            archived_at = CASE WHEN $1 = 'archived' THEN NOW() ELSE NULL END,
            updated_by = $2,
            updated_at = NOW()
      WHERE id = $3`,
    [status, admin.id, dogId],
  );

  revalidatePath("/admin");
  revalidatePath("/admin/kutyak");
  revalidatePath(`/admin/kutyak/${dogId}`);
}

export async function deleteDogMediaAction(formData: FormData) {
  await requireAdmin();
  const dogId = parseDogId(formData.get("dogId"));
  const mediaId = parseDogId(formData.get("mediaId"));
  if (!dogId || !mediaId) throw new Error("Invalid media deletion request");

  await ensureDatabaseSchema();
  const result = await query<{ storage_key: string }>(
    `DELETE FROM dog_media
      WHERE id = $1 AND dog_id = $2
      RETURNING storage_key`,
    [mediaId, dogId],
  );

  const storageKey = result.rows[0]?.storage_key;
  if (storageKey) {
    try {
      await unlink(resolveStorageKey(storageKey));
    } catch (error) {
      const errorCode = error instanceof Error && "code" in error ? error.code : null;
      if (errorCode !== "ENOENT") {
        console.error("Unable to remove dog media file", error instanceof Error ? error.message : "unknown");
      }
    }
  }

  revalidatePath(`/admin/kutyak/${dogId}`);
  revalidatePath("/admin/kutyak");
}
