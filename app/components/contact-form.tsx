"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const MIN_MESSAGE = 10;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  topic: z.enum([
    "Privacy & data protection",
    "Legal inquiry",
    "Bug report",
    "Feature request",
    "Other",
  ], { error: "Please select a topic" }),
  message: z.string().min(MIN_MESSAGE, `Message must be at least ${MIN_MESSAGE} characters`),
});

type Fields = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

const topics = [
  { value: "", label: "Select a topic" },
  { value: "Privacy & data protection", label: "Privacy & data protection" },
  { value: "Legal inquiry", label: "Legal inquiry" },
  { value: "Bug report", label: "Bug report" },
  { value: "Feature request", label: "Feature request" },
  { value: "Other", label: "Other" },
];

const inputClass = (error?: string) =>
  `rounded-md border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none ${
    error ? "border-error focus:border-error" : "border-border focus:border-brand"
  }`;

export default function ContactForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      topic: (form.elements.namedItem("topic") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (res.ok) {
      setShowSuccess(true);
    } else {
      const json = await res.json();
      setServerError(json.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-ink">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className={inputClass(fieldErrors.name)}
            />
            {fieldErrors.name && <span className="block text-xs text-error">{fieldErrors.name}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-ink">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={inputClass(fieldErrors.email)}
            />
            {fieldErrors.email && <span className="block text-xs text-error">{fieldErrors.email}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic" className="text-xs font-medium text-ink">Topic</label>
          <select
            id="topic"
            name="topic"
            defaultValue=""
            className={inputClass(fieldErrors.topic)}
          >
            {topics.map((t) => (
              <option key={t.value} value={t.value} disabled={t.value === ""}>
                {t.label}
              </option>
            ))}
          </select>
          {fieldErrors.topic && <span className="block text-xs text-error">{fieldErrors.topic}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-medium text-ink">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Describe your question or issue in detail..."
            onChange={(e) => setMessageLength(e.target.value.length)}
            className={`${inputClass(fieldErrors.message)} resize-none`}
          />
          <div className="flex items-center justify-between">
            {fieldErrors.message
              ? <span className="block text-xs text-error">{fieldErrors.message}</span>
              : <span />
            }
            <span className="text-xs text-ink-muted">
              {messageLength}
            </span>
          </div>
        </div>

        {serverError && <span className="block text-xs text-error">{serverError}</span>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md border border-brand px-6 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-canvas px-8 py-8 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink">Message sent</h2>
            <p className="mt-2 text-sm text-ink-muted">
              We received your message and will get back to you as soon as possible.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-md border border-brand px-6 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink"
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
