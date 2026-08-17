import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { BrandLogo } from "@/components/brand-logo";

export function AdminPageShell({
  children,
  title,
  eyebrow,
  backHref = "/admin",
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  backHref?: string;
}) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-[#b9924d]/25 bg-[#080706]">
        <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="Garmond főoldal">
            <BrandLogo className="h-20 w-28" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="border border-white/15 px-4 py-3 text-[10px] font-semibold tracking-[0.16em] text-white/60 uppercase transition-colors hover:border-[#b9924d]/55 hover:text-[#d6a552]"
            >
              Vissza
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border border-[#b9924d]/50 px-4 py-3 text-[10px] font-semibold tracking-[0.16em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
              >
                Kijelentkezés
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#d6a552] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{title}</h1>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
