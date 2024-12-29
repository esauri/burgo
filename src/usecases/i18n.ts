import "server-only";
import { I18n, Messages, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { DEFAULT_LOCALE, LOCALES } from "~/constants/i18n";
import type { Language } from "~/types/Language";

async function loadCatalog(
  locale: Language,
): Promise<Array<[Language, Messages]>> {
  const { messages } = await import(`../locales/${locale}.po`);

  return [locale, messages];
}

const catalogs = await Promise.all(LOCALES.map(loadCatalog));

const allMessages = Object.fromEntries(catalogs);

type AllI18nInstances = Record<Language, I18n>;

const allI18nInstances: AllI18nInstances = LOCALES.reduce(
  (acc: AllI18nInstances, locale) => {
    const messages = allMessages[locale] ?? {};

    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages },
    });

    acc[locale] = i18n;

    return acc;
  },
  {} as AllI18nInstances,
);

export function getI18nInstance(locale: Language): I18n {
  if (!allI18nInstances[locale]) {
    console.warn(`No i18n instance found for locale "${locale}"`);
  }

  return allI18nInstances[locale]! || allI18nInstances[DEFAULT_LOCALE]!;
}

export function initializeI18n(lang: Language) {
  const i18n = getI18nInstance(lang);

  // Make it available server-side for the current request (uses cache underneath)
  setI18n(i18n);

  return i18n;
}
