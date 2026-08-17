const newsItems = [
  {
    number: "01",
    category: "Kiállítás",
    date: "2026. június 2.",
    dateTime: "2026-06-02",
    title: "Ausztrál nemzeti bajnokság 2026 – Sydney",
    excerpt:
      "Edvin von neu Garmond SG2 helyezést ért el a Sydney-ben rendezett 52. GSDCA Nemzeti Kiállításon.",
    href: "https://www.garmondkennel.hu/hirek/100",
  },
  {
    number: "02",
    category: "Vérvonal",
    date: "2026. március 10.",
    dateTime: "2026-03-10",
    title: "Leila, Imola lánya",
    excerpt:
      "Leila vom Leithawald – Yankee dei Cimmeri és Imola vom Leithawald ígéretes utóda.",
    href: "https://www.garmondkennel.hu/hirek/99",
  },
  {
    number: "03",
    category: "Eredmény",
    date: "2026. március 10.",
    dateTime: "2026-03-10",
    title: "Mizeria von neu Garmond",
    excerpt:
      "VA1 Romania, IGP2 és Angekört minősítés – kiváló egészségügyi eredményekkel.",
    href: "https://www.garmondkennel.hu/hirek/98",
  },
];

export function NewsSection() {
  return (
    <section
      id="hírek"
      className="relative scroll-mt-20 overflow-hidden border-b border-[#b9924d]/25 bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(173,112,46,0.1),transparent_27%),linear-gradient(180deg,rgba(255,255,255,0.018),transparent_24%)]" />

      <div className="relative mx-auto max-w-[1480px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex flex-col gap-8 border-b border-[#b9924d]/25 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.34em] text-[#d6a552] uppercase">
              Aktualitások
            </p>
            <h2 className="font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
              Legfrissebb <span className="text-[#cda464]">híreink</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/50 sm:text-right">
            Eredmények, új generációk és kennelünk legfontosabb pillanatai.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-[#b9924d]/25 bg-[#b9924d]/25 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article key={item.href} className="group flex flex-col bg-[#090807]">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-[#b9924d]/20 bg-[#0c0a08]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(199,139,67,0.2),transparent_30%),linear-gradient(145deg,#110d09_0%,#070707_48%,#151009_100%)] transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none" />
                <div className="absolute -right-2 -bottom-8 font-serif text-[9rem] leading-none text-[#d6a552]/[0.055] sm:text-[11rem]">
                  {item.number}
                </div>
                <div className="absolute top-5 left-5 border border-[#b9924d]/40 bg-black/35 px-3 py-2 text-[10px] font-semibold tracking-[0.2em] text-[#d6a552] uppercase backdrop-blur-sm">
                  {item.category}
                </div>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 64 64"
                  className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 fill-none stroke-[#d6a552]/55 stroke-[1.2]"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 17h38v34H13zM20 25h24M20 32h24M20 39h14" />
                  <path d="M39 39h5v5h-5z" />
                </svg>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <time
                  dateTime={item.dateTime}
                  className="text-[10px] tracking-[0.18em] text-[#cda464]/70 uppercase"
                >
                  {item.date}
                </time>
                <h3 className="mt-4 font-serif text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-[#d6a552]">
                  {item.title}
                </h3>
                <p className="mt-5 flex-1 text-sm leading-7 text-white/50">{item.excerpt}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-5 self-start text-[11px] font-semibold tracking-[0.18em] text-[#d6a552] uppercase"
                >
                  Tovább
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href="https://www.garmondkennel.hu/hirek"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center gap-8 border border-[#b9924d] px-7 text-xs font-semibold tracking-[0.16em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
          >
            További híreink <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
