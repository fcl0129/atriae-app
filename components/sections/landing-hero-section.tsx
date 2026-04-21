import Link from "next/link";

import { RevealSection } from "@/components/layout/reveal-section";
import { MediaBetweenText } from "@/components/ui/media-between-text";

export function LandingHeroSection() {
  return (
    <RevealSection className="space-y-10 md:space-y-14">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Atriaé for event teams</p>

      <div className="space-y-5 md:space-y-7">
        <MediaBetweenText
          lead="host"
          trail="beautifully"
          mediaType="image"
          mediaSrc="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"
          trigger="in-view"
          className="justify-start"
          aspectRatioClassName="aspect-[3/4]"
        />
        <MediaBetweenText
          lead="design"
          trail="intentionally"
          mediaType="image"
          mediaSrc="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
          trigger="hover"
          className="justify-end"
          aspectRatioClassName="aspect-[16/10]"
        />
        <MediaBetweenText
          lead="manage"
          trail="seamlessly"
          mediaType="video"
          mediaSrc="https://videos.pexels.com/video-files/855885/855885-hd_1920_1080_25fps.mp4"
          trigger="in-view"
          className="justify-start"
          aspectRatioClassName="aspect-[4/5]"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-12">
        <p className="max-w-2xl text-base leading-8 text-muted-foreground md:col-span-8 md:text-lg">
          Atriaé gives modern hospitality teams an editorial control room for event storytelling, guest experience,
          and operational flow.
        </p>
        <div className="md:col-span-4 md:justify-self-end">
          <Link href="/dashboard" className="editorial-cta text-sm text-foreground">
            Plan your next experience
          </Link>
        </div>
      </div>
    </RevealSection>
  );
}
