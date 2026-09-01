"use client";

import * as React from "react";
import Link from "next/link";

import { books, upcoming } from "@/lib/books";
import menuData from "@/lib/menu.json";
import { mediaPhotos, mediaVideos } from "@/lib/media";

/**
 * Desktop navigation: a full-screen marquee menu.
 *
 * The links are behind a trigger now, which costs discoverability — NN/g
 * measured hidden navigation performing worse on desktop than on mobile. The
 * hedge is combo navigation: the header keeps "Buy the book" visible at all
 * times, so the one action that earns money is never hidden. The trigger
 * itself stays conventional (plain three-line mark plus the word "Menu"),
 * because that is the shape people actually recognise.
 *
 * Built on native <dialog> + showModal(), which supplies the focus trap,
 * Escape handling, top-layer stacking and background scroll lock from the
 * platform rather than from hand-rolled JS.
 *
 * BACKGROUND_PHOTO is deliberately easy to switch off. The design works with
 * no image at all — the type carries it — so a bad photograph is never
 * forced on the page. Point it at a file in /public/images when Matt sends
 * something worth using.
 */

const BACKGROUND_PHOTO: string | null = "/images/matt-sem.jpg";

type MenuItem = {
  id: string;
  href: string;
  label: string;
  hint: string;
  requiresMedia?: boolean;
};

const allItems = menuData.items as MenuItem[];

export function MarqueeMenu({ current }: { current: string | null }) {
  const hasMedia = mediaPhotos.length > 0 || mediaVideos.length > 0;

  const items = React.useMemo(
    () => allItems.filter((item) => !item.requiresMedia || hasMedia),
    [hasMedia]
  );

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const firstRowRef = React.useRef<HTMLAnchorElement>(null);

  const [open, setOpen] = React.useState(false);

  function openMenu() {
    setOpen(true);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => firstRowRef.current?.focus());
  }

  function closeMenu() {
    setOpen(false);
    dialogRef.current?.close();
    // Without this the reader is dumped at the top of the document.
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mq-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="marquee-menu"
        onClick={openMenu}
      >
        <span className="mq-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="mq-trigger-label">Menu</span>
      </button>

      <dialog
        id="marquee-menu"
        ref={dialogRef}
        className="mq"
        aria-label="Main menu"
        onCancel={(e) => {
          // Escape fires 'cancel'; intercept so React state and focus
          // restoration stay in step with the dialog closing itself.
          e.preventDefault();
          closeMenu();
        }}
      >
        <div className="mq-screen" data-has-art={BACKGROUND_PHOTO !== null}>
          {BACKGROUND_PHOTO ? (
            <>
              <div
                className="mq-art"
                style={{ backgroundImage: `url(${BACKGROUND_PHOTO})` }}
              />
              <div className="mq-scrim" />
            </>
          ) : null}
          <div className="mq-scan" aria-hidden="true" />

          <button type="button" className="mq-close" onClick={closeMenu}>
            <span aria-hidden="true">&times;</span> Close
          </button>

          <ul className="mq-list">
            {items.map((item, i) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  ref={i === 0 ? firstRowRef : undefined}
                  className="mq-row"
                  data-current={item.id === current}
                  onClick={closeMenu}
                >
                  <span className="mq-ch" aria-hidden="true">
                    CH {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mq-label">{item.label}</span>
                  {item.id === current ? (
                    <span className="mq-now">Now playing</span>
                  ) : null}
                </Link>

                {/* The book list lives under Books rather than in a nested
                    dropdown: there's room here, and a second layer of
                    hidden navigation inside hidden navigation would be a
                    poor trade. */}
                {item.id === "book" ? (
                  <ul className="mq-sub">
                    {books.map((book) => (
                      <li key={book.slug}>
                        <Link
                          href={`/books/${book.slug}/`}
                          onClick={closeMenu}
                        >
                          {book.title}
                        </Link>
                      </li>
                    ))}
                    {upcoming.map((book) => (
                      <li key={book.title}>
                        <span
                          className="mq-sub-soon"
                          data-status={book.status}
                        >
                          {book.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <p className="mq-help">Esc to close</p>
        </div>
      </dialog>
    </>
  );
}
