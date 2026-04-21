import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getDatasetById } from "@/lib/api/server/normalization";
import ProcessingView from "@/app/components/processing/processing-view";

type Props = { params: Promise<{ id: string; locale: string }> };

export async function generateMetadata() {
  const t = await getTranslations("processing.seo");
  return { title: t("title"), description: t("description") };
}

export default async function ProcessingPage({ params }: Props) {
  const { id, locale } = await params;

  const result = await getDatasetById(id);
  const dataset = result?.data?.data;

  if (!dataset) notFound();

  if (!dataset.status || dataset.status === "AWAITING_CONFIRMATION") {
    redirect(`/${locale}/review/${id}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6">
        <ProcessingView dataset={dataset} />
      </main>
    </div>
  );
}
