"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Kezdőlap", href: "#kezdolap" },
  { label: "Kanok", href: "https://www.garmondkennel.hu/fedezokanok" },
  { label: "Szukák", href: "https://www.garmondkennel.hu/szukak" },
  { label: "Almok", href: "https://www.garmondkennel.hu/kiskutyak" },
  { label: "Eredmények", href: "#hírek" },
  { label: "Rólunk", href: "#rólunk" },
  { label: "Hírek", href: "#hírek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

export function StickyHeader({ showAdmin }: { showAdmin: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleNavigation = showAdmin
    ? [...navigation, { label: "Admin", href: "/admin" }]
    : navigation;

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

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
          {visibleNavigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                item.label === "Admin"
                  ? "border border-[#b9924d]/65 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-[#d6a552] uppercase transition-colors hover:bg-[#b9924d] hover:text-black"
                  : "text-[11px] font-medium tracking-[0.12em] text-white/75 uppercase transition-colors hover:text-[#d6a552]"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Menü megnyitása"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-content-center gap-1.5 border border-[#b9924d]/55 transition-colors hover:border-[#d6a552] xl:hidden"
        >
          <span
            className={`block h-px w-5 bg-[#d6a552] transition-transform duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-[#d6a552] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-[#d6a552] transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 bottom-0 border-t border-[#b9924d]/25 bg-[#050505]/97 px-5 backdrop-blur-xl transition-[top,opacity,visibility,transform] duration-300 xl:hidden ${
          scrolled ? "top-20" : "top-24"
        } ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <nav aria-label="Mobil navigáció" className="mx-auto flex h-full max-w-lg flex-col justify-center py-8">
          {visibleNavigation.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-b py-4 font-serif text-2xl transition-colors hover:text-[#d6a552] ${
                item.label === "Admin"
                  ? "border-[#b9924d]/35 text-[#d6a552]"
                  : "border-white/10 text-white/85"
              }`}
            >
              <span>{item.label}</span>
              <span className="font-sans text-[10px] tracking-[0.18em] text-[#d6a552]/65">
                {String(index + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
