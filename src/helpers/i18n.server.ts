import "server-only";
import Negotiator from "negotiator";
import { DEFAULT_LOCALE, LOCALES } from "~/constants/i18n";

export function getPreferredLocale(acceptLanguage: string | undefined) {
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages(LOCALES);

  const activeLocale = languages[0] || LOCALES[0] || DEFAULT_LOCALE;

  return activeLocale;
}
