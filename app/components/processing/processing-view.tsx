"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getDataset, getDownloadUrl } from "@/lib/api/endpoints/normalization";
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

function TerminalIcon({ status }: { status: InstanceStatus }) {
  if (status === "READY" || status === "READY_WITH_WARNINGS") {
    return (
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${status === "READY" ? "bg-green-100" : "bg-amber-100"}`}>
        <svg viewBox="0 0 24 24" className={`h-6 w-6 ${status === "READY" ? "text-green-600" : "text-amber-600"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

export default function ProcessingView({ dataset: initialDataset }: { dataset: Dataset }) {
  const t = useTranslations("processing");
  const router = useRouter();
  const [dataset, setDataset] = useState(initialDataset);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(!TERMINAL.includes((initialDataset.status ?? "") as InstanceStatus));
  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = (dataset.status ?? "CONFIRMED") as InstanceStatus;
  const isTerminal = TERMINAL.includes(status);
  const stageIndex = getStageIndex(status);

  const poll = useCallback(async () => {
    try {
      const fresh = await getDataset(dataset.id);
      setDataset(fresh);
      if (IN_FLIGHT.includes((fresh.status ?? "") as InstanceStatus)) {
        pollRef.current = setTimeout(poll, 2000);
      }
    } catch {
      pollRef.current = setTimeout(poll, 3000);
    }
  }, [dataset.id]);

  useEffect(() => {
    if (!isTerminal) {
      pollRef.current = setTimeout(poll, 2000);
    } else {
      hideTimerRef.current = setTimeout(() => setProgressVisible(false), 1000);
    }
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isTerminal, poll]);

  useEffect(() => {
    const cp = STATUS_CONFIG[status]?.checkpoint;
    if (!cp) return;

    if (creepRef.current) clearInterval(creepRef.current);
    setProgress((prev) => Math.max(prev, cp.floor));

    if (cp.floor === cp.ceil) return;

    creepRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= cp.ceil) {
          clearInterval(creepRef.current!);
          return prev;
        }
        return prev + 0.15;
      });
    }, 400);

    return () => { if (creepRef.current) clearInterval(creepRef.current); };
  }, [status]);

  const statusKey = (STATUS_CONFIG[status]?.translationKey ?? "statusFailed") as Parameters<typeof t>[0];

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
          <button
            type="button"
            onClick={async () => {
              const { url, filename } = await getDownloadUrl(dataset.id);
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              a.click();
            }}
            className="shrink-0 rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-dark hover:bg-brand-dark"
          >
            {t("downloadReady")}
          </button>
        )}
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
              ? Math.min(Math.max((progress - (i - 1) * segSize) / segSize * 100, 0), 100)
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

      {/* Status message */}
      <div className="mt-6">
        {!isTerminal && (
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
