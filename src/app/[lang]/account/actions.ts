"use server";

import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { InternalError } from "~/helpers/errors";
import { redirectToLocalizedPath } from "~/helpers/i18n.server";
import { logout } from "~/usecases/auth";

export async function logoutAction() {
  let redirectUrl: string | undefined;

  try {
    await logout();

    redirectUrl = "/";
  } catch (error) {
    console.error("[logout] error logging out %j", error);

    const errorCode =
      error instanceof InternalError ? error.code : ERROR_CODE.LOGOUT_ERROR;

    const message =
      error instanceof Error ? error.message : "Unable to log out";

    return {
      errorCode,
      message,
      status: FORM_STATE_STATUS.ERROR,
    };
  } finally {
    if (redirectUrl) {
      await redirectToLocalizedPath(redirectUrl, "replace");
    }
  }
}
