import { Trans } from "@lingui/react/macro";
import { Card } from "~/components/Card";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { CreateAccountForm } from "./_components/CreateAccountForm";

type Props = {
  params: Promise<{
    lang: Language;
  }>;
};

export default async function CreateAccountPage(props: Props) {
  const { lang } = await props.params;
  initializeI18n(lang);

  return (
    <Card.Container>
      <Card.Header>
        <Text as="h1" variant="title">
          <Trans>Create Account</Trans>
        </Text>
        <Card.Description>
          <Trans>Enter your email and set a password to get started</Trans>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <CreateAccountForm lang={lang} />
      </Card.Content>
    </Card.Container>
  );
}
