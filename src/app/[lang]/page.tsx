import { t } from "@lingui/core/macro";
import { MainContent } from "~/components/MainContent";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";

type Props = {
  params: Promise<{
    lang: Language;
  }>;
};

export default async function Home(props: Props) {
  const { lang } = await props.params;
  const i18n = initializeI18n(lang);

  return (
    <MainContent>
      <h1>{t(i18n)`Burgo Hamburgers`}</h1>
    </MainContent>
  );
}
