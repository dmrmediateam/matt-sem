"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { MarqueeMenu } from "@/components/marquee-menu";
import { RetroMenu } from "@/components/retro-menu";
import { mediaPhotos, mediaVideos } from "@/lib/media";

/**
 * The site is one page, so the nav is a set of places in a story rather than
 * a list of routes. That's why the current item is tracked by scroll position
 * instead of by URL: on a single page a pathname match would leave the nav
 * permanently inert.
 *
 * Visual rules live in .site-header in globals.css; each menu owns its own.
 */

const hasMedia = mediaPhotos.length > 0 || mediaVideos.length > 0;

/** `id` is the section this item points at on the home page. */
const links = [
  { id: "matt", href: "/#matt", label: "About" },
  ...(hasMedia ? [{ id: "media", href: "/#media", label: "Videos" }] : []),
  { id: "next", href: "/#next", label: "What's next" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

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

    // "book" is watched even though the Books dropdown isn't in `links`, so
    // its marker still draws while that section is on screen.
    const sections = ["book", ...links.map((l) => l.id)]
      .map((id) => document.getElementById(id))
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

        <div className="flex items-center gap-5">
          {/* Combo navigation: the links hide, this never does. */}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/books/the-86-kids/">Buy the book</Link>
          </Button>
          <MarqueeMenu current={current} />
          <RetroMenu current={current} hasMedia={hasMedia} />
        </div>
      </div>
    </header>
  );
}
