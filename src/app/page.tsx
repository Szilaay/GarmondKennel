import Image from "next/image";
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
    </main>
  );
}
