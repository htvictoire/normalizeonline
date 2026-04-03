"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UploadArt } from "./arts";
import { z } from "zod";

const schema = z.object({ email: z.email() });

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
    <div
      className="rounded-[28px] bg-canvas px-4 py-5 text-center md:px-8 md:py-6"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='28' ry='28' stroke='%23b0b8c4' stroke-width='1.5' stroke-dasharray='10%2c6' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }}
    >
      <div className="mx-auto w-16 [&_path]:fill-ink-muted">
        <UploadArt className="w-full h-auto" />
      </div>
      <div className="mt-5 text-lg font-semibold text-ink md:mt-6 md:text-xl">{t("heading")}</div>
      <div className="mt-2 text-sm text-ink-muted">{t("description")}</div>

      {status === "success" ? (
        <p className="mt-8 text-sm text-ink-muted">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-3">
          <div className="flex w-full max-w-sm flex-col gap-3 md:flex-row md:gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="min-w-0 flex-1 rounded-md border border-border bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full whitespace-nowrap rounded-md border border-brand px-5 py-2.5 text-sm font-medium text-brand hover:border-ink hover:text-ink disabled:opacity-50 md:w-auto"
            >
              {status === "loading" ? t("sending") : t("cta")}
            </button>
          </div>
          {error && <span className="text-xs text-error">{error}</span>}
        </form>
      )}
    </div>
  );
}
