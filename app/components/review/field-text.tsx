"use client";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  width?: string;
};

export default function FieldText({ label, value, onChange, mono, width = "w-20" }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-xs font-medium text-ink">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-ink outline-none transition-colors focus:border-brand ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
