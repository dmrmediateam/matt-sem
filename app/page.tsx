import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { ContactSection } from "@/components/contact-section";
import { MediaGallery } from "@/components/media-gallery";
import { RetroWave } from "@/components/retro-figures";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { upcoming } from "@/lib/books";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero - the book IS the site, so it gets the whole opening frame. */}
      <section id="book" aria-label="The '86 Kids" className="relative overflow-hidden">
        <RetroWave className="h-72" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <p className="anim-rise font-display text-xs tracking-[0.3em] text-accent uppercase">
              Strap yourself in. It&rsquo;s 1986
            </p>
            <h1 className="neon-text neon-pulse anim-rise anim-delay-1 font-display mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              The &rsquo;86 Kids
            </h1>

            {/* The promise, given its own line at reading size. The title
                names the book; this is the line that has to make someone
                want it. */}
            <p className="anim-rise anim-delay-2 mt-6 max-w-xl text-xl leading-snug sm:text-2xl">
              The last summer before everything changed.
            </p>

            <p className="anim-rise anim-delay-2 mt-4 max-w-lg leading-relaxed text-muted-foreground">
              Bikes, basketball, nicknames and first crushes in Wausau,
              Wisconsin. Think <em>The Wonder Years</em> meets{" "}
              <em>Seinfeld</em>.
            </p>

            {/* One dominant action. Two equal buy buttons split the decision,
                so Barnes & Noble is a text link now rather than a second
                button competing with the first. */}
            <div className="anim-rise anim-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild size="lg">
                <a
                  href={site.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on Amazon
                </a>
              </Button>
              <a
                href={site.barnesNobleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
              >
                or Barnes &amp; Noble
              </a>
            </div>

            {/* Proof stays above the fold — it's the strongest thing the page
                owns, and it's doing more work than the scroll prompt that
                used to sit here. */}
            <div className="anim-rise anim-delay-4 mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span className="flex text-primary" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span>
                {site.book.rating.value} out of 5 from Amazon readers
              </span>
              <span aria-hidden className="text-border">|</span>
              <span>{site.book.pages} pages</span>
            </div>
          </div>
          <div className="anim-rise anim-delay-2 flex justify-center md:justify-end">
            <div className="anim-float">
              <BookCover />
            </div>
          </div>
        </div>
      </section>

      {/* The story - book copy and the polaroid that proves it all happened. */}
      <section
        id="story"
        aria-label="About the book"
        className="section-light border-y border-border/60"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
              The story
            </p>
            <h2 className="font-display mt-3 text-3xl">
              A trip back to when things made sense
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                One year in young Matt&rsquo;s life on Wausau&rsquo;s southeast
                side: school days at John Marshall Elementary, pickup
                basketball, family life, a first crush, and the summer before
                everything changed with the move to middle school.
              </p>
              <p>
                It&rsquo;s told with humor, old polaroids, and a deep affection
                for the era that defined Generation X. {site.book.pages} pages,
                and every one of them actually happened. Mostly.
              </p>
            </div>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Length</dt>
                <dd className="mt-0.5 font-semibold">
                  {site.book.pages} pages
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Published</dt>
                <dd className="mt-0.5 font-semibold">July 2025</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Formats</dt>
                <dd className="mt-0.5 font-semibold">
                  Kindle · Paperback · Hardcover
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={2} className="justify-self-center md:justify-self-end">
            <figure className="polaroid polaroid-tilt-right max-w-md rounded-sm">
              <Image
                src="/images/matt-sem.jpg"
                alt="A 1980s snapshot of a group of Wausau kids in a living room, raising cans of Mountain Dew"
                width={1500}
                height={1022}
              />
              <figcaption className="polaroid-caption">
                The real &rsquo;86 kids, Wausau, mid-1980s
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Reviews - real Amazon words, lightly trimmed, named. */}
      <section aria-label="Reader reviews" className="section-light">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
            From the back row
          </p>
          <h2 className="font-display mt-3 text-3xl">
            What readers are saying
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "A book that feels like home… captures the sights, smells, and characters of growing up during the magical mid-80s. A must-read for anybody who wants to relive the simpler times of bikes, basketball, nicknames, family, and youthful relationships.",
              name: "Scott S.",
              delay: 1 as const,
            },
            {
              quote:
                "It's like a time machine that takes you back to a magical era… From the very first page, you'll be laughing out loud.",
              name: "Sylvia",
              delay: 2 as const,
            },
            {
              quote:
                "A light-hearted and pleasurable read about childhood, friendship, memories, and life… will likely trigger memories of your own childhood and bring a smile (or two) to your face.",
              name: "Cedric",
              delay: 3 as const,
            },
          ].map((review) => (
            <Reveal key={review.name} delay={review.delay}>
              <Card className="hover-lift h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <p className="quote-serif flex-1 text-xl leading-relaxed italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <footer className="mt-6">
                    <span className="font-display text-xs tracking-[0.2em] text-accent uppercase">
                      {review.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Amazon review
                    </span>
                  </footer>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* The '80s Edition promo: the deluxe box gets its own moment. */}
      <section aria-label="The '80s Edition deluxe box">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border-2 border-accent/50 bg-gradient-to-br from-card via-background to-card px-6 py-12 sm:px-12">
              <div className="max-w-2xl">
                <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
                  Deluxe box
                </p>
                <h2 className="font-display mt-3 text-3xl">
                  The &rsquo;80s Edition
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Like the deluxe cassette with the bonus tracks: an
                  autographed copy of The &rsquo;86 Kids plus a collector&rsquo;s
                  bookmark matching the cover art, boxed and shipped from
                  Wausau. $30, straight from Matt.
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/books/the-86-kids/">
                      See editions &amp; pricing
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About Matt - one section, face first. */}
      <section
        id="matt"
        aria-label="About Matt Sem"
        className="border-y border-border/60 bg-card/50"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <Reveal className="order-2 justify-self-center md:order-1 md:justify-self-start">
            <figure className="polaroid polaroid-tilt-left max-w-xs rounded-sm">
              <Image
                src="/images/matt-sem-author.jpg"
                alt="Matt Sem, author of The '86 Kids"
                width={960}
                height={960}
              />
              <figcaption className="polaroid-caption">
                Matt, a few decades past 1986
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={1} className="order-1 md:order-2">
            <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
              About the author
            </p>
            <h2 className="font-display mt-3 text-3xl">Meet Matt Sem</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Matt is a Wausau native and a certified PTR tennis teaching
                professional with more than 25 years on the court. The
                &rsquo;86 Kids is his first book, written for family and
                friends, published after everyone kept telling him the same
                thing: other people miss those times too.
              </p>
              <p>
                He still lives in Wausau, the same town whose 1980s streets,
                schools, and characters fill the book. In his words, sharing it
                is the point: &ldquo;It&rsquo;s a great feeling to have
                somebody else you know read it and then say that they like
                it.&rdquo;
              </p>
            </div>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/#contact">Say hello to Matt</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* What's next - future books, deliberately their own thing. */}
      <section id="next" aria-label="Upcoming books" className="section-light border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
            On the workbench
          </p>
          <h2 className="font-display mt-3 text-3xl">
            The &rsquo;86 Kids won&rsquo;t be the last
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {upcoming.map((book, i) => (
            <Reveal key={book.title} delay={(i + 1) as 1 | 2 | 3}>
              <Card className="hover-lift h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <h3 className="font-display text-lg">{book.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                    {book.blurb}
                  </p>
                  <p className="mt-4 text-xs tracking-widest text-accent uppercase">
                    {book.status}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* Videos and pictures. Renders only when lib/media.ts has entries. */}
      <MediaGallery />

      {/* Where to buy. */}
      <section aria-label="Where to buy">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl">Where to get your copy</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Online at Amazon or Barnes &amp; Noble, or in person at two
              Wausau bookstores, and every local purchase comes with a free
              &rsquo;86 Kids bookmark.
            </p>
            <ul className="mt-6 grid gap-3 text-sm">
              <li>
                <a
                  href={site.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Amazon
                </a>{" "}
                <span className="text-muted-foreground">
                  · Kindle {site.book.formats[0].price}, paperback{" "}
                  {site.book.formats[1].price}, hardcover{" "}
                  {site.book.formats[2].price}
                </span>
              </li>
              <li>
                <a
                  href={site.barnesNobleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Barnes &amp; Noble
                </a>{" "}
                <span className="text-muted-foreground">
                  · paperback {site.book.formats[1].price}, hardcover{" "}
                  {site.book.formats[2].price}
                </span>
              </li>
              <li>
                <span className="font-semibold">Janke Book Store</span>{" "}
                <span className="text-muted-foreground">· Wausau, WI</span>
              </li>
              <li>
                <span className="font-semibold">The Story Cellar</span>{" "}
                <span className="text-muted-foreground">· Wausau, WI</span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={2} className="flex flex-col items-start justify-center">
            <h2 className="font-display text-2xl">Signed by Matt</h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              He signs and mails copies himself from Wausau, with a personal
              message if you want one. The &rsquo;80s Edition adds the
              bookmark and the tote bag.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/books/the-86-kids/">See the editions</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Contact closes the page. This used to be its own /contact/ route. */}
      <ContactSection />
    </>
  );
}
