import { Trans } from "@lingui/react/macro";
import { UserIcon } from "lucide-react";
import NextLink from "next/link";
import { connection } from "next/server";
import { Text } from "~/components/Text";
import { Language } from "~/types/Language";
import type { User } from "~/types/User";

type Props = {
  authPromise: Promise<User>;
  lang: Language;
};

export async function AuthMenu({ authPromise, lang }: Props) {
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

export function AuthMenuFallback() {
  return (
    <Text variant="body-lg" className="px-3 py-2">
      <Trans>Get Started</Trans>
    </Text>
  );
}
