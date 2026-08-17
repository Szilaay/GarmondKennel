import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { logoutAction } from "@/app/admin/actions";
import { BrandLogo } from "@/components/brand-logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin | Garmond Kennel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await connection();
  const admin = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-[#b9924d]/25 bg-[#080706]">
        <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Garmond főoldal">
            <BrandLogo className="h-20 w-28" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="border border-[#b9924d]/50 px-5 py-3 text-[10px] font-semibold tracking-[0.18em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
            >
              Kijelentkezés
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#d6a552] uppercase">
          Garmond adminisztráció
        </p>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl">Üdvözöljük, {admin.username}.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
          A védett adminfelület működik. A tartalomkezelési modulokat később erre az alapra
          lehet csatlakoztatni.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/admin/kutyak/uj"
            className="inline-flex h-14 items-center border border-[#b9924d] bg-[#b9924d] px-7 text-xs font-semibold tracking-[0.17em] text-black uppercase transition-colors hover:bg-[#d6a552]"
          >
            Kutya hozzáadása
          </Link>
          <Link
            href="/admin/kutyak"
            className="inline-flex h-14 items-center border border-[#b9924d]/55 px-7 text-xs font-semibold tracking-[0.17em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
          >
            Kutyák kezelése
          </Link>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-[#b9924d]/25 bg-[#b9924d]/25 md:grid-cols-3">
          <div className="bg-[#0a0908] p-7">
            <p className="text-[10px] tracking-[0.18em] text-white/35 uppercase">Adatbázis</p>
            <p className="mt-3 font-serif text-2xl text-[#cda464]">PostgreSQL</p>
            <p className="mt-2 text-sm text-white/45">Csatlakoztatva és védetten elérhető.</p>
          </div>
          <div className="bg-[#0a0908] p-7">
            <p className="text-[10px] tracking-[0.18em] text-white/35 uppercase">Hozzáférés</p>
            <p className="mt-3 font-serif text-2xl text-[#cda464]">Csak admin</p>
            <p className="mt-2 text-sm text-white/45">Nyilvános regisztráció nincs.</p>
          </div>
          <div className="bg-[#0a0908] p-7">
            <p className="text-[10px] tracking-[0.18em] text-white/35 uppercase">Telefonos auth</p>
            <p className="mt-3 font-serif text-2xl text-white/45">Előkészítve</p>
            <p className="mt-2 text-sm text-white/45">Jelenleg kikapcsolva.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
