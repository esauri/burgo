import { Trans } from "@lingui/react/macro";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { MainContent } from "~/components/MainContent";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { getUser } from "~/usecases/auth";
import { initializeI18n } from "~/usecases/i18n";
import { LogoutForm } from "./_components/LogoutForm";

type Props = {
  params: Promise<{ lang: Language }>;
};

export default async function AccountPage(props: Props) {
  const [{ lang }] = await Promise.all([props.params, connection()]);

  try {
    const user = await getUser();

    initializeI18n(lang);

    return (
      <MainContent>
        <Text variant="title-lg">
          <Trans>Account</Trans>
        </Text>
        <Text variant="body-lg">
          <Trans>Welcome,</Trans> {user.user_metadata.displayName}
        </Text>
        <LogoutForm />
      </MainContent>
    );
  } catch {
    redirect(`/${lang}/login`);
  }
}
