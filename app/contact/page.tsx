import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Matt Sem",
  description:
    "Get in touch with Matt Sem, author of The '86 Kids — book clubs, media, events, or just to say hi from a fellow '80s kid.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-display text-xs font-medium tracking-[0.35em] text-accent uppercase">
            Contact
          </p>
          <h1 className="neon-text font-display mt-3 text-4xl font-black">
            Say hello
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Book clubs, local media, event invitations, or memories of your own
            from 1986 — Matt reads everything that comes in.
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
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
