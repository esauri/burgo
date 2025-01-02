import { Trans } from "@lingui/react/macro";
import { UserIcon } from "lucide-react";
import NextLink from "next/link";
import { connection } from "next/server";
import { Link } from "~/components/Pressable";
import { Language } from "~/types/Language";
import type { User } from "~/types/User";
import { Tab } from "./Tab";

type Props = {
  authPromise: Promise<User>;
  lang: Language;
};

export async function AuthHeaderLink({ authPromise, lang }: Props) {
  await connection();

  try {
    await authPromise;

    return (
      <NextLink
        className="focus-visible:ring-muted hover:bg-muted/20 rounded-full p-2 transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
        href={`/${lang}/account`}
      >
        <span className="sr-only">
          <Trans>Got to Account</Trans>
        </span>
        <UserIcon className="size-6" />
      </NextLink>
    );
  } catch {
    return <AuthHeaderLinkFallback lang={lang} />;
  }
}

export function AuthHeaderLinkFallback({ lang }: Pick<Props, "lang">) {
  return (
    <Link href={`/${lang}/create-account`} variant="ghost">
      <Trans>Get Started</Trans>
    </Link>
  );
}

export async function AuthTab({ authPromise, lang }: Props) {
  await connection();

  try {
    await authPromise;

    return (
      <Tab href={`/${lang}/account`} prefetch>
        <span className="sr-only">
          <Trans>Got to Account</Trans>
        </span>
        <UserIcon className="size-6 active:scale-90" />
      </Tab>
    );
  } catch {
    return <AuthTabFallback lang={lang} />;
  }
}

export function AuthTabFallback({ lang }: Pick<Props, "lang">) {
  return (
    <Tab href={`/${lang}/create-account`} prefetch>
      <span className="sr-only">
        <Trans>Go to Create Account</Trans>
      </span>
      <UserIcon className="size-6 active:scale-90" />
    </Tab>
  );
}
