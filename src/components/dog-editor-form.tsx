"use client";

import { useActionState } from "react";

import {
  createDogAction,
  updateDogAction,
  type DogFormState,
} from "@/app/admin/kutyak/actions";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { DogRecord } from "@/lib/dogs";

const initialState: DogFormState = { error: null };

export function DogEditorForm({ mode, dog }: { mode: "create" | "edit"; dog?: DogRecord }) {
  const action = mode === "create" ? createDogAction : updateDogAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {dog && <input type="hidden" name="id" value={dog.id} />}

      <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <label htmlFor="dog-name" className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-[#cda464] uppercase">
            Név
          </label>
          <input
            id="dog-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={dog?.name ?? ""}
            className="h-14 w-full border border-[#b9924d]/30 bg-black/25 px-4 text-white outline-none focus:border-[#d6a552]"
            placeholder="A kutya teljes neve"
          />
        </div>

        <fieldset>
          <legend className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-[#cda464] uppercase">
            Nem
          </legend>
          <div className="grid h-14 grid-cols-2 gap-px border border-[#b9924d]/30 bg-[#b9924d]/30">
            {[
              { value: "male", label: "Kan" },
              { value: "female", label: "Szuka" },
            ].map((option) => (
              <label key={option.value} className="relative grid cursor-pointer place-items-center bg-[#090807] text-xs tracking-[0.15em] text-white/60 uppercase has-checked:bg-[#b9924d] has-checked:text-black">
                <input
                  type="radio"
                  name="sex"
                  value={option.value}
                  required
                  defaultChecked={(dog?.sex ?? "male") === option.value}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-[#cda464] uppercase">
          Kategóriák
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "isYoung", label: "Fiatal", checked: dog?.is_young },
            { name: "isBlack", label: "Fekete", checked: dog?.is_black },
            { name: "isLongHaired", label: "Hosszú szőrű", checked: dog?.is_long_haired },
          ].map((option) => (
            <label key={option.name} className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-white/65 transition-colors has-checked:border-[#b9924d]/60 has-checked:text-[#d6a552]">
              <input
                type="checkbox"
                name={option.name}
                defaultChecked={option.checked}
                className="h-4 w-4 accent-[#b9924d]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-[#cda464] uppercase">
          Leírás
        </p>
        <RichTextEditor initialValue={dog?.description_html ?? ""} />
        <p className="mt-2 text-xs text-white/30">Félkövér, dőlt, aláhúzás, betűméret, szín és felsorolás használható.</p>
      </div>

      {state.error && (
        <p role="alert" className="border border-red-400/25 bg-red-950/25 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-14 border border-[#b9924d] bg-[#b9924d] px-8 text-xs font-semibold tracking-[0.17em] text-black uppercase transition-colors hover:bg-[#d6a552] disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Mentés…" : mode === "create" ? "Kutya létrehozása" : "Változtatások mentése"}
        </button>
        {mode === "create" && (
          <p className="text-xs leading-5 text-white/35">Mentés után képek és videók tölthetők fel.</p>
        )}
        {mode === "edit" && state.success && (
          <p aria-live="polite" className="text-xs text-emerald-300/70">Változtatások elmentve.</p>
        )}
      </div>
    </form>
  );
}
