import Image from "next/image";

const navigation = [
  "Kezdőlap",
  "Kutyáink",
  "Kanok",
  "Szukák",
  "Almok",
  "Eredmények",
  "Rólunk",
  "Hírek",
  "Kapcsolat",
];

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
      <section className="relative isolate min-h-screen border-b border-[#b9924d]/35">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_42%,rgba(128,82,30,0.18),transparent_31%),linear-gradient(115deg,#050505_0%,#090806_58%,#020202_100%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 w-[58%] bg-[linear-gradient(90deg,#050505_0%,transparent_48%),radial-gradient(circle_at_70%_45%,rgba(214,151,70,0.12),transparent_38%)]" />

        <header className="mx-auto flex h-24 max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:h-28 lg:px-12">
          <a href="#kezdolap" aria-label="Garmond kezdőlap" className="relative h-20 w-28 shrink-0 lg:h-24 lg:w-36">
            <Image
              src="/garmond-logo.png"
              alt="Garmond kennel logó"
              fill
              priority
              sizes="144px"
              className="object-contain"
              style={{ filter: "url(#logo-black-to-white)" }}
            />
          </a>

          <nav aria-label="Fő navigáció" className="hidden items-center gap-7 xl:flex">
            {navigation.map((item, index) => (
              <a
                key={item}
                href={index === 0 ? "#kezdolap" : `#${item.toLocaleLowerCase("hu-HU")}`}
                className="text-[11px] font-medium tracking-[0.12em] text-white/75 uppercase transition-colors hover:text-[#d6a552]"
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Menü megnyitása"
            className="grid h-11 w-11 place-content-center gap-1.5 border border-[#b9924d]/55 xl:hidden"
          >
            <span className="block h-px w-5 bg-[#d6a552]" />
            <span className="block h-px w-5 bg-[#d6a552]" />
            <span className="block h-px w-5 bg-[#d6a552]" />
          </button>
        </header>

        <div id="kezdolap" className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-[1480px] items-center px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pb-28">
          <div className="relative z-10 max-w-2xl pt-12 lg:pt-0">
            <p className="mb-5 text-xs font-semibold tracking-[0.34em] text-[#d6a552] uppercase">
              Garmond Kennel · Magyarország
            </p>
            <h1 className="font-serif text-5xl leading-[0.98] tracking-[0.01em] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
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

          <div className="relative mt-16 min-h-72 lg:mt-0 lg:min-h-[640px]" aria-label="A hero kutyakép helye">
            <div className="absolute inset-0 grid place-items-center border border-dashed border-[#b9924d]/15 text-center text-[10px] tracking-[0.28em] text-[#b9924d]/35 uppercase">
              Hero kutyakép helye
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
