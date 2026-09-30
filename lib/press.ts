/**
 * Press coverage for the "In the news" section on the home page.
 *
 * Newest first. Adding a story is one entry here; the section renders
 * nothing when the list is empty.
 *
 * `headline` is copied exactly as the outlet ran it: set next to the
 * outlet's name, a reworded headline reads as a misquote. `summary` is ours,
 * and says only what the story itself says.
 */

export type PressItem = {
  outlet: string;
  headline: string;
  summary: string;
  author: string;
  /** ISO date, for the <time> element. */
  date: string;
  /** The date as a reader sees it on the outlet's own page. */
  dateLabel: string;
  url: string;
};

export const press: PressItem[] = [
  {
    outlet: "WSAW NewsChannel 7",
    headline: "Wausau native honors upbringing with debut book",
    summary:
      "The Wausau tennis pro who never planned to write a book, and the '80s childhood he wrote about anyway.",
    author: "Brianna Weaver",
    // WSAW stamps it 2025-08-14T00:01Z, which is the evening of the 13th in
    // Wausau. The 14th in the URL is the UTC date; readers see the 13th.
    date: "2025-08-13",
    dateLabel: "August 13, 2025",
    url: "https://www.wsaw.com/2025/08/14/wausau-native-honors-upbringing-with-debut-book/",
  },
  {
    outlet: "The City Pages",
    headline: "Back in time",
    summary:
      "Local author transports readers back to '86: a year of growing up in Wausau, told in funny stories and old polaroids.",
    author: "Kana Coonce",
    date: "2025-08-08",
    dateLabel: "August 8, 2025",
    url: "https://thecitypages.com/stories/86-kids,284704",
  },
];
