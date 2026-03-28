import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyOwner, sendMail } from "@/lib/mailer";

const schema = z.object({
  email: z.email("Invalid email address"),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { email } = parsed.data;

  try {
    await notifyOwner("New waitlist signup", `<p>New waitlist signup: <strong>${email}</strong></p>`);
    await sendMail({
      to: email,
      subject: "You're on the Normalize waitlist",
      html: `<p>Hi,</p><p>You're on the list. We'll reach out as soon as Normalize is ready for you.</p><p>— The Normalize team</p>`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process signup." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
