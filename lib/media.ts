/**
 * Media for the "The '86 Kids videos and pictures" section on the home page.
 *
 * Adding media is a data edit, not a layout edit: drop the file in
 * /public/images (or /public/video) and add an entry below. The section
 * renders nothing at all when both arrays are empty, so the page never shows
 * an empty gallery frame while we're waiting on files.
 *
 * PHOTOS
 *   src    - path under /public
 *   alt    - describe what's actually in the shot; this is what screen
 *            readers announce and what shows if the image 404s
 *   width  - the image's REAL pixel dimensions, not the display size. Next's
 *   height   <Image> uses them to reserve space and avoid layout shift, so a
 *            wrong ratio here shows up as a visible jump on load.
 *   caption- optional, one line
 *
 * VIDEOS
 *   kind: "youtube" - id is the part after v= in the watch URL
 *         e.g. youtube.com/watch?v=dQw4w9WgXcQ  ->  id: "dQw4w9WgXcQ"
 *   kind: "file"    - src is a path under /public, poster is a still frame
 *
 * YouTube embeds use youtube-nocookie.com so no tracking cookie is set until
 * the visitor actually presses play. That keeps the site out of consent-banner
 * territory, which is worth preserving if more videos get added later.
 */

export type MediaPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type MediaVideo =
  | { kind: "youtube"; id: string; title: string; caption?: string }
  | { kind: "file"; src: string; poster?: string; title: string; caption?: string };

/**
 * WAITING ON MATT. He owes us the video files/links and the photo set
 * (book signings, the tote bag, event shots, 1986 polaroids). Until entries
 * land here the whole section stays hidden — see MediaGallery.
 *
 * Example of the shape, for whoever adds them:
 *
 *   export const mediaPhotos: MediaPhoto[] = [
 *     {
 *       src: "/images/signing-janke.jpg",
 *       alt: "Matt signing copies at Janke Book Store",
 *       width: 1600,
 *       height: 1067,
 *       caption: "Launch day at Janke, July 2025",
 *     },
 *   ];
 *
 *   export const mediaVideos: MediaVideo[] = [
 *     { kind: "youtube", id: "XXXXXXXXXXX", title: "The '86 Kids book trailer" },
 *   ];
 */
export const mediaPhotos: MediaPhoto[] = [];

export const mediaVideos: MediaVideo[] = [];
