import type { DigestLayoutKey, NormalizedDigestModule } from "@/lib/digests/rendering/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderModuleHtml(module: NormalizedDigestModule, accent: string) {
  const bullets = module.bullets.length
    ? `<ul style="margin:10px 0 0;padding-left:18px;color:#4b5563;">${module.bullets.map((line) => `<li style=\"margin:0 0 6px;\">${escapeHtml(line)}</li>`).join("")}</ul>`
    : "";

  return `<section style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
    <p style="margin:0;color:${accent};font-size:12px;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(module.kicker ?? module.title)}</p>
    <h3 style="margin:4px 0 0;font-size:20px;color:#111827;">${escapeHtml(module.title)}</h3>
    <p style="margin:8px 0 0;color:#1f2937;line-height:1.6;">${escapeHtml(module.summary)}</p>
    ${bullets}
  </section>`;
}

function renderModuleText(module: NormalizedDigestModule) {
  return [module.title.toUpperCase(), module.summary, ...module.bullets.map((line) => `- ${line}`), ""].join("\n");
}

export function resolveLayoutKey(layoutStyle?: string): DigestLayoutKey {
  if (layoutStyle === "newspaper") return "structured_brief";
  if (layoutStyle === "letter") return "soft_reset";
  return "editorial_light";
}

export function renderDigestLayout(params: {
  layout: DigestLayoutKey;
  heading: string;
  previewLine: string;
  intro: string;
  modules: NormalizedDigestModule[];
}) {
  const theme = {
    editorial_light: { bg: "#f8fafc", card: "#ffffff", accent: "#475569" },
    structured_brief: { bg: "#f3f4f6", card: "#ffffff", accent: "#111827" },
    soft_reset: { bg: "#fdf2f8", card: "#fffdf9", accent: "#9d174d" },
  }[params.layout];

  const modulesHtml = params.modules.map((module) => renderModuleHtml(module, theme.accent)).join("");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:${theme.bg};font-family:Inter,Arial,sans-serif;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(params.previewLine)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:${theme.card};padding:26px;border-radius:18px;">
    <tr><td>
      <h1 style="margin:0;font-size:30px;line-height:1.15;color:#0f172a;">${escapeHtml(params.heading)}</h1>
      <p style="margin:12px 0 0;color:#374151;line-height:1.7;">${escapeHtml(params.intro)}</p>
      ${modulesHtml}
      <p style="margin:18px 0 0;color:#6b7280;font-size:12px;">Curated by Atriae.</p>
    </td></tr>
  </table></body></html>`;

  const text = [params.heading, "", params.intro, "", ...params.modules.map(renderModuleText), "Curated by Atriae."].join("\n");

  return { html, text };
}
