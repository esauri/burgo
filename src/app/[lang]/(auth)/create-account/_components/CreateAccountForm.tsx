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
import { createAccountAction } from "../actions";

type Props = {
  lang: Language;
};

export function CreateAccountForm({ lang }: Props) {
  const [createAccountState, createAccount, isCreateAccountPending] =
    useActionState(createAccountAction, undefined);
  const { t } = useLingui();

  useEffect(() => {
    if (createAccountState) {
      toast.error(t(getErrorMessageFromCode(createAccountState.errorCode)));
    }
  }, [createAccountState, t]);

  return (
    <Card.Container>
      <Card.Header>
        <Card.Title className="text-2xl">
          <Trans>Create Account</Trans>
        </Card.Title>
        <Card.Description>
          <Trans>Enter your email and set a password to get started</Trans>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <form action={createAccount} className="flex flex-col gap-4">
          <fieldset
            disabled={isCreateAccountPending}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Text as="label" htmlFor="name" variant="label">
                <Trans>Name</Trans>
              </Text>
              <TextField
                autoComplete="name"
                id="name"
                name="name"
                placeholder={t`Your Name`}
                required
                type="text"
              />
              {createAccountState && createAccountState.fieldErrors?.name && (
                <Text className="text-destructive" variant="body-sm">
                  {createAccountState.fieldErrors.name}
                </Text>
              )}
            </div>
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
              {createAccountState && createAccountState.fieldErrors?.email && (
                <Text className="text-destructive" variant="body-sm">
                  {createAccountState.fieldErrors.email}
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
                autoComplete="new-password"
                id="password"
                name="password"
                required
                type="password"
              />
              {createAccountState &&
                createAccountState.fieldErrors?.password && (
                  <Text className="text-destructive" variant="body-sm">
                    {createAccountState.fieldErrors.password}
                  </Text>
                )}
            </div>
            <SubmitButton pending={isCreateAccountPending} variant="filled">
              <Trans>Create</Trans>
            </SubmitButton>
          </fieldset>
          <Text className="text-center" variant="body-sm">
            <Trans>Already have an account?</Trans>{" "}
            <Link href={`/${lang}/login`} variant="link">
              <Trans>Log in</Trans>
            </Link>
          </Text>
        </form>
      </Card.Content>
    </Card.Container>
  );
}
