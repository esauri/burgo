"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "~/components/Card";
import { Link, SubmitButton } from "~/components/Pressable";
import { Text } from "~/components/Text";
import { TextField } from "~/components/TextField";
import { getErrorMessageFromCode } from "~/helpers/errors";
import { Language } from "~/types/Language";
import { loginAction } from "../actions";

type Props = {
  lang: Language;
};

export function LoginForm({ lang }: Props) {
  const [loginState, login, isLoginPending] = useActionState(
    loginAction,
    undefined,
  );
  const { t } = useLingui();

  useEffect(() => {
    if (loginState) {
      toast.error(t(getErrorMessageFromCode(loginState.errorCode)));
    }
  }, [loginState, t]);

  return (
    <Card.Container>
      <Card.Header>
        <Card.Title className="text-2xl">
          <Trans>Log in</Trans>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <form action={login} className="flex flex-col gap-4">
          <fieldset disabled={isLoginPending} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Text as="label" htmlFor="email" variant="label">
                <Trans>Email</Trans>
              </Text>
              <TextField
                autoComplete="email"
                id="email"
                name="email"
                placeholder={t`you@example.com`}
                required
                type="email"
              />
              {loginState && loginState.fieldErrors?.email && (
                <Text className="text-destructive" variant="body-sm">
                  {loginState.fieldErrors.email}
                </Text>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Text as="label" htmlFor="password" variant="label">
                  <Trans>Password</Trans>
                </Text>
              </div>
              <TextField
                autoComplete="current-password"
                id="password"
                name="password"
                required
                type="password"
              />
              {loginState && loginState.fieldErrors?.password && (
                <Text className="text-destructive" variant="body-sm">
                  {loginState.fieldErrors.password}
                </Text>
              )}
            </div>
            <SubmitButton pending={isLoginPending} variant="filled">
              <Trans>Log in</Trans>
            </SubmitButton>
          </fieldset>
          <Text className="text-center" variant="body-sm">
            <Trans>Don&rsquo;t have an account?</Trans>{" "}
            <Link href={`/${lang}/create-account`} variant="link">
              <Trans>Create Account</Trans>
            </Link>
          </Text>
        </form>
      </Card.Content>
    </Card.Container>
  );
}
