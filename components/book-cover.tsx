import Image from "next/image";

import { cn } from "@/lib/utils";

export function BookCover({ className }: { className?: string }) {
  return (
    <Image
      src="/images/86-kids-cover.jpg"
      alt="Cover of The '86 Kids by Matt Sem — a boy holding a tennis racket on a blue-toned court"
      width={625}
      height={1000}
      priority
      className={cn(
        "neon-edge w-full max-w-xs rounded-md",
        className
      )}
    />
  );
}
