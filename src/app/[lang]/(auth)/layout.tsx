import type { ReactNode } from "react";
import { MainContent } from "~/components/MainContent";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <MainContent className="flex min-h-[calc(100svh-140px)] w-full items-center justify-center p-6 md:p-10 lg:min-h-[calc(100svh-80px)]">
      <div className="w-full max-w-md">{children}</div>
    </MainContent>
  );
}
