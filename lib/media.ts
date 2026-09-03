/**
 * Media for the "The '86 Kids videos and pictures" section on the home page.
 *
 * Adding media is a data edit, not a layout edit: drop the file in
 * /public/images/gallery (or paste a Vimeo id) and add an entry below. The
 * section renders nothing at all when both arrays are empty, so the page never
 * shows an empty gallery frame while we're waiting on files.
 *
 * PHOTOS
 *   src    - path under /public
 *   alt    - describe what's actually in the shot; this is what screen
 *            readers announce and what shows if the image 404s
 *   width  - the image's REAL pixel dimensions, not the display size. Next's
 *   height   <Image> uses them to reserve space and avoid layout shift, so a
 *            wrong ratio here shows up as a visible jump on load.
 *   caption- optional, one line. Shown in the polaroid's handwriting, so the
 *            scrapbook entries below just reuse what's written on the page.
 *
 * VIDEOS
 *   kind: "vimeo"   - id is the number in the URL
 *         e.g. vimeo.com/1223547009  ->  id: "1223547009"
 *   kind: "youtube" - id is the part after v= in the watch URL
 *   kind: "file"    - src is a path under /public
 *
 * The grid shows a STILL, never an embed, so nothing is requested from Vimeo
 * or Google until someone actually opens a video. Every poster below is a
 * local file for the same reason. Vimeo embeds are player.vimeo.com with
 * `dnt=1` (do not track) and YouTube uses youtube-nocookie.com, which keeps
 * the site out of consent-banner territory.
 *
 * Order is the order they appear in. Videos are shown before photos, and the
 * All/Videos/Pictures filter only appears when both arrays have something in
 * them, so a photos-only gallery doesn't grow a pointless set of tabs.
 */

export type MediaPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/**
 * `ratio` is the shape of the FOOTAGE, used by the lightbox so a 1986 camcorder
 * transfer isn't stretched into widescreen. Grid tiles are always 16:9 and crop
 * to fit; only the player follows this. Defaults to "16/9".
 */
export type MediaRatio = "16/9" | "4/3";

type MediaVideoBase = {
  title: string;
  caption?: string;
  ratio?: MediaRatio;
  /** Still shown in the grid. A local file keeps the page off third-party CDNs. */
  poster?: string;
};

export type MediaVideo =
  | (MediaVideoBase & { kind: "vimeo"; id: string })
  | (MediaVideoBase & { kind: "youtube"; id: string })
  | (MediaVideoBase & { kind: "file"; src: string });

/**
 * The trailers first, then the 1985-86 home video, then Matt out promoting the
 * book. Titles are ours: Vimeo carried only the camera's filenames (IMG_6425,
 * VTS_01_1), which are no use to a reader.
 */
export const mediaVideos: MediaVideo[] = [
  {
    kind: "vimeo",
    id: "1223547009",
    title: "The '86 Kids trailers",
    caption: "1:00",
    ratio: "4/3",
    poster: "/images/gallery/still-1223547009.jpg",
  },
  {
    kind: "vimeo",
    id: "1223547042",
    title: "The class of 1985-86",
    caption: "Home video · 1:18",
    ratio: "4/3",
    poster: "/images/gallery/still-1223547042.jpg",
  },
  {
    kind: "vimeo",
    id: "1223547035",
    title: "Basketball season, 1986",
    caption: "Home video · 1:32",
    ratio: "4/3",
    poster: "/images/gallery/still-1223547035.jpg",
  },
  {
    kind: "vimeo",
    id: "1223547044",
    title: "Game tape",
    caption: "Home video · 7:14",
    ratio: "4/3",
    poster: "/images/gallery/still-1223547044.jpg",
  },
  {
    kind: "vimeo",
    id: "1223547003",
    title: "Matt on the radio",
    caption: "0:17",
    poster: "/images/gallery/still-1223547003.jpg",
  },
  {
    kind: "vimeo",
    id: "1223547005",
    title: "Talking to a gym full of kids",
    caption: "0:19",
    poster: "/images/gallery/still-1223547005.jpg",
  },
];

/**
 * The scrapbook pages run 1974 to 1986 in order, then the book's own life:
 * signings, shelves, the radio station. Captions on the scrapbook entries are
 * transcribed from the handwriting in the photograph, which is why they read
 * the way they do.
 */
export const mediaPhotos: MediaPhoto[] = [
  {
    src: "/images/gallery/cool-when-small-1974.jpg",
    alt: "A scrapbook page holding a 1974 photo of two small boys and a man on a plaid couch, the baby wearing sunglasses",
    width: 1050,
    height: 1400,
    caption: "I was cool even when I was small. 1974",
  },
  {
    src: "/images/gallery/first-synthesizer-1985.jpg",
    alt: "A boy holding up a keyboard synthesizer next to a smiling man sitting on a bed",
    width: 1050,
    height: 1400,
    caption: "My first synthesizer. 1985",
  },
  {
    src: "/images/gallery/talent-show-1985.jpg",
    alt: "Two kids performing on a stage at the end of a school gymnasium, rows of benches empty in front of them",
    width: 1050,
    height: 1400,
    caption: "Talent show… awesome! 1985",
  },
  {
    src: "/images/gallery/favorite-sport-1985.jpg",
    alt: "A boy in a gold Marshall number 21 basketball uniform posing with a ball on the court",
    width: 1050,
    height: 1400,
    caption: "My favorite sport. 1985",
  },
  {
    src: "/images/gallery/baseball-1986.jpg",
    alt: "A novelty baseball card of a boy in a green uniform and white helmet holding a bat",
    width: 1050,
    height: 1400,
    caption: "Baseball. 1986",
  },
  {
    src: "/images/gallery/in-concert-1986.jpg",
    alt: "Two boys with a full drum kit and an electric guitar set up in a wood-panelled room",
    width: 1050,
    height: 1400,
    caption: "In concert! 1986",
  },
  {
    src: "/images/gallery/birthday-cake-1986.jpg",
    alt: "A boy in a red Wisconsin sweatshirt leaning over a birthday cake iced to look like a basketball going through a hoop",
    width: 1050,
    height: 1400,
    caption: "My favorite birthday cake. 1986",
  },
  {
    src: "/images/gallery/signing-copies.jpg",
    alt: "Matt Sem signing a copy of The '86 Kids at a shop counter, stacks of the book in front of him",
    width: 1050,
    height: 1400,
    caption: "Signing a stack",
  },
  {
    src: "/images/gallery/on-the-shelf.jpg",
    alt: "Copies of The '86 Kids standing on a shop table among other local authors' books",
    width: 1400,
    height: 1050,
    caption: "On the table at a local shop",
  },
  {
    src: "/images/gallery/downtown-copy.jpg",
    alt: "Two men standing on a street hung with coloured umbrellas, one holding a copy of The '86 Kids",
    width: 1050,
    height: 1400,
    caption: "Downtown, copy in hand",
  },
  {
    src: "/images/gallery/nrg-media-welcome.jpg",
    alt: "A letter board reading Welcome to NRG Media, Matt Sem, with the book's cover pinned beside the letters",
    width: 1400,
    height: 1049,
    caption: "Welcome to NRG Media",
  },
  {
    src: "/images/gallery/step-into-the-eighties.jpg",
    alt: "Promotional graphic showing three copies of The '86 Kids above the line, step into the carefree and colorful days of life as a kid in the mid-eighties",
    width: 1120,
    height: 1400,
    caption: "Step into the mid-eighties",
  },
];
