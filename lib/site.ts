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
  // TODO: replace with the direct product URL once the client sends it
  // (Tony has asked Matt for the link). Search results page until then.
  barnesNobleUrl:
    "https://www.barnesandnoble.com/s/the%2086%20kids%20matt%20sem",
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
