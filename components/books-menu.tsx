"use client";

import * as React from "react";
import Link from "next/link";

import { books, upcoming } from "@/lib/books";

/**
 * The "Books" nav item: a button that opens a list of titles.
 *
 * It's a button rather than a link on purpose. There is no /books index
 * route, and an item that is simultaneously a link and an expander is a
 * documented accessibility pitfall — keyboard and screen reader users can't
 * predict which action a press will produce. A dedicated toggle is
 * unambiguous.
 *
 * Published titles link to their page. Titles still being written are listed
 * for context but aren't links, since there's nowhere to send anyone yet;
 * their status is spelled out in text rather than implied by colour.
 */
export function BooksMenu({ current }: { current: boolean }) {
  const [open, setOpen] = React.useState(false);

  /**
   * Hover is only wired up on devices that actually hover. On a touchscreen
   * at desktop width a tap fires mouseenter and then click, so a plain
   * toggle would open the panel and immediately close it again — the menu
   * would appear broken on every tablet.
   */
  const canHover = React.useRef(false);
  React.useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover)").matches;
  }, []);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  // Pointer users get hover, with a short grace period so the diagonal move
  // from the trigger down to the first row doesn't dismiss the panel.
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  }

  React.useEffect(() => cancelClose, []);

  // Escape closes and returns focus to the trigger; a click anywhere else
  // dismisses. Both are required for a menu that opens on hover.
  React.useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        wrapRef.current?.querySelector("button")?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="nav-books"
      data-open={open}
      onMouseEnter={() => {
        if (!canHover.current) return;
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (!canHover.current) return;
        scheduleClose();
      }}
      // Tabbing out of the last row should close it, the same as moving the
      // mouse away.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="nav-item nav-books-trigger"
        data-current={current}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Books
        <span className="nav-books-caret" aria-hidden="true" />
        <svg
          className="nav-mark"
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M3 8.5C34 4.2 71 3.1 104 4.4c30 1.2 58 3.6 93 1.1" />
        </svg>
      </button>

      <div className="nav-books-panel">
        <ul>
          {books.map((book) => (
            <li key={book.slug}>
              <Link
                href={`/books/${book.slug}/`}
                className="book-row"
                onClick={() => setOpen(false)}
              >
                <span className="book-row-title">{book.title}</span>
                <span className="book-row-meta">
                  {book.pages} pages &middot; out now
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="books-divider" />

        <ul>
          {upcoming.map((book) => (
            <li key={book.title}>
              <div className="book-row book-row-soon">
                <span className="book-row-title">{book.title}</span>
                <span className="book-row-status">{book.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
