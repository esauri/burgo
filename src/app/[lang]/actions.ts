"use server";

import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { redirectToLocalizedPath } from "~/helpers/i18n.server";
import type { ErrorCode } from "~/types/Error";
import type { FormStateStatus } from "~/types/FormState";
import { setPreferredLocale } from "~/usecases/locale";
import linguiConfig from "../../../lingui.config";

type ChangeLocaleFormState = {
  errorCode: ErrorCode;
  message: string;
  status: Extract<FormStateStatus, "ERROR">;
};

export async function changeLocaleAction(
  _formState: ChangeLocaleFormState | undefined,
  formData: FormData,
) {
  const href = formData.get("href")?.toString() || "/";
  const locale = formData.get("locale")?.toString() || "";

  if (!linguiConfig.locales.includes(locale)) {
    console.warn("[changeLocaleAction] error parsing form data %j", locale);

    return {
      errorCode: ERROR_CODE.LOCALE_NOT_SUPPORTED,
      message: "Unable to change locale",
      status: FORM_STATE_STATUS.ERROR,
    };
  }

  let redirectUrl: string | undefined;

  try {
    await setPreferredLocale(locale);

    redirectUrl = href;
  } catch (error) {
    console.error("[changeLocaleAction] error changing locale %j", error);

    return {
      errorCode: ERROR_CODE.CHANGE_LOCALE_ERROR,
      message: "Unable to change locale",
      status: FORM_STATE_STATUS.ERROR,
    };
  } finally {
    if (redirectUrl) {
      await redirectToLocalizedPath(redirectUrl, "replace");
    }
  }
}
