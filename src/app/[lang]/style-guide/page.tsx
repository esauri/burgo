import { t } from "@lingui/core/macro";
import { ShoppingCartIcon } from "lucide-react";
import { MainContent } from "~/components/MainContent";
import { Button, Link } from "~/components/Pressable";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";

type Props = {
  params: Promise<{
    lang: Language;
  }>;
};

export default async function StyleGuide(props: Props) {
  const { lang } = await props.params;
  const i18n = initializeI18n(lang);

  return (
    <MainContent>
      <Text variant="title-lg">{i18n._(t`Title Large`)}</Text>
      <Text variant="title">{i18n._(t`Title`)}</Text>
      <Text variant="title-sm">{i18n._(t`Title Small`)}</Text>
      <Text variant="body-lg">{i18n._(t`Body Large`)}</Text>
      <Text variant="body">{i18n._(t`Body`)}</Text>
      <Text variant="body-sm">{i18n._(t`Body Small`)}</Text>
      <Text variant="label">{i18n._(t`Label`)}</Text>
      <section className="flex flex-col gap-3 md:flex-row">
        <Button variant="filled">{i18n._(t`Filled Button`)}</Button>
        <Button variant="outline">{i18n._(t`Outline Button`)}</Button>
        <Button variant="ghost">{i18n._(t`Ghost Button`)}</Button>
        <Button variant="destructive">{i18n._(t`Destructive Button`)}</Button>
        <Button variant="icon">
          <ShoppingCartIcon className="size-4" />
        </Button>
        <Button variant="link">{i18n._(t`Link Button`)}</Button>
      </section>
      <section className="flex flex-col gap-3 md:flex-row">
        <Button disabled variant="filled">
          {i18n._(t`Filled Button`)}
        </Button>
        <Button disabled variant="outline">
          {i18n._(t`Outline Button`)}
        </Button>
        <Button disabled variant="ghost">
          {i18n._(t`Ghost Button`)}
        </Button>
        <Button disabled variant="destructive">
          {i18n._(t`Destructive Button`)}
        </Button>
        <Button disabled variant="icon">
          <ShoppingCartIcon className="size-4" />
        </Button>
        <Button disabled variant="link">
          {i18n._(t`Link Button`)}
        </Button>
      </section>
      <section className="flex flex-col gap-3 md:flex-row">
        <Link href="#0" variant="filled">
          {i18n._(t`Filled Link`)}
        </Link>
        <Link href="#0" variant="outline">
          {i18n._(t`Outline Link`)}
        </Link>
        <Link href="#0" variant="ghost">
          {i18n._(t`Ghost Link`)}
        </Link>
        <Link href="#0" variant="destructive">
          {i18n._(t`Destructive Link`)}
        </Link>
        <Link href="#0" variant="icon">
          <ShoppingCartIcon className="size-4" />
        </Link>
        <Link href="#0" variant="link">
          {i18n._(t`Link Link`)}
        </Link>
      </section>
    </MainContent>
  );
}
