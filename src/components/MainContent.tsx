import type { ReactNode } from "react";
import { cn } from "~/helpers/cn";

type Props = {
  className?: string;
  children: ReactNode;
};

export function MainContent({ children, className }: Props) {
  return (
    <main
      className={cn(["container flex flex-col gap-3 py-6", className])}
      id="main-content"
    >
      {children}
    </main>
  );
}
