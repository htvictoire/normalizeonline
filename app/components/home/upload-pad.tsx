import { UploadArt } from "./arts";

export default function UploadPad() {
  return (
    <div className="rounded-[28px] border-2 border-dashed border-border bg-canvas px-8 py-6 text-center">
      <div className="mx-auto w-16 [&_path]:fill-ink-muted">
        <UploadArt className="w-full h-auto" />
      </div>
      <div className="mt-6 text-xl font-semibold text-ink">Drop a CSV, Excel, or JSON file here</div>
      <div className="mt-8 flex justify-center">
        <button className="rounded-md border border-brand px-8 py-3 text-sm font-medium text-brand hover:border-ink hover:text-ink">
          Select files
        </button>
      </div>
    </div>
  );
}
