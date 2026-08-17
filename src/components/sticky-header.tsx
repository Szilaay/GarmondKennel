"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

export function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out motion-reduce:transition-none ${
        scrolled
          ? "h-20 border-[#b9924d]/25 bg-[#050505]/88 shadow-[0_12px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "h-24 border-transparent bg-transparent lg:h-28"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#kezdolap"
          aria-label="Garmond kezdőlap"
          className={`relative shrink-0 transition-[width,height] duration-500 ease-out motion-reduce:transition-none ${
            scrolled ? "h-16 w-24" : "h-20 w-28 lg:h-24 lg:w-36"
          }`}
        >
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
          className="grid h-11 w-11 place-content-center gap-1.5 border border-[#b9924d]/55 transition-colors hover:border-[#d6a552] xl:hidden"
        >
          <span className="block h-px w-5 bg-[#d6a552]" />
          <span className="block h-px w-5 bg-[#d6a552]" />
          <span className="block h-px w-5 bg-[#d6a552]" />
        </button>
      </div>
    </header>
  );
}
