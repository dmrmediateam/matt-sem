import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { press } from "@/lib/press";

/**
 * "In the news" — press coverage, from lib/press.ts.
 *
 * Each card is one link, stretched: the headline is the anchor, and its
 * ::after covers the card, so the whole card is clickable while a screen
 * reader announces just the headline rather than every line on the card.
 *
 * Returns null with no coverage, so an empty section never ships.
 */
export function PressSection() {
  if (press.length === 0) return null;

  return (
    <section id="press" aria-label="In the news">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">
            Extra, extra
          </p>
          <h2 className="font-display mt-3 text-3xl">In the news</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {press.map((item, i) => (
            <Reveal key={item.url} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Card className="hover-lift relative h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <p className="font-display text-xs tracking-[0.2em] text-accent uppercase">
                    {item.outlet}
                  </p>
                  <h3 className="font-display mt-3 text-xl leading-snug">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
                    >
                      {item.headline}
                    </a>
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span>
                      By {item.author} ·{" "}
                      <time dateTime={item.date}>{item.dateLabel}</time>
                    </span>
                    <span
                      className="inline-flex items-center gap-1 font-semibold text-primary"
                      aria-hidden="true"
                    >
                      Read the story
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
