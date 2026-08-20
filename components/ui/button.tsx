import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shape, type and motion live in the .btn-kl classes in app/globals.css.
 *
 * Never hardcode a color here. Those classes read the palette tokens
 * (--primary, --accent, --foreground, ...) directly on the button element, so
 * a button re-resolves its own colors when it renders inside .section-light.
 * Baking a value in here - or routing one through a :root-level --btn-*
 * property - freezes it to the dark theme and breaks the light sections.
 */
const buttonVariants = cva(
  "btn-kl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "btn-kl-primary",
        destructive: "btn-kl-destructive",
        outline: "btn-kl-quiet",
        secondary: "btn-kl-accent",
        ghost: "btn-kl-bare",
        link: "btn-kl-bare underline underline-offset-4",
      },
      size: {
        default: "btn-kl-md",
        sm: "btn-kl-sm",
        lg: "btn-kl-lg",
        icon: "btn-kl-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
