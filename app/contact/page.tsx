import type { Metadata } from "next";
import LegalPage from "@/app/components/legal-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Normalize team — privacy inquiries, legal questions, bug reports, or feature requests.",
  alternates: { canonical: "https://normalizeonline.com/contact" },
  openGraph: {
    title: "Contact | Normalize",
    description:
      "Get in touch with the Normalize team — privacy inquiries, legal questions, bug reports, or feature requests.",
    url: "https://normalizeonline.com/contact",
  },
  robots: { index: true, follow: false },
};

const topics = [
  { value: "", label: "Select a topic" },
  { value: "privacy", label: "Privacy & data protection" },
  { value: "legal", label: "Legal inquiry" },
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  return (
    <LegalPage title="Contact" lastUpdated="March 28, 2026">
      <p>
        Use the form below to get in touch. We will get back to you as soon as possible.
      </p>

      <form className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-ink">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic" className="text-xs font-medium text-ink">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue=""
            className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          >
            {topics.map((t) => (
              <option key={t.value} value={t.value} disabled={t.value === ""}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-medium text-ink">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Describe your question or issue in detail..."
            className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-md border border-brand px-6 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink"
        >
          Send message
        </button>
      </form>
    </LegalPage>
  );
}
