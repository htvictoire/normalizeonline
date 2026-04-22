"use client";

import { useState } from "react";

type Option = { value: string; label: string };

type Props = {
  label?: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  disabled?: boolean;
  width?: string;
};

export default function FieldSelect({ label, value, options, onChange, disabled, width }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const hasFixedWidth = Boolean(width);

  return (
    <div className="flex items-center gap-2">
      {label && <span className="shrink-0 text-xs font-medium text-ink">{label}</span>}
      <div
        className={`relative ${width ?? ""}`}
        onMouseEnter={() => !disabled && setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 ${
            hasFixedWidth ? "w-full justify-between text-left" : ""
          }`}
        >
          <span>{selected?.label ?? value}</span>
          <svg
            viewBox="0 0 24 24"
            className={`h-3 w-3 shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && !disabled && (
          <div className={`absolute left-0 top-full z-20 pt-1 ${hasFixedWidth ? "w-full" : ""}`}>
            <div
              className={`rounded-xl border border-border bg-canvas p-1.5 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)] ${
                hasFixedWidth ? "w-full min-w-full" : "min-w-[9rem]"
              }`}
            >
              {options.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    o.value === value
                      ? "bg-brand text-canvas"
                      : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
