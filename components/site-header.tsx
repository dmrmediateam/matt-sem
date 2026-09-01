"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RetroMenu } from "@/components/retro-menu";
import { mediaPhotos, mediaVideos } from "@/lib/media";

/**
 * The site is one page, so the nav is a set of places in a story rather than
 * a list of routes. That's why the current item is tracked by scroll position
 * instead of by URL: on a single page a pathname match would leave the nav
 * permanently inert.
 *
 * Visual rules live in .site-header / .nav-item / .nav-mark in globals.css.
 */

const hasMedia = mediaPhotos.length > 0 || mediaVideos.length > 0;

/** `id` is the section this item points at on the home page. */
const links = [
  { id: "book", href: "/#book", label: "The book" },
  { id: "matt", href: "/#matt", label: "About" },
  ...(hasMedia ? [{ id: "media", href: "/#media", label: "Videos" }] : []),
  { id: "next", href: "/#next", label: "What's next" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

/**
 * Hand-drawn marker underline. The wobble is intentional and asymmetric — a
 * perfectly smooth curve reads as a swoosh, which is exactly the generic
 * thing this replaces. Drawn with a stroke-dashoffset sweep so it arrives
 * like a pen stroke.
 */
function NavMark() {
  return (
    <svg
      className="nav-mark"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M3 8.5C34 4.2 71 3.1 104 4.4c30 1.2 58 3.6 93 1.1" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = React.useState(false);
  const [spied, setSpied] = React.useState<string | null>(null);

  // Derived rather than stored: off the home page there are no sections to
  // be inside, so nothing should be marked. Deriving avoids a redundant
  // state write in the effect below.
  const current = isHome ? spied : null;

  // Solid bar only after the reader leaves the hero.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy. rootMargin pins the trigger line near the top of the viewport
  // so a section counts as current once it reaches the header, not when it
  // first peeks in from the bottom.
  React.useEffect(() => {
    if (!isHome) return;

    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setSpied(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // Escape, the focus trap and the scroll lock are handled by the native
  // <dialog> inside RetroMenu, so there's nothing to wire up here.

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="wordmark">
          Matt Sem
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="nav-item"
              data-current={current === link.id}
              aria-current={current === link.id ? "true" : undefined}
            >
              {link.label}
              <NavMark />
            </Link>
          ))}
        </nav>

        <RetroMenu current={current} hasMedia={hasMedia} />
      </div>
    </header>
  );
}
