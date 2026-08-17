import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { query } from "@/lib/db";
import { ensureDatabaseSchema } from "@/lib/schema";

const sessionCookieName = "garmond_admin_session";
const sessionLifetimeMs = 12 * 60 * 60 * 1000;

type AdminSessionRow = {
  id: string;
  username: string;
  role: "admin";
  phone_auth_enabled: boolean;
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(userId: string) {
  await ensureDatabaseSchema();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionLifetimeMs);

  await query(
    `INSERT INTO admin_sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [tokenHash, userId, expiresAt],
  );

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  await ensureDatabaseSchema();

  const result = await query<AdminSessionRow>(
    `SELECT u.id::text, u.username, u.role, u.phone_auth_enabled
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > NOW()
        AND u.is_active = TRUE
      LIMIT 1`,
    [hashSessionToken(token)],
  );

  return result.rows[0] ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/bejelentkezes");
  return admin;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await ensureDatabaseSchema();
    await query("DELETE FROM admin_sessions WHERE token_hash = $1", [hashSessionToken(token)]);
  }

  cookieStore.delete(sessionCookieName);
}
