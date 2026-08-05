import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The '86 Kids — an 80s childhood memoir",
  description:
    "The '86 Kids by Matt Sem: a 467-page memoir of an awesome and sometimes humorous childhood in 1980s Wausau, Wisconsin. Available on Kindle, paperback, and hardcover.",
};

export default function BookPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="retro-grid retro-grid-animated absolute inset-x-0 bottom-0 h-56"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr] md:py-24">
          <div className="anim-rise anim-delay-1 flex justify-center md:justify-start">
            <BookCover />
          </div>
          <div className="anim-rise">
            <p className="font-display text-xs font-medium tracking-[0.35em] text-accent uppercase">
              The book
            </p>
            <h1 className="neon-text neon-pulse font-display mt-3 text-4xl font-black sm:text-5xl">
              The &rsquo;86 Kids
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {site.book.subtitle}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex text-primary" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span>{site.book.rating.value} out of 5 on Amazon</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a
                  href={site.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on Amazon
                </a>
              </Button>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Length</dt>
                <dd className="font-semibold">{site.book.pages} pages</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Published</dt>
                <dd className="font-semibold">July 17, 2025</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Formats</dt>
                <dd className="font-semibold">
                  Kindle · Paperback · Hardcover
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold">About the book</h2>
          <p className="mt-4 text-muted-foreground">
            This is a memoir about a kid named Matt as he reminisces about his
            childhood in Wausau, Wisconsin during the mid-1980s. Matt recalls
            playing basketball, family life, sports, a first crush, and the
            summer before the transition to middle school — a fun, humorous,
            and nostalgic look at the era that defined Generation X.
          </p>
          <p className="mt-4 text-muted-foreground">
            Along the way you&rsquo;ll wander the halls of John Marshall
            Elementary, ride bikes through Wausau&rsquo;s southeast side, and
            flip through old Polaroids of a Wausau from days gone by. Matt
            describes it as &ldquo;kinda like the Wonder Years meets Seinfeld:
            got some nice stuff, takes some jabs at some things.&rdquo;
          </p>
          <p className="mt-4 text-muted-foreground">
            So strap yourself in and get ready for a trip back to 1985–86, when
            things made sense.
          </p>
        </Reveal>

        <Reveal as="figure" className="mt-12">
          <Image
            src="/images/matt-sem.jpg"
            alt="A 1980s snapshot of a group of Wausau kids in a living room, raising cans of Mountain Dew"
            width={1500}
            height={1022}
            className="neon-edge w-full rounded-md"
          />
          <figcaption className="mt-3 text-sm text-muted-foreground">
            The real &rsquo;86 kids — Wausau, Wisconsin, mid-1980s.
          </figcaption>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">
              Pick your format
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {site.book.formats.map((format, index) => (
              <Reveal
                key={format.label}
                delay={(index + 1) as 1 | 2 | 3}
              >
              <Card className="hover-lift h-full text-center">
                <CardContent className="pt-6">
                  <p className="font-display text-lg font-bold">
                    {format.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-primary">
                    {format.price}
                  </p>
                  <Button asChild className="mt-6 w-full" variant="outline">
                    <a
                      href={site.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get it on Amazon
                    </a>
                  </Button>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Prefer to shop local? Find The &rsquo;86 Kids at Janke Book Store,
            the Story Cellar, and Barnes &amp; Noble in Wausau — free
            &rsquo;86 Kids bookmark included with every in-person purchase.
          </p>
        </div>
      </section>
    </>
  );
}
