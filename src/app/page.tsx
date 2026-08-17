export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#2f382d]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
        <nav className="flex items-center justify-between border-b border-[#2f382d]/20 pb-5">
          <span className="text-lg font-semibold tracking-[0.22em] uppercase">Garmond Kennel</span>
          <span className="text-sm text-[#66705f]">Hamarosan</span>
        </nav>
        <div className="py-20 sm:py-28">
          <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-[#8b6749] uppercase">
            Gondoskodás · Minőség · Hűség
          </p>
          <h1 className="max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Egy jó társ egy életre szól.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#596255] sm:text-xl">
            A Garmond Kennel új weboldala készül. Hamarosan bemutatjuk kutyáinkat,
            közelgő almokat és tenyésztési szemléletünket.
          </p>
        </div>
        <footer className="flex flex-col gap-2 border-t border-[#2f382d]/20 pt-5 text-sm text-[#66705f] sm:flex-row sm:justify-between">
          <span>Garmond Kennel</span>
          <span>Magyarország</span>
        </footer>
      </section>
    </main>
  );
}
