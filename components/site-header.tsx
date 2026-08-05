"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * One-page site: nav items are anchors into the home narrative, plus the
 * contact page. Anchors deliberately read like a story arc, not a sitemap.
 */
const links = [
  { href: "/#book", label: "The book" },
  { href: "/#matt", label: "About Matt" },
  { href: "/#next", label: "What's next" },
  { href: "/contact/", label: "Say hello" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  function isActive(href: string) {
    return href === "/contact/" && pathname.startsWith("/contact");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.2em] text-primary uppercase"
          onClick={() => setOpen(false)}
        >
          Matt Sem
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav
          className="border-t border-border/60 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="grid gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block py-1 text-base",
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
