import { UploadArt, SchemaArt, OutputArt, DownloadArt } from "./arts";

const steps = [
  { title: "Upload", desc: "Bring a CSV, Excel, or JSON file into Normalize.", art: UploadArt },
  { title: "Confirm structure", desc: "Normalize detects column types, tokens, and formats. You adjust how the data should be understood.", art: SchemaArt },
  { title: "Output settings", desc: "Choose how the normalized data should be produced: format, date styles, tokens, and other rules.", art: OutputArt },
  { title: "Download", desc: "Export the normalized dataset as CSV, Excel, JSON, or Parquet.", art: DownloadArt },
];

export default function Steps() {
  return (
    <section className="mt-16 grid gap-x-10 gap-y-6 xl:grid-cols-4">
      {steps.map((step) => {
        const Art = step.art;
        return (
          <div key={step.title} className="flex min-w-0 flex-col items-center text-center">
            <div className="mx-auto flex h-32 items-end justify-center">
              <Art className="h-full w-auto max-w-full" />
            </div>
            <div className="mt-4 text-lg font-semibold tracking-tight text-ink">{step.title}</div>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{step.desc}</p>
          </div>
        );
      })}
    </section>
  );
}
