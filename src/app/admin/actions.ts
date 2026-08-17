"use server";

import { redirect } from "next/navigation";

import { destroyAdminSession, requireAdmin } from "@/lib/auth";

export async function logoutAction() {
  await requireAdmin();
  await destroyAdminSession();
  redirect("/admin/bejelentkezes");
}
