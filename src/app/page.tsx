import Image from "next/image";
import { NewsSection } from "@/components/news-section";
import { StickyHeader } from "@/components/sticky-header";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id="logo-black-to-white" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    -1 0 0 0 1
                    -1 0 0 0 1
                    0 0 0 1 0"
          />
        </filter>
      </svg>
      <StickyHeader />
      <section className="relative isolate min-h-screen border-b border-[#b9924d]/35">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/hero-garmond-cinematic.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center] opacity-90 sm:object-[64%_center] lg:opacity-100"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-black/55 lg:hidden" />
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.96)_27%,rgba(5,5,5,0.72)_42%,rgba(5,5,5,0.08)_66%,rgba(5,5,5,0.12)_100%)] lg:block" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(5,5,5,0.82)_0%,transparent_24%,transparent_80%,rgba(5,5,5,0.45)_100%)]" />

        <div className="h-24 lg:h-28" aria-hidden="true" />

        <div id="kezdolap" className="mx-auto grid min-h-[calc(100vh-6rem)] scroll-mt-20 max-w-[1480px] items-center px-5 pb-20 sm:px-8 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-28">
          <div className="relative z-10 max-w-2xl pt-12 lg:pt-0">
            <p className="mb-5 text-xs font-semibold tracking-[0.34em] text-[#d6a552] uppercase">
              Garmond Kennel · Magyarország
            </p>
            <h1 className="font-serif text-5xl leading-[0.98] tracking-[0.01em] sm:text-6xl lg:text-7xl xl:text-[4.6rem] 2xl:text-[5.4rem]">
              <span className="block text-[#cda464]">Bajnokok</span>
              <span className="mt-2 block">nem születnek.</span>
              <span className="mt-2 block">Felneveljük őket.</span>
            </h1>
            <div className="my-8 h-px w-14 bg-[#d6a552]" />
            <p className="max-w-xl text-sm leading-7 tracking-[0.18em] text-white/65 uppercase sm:text-base">
              Prémium vérvonal. Kiváló egészség.<br />
              Kiegyensúlyozott jellem. Időtálló érték.
            </p>
            <a
              href="#kutyáink"
              className="mt-10 inline-flex h-14 items-center gap-8 border border-[#b9924d] px-7 text-xs font-semibold tracking-[0.16em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
            >
              Kutyáink <span aria-hidden="true">—</span>
            </a>
          </div>

          <div className="hidden min-h-[640px] lg:block" aria-hidden="true" />
        </div>
      </section>

      <section
        id="rólunk"
        className="relative scroll-mt-20 overflow-hidden border-b border-[#b9924d]/25 bg-[#080706]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_36%,rgba(171,111,45,0.11),transparent_30%),linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.018)_48%,transparent_48.2%)]" />

        <div className="relative mx-auto max-w-[1480px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="mb-6 text-xs font-semibold tracking-[0.34em] text-[#d6a552] uppercase">
                Rólunk
              </p>
              <h2 className="max-w-xl font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                <span className="block">Hagyomány.</span>
                <span className="block text-[#cda464]">Tapasztalat.</span>
                <span className="block">Elkötelezettség.</span>
              </h2>
              <div className="mt-8 h-px w-14 bg-[#d6a552]" />
            </div>

            <div className="self-center border-l border-[#b9924d]/30 pl-6 sm:pl-10 lg:pl-14">
              <p className="text-lg leading-8 text-white/85 sm:text-xl sm:leading-9">
                Kennelünk több mint 30 éves múltra tekint vissza. Ez idő alatt több,
                világviszonylatban is sikeres német juhászkutyát neveltünk fel.
              </p>
              <p className="mt-7 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                A több évtized alatt megszerzett tapasztalat, valamint a vérvonalak hosszú
                évekre visszanyúló tanulmányozása és ismerete segít abban, hogy kiváló
                vérvonalú szukáinkhoz a legmegfelelőbb tenyészkant válasszuk.
              </p>
              <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                Mindez egyfajta garanciát adhat leendő tulajdonosainknak és számunkra is
                arra, hogy minél egészségesebb genetikájú, kiváló felépítésű és stabil
                idegrendszerű kutyákat adhassunk át leendő gazdáiknak.
              </p>
            </div>
          </div>

          <div className="mt-20 grid border border-[#b9924d]/25 sm:grid-cols-3 lg:mt-24">
            <div className="flex items-center gap-5 border-b border-[#b9924d]/25 p-6 sm:border-r sm:border-b-0 lg:p-8">
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-11 w-11 shrink-0 fill-none stroke-[#d6a552] stroke-[1.6]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="16" />
                <path d="M24 13v12l8 5" />
              </svg>
              <div>
                <p className="font-serif text-2xl text-[#cda464]">30+ év</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-white/55 uppercase">
                  Tenyésztői tapasztalat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-[#b9924d]/25 p-6 sm:border-r sm:border-b-0 lg:p-8">
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-11 w-11 shrink-0 fill-none stroke-[#d6a552] stroke-[1.4]"
              >
                <path d="M16 8h16v8c0 6.6-3.6 11-8 11s-8-4.4-8-11V8Z" />
                <path d="M16 12H9v3c0 5.1 3.3 8 8.2 8M32 12h7v3c0 5.1-3.3 8-8.2 8M24 27v8M17 40h14M20 35h8" />
              </svg>
              <div>
                <p className="font-serif text-2xl text-[#cda464]">Nemzetközi</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-white/55 uppercase">
                  Sikeres vérvonalak
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 lg:p-8">
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-11 w-11 shrink-0 fill-none stroke-[#d6a552] stroke-[1.6]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="8" r="3" />
                <circle cx="15" cy="24" r="3" />
                <circle cx="33" cy="24" r="3" />
                <circle cx="9" cy="40" r="3" />
                <circle cx="21" cy="40" r="3" />
                <circle cx="27" cy="40" r="3" />
                <circle cx="39" cy="40" r="3" />
                <path d="M24 11v6H15v4M24 17h9v4M15 27v6H9v4M15 33h6v4M33 27v6h-6v4M33 33h6v4" />
              </svg>
              <div>
                <p className="font-serif text-2xl text-[#cda464]">Generációk</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-white/55 uppercase">
                  Ismeret és tapasztalat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsSection />
    </main>
  );
}
