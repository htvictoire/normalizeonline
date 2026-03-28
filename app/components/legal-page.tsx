export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
      <div className="mt-10 space-y-4 text-sm leading-6 text-ink [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-ink [&_p]:text-ink-muted [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-muted [&_li]:mt-0.5">
        {children}
      </div>
    </main>
  );
}
