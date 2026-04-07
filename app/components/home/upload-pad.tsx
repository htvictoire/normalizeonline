"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import { useTranslations } from "next-intl";
import { UploadArt } from "./arts";
import { getUploadUrl, createDataset } from "@/lib/api/endpoints/normalization";
import { uploadToS3 } from "@/lib/storage";
import type { Dataset } from "@/lib/types/dataset";

type UploadPhase =
  | { phase: "idle" }
  | { phase: "selected"; file: File; error?: string }
  | { phase: "uploading"; file: File; progress: number }
  | { phase: "processing"; file: File }
  | { phase: "success"; dataset: Dataset }
  | { phase: "error"; message: string; file?: File };

const SIZE_LIMITS: Record<string, number> = {
  csv:  50 * 1024 * 1024,
  xlsx: 15 * 1024 * 1024,
  json: 10 * 1024 * 1024,
};

function getExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function getFileType(ext: string): "CSV" | "XLSX" | "JSON" | null {
  if (ext === "csv")  return "CSV";
  if (ext === "xlsx") return "XLSX";
  if (ext === "json") return "JSON";
  return null;
}

type ValidationError =
  | { key: "errors.unsupportedType" }
  | { key: "errors.tooLarge"; type: string; limit: number };

function getValidationError(file: File): ValidationError | null {
  const ext = getExtension(file);
  if (!getFileType(ext)) return { key: "errors.unsupportedType" };
  const limit = SIZE_LIMITS[ext];
  if (file.size > limit) {
    return { key: "errors.tooLarge", type: ext.toUpperCase(), limit: Math.round(limit / (1024 * 1024)) };
  }
  return null;
}

function getBaseName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

async function computeChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function UploadPad() {
  const t = useTranslations("home.uploadPad");
  const [state, setState] = useState<UploadPhase>({ phase: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = getValidationError(file);
      const error = validationError
        ? validationError.key === "errors.tooLarge"
          ? t("errors.tooLarge", { type: validationError.type, limit: validationError.limit })
          : t("errors.unsupportedType")
        : undefined;
      setState({ phase: "selected", file, error });
    },
    [t]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleUpload = useCallback(async () => {
    if (state.phase !== "selected" || state.error) return;

    const file = state.file;
    const fileType = getFileType(getExtension(file))!;

    try {
      setState({ phase: "uploading", file, progress: 0 });

      const uploadUrlPromise = getUploadUrl(file.name);
      const checksumPromise = computeChecksum(file);

      const s3UploadPromise = uploadUrlPromise.then(({ url }) =>
        uploadToS3(url, file, (progress) => {
          setState({ phase: "uploading", file, progress });
        })
      );

      const [{ s3_key }, source_checksum] = await Promise.all([
        uploadUrlPromise,
        checksumPromise,
        s3UploadPromise,
      ]);

      setState({ phase: "processing", file });

      const response = await createDataset({
        name: getBaseName(file.name),
        original_name: file.name,
        file_type: fileType,
        s3_key,
        size_mb: file.size / (1024 * 1024),
        source_checksum,
      });

      if (response?.success && response.data) {
        setState({ phase: "success", dataset: response.data });
      } else {
        setState({ phase: "error", message: t("errors.processFailed"), file });
      }
    } catch {
      setState({ phase: "error", message: t("errors.generic"), file });
    }
  }, [state, t]);

  const reset = useCallback(() => setState({ phase: "idle" }), []);

  const acceptsDrop = state.phase === "idle" || state.phase === "selected";

  return (
    <div
      className={[
        "w-full rounded-[28px] border-2 border-dashed bg-canvas px-8 py-6 text-center transition-colors",
        isDragging ? "border-brand bg-brand/5" : "border-border",
      ].join(" ")}
      onDrop={acceptsDrop ? handleDrop : undefined}
      onDragOver={acceptsDrop ? handleDragOver : undefined}
      onDragLeave={acceptsDrop ? handleDragLeave : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.json"
        className="hidden"
        onChange={handleInputChange}
      />

      {state.phase === "idle" && (
        <>
          <div className="mx-auto w-16 [&_path]:fill-ink-muted">
            <UploadArt className="w-full h-auto" />
          </div>
          <div className="mt-6 text-xl font-semibold text-ink">{t("heading")}</div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded-md border border-brand px-8 py-3 text-sm font-medium text-brand hover:border-ink hover:text-ink"
            >
              {t("selectFiles")}
            </button>
          </div>
        </>
      )}

      {state.phase === "selected" && (
        <>
          <div className="mx-auto w-16 [&_path]:fill-ink-muted">
            <UploadArt className="w-full h-auto" />
          </div>
          <div className="mt-6 text-base font-semibold text-ink">{state.file.name}</div>
          <div className="mt-1 text-sm text-ink-muted">{formatSize(state.file.size)}</div>
          {state.error ? (
            <>
              <div className="mt-4 text-sm text-error">{state.error}</div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={reset}
                  className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-ink-muted hover:border-ink hover:text-ink"
                >
                  {t("chooseAnother")}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={reset}
                className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-ink-muted hover:border-ink hover:text-ink"
              >
                {t("change")}
              </button>
              <button
                onClick={handleUpload}
                className="rounded-md bg-brand border border-brand px-8 py-2.5 text-sm font-medium text-white hover:bg-brand-dark hover:border-brand-dark"
              >
                {t("upload")}
              </button>
            </div>
          )}
        </>
      )}

      {state.phase === "uploading" && (
        <>
          <div className="mx-auto w-16 [&_path]:fill-ink-muted">
            <UploadArt className="w-full h-auto" />
          </div>
          <div className="mt-6 text-base font-semibold text-ink">{state.file.name}</div>
          <div className="mt-4 px-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-brand transition-all duration-150"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-ink-muted">{state.progress}%</div>
          </div>
        </>
      )}

      {state.phase === "processing" && (
        <>
          <div className="mx-auto w-16 [&_path]:fill-ink-muted">
            <UploadArt className="w-full h-auto" />
          </div>
          <div className="mt-6 text-base font-semibold text-ink">{state.file.name}</div>
          <div className="mt-2 text-sm text-ink-muted">{t("analyzing")}</div>
        </>
      )}

      {state.phase === "success" && (
        <>
          <div className="mt-2 text-xl font-semibold text-ink">{t("successHeading")}</div>
          <div className="mt-2 text-sm text-ink-muted">{t("successDesc")}</div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={reset}
              className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-ink-muted hover:border-ink hover:text-ink"
            >
              {t("normalizeAnother")}
            </button>
          </div>
        </>
      )}

      {state.phase === "error" && (
        <>
          <div className="mx-auto w-16 [&_path]:fill-ink-muted">
            <UploadArt className="w-full h-auto" />
          </div>
          <div className="mt-6 text-base font-semibold text-ink">{t("errorHeading")}</div>
          <div className="mt-2 text-sm text-error">{state.message}</div>
          <div className="mt-6 flex justify-center gap-3">
            {state.file && (
              <button
                onClick={() => setState({ phase: "selected", file: state.file! })}
                className="rounded-md border border-brand px-8 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink"
              >
                {t("retry")}
              </button>
            )}
            <button
              onClick={reset}
              className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-ink-muted hover:border-ink hover:text-ink"
            >
              {t("startOver")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
