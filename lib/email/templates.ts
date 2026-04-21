export type EmailTemplateOptions = {
  heading: string;
  previewText?: string;
  greeting?: string;
  paragraphs: string[];
  cta?: {
    label: string;
    href: string;
  };
  footer?: string;
};

export type RenderedEmail = {
  html: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderEmailTemplate(options: EmailTemplateOptions): RenderedEmail {
  const greeting = options.greeting ?? "Hi there,";
  const footer =
    options.footer ?? "You are receiving this message from Atriae system email notifications.";

  const paragraphsHtml = options.paragraphs
    .map((paragraph) => `<p style=\"margin:0 0 12px;color:#1f2937;line-height:1.6;\">${escapeHtml(paragraph)}</p>`)
    .join("");

  const ctaHtml = options.cta
    ? `<p style=\"margin:16px 0 0;\"><a href=\"${escapeHtml(options.cta.href)}\" style=\"display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600;\">${escapeHtml(options.cta.label)}</a></p>`
    : "";

  const html = `
<!doctype html>
<html>
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(options.heading)}</title>
  </head>
  <body style="margin:0;background:#f3f4f6;padding:24px;font-family:Inter,system-ui,-apple-system,sans-serif;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(options.previewText ?? options.heading)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
      <tr>
        <td>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#111827;">${escapeHtml(options.heading)}</h1>
          <p style="margin:0 0 12px;color:#1f2937;line-height:1.6;">${escapeHtml(greeting)}</p>
          ${paragraphsHtml}
          ${ctaHtml}
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0 16px;" />
          <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.5;">${escapeHtml(footer)}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textParts = [
    options.heading,
    "",
    greeting,
    ...options.paragraphs,
    options.cta ? `${options.cta.label}: ${options.cta.href}` : "",
    "",
    footer
  ].filter(Boolean);

  return {
    html,
    text: textParts.join("\n")
  };
}

export function renderTestEmailTemplate(targetEmail: string): RenderedEmail {
  return renderEmailTemplate({
    heading: "Atriae SMTP test email",
    previewText: "SMTP integration check",
    paragraphs: [
      "This is a test email from Atriae.",
      `SMTP is configured and ready to send product emails to ${targetEmail}.`
    ],
    cta: {
      label: "Open Atriae settings",
      href: "https://app.atriae.com/settings"
    },
    footer: "If you requested this check, no further action is needed."
  });
}
