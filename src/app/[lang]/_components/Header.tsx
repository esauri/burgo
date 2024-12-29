import { Trans, useLingui } from "@lingui/react/macro";
import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { TextField } from "~/components/TextField";
import { Language } from "~/types/Language";

type Props = {
  lang: Language;
};

export function Header({ lang }: Props) {
  const { t } = useLingui();

  return (
    <header className="bg-card text-card-foreground py-4">
      <nav className="container flex items-center justify-between gap-4">
        {/* Logo */}
        <NextLink
          className="focus-visible:ring-muted hover:bg-muted/20 rounded-full transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 max-lg:hidden"
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
        {/* Search */}
        <label className="relative flex flex-1 items-center lg:max-w-100">
          <SearchIcon className="absolute left-4 size-4 opacity-60" />
          <TextField
            autoComplete="off"
            className="h-12 pl-12"
            placeholder={t`What are you hungry for?`}
            name="search"
            type="search"
            role="searchbox"
          />
        </label>
        <div className="hidden items-center gap-3 lg:flex">
          {/* Cart */}
          <NextLink
            className="focus-visible:ring-muted hover:bg-muted/20 rounded-full p-2 transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
            href="#0"
          >
            <span className="sr-only">
              <Trans>View Cart</Trans>
            </span>
            <ShoppingCartIcon className="size-6" />
          </NextLink>
        </div>
      </nav>
    </header>
  );
}
