import { t } from "@lingui/core/macro";
import { Geist } from "next/font/google";
import { type ReactNode } from "react";
import { LOCALES } from "~/constants/i18n";
import type { Language } from "~/types/Language";
import { getI18nInstance, initializeI18n } from "~/usecases/i18n";
import { I18nProvider } from "./_components/I18nProvider";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const experimental_ppr = true;

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ lang: Language }>;
}>;

export async function generateMetadata(props: Props) {
  const { lang } = await props.params;

  const i18n = getI18nInstance(lang);

  return {
    title: t(i18n)`Burgo`,
    description: t(i18n)`Custom built hamburgers`,
    icons: {
      apple: "/assets/icons/apple-touch-icon.png",
      icon: "/assets/icons/icon.svg",
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function RootLayout(props: Props) {
  const { lang } = await props.params;
  const i18n = initializeI18n(lang);
  const { children } = props;

  return (
    <html className={geistSans.variable} dir="ltr" lang={lang}>
      <body>
        <I18nProvider locale={lang} messages={i18n.messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
