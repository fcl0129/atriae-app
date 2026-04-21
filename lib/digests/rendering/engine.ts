import type { DigestRepository } from "@/lib/digests/repository";
import type { UserDigestProfile } from "@/lib/digests/types";
import { renderDigestLayout, resolveLayoutKey } from "@/lib/digests/rendering/layouts";
import { renderModules, resolveEnabledModules } from "@/lib/digests/rendering/modules";
import { buildDigestSubject } from "@/lib/digests/rendering/subject";
import type { DigestRenderContext, DigestRenderOptions, DigestRenderResult } from "@/lib/digests/rendering/types";

function buildIntro(profile: UserDigestProfile, now: Date) {
  const weekday = new Intl.DateTimeFormat(profile.digest_config.locale ?? "en-US", { weekday: "long" }).format(now);
  return `${weekday} edition — concise, thoughtful, and designed to help you move with clarity.`;
}

export async function renderDigestForProfile(
  profile: UserDigestProfile,
  options: DigestRenderOptions = {},
): Promise<DigestRenderResult> {
  const now = options.now ?? new Date();
  const locale = profile.digest_config.locale ?? "en-US";

  const context: DigestRenderContext = {
    profile,
    runDate: now,
    locale,
    voice: profile.digest_config.voice,
    length: profile.digest_config.length,
    preview: Boolean(options.preview),
  };

  const resolvedModules = resolveEnabledModules(profile);
  const modules = await renderModules(resolvedModules, context, options.moduleOverrides);
  const { subjectLine, previewLine } = buildDigestSubject(profile, modules);

  const personalization = (profile.digest_config.personalization ?? {}) as Record<string, unknown>;
  const layout = options.forceLayout ?? resolveLayoutKey(personalization.layoutStyle as string | undefined);

  const rendered = renderDigestLayout({
    layout,
    heading: profile.title,
    previewLine,
    intro: buildIntro(profile, now),
    modules,
  });

  return {
    subjectLine,
    previewLine,
    html: rendered.html,
    text: rendered.text,
    layout,
    modules,
    sources: modules.map((module) => module.sourcePayload),
    payload: {
      profileId: profile.id,
      renderedAt: now.toISOString(),
      preview: Boolean(options.preview),
      layout,
      subjectLine,
      previewLine,
      modules,
      html: rendered.html,
      text: rendered.text,
    },
  };
}

export async function runDigestRender(params: {
  repository: DigestRepository;
  profile: UserDigestProfile;
  options?: DigestRenderOptions;
}) {
  const { repository, profile, options } = params;
  const now = options?.now ?? new Date();
  const previewMode = Boolean(options?.preview);

  const render = await renderDigestForProfile(profile, options);

  if (previewMode) {
    return {
      preview: true,
      run: null,
      render,
    };
  }

  const run = await repository.createRun({
    profile_id: profile.id,
    user_id: profile.user_id,
    scheduled_for: now.toISOString(),
    status: "rendering",
    started_at: now.toISOString(),
    completed_at: null,
    error_message: null,
    subject_line: render.subjectLine,
    preview_line: render.previewLine,
    render_payload: render.payload,
    delivery_meta: {
      mode: "email",
      layout: render.layout,
    },
  });

  await repository.createSources(
    render.sources.map((source) => ({
      user_id: profile.user_id,
      profile_id: profile.id,
      source_type: source.sourceType,
      source_label: source.sourceLabel,
      source_ref: source.sourceRef ?? run.id,
      settings: {
        run_id: run.id,
        payload: source.payload,
      },
      is_active: true,
    })),
  );

  await repository.updateRun(run.id, {
    status: "queued",
    completed_at: new Date().toISOString(),
  });

  return {
    preview: false,
    run,
    render,
  };
}
