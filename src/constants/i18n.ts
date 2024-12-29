import type { Language } from "~/types/Language";
import linguiConfig from "../../lingui.config";

export const DEFAULT_LOCALE = "en" as const;

export const LOCALES: Language[] = linguiConfig.locales;

export const PREFERRED_LOCALE_COOKIE = "locale";
