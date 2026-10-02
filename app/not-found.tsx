import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * The 404. Rendered inside the root layout, so the header, menus and footer
 * all come with it; static export writes it out as 404.html, which
 * wrangler.jsonc serves for any unknown path (not_found_handling: 404-page).
 *
 * Without this file the site fell back to Next's built-in page: a black
 * screen reading "404 | This page could not be found." It follows the
 * visitor's OS colour scheme rather than the site's theme, so it looked like
 * a different website, and it offered no way onward except the header.
 *
 * No metadata export: Next documents one only for global-not-found, and it
 * already marks every 404 noindex on its own.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 md:py-36">
        {/* The number is decoration; the sentence is the heading. */}
        <p aria-hidden="true" className="neon-text font-display text-6xl sm:text-7xl">
          404
        </p>
        <p className="font-display mt-6 text-xs tracking-[0.3em] text-accent uppercase">
          Tracking error
        </p>
        <h1 id="not-found-title" className="font-display mt-3 text-3xl sm:text-4xl">
          That page isn&rsquo;t on this tape
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
          The link may be old, or the address mistyped. The book and
          everything else are right where you left them.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button asChild size="lg">
            <Link href="/">Back to the start</Link>
          </Button>
          <Link
            href="/books/the-86-kids/"
            className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
          >
            or see the book
          </Link>
        </div>
      </div>
    </section>
  );
}
