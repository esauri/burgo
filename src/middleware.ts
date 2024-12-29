import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { config as configuration } from "~/config/server";
import { LOCALES, PREFERRED_LOCALE_COOKIE } from "~/constants/i18n";
import { getPreferredLocale } from "~/helpers/i18n.server";

const { SUPABASE_ANON_KEY, SUPABASE_URL } = configuration;

export async function middleware(request: NextRequest) {
  // 1. Ensure that the user is in a locale
  const { pathname } = request.nextUrl;

  let locale: string | undefined = getPathLocale(pathname);

  // 1.1 Redirect if there is no locale E.g. /cart -> /en/cart
  if (!locale) {
    const cookieLocale = request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value;
    const headerLocale = request.headers.get("accept-language") || undefined;

    locale = getPreferredLocale(cookieLocale || headerLocale);

    request.nextUrl.pathname = "/" + locale + pathname;

    return NextResponse.redirect(request.nextUrl);
  }

  // 2. Ensure the user session is up to date
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2.1 If unauthenticated user is accessing protected routes, redirect to login
  if (!user && isProtectedRoute(pathname, locale)) {
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}/login`;

    return NextResponse.redirect(url);
  }

  // 2.2 If authenticated user is accessing login or create account, redirect to account
  if (user && isUnauthenticatedRoute(pathname, locale)) {
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}/account`;

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// #region Auth Helpers
const PROTECTED_ROUTES = ["/account"];
const UNAUTHENTICATED_ROUTES = ["/login", "/create-account"];

function isProtectedRoute(pathname: string, locale: string) {
  const path = pathname.replace(`/${locale}`, "");

  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

function isUnauthenticatedRoute(pathname: string, locale: string) {
  const path = pathname.replace(`/${locale}`, "");

  return UNAUTHENTICATED_ROUTES.some((route) => path.startsWith(route));
}
// #endregion

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
