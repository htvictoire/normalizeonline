"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

const schema = z.object({ email: z.email() });

const GITHUB_URL = "https://github.com/htvictoire/normalize";

export default function UploadPad() {
  const t = useTranslations("home.waitlist");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(t("error"));
      return;
    }

    setStatus("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      const json = await res.json();
      setError(json.error ?? t("serverError"));
      setStatus("idle");
    }
  }

  return (
    <div className="rounded-2xl bg-[#1B2A3B] px-6 py-10 text-center md:px-8 md:py-12">
      <p className="text-base font-semibold text-white md:text-lg">{t("heading")}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/70">
        {t.rich("description", {
          githubLink: (chunks) => (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      {status === "success" ? (
        <p className="mt-8 text-sm text-white/70">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-2">
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-[#32D3B0] focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="whitespace-nowrap rounded-lg bg-[#32D3B0] px-5 py-2.5 text-sm font-semibold text-[#1B2A3B] transition-colors hover:bg-[#20a88d] disabled:opacity-50"
            >
              {status === "loading" ? t("sending") : t("cta")}
            </button>
          </div>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </form>
      )}
    </div>
  );
}
