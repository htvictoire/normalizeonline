import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Normalize <onboarding@resend.dev>";
const OWNER = "victoirehabamungut@gmail.com";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) throw new Error(error.message);
}

export async function notifyOwner(subject: string, html: string) {
  return sendMail({ to: OWNER, subject, html });
}
