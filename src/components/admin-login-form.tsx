"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/app/admin/bejelentkezes/actions";

const initialState: LoginState = { error: null };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-[10px] font-semibold tracking-[0.2em] text-[#cda464] uppercase"
        >
          Felhasználónév
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={64}
          className="h-14 w-full border border-[#b9924d]/35 bg-black/35 px-4 text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#d6a552]"
          placeholder="Admin felhasználónév"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[10px] font-semibold tracking-[0.2em] text-[#cda464] uppercase"
        >
          Jelszó
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={12}
          maxLength={256}
          className="h-14 w-full border border-[#b9924d]/35 bg-black/35 px-4 text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#d6a552]"
          placeholder="••••••••••••"
        />
      </div>

      <div className="flex items-center justify-between border border-[#b9924d]/20 bg-[#d6a552]/[0.035] px-4 py-3">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-white/45 uppercase">Telefonos azonosítás</p>
          <p className="mt-1 text-xs text-white/30">Előkészítve, jelenleg kikapcsolva</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
      </div>

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-400/25 bg-red-950/25 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-14 w-full items-center justify-center border border-[#b9924d] bg-[#b9924d] px-6 text-xs font-semibold tracking-[0.18em] text-black uppercase transition-colors hover:bg-[#d6a552] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Ellenőrzés…" : "Belépés"}
      </button>

      <p className="text-center text-xs leading-5 text-white/30">
        Nyilvános regisztráció nem érhető el. A felület kizárólag a kennel adminisztrátora
        számára használható.
      </p>
    </form>
  );
}
