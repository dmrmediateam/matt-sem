import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Star } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { books, getBook } from "@/lib/books";

/**
 * The product page template. One file serves every book in lib/books.ts;
 * future titles are new catalog entries, not new layouts. Direct-order
 * editions route through the contact page until checkout is wired up.
 */

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const book = getBook((await params).slug);
  if (!book) return {};
  return {
    title: `${book.title}: editions and where to buy`,
    description: `${book.title} by Matt Sem. ${book.subtitle}. Standard, signed, and deluxe editions.`,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const book = getBook((await params).slug);
  if (!book) notFound();

  return (
    <>
      {/* Hero: the cover gets the spotlight against the faded wash. */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the site
          </Link>
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.3fr] md:py-20">
          <div className="anim-rise flex justify-center md:justify-start">
            <div className="anim-float">
              <Image
                src={book.cover.src}
                alt={book.cover.alt}
                width={book.cover.width}
                height={book.cover.height}
                priority
                className="neon-edge w-full max-w-xs rounded-md"
              />
            </div>
          </div>
          <div className="anim-rise anim-delay-1">
            <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
              By Matt Sem
            </p>
            <h1 className="neon-text font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {book.subtitle}
            </p>
            {book.rating ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex text-primary" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </span>
                <span>{book.rating.value} out of 5 from Amazon readers</span>
              </div>
            ) : null}
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {book.description.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Length</dt>
                <dd className="mt-0.5 font-semibold">{book.pages} pages</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Published</dt>
                <dd className="mt-0.5 font-semibold">{book.published}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Editions: white section, deluxe box in the spotlight. */}
      <section className="section-light" aria-label="Editions and pricing">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
              Pick your edition
            </p>
            <h2 className="font-display mt-3 text-3xl">
              Three ways to go back to 1986
            </h2>
          </Reveal>
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
            {book.editions.map((edition, index) => (
              <Reveal key={edition.name} delay={(index + 1) as 1 | 2 | 3}>
                <Card
                  className={
                    edition.featured
                      ? "hover-lift relative h-full border-2 border-accent bg-card shadow-lg"
                      : "hover-lift h-full bg-card"
                  }
                >
                  {edition.badge ? (
                    <span className="font-display absolute -top-3 left-5 rounded-full bg-accent px-3 py-1 text-[0.65rem] tracking-widest text-accent-foreground uppercase">
                      {edition.badge}
                    </span>
                  ) : null}
                  <CardContent className="flex h-full flex-col pt-6">
                    <h3 className="font-display text-lg">{edition.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {edition.tagline}
                    </p>
                    <p className="font-display mt-4 text-4xl text-primary">
                      {edition.price}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                      {edition.includes.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-accent"
                            aria-hidden
                          />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {edition.name === "The book" ? (
                        <div className="grid gap-2">
                          {book.buyLinks.map((link) => (
                            <Button
                              key={link.label}
                              asChild
                              variant="outline"
                              className="w-full"
                            >
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Buy at {link.label}
                              </a>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        // TODO: swap for real checkout once payments exist.
                        <Button
                          asChild
                          className="w-full"
                          variant={edition.featured ? "default" : "outline"}
                        >
                          <Link href="/contact/">Order from Matt</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Signed and &rsquo;80s Edition orders go straight to Matt. Send a
            note through the contact form and he&rsquo;ll email you back to
            sort out payment and delivery. Local readers: Janke Book Store
            and the Story Cellar in Wausau carry the book, bookmark
            included.
          </p>
        </div>
      </section>

      {/* Room for the shelf to grow. */}
      <section aria-label="More books coming">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl">More books on the way</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Catch and Release, Glimpses, and Monsters Among Us are all in
                the works. They&rsquo;ll land on this shelf as they arrive.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/#next">See what&rsquo;s next</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
