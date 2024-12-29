import { Trans } from "@lingui/react/macro";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { LoginForm } from "./_components/LoginForm";

type Props = {
  params: Promise<{
    lang: Language;
  }>;
};

export default async function LoginPage(props: Props) {
  const { lang } = await props.params;
  initializeI18n(lang);

  return (
    <>
      <Text className="sr-only" variant="title-lg">
        <Trans>Log in</Trans>
      </Text>
      <LoginForm lang={lang} />
    </>
  );
}
