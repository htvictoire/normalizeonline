"use client";

type Props = {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean;
  step?: number;
  min?: number;
  max?: number;
};

export default function FieldNumber({ label, value, onChange, disabled, step, min, max }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-xs font-medium text-ink">{label}</span>
      <input
        type="number"
        value={value ?? ""}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(isNaN(n) ? null : n);
        }}
        className="w-20 rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-ink outline-none transition-colors focus:border-brand disabled:cursor-not-allowed disabled:opacity-40"
      />
    </div>
  );
}
