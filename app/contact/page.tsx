import type { Metadata } from "next";
import LegalPage from "@/app/components/legal-page";
import ContactForm from "@/app/components/contact-form";

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

export default function Contact() {
  return (
    <LegalPage title="Contact" lastUpdated="March 28, 2026">
      <p>Use the form below to get in touch. We will get back to you as soon as possible.</p>
      <ContactForm />
    </LegalPage>
  );
}
