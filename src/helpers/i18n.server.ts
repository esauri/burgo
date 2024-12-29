import "server-only";
import Negotiator from "negotiator";
import { cookies, headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALES,
  PREFERRED_LOCALE_COOKIE,
} from "~/constants/i18n";

export function getPreferredLocale(acceptLanguage: string | undefined) {
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages(LOCALES);

  const activeLocale = languages[0] || LOCALES[0] || DEFAULT_LOCALE;

  return activeLocale;
}

/**
 * Adds preferred local to path and redirects
 */
export async function redirectToLocalizedPath(
  path: string,
  type: "push" | "replace" = "push",
) {
  const cookieStore = await cookies();
  let preferredLang = cookieStore.get(PREFERRED_LOCALE_COOKIE)?.value;

  if (!preferredLang) {
    const headerStore = await headers();

    preferredLang = headerStore.get("accept-language") || undefined;
  }

  const locale = getPreferredLocale(preferredLang);

  const localizedPath = "/" + locale + path;

  redirect(localizedPath, RedirectType[type]);
}
