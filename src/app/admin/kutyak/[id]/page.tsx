import Image from "next/image";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import {
  deleteDogMediaAction,
  setDogArchiveStateAction,
} from "@/app/admin/kutyak/actions";
import { AdminPageShell } from "@/components/admin-page-shell";
import { DogEditorForm } from "@/components/dog-editor-form";
import { DogMediaUploader } from "@/components/dog-media-uploader";
import { requireAdmin } from "@/lib/auth";
import { getDogById, getDogMedia, mediaUrl, parseDogId } from "@/lib/dogs";

function formatBytes(value: string) {
  const bytes = Number(value);
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await requireAdmin();

  const dogId = parseDogId((await params).id);
  if (!dogId) notFound();

  const [dog, media] = await Promise.all([getDogById(dogId), getDogMedia(dogId)]);
  if (!dog) notFound();

  return (
    <AdminPageShell title={dog.name} eyebrow="Kutya szerkesztése" backHref="/admin/kutyak">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-[#b9924d]/20 bg-[#090807] p-5">
        <div>
          <p className="text-xs tracking-[0.14em] text-white/35 uppercase">Állapot</p>
          <p className={`mt-1 font-serif text-xl ${dog.status === "active" ? "text-[#d6a552]" : "text-white/45"}`}>
            {dog.status === "active" ? "Aktív adatlap" : "Archivált adatlap"}
          </p>
        </div>
        <form action={setDogArchiveStateAction}>
          <input type="hidden" name="id" value={dog.id} />
          <input type="hidden" name="status" value={dog.status === "active" ? "archived" : "active"} />
          <button type="submit" className="h-11 border border-white/15 px-5 text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase transition-colors hover:border-[#b9924d]/55 hover:text-[#d6a552]">
            {dog.status === "active" ? "Adatlap archiválása" : "Adatlap visszaállítása"}
          </button>
        </form>
      </div>

      <DogEditorForm mode="edit" dog={dog} />

      <section className="mt-16 border-t border-[#b9924d]/20 pt-12">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-[#d6a552] uppercase">Médiatár</p>
        <h2 className="mt-3 font-serif text-3xl">Képek és videók</h2>
        <div className="mt-7">
          <DogMediaUploader dogId={dog.id} />
        </div>

        {media.length === 0 ? (
          <div className="mt-6 border border-dashed border-white/15 px-6 py-12 text-center text-sm text-white/30">Még nincs feltöltött média.</div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {media.map((item) => (
              <article key={item.id} className="overflow-hidden border border-white/10 bg-[#090807]">
                <div className="relative aspect-video bg-black">
                  {item.media_type === "image" ? (
                    <Image src={mediaUrl(item.storage_key)} alt={dog.name} fill unoptimized sizes="33vw" className="object-cover" />
                  ) : (
                    <video src={mediaUrl(item.storage_key)} controls preload="metadata" className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-white/60">{item.original_name}</p>
                    <p className="mt-1 text-[10px] tracking-[0.12em] text-white/25 uppercase">{item.media_type === "image" ? "Kép" : "Videó"} · {formatBytes(item.size_bytes)}</p>
                  </div>
                  <form action={deleteDogMediaAction}>
                    <input type="hidden" name="dogId" value={dog.id} />
                    <input type="hidden" name="mediaId" value={item.id} />
                    <button type="submit" className="text-[10px] font-semibold tracking-[0.12em] text-red-300/55 uppercase hover:text-red-200">Törlés</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminPageShell>
  );
}
