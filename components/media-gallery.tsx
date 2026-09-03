"use client";

import * as React from "react";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { mediaPhotos, mediaVideos } from "@/lib/media";
import type { MediaPhoto, MediaVideo } from "@/lib/media";

/**
 * "The '86 Kids videos and pictures" — the media section on the home page.
 *
 * Returns null when there's no media, so an empty gallery never ships. Add
 * entries in lib/media.ts and the section appears on the next build.
 *
 * Three things carry the design, all borrowed from elsewhere on the site so
 * this doesn't read as a bolted-on widget:
 *
 *   - Photos are polaroids, the same treatment as Matt's portrait in the
 *     About section, tilted in alternating directions.
 *   - Videos are VCR-era tape cards: a still, a play button, a hard 3px
 *     border and the offset shadow the header buttons use.
 *   - The lightbox is a native <dialog>, the same platform primitive as both
 *     menus, so the focus trap, Escape handling and scroll lock come free
 *     rather than from a hand-rolled trap.
 *
 * The grid shows STILLS, never embeds. A page with six YouTube iframes on it
 * loads six players; here nothing is requested from Google until a video is
 * actually opened.
 */

type GalleryItem =
  | { type: "video"; video: MediaVideo }
  | { type: "photo"; photo: MediaPhoto };

type Filter = "all" | "videos" | "photos";

/**
 * Identity for React keys. Suffixed with the position by the caller, because
 * nothing stops two entries in lib/media.ts from pointing at the same file
 * and a bare src would then collide.
 */
function itemKey(item: GalleryItem): string {
  if (item.type === "photo") return `photo:${item.photo.src}`;
  const video = item.video;
  return video.kind === "file"
    ? `video:file:${video.src}`
    : `video:${video.kind}:${video.id}`;
}

function videoPoster(video: MediaVideo): string | undefined {
  if (video.poster) return video.poster;
  // YouTube's own still, as a fallback only. hqdefault exists for every video;
  // maxresdefault doesn't, and 404s to a grey placeholder. Vimeo has no
  // guessable thumbnail URL at all, so a vimeo entry needs a local poster or
  // it gets the blank tile.
  if (video.kind === "youtube") {
    return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  }
  return undefined;
}

export function MediaGallery() {
  const hasVideos = mediaVideos.length > 0;
  const hasPhotos = mediaPhotos.length > 0;

  const [filter, setFilter] = React.useState<Filter>("all");
  // Index into `items` below, or null when the lightbox is closed.
  const [openAt, setOpenAt] = React.useState<number | null>(null);

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  // What opened the lightbox, so focus can go back to that exact tile.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  // Videos lead: there will be fewer of them and they're the bigger draw.
  const items = React.useMemo<GalleryItem[]>(() => {
    const videos: GalleryItem[] =
      filter === "photos"
        ? []
        : mediaVideos.map((video) => ({ type: "video", video }));
    const photos: GalleryItem[] =
      filter === "videos"
        ? []
        : mediaPhotos.map((photo) => ({ type: "photo", photo }));
    return [...videos, ...photos];
  }, [filter]);

  // Changing the filter reshuffles `items`, so an open lightbox would be
  // pointing at the wrong thing. Closing it is the honest response.
  function changeFilter(next: Filter) {
    setFilter(next);
    setOpenAt(null);
    dialogRef.current?.close();
  }

  function openAtIndex(index: number, trigger: HTMLElement | null) {
    returnFocusRef.current = trigger;
    setOpenAt(index);
    dialogRef.current?.showModal();
  }

  function closeLightbox() {
    setOpenAt(null);
    dialogRef.current?.close();
    returnFocusRef.current?.focus();
  }

  // Wraps at both ends: with a handful of items, hitting a dead stop is more
  // annoying than looping.
  const step = React.useCallback(
    (dir: 1 | -1) => {
      setOpenAt((at) =>
        at === null ? at : (at + dir + items.length) % items.length
      );
    },
    [items.length]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  }

  if (!hasVideos && !hasPhotos) return null;

  const open = openAt !== null ? items[openAt] : null;
  // Both kinds present is the only case where filtering means anything.
  const showTabs = hasVideos && hasPhotos;
  // `items` is built videos-first, so a photo's index in the combined list is
  // simply its own position offset by however many videos are showing.
  const shownVideos = items.filter((item) => item.type === "video");
  const shownPhotos = items.filter((item) => item.type === "photo");

  return (
    <section
      id="media"
      aria-label="The '86 Kids videos and pictures"
      className="border-y border-border/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
            Roll the tape
          </p>
          <h2 className="font-display mt-3 text-3xl">
            The &rsquo;86 Kids videos and pictures
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Readings, signings, and a few shots from around Wausau. Click
            anything to open it.
          </p>
        </Reveal>

        {showTabs ? (
          <Reveal>
            <div className="gal-tabs" role="group" aria-label="Filter the gallery">
              {(
                [
                  ["all", "All"],
                  ["videos", "Videos"],
                  ["photos", "Pictures"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="gal-tab"
                  data-active={filter === value}
                  aria-pressed={filter === value}
                  onClick={() => changeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* Two grids rather than one. Video tiles are uniform 16:9 cards and
            the polaroids are mostly upright, so interleaving them left every
            row ragged. `items` is still one list underneath, which is what
            lets the lightbox walk from the last video into the first photo. */}
        {shownVideos.length > 0 ? (
          <ul className="gal-grid" data-tabs={showTabs}>
            {shownVideos.map((item, i) => (
              <Reveal
                as="li"
                key={`${itemKey(item)}#${i}`}
                delay={((i % 3) + 1) as 1 | 2 | 3}
                className="gal-cell"
              >
                <VideoTile
                  video={(item as { type: "video"; video: MediaVideo }).video}
                  onOpen={(el) => openAtIndex(i, el)}
                />
              </Reveal>
            ))}
          </ul>
        ) : null}

        {shownPhotos.length > 0 ? (
          <ul
            className="gal-grid gal-grid-photos"
            data-tabs={showTabs && shownVideos.length === 0}
          >
            {shownPhotos.map((item, j) => (
              <Reveal
                as="li"
                key={`${itemKey(item)}#${j}`}
                delay={((j % 3) + 1) as 1 | 2 | 3}
                className="gal-cell"
              >
                <PhotoTile
                  photo={(item as { type: "photo"; photo: MediaPhoto }).photo}
                  index={j}
                  onOpen={(el) => openAtIndex(shownVideos.length + j, el)}
                />
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className="gal-box"
        aria-label="Gallery viewer"
        onKeyDown={onKeyDown}
        onCancel={(e) => {
          // Escape fires 'cancel'; take it over so React state and focus
          // restoration stay in step with the dialog closing itself.
          e.preventDefault();
          closeLightbox();
        }}
        // A click on the backdrop has the dialog itself as its target; a
        // click anywhere on the panel inside does not. That's the whole test.
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
      >
        {open ? (
          <div className="gal-box-inner">
            <div className="gal-box-bar">
              <span className="gal-box-count">
                {String((openAt ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="gal-box-close"
                onClick={closeLightbox}
              >
                <span aria-hidden="true">&times;</span> Close
              </button>
            </div>

            <div className="gal-box-stage">
              {/* Keyed so switching items tears down the old player instead
                  of leaving a video running behind the new one. */}
              <LightboxItem key={`${itemKey(open)}#${openAt}`} item={open} />
            </div>

            <div className="gal-box-foot">
              <LightboxCaption item={open} />

              {items.length > 1 ? (
                <div className="gal-box-nav">
                  <button
                    type="button"
                    className="gal-box-step"
                    onClick={() => step(-1)}
                  >
                    <span aria-hidden="true">&#9664;</span> Prev
                  </button>
                  <button
                    type="button"
                    className="gal-box-step"
                    onClick={() => step(1)}
                  >
                    Next <span aria-hidden="true">&#9654;</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

/** A tape-case tile: still frame, play button, hard border. */
function VideoTile({
  video,
  onOpen,
}: {
  video: MediaVideo;
  onOpen: (el: HTMLElement | null) => void;
}) {
  const poster = videoPoster(video);

  return (
    <figure className="gal-fig">
      <button
        type="button"
        className="gal-video hover-lift"
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <span className="gal-video-frame">
          {poster ? (
            // Plain <img>: the fallback is a remote YouTube still, and with
            // images.unoptimized there is nothing next/image would add here
            // beyond a hostname to configure.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" loading="lazy" className="gal-video-still" />
          ) : (
            <span className="gal-video-blank" aria-hidden="true" />
          )}
          <span className="gal-play" aria-hidden="true">
            <span className="gal-play-tri" />
          </span>
        </span>
        <span className="sr-only">Play {video.title}</span>
      </button>
      <figcaption className="gal-cap">
        <span className="gal-cap-title">{video.title}</span>
        {video.caption ? (
          <span className="gal-cap-sub">{video.caption}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** A polaroid, the same treatment as Matt's portrait in the About section. */
function PhotoTile({
  photo,
  index,
  onOpen,
}: {
  photo: MediaPhoto;
  index: number;
  onOpen: (el: HTMLElement | null) => void;
}) {
  return (
    <button
      type="button"
      className="gal-photo"
      // Alternating tilt, by position rather than at random, so the layout
      // is identical on the server and on the client.
      data-tilt={index % 2 === 0 ? "left" : "right"}
      onClick={(e) => onOpen(e.currentTarget)}
    >
      <figure className="polaroid rounded-sm">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="gal-photo-img"
        />
        <figcaption className="polaroid-caption">
          {photo.caption ?? photo.alt}
        </figcaption>
      </figure>
    </button>
  );
}

/**
 * The line under the lightbox. A photo's alt text describes the image for
 * anyone who can't see it, which is not the same job as a caption, so it's
 * only used here when there's no caption to show instead.
 */
function LightboxCaption({ item }: { item: GalleryItem }) {
  const headline =
    item.type === "video" ? item.video.title : item.photo.caption ?? item.photo.alt;
  const sub = item.type === "video" ? item.video.caption : undefined;

  return (
    <p className="gal-box-caption">
      <span className="gal-box-title">{headline}</span>
      {sub ? ` · ${sub}` : null}
    </p>
  );
}

/** The large view inside the lightbox. */
function LightboxItem({ item }: { item: GalleryItem }) {
  if (item.type === "photo") {
    return (
      <Image
        src={item.photo.src}
        alt={item.photo.alt}
        width={item.photo.width}
        height={item.photo.height}
        sizes="(min-width: 1100px) 1000px, 92vw"
        className="gal-box-photo"
      />
    );
  }

  const video = item.video;
  // The player follows the footage, so a 1986 camcorder transfer stays 4:3
  // instead of being stretched across a widescreen box. maxWidth is that
  // ratio applied to the stage's height cap, which keeps a tall 4:3 video
  // inside the panel by narrowing it rather than by squashing it. Both are
  // inline because they're per-video; see .gal-box-video in globals.css.
  const ratio = video.ratio ?? "16/9";
  const [w, h] = ratio.split("/");
  const style = {
    aspectRatio: `${w} / ${h}`,
    maxWidth: `calc(68vh * ${w} / ${h})`,
  };

  if (video.kind === "vimeo") {
    return (
      <div className="gal-box-video" style={style}>
        <iframe
          className="gal-box-frame"
          // autoplay is honest here: the reader pressed play to get this far.
          // dnt=1 is Vimeo's do-not-track flag, which stops the player setting
          // analytics cookies and keeps this off the consent-banner list.
          src={`https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (video.kind === "youtube") {
    return (
      <div className="gal-box-video" style={style}>
        <iframe
          className="gal-box-frame"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="gal-box-video" style={style}>
      <video
        className="gal-box-frame"
        src={video.src}
        poster={video.poster}
        controls
        autoPlay
      />
    </div>
  );
}
