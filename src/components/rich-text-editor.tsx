"use client";

import { useRef } from "react";

const toolbarButton =
  "grid h-10 min-w-10 place-items-center border border-white/10 px-3 text-xs text-white/70 transition-colors hover:border-[#b9924d]/60 hover:text-[#d6a552]";

export function RichTextEditor({ initialValue }: { initialValue: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const syncValue = () => {
    if (editorRef.current && inputRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  };

  const saveSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

  const runCommand = (command: string, value?: string) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    editor?.focus();
    if (selection && selectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
    document.execCommand(command, false, value);
    saveSelection();
    syncValue();
  };

  return (
    <div className="overflow-hidden border border-[#b9924d]/30 bg-black/25">
      <div className="flex flex-wrap gap-2 border-b border-[#b9924d]/20 bg-[#0d0b09] p-3">
        <button type="button" className={`${toolbarButton} font-bold`} onClick={() => runCommand("bold")} title="Félkövér">
          B
        </button>
        <button type="button" className={`${toolbarButton} italic`} onClick={() => runCommand("italic")} title="Dőlt">
          I
        </button>
        <button type="button" className={`${toolbarButton} underline`} onClick={() => runCommand("underline")} title="Aláhúzott">
          U
        </button>
        <button type="button" className={toolbarButton} onClick={() => runCommand("insertUnorderedList")} title="Felsorolás">
          • Lista
        </button>
        <select
          aria-label="Betűméret"
          defaultValue="3"
          onChange={(event) => runCommand("fontSize", event.target.value)}
          className="h-10 border border-white/10 bg-[#0d0b09] px-3 text-xs text-white/70 outline-none focus:border-[#b9924d]/60"
        >
          <option value="2">Kicsi</option>
          <option value="3">Normál</option>
          <option value="4">Nagy</option>
          <option value="5">Címsor</option>
        </select>
        <label className={`${toolbarButton} cursor-pointer gap-2`}>
          Szín
          <input
            type="color"
            defaultValue="#d6a552"
            aria-label="Szövegszín"
            onChange={(event) => runCommand("foreColor", event.target.value)}
            className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        <button type="button" className={toolbarButton} onClick={() => runCommand("removeFormat")} title="Formázás törlése">
          Törlés
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Formázott leírás"
        aria-multiline="true"
        onInput={syncValue}
        onBlur={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="min-h-64 px-5 py-4 text-sm leading-7 text-white/75 outline-none empty:before:text-white/25 empty:before:content-['Írja_ide_a_kutya_leírását…']"
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
      <input ref={inputRef} type="hidden" name="descriptionHtml" defaultValue={initialValue} />
    </div>
  );
}
