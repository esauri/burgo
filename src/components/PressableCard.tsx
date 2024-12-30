"use client";

import NextLink, { type LinkProps as InternalLinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { Card } from "./Card";

type ContainerProps = ComponentProps<"article"> & {
  href: string;
};

export function PressableCardContainer({ href, ...props }: ContainerProps) {
  const { push } = useRouter();

  const onPress = (event: MouseEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey) {
      window.open(href, "_blank");
      return;
    }

    push(href);
  };

  return <Card.Container {...props} onClick={onPress} />;
}

type LinkProps = Omit<ComponentProps<"a">, keyof InternalLinkProps> &
  InternalLinkProps;

export function PressableCardLink({ onClick, ...props }: LinkProps) {
  const onPress = (event: MouseEvent<HTMLAnchorElement>) => {
    // Prevent client-side link navigation, let the parent handle it
    event.preventDefault();

    if (onClick) {
      onClick(event);
    }
  };

  return <NextLink onClick={onPress} {...props} />;
}
