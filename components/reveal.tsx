"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Standard scroll-in animation for sections below the fold. Wrap a block in
 * <Reveal> and it fades and rises into place the first time it scrolls into
 * view. `delay` (1–4) staggers siblings; motion is defined once in
 * globals.css and disabled there under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
  as?: "div" | "section" | "li" | "figure";
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // React's ref type narrows per-tag; the union makes one cast necessary.
      ref={ref as React.Ref<never>}
      className={cn(
        "reveal",
        visible && "reveal-visible",
        delay && `anim-delay-${delay}`,
        className
      )}
    >
      {children}
    </Tag>
  );
}
