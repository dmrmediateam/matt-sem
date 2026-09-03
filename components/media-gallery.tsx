"use client";

import * as React from "react";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import config from "@/lib/gallery.json";
import { mediaPhotos, mediaVideos } from "@/lib/media";
import type { MediaPhoto, MediaVideo } from "@/lib/media";

/**
 * "The '86 Kids videos and pictures" — a 3D carousel on the home page.
 *
 * Every item sits on the rim of one circle, facing outward. Spinning the ring
 * is a single rotateY on the stage; the cards never move relative to each
 * other. The far side is deliberately NOT hidden — you look through the front
 * of the ring and see the backs of everything else receding behind it, which
 * is the whole reason to build this instead of a row.
 *
 * The radius is derived, not configured. A ring sized for eighteen cards would
 * leave six of them floating in space, so it comes from the card width and the
 * number of cards actually on screen (see `radiusFor`) and changes with the
 * filter.
 *
 * Depth is faked with three cheap properties rather than one expensive one:
 * opacity, a scrim laid over the card, and a small blur, each scaled by how far
 * the card has turned away. All three ride on one `--dim` custom property per
 * card, so the browser interpolates them alongside the stage's rotation
 * instead of needing a frame loop.
 *
 * Returns null when there's no media, so an empty carousel never ships.
 * Geometry and feel are in lib/gallery.json; the media is in lib/media.ts.
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

function itemTitle(item: GalleryItem): string {
  return item.type === "video"
    ? item.video.title
    : item.photo.caption ?? item.photo.alt;
}

/**
 * Radius that spaces `count` cards of `width` evenly around a circle without
 * overlapping them. Each card sits on a chord; solving that chord for the
 * radius is where the tan comes from. Two or fewer cards make no meaningful
 * circle, so they fall back to the configured minimum.
 */
function radiusFor(count: number, width: number): number {
  const chord = width * config.card.gap;
  const ideal = count > 2 ? chord / 2 / Math.tan(Math.PI / count) : 0;
  // Rounded, and every other number that reaches a style attribute is rounded
  // too. Node and the browser's JS engines disagree in the last bits of a
  // tan(), and the browser then reserialises `986.8030366134815px` in the
  // markup as `986.803px` — either difference is a hydration mismatch, and
  // React does not patch those up. Whole pixels are indistinguishable here.
  return Math.round(Math.max(config.stage.minRadius, ideal));
}

/** Fixed precision for anything interpolated into a style attribute. */
function round(value: number, places = 3): number {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

/**
 * How far the ring actually reaches above and below its own centre, once the
 * tilt and the perspective have had their way with it.
 *
 * This is measured rather than guessed because it isn't symmetrical: tilting
 * to look down at the ring drops the near side and lifts the far side, and
 * the far side is also shrunk by perspective, so the bottom of the front card
 * ends up much further from the centre than the top of the back one. A single
 * fixed height either clips the ring or leaves a hole under it.
 *
 * Walks the circle and projects the top and bottom edge of a card at each
 * step, the same way the browser will.
 */
function ringBounds(
  radius: number,
  tiltDeg: number,
  cardHeight: number
): { top: number; bottom: number } {
  const tilt = (-tiltDeg * Math.PI) / 180;
  const persp = config.stage.perspective;
  const half = cardHeight / 2;

  let top = 0;
  let bottom = 0;

  for (let deg = 0; deg < 360; deg += 2) {
    const cos = Math.cos((deg * Math.PI) / 180);
    // The ring point after rotateX, then the stage's translateZ(-radius).
    const y = -radius * cos * Math.sin(tilt);
    const z = radius * cos * Math.cos(tilt) - radius;
    // Everything is at or behind the viewer's plane, so this is <= 1.
    const scale = persp / (persp - z);
    top = Math.min(top, y * scale - half * scale);
    bottom = Math.max(bottom, y * scale + half * scale);
  }

  return { top, bottom };
}

/** Signed angle from the front of the ring, in (-180, 180]. */
function relativeAngle(cardAngle: number, rotation: number): number {
  return ((((cardAngle - rotation) % 360) + 540) % 360) - 180;
}

export function MediaGallery() {
  const hasVideos = mediaVideos.length > 0;
  const hasPhotos = mediaPhotos.length > 0;

  const [filter, setFilter] = React.useState<Filter>("all");
  // Unbounded on purpose: it counts turns, so spinning past the end carries on
  // the way it was pointed instead of unwinding the whole ring.
  const [index, setIndex] = React.useState(0);
  // Degrees added while a drag is in progress, before it snaps to a card.
  const [drag, setDrag] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  // Index into `items`, or null when the lightbox is closed.
  const [openAt, setOpenAt] = React.useState<number | null>(null);

  // Starts at the configured desktop size so the server and the first client
  // render agree; the real measurement lands in the effect below.
  const [card, setCard] = React.useState({
    width: config.card.width,
    height: config.card.height,
  });

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);

  // Nothing is requested until the reader is near the section. This has to be
  // explicit: a browser can't work out whether a card rotated in 3D space is
  // on screen, so it gives up and fetches every lazy image immediately —
  // measured at 18 requests 71ms into the page load, for a section thousands
  // of pixels below the fold. An observer on the ring is the honest version.
  const [armed, setArmed] = React.useState(false);

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

  const count = items.length;
  const step = count > 0 ? 360 / count : 360;
  const radius = radiusFor(count, card.width);
  const rotation = index * step + drag;

  // Breathing room so the ring never touches the section's edges.
  const pad = 24;
  const bounds = ringBounds(radius, config.stage.tilt, card.height);
  const ringHeight = Math.round(bounds.bottom - bounds.top + pad * 2);
  // The ring's centre is NOT the box's centre; it sits wherever it has to for
  // the highest and lowest points of the circle to both clear the edges.
  const ringOrigin = Math.round(-bounds.top + pad);
  // Wrapped back into the array after any number of turns in either direction.
  const active = count > 0 ? ((index % count) + count) % count : 0;

  React.useEffect(() => {
    const node = ringRef.current;
    if (!node || armed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      // Enough lead time that the cards are filled by the time they're read.
      { rootMargin: "800px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  // Card size follows the viewport and the radius follows the card. Read from
  // the window rather than a media query so the two can never disagree.
  React.useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < config.card.mobileBelow;
      setCard({
        width: mobile ? config.card.mobileWidth : config.card.width,
        height: mobile ? config.card.mobileHeight : config.card.height,
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Shortest way round: turning forward eleven stops to reach the card seven
  // stops behind you is technically correct and looks deranged.
  const goTo = React.useCallback(
    (target: number) => {
      setIndex((current) => {
        if (count === 0) return current;
        const here = ((current % count) + count) % count;
        let delta = (((target - here) % count) + count) % count;
        if (delta > count / 2) delta -= count;
        return current + delta;
      });
    },
    [count]
  );

  // Belt and braces: anyone touching the ring wants to see it, so arm here
  // too rather than trusting the observer to have fired. A page the browser
  // considers hidden throttles IntersectionObserver, and a carousel of blank
  // cards is a worse failure than fetching a little early.
  const spin = React.useCallback((by: 1 | -1) => {
    setArmed(true);
    setIndex((i) => i + by);
  }, []);

  // Filtering rebuilds the ring, so an index into the old one is meaningless
  // and an open lightbox would be pointing at the wrong item.
  function changeFilter(next: Filter) {
    setFilter(next);
    setIndex(0);
    setDrag(0);
    setOpenAt(null);
    dialogRef.current?.close();
  }

  /* ---- drag to spin ---------------------------------------------------- */

  const dragState = React.useRef({ startX: 0, lastX: 0, lastT: 0, velocity: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setArmed(true);
    ringRef.current?.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    };
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const state = dragState.current;
    const dt = e.timeStamp - state.lastT;
    if (dt > 0) state.velocity = (e.clientX - state.lastX) / dt;
    state.lastX = e.clientX;
    state.lastT = e.timeStamp;
    // Dragging right brings the card on the left round to the front, which is
    // a negative rotation — hence the sign.
    setDrag(-(e.clientX - state.startX) * config.motion.dragDegreesPerPx);
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    ringRef.current?.releasePointerCapture(e.pointerId);
    setDragging(false);

    const flick = -dragState.current.velocity * 1000 * config.motion.flickFactor;
    setIndex(Math.round((rotation + flick) / step));
    setDrag(0);
  }

  /** A press that barely moved is a click on the card, not a spin. */
  function wasDrag(): boolean {
    return Math.abs(dragState.current.lastX - dragState.current.startX) > 6;
  }

  /* ---- lightbox -------------------------------------------------------- */

  function openLightbox(i: number, trigger: HTMLElement | null) {
    returnFocusRef.current = trigger;
    setOpenAt(i);
    dialogRef.current?.showModal();
  }

  function closeLightbox() {
    setOpenAt(null);
    dialogRef.current?.close();
    returnFocusRef.current?.focus();
  }

  // Steps the ring along with the lightbox, so closing it leaves the carousel
  // facing whatever was last on screen rather than where it started.
  const stepLightbox = React.useCallback(
    (dir: 1 | -1) => {
      setOpenAt((at) => (at === null ? at : (at + dir + count) % count));
      setIndex((i) => i + dir);
    },
    [count]
  );

  function onDialogKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepLightbox(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepLightbox(-1);
    }
  }

  /** Clicking a card brings it to the front; clicking the front one opens it. */
  function onCardActivate(i: number, el: HTMLElement | null) {
    if (wasDrag()) return;
    if (i === active) openLightbox(i, el);
    else goTo(i);
  }

  function onRingKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      spin(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      spin(-1);
    }
  }

  if (!hasVideos && !hasPhotos) return null;

  const open = openAt !== null ? items[openAt] : null;
  // Both kinds present is the only case where filtering means anything.
  const showTabs = hasVideos && hasPhotos;

  return (
    <section
      id="media"
      aria-label="The '86 Kids videos and pictures"
      className="gal-section border-y border-border/60"
      style={
        {
          "--gal-card-w": card.width + "px",
          "--gal-card-h": card.height + "px",
          "--gal-fade": config.depth.fade,
          "--gal-scrim": config.depth.scrim,
          "--gal-blur": config.depth.blur + "px",
          "--gal-snap": config.motion.snapMs + "ms",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-14 sm:px-6">
        <Reveal>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
            Roll the tape
          </p>
          <h2 className="font-display mt-3 text-3xl">
            The &rsquo;86 Kids videos and pictures
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Readings, signings, and a few shots from around Wausau. Spin the
            carousel round, or open whatever&rsquo;s facing you.
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
      </div>

      {/* Full bleed: the ring is far wider than the text column, and holding it
          to the same measure would cut the sides off the circle. */}
      <div
        ref={ringRef}
        className="gal3d"
        data-dragging={dragging}
        style={{
          perspective: config.stage.perspective + "px",
          height: ringHeight + "px",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onRingKeyDown}
        role="group"
        aria-roledescription="carousel"
        aria-label="Videos and pictures"
        tabIndex={0}
      >
        <div
          className="gal3d-stage"
          style={{
            top: ringOrigin + "px",
            // Negative: `tilt` is how far you look DOWN at the ring, which
            // lifts the far side above the near one.
            transform:
              "translateZ(-" +
              radius +
              "px) rotateX(" +
              -config.stage.tilt +
              "deg) rotateY(" +
              round(-rotation) +
              "deg)",
          }}
        >
          {items.map((item, i) => {
            const angle = round(i * step);
            const rel = relativeAngle(angle, rotation);
            // 0 dead ahead, 1 directly behind. The curve keeps the cards near
            // the front bright and puts the fall-off around the sides.
            const dim = round(Math.pow(Math.abs(rel) / 180, 0.75));
            const isActive = i === active;

            return (
              <div
                key={itemKey(item) + "#" + i}
                className="gal3d-slot"
                style={
                  {
                    transform:
                      "rotateY(" + angle + "deg) translateZ(" + radius + "px)",
                    // Nearest the front paints over everything behind it.
                    zIndex: Math.round(180 - Math.abs(rel)),
                    "--dim": dim,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="gal3d-card"
                  data-active={isActive}
                  data-kind={item.type}
                  // Only the front card is a tab stop. Eighteen cards in the
                  // tab order, most of them facing away, is a worse keyboard
                  // experience than arrow keys on the ring itself.
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive}
                  onClick={(e) => onCardActivate(i, e.currentTarget)}
                >
                  <CardFace item={item} armed={armed} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6">
        <div className="gal3d-controls">
          <button
            type="button"
            className="gal-box-step"
            onClick={() => spin(-1)}
            aria-label="Previous item"
          >
            <span aria-hidden="true">&#9664;</span> Prev
          </button>

          <p className="gal3d-now" aria-live="polite">
            <span className="gal3d-now-count">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <span className="gal3d-now-title">
              {items[active] ? itemTitle(items[active]) : null}
            </span>
          </p>

          <button
            type="button"
            className="gal-box-step"
            onClick={() => spin(1)}
            aria-label="Next item"
          >
            Next <span aria-hidden="true">&#9654;</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="gal-box"
        aria-label="Gallery viewer"
        onKeyDown={onDialogKeyDown}
        onCancel={(e) => {
          // Escape fires 'cancel'; take it over so React state and focus
          // restoration stay in step with the dialog closing itself.
          e.preventDefault();
          closeLightbox();
        }}
        // A click on the backdrop has the dialog itself as its target; a click
        // anywhere on the panel inside does not. That's the whole test.
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
      >
        {open ? (
          <div className="gal-box-inner">
            <div className="gal-box-bar">
              <span className="gal-box-count">
                {String((openAt ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
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
              {/* Keyed so switching items tears down the old player instead of
                  leaving a video running behind the new one. */}
              <LightboxItem key={itemKey(open) + "#" + openAt} item={open} />
            </div>

            <div className="gal-box-foot">
              <LightboxCaption item={open} />
              {count > 1 ? (
                <div className="gal-box-nav">
                  <button
                    type="button"
                    className="gal-box-step"
                    onClick={() => stepLightbox(-1)}
                  >
                    <span aria-hidden="true">&#9664;</span> Prev
                  </button>
                  <button
                    type="button"
                    className="gal-box-step"
                    onClick={() => stepLightbox(1)}
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

/**
 * What sits on a card. Every item gets the same footprint — the ring stops
 * being a circle the moment the cards differ — so the media fills a fixed
 * window and the label sits underneath it.
 */
function CardFace({ item, armed }: { item: GalleryItem; armed: boolean }) {
  if (item.type === "video") {
    const poster = armed ? videoPoster(item.video) : undefined;
    return (
      <>
        <span className="gal3d-window">
          {poster ? (
            // Plain <img>: posters are already sized for this box and the
            // YouTube fallback is remote. With images.unoptimized there is
            // nothing next/image would add here but a hostname to configure.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" loading="lazy" className="gal3d-media" />
          ) : (
            <span className="gal3d-blank" aria-hidden="true" />
          )}
          <span className="gal-play" aria-hidden="true">
            <span className="gal-play-tri" />
          </span>
        </span>
        <span className="gal3d-label">
          <span className="gal3d-title">{item.video.title}</span>
          {item.video.caption ? (
            <span className="gal3d-sub">{item.video.caption}</span>
          ) : null}
        </span>
      </>
    );
  }

  const photo = item.photo;
  return (
    <>
      <span className="gal3d-window">
        {armed ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="320px"
            className="gal3d-media"
          />
        ) : (
          <span className="gal3d-blank" aria-hidden="true" />
        )}
      </span>
      <span className="gal3d-label">
        <span className="gal3d-title gal3d-title-hand">
          {photo.caption ?? photo.alt}
        </span>
      </span>
    </>
  );
}

/**
 * The line under the lightbox. A photo's alt text describes the image for
 * anyone who can't see it, which is not the same job as a caption, so it's
 * only used here when there's no caption to show instead.
 */
function LightboxCaption({ item }: { item: GalleryItem }) {
  const headline =
    item.type === "video"
      ? item.video.title
      : item.photo.caption ?? item.photo.alt;
  const sub = item.type === "video" ? item.video.caption : undefined;

  return (
    <p className="gal-box-caption">
      <span className="gal-box-title">{headline}</span>
      {sub ? " · " + sub : null}
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
  // instead of being stretched across a widescreen box. maxWidth is that ratio
  // applied to the stage's height cap, which keeps a tall 4:3 video inside the
  // panel by narrowing it rather than by squashing it. Both are inline because
  // they're per-video; see .gal-box-video in globals.css.
  const ratio = video.ratio ?? "16/9";
  const [w, h] = ratio.split("/");
  const style = {
    aspectRatio: w + " / " + h,
    maxWidth: "calc(68vh * " + w + " / " + h + ")",
  };

  if (video.kind === "vimeo") {
    return (
      <div className="gal-box-video" style={style}>
        <iframe
          className="gal-box-frame"
          // autoplay is honest here: the reader pressed play to get this far.
          // dnt=1 is Vimeo's do-not-track flag, which stops the player setting
          // analytics cookies and keeps this off the consent-banner list.
          src={"https://player.vimeo.com/video/" + video.id + "?autoplay=1&dnt=1"}
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
          src={
            "https://www.youtube-nocookie.com/embed/" +
            video.id +
            "?autoplay=1&rel=0"
          }
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
