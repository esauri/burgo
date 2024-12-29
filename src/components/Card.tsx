import type { ComponentProps } from "react";
import { cn } from "~/helpers/cn";
import { Text } from "./Text";

function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
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

export const Card = {
  Container,
  Content,
  Description,
  Footer,
  Header,
  Title,
};
