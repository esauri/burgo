import { Trans } from "@lingui/react/macro";
import { UserIcon } from "lucide-react";
import NextLink from "next/link";
import { connection } from "next/server";
import { Text } from "~/components/Text";
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
    return (
      <Text
        as={NextLink}
        variant="body-lg"
        className="focus-visible:ring-muted hover:bg-muted/20 rounded-sm px-3 py-2 transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
        href={`/${lang}/create-account`}
      >
        <Trans>Get Started</Trans>
      </Text>
    );
  }
}

export function AuthHeaderLinkFallback() {
  return (
    <Text variant="body-lg" className="px-3 py-2">
      <Trans>Get Started</Trans>
    </Text>
  );
}

export async function AuthTab({ authPromise, lang }: Props) {
  await connection();

  try {
    await authPromise;

    return (
      <Tab href={`/${lang}/account`}>
        <span className="sr-only">
          <Trans>Got to Account</Trans>
        </span>
        <UserIcon className="size-6 active:scale-90" />
      </Tab>
    );
  } catch {
    return (
      <Tab href={`/${lang}/create-account`}>
        <span className="sr-only">
          <Trans>Go to Create Account</Trans>
        </span>
        <UserIcon className="size-6 active:scale-90" />
      </Tab>
    );
  }
}

export function AuthTabFallback() {
  return (
    <Tab href="#0">
      <span className="sr-only">
        <Trans>Go to Create Account</Trans>
      </span>
      <UserIcon className="size-6 active:scale-90" />
    </Tab>
  );
}
