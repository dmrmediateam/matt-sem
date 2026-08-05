import Link from "next/link";

import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.25em] text-primary uppercase">
            Matt Sem
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Author of {site.book.title} — stories from a Wausau, Wisconsin
            childhood, straight out of the 1980s.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Pages</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/book/" className="hover:text-primary">
                The &rsquo;86 Kids
              </Link>
            </li>
            <li>
              <Link href="/about/" className="hover:text-primary">
                About Matt
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Get the book</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>
              <a
                href={site.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Amazon (Kindle, paperback, hardcover)
              </a>
            </li>
            <li>Janke Book Store — Wausau</li>
            <li>The Story Cellar — Wausau</li>
            <li>Barnes &amp; Noble — Wausau</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} Matt Sem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
