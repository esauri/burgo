import { Trans } from "@lingui/react/macro";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { Language } from "~/types/Language";
import { TabButton } from "./TabButton";

type Props = {
  lang: Language;
};

export function TabBar({ lang }: Props) {
  return (
    <nav className="bg-card text-card-foreground fixed bottom-0 w-full pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="container flex items-center justify-center gap-6">
        <TabButton href={`/${lang}`}>
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
        </TabButton>
        <TabButton href="#0">
          <span className="sr-only">
            <Trans>Go to Cart</Trans>
          </span>
          <ShoppingCartIcon className="size-6 active:scale-90" />
        </TabButton>
      </div>
    </nav>
  );
}
