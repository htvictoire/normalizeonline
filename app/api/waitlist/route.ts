import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyOwner, sendMail } from "@/lib/mailer";
import { waitlistConfirmationEmail } from "@/lib/emails/waitlist-confirmation";
import { locales, defaultLocale } from "@/i18n/config";

const schema = z.object({
  email:  z.email("Invalid email address"),
  locale: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { email, locale: rawLocale } = parsed.data;
  const locale = locales.includes(rawLocale as never) ? (rawLocale as string) : defaultLocale;

  try {
    const { subject, html } = await waitlistConfirmationEmail(locale);
    await notifyOwner("New waitlist signup", `<p>New waitlist signup: <strong>${email}</strong> (${locale})</p>`);
    await sendMail({ to: email, subject, html });
  } catch {
    return NextResponse.json({ error: "Failed to process signup." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
