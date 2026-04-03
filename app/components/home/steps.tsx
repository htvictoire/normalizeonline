import { getTranslations } from "next-intl/server";
import { UploadArt, SchemaArt, OutputArt, DownloadArt } from "./arts";

export default async function Steps() {
  const t = await getTranslations("home.steps");

  const steps = [
    { key: "upload", art: UploadArt, title: t("upload.title"), desc: t("upload.desc") },
    { key: "confirm", art: SchemaArt, title: t("confirm.title"), desc: t("confirm.desc") },
    { key: "output", art: OutputArt, title: t("output.title"), desc: t("output.desc") },
    { key: "download", art: DownloadArt, title: t("download.title"), desc: t("download.desc") },
  ];

  return (
    <section className="mt-12 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:mt-16 md:gap-x-10 md:gap-y-6 md:grid-cols-1 xl:grid-cols-4">
      {steps.map((step) => {
        const Art = step.art;
        return (
          <div key={step.key} className="flex min-w-0 flex-col items-center text-center">
            <div className="mx-auto flex h-28 items-end justify-center md:h-32">
              <Art className="h-[76%] w-auto max-w-full md:h-full" />
            </div>
            <div className="mt-4 text-lg font-semibold tracking-tight text-ink">{step.title}</div>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{step.desc}</p>
          </div>
        );
      })}
    </section>
  );
}
