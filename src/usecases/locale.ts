import "server-only";
import { cookies } from "next/headers";
import { config } from "~/config/server";
import { PREFERRED_LOCALE_COOKIE } from "~/constants/i18n";

const { COOKIE_STORAGE_DOMAIN } = config;

export async function setPreferredLocale(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set(PREFERRED_LOCALE_COOKIE, locale, {
    domain: COOKIE_STORAGE_DOMAIN,
    httpOnly: true,
    maxAge: 86400 * 365,
    sameSite: "strict",
    secure: true,
  });

  return true;
}
