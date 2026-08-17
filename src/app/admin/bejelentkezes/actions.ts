"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createAdminSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { ensureDatabaseSchema } from "@/lib/schema";

export type LoginState = {
  error: string | null;
};

type AdminUserRow = {
  id: string;
  password_hash: string;
  is_active: boolean;
  phone_auth_enabled: boolean;
};

function normalizeUsername(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLocaleLowerCase("hu-HU") : "";
}

async function getClientIpHash() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = forwardedFor || requestHeaders.get("x-real-ip") || "unknown";
  const pepper = process.env.AUTH_PEPPER;

  if (!pepper) throw new Error("AUTH_PEPPER is not configured");

  return createHmac("sha256", pepper).update(clientIp).digest("hex");
}

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const username = normalizeUsername(formData.get("username"));
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (
    username.length < 3 ||
    username.length > 64 ||
    !/^[\p{L}\p{N}._-]+$/u.test(username) ||
    password.length < 12 ||
    password.length > 256
  ) {
    return { error: "Hibás felhasználónév vagy jelszó." };
  }

  try {
    await ensureDatabaseSchema();
    const ipHash = await getClientIpHash();
    const recentFailures = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
         FROM admin_login_attempts
        WHERE successful = FALSE
          AND created_at > NOW() - INTERVAL '15 minutes'
          AND (username = $1 OR ip_hash = $2)`,
      [username, ipHash],
    );

    if (Number(recentFailures.rows[0]?.count ?? 0) >= 5) {
      return { error: "Túl sok sikertelen próbálkozás. Próbálja újra 15 perc múlva." };
    }

    const userResult = await query<AdminUserRow>(
      `SELECT id::text, password_hash, is_active, phone_auth_enabled
         FROM admin_users
        WHERE LOWER(username) = $1
        LIMIT 1`,
      [username],
    );
    const user = userResult.rows[0];
    const passwordValid = user
      ? await verifyPassword(password, user.password_hash)
      : Boolean(await hashPassword(password));
    const authenticated = Boolean(user?.is_active && passwordValid);

    await query(
      `INSERT INTO admin_login_attempts (username, ip_hash, successful)
       VALUES ($1, $2, $3)`,
      [username, ipHash, authenticated],
    );

    if (!authenticated || !user) {
      return { error: "Hibás felhasználónév vagy jelszó." };
    }

    if (user.phone_auth_enabled) {
      return { error: "Ehhez a fiókhoz telefonos megerősítés szükséges, amely még nincs aktiválva." };
    }

    await query("UPDATE admin_users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1", [
      user.id,
    ]);
    await query("DELETE FROM admin_sessions WHERE expires_at <= NOW()");
    await query("DELETE FROM admin_login_attempts WHERE created_at < NOW() - INTERVAL '7 days'");
    await createAdminSession(user.id);
  } catch (error) {
    console.error("Admin login is temporarily unavailable", error instanceof Error ? error.message : "unknown");
    return { error: "A belépés átmenetileg nem elérhető. Próbálja újra később." };
  }

  redirect("/admin");
}
