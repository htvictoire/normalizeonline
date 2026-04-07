import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import LegalPage from "@/app/components/legal-page";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return buildMetadata({
    route: "TERMS",
    locale: locale as Locale,
    title: t("seo.title"),
    description: t("seo.description"),
    ogTitle: t("seo.ogTitle"),
    ogDescription: t("seo.ogDescription"),
  });
}

export default async function TermsOfUse({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <LegalPage title={t("page.title")} lastUpdated={t("page.lastUpdated")}>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Normalize (the "Service"), you agree to be bound by these Terms of
        Use ("Terms"). If you do not agree, do not use the Service. Normalize is a data
        normalization tool, not a registered legal entity. The Service is operated by its open
        source contributors (collectively "we," "us," or "our"). These Terms form a legally
        binding agreement between you and those contributors.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        Normalize is a user-driven data normalization workflow. You upload a raw tabular file (CSV,
        Excel (XLSX format only, single sheet or workbook — multi-sheet support is not yet
        available and may be introduced in a future version), or JSON). Normalize samples the file
        and suggests how to interpret each column — type, format, null tokens, separators, and
        other parameters. You review the suggestion, adjust any column configuration, and confirm.
        After confirmation, you set your output preferences (date styles, number formats, export
        type) and Normalize produces your clean dataset. Output can be downloaded as CSV, Excel
        (XLSX), JSON, or Parquet.
      </p>
      <p>
        The normalization output reflects the configuration you confirmed. Normalize executes your
        decisions — it does not make autonomous choices about how your data is interpreted or
        produced.
      </p>
      <p>
        The Service is provided for data processing purposes only. It is not a data storage
        service, a database, or a backup solution.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old and capable of entering into a binding contract to use
        the Service. If you are using the Service on behalf of an organization, you represent and
        warrant that you have authority to bind that organization to these Terms.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree to use the Service only for lawful purposes. You must not:</p>
      <ul>
        <li>Upload files containing content that is illegal, harmful, or infringes third-party rights.</li>
        <li>
          Upload files containing special categories of personal data (as defined under GDPR Art.
          9) without an appropriate legal basis and adequate safeguards.
        </li>
        <li>
          Use automated scripts, bots, or crawlers to interact with the Service in ways that
          circumvent or abuse its intended usage.
        </li>
        <li>
          Attempt to gain unauthorized access to systems, networks, or data associated with the
          Service.
        </li>
        <li>
          Interfere with or disrupt the integrity or performance of the Service or its underlying
          infrastructure.
        </li>
        <li>
          Use the Service to process personal data belonging to third parties without their
          knowledge or a lawful basis for doing so.
        </li>
      </ul>

      <h2>5. Your Data and Files</h2>

      <h3>5.1 Ownership</h3>
      <p>
        You retain full ownership of the files you upload and the output artifacts generated from
        them. We claim no intellectual property rights over your data or your results.
      </p>

      <h3>5.2 License to Process</h3>
      <p>
        By uploading a file, you grant us a limited, non-exclusive, non-transferable license to
        process that file solely for the purpose of executing the normalization workflow you have
        initiated and returning the output to you. This license terminates as soon as your output
        artifacts are deleted.
      </p>

      <h3>5.3 Responsibility for File Contents</h3>
      <p>
        You are solely responsible for the content of the files you upload. You warrant that you
        have the right to process that data and that doing so does not violate any applicable law,
        regulation, or third-party right. If your files contain personal data about third parties,
        you are the data controller for that data and must ensure you have a lawful basis for
        processing it through a third-party service.
      </p>

      <h3>5.4 Ephemeral Storage — No Long-Term Retention</h3>
      <p>
        Source files are deleted immediately after normalization completes. Output artifacts
        (normalized dataset, trace file, manifest) are stored for a maximum of 1 hour and then
        permanently and automatically deleted at the infrastructure level. Do not rely on the
        Service as a storage or backup solution. Download your results within the 1-hour window.
      </p>

      <h2>6. Output and Determinism</h2>
      <p>
        Normalize produces a deterministic output tied to the source file checksum, the
        configuration you confirmed, the rules version, and the runtime version. A fingerprint and
        trace file are included with every output for auditability and reproducibility. We make no
        warranty that results will be identical across different rules versions or runtime versions.
      </p>
      <p>
        The normalization output is a direct product of the configuration you confirmed. You are
        responsible for reviewing the suggested configuration before confirming it and for
        validating the output before using it in downstream systems.
      </p>

      <h2>7. Open Source Engine</h2>
      <p>
        The Normalize processing engine is open source and published under the MIT License
        at{" "}
        <a
          href="https://github.com/htvictoire/normalize"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-dark"
        >
          github.com/htvictoire/normalize
        </a>
        . The web application, user interface, and associated service infrastructure remain the
        property of the operator and are not covered by the engine&apos;s open source license.
      </p>

      <h2>8. Availability and Modifications</h2>
      <p>
        We do not guarantee uninterrupted or error-free availability of the Service. We may modify,
        suspend, or discontinue the Service or any part of it at any time, with or without notice.
        We will not be liable for any such modification, suspension, or discontinuation.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, express
        or implied, including but not limited to warranties of merchantability, fitness for a
        particular purpose, accuracy of output, or non-infringement. We do not warrant that the
        normalization output will be free of errors or suitable for any specific downstream use.
        You are responsible for reviewing the confirmed configuration and validating the output
        before using it in production systems.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, we shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising from your use of or
        inability to use the Service, including but not limited to loss of data, loss of revenue,
        or business interruption, even if we have been advised of the possibility of such damages.
      </p>
      <p>
        Our total aggregate liability for any claim arising out of or related to these Terms or the
        Service shall not exceed the amount you paid us in the twelve months preceding the claim.
        Where the Service was provided free of charge, our aggregate liability shall be limited to
        the greatest extent permitted by applicable law.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold us harmless from any claims, losses, damages, liabilities,
        and expenses (including reasonable legal fees) arising from your use of the Service, your
        violation of these Terms, or your violation of any applicable law or third-party right.
      </p>

      <h2>12. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of England and Wales,
        without regard to conflict of law provisions. Any disputes arising out of or in connection
        with these Terms shall be subject to the non-exclusive jurisdiction of the courts of
        England and Wales, unless mandatory consumer protection law in your country of residence
        grants you the right to bring proceedings in your local courts.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of material changes by
        updating the "last updated" date and, where appropriate, by more prominent notice. Continued
        use of the Service after the effective date constitutes acceptance of the updated Terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        For questions about these Terms, reach us via our{" "}
        <Link href="/contact" className="text-brand hover:text-brand-dark">
          contact form
        </Link>
        .
      </p>
    </LegalPage>
  );
}
