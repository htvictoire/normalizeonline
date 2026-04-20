"use client";

import { useCallback, type DragEvent } from "react";
import { useTranslations } from "next-intl";
import { UploadArt } from "./arts";
import { useUpload } from "@/lib/hooks/use-upload";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function UploadPad() {
  const t = useTranslations("home.uploadPad");
  const { state, isDragging, setIsDragging, inputRef, handleFile, handleUpload, reset } = useUpload();

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, setIsDragging]
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [setIsDragging]
  );

  const handleDragLeave = useCallback(() => setIsDragging(false), [setIsDragging]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

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
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="h-8 w-8 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
          <div className="text-sm text-ink-muted">{t("redirecting")}</div>
        </div>
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
                onClick={() => handleFile(state.file!)}
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
