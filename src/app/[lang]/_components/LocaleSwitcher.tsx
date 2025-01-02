"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { GlobeIcon, LoaderIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  type MouseEvent,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/Dropdown";
import { Button } from "~/components/Pressable";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { LOCALES } from "~/constants/i18n";
import { getErrorMessageFromCode } from "~/helpers/errors";
import type { Language } from "~/types/Language";
import { changeLocaleAction } from "../actions";

type Props = {
  lang: Language;
};

export function LocaleSwitcher({ lang: _lang }: Props) {
  const [changeLocaleState, changeLocale, isChangeLocalePending] =
    useActionState(changeLocaleAction, undefined);
  const [lang, updateLang] = useOptimistic(
    _lang,
    (_: string, newLocale: string) => newLocale,
  );
  const { t } = useLingui();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const formAction = (formData: FormData) => {
    const locale = formData.get("locale")?.toString() || "";

    setOpen(false);
    updateLang(locale);
    changeLocale(formData);
  };

  const handleStopPropagation = (event: MouseEvent) => event.stopPropagation();

  useEffect(() => {
    if (
      changeLocaleState &&
      changeLocaleState.status === FORM_STATE_STATUS.ERROR
    ) {
      toast.error(t(getErrorMessageFromCode(changeLocaleState.errorCode)));
    }
  }, [changeLocaleState, t]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {isChangeLocalePending ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <GlobeIcon className="size-4" />
          )}
          {lang}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <form action={formAction}>
          <DropdownMenuLabel>
            <Trans>Choose Language</Trans>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <input
            name="href"
            readOnly
            type="hidden"
            value={pathname.replace(`/${lang}`, "")}
          />
          {LOCALES.map((locale) => (
            <DropdownMenuItem key={`locales:${locale}`} className="grid p-0">
              <Button
                aria-selected={locale === lang}
                name="locale"
                onClick={handleStopPropagation}
                type="submit"
                value={locale}
                variant="ghost"
              >
                {locale}
              </Button>
            </DropdownMenuItem>
          ))}
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
