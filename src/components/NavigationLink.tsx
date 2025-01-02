"use client";

import Link, { type LinkProps as InternalLinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<"a">, keyof InternalLinkProps> &
  InternalLinkProps;

export function NavigationLink({ href, onClick, ...props }: Props) {
  const { push } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }

    event.preventDefault();

    push(href.toString());
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
