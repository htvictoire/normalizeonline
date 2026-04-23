"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ExportFormat, ExportState } from "@/lib/hooks/use-export-file";

const FORMATS: ExportFormat[] = ["csv", "json", "xlsx", "parquet"];

const BADGE_COLOR: Record<ExportFormat, string> = {
  csv:     "border-accent/30 bg-accent/15 text-accent-dark",
  json:    "border-brand/20 bg-brand/10 text-brand-dark",
  xlsx:    "border-border bg-ink/8 text-ink-muted",
  parquet: "border-accent/30 bg-accent/15 text-accent-dark",
};

type Props = {
  open: boolean;
  exportState: ExportState;
  onExport: (format: ExportFormat) => void;
  onClose: () => void;
};

export default function ExportModal({ open, exportState, onExport, onClose }: Props) {
  if (!open) return null;

  return (
    <OpenExportModal exportState={exportState} onExport={onExport} onClose={onClose} />
  );
}

function OpenExportModal({
  exportState,
  onExport,
  onClose,
}: Omit<Props, "open">) {
  const t = useTranslations("processing.export");
  const [selected, setSelected] = useState<ExportFormat>("csv");
  const dialogRef = useRef<HTMLDivElement>(null);

  const isPreparing = exportState.phase === "preparing";
  const isDone      = exportState.phase === "done";
  const isError     = exportState.phase === "error";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="w-full max-w-lg rounded-2xl bg-canvas shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-ink">{t("title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
            aria-label={t("close")}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Format grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {FORMATS.map((fmt) => {
              const isSelected = selected === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  disabled={isPreparing}
                  onClick={() => setSelected(fmt)}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-sm"
                      : "border-border hover:border-brand/40 hover:bg-brand/3 disabled:cursor-not-allowed disabled:opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{t(`formats.${fmt}.label`)}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${BADGE_COLOR[fmt]}`}>
                      {t(`formats.${fmt}.badge`)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-ink-muted">{t(`formats.${fmt}.description`)}</p>
                </button>
              );
            })}
          </div>

          {/* Selected format hint */}
          <div className="flex items-start gap-2.5 rounded-lg bg-border/40 px-3.5 py-3">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="text-xs leading-relaxed text-ink-muted">{t(`formats.${selected}.hint`)}</p>
          </div>

          {/* Progress bar (preparing state) */}
          {isPreparing && exportState.format === selected && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-brand/20 border-t-brand animate-[spin_0.6s_linear_infinite]" />
                  {t("preparingFile", { format: t(`formats.${exportState.format}.label`) })}
                </span>
                <span>{Math.round(exportState.progress)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${exportState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className="rounded-lg bg-error/8 px-3.5 py-2.5 text-xs text-error">
              {t(exportState.errorKey)}
            </p>
          )}

          {/* Done state */}
          {isDone && (
            <p className="rounded-lg bg-accent/10 px-3.5 py-2.5 text-xs font-medium text-accent-dark">
              {t("downloadStarted")}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            {isDone ? t("close") : t("cancel")}
          </button>
          <button
            type="button"
            disabled={isPreparing}
            onClick={() => onExport(selected)}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPreparing ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-[spin_0.6s_linear_infinite]" />
                {t("preparing")}
              </>
            ) : isDone ? (
              t("downloadAgain")
            ) : (
              t("download")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
