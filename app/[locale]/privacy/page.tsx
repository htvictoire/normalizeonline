import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import LegalPage from "@/app/components/legal-page";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildMetadata({
    route: "PRIVACY",
    locale: locale as Locale,
    title: t("seo.title"),
    description: t("seo.description"),
    ogTitle: t("seo.ogTitle"),
    ogDescription: t("seo.ogDescription"),
  });
}

export default async function PrivacyPolicy({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <LegalPage title={t("page.title")} lastUpdated={t("page.lastUpdated")}>
      <h2>1. Who We Are</h2>
      <p>
        Normalize is a data normalization tool that transforms raw tabular files — CSV, Excel, and
        JSON — into typed, validated, reproducible analytical datasets. This Privacy Policy explains
        how we handle data when you use the service.
      </p>

      <h2>2. What Data We Collect</h2>

      <h3>2.1 Files You Upload</h3>
      <p>
        When you use Normalize, you upload a source file. That file is stored ephemerally on
        Cloudflare R2 (EU region) solely to make it available to the processing backend. Normalize
        samples the file to infer column types, formats, and null tokens, and presents this as a
        suggestion for you to review. You confirm or adjust the configuration per column, then set
        your output preferences before the normalization runs. Once your output is ready, the source
        file is deleted immediately. We do not read, analyze, index, or retain file contents beyond
        what is needed to execute the workflow you initiated. The engine is content-blind — it works
        from structure and type metadata, not from the semantic values in your data.
      </p>

      <h3>2.2 Normalized Output</h3>
      <p>
        The normalized output artifacts (normalized dataset (in the format you selected), trace file, and manifest) are stored on
        Cloudflare R2 for a maximum of 1 hour so you can download your results. After 1 hour, all
        artifacts are automatically and permanently deleted at the infrastructure level.
      </p>

      <h3>2.3 Server Logs</h3>
      <p>
        Standard server request logs (IP address, timestamp, HTTP method, response code) may be
        retained for up to 60 days for security and abuse-prevention purposes. These are not used for
        analytics, profiling, or any purpose beyond operating the service.
      </p>

      <h3>2.4 Contact Form</h3>
      <p>
        If you contact us via our{" "}
        <Link href="/contact" className="text-brand hover:text-brand-dark">
          contact form
        </Link>
        , we collect the information you provide (name, email address, message) in order to respond
        to your inquiry. This data is not shared with third parties and is retained only as long as
        necessary to resolve your inquiry.
      </p>

      <h2>3. What We Do Not Collect</h2>
      <ul>
        <li>No user accounts or profiles — Normalize is currently anonymous.</li>
        <li>No cookies beyond what is technically necessary for the service to function.</li>
        <li>No third-party analytics, tracking pixels, or advertising tools.</li>
        <li>No persistent storage of your files or results beyond the 1-hour window.</li>
        <li>No data about the content of your files — only structural metadata needed to normalize it.</li>
      </ul>

      <h2>4. How We Use Your Data</h2>
      <p>The only purposes for which data is used:</p>
      <ul>
        <li>Executing the normalization workflow on your uploaded file.</li>
        <li>Delivering the processed output artifacts for download.</li>
        <li>Maintaining service security and preventing abuse.</li>
        <li>Responding to inquiries submitted through the contact form.</li>
      </ul>

      <h2>5. Legal Basis for Processing</h2>
      <ul>
        <li>
          <strong>Contract performance (Art. 6(1)(b) GDPR):</strong> Processing your file to
          deliver the normalization output you requested.
        </li>
        <li>
          <strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> Retaining minimal server logs
          for security and abuse prevention.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <ul>
        <li><strong>Source files:</strong> Deleted immediately after normalization completes.</li>
        <li><strong>Output artifacts:</strong> Automatically deleted after 1 hour.</li>
        <li><strong>Server logs:</strong> Retained for up to 60 days for security purposes, not used for analytics.</li>
        <li><strong>Contact form submissions:</strong> Retained only as long as needed to resolve your inquiry.</li>
      </ul>

      <h2>7. Infrastructure and Data Residency</h2>
      <p>
        All data remains within the European Economic Area at all times. The processing backend
        runs on Microsoft Azure (EU region) and file storage is on Cloudflare R2 (EU region). No
        data is transferred outside the EEA.
      </p>

      <h2>8. Third Parties and Sub-Processors</h2>
      <p>
        We do not sell, rent, or share your data with third parties for commercial purposes. The
        only sub-processors involved in the normalization workflow are:
      </p>
      <ul>
        <li>
          <strong>Microsoft Azure</strong> — backend compute (EU region), subject to a
          GDPR-compliant Data Processing Agreement.
        </li>
        <li>
          <strong>Cloudflare R2</strong> — ephemeral file storage (EU region), subject to a
          GDPR-compliant Data Processing Agreement.
        </li>
      </ul>

      <h2>9. Open Source Engine</h2>
      <p>
        The normalization engine is fully open source and available at{" "}
        <a
          href="https://github.com/htvictoire/normalize"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-dark"
        >
          github.com/htvictoire/normalize
        </a>
        . You can inspect exactly what the engine does with your file and verify the content-blind
        processing claims made in this policy.
      </p>

      <h2>10. Your Rights</h2>
      <p>
        Because Normalize does not retain personal data about you beyond your active session, most
        data subject rights are satisfied by design. If you have a specific concern or believe data
        about you is being held contrary to what is described here, contact us via our{" "}
        <Link href="/contact" className="text-brand hover:text-brand-dark">
          contact form
        </Link>
        . You also have the right to lodge a complaint with your local data protection supervisory
        authority.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        This policy will be updated when the service changes — particularly when user accounts are
        introduced. Material changes will be communicated prominently before they take effect.
      </p>
    </LegalPage>
  );
}
