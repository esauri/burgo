"use client";

import { type Messages, setupI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { type ReactNode, useState } from "react";
import type { Language } from "~/types/Language";

type Props = {
  children: ReactNode;
  locale: Language;
  messages: Messages;
};

export function I18nProvider({ children, locale, messages }: Props) {
  const [i18n] = useState(() => {
    return setupI18n({
      locale,
      messages: { [locale]: messages },
    });
  });

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}
