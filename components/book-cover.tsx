import { cn } from "@/lib/utils";

/**
 * Typographic stand-in for the real cover art.
 * TODO: replace with the actual book cover image (client to supply the file),
 * then swap this component for a next/image with a proper alt text.
 */
export function BookCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "neon-edge relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-md bg-linear-to-b from-[oklch(0.22_0.06_270)] via-[oklch(0.19_0.05_265)] to-[oklch(0.3_0.09_310)]",
        className
      )}
      role="img"
      aria-label="The '86 Kids book cover"
    >
      {/* Retro sun */}
      <div className="absolute top-[16%] left-1/2 size-28 -translate-x-1/2 rounded-full bg-linear-to-b from-[oklch(0.85_0.12_85)] to-[oklch(0.68_0.22_340)] opacity-90" />
      {/* Horizon grid */}
      <div className="retro-grid absolute inset-x-0 bottom-0 h-1/2" />

      <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center">
        <p className="font-display text-[0.6rem] font-medium tracking-[0.35em] text-primary uppercase">
          A memoir
        </p>
        <div className="mt-14">
          <p className="chrome-text font-display text-4xl leading-tight font-black tracking-wide">
            THE
            <br />
            &rsquo;86
            <br />
            KIDS
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] leading-snug text-foreground/80">
            An awesome and sometimes humorous childhood in the &rsquo;80s
          </p>
          <p className="font-display mt-3 text-xs font-bold tracking-[0.3em] uppercase">
            Matt Sem
          </p>
        </div>
      </div>
    </div>
  );
}
