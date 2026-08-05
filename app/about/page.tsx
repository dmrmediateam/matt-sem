import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Matt Sem — Wausau, Wisconsin author",
  description:
    "Matt Sem is a Wausau, Wisconsin native, longtime tennis teaching professional, and author of The '86 Kids, with more books on the way.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="font-display text-xs font-medium tracking-[0.35em] text-accent uppercase">
            About the author
          </p>
          <h1 className="neon-text font-display mt-3 text-4xl font-black sm:text-5xl">
            Matt Sem
          </h1>
          <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-muted-foreground">
              <p>
                Matt Sem is a Wausau, Wisconsin native and a Certified PTR
                Tennis Teaching Professional with more than 25 years of
                experience on the court. He holds a Bachelor&rsquo;s degree
                from Spring Arbor University and still calls Wausau home —
                the same town whose 1980s streets, schools, and characters
                fill the pages of his first book.
              </p>
              <p>
                The &rsquo;86 Kids started as something Matt wrote for the
                enjoyment of family and friends. With &rsquo;80s nostalgia
                everywhere, the people around him kept saying the same thing:
                publish it. So he did — teaming up with a Chicago
                self-publishing company to edit, print, and launch his debut
                memoir in 2025. In his words, it&rsquo;s been &ldquo;a
                whirlwind.&rdquo;
              </p>
              <p>
                The book covers his own favorite period of his life, and
                sharing it is the point: &ldquo;It&rsquo;s a great feeling to
                have somebody else you know read it and then say that they
                like it. Hopefully someone else can read that book and love
                those times and the &rsquo;80s.&rdquo;
              </p>
            </div>
            <div className="grid gap-6">
              <Image
                src="/images/matt-sem-author.jpg"
                alt="Matt Sem, author of The '86 Kids"
                width={960}
                height={960}
                className="neon-edge w-full max-w-sm rounded-md"
                priority
              />
              <Card className="h-fit bg-card/70">
              <CardContent className="pt-6 text-sm">
                <p className="font-display text-xs font-medium tracking-[0.3em] text-accent uppercase">
                  Quick facts
                </p>
                <ul className="mt-4 grid gap-2 text-muted-foreground">
                  <li>Hometown: Wausau, Wisconsin</li>
                  <li>Alma mater: Spring Arbor University</li>
                  <li>Day job: PTR tennis pro, 25+ years</li>
                  <li>Debut book: The &rsquo;86 Kids (2025)</li>
                  <li>Grade school: John Marshall Elementary</li>
                </ul>
              </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">
          What&rsquo;s coming next
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The &rsquo;86 Kids won&rsquo;t be Matt&rsquo;s last book. Here&rsquo;s
          what&rsquo;s on the workbench.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="font-display text-lg font-bold">
                Catch and Release
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                A fictionalized memoir that mixes real events from Matt&rsquo;s
                life with imaginary ones. In progress.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="font-display text-lg font-bold">Glimpses</p>
              <p className="mt-3 text-sm text-muted-foreground">
                An honest account of Matt&rsquo;s recovery from benzodiazepine
                addiction — written not just for himself, but for people who
                are struggling. In progress.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="font-display text-lg font-bold">
                Monsters Among Us
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                A completed collection of true-story vignettes about how nobody
                is flawless — and how we all do something out of character
                sometimes.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/contact/">Get in touch with Matt</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
