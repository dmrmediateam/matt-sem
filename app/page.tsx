import Link from "next/link";
import { Star } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="retro-grid absolute inset-x-0 bottom-0 h-72" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <p className="font-display text-xs font-medium tracking-[0.35em] text-accent uppercase">
              Strap yourself in — it&rsquo;s 1986
            </p>
            <h1 className="neon-text font-display mt-4 text-4xl leading-tight font-black sm:text-5xl lg:text-6xl">
              The &rsquo;86 Kids
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              A funny, big-hearted memoir of growing up in Wausau, Wisconsin in
              the mid-1980s — bikes, basketball, nicknames, first crushes, and
              the last summer before middle school. Think{" "}
              <em>The Wonder Years</em> meets <em>Seinfeld</em>.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a
                  href={site.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on Amazon
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/book/">About the book</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex text-primary" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span>
                Rated {site.book.rating.value} out of 5 by Amazon readers
              </span>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <BookCover />
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-center sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-display text-2xl font-bold text-primary">467</p>
            <p className="mt-1 text-sm text-muted-foreground">
              pages of pure &rsquo;80s nostalgia
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-primary">
              {site.book.rating.value}★
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              average Amazon reader rating
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-primary">3</p>
            <p className="mt-1 text-sm text-muted-foreground">
              formats — Kindle, paperback, hardcover
            </p>
          </div>
        </div>
      </section>

      {/* About the book */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold">
            A trip back to when things made sense
          </h2>
          <p className="mt-4 text-muted-foreground">
            The &rsquo;86 Kids follows a year in young Matt&rsquo;s life on
            Wausau&rsquo;s southeast side — school days at John Marshall
            Elementary, pickup basketball, family life, sports, a first crush,
            and the summer before everything changed with the move to middle
            school. It&rsquo;s told with humor, old Polaroid photos, and a deep
            affection for the era that defined Generation X.
          </p>
          <p className="mt-4 text-muted-foreground">
            If you grew up in the &rsquo;80s — or just wish you had — this one
            is for you.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/book/">Read more about The &rsquo;86 Kids</Link>
          </Button>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold">
            What readers are saying
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="neon-edge border-transparent">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  &ldquo;A book that feels like home&hellip; captures the
                  sights, smells, and characters of growing up during the
                  magical mid-80s. A must-read for anybody who wants to relive
                  the simpler times of bikes, basketball, nicknames, family,
                  and youthful relationships.&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold">
                  Scott S. — Amazon review
                </p>
              </CardContent>
            </Card>
            <Card className="neon-edge border-transparent">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  &ldquo;It&rsquo;s like a time machine that takes you back to
                  a magical era&hellip; From the very first page, you&rsquo;ll
                  be laughing out loud.&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold">
                  Sylvia — Amazon review
                </p>
              </CardContent>
            </Card>
            <Card className="neon-edge border-transparent">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  &ldquo;A light-hearted and pleasurable read about childhood,
                  friendship, memories, and life&hellip; will likely trigger
                  memories of your own childhood and bring a smile (or two) to
                  your face.&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold">
                  Cedric — Amazon review
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About the author preview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Meet Matt Sem</h2>
            <p className="mt-4 text-muted-foreground">
              Matt is a Wausau native and a certified PTR tennis teaching
              professional with more than 25 years on the court. The &rsquo;86
              Kids is his first book — written for family and friends, and
              published after the wave of &rsquo;80s nostalgia convinced him
              other people would love those times too. Two more books are
              already in the works.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/about/">More about Matt</Link>
            </Button>
          </div>
          <Card className="bg-card/70">
            <CardContent className="pt-6">
              <p className="font-display text-xs font-medium tracking-[0.3em] text-accent uppercase">
                Coming next
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">
                    Catch and Release
                  </span>{" "}
                  — a fictionalized memoir mixing real events with imagined
                  ones.
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    Glimpses
                  </span>{" "}
                  — an honest account of recovery, written for anyone
                  struggling.
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    Monsters Among Us
                  </span>{" "}
                  — a completed collection of true-story vignettes.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Where to buy + CTA */}
      <section className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">
                Where to get your copy
              </h2>
              <p className="mt-4 text-muted-foreground">
                The &rsquo;86 Kids is available online and at bookstores around
                Wausau — and every local purchase comes with a free &rsquo;86
                Kids bookmark.
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
                    — Kindle {site.book.formats[0].price}, paperback{" "}
                    {site.book.formats[1].price}, hardcover{" "}
                    {site.book.formats[2].price}
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Janke Book Store</span>{" "}
                  <span className="text-muted-foreground">— Wausau, WI</span>
                </li>
                <li>
                  <span className="font-semibold">The Story Cellar</span>{" "}
                  <span className="text-muted-foreground">— Wausau, WI</span>
                </li>
                <li>
                  <span className="font-semibold">Barnes &amp; Noble</span>{" "}
                  <span className="text-muted-foreground">— Wausau, WI</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-center">
              <h3 className="font-display text-xl font-bold">
                Say hi to Matt
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                Book clubs, local media, fellow &rsquo;86 kids — Matt would
                love to hear from you.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/contact/">Get in touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
