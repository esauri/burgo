"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { SubmitButton } from "~/components/Pressable";
import { getErrorMessageFromCode } from "~/helpers/errors";
import { logoutAction } from "../actions";

export function LogoutForm() {
  const [logoutState, logout, isLogoutPending] = useActionState(
    logoutAction,
    undefined,
  );
  const { t } = useLingui();

  useEffect(() => {
    if (logoutState) {
      toast.error(t(getErrorMessageFromCode(logoutState.errorCode)));
    }
  }, [logoutState, t]);

  return (
    <form action={logout}>
      <SubmitButton pending={isLogoutPending} variant="destructive">
        <Trans>Logout</Trans>
      </SubmitButton>
    </form>
  );
}
