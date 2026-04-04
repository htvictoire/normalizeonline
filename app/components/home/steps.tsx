import { getTranslations } from "next-intl/server";
import { UploadArt, SchemaArt, OutputArt, DownloadArt } from "./arts";

export default async function Steps() {
  const t = await getTranslations("home.steps");

  const steps = [
    { key: "upload",   Art: UploadArt,   title: t("upload.title"),   desc: t("upload.desc") },
    { key: "confirm",  Art: SchemaArt,   title: t("confirm.title"),  desc: t("confirm.desc") },
    { key: "output",   Art: OutputArt,   title: t("output.title"),   desc: t("output.desc") },
    { key: "download", Art: DownloadArt, title: t("download.title"), desc: t("download.desc") },
  ];

  return (
    <div className="flex flex-col divide-y divide-border">
      {steps.map((step, i) => {
        const Art = step.Art;
        return (
          <div
            key={step.key}
            className="relative flex items-start gap-4 px-2 py-5 sm:items-center sm:px-4"
          >
            {/* SVG art */}
            <div className="h-9 w-9 shrink-0 sm:h-10 sm:w-10">
              <Art className="h-full w-auto" />
            </div>

            {/* Title + desc */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-tight text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">{step.desc}</p>
            </div>

            {/* Large background step number */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[5rem] font-black leading-none text-[#32D3B0] opacity-[0.07]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
