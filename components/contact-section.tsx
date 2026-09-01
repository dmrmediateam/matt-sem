import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

/**
 * Closing section of the home page. This was its own /contact/ route; folding
 * it into the bottom of the single page means a reader who has just finished
 * the pitch can write to Matt without a navigation step.
 *
 * The old page's h1 became an h2 here — the home page already has one h1 (the
 * book title), and a second would break the document outline.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact Matt"
      className="border-t border-border/60"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.2fr] md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl">
            Were you an &rsquo;86 kid too?
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Book clubs, local media, event invitations, or memories of your own
            from 1986. Matt reads everything that comes in. Ordering a signed
            copy or the &rsquo;80s Edition? Say so here and he&rsquo;ll email
            you back to sort out payment.
          </p>
          <ul className="mt-8 grid gap-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-primary" aria-hidden />
              <a
                href={`mailto:${site.email}`}
                className="hover:text-primary hover:underline"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-primary" aria-hidden />
              <span>{site.location}</span>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={2}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
