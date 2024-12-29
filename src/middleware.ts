import { type NextRequest, NextResponse } from "next/server";
import { LOCALES, PREFERRED_LOCALE_COOKIE } from "~/constants/i18n";
import { getPreferredLocale } from "~/helpers/i18n.server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let locale: string | undefined = getPathLocale(pathname);

  if (!locale) {
    const cookieLocale = request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value;
    const headerLocale = request.headers.get("accept-language") || undefined;

    locale = getPreferredLocale(cookieLocale || headerLocale);

    request.nextUrl.pathname = "/" + locale + pathname;

    return NextResponse.redirect(request.nextUrl);
  }
}

// #region I18n Helpers
function getPathLocale(pathname: string) {
  return LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
}
// #endregion

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - assets (assets)
     * - _next (internal paths)
     * - manifest.webmanifest
     */
    "/((?!assets|_next|manifest.webmanifest).*)",
  ],
};
