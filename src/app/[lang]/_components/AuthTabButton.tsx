import { Trans } from "@lingui/react/macro";
import { UserIcon } from "lucide-react";
import { connection } from "next/server";
import { Language } from "~/types/Language";
import type { User } from "~/types/User";
import { TabButton } from "./TabButton";

type Props = {
  authPromise: Promise<User>;
  lang: Language;
};

export async function AuthTabButton({ authPromise, lang }: Props) {
  await connection();

  try {
    await authPromise;

    return (
      <TabButton href={`/${lang}/account`}>
        <span className="sr-only">
          <Trans>Got to Account</Trans>
        </span>
        <UserIcon className="size-6 active:scale-90" />
      </TabButton>
    );
  } catch {
    return (
      <TabButton href={`/${lang}/create-account`}>
        <span className="sr-only">
          <Trans>Go to Create Account</Trans>
        </span>
        <UserIcon className="size-6 active:scale-90" />
      </TabButton>
    );
  }
}

export function AuthTabButtonFallback() {
  return (
    <TabButton href="#0">
      <span className="sr-only">
        <Trans>Go to Create Account</Trans>
      </span>
      <UserIcon className="size-6 active:scale-90" />
    </TabButton>
  );
}
