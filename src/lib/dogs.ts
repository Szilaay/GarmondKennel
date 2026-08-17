import "server-only";

import sanitizeHtml from "sanitize-html";

import { query } from "@/lib/db";
import { ensureDatabaseSchema } from "@/lib/schema";

export type DogSex = "male" | "female";
export type DogStatus = "active" | "archived";
export type DogMediaType = "image" | "video";

export type DogRecord = {
  id: string;
  name: string;
  sex: DogSex;
  is_young: boolean;
  is_black: boolean;
  is_long_haired: boolean;
  description_html: string;
  status: DogStatus;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  cover_storage_key: string | null;
  media_count: string;
};

export type DogMediaRecord = {
  id: string;
  dog_id: string;
  storage_key: string;
  original_name: string;
  mime_type: string;
  media_type: DogMediaType;
  size_bytes: string;
  sort_order: number;
  created_at: Date;
};

export type StoredMediaRecord = DogMediaRecord & {
  dog_status: DogStatus;
};

export function parseDogId(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d{0,18}$/.test(value)) return null;
  return value;
}

export function sanitizeDogDescription(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "blockquote",
      "span",
      "font",
    ],
    allowedAttributes: {
      p: ["style"],
      span: ["style"],
      font: ["color", "size"],
    },
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb\([\d\s,.%]+\)$/i],
        "font-size": [/^(0\.875|1|1\.125|1\.25|1\.5|1\.875|2\.25)rem$/],
        "text-align": [/^(left|center|right)$/],
      },
    },
    disallowedTagsMode: "discard",
  });
}

export async function listDogs(status: DogStatus) {
  await ensureDatabaseSchema();

  const result = await query<DogRecord>(
    `SELECT d.id::text,
            d.name,
            d.sex,
            d.is_young,
            d.is_black,
            d.is_long_haired,
            d.description_html,
            d.status,
            d.archived_at,
            d.created_at,
            d.updated_at,
            cover.storage_key AS cover_storage_key,
            COUNT(dm.id)::text AS media_count
       FROM dogs d
       LEFT JOIN dog_media dm ON dm.dog_id = d.id
       LEFT JOIN LATERAL (
         SELECT storage_key
           FROM dog_media
          WHERE dog_id = d.id AND media_type = 'image'
          ORDER BY sort_order, id
          LIMIT 1
       ) cover ON TRUE
      WHERE d.status = $1
      GROUP BY d.id, cover.storage_key
      ORDER BY d.updated_at DESC, d.id DESC`,
    [status],
  );

  return result.rows;
}

export async function getDogById(id: string) {
  await ensureDatabaseSchema();

  const result = await query<DogRecord>(
    `SELECT d.id::text,
            d.name,
            d.sex,
            d.is_young,
            d.is_black,
            d.is_long_haired,
            d.description_html,
            d.status,
            d.archived_at,
            d.created_at,
            d.updated_at,
            cover.storage_key AS cover_storage_key,
            COUNT(dm.id)::text AS media_count
       FROM dogs d
       LEFT JOIN dog_media dm ON dm.dog_id = d.id
       LEFT JOIN LATERAL (
         SELECT storage_key
           FROM dog_media
          WHERE dog_id = d.id AND media_type = 'image'
          ORDER BY sort_order, id
          LIMIT 1
       ) cover ON TRUE
      WHERE d.id = $1
      GROUP BY d.id, cover.storage_key
      LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function getDogMedia(dogId: string) {
  await ensureDatabaseSchema();

  const result = await query<DogMediaRecord>(
    `SELECT id::text,
            dog_id::text,
            storage_key,
            original_name,
            mime_type,
            media_type,
            size_bytes::text,
            sort_order,
            created_at
       FROM dog_media
      WHERE dog_id = $1
      ORDER BY sort_order, id`,
    [dogId],
  );

  return result.rows;
}

export async function getMediaByStorageKey(storageKey: string) {
  await ensureDatabaseSchema();

  const result = await query<StoredMediaRecord>(
    `SELECT dm.id::text,
            dm.dog_id::text,
            dm.storage_key,
            dm.original_name,
            dm.mime_type,
            dm.media_type,
            dm.size_bytes::text,
            dm.sort_order,
            dm.created_at,
            d.status AS dog_status
       FROM dog_media dm
       JOIN dogs d ON d.id = dm.dog_id
      WHERE dm.storage_key = $1
      LIMIT 1`,
    [storageKey],
  );

  return result.rows[0] ?? null;
}

export function mediaUrl(storageKey: string) {
  const filename = storageKey.startsWith("dogs/") ? storageKey.slice(5) : storageKey;
  return `/media/dogs/${encodeURIComponent(filename)}`;
}
