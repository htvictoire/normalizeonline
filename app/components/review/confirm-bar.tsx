"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { confirmDataset } from "@/lib/api/endpoints/normalization";
import type { InstanceConfig } from "@/lib/types/normalize";

type Props = {
  datasetId: string;
  currentConfig: InstanceConfig;
  changeCount: number;
};

export default function ConfirmBar({ datasetId, currentConfig, changeCount }: Props) {
  const t = useTranslations("review");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    try {
      await confirmDataset(datasetId, currentConfig);
      router.push("/");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sticky bottom-0 z-30 bg-canvas">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{t("confirmHeading")}</span>
            {changeCount > 0 && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                {t("editsCount", { count: changeCount })}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-ink-muted">
            {changeCount === 0 ? t("confirmDescNoChanges") : t("confirmDesc")}
          </div>
          {error && <div className="mt-1 text-xs text-error">{error}</div>}
        </div>
        <button
          onClick={handleConfirm}
          disabled={busy}
          className="shrink-0 rounded-md border border-brand bg-brand px-8 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-dark hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? t("confirming") : t("confirm")}
        </button>
      </div>
    </div>
  );
}
