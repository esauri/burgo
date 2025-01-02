"use client";

// import { NavigationLink } from "~/components/NavigationLink";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
  prefetch: boolean;
};

export function Tab({ children, href, prefetch }: Props) {
  const pathname = usePathname();
  const isSelected = pathname === href;

  return (
    <Link
      aria-selected={isSelected}
      className="aria-selected:border-t-primary focus-visible:ring-muted border-t-4 border-t-transparent p-4 transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none"
      href={href}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
