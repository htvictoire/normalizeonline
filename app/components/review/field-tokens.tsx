"use client";

import { useState, useRef, type KeyboardEvent } from "react";

type Props = {
  label: string;
  tokens: string[];
  onChange: (tokens: string[]) => void;
};

export default function FieldTokens({ label, tokens, onChange }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const token = raw.trim();
    if (token && !tokens.includes(token)) {
      onChange([...tokens, token]);
    }
    setInput("");
  }

  function remove(i: number) {
    onChange(tokens.filter((_, idx) => idx !== i));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && input === "" && tokens.length > 0) {
      onChange(tokens.slice(0, -1));
    }
  }

  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 shrink-0 text-xs font-medium text-ink">{label}</span>
      <div
        className="flex min-h-[28px] flex-1 flex-wrap items-center gap-1 rounded-lg border border-border bg-canvas px-2 py-1 transition-colors focus-within:border-brand cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tokens.map((token, i) => (
          <span
            key={`${token}-${i}`}
            className="flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand"
          >
            {token}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(i); }}
              className="leading-none text-brand/60 hover:text-brand"
              aria-label={`Remove ${token}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) add(input); }}
          className="min-w-[4rem] flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-muted"
          placeholder={tokens.length === 0 ? "…" : ""}
        />
      </div>
    </div>
  );
}
