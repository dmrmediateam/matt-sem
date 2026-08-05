import type { Metadata } from "next";
import { Caveat, Rammetto_One } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

import "./globals.css";

// Display face only — body text stays on the system stack for speed.
// Rammetto One is the closest Google Font to the chunky Cooper Black-style
// lettering on the book cover; it ships a single 400 weight.
const displayFont = Rammetto_One({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

// Handwritten face for polaroid captions only.
const handFont = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: "600",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Matt Sem",
    "The '86 Kids",
    "80s memoir",
    "Wausau Wisconsin author",
    "Generation X childhood book",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#matt-sem`,
      name: "Matt Sem",
      jobTitle: "Author",
      email: `mailto:${site.email}`,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Wausau",
        addressRegion: "WI",
        addressCountry: "US",
      },
    },
    {
      "@type": "Book",
      name: `${site.book.title}: ${site.book.subtitle}`,
      author: { "@id": `${site.url}/#matt-sem` },
      bookFormat: "https://schema.org/Paperback",
      numberOfPages: site.book.pages,
      datePublished: site.book.published,
      inLanguage: "en",
      url: `${site.url}/#book`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: site.book.rating.value,
        ratingCount: site.book.rating.count,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${handFont.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
