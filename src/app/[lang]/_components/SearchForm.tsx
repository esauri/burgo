"use client";

import { useLingui } from "@lingui/react/macro";
import { debounce } from "es-toolkit/function";
import { LoaderIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  // type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useTransition,
} from "react";
import { TextField } from "~/components/TextField";
import { Language } from "~/types/Language";

type Props = {
  lang: Language;
};

export function SearchForm({ lang }: Props) {
  const { t } = useLingui();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const [isPending, startTransition] = useTransition();

  const onSearch = useCallback(
    (query: string) => {
      startTransition(() => {
        const q = query.trim().toLowerCase();
        const href = q ? `/${lang}?q=${q}` : `/${lang}`;

        push(href);
      });
    },
    [lang, push],
  );

  const onChange = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.trim().toLowerCase();

        if (query.length >= 2 || query.length === 0) {
          onSearch(query);
        }
      }, 500),
    [onSearch],
  );

  // const onKeyDown = useCallback(
  //   (event: KeyboardEvent<HTMLInputElement>) => {
  //     // If there is an existing query and the user presses backspace, clear the entire query
  //     if (event.code.toLowerCase() === "backspace" && currentQuery.length > 0) {
  //       event.currentTarget.value = "";
  //       push(`/${lang}`);
  //     }
  //   },
  //   [currentQuery, lang, push],
  // );

  const onReset = useCallback(() => {
    formRef.current?.reset();
  }, []);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const query = formData.get("q")?.toString() || "";

      inputRef.current?.blur();

      onSearch(query);
    },
    [onSearch],
  );

  return (
    <form
      action={`/${lang}`}
      ref={formRef}
      className="relative flex-1 lg:max-w-100"
      onSubmit={onSubmit}
    >
      <label className="relative flex w-full items-center">
        <SearchIcon className="absolute left-4 size-4 opacity-60" />
        <TextField
          key={`pages:${pathname}`}
          autoComplete="off"
          className="h-12 px-12"
          defaultValue={currentQuery}
          name="q"
          onChange={onChange}
          // onKeyDown={onKeyDown}
          placeholder={t`What are you hungry for?`}
          ref={inputRef}
          role="searchbox"
          type="search"
        />
        {isPending && (
          <LoaderIcon className="absolute right-6 size-4 animate-spin opacity-60" />
        )}
      </label>
      {currentQuery && !isPending && (
        <Link
          className="hover:bg-muted/20 absolute top-2 right-4 rounded-full p-2 opacity-60"
          href={`/${lang}`}
          onClick={onReset}
        >
          <span className="sr-only">{t`Clear search`}</span>
          <XIcon className="size-4" />
        </Link>
      )}
    </form>
  );
}

export function SearchFormFallback() {
  const { t } = useLingui();

  return (
    <label className="relative flex flex-1 items-center lg:max-w-100">
      <SearchIcon className="absolute left-4 size-4 opacity-60" />
      <TextField
        autoComplete="off"
        className="h-12 px-12"
        disabled
        name="q"
        placeholder={t`What are you hungry for?`}
        role="searchbox"
        type="search"
      />
    </label>
  );
}
