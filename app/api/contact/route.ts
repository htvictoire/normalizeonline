import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyOwner } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  topic: z.enum([
    "Privacy & data protection",
    "Legal inquiry",
    "Bug report",
    "Feature request",
    "Other",
  ], { error: "Please select a topic" }),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { name, email, topic, message } = parsed.data;

  try {
    await notifyOwner(
      `[${topic}] Message from ${name}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Topic:</strong> ${topic}</p>
       <p><strong>Message:</strong></p>
       <p>${message.replaceAll("\n", "<br/>")}</p>`
    );
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
