"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const maximumFileSize = 100 * 1024 * 1024;

export function DogMediaUploader({ dogId }: { dogId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async () => {
    const files = Array.from(inputRef.current?.files ?? []);
    if (!files.length) {
      setStatus("Válasszon legalább egy fájlt.");
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        if (file.size > maximumFileSize) {
          throw new Error(`${file.name}: a fájl nagyobb 100 MB-nál.`);
        }

        setStatus(`Feltöltés: ${index + 1}/${files.length} · ${file.name}`);
        const body = new FormData();
        body.set("file", file);

        const response = await fetch(`/api/admin/kutyak/${dogId}/media`, {
          method: "POST",
          headers: { "x-garmond-admin": "media-upload" },
          body,
        });
        const result = (await response.json().catch(() => null)) as { error?: string } | null;

        if (!response.ok) {
          throw new Error(result?.error || "A feltöltés nem sikerült.");
        }
      }

      if (inputRef.current) inputRef.current.value = "";
      setStatus(`${files.length} fájl sikeresen feltöltve.`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "A feltöltés nem sikerült.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-[#b9924d]/25 bg-[#090807] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label htmlFor="dog-media" className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-[#cda464] uppercase">
            Képek és videók
          </label>
          <input
            ref={inputRef}
            id="dog-media"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            className="block w-full text-sm text-white/55 file:mr-4 file:border-0 file:bg-[#b9924d] file:px-5 file:py-3 file:text-xs file:font-semibold file:tracking-[0.12em] file:text-black file:uppercase"
          />
          <p className="mt-2 text-xs text-white/30">JPG, PNG, WebP, GIF, MP4, WebM vagy MOV. Legfeljebb 100 MB fájlonként.</p>
        </div>
        <button
          type="button"
          onClick={uploadFiles}
          disabled={uploading}
          className="h-12 border border-[#b9924d] px-6 text-xs font-semibold tracking-[0.15em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black disabled:cursor-wait disabled:opacity-50"
        >
          {uploading ? "Feltöltés…" : "Fájlok feltöltése"}
        </button>
      </div>
      {status && <p role="status" className="mt-4 text-sm text-white/55">{status}</p>}
    </div>
  );
}
