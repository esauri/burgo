import { msg } from "@lingui/core/macro";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import { config } from "~/config/server";
import { DEFAULT_LOCALE, LOCALES } from "~/constants/i18n";
import type { Language } from "~/types/Language";
import { getUser } from "~/usecases/auth";
import { getI18nInstance, initializeI18n } from "~/usecases/i18n";
import { AuthMenu, AuthMenuFallback } from "./_components/AuthMenu";
import {
  AuthTabButton,
  AuthTabButtonFallback,
} from "./_components/AuthTabButton";
import { Header } from "./_components/Header";
import { I18nProvider } from "./_components/I18nProvider";
import { TabBar } from "./_components/TabBar";
import "./globals.css";

const { SITE_URL } = config;

const geistSans = Geist({
  display: "swap",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const experimental_ppr = true;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: [
    {
      color: "#212121",
      media: "(prefers-color-scheme: dark)",
    },
    {
      color: "#ffffff",
      media: "(prefers-color-scheme: light)",
    },
  ],
  viewportFit: "cover",
  width: "device-width",
};

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ lang: Language }>;
}>;

export async function generateMetadata(props: Props) {
  const { lang } = await props.params;

  const i18n = getI18nInstance(lang);

  return {
    alternates: {
      canonical: `/${DEFAULT_LOCALE}`,
      languages: Object.fromEntries(
        LOCALES.filter((lang) => lang !== DEFAULT_LOCALE).map((lang) => [
          lang,
          lang,
        ]),
      ),
    },
    description: i18n._(msg`Custom built hamburgers`),
    icons: {
      apple: "/assets/icons/apple-touch-icon.png",
      icon: "/assets/icons/icon.svg",
    },
    manifest: "/manifest.webmanifest",
    metadataBase: new URL(SITE_URL),
    title: {
      default: i18n._(msg`Burgo`),
      template: i18n._(msg`'%s | Burgo`),
    },
  };
}

export default async function RootLayout(props: Props) {
  const { lang } = await props.params;
  const authPromise = getUser();
  const i18n = initializeI18n(lang);
  const { children } = props;

  return (
    <html className={geistSans.variable} dir="ltr" lang={lang}>
      <body className="bg-background text-foreground antialiased max-lg:pb-15">
        <I18nProvider locale={lang} messages={i18n.messages}>
          <Header
            authItem={
              <Suspense fallback={<AuthMenuFallback />}>
                <AuthMenu authPromise={authPromise} lang={lang} />
              </Suspense>
            }
            lang={lang}
          />
          {children}
          <TabBar
            authItem={
              <Suspense fallback={<AuthTabButtonFallback />}>
                <AuthTabButton authPromise={authPromise} lang={lang} />
              </Suspense>
            }
            lang={lang}
          />
          <Toaster richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
