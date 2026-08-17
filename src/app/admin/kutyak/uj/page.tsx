import { connection } from "next/server";

import { AdminPageShell } from "@/components/admin-page-shell";
import { DogEditorForm } from "@/components/dog-editor-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewDogPage() {
  await connection();
  await requireAdmin();

  return (
    <AdminPageShell title="Kutya hozzáadása" eyebrow="Új adatlap" backHref="/admin/kutyak">
      <DogEditorForm mode="create" />
    </AdminPageShell>
  );
}
