export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-canvas px-10 py-10 shadow-sm">
        <div className="h-10 w-10 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
      </div>
    </div>
  );
}
