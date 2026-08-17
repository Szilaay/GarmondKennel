import "server-only";

import { getDatabasePool } from "@/lib/db";

let schemaPromise: Promise<void> | undefined;

async function applySchema() {
  const client = await getDatabasePool().connect();

  try {
    await client.query("BEGIN");
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id BIGSERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        phone_number TEXT,
        phone_verified_at TIMESTAMPTZ,
        phone_auth_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS admin_users_username_lower_idx
        ON admin_users (LOWER(username));

      CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash TEXT PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON admin_sessions (user_id);
      CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);

      CREATE TABLE IF NOT EXISTS admin_login_attempts (
        id BIGSERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        successful BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS admin_login_attempts_lookup_idx
        ON admin_login_attempts (username, ip_hash, created_at DESC);

      CREATE TABLE IF NOT EXISTS dogs (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL CHECK (CHAR_LENGTH(name) BETWEEN 2 AND 100),
        sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
        is_young BOOLEAN NOT NULL DEFAULT FALSE,
        is_black BOOLEAN NOT NULL DEFAULT FALSE,
        is_long_haired BOOLEAN NOT NULL DEFAULT FALSE,
        description_html TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
        archived_at TIMESTAMPTZ,
        created_by BIGINT NOT NULL REFERENCES admin_users(id),
        updated_by BIGINT NOT NULL REFERENCES admin_users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS dogs_status_idx ON dogs (status, updated_at DESC);
      CREATE INDEX IF NOT EXISTS dogs_sex_idx ON dogs (sex, status);

      CREATE TABLE IF NOT EXISTS dog_media (
        id BIGSERIAL PRIMARY KEY,
        dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
        storage_key TEXT NOT NULL UNIQUE,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
        size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_by BIGINT NOT NULL REFERENCES admin_users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS dog_media_dog_order_idx
        ON dog_media (dog_id, sort_order, id);
    `);

    const bootstrapUsername = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim();
    const bootstrapPasswordHash = process.env.ADMIN_BOOTSTRAP_PASSWORD_HASH?.trim();

    if (bootstrapUsername && bootstrapPasswordHash) {
      await client.query(
        `INSERT INTO admin_users (username, password_hash)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [bootstrapUsername, bootstrapPasswordHash],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureDatabaseSchema() {
  schemaPromise ??= applySchema().catch((error) => {
    schemaPromise = undefined;
    throw error;
  });

  return schemaPromise;
}
