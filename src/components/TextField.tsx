import type { ComponentProps } from "react";
import { cn } from "~/helpers/cn";

export function TextField({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "focus-visible:ring-muted bg-background text-foreground flex-1 appearance-none overflow-hidden rounded-lg py-3 pr-4 pl-4 focus-visible:ring focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
