import Image from "next/image";

export function SiteFooter() {
  return (
    <footer
      id="kapcsolat"
      className="relative scroll-mt-20 overflow-hidden bg-[#080706]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(174,112,46,0.12),transparent_28%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.018)_50%,transparent_50.2%)]" />

      <div className="relative mx-auto max-w-[1480px] px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="grid gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:pb-24">
          <div>
            <p className="mb-6 text-xs font-semibold tracking-[0.34em] text-[#d6a552] uppercase">
              Kapcsolat
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Egy kiváló társ története
              <span className="block text-[#cda464]">egy jó döntéssel kezdődik.</span>
            </h2>
            <div className="mt-8 h-px w-14 bg-[#d6a552]" />
            <p className="mt-8 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Kérdése van kutyáinkkal, vérvonalainkkal vagy aktuális almokkal
              kapcsolatban? Keressen bennünket bizalommal.
            </p>
          </div>

          <address className="grid self-center gap-px overflow-hidden border border-[#b9924d]/25 bg-[#b9924d]/25 not-italic">
            <a
              href="tel:+36204869786"
              className="group flex items-center gap-5 bg-[#0a0908] p-6 transition-colors hover:bg-[#100d09] sm:p-7"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-9 w-9 shrink-0 fill-none stroke-[#d6a552] stroke-[1.5]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 7l6 9-5 5c2.8 5.1 6.9 9.2 12 12l5-5 9 6-3 7c-1 2.2-3.4 3.3-5.8 2.7C20 39.9 8.1 28 4.3 12.8 3.7 10.4 4.8 8 7 7l7-3 3 3Z" />
              </svg>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Telefon</p>
                <p className="mt-1 font-serif text-xl text-white transition-colors group-hover:text-[#d6a552]">
                  +36 20 486 9786
                </p>
              </div>
            </a>

            <a
              href="mailto:neugarmond@gmail.com"
              className="group flex items-center gap-5 bg-[#0a0908] p-6 transition-colors hover:bg-[#100d09] sm:p-7"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-9 w-9 shrink-0 fill-none stroke-[#d6a552] stroke-[1.5]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="10" width="38" height="28" rx="1" />
                <path d="m7 13 17 14 17-14" />
              </svg>
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">E-mail</p>
                <p className="mt-1 truncate font-serif text-xl text-white transition-colors group-hover:text-[#d6a552]">
                  neugarmond@gmail.com
                </p>
              </div>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=6000+Kecskem%C3%A9t"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 bg-[#0a0908] p-6 transition-colors hover:bg-[#100d09] sm:p-7"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-9 w-9 shrink-0 fill-none stroke-[#d6a552] stroke-[1.5]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M24 44S10 31.2 10 19a14 14 0 1 1 28 0c0 12.2-14 25-14 25Z" />
                <circle cx="24" cy="19" r="5" />
              </svg>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Helyszín</p>
                <p className="mt-1 font-serif text-xl text-white transition-colors group-hover:text-[#d6a552]">
                  6000 Kecskemét
                </p>
              </div>
            </a>
          </address>
        </div>

        <div className="flex flex-col gap-8 border-t border-[#b9924d]/25 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-24 shrink-0">
              <Image
                src="/garmond-logo.png"
                alt="Garmond kennel logó"
                fill
                sizes="96px"
                className="object-contain"
                style={{ filter: "url(#logo-black-to-white)" }}
              />
            </div>
            <p className="max-w-xs text-[10px] leading-5 tracking-[0.16em] text-[#cda464]/70 uppercase">
              Minőség, ami generációkon át érték marad.
            </p>
          </div>
          <p className="text-[10px] tracking-[0.12em] text-white/35 uppercase">
            © 2026 neu Garmond Kennel · Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
