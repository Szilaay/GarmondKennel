import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { AdminLoginForm } from "@/components/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin belépés | Garmond Kennel",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050505] px-5 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(179,116,47,0.18),transparent_30%),linear-gradient(130deg,#050505_0%,#0b0805_48%,#020202_100%)]" />
      <div className="relative w-full max-w-md border border-[#b9924d]/30 bg-[#080706]/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <Link href="/" aria-label="Vissza a főoldalra" className="mx-auto block w-fit">
          <BrandLogo className="h-24 w-36" />
        </Link>
        <div className="mt-7 text-center">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-[#d6a552] uppercase">
            Zárt adminisztráció
          </p>
          <h1 className="mt-4 font-serif text-4xl">Admin belépés</h1>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Adja meg az adminisztrátori hitelesítő adatokat.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
