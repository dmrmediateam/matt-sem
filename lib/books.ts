import { site } from "@/lib/site";

/**
 * The book catalog. Every book gets a product page at /books/<slug>; adding
 * a future title is one new entry here, no new layout work. Editions render
 * as pricing cards on the product page, with `featured` getting the
 * spotlight treatment.
 */

export type Edition = {
  name: string;
  price: string;
  tagline: string;
  includes: string[];
  featured?: boolean;
  badge?: string;
};

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  cover: { src: string; alt: string; width: number; height: number };
  pages: number;
  published: string;
  rating?: { value: number; count: number };
  description: string[];
  buyLinks: { label: string; href: string }[];
  editions: Edition[];
};

export const books: Book[] = [
  {
    slug: "the-86-kids",
    title: "The '86 Kids",
    subtitle:
      "A memoir of an awesome and sometimes humorous childhood in the '80s",
    cover: {
      src: "/images/86-kids-cover.jpg",
      alt: "Cover of The '86 Kids by Matt Sem, showing a boy holding a tennis racket on a blue-toned court",
      width: 625,
      height: 1000,
    },
    pages: 467,
    published: "July 2025",
    rating: { value: 4.8, count: 8 },
    description: [
      "One year in young Matt's life on Wausau's southeast side: school days at John Marshall Elementary, pickup basketball, family life, a first crush, and the summer before everything changed with the move to middle school.",
      "Told with humor, old polaroids, and a deep affection for the era that defined Generation X. Think The Wonder Years meets Seinfeld.",
    ],
    buyLinks: [
      { label: "Amazon", href: site.amazonUrl },
      { label: "Barnes & Noble", href: site.barnesNobleUrl },
    ],
    editions: [
      {
        name: "The book",
        price: "$19.99",
        tagline: "Paperback, wherever books are sold",
        includes: [
          "467 pages of 1985-86",
          "Also on Kindle ($9.99) and hardcover ($27.99)",
          "Ships from Amazon or Barnes & Noble",
        ],
      },
      {
        name: "Signed copy",
        price: "$25",
        tagline: "Autographed by Matt, direct from Wausau",
        includes: [
          "Paperback signed by Matt Sem",
          "Ordered directly through the site",
          "A note if you want one. Just ask.",
        ],
      },
      {
        name: "The '80s Edition",
        price: "$30",
        tagline: "The deluxe box. Bonus tracks included.",
        badge: "Deluxe",
        featured: true,
        includes: [
          "Autographed copy of The '86 Kids",
          "Collector's bookmark matching the cover art",
          "Boxed like a deluxe cassette reissue",
        ],
      },
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
