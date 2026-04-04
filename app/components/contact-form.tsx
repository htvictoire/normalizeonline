"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { z } from "zod";

const MIN_MESSAGE = 10;

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  topic: z.enum([
    "Privacy & data protection",
    "Legal inquiry",
    "Bug report",
    "Feature request",
    "Other",
  ]),
  message: z.string().min(MIN_MESSAGE),
});

type Fields = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

const inputClass = (error?: string) =>
  `rounded-md border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none ${
    error ? "border-error focus:border-error" : "border-border focus:border-brand"
  }`;

export default function ContactForm() {
  const t = useTranslations("contact");
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const topics = [
    { value: "", label: t("form.topicPlaceholder") },
    { value: "Privacy & data protection", label: t("form.topics.privacy") },
    { value: "Legal inquiry", label: t("form.topics.legal") },
    { value: "Bug report", label: t("form.topics.bug") },
    { value: "Feature request", label: t("form.topics.feature") },
    { value: "Other", label: t("form.topics.other") },
  ];

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
        if (!errors[key]) {
          if (key === "name") errors[key] = t("form.nameRequired");
          else if (key === "email") errors[key] = t("form.emailInvalid");
          else if (key === "topic") errors[key] = t("form.topicRequired");
          else if (key === "message") errors[key] = t("form.messageMin", { min: MIN_MESSAGE });
        }
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
      setServerError(json.error ?? t("form.serverError"));
      setStatus("idle");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-ink">{t("form.name")}</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t("form.namePlaceholder")}
              className={inputClass(fieldErrors.name)}
            />
            {fieldErrors.name && <span className="block text-xs text-error">{fieldErrors.name}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-ink">{t("form.email")}</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("form.emailPlaceholder")}
              className={inputClass(fieldErrors.email)}
            />
            {fieldErrors.email && <span className="block text-xs text-error">{fieldErrors.email}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic" className="text-xs font-medium text-ink">{t("form.topic")}</label>
          <select
            id="topic"
            name="topic"
            defaultValue=""
            className={inputClass(fieldErrors.topic)}
          >
            {topics.map((tp) => (
              <option key={tp.value} value={tp.value} disabled={tp.value === ""}>
                {tp.label}
              </option>
            ))}
          </select>
          {fieldErrors.topic && <span className="block text-xs text-error">{fieldErrors.topic}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-medium text-ink">{t("form.message")}</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder={t("form.messagePlaceholder")}
            onChange={(e) => setMessageLength(e.target.value.length)}
            className={`${inputClass(fieldErrors.message)} resize-none`}
          />
          <div className="flex items-center justify-between">
            {fieldErrors.message
              ? <span className="block text-xs text-error">{fieldErrors.message}</span>
              : <span />
            }
            <span className="text-xs text-ink-muted">{messageLength}</span>
          </div>
        </div>

        {serverError && <span className="block text-xs text-error">{serverError}</span>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-brand px-6 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {status === "loading" ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : t("form.send")}
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
            <h2 className="mt-4 text-lg font-semibold text-ink">{t("success.heading")}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t("success.description")}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-md border border-brand px-6 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink"
            >
              {t("success.backToHome")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
