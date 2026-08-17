import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import { setDogArchiveStateAction } from "@/app/admin/kutyak/actions";
import { AdminPageShell } from "@/components/admin-page-shell";
import { requireAdmin } from "@/lib/auth";
import { listDogs, mediaUrl, type DogRecord, type DogStatus } from "@/lib/dogs";

type Category = "all" | "male" | "female" | "young" | "black" | "long-haired";

const categories: Array<{ value: Category; label: string }> = [
  { value: "all", label: "Összes" },
  { value: "male", label: "Kanok" },
  { value: "female", label: "Szukák" },
  { value: "young", label: "Fiatalok" },
  { value: "black", label: "Feketék" },
  { value: "long-haired", label: "Hosszú szőrűek" },
];

function matchesCategory(dog: DogRecord, category: Category) {
  if (category === "male") return dog.sex === "male";
  if (category === "female") return dog.sex === "female";
  if (category === "young") return dog.is_young;
  if (category === "black") return dog.is_black;
  if (category === "long-haired") return dog.is_long_haired;
  return true;
}

function DogBadges({ dog }: { dog: DogRecord }) {
  const badges = [
    dog.sex === "male" ? "Kan" : "Szuka",
    dog.is_young ? "Fiatal" : null,
    dog.is_black ? "Fekete" : null,
    dog.is_long_haired ? "Hosszú szőrű" : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge} className="border border-[#b9924d]/25 px-2 py-1 text-[9px] tracking-[0.12em] text-[#cda464] uppercase">
          {badge}
        </span>
      ))}
    </div>
  );
}

export default async function DogsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  await connection();
  await requireAdmin();

  const queryParams = await searchParams;
  const status: DogStatus = queryParams.status === "archived" ? "archived" : "active";
  const requestedCategory = queryParams.category;
  const category: Category = categories.some((item) => item.value === requestedCategory)
    ? (requestedCategory as Category)
    : "all";
  const dogs = (await listDogs(status)).filter((dog) => matchesCategory(dog, category));

  return (
    <AdminPageShell title="Kutyák kezelése" eyebrow="Garmond adminisztráció">
      <div className="flex flex-col gap-6 border-b border-[#b9924d]/20 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex gap-2">
            {(["active", "archived"] as const).map((item) => (
              <Link
                key={item}
                href={`/admin/kutyak?status=${item}&category=${category}`}
                className={`border px-4 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase ${
                  status === item
                    ? "border-[#b9924d] bg-[#b9924d] text-black"
                    : "border-white/10 text-white/45 hover:border-[#b9924d]/50"
                }`}
              >
                {item === "active" ? "Aktív" : "Archívum"}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <Link
                key={item.value}
                href={`/admin/kutyak?status=${status}&category=${item.value}`}
                className={`px-3 py-2 text-[10px] tracking-[0.12em] uppercase transition-colors ${
                  category === item.value ? "text-[#d6a552]" : "text-white/35 hover:text-white/65"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/admin/kutyak/uj"
          className="inline-flex h-12 items-center justify-center border border-[#b9924d] bg-[#b9924d] px-6 text-xs font-semibold tracking-[0.15em] text-black uppercase hover:bg-[#d6a552]"
        >
          Kutya hozzáadása
        </Link>
      </div>

      {dogs.length === 0 ? (
        <div className="mt-10 border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/35">
          Ebben a kategóriában még nincs kutya.
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {dogs.map((dog) => (
            <article key={dog.id} className="overflow-hidden border border-[#b9924d]/20 bg-[#090807]">
              <Link href={`/admin/kutyak/${dog.id}`} className="group block">
                <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_40%,rgba(185,146,77,0.12),transparent_55%),#050505]">
                  {dog.cover_storage_key ? (
                    <Image
                      src={mediaUrl(dog.cover_storage_key)}
                      alt={dog.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs tracking-[0.15em] text-white/20 uppercase">Nincs kép</div>
                  )}
                </div>
                <div className="p-5">
                  <DogBadges dog={dog} />
                  <h2 className="mt-4 font-serif text-2xl text-white/90">{dog.name}</h2>
                  <p className="mt-2 text-xs text-white/35">{dog.media_count} médiafájl · Megnyitás és szerkesztés</p>
                </div>
              </Link>
              <form action={setDogArchiveStateAction} className="border-t border-white/10 p-4">
                <input type="hidden" name="id" value={dog.id} />
                <input type="hidden" name="status" value={status === "active" ? "archived" : "active"} />
                <button type="submit" className="text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase transition-colors hover:text-[#d6a552]">
                  {status === "active" ? "Archiválás" : "Visszaállítás"}
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
