import { Image } from "@unpic/react";
import type { ComponentProps } from "react";
import { cn } from "~/helpers/cn";
import { Text } from "./Text";

function Container({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn([
        "border-border bg-card text-card-foreground rounded-xl border",
        className,
      ])}
      {...props}
    />
  );
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn([
        "flex flex-col gap-3 px-4 pt-4 md:px-6 md:pt-6",
        className,
      ])}
      {...props}
    />
  );
}

function Title(props: ComponentProps<"h3">) {
  return <Text {...props} variant="title-sm" />;
}

function Description(props: ComponentProps<"p">) {
  return <Text {...props} variant="body" />;
}

function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(["flex flex-col gap-2 p-4 md:p-6", className])}
      {...props}
    />
  );
}

function Footer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(["flex items-center px-4 pb-4 md:px-6 md:pb-6", className])}
      {...props}
    />
  );
}

type ThumbnailProps = {
  alt: string;
  className: string;
  src: string;
  priority: boolean;
};

function Thumbnail({ alt, ...props }: ThumbnailProps) {
  return (
    <figure className="overflow-hidden rounded-t-xl">
      <Image
        alt={alt}
        breakpoints={[256, 304, 320, 327, 354, 382, 592]}
        height={240}
        layout="fullWidth"
        {...props}
      />
    </figure>
  );
}

export const Card = {
  Container,
  Content,
  Description,
  Footer,
  Header,
  Title,
  Thumbnail,
};
