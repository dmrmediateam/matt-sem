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
          "Paperback signed with a personal message from Matt Sem",
          "Ordered by email, direct from Matt in Wausau",
          "Tell him who it's for and he'll write to them",
        ],
      },
      {
        name: "The '80s Edition",
        price: "$30",
        tagline: "The full set. Bonus tracks included.",
        badge: "Deluxe",
        featured: true,
        includes: [
          "Autographed with a personal message from Matt Sem",
          "Collector's bookmark matching the cover art",
          "Back to the '80s tote bag included",
        ],
      },
    ],
  },
];

/**
 * Titles in the works. These have no pages yet, so they are a separate list
 * from `books` rather than entries with empty fields. The "What's next"
 * section on the home page is the only thing that reads this: the Books
 * dropdown lists `books` alone, so it never offers a title you can't open.
 */
export type UpcomingBook = {
  title: string;
  blurb: string;
  status: string;
};

export const upcoming: UpcomingBook[] = [
  {
    title: "Catch and Release",
    blurb:
      "A fictionalized memoir that mixes real events from Matt's life with imagined ones.",
    status: "In progress",
  },
  {
    title: "Glimpses",
    blurb:
      "An honest account of recovery, written not just for Matt, but for anyone who's struggling.",
    status: "In progress",
  },
  {
    title: "Monsters Among Us",
    blurb:
      "True-story vignettes about how nobody's flawless, and how we all surprise ourselves sometimes.",
    status: "Finished, resting",
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
