import { getTranslations } from "next-intl/server";

const SITE  = "https://normalizeonline.com";

/* ─── brand tokens (mirrors globals.css) ─── */
const INK       = "#0f1e35";
const INK_MUTED = "#4a5a6e";
const BRAND     = "#2596be";
const BORDER    = "#e5e5e5";

export async function waitlistConfirmationEmail(locale: string): Promise<{ subject: string; html: string }> {
  const t = await getTranslations({ locale, namespace: "home.waitlistEmail" });
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t("subject")}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f6f8;padding:48px 16px 64px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <a href="${SITE}" target="_blank" style="display:inline-block;text-decoration:none;">
                <img
                  src="${SITE}/normalizelogo.png"
                  alt="Normalize"
                  width="130"
                  height="26"
                  style="display:block;height:26px;width:auto;border:0;"
                />
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">

              <!-- Header band -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:${INK};padding:32px 36px 28px;">
                    <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.2px;">
                      ${t("heading")}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:32px 36px 36px;">

                    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${INK_MUTED};">
                      ${t("p1")}
                    </p>

                    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:${INK_MUTED};">
                      ${t("p2")}
                    </p>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="border-radius:7px;background-color:${BRAND};">
                          <a href="${SITE}/blog"
                             target="_blank"
                             style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                            ${t("cta")};
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0 36px;">
                    <div style="height:1px;background-color:${BORDER};"></div>
                  </td>
                </tr>
              </table>

              <!-- Card footer -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:20px 36px;background-color:#fafafa;">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                      ${t("footer")}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Email footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                ${t("copyright", { year })}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return { subject: t("subject"), html };
}
