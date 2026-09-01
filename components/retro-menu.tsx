"use client";

import * as React from "react";
import Link from "next/link";

import menuData from "@/lib/menu.json";

/**
 * Mobile menu, styled as the on-screen display of a 1986 VCR.
 *
 * Research shaped the boring parts, and deliberately so. NN/g's quantitative
 * study found hiding navigation drops content discoverability by more than
 * 20% and costs time on task, and that it hurts desktop more than mobile — so
 * this is mobile-only and the desktop nav stays visible. Their 2026
 * recognizability study found users mistake decorated or boxed icons for
 * something else (a document icon), and recommends the plain three-line mark
 * plus a visible "Menu" label. So the trigger is conventional on purpose;
 * every liberty is taken inside the panel, where nothing has to be guessed.
 *
 * Built on native <dialog> + showModal(), which supplies the focus trap,
 * Escape handling, top-layer stacking and background scroll lock without a
 * hand-rolled trap that would need testing in every browser.
 *
 * Content comes from lib/menu.json so adding a destination is a data edit.
 */

type MenuItem = {
  id: string;
  href: string;
  label: string;
  hint: string;
  requiresMedia?: boolean;
};

const osd = menuData.osd;
const allItems = menuData.items as MenuItem[];

export function RetroMenu({
  current,
  hasMedia,
}: {
  current: string | null;
  hasMedia: boolean;
}) {
  const items = React.useMemo(
    () => allItems.filter((item) => !item.requiresMedia || hasMedia),
    [hasMedia]
  );

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const [open, setOpen] = React.useState(false);
  // Which row the arrow-key cursor sits on. Opens on the section being read,
  // so the menu answers "where am I" before it answers "where can I go".
  const [cursor, setCursor] = React.useState(0);

  function openMenu() {
    const startAt = Math.max(
      0,
      items.findIndex((i) => i.id === current)
    );
    setCursor(startAt);
    setOpen(true);
    dialogRef.current?.showModal();
    // Focus the row the cursor is on, not blindly the first.
    requestAnimationFrame(() => itemRefs.current[startAt]?.focus());
  }

  function closeMenu() {
    setOpen(false);
    dialogRef.current?.close();
    // Return focus to what opened it, or the user lands back at the page top.
    triggerRef.current?.focus();
  }

  // Arrow keys move the cursor the way a VCR remote would. Tab is left alone
  // so the standard keyboard path still works.
  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = (cursor + dir + items.length) % items.length;
      setCursor(next);
      itemRefs.current[next]?.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="osd-trigger md:hidden"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="retro-menu"
        onClick={openMenu}
      >
        {/* Plain three-line mark: the shape users actually recognise. */}
        <span className="osd-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="osd-trigger-label">Menu</span>
      </button>

      <dialog
        id="retro-menu"
        ref={dialogRef}
        className="osd"
        aria-label="Main menu"
        onKeyDown={onKeyDown}
        onCancel={(e) => {
          // Escape fires 'cancel'; take it over so React state and focus
          // restoration stay in step with the dialog's own closing.
          e.preventDefault();
          closeMenu();
        }}
      >
        <div className="osd-screen">
          <div className="osd-scanlines" aria-hidden="true" />

          <div className="osd-bar">
            <span className="osd-mode">
              <span className="osd-play" aria-hidden="true" />
              {osd.mode}
            </span>
            <span className="osd-deck">{osd.deck}</span>
            {/* The blinking 12:00 of a VCR nobody ever set. */}
            <span className="osd-clock" aria-hidden="true">
              {osd.clock}
            </span>
          </div>

          <ul className="osd-list">
            {items.map((item, i) => {
              const selected = i === cursor;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="osd-item"
                    data-selected={selected}
                    data-current={item.id === current}
                    onFocus={() => setCursor(i)}
                    onClick={closeMenu}
                  >
                    <span className="osd-cursor" aria-hidden="true">
                      &#9654;
                    </span>
                    <span className="osd-channel" aria-hidden="true">
                      CH {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="osd-label">{item.label}</span>
                    <span className="osd-hint">{item.hint}</span>
                    {item.id === current ? (
                      <span className="osd-now">Now playing</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="osd-help">{osd.hint}</p>

          <button type="button" className="osd-close" onClick={closeMenu}>
            Stop / close
          </button>
        </div>
      </dialog>
    </>
  );
}
