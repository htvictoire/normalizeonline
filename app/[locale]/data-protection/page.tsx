import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import LegalPage from "@/app/components/legal-page";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataProtection" });
  return buildMetadata({
    route: "DATA_PROTECTION",
    locale: locale as Locale,
    title: t("seo.title"),
    description: t("seo.description"),
    ogTitle: t("seo.ogTitle"),
    ogDescription: t("seo.ogDescription"),
  });
}

export default async function DataProtection({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataProtection" });
  const csvLimit = process.env.NEXT_PUBLIC_UPLOAD_MAX_CSV_FILE_SIZE_MB;
  const xlsxLimit = process.env.NEXT_PUBLIC_UPLOAD_MAX_XLSX_FILE_SIZE_MB;
  const jsonLimit = process.env.NEXT_PUBLIC_UPLOAD_MAX_JSON_FILE_SIZE_MB;

  return (
    <LegalPage title={t("page.title")} lastUpdated={t("page.lastUpdated")}>
      <h2>1. Design Principle</h2>
      <p>
        Data protection is not a compliance afterthought at Normalize — it is an architectural
        constraint. The system is designed to be structurally incapable of retaining or reading the
        content of files beyond what the normalization workflow strictly requires. This page
        describes how that is implemented in practice.
      </p>

      <h2>2. Content-Blind Processing</h2>
      <p>
        The Normalize engine operates without awareness of the semantic content of your data.
        It samples your file to infer column structure, types, and format metadata, then presents
        this as a suggestion. You — the user — review the suggestion, adjust the configuration of
        any column, and confirm how the data should be interpreted. You also control the output:
        date formats, number styles, null handling, and export type (CSV, Excel (XLSX), JSON, or Parquet). The
        engine uses only what you have confirmed to direct how cells are parsed — it does not
        inspect, index, or record what the data contains.
      </p>
      <p>
        The normalization engine is fully open source and auditable at{" "}
        <a
          href="https://github.com/htvictoire/normalize"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-dark"
        >
          github.com/htvictoire/normalize
        </a>
        . Anyone can verify exactly what the engine does with a file.
      </p>

      <h2>3. Ephemeral Storage</h2>
      <h3>3.1 Source files</h3>
      <p>
        Uploaded source files are written to Cloudflare R2 object storage (European region) solely
        to make them available to the processing backend. Once normalization is complete, the source
        file is deleted immediately. It is never copied, indexed, or retained beyond the processing
        lifecycle.
      </p>
      <p>
        The web interface currently accepts CSV files up to {csvLimit} MB, Excel (XLSX) files up
        to {xlsxLimit} MB, and JSON files up to {jsonLimit} MB. Oversized files are blocked by the
        upload flow and do not enter the standard normalization pipeline through the web app.
      </p>

      <h3>3.2 Normalized output</h3>
      <p>
        The normalized output artifacts (normalized dataset (in the format you selected), trace file, and manifest) are stored on
        Cloudflare R2 for a maximum of 1 hour from the time normalization completes, giving you a
        window to download your results. After 1 hour, all artifacts are automatically and
        permanently deleted by the storage layer. No manual intervention is required — deletion is
        enforced at the infrastructure level.
      </p>
      <p>
        Future versions of Normalize will allow authenticated users to configure their own retention
        window. Until then, the 1-hour maximum applies universally.
      </p>

      <h2>4. Infrastructure and Data Residency</h2>
      <p>All data processed by Normalize remains within the European Economic Area:</p>
      <ul>
        <li><strong>Processing backend:</strong> Microsoft Azure, European region.</li>
        <li><strong>File storage:</strong> Cloudflare R2, European region.</li>
      </ul>
      <p>
        No data is transferred outside the EEA at any point in the normalization workflow. There
        are no cross-border transfers to address.
      </p>

      <h2>5. No User Data Collected</h2>
      <p>
        Normalize currently operates without user accounts. There is no login, no profile, no
        persistent session, and no tracking. We do not collect names, email addresses, or any
        personal identifier from users of the service. We do not run third-party analytics. We do
        not use advertising cookies or tracking pixels.
      </p>
      <p>
        Standard server-side request logs (IP address, timestamp, HTTP method, response code) may
        be retained for up to 60 days for security and abuse-prevention purposes and are not used for any
        other purpose.
      </p>

      <h2>6. Your Files May Contain Personal Data</h2>
      <p>
        If the files you upload contain personal data about third parties (e.g., customer records,
        employee data, transaction logs), you are the data controller for that data. Normalize acts
        as a data processor on your behalf for the duration of the normalization workflow only.
      </p>
      <p>
        It is your responsibility to ensure you have a lawful basis for processing that data and
        that uploading it to a third-party service is consistent with your obligations to the
        individuals concerned.
      </p>

      <h2>7. Sub-Processors</h2>
      <p>
        Normalize relies on two infrastructure sub-processors, both operating in the EU and subject
        to GDPR-compliant Data Processing Agreements:
      </p>
      <ul>
        <li><strong>Microsoft Azure</strong> — backend compute (EU region).</li>
        <li><strong>Cloudflare R2</strong> — ephemeral file storage (EU region).</li>
      </ul>
      <p>
        Neither sub-processor has access to file contents for any purpose other than storing and
        serving the objects as directed by Normalize.
      </p>

      <h2>8. Security</h2>
      <ul>
        <li>All data in transit is encrypted via TLS 1.2 or higher.</li>
        <li>All data at rest on R2 is encrypted by Cloudflare.</li>
        <li>
          Access to infrastructure is restricted to the minimum required for the service to
          operate.
        </li>
        <li>
          The normalization engine is open source, enabling independent security review of the
          processing logic.
        </li>
      </ul>

      <h2>9. Your Rights</h2>
      <p>
        Because Normalize does not collect personal data about its users and does not retain file
        contents beyond the processing window, most data subject rights (access, rectification,
        erasure, portability) are structurally satisfied by design — there is no personal data
        about you held by the service after your session ends.
      </p>
      <p>
        If you have a specific concern or believe data about you is being retained contrary to what
        is described here, contact us via our{" "}
        <Link href="/contact" className="text-brand hover:text-brand-dark">
          contact form
        </Link>
        .
      </p>

      <h2>10. Changes to This Page</h2>
      <p>
        This page will be updated to reflect changes in infrastructure, retention policies, or
        legal obligations. When user accounts are introduced, this page will be updated to address
        the additional processing that entails, prior to that feature going live.
      </p>
    </LegalPage>
  );
}
