import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getDatasetById } from "@/lib/api/server/normalization";
import ReviewForm from "@/app/components/review/review-form";

type Props = { params: Promise<{ id: string; locale: string }> };

export async function generateMetadata() {
  const t = await getTranslations("review.seo");
  return { title: t("title"), description: t("description") };
}

export default async function ReviewPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations("review");

  const result = await getDatasetById(id);
  const dataset = result?.data?.data;

  if (!dataset || !dataset.suggested_config || !dataset.suggestion_display) {
    notFound();
  }

  const { suggested_config, suggestion_display } = dataset;
  const columnKeys = Object.keys(suggested_config.column_config);
  const rowCount = suggestion_display.row_count;

  const STATUS_BANNER: Partial<Record<string, { message: string; style: string }>> = {
    CONFIRMED:           { message: t("statusConfirmed"),         style: "bg-blue-50 border-blue-200 text-blue-800" },
    PENDING:             { message: t("statusPending"),           style: "bg-zinc-50 border-border text-ink-muted" },
    FAILED:              { message: t("statusFailed"),            style: "bg-red-50 border-red-200 text-red-800" },
    BLOCKED:             { message: t("statusBlocked"),           style: "bg-amber-50 border-amber-200 text-amber-800" },
    PROFILING:           { message: t("statusProfiling"),         style: "bg-blue-50 border-blue-200 text-blue-800" },
    PROFILED:            { message: t("statusProfiled"),          style: "bg-blue-50 border-blue-200 text-blue-800" },
    NORMALIZING:         { message: t("statusNormalizing"),       style: "bg-blue-50 border-blue-200 text-blue-800" },
    READY:               { message: t("statusReady"),             style: "bg-green-50 border-green-200 text-green-800" },
    READY_WITH_WARNINGS: { message: t("statusReadyWithWarnings"), style: "bg-amber-50 border-amber-200 text-amber-800" },
  };

  const banner = dataset.status ? STATUS_BANNER[dataset.status] : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6">
        <h1 className="text-xl font-bold text-ink">{t("heading")}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          <span>{t("subtitle", { columns: columnKeys.length, rows: rowCount.toLocaleString(locale) })}</span>
          <span className="text-border">·</span>
          <span>{dataset.original_name}</span>
          <span className="text-border">·</span>
          <span>{dataset.file_type}</span>
          <span className="text-border">·</span>
          <span>{dataset.size_mb.toFixed(2)} MB</span>
          <span className="text-border">·</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-ink-muted">
            {dataset.status}
          </span>
        </div>

        {banner && (
          <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${banner.style}`}>
            {banner.message}
          </div>
        )}

        <ReviewForm
          datasetId={dataset.id}
          initialConfig={suggested_config}
          suggestionDisplay={suggestion_display}
        />
      </main>
    </div>
  );
}
