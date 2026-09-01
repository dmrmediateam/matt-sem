import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { mediaPhotos, mediaVideos } from "@/lib/media";

/**
 * "The '86 Kids videos and pictures" — the media section on the home page.
 *
 * Returns null when there's no media, so an empty gallery never ships. Add
 * entries in lib/media.ts and the section appears on the next build.
 *
 * Videos lead because they're the bigger draw and there will be fewer of
 * them; photos fill in underneath. Both grids collapse to one column on
 * phones.
 */
export function MediaGallery() {
  const hasVideos = mediaVideos.length > 0;
  const hasPhotos = mediaPhotos.length > 0;

  if (!hasVideos && !hasPhotos) return null;

  return (
    <section
      id="media"
      aria-label="The '86 Kids videos and pictures"
      className="border-y border-border/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl">
            The &rsquo;86 Kids videos and pictures
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Readings, signings, and a few shots from around Wausau.
          </p>
        </Reveal>

        {hasVideos ? (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {mediaVideos.map((video) => (
              <Reveal key={video.kind === "youtube" ? video.id : video.src}>
                <figure>
                  {/* aspect-video + absolute fill keeps the 16:9 box reserved
                      before the iframe loads, so nothing jumps. */}
                  <div className="relative aspect-video w-full overflow-hidden border-[3px] border-foreground">
                    {video.kind === "youtube" ? (
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={video.src}
                        poster={video.poster}
                        controls
                        preload="none"
                      />
                    )}
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    <span className="text-foreground">{video.title}</span>
                    {video.caption ? ` · ${video.caption}` : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}

        {hasPhotos ? (
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
              hasVideos ? "mt-12" : "mt-10"
            }`}
          >
            {mediaPhotos.map((photo, i) => (
              <Reveal key={photo.src} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <figure>
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-[3px] border-foreground">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {photo.caption ? (
                    <figcaption className="mt-3 text-sm text-muted-foreground">
                      {photo.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
