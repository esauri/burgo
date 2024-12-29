import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function MainContent({ children }: Props) {
  return <main className="container flex flex-col gap-3 py-6">{children}</main>;
}
