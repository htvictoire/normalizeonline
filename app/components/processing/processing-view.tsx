"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getDataset, getReportUrl } from "@/lib/api/endpoints/normalization";
import { useExportFile } from "@/lib/hooks/use-export-file";
import ExportModal from "./export-modal";
import type { Dataset } from "@/lib/types/dataset";
import type { InstanceStatus, StageColor } from "@/lib/types/normalize";
import { IN_FLIGHT, TERMINAL, STAGES, STATUS_CONFIG, STAGE_ORDER } from "@/lib/constants/instance-status";
import { fillColor } from "@/lib/utils";
import ProfilingDashboard from "./profiling-dashboard";
import QualityPanel from "./quality-panel";

function getStageIndex(s: InstanceStatus): number {
  return STAGE_ORDER.indexOf(STATUS_CONFIG[s].stage);
}

function StepDot({ state, color }: { state: "done" | "active" | "pending"; color: StageColor }) {
  if (state === "done") {
    return (
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color.done}`}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${color.activeBorder} ${color.activeBg}`}>
        <div className={`h-2 w-2 animate-pulse rounded-full ${color.activePulse}`} />
      </div>
    );
  }
  return <div className="h-7 w-7 shrink-0 rounded-full border-2 border-border bg-canvas" />;
}

export default function ProcessingView({ dataset: initialDataset }: { dataset: Dataset }) {
  const t = useTranslations("processing");
  const router = useRouter();
  const [dataset, setDataset] = useState(initialDataset);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(!TERMINAL.includes((initialDataset.status ?? "") as InstanceStatus));
  const [exportOpen, setExportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const { state: exportState, startExport, reset: resetExport } = useExportFile(dataset.id);

  async function handleReportDownload() {
    setReportLoading(true);
    try {
      const { url, filename } = await getReportUrl(dataset.id);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setReportLoading(false);
    }
  }
  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = (dataset.status ?? "CONFIRMED") as InstanceStatus;
  const isTerminal = TERMINAL.includes(status);
  const stageIndex = getStageIndex(status);
  const checkpoint = STATUS_CONFIG[status]?.checkpoint;
  const effectiveProgress = checkpoint ? Math.max(progress, checkpoint.floor) : progress;

  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    async function pollOnce() {
      try {
        const fresh = await getDataset(dataset.id);
        if (cancelled) return;

        setDataset(fresh);
        if (IN_FLIGHT.includes((fresh.status ?? "") as InstanceStatus)) {
          pollTimer = setTimeout(pollOnce, 2000);
        }
      } catch {
        if (cancelled) return;
        pollTimer = setTimeout(pollOnce, 3000);
      }
    }

    if (!isTerminal) {
      pollTimer = setTimeout(pollOnce, 2000);
    } else {
      hideTimerRef.current = setTimeout(() => setProgressVisible(false), 1000);
    }

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [dataset.id, isTerminal]);

  useEffect(() => {
    if (!checkpoint) return;

    if (creepRef.current) clearInterval(creepRef.current);

    if (checkpoint.floor === checkpoint.ceil) return;

    creepRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.max(prev, checkpoint.floor);
        if (next >= checkpoint.ceil) {
          clearInterval(creepRef.current!);
          return next;
        }
        return next + 0.15;
      });
    }, 400);

    return () => { if (creepRef.current) clearInterval(creepRef.current); };
  }, [checkpoint]);

  const statusKey = (STATUS_CONFIG[status]?.translationKey ?? "statusFailed") as Parameters<typeof t>[0];
  const showProfilingSpinner = !isTerminal && status === "PROFILING";

  const profiling = dataset.profiling_output;
  const rowCount = profiling?.row_count ?? dataset.suggestion_display?.row_count ?? 0;
  const columnCount = profiling?.column_count
    ?? (dataset.suggested_config ? Object.keys(dataset.suggested_config.column_config).length : 0);
  const errorCount   = profiling ? profiling.issues.filter((i) => i.severity === "ERROR").length   : 0;
  const warningCount = profiling ? profiling.issues.filter((i) => i.severity === "WARNING").length : 0;
  const completenessColor = profiling ? fillColor(profiling.completeness_ratio * 100) : "";

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-ink">{t("heading")}</h1>
        {(status === "READY" || status === "READY_WITH_WARNINGS") && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={reportLoading}
              onClick={handleReportDownload}
              className="flex items-center gap-2 rounded-md border border-brand px-8 py-3 text-sm font-medium text-brand transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reportLoading && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-brand/20 border-t-brand animate-[spin_0.6s_linear_infinite]" />
              )}
              {t("downloadReport")}
            </button>
            <button
              type="button"
              onClick={() => { resetExport(); setExportOpen(true); }}
              className="rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-dark hover:bg-brand-dark"
            >
              {t("exportOutput")}
            </button>
          </div>
        )}
        <ExportModal
          open={exportOpen}
          exportState={exportState}
          onExport={startExport}
          onClose={() => setExportOpen(false)}
        />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
        <span><span className="font-medium text-ink">{rowCount.toLocaleString()}</span> {t("rows")}</span>
        <span className="text-border">·</span>
        <span><span className="font-medium text-ink">{columnCount}</span> {t("columns")}</span>
        <span className="text-border">·</span>
        <span>{dataset.original_name}</span>
        <span className="text-border">·</span>
        <span>{dataset.size_mb.toFixed(2)} MB</span>
        {profiling && (
          <>
            <span className="text-border">·</span>
            <span><span className={`font-medium ${completenessColor}`}>{profiling.completeness_ratio >= 1 ? "100%" : `${(profiling.completeness_ratio * 100).toFixed(1)}%`}</span> {t("complete")}</span>
          </>
        )}
        {errorCount > 0 && (
          <><span className="text-border">·</span>
          <span className="font-medium text-red-600">{t("errorCount", { count: errorCount })}</span></>
        )}
        {warningCount > 0 && (
          <><span className="text-border">·</span>
          <span className="font-medium text-amber-600">{t("warningCount", { count: warningCount })}</span></>
        )}
      </div>
    <div className="mt-8">
      {/* Unified stepper — connectors are the progress bar, fades out 1s after completion */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${progressVisible ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex w-full items-start">
          {STAGES.map((stage, i) => {
            const state: "done" | "active" | "pending" =
              i < stageIndex || (i === stageIndex && isTerminal) ? "done" : i === stageIndex ? "active" : "pending";
            const segSize = 100 / (STAGES.length - 1);
            const connectorFill = i > 0
              ? Math.min(Math.max((effectiveProgress - (i - 1) * segSize) / segSize * 100, 0), 100)
              : 0;
            return (
              <Fragment key={stage.key}>
                {i > 0 && (
                  <div className="mt-3.5 h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
                      style={{ width: `${connectorFill}%` }}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1.5">
                  <StepDot state={state} color={stage.color} />
                  <span className={`text-xs ${state === "pending" ? "text-ink-muted" : state === "active" ? "text-brand font-medium" : "text-ink"}`}>
                    {t(`stage${stage.key.charAt(0).toUpperCase()}${stage.key.slice(1)}` as Parameters<typeof t>[0])}
                  </span>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {showProfilingSpinner && (
        <div className="mt-4 flex justify-center">
          <div className="h-6 w-6 rounded-full border-[3px] border-brand/20 border-t-brand animate-[spin_0.5s_linear_infinite]" />
        </div>
      )}

      {/* Status message */}
      <div className="mt-6">
        {!isTerminal && !showProfilingSpinner && (
          <p className="text-sm text-ink-muted">{t(statusKey)}</p>
        )}
      </div>

      {/* Quality panel */}
      {dataset.normalization_output && (
        <div className="mt-6">
          <QualityPanel output={dataset.normalization_output} />
        </div>
      )}

      {/* Profiling dashboard */}
      {dataset.profiling_output && (
        <div className="mt-6">
          <ProfilingDashboard output={dataset.profiling_output} />
        </div>
      )}

      {/* Terminal actions */}
      {isTerminal && (
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-border"
          >
            {t("backHome")}
          </button>
        </div>
      )}
    </div>
    </>
  );
}
