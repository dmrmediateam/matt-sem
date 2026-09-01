import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark className="text-primary h-[17px] w-auto" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Author of {site.book.title}: stories from a Wausau, Wisconsin
            childhood, straight out of the 1980s.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Around the site</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/#book" className="hover:text-primary">
                The &rsquo;86 Kids
              </Link>
            </li>
            <li>
              <Link href="/#matt" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/#next" className="hover:text-primary">
                What&rsquo;s next
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-primary">
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
            <li>Janke Book Store · Wausau</li>
            <li>The Story Cellar · Wausau</li>
            <li>Barnes &amp; Noble · Wausau</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Matt Sem. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Site design by{" "}
            <a
              href="https://kicklick.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              Kicklick
            </a>
            , built with a lot of neon.
          </p>
        </div>
      </div>
    </footer>
  );
}
