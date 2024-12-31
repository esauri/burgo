import { Trans } from "@lingui/react/macro";
import Image from "next/image";
import NextLink from "next/link";
import { type ReactNode, Suspense } from "react";
import { Language } from "~/types/Language";
import { SearchForm, SearchFormFallback } from "./SearchForm";

type Props = {
  lang: Language;
  sideContent: ReactNode;
};

export function Header({ lang, sideContent }: Props) {
  return (
    <header className="bg-card text-card-foreground py-4">
      <nav className="container grid grid-cols-3 items-center justify-between gap-4">
        {/* Logo */}
        <div className="place-content-start max-lg:hidden">
          <NextLink
            className="focus-visible:ring-muted hover:bg-muted/20 rounded-full transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
            href={`/${lang}`}
          >
            <span className="sr-only">
              <Trans>Burgo</Trans>
            </span>
            <Image
              alt="Logo"
              height={40}
              src="/assets/icons/icon.svg"
              width={40}
            />
          </NextLink>
        </div>
        {/* Search */}
        <div className="flex place-content-center max-lg:col-span-3">
          <Suspense fallback={<SearchFormFallback />}>
            <SearchForm lang={lang} />
          </Suspense>
        </div>
        <div className="hidden place-content-end items-center gap-3 lg:flex">
          {sideContent}
        </div>
      </nav>
    </header>
  );
}
