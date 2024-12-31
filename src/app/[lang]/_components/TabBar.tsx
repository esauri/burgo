import { Trans } from "@lingui/react/macro";
import Image from "next/image";
import type { ReactNode } from "react";
import { Language } from "~/types/Language";
import { Tab } from "./Tab";

type Props = {
  lang: Language;
  sideContent: ReactNode;
};

export function TabBar({ lang, sideContent }: Props) {
  return (
    <nav className="bg-card text-card-foreground fixed bottom-0 w-full pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="container flex items-center justify-center gap-6">
        <Tab href={`/${lang}`}>
          <span className="sr-only">
            <Trans>Go to Home</Trans>
          </span>
          <Image
            alt="Logo"
            className="size-6 active:scale-90"
            height={24}
            src="/assets/icons/icon.svg"
            width={24}
          />
        </Tab>
        {sideContent}
      </div>
    </nav>
  );
}
