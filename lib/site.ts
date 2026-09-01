/** Single source of truth for site-wide facts, so copy edits happen in one place. */
export const site = {
  name: "Matt Sem",
  title: "Matt Sem | Author of The '86 Kids",
  description:
    "Official site of Wausau, Wisconsin author Matt Sem, home of The '86 Kids: a funny, nostalgic memoir of growing up in the 1980s.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mattsembooks.com",
  email: "semmatttennis1@gmail.com",
  location: "Wausau, Wisconsin",
  amazonUrl:
    "https://www.amazon.com/86-Kids-sometimes-humorous-Childhood-ebook/dp/B0FJ23N722",
  // Direct B&N product page. The previous value was a /s/ search URL that
  // returned a 404, which is the "link doesn't work" the client reported.
  // ISBN 9798899725128. Paperback $19.99, hardcover $27.99, eBook $9.99.
  barnesNobleUrl:
    "https://www.barnesandnoble.com/w/the-86-kids-matt-sem/1147922971",
  book: {
    title: "The '86 Kids",
    subtitle:
      "A memoir of an awesome and sometimes humorous childhood in the '80s",
    pages: 467,
    published: "2025-07-17",
    formats: [
      { label: "Kindle", price: "$9.99" },
      { label: "Paperback", price: "$19.99" },
      { label: "Hardcover", price: "$27.99" },
    ],
    rating: { value: 4.8, count: 8 },
  },
} as const;
